import pytest
import httpx
from multiprocessing import Process
import time

# Use the running server at localhost:8000
BASE = "http://127.0.0.1:8000"


def test_health():
    r = httpx.get(f"{BASE}/health")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


def test_vehicles():
    r = httpx.get(f"{BASE}/vehicles")
    assert r.status_code == 200
    data = r.json()
    assert "vins" in data


def test_twin_and_command():
    vins = httpx.get(f"{BASE}/vehicles").json().get("vins", [])
    if not vins:
        pytest.skip("no vins available")
    vin = vins[0]
    r = httpx.get(f"{BASE}/twin/{vin}")
    assert r.status_code == 200
    cmd = {"vin": vin, "cmd": "LOCK", "args": {}}
    r2 = httpx.post(f"{BASE}/command", json=cmd)
    assert r2.status_code == 200
    assert r2.json().get("status") == "ok"
