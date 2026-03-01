"""CAN bus monitoring utilities (simple simulator).

This module provides a tiny simulated CAN monitor that emits periodic
messages on a background thread. Intended for development when no CAN
hardware is present.
"""
import threading
import time
import logging
import random
from typing import Callable, Optional

log = logging.getLogger(__name__)

_monitor_thread: Optional[threading.Thread] = None
_stop_event: Optional[threading.Event] = None
_callback: Optional[Callable[[dict], None]] = None


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
    """Start the simulated CAN monitor and register a frame callback.

    The callback will be called with a dict describing a frame.
    """
    global _monitor_thread, _stop_event, _callback
    if _monitor_thread and _monitor_thread.is_alive():
        log.warning("Monitor already running")
        return
    _stop_event = threading.Event()
    _callback = callback
    _monitor_thread = threading.Thread(target=_run, args=(interface,), daemon=True)
    _monitor_thread.start()


def stop_monitor():
    global _stop_event, _monitor_thread
    if _stop_event:
        _stop_event.set()
    if _monitor_thread:
        _monitor_thread.join(timeout=1.0)
    _monitor_thread = None
    _stop_event = None
