from sqlalchemy import Column, String, Float, Integer, ForeignKey
from .db import Base

class Bus(Base):
    __tablename__ = "buses"

    id = Column(String, primary_key=True, index=True)
    route_id = Column(String, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed = Column(Float, default=0.0)
    timestamp = Column(String, nullable=False)
    status = Column(String, default="active")  # "active", "delayed", "idle"

class Route(Base):
    __tablename__ = "routes"

    id = Column(String, primary_key=True, index=True)
    expected_time_mins = Column(Integer, default=40)
    actual_time_mins = Column(Integer, default=40)
    delay_mins = Column(Integer, default=0)
    status = Column(String, default="NORMAL")  # "NORMAL", "MODERATE", "SEVERE", "CRITICAL"

class Event(Base):
    __tablename__ = "events"

    event_id = Column(String, primary_key=True, index=True)
    bus_id = Column(String, index=True)
    route_id = Column(String, index=True)
    incident_type = Column(String, index=True)  # "accident", "waterlogging", "delay", "safety"
    confidence = Column(Float, nullable=False)
    severity = Column(String, nullable=False)   # "HIGH", "MEDIUM", "LOW"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(String, nullable=False)
    evidence_image = Column(String, nullable=True)
    status = Column(String, default="OBSERVED")  # "OBSERVED", "PROCESSED"

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    incident_type = Column(String, index=True)
    severity = Column(String, nullable=False)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    time = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    buses_observed = Column(Integer, default=1)
    buses_list = Column(String, nullable=False)  # Comma-separated list e.g. "BUS-101,BUS-205"
    impact = Column(String, nullable=False)
    recommended_action = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String, default="OBSERVED")  # "OBSERVED", "CORROBORATED", "VERIFIED" (User specified tags)
    details = Column(String, nullable=True)
    first_seen = Column(String, nullable=False)
    last_seen = Column(String, nullable=False)
