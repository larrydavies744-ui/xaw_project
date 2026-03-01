"""Simple J2534 API abstractions (mock implementations).

These are lightweight mocks intended for development and testing when no
physical J2534 device is present. They provide the same method names as a
real driver but do not attempt hardware access.
"""
from typing import Optional
import logging
import time

log = logging.getLogger(__name__)


class J2534Device:
    """Represents a generic (mock) J2534 device.

    Usage:
        dev = J2534Device("mock0")
        dev.connect()
        dev.send(b"...")
        dev.disconnect()
    """

    def __init__(self, name: str):
        self.name = name
        self._connected: bool = False

    def connect(self) -> bool:
        """Simulate opening a connection to the device.

        Returns True on success.
        """
        log.info("Connecting to J2534 device %s (mock)", self.name)
        time.sleep(0.05)
        self._connected = True
        return True

    def disconnect(self) -> None:
        """Simulate closing the connection."""
        if self._connected:
            log.info("Disconnecting J2534 device %s", self.name)
            self._connected = False

    def is_connected(self) -> bool:
        return self._connected

    def send(self, data: bytes) -> bytes:
        """Send raw bytes to the (mock) device and return a canned response.

        This mock simply echoes back the data prefixed by a status byte.
        """
        if not self._connected:
            raise RuntimeError("device not connected")
        log.debug("Mock send to %s: %s", self.name, data)
        # Return an echo response for testing
        return b"\x01" + data
