"""CAN bus monitoring utilities.

This module will use ``python-can`` if available to attach to a real CAN
interface.  When ``python-can`` is not installed or the bus cannot be
opened we fall back to a simple simulator that emits random frames on a
background thread.  The public API is the same either way.
"""
import logging
from typing import Callable, Optional

log = logging.getLogger(__name__)

try:
    import can
    _HAVE_CAN = True
except ImportError:  # pragma: no cover - fallback path
    _HAVE_CAN = False

import threading
import time
import random

# globals representing current monitor state
_monitor_thread: Optional[threading.Thread] = None
_stop_event: Optional[threading.Event] = None
_callback: Optional[Callable[[dict], None]] = None
_bus: Optional["can.interface.Bus"] = None



def _run(interface: str):
    log.info("Starting mock CAN monitor on %s", interface)
    while not _stop_event.is_set():
        # Simulate a CAN frame
        frame = {
            "id": random.choice([0x100, 0x200, 0x7DF]),
            "data": [random.randint(0, 255) for _ in range(8)],
            "timestamp": time.time(),
        }
        log.debug("Mock CAN frame: %s", frame)
        if _callback:
            try:
                _callback(frame)
            except Exception:
                log.exception("Error in CAN callback")
        time.sleep(0.2)
    log.info("Mock CAN monitor stopped")


def start_monitor(interface: str = "can0", callback: Optional[Callable[[dict], None]] = None):
    """Start monitoring the CAN interface.

    If ``python-can`` is installed and a bus named ``interface`` can be
    opened, frames received from the bus are forwarded to ``callback``.
    Otherwise a mock generator is started.
    """
    global _monitor_thread, _stop_event, _callback, _bus
    if _monitor_thread and _monitor_thread.is_alive():
        log.warning("Monitor already running")
        return
    _callback = callback
    if _HAVE_CAN:
        try:
            _bus = can.interface.Bus(channel=interface, bustype="socketcan")
        except Exception as e:  # pragma: no cover - hardware dependent
            log.warning("Could not open CAN bus %s: %s; falling back to mock", interface, e)
            _bus = None
    if _bus:
        # start listener thread
        _stop_event = threading.Event()
        _monitor_thread = threading.Thread(target=_can_loop, daemon=True)
        _monitor_thread.start()
        return
    # fall back to simulated monitor
    _stop_event = threading.Event()
    _monitor_thread = threading.Thread(target=_run, args=(interface,), daemon=True)
    _monitor_thread.start()


def _can_loop():
    # reading messages from bus and invoking callback
    assert _bus is not None
    log.info("Starting real CAN monitor on %s", _bus.channel_info)
    while not _stop_event.is_set():
        try:
            msg = _bus.recv(timeout=0.5)
        except Exception as e:
            log.error("Error reading CAN bus: %s", e)
            break
        if msg is None:
            continue
        frame = {"id": msg.arbitration_id, "data": list(msg.data), "timestamp": msg.timestamp}
        if _callback:
            try:
                _callback(frame)
            except Exception:
                log.exception("Error in CAN callback")
    log.info("Real CAN monitor stopped")


def stop_monitor():
    global _stop_event, _monitor_thread, _bus
    if _stop_event:
        _stop_event.set()
    if _monitor_thread:
        _monitor_thread.join(timeout=1.0)
    if _bus:
        try:
            _bus.shutdown()
        except Exception:
            pass
    _monitor_thread = None
    _stop_event = None
    _bus = None
