from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, Dict, Any
import threading
import time
import random
import json
from pathlib import Path

from server.vci import j2534_registry, j2534_api, elm_obd
from server.can import can_monitor
from server.obd import j1979, dtc, mode06

app = FastAPI()


class SimpleResponse(BaseModel):
    status: str


class TokenResponse(BaseModel):
    access_token: str


class SelectRequest(BaseModel):
    dll_path: str


class ElmConnectRequest(BaseModel):
    port: str
    baud: int = 38400


class CanConnectRequest(BaseModel):
    backend: str
    channel: str
    bitrate: int = 500000


# global state
class BackendState:
    active_backend: Optional[str] = None  # 'j2534' or 'elm'
    j2534_dll: Optional[str] = None
    j2534_dev: Optional[j2534_api.J2534Device] = None
    j2534_protocol: Optional[str] = None
    elm_dev: Optional[elm_obd.ELMDevice] = None
    elm_port: Optional[str] = None
    vin: Optional[str] = None
    last_seen: Optional[float] = None
    online: bool = False
    obd_snapshot: Dict[str, Any] = {}
    mode06_results: Any = {}
    live_thread: Optional[threading.Thread] = None
    live_stop: Optional[threading.Event] = None
    can_last_frame: Optional[dict] = None
    can_rx_count: int = 0
    can_logging: bool = False
    can_log_file: Optional[Path] = None

state = BackendState()


@app.get("/vci/j2534/list")
def vci_j2534_list():
    return {"devices": j2534_registry.list_devices()}


@app.post("/vci/j2534/select")
def vci_j2534_select(req: SelectRequest):
    state.j2534_dll = req.dll_path
    return {"status": "selected", "path": req.dll_path}


@app.post("/vci/j2534/connect")
def vci_j2534_connect():
    if not state.j2534_dll:
        raise HTTPException(status_code=400, detail="DLL not selected")
    dev = j2534_api.J2534Device(state.j2534_dll)
    ok = dev.connect()
    if not ok:
        raise HTTPException(status_code=500, detail="failed to open device")
    state.j2534_dev = dev
    state.active_backend = "j2534"
    # detect protocol stub
    state.j2534_protocol = "ISO15765"
    state.online = True
    return {"status": "connected", "protocol": state.j2534_protocol}


@app.post("/vci/elm/connect")
def vci_elm_connect(req: ElmConnectRequest):
    dev = elm_obd.ELMDevice(port=req.port, baudrate=req.baud)
    dev.open()
    state.elm_dev = dev
    state.elm_port = req.port
    state.active_backend = "elm"
    state.online = True
    return {"status": "connected", "port": req.port}


@app.get("/status")
def get_status():
    return {
        "active_backend": state.active_backend,
        "protocol": state.j2534_protocol,
        "vin": state.vin,
        "last_seen": state.last_seen,
        "online": state.online,
    }


@app.post("/obd/healthcheck")
def obd_healthcheck():
    # stub values
    return {
        "vin": state.vin or "UNKNOWN",
        "ready": state.online,
        "dtcs": {"stored": [], "pending": [], "permanent": []},
        "freeze_frame": False,
    }


@app.post("/obd/live/start")
def obd_live_start():
    if state.live_thread and state.live_thread.is_alive():
        return {"status": "already running"}
    state.live_stop = threading.Event()

    def poll_loop():
        while not state.live_stop.is_set():
            # update snapshot with random values
            state.obd_snapshot = {
                "rpm": random.randint(600, 3000),
                "speed": random.randint(0, 120),
                "coolant": random.uniform(70, 100),
                "voltage": random.uniform(12, 14),
                "fuel": random.uniform(0, 100),
                "supported_pids": ["0C", "0D", "05"],
            }
            time.sleep(0.5)
    state.live_thread = threading.Thread(target=poll_loop, daemon=True)
    state.live_thread.start()
    return {"status": "started"}


@app.post("/obd/live/stop")
def obd_live_stop():
    if state.live_stop:
        state.live_stop.set()
    return {"status": "stopped"}


@app.get("/obd/live")
def obd_live():
    return state.obd_snapshot


@app.get("/obd/mode06")
def obd_mode06():
    return {"raw": state.mode06_results, "parsed": mode06.parse_mode06(state.mode06_results or b"")}


@app.post("/can/connect")
def can_connect(req: CanConnectRequest):
    def cb(frame):
        state.can_last_frame = frame
        state.can_rx_count += 1
        if state.can_logging and state.can_log_file:
            with open(state.can_log_file, "a") as f:
                json.dump(frame, f)
                f.write("\n")
    can_monitor.start_monitor(interface=req.channel, callback=cb)
    return {"status": "connected", "backend": req.backend}


@app.get("/can/last")
def can_last():
    return {"frame": state.can_last_frame, "count": state.can_rx_count}


@app.post("/can/log/start")
def can_log_start(filename: str = "can_log.jsonl"):
    state.can_log_file = Path(filename)
    state.can_logging = True
    return {"status": "logging", "file": filename}


@app.post("/can/log/stop")
def can_log_stop():
    state.can_logging = False
    return {"status": "stopped"}


# keep earlier simple endpoints for backwards compatibility
@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/auth/token", response_model=TokenResponse)
def auth_token(username: str = "", password: str = ""):
    if not username or not password:
        raise HTTPException(
            status_code=400, detail="username and password required"
        )
    return {"access_token": "devtoken"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
