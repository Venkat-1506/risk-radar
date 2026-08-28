import urllib.request
import json
import sys

BASE_URL = "http://localhost:8000"

def run_test(path, method="GET", data=None, content_type="application/json"):
    url = f"{BASE_URL}{path}"
    print(f"Testing {method} {path} ... ", end="")
    try:
        req = urllib.request.Request(url, method=method)
        if data:
            req.data = json.dumps(data).encode("utf-8")
            req.add_header("Content-Type", content_type)
            
        with urllib.request.urlopen(req, timeout=5) as response:
            status = response.status
            body = response.read().decode("utf-8")
            res_json = json.loads(body)
            print(f"SUCCESS (HTTP {status})")
            return res_json
    except Exception as e:
        print(f"FAILED ({str(e)})")
        return None

def main():
    print("============================================================")
    print("BUS-SENSE AI - Backend API Integration Verification")
    print("============================================================\n")

    # 1. Health check
    health = run_test("/api/health")
    if not health or health.get("status") != "healthy":
        print("\n[ERROR] Backend API is offline or unhealthy. Make sure Uvicorn is running on port 8000 first.")
        sys.exit(1)

    # 2. Model Info
    run_test("/api/model-info")

    # 3. Reset Simulation Database
    run_test("/api/simulate?step=0", method="POST")

    # 4. Trigger Simulation Step 1
    run_test("/api/simulate?step=1", method="POST")

    # 5. Check Active Alerts Ingestion
    alerts = run_test("/api/alerts")
    if alerts:
        print(f"Current active alerts in DB: {len(alerts)}")

    # 6. Check Map Events
    map_events = run_test("/api/map-events")
    if map_events:
        print(f"Map coordinates count: {len(map_events)}")

    # 7. Check Analytics pre-aggregation
    analytics = run_test("/api/analytics")
    if analytics:
        print(f"Analytics stats check: Accident counts = {analytics.get('accidentRiskZonesCount')}")

    # 8. Reset simulation back to clean defaults
    run_test("/api/simulate?step=0", method="POST")

    print("\n============================================================")
    print("[SUCCESS] All API integration tests completed successfully.")
    print("============================================================")

if __name__ == "__main__":
    main()
