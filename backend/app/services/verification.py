import math
from sqlalchemy.orm import Session
from ..database import models
import uuid
from datetime import datetime

# Helper to calculate spatial distance in meters (Haversine formula)
def get_distance_meters(lat1, lon1, lat2, lon2):
    R = 6371000 # radius of Earth in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    a = math.sin(delta_phi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(delta_lambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def get_location_name(lat, lon):
    """
    Reverse geocoding helper mapping Chennai coordinates to primary corridors
    """
    # Guindy: [13.0067, 80.2206]
    if get_distance_meters(lat, lon, 13.0067, 80.2206) < 800:
        return "Guindy Junction"
    # Tambaram: [12.9229, 80.1275]
    elif get_distance_meters(lat, lon, 12.9229, 80.1275) < 1500 or get_distance_meters(lat, lon, 12.9280, 80.1410) < 1500:
        return "Tambaram Main Road"
    # T. Nagar: [13.0405, 80.2337]
    elif get_distance_meters(lat, lon, 13.0405, 80.2337) < 800:
        return "T. Nagar Junction"
    # Koyambedu: [13.0694, 80.2030]
    elif get_distance_meters(lat, lon, 13.0694, 80.2030) < 800:
        return "Koyambedu Roundabout"
    return "Chennai Transit Corridor"

def process_event_verification(db: Session, event: models.Event):
    """
    Aggregates incoming bus observations into high-level verified alerts.
    Implements verification pipeline states: OBSERVED -> CORROBORATED -> VERIFIED
    """
    # Look for matching alert of same category within 200 meters
    alerts = db.query(models.Alert).filter(models.Alert.incident_type == event.incident_type).all()
    
    matching_alert = None
    for alert in alerts:
        dist = get_distance_meters(event.latitude, event.longitude, alert.latitude, alert.longitude)
        if dist < 250: # within 250 meters cluster range
            matching_alert = alert
            break

    if matching_alert:
        # Check if this bus has already logged an observation in this alert group
        buses = [b.strip() for b in matching_alert.buses_list.split(",") if b.strip()]
        if event.bus_id not in buses:
            buses.append(event.bus_id)
            matching_alert.buses_list = ",".join(buses)
            matching_alert.buses_observed = len(buses)

        # Update timestamps
        matching_alert.last_seen = event.timestamp
        matching_alert.confidence = max(matching_alert.confidence, event.confidence)

        # Update verification states based on unique observations
        unique_count = matching_alert.buses_observed
        if unique_count == 1:
            matching_alert.status = "OBSERVED"
            if event.incident_type == "accident":
                matching_alert.title = "Observed Potential Accident Risk Zone"
            else:
                matching_alert.title = f"Observed {event.incident_type.title()} Alert"
        elif unique_count == 2:
            matching_alert.status = "CORROBORATED"
            if event.incident_type == "accident":
                matching_alert.title = "Corroborated Potential Accident Risk Zone"
            else:
                matching_alert.title = f"Corroborated {event.incident_type.title()} Zone"
        else: # 3+ independent observations
            matching_alert.status = "VERIFIED"
            if event.incident_type == "accident":
                matching_alert.title = "VERIFIED HIGH RELIABILITY POTENTIAL ACCIDENT RISK ZONE"
            else:
                matching_alert.title = f"VERIFIED HIGH RELIABILITY {event.incident_type.upper()} ZONE"
            matching_alert.severity = "HIGH"

        # Update detail texts
        matching_alert.details = (
            f"Repeated observations ({unique_count} distinct buses: {matching_alert.buses_list}) "
            f"confirm a {event.incident_type} hazard at {matching_alert.location}."
        )
        
        db.commit()
        db.refresh(matching_alert)
        return matching_alert
    else:
        # Create a new alert dossier
        location_name = get_location_name(event.latitude, event.longitude)
        alert_id = f"ALR-{str(uuid.uuid4())[:6].upper()}"
        
        # Default actions and impacts
        impact = "Route delay impact"
        rec_action = "Routine inspection scheduled."
        title = f"Observed {event.incident_type.title()} Alert"
        
        if event.incident_type == "accident":
            title = "Observed Potential Accident Risk Zone"
            impact = "Traffic flow rate decreased by 30%"
            rec_action = "Recommended: Traffic safety and speed investigation."
        elif event.incident_type == "waterlogging":
            impact = "Corridor travel speeds reduced by 40%"
            rec_action = "Recommended: Drainage cleared and road repair inspection."
        elif event.incident_type == "delay":
            impact = "Average scheduled arrivals delayed +14%"
            rec_action = "Recommended: Optimize signal phases."
        elif event.incident_type == "safety":
            impact = "Standing passenger occupancy exceeds legal limit"
            rec_action = "Recommended: Dispatch backup route bus."

        new_alert = models.Alert(
            id=alert_id,
            incident_type=event.incident_type,
            severity=event.severity,
            title=title,
            location=location_name,
            time=event.timestamp,
            confidence=event.confidence,
            buses_observed=1,
            buses_list=event.bus_id,
            impact=impact,
            recommended_action=rec_action,
            latitude=event.latitude,
            longitude=event.longitude,
            status="OBSERVED",
            details=f"Initial edge detection from bus {event.bus_id} at {location_name}.",
            first_seen=event.timestamp,
            last_seen=event.timestamp
        )
        
        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)
        return new_alert
