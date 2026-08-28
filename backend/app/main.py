import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from .database.db import engine, Base
from .routes.api import router

load_dotenv()

# Bootstrap database schemas/tables on server startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BUS-SENSE AI Core Telemetry API",
    description="Smart City Urban Intelligence Platform backend processing camera event observations.",
    version="1.0.0"
)

# CORS Policy configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount data and assets folders statically to allow visual reference of images
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_dir = os.path.join(BASE_DIR, "data")
assets_dir = os.path.join(os.path.dirname(BASE_DIR), "assets")
os.makedirs(data_dir, exist_ok=True)

app.mount("/data", StaticFiles(directory=data_dir), name="data")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

# Register routes API router
app.include_router(router)

@app.get("/")
def get_root():
    return {
        "platform": "BUS-SENSE AI",
        "system": "Active Control Node",
        "documentation": "/docs"
    }
