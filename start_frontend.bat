@echo off
title BUS-SENSE AI Frontend Client
echo ============================================================
echo BUS-SENSE AI - React Dashboard Launcher
echo ============================================================
echo.

cd frontend

if not exist node_modules (
    echo [INFO] node_modules not found. Installing node dependencies...
    npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed. Make sure Node.js is installed.
        pause
        exit /b 1
    )
)

echo.
echo [SUCCESS] Starting React Dashboard Development Server...
echo [INFO] Dashboard will be active at http://localhost:5173
echo.

npm run dev

pause
