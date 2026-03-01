import time
import pytest
from fastapi.testclient import TestClient

from server.app import app, state

client = TestClient(app)


def test_vci_j2534_flow():
    r = client.get("/vci/j2534/list")
    assert r.status_code == 200
    assert "devices" in r.json()

    # select a mock path
    r = client.post("/vci/j2534/select", json={"dll_path": "mock.dll"})
    assert r.status_code == 200
    r = client.post("/vci/j2534/connect")
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "connected"
    assert state.active_backend == "j2534"


def test_status_and_health():
    r = client.get("/status")
    assert r.status_code == 200
    s = r.json()
    assert s["active_backend"] == "j2534"

    r = client.post("/obd/healthcheck")
    assert r.status_code == 200
    h = r.json()
    assert "ready" in h


def test_elm_and_status_switch():
    # connect elm should change backend
    r = client.post("/vci/elm/connect", json={"port": "mock", "baud": 38400})
    assert r.status_code == 200
    assert state.active_backend == "elm"


def test_obd_live_and_mode06():
    # start polling
    r = client.post("/obd/live/start")
    assert r.status_code == 200
    time.sleep(0.6)
    r2 = client.get("/obd/live")
    assert r2.status_code == 200
    snap = r2.json()
    assert "rpm" in snap
    client.post("/obd/live/stop")

    r3 = client.get("/obd/mode06")
    assert r3.status_code == 200
    assert "raw" in r3.json()


def test_can_connect_and_last():
    # the callback will not get frames immediately but should work with mock
    r = client.post("/can/connect", json={"backend": "mock", "channel": "can0", "bitrate": 500000})
    assert r.status_code == 200
    time.sleep(0.5)
    r2 = client.get("/can/last")
    assert r2.status_code == 200
    assert "count" in r2.json()

    r3 = client.post("/can/log/start", json={"filename": "test_log.jsonl"})
    assert r3.status_code == 200
    r4 = client.post("/can/log/stop")
    assert r4.status_code == 200
