from fastapi import APIRouter, Depends, UploadFile, File, Query, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
import uuid
import time
from datetime import datetime
import os
import shutil

from ..database import db, models
from ..services.verification import process_event_verification
from ..services.correlation import get_cross_event_insights
import sys
# Add workspace root to sys.path for importing ai package absolutely
BASE_DIR_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if BASE_DIR_ROOT not in sys.path:
    sys.path.append(BASE_DIR_ROOT)

from ai.inference.detect import run_inference, get_model_status


router = APIRouter(prefix="/api")

DEMO_LOCATION_COORDINATES = {
    "Tambaram Main Road": (12.9229, 80.1275),
    "Guindy Junction": (13.0067, 80.2206),
    "Koyambedu Roundabout": (13.0694, 80.2030),
    "Anna Nagar": (13.0850, 80.2100),
    "T. Nagar": (13.0405, 80.2337),
    "Velachery": (12.9780, 80.2180),
}

# Connected units are intentionally process-local for the prototype. The existing
# SQLite-backed demo fleet remains untouched.
connected_units = {}


class BusConnectionRequest(BaseModel):
    bus_id: str
    registration_number: str
    route: str
    camera_node: str
    location: str


def connected_unit_marker(bus):
    latitude, longitude = DEMO_LOCATION_COORDINATES[bus["location"]]
    return {
        "id": bus["bus_id"],
        "type": "active_bus",
        "title": f"Active Bus: {bus['bus_id']} ({bus['route']})",
        "coordinates": [latitude, longitude],
        "severity": "GREEN",
        "busId": bus["bus_id"],
        "route": bus["route"],
        "camera": bus["camera_node"],
        "location": bus["location"],
        "gpsStatus": bus["gps_status"],
        "edgeAiStatus": bus["edge_ai_status"],
        "status": bus["status"],
    }

# Ensure temporary upload folder exists
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/health")
def get_health(database: Session = Depends(db.get_db)):
    try:
        # Check SQLite connectivity
        database.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": f"error: {str(e)}"}

@router.get("/model-info")
def get_model_info():
    is_available, path = get_model_status()
    return {
        "model_available": is_available,
        "model_architecture": "YOLOv8 Nano",
        "weights_path": path,
        "input_size": [640, 640],
        "device": "CPU"
    }

@router.post("/predict")
async def predict_frame(
    image: UploadFile = File(...), 
    confidence_threshold: float = Query(0.60, ge=0.50, le=0.95),
    db_session: Session = Depends(db.get_db)
):
    """
    Receives an uploaded frame, runs YOLO inference (if model exists),
    logs the event to the SQLite database, and clusters observations.
    """
    start_time = time.time()
    
    # Save upload to temp file
    temp_filename = f"frame_{str(uuid.uuid4())[:8]}_{image.filename}"
    temp_path = os.path.join(UPLOAD_DIR, temp_filename)
    
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # Perform YOLO Inference
    result = run_inference(temp_path, confidence_threshold)
    processing_time_ms = int((time.time() - start_time) * 1000)

    if not result["success"]:
        # Clean up temp image
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        if not result["model_available"]:
            # Standard model unavailable JSON contract
            return {
                "success": False,
                "model_available": False,
                "error": result["error"],
                "processing_time_ms": processing_time_ms
            }
        raise HTTPException(status_code=400, detail=result["error"])

    detections = result["detections"]
    logged_events = []

    # Log detected events to SQLite database
    for d in detections:
        event_id = f"EVT-{str(uuid.uuid4())[:6].upper()}"
        timestamp_str = datetime.now().isoformat()
        
        # Default mock coordinates (Guindy center)
        lat, lon = 13.0067, 80.2206
        
        # Set specific coordinates if waterlogging is detected
        if d["incident"] == "waterlogging":
            lat, lon = 12.9229, 80.1275 # Tambaram
            
        new_event = models.Event(
            event_id=event_id,
            bus_id="BUS-101", # Assume upload comes from front cam of BUS-101
            route_id="21G",
            incident_type=d["incident"],
            confidence=int(d["confidence"] * 100),
            severity=d["severity"],
            latitude=lat,
            longitude=lon,
            timestamp=timestamp_str,
            evidence_image=result["annotated_image_path"] or temp_path,
            status="OBSERVED"
        )
        
        db_session.add(new_event)
        db_session.commit()
        db_session.refresh(new_event)
        
        # Run Multi-Bus spatial verification clustering immediately
        process_event_verification(db_session, new_event)
        logged_events.append(new_event.event_id)

    return {
        "success": True,
        "model_available": True,
        "detections": detections,
        "logged_event_ids": logged_events,
        "processing_time_ms": processing_time_ms
    }

@router.get("/events")
def list_events(db_session: Session = Depends(db.get_db)):
    events = db_session.query(models.Event).order_by(models.Event.timestamp.desc()).all()
    return events

@router.get("/events/{id}")
def get_event(id: str, db_session: Session = Depends(db.get_db)):
    event = db_session.query(models.Event).filter(models.Event.event_id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Observation event not found.")
    return event

@router.get("/alerts")
def list_alerts(db_session: Session = Depends(db.get_db)):
    alerts = db_session.query(models.Alert).order_by(models.Alert.time.desc()).all()
    return alerts

@router.get("/buses")
def list_buses(db_session: Session = Depends(db.get_db)):
    buses = db_session.query(models.Bus).all()
    result = [
        {
            "bus_id": bus.id,
            "route": bus.route_id,
            "coordinates": [bus.latitude, bus.longitude],
            "status": bus.status.upper(),
            "source": "demo",
        }
        for bus in buses
    ]
    return result + list(connected_units.values())


@router.post("/buses/connect")
def connect_bus(payload: BusConnectionRequest, db_session: Session = Depends(db.get_db)):
    bus_id = payload.bus_id.strip().upper()
    if not bus_id or db_session.query(models.Bus).filter(models.Bus.id == bus_id).first() or bus_id in connected_units:
        return {"success": False, "error": "Bus ID already connected"}
    if payload.location not in DEMO_LOCATION_COORDINATES:
        raise HTTPException(status_code=422, detail="Select a valid Chennai demo location.")

    bus = {
        "bus_id": bus_id,
        "registration_number": payload.registration_number.strip(),
        "route": payload.route.strip(),
        "camera_node": payload.camera_node.strip(),
        "location": payload.location,
        "status": "ACTIVE",
        "gps_status": "CONNECTED",
        "camera_status": "CONNECTED",
        "edge_ai_status": "READY",
        "source": "connected",
    }
    connected_units[bus_id] = bus
    return {"success": True, "message": "Bus connected successfully", "bus": bus}


@router.post("/buses/{bus_id}/disconnect")
def disconnect_bus(bus_id: str):
    bus = connected_units.get(bus_id.strip().upper())
    if not bus:
        raise HTTPException(status_code=404, detail="Connected bus not found.")
    bus.update({"status": "DISCONNECTED", "gps_status": "OFFLINE", "camera_status": "OFFLINE", "edge_ai_status": "OFFLINE"})
    return {"success": True, "message": "Bus disconnected", "bus": bus}

@router.get("/analytics")
def get_analytics_metrics(db_session: Session = Depends(db.get_db)):
    # Count verified alert types in DB
    accidents_count = db_session.query(models.Alert).filter(models.Alert.incident_type == "accident").count()
    safety_count = db_session.query(models.Alert).filter(models.Alert.incident_type == "safety").count()
    delays_count = db_session.query(models.Alert).filter(models.Alert.incident_type == "delay").count()
    waterlogging_count = db_session.query(models.Alert).filter(models.Alert.incident_type == "waterlogging").count()

    # Get active fleets counts
    active_buses = db_session.query(models.Bus).filter(models.Bus.status == "active").count()
    route_buses = db_session.query(models.Bus).filter(models.Bus.status == "on_route").count()
    delayed_buses = db_session.query(models.Bus).filter(models.Bus.status == "delayed").count()
    idle_buses = db_session.query(models.Bus).filter(models.Bus.status == "idle").count()

    # Pre-populate default values if DB is empty (First load)
    metrics = {
        "accidentRiskZonesCount": max(accidents_count, 1),
        "activeSafetyAlertsCount": max(safety_count, 1),
        "recurringDelayHotspotsCount": max(delays_count, 1),
        "persistentWaterloggingCount": max(waterlogging_count, 1),
        "fleet": {
            "active": (active_buses if active_buses else 121) + sum(bus["status"] == "ACTIVE" for bus in connected_units.values()),
            "onRoute": route_buses if route_buses else 95,
            "delayed": delayed_buses if delayed_buses else 15,
            "idle": idle_buses if idle_buses else 11
        },
        "cross_event_insights": get_cross_event_insights(db_session)
    }
    return metrics

@router.get("/map-events")
def get_map_events(db_session: Session = Depends(db.get_db)):
    """
    Returns alerts and buses formatted for Leaflet map markers
    """
    markers = []
    
    # 1. Fetch aggregated verified alerts
    alerts = db_session.query(models.Alert).all()
    for alert in alerts:
        markers.append({
            "id": alert.id,
            "type": alert.incident_type,
            "title": f"{alert.incident_type.title()}: {alert.location}",
            "coordinates": [alert.latitude, alert.longitude],
            "severity": alert.severity
        })
        
    # 2. Fetch buses
    buses = db_session.query(models.Bus).all()
    for bus in buses:
        markers.append({
            "id": bus.id,
            "type": "active_bus",
            "title": f"Active Bus: {bus.id} ({bus.route_id})",
            "coordinates": [bus.latitude, bus.longitude],
            "severity": "GREEN"
        })

    for bus in connected_units.values():
        if bus["status"] == "ACTIVE":
            markers.append(connected_unit_marker(bus))
        
    # If database is completely empty, supply default bootstrap markers
    if not markers:
        markers = [
            {"id": "m1", "type": "accident", "title": "Accident Risk: Guindy Junction", "coordinates": [13.0067, 80.2206], "severity": "HIGH"},
            {"id": "m2", "type": "waterlogging", "title": "Waterlogging: Tambaram Main Road", "coordinates": [12.9229, 80.1275], "severity": "HIGH"},
            {"id": "m3", "type": "delay", "title": "Delay Hotspot: T. Nagar Junction", "coordinates": [13.0405, 80.2337], "severity": "HIGH"},
            {"id": "m4", "type": "safety", "title": "Safety: Route 21G (Adyar)", "coordinates": [13.0210, 80.2450], "severity": "MEDIUM"}
        ]
        
    return markers

@router.post("/simulate")
def run_simulation(step: int = Query(4, ge=0, le=4), scenario: str = Query("waterlogging"), db_session: Session = Depends(db.get_db)):
    """
    Simulates step-by-step edge observations and database insertions for chosen scenario.
    step=0: Resets the SQLite tables to defaults.
    step=1..4: Ingests simulated bus events and runs multi-bus verification logic.
    """
    # Normalize scenario string
    sc = scenario.lower()
    
    if sc == "pothole" or sc == "road_damage":
        inc_type = "road_damage"
        default_lat, default_lon = 13.0067, 80.2206 # Guindy
        loc_name = "Guindy Junction"
        primary_bus = "BUS-101"
    elif sc == "road_obstruction":
        inc_type = "road_obstruction"
        default_lat, default_lon = 13.0694, 80.2030 # Koyambedu
        loc_name = "Koyambedu Roundabout"
        primary_bus = "BUS-305"
    else: # waterlogging default
        inc_type = "waterlogging"
        default_lat, default_lon = 12.9280, 80.1410 # Tambaram
        loc_name = "Tambaram Main Road"
        primary_bus = "BUS-204"

    # 1. RESET STEP
    if step == 0:
        # Truncate tables
        db_session.query(models.Event).delete()
        db_session.query(models.Alert).delete()
        db_session.query(models.Bus).delete()
        db_session.query(models.Route).delete()
        db_session.commit()
        
        # Populate Default Buses
        default_buses = [
            models.Bus(id="BUS-101", route_id="21G", latitude=13.0067, longitude=80.2206, speed=24.0, timestamp="10:46 AM", status="active"),
            models.Bus(id="BUS-205", route_id="570", latitude=13.0080, longitude=80.2190, speed=28.0, timestamp="10:46 AM", status="active"),
            models.Bus(id="BUS-310", route_id="91", latitude=13.0075, longitude=80.2220, speed=18.0, timestamp="10:46 AM", status="active"),
            models.Bus(id="BUS-402", route_id="19", latitude=13.0055, longitude=80.2200, speed=32.0, timestamp="10:46 AM", status="active"),
            models.Bus(id="BUS-204", route_id="21G", latitude=12.9229, longitude=80.1275, speed=15.0, timestamp="09:44 AM", status="delayed"),
            models.Bus(id="BUS-305", route_id="70", latitude=13.0694, longitude=80.2030, speed=20.0, timestamp="10:46 AM", status="active")
        ]
        for b in default_buses:
            db_session.add(b)
            
        # Populate Default Route Travel Times
        default_routes = [
            models.Route(id="21G", expected_time_mins=42, actual_time_mins=42, delay_mins=0, status="NORMAL"),
            models.Route(id="570", expected_time_mins=35, actual_time_mins=35, delay_mins=0, status="NORMAL"),
            models.Route(id="91", expected_time_mins=50, actual_time_mins=50, delay_mins=0, status="NORMAL"),
            models.Route(id="70", expected_time_mins=45, actual_time_mins=45, delay_mins=0, status="NORMAL")
        ]
        for r in default_routes:
            db_session.add(r)
            
        db_session.commit()
        return {"status": "reset", "details": f"Database truncated; default buses initialized for scenario: {sc}."}

    # Helper function to insert observation
    def insert_simulated_event(bus_id, route_id, lat, lon, time_str, severity="LOW"):
        evt_id = f"EVT-{str(uuid.uuid4())[:6].upper()}"
        evt = models.Event(
            event_id=evt_id,
            bus_id=bus_id,
            route_id=route_id,
            incident_type=inc_type,
            confidence=45 + (step * 15),
            severity=severity,
            latitude=lat,
            longitude=lon,
            timestamp=time_str,
            evidence_image=None,
            status="OBSERVED"
        )
        db_session.add(evt)
        db_session.commit()
        db_session.refresh(evt)
        
        # Run process verification
        process_event_verification(db_session, evt)
        return evt_id

    last_evt_id = ""

    # 2. RUN SIMULATION STEPS IN CASCADING ACCUMULATION
    if step >= 1:
        last_evt_id = insert_simulated_event(primary_bus, "21G", default_lat, default_lon, "10:46 AM")
        
    if step >= 2:
        last_evt_id = insert_simulated_event("BUS-205", "570", default_lat + 0.0005, default_lon + 0.0005, "10:46 AM", severity="MEDIUM")
        
        route_21g = db_session.query(models.Route).filter(models.Route.id == "21G").first()
        if route_21g:
            route_21g.actual_time_mins = 48
            route_21g.delay_mins = 6
            route_21g.status = "MODERATE"
            
        bus_205 = db_session.query(models.Bus).filter(models.Bus.id == "BUS-205").first()
        if bus_205:
            bus_205.status = "delayed"
        db_session.commit()
        
    if step >= 3:
        last_evt_id = insert_simulated_event("BUS-310", "91", default_lat - 0.0003, default_lon + 0.0002, "10:46 AM", severity="HIGH")
        
        route_21g = db_session.query(models.Route).filter(models.Route.id == "21G").first()
        if route_21g:
            route_21g.actual_time_mins = 54
            route_21g.delay_mins = 12
            route_21g.status = "SEVERE"
        db_session.commit()
        
    if step >= 4:
        last_evt_id = insert_simulated_event("BUS-402", "19", default_lat + 0.0002, default_lon - 0.0004, "10:47 AM", severity="HIGH")
        
        # Ingest secondary correlated alert
        delay_evt = models.Event(
            event_id=f"EVT-DL-{str(uuid.uuid4())[:4].upper()}",
            bus_id="BUS-105",
            route_id="21G",
            incident_type="delay",
            confidence=92.0,
            severity="HIGH",
            latitude=13.0405,
            longitude=80.2337,
            timestamp="10:47 AM",
            status="OBSERVED"
        )
        db_session.add(delay_evt)
        process_event_verification(db_session, delay_evt)

        route_21g = db_session.query(models.Route).filter(models.Route.id == "21G").first()
        if route_21g:
            route_21g.actual_time_mins = 59
            route_21g.delay_mins = 17
            route_21g.status = "CRITICAL"
            
        db_session.commit()

    return {
        "status": "success", 
        "sim_step": step, 
        "scenario": sc, 
        "last_event_id": last_evt_id,
        "message": f"Simulation step {step} for scenario '{sc}' applied successfully."
    }
