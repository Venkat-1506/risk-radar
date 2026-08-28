@echo off
title BUS-SENSE AI Backend Server
echo ============================================================
echo BUS-SENSE AI - Python FastAPI Backend Launcher
echo ============================================================
echo.

cd backend

if not exist venv (
    echo [INFO] Python virtual environment (venv) not found.
    echo [INFO] Creating virtual environment in backend/venv...
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment. Ensure Python is installed and in PATH.
        pause
        exit /b 1
    )
    echo [INFO] Activating virtual environment...
    call venv\Scripts\activate
    echo [INFO] Installing required libraries from requirements.txt...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install pip requirements.
        pause
        exit /b 1
    )
) else (
    echo [INFO] Activating existing virtual environment...
    call venv\Scripts\activate
)

echo.
echo [SUCCESS] Starting Uvicorn Dev Server...
echo [INFO] Docs will be active at http://localhost:8000/docs
echo.

uvicorn app.main:app --reload --port 8000

pause
