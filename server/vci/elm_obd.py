"""ELM327 OBD-II adapter helper (lightweight mock).

This mock implements a tiny subset of the ELM327 command set suitable for
local testing. It does not access serial ports.
"""
import logging
import random

log = logging.getLogger(__name__)


class ELMDevice:
    def __init__(self, port: str = "mock"):
        self.port = port
        self._open = False

    def open(self) -> None:
        log.info("Opening mock ELM device on %s", self.port)
        self._open = True

    def close(self) -> None:
        log.info("Closing mock ELM device on %s", self.port)
        self._open = False

    def send(self, cmd: str) -> str:
        """Send a command string to the mock and return a typical ELM response.

        Example: send("01 0C") -> "41 0C 1A F8" (RPM example)
        """
        if not self._open:
            raise RuntimeError("ELM device not open")
        cmd = cmd.strip().upper()
        log.debug("Mock ELM received: %s", cmd)
        # Handle a couple of common PIDs
        if cmd.startswith("01 0C"):
            # Engine RPM: return a random realistic RPM
            rpm = random.randint(600, 3000)
            val = int(rpm * 4)
            a = (val >> 8) & 0xFF
            b = val & 0xFF
            return f"41 0C {a:02X} {b:02X}"
        if cmd.startswith("01 0D"):
            # Vehicle speed (km/h)
            speed = random.randint(0, 120)
            return f"41 0D {speed:02X}"
        # Default: unknown PID
        return "NO DATA"
