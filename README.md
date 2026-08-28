# BUS-SENSE AI — Smart City & Transport Command Center

**Subtitle:** AI-Powered Mobile Urban Intelligence Platform  
**Tagline:** *From Bus Camera Observations to Actionable Urban Intelligence*

---

## 1. What the Project Does
Public transit buses travel throughout city routes daily, equipped with cameras and GPS. **BUS-SENSE AI** treats these transit vehicles as mobile urban telemetry nodes.
* **Edge AI frame processing**: Bus cameras scan road conditions (detecting accidents, wrong-side driving, water logging, debris, and structural blocks).
* **Anonymized Interior Safety Analysis**: Inside cameras estimate occupancy ratios to monitor route overcrowding.
* **Central Telemetry Ingestion**: Observations are streamed to a FastAPI backend.
* **Multi-Bus Spatial Verification**: Incoming events are clustered geographically. Isolated detections represent initial events (`OBSERVED`). As multiple independent bus units report the same anomaly, the system aggregates them and raises reliability ratings (`CORROBORATED` &rarr; `VERIFIED`).
* **Cross-Event Correlation**: Links related factors (e.g., Waterlogging &rarr; slow average travel speed &rarr; bus delays) to provide traffic coordinators with actionable recommendations.

---

## 2. Technical Architecture

* **Frontend**: React (Vite, Leaflet Maps, Lucide Icons, and custom CSS grid layers).
* **Backend**: Python + FastAPI (with SQLite for local relational data caching and SQLAlchemy ORM).
* **AI Engine**: YOLOv8 (Ultralytics framework) trained for 10 distinct road hazard classes.

```
Bus-Sense-AI/
  ├── frontend/       # Vite React application and mapping layers
  ├── backend/        # FastAPI Python server and SQLite schema
  ├── ai/             # YOLOv8 training pipelines and inference engines
  ├── data/           # SQLite databases, uploads, and assets
  └── docs/           # Specifications and manuals
```

---

## 3. Installation Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (v16+)
* [Python](https://www.python.org/) (v3.9 - v3.11 recommended)
* Git

### Easy Start Launcher (Windows)
We have included automated batch launchers in the root workspace folder:
1. **Terminal 1**: Double-click **`start_backend.bat`** (Automatically creates Python virtual environment, installs requirements, and boots server on `http://localhost:8000`).
2. **Terminal 2**: Double-click **`start_frontend.bat`** (Automatically installs npm libraries and launches Vite dashboard on `http://localhost:5173`).

---

## 4. Manual Configuration (Step-by-Step)

### Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Create your local config environment file:
   Copy `backend/.env.example` to `backend/.env` (default is configured for local development).
5. Launch FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### Frontend Setup
1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm node dependencies:
   ```bash
   npm install
   ```
3. Create your local config environment file:
   Copy `frontend/.env.example` to `frontend/.env` (you can configure your `VITE_STADIA_API_KEY` here).
4. Launch React local server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to: `http://localhost:5173/`

---

## 5. How to Train the YOLO Model
The AI engine supports configurable training parameters out-of-the-box.
1. Place your annotated dataset inside `ai/dataset/` matching the standard YOLO directory:
   * **Images**: `ai/dataset/images/train/` and `ai/dataset/images/val/`
   * **Labels**: `ai/dataset/labels/train/` and `ai/dataset/labels/val/` (containing `.txt` files with `<class_id> <cx> <cy> <w> <h>`).
2. Edit configurations in `ai/dataset.yaml`.
3. Activate backend virtual environment and run the training script:
   ```bash
   python ai/training/train.py --epochs 50 --batch 16 --imgsz 640
   ```
4. The script compiles training progress and copies the final weights model to `ai/models/best.pt`.

---

## 6. Real AI vs. Simulated Demo Modes
* **Real AI inference**: Uploading an image frame to the endpoint `POST /predict` calls OpenCV and YOLO. If trained weights are available at `ai/models/best.pt`, the script performs model inference and draws bounding boxes. If weights are missing, the endpoint gracefully outputs `"model_not_available"` to **prevent faking AI results**.
* **Simulated Demo Mode**: Clicking **Trigger Simulation** on the dashboard home triggers the step-by-step SIH sequence:
  * Ingests 4 sequential bus events at Guindy Junction.
  * Spatial verification joins them into a single alert, changing status from `OBSERVED` &rarr; `CORROBORATED` &rarr; `VERIFIED`.
  * Simulates Tambaram waterlogging, speed telemetry drops, and T. Nagar delay indices, updating metrics across all dashboard pages.

---

## 7. Connecting Real Cameras and GPS Telemetry Later

### Connecting Real Cameras
Currently, the prototype uses static frame uploads via `/api/predict`. To scale to real-world edge bus-cameras:
1. **Deploy Model at Edge**: Install the lightweight `best.pt` model on a hardware module (e.g. NVIDIA Jetson or Raspberry Pi with TPU) onboard the MTC bus.
2. **Stream Frame Predictions**: The onboard Edge processor captures frames using OpenCV, runs local YOLO inference, and streams only the resulting JSON detections (bounding boxes, class, confidence) to the central platform:
   ```python
   # On-board Bus client script:
   import requests
   payload = {
       "bus_id": "BUS-101",
       "route_id": "21G",
       "incident_type": "waterlogging",
       "confidence": 0.92,
       "latitude": 13.0067,
       "longitude": 80.2206
   }
   requests.post("http://<central_ip>/api/telemetry-event", json=payload)
   ```
This preserves cellular bandwidth by transmitting structured floats and metadata instead of high-bandwidth raw video feeds.

### Connecting Real GPS
The backend database models are designed to accept direct coordinate inputs. To connect real vehicle GPS:
1. Expose a WebSocket or UDP listener on the backend (e.g., port 5000) to receive NMEA sentence streams from on-bus GPS modems.
2. Parse latitude/longitude coordinates and update the `buses` table in the database in real-time.
3. The GIS map fetches from the same `buses` table, shifting fleet icons dynamically.
