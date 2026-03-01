"""J2534 API abstractions with optional real-device support.

If a real ``j2534`` Python binding is available, :class:`J2534Device` will
attempt to open a hardware interface.  Otherwise it falls back to the old
mock implementation used for testing.
"""
from typing import Optional
import logging
import time

log = logging.getLogger(__name__)

try:
    import j2534  # type: ignore
    _HAVE_REAL = True
except ImportError:  # pragma: no cover
    _HAVE_REAL = False


class J2534Device:
    """Represents either a real or mock J2534 device.

    ``name`` is either the identifier passed to the real library or an
    arbitrary string used by the mock.
    """

    def __init__(self, name: str):
        self.name = name
        self._connected: bool = False
        self._real_dev: Optional["j2534.PassThru"] = None

    def connect(self) -> bool:
        """Open the device.  Returns True on success."""
        if _HAVE_REAL:
            try:
                self._real_dev = j2534.PassThru(self.name)
                self._connected = True
                log.info("Opened real J2534 device %s", self.name)
                return True
            except Exception as e:  # pragma: no cover
                log.warning("Failed to open real J2534 device %s: %s", self.name, e)
                self._real_dev = None
        # fallback mock
        log.info("Connecting to J2534 device %s (mock)", self.name)
        time.sleep(0.05)
        self._connected = True
        return True

    def disconnect(self) -> None:
        """Close connection."""
        if self._real_dev:
            try:
                self._real_dev.close()
            except Exception:
                pass
            self._real_dev = None
        if self._connected:
            log.info("Disconnecting J2534 device %s", self.name)
            self._connected = False

    def is_connected(self) -> bool:
        return self._connected

    def send(self, data: bytes) -> bytes:
        """Send raw bytes.  Returns raw response bytes."""
        if not self._connected:
            raise RuntimeError("device not connected")
        if self._real_dev:
            # assume real device has a send/receive API
            resp = self._real_dev.send(data)
            return resp
        # mock behavior:
        log.debug("Mock send to %s: %s", self.name, data)
        return b"\x01" + data
