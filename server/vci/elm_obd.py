"""ELM327 OBD-II adapter helper.

This class wraps either a real ELM327 adapter accessed via a serial port
(or ``pyserial`` if installed) or a lightweight mock when hardware is
unavailable.  The interface is intentionally minimal for simplicity.

Usage::

    dev = ELMDevice("/dev/ttyUSB0")
    dev.open()
    print(dev.send("01 0C"))
    dev.close()
"""
import logging
import random
from typing import Optional

log = logging.getLogger(__name__)

try:
    import serial
    _HAVE_SERIAL = True
except ImportError:  # pragma: no cover - mock path
    _HAVE_SERIAL = False


class ELMDevice:
    def __init__(self, port: str = "mock", baudrate: int = 38400, timeout: float = 1.0):
        self.port = port
        self._baudrate = baudrate
        self._timeout = timeout
        self._open = False
        self._serial: Optional["serial.Serial"] = None

    def open(self) -> None:
        if _HAVE_SERIAL and self.port != "mock":
            try:
                self._serial = serial.Serial(self.port, self._baudrate, timeout=self._timeout)
                # reset ELM to known state
                self._serial.write(b"AT Z\r")
                self._serial.flush()
                self._open = True
                log.info("Opened ELM device on %s", self.port)
                return
            except Exception as e:  # pragma: no cover - might not have hardware
                log.warning("Could not open serial port %s: %s; falling back to mock", self.port, e)
                self._serial = None
        # fallback mock
        log.info("Opening mock ELM device on %s", self.port)
        self._open = True

    def close(self) -> None:
        if self._serial:
            try:
                self._serial.close()
            except Exception:
                pass
            self._serial = None
        log.info("Closing ELM device on %s", self.port)
        self._open = False

    def send(self, cmd: str) -> str:
        """Send a command string and return the response (without prompt).

        When using a real device the command is sent terminated by CR and the
        response is read until the ">" prompt.  Strip whitespace from result.
        """
        if not self._open:
            raise RuntimeError("ELM device not open")
        if self._serial:
            full_cmd = cmd.strip().upper() + "\r"
            self._serial.write(full_cmd.encode())
            self._serial.flush()
            # read until prompt
            resp = []
            while True:
                line = self._serial.readline().decode(errors="ignore")
                if not line:
                    break
                if ">" in line:
                    break
                resp.append(line.strip())
            result = " ".join(r for r in resp if r)
            log.debug("ELM serial response: %s", result)
            return result
        # mock behavior
        cmd = cmd.strip().upper()
        log.debug("Mock ELM received: %s", cmd)
        # Handle a couple of common PIDs
        if cmd.startswith("01 0C"):
            rpm = random.randint(600, 3000)
            val = int(rpm * 4)
            a = (val >> 8) & 0xFF
            b = val & 0xFF
            return f"41 0C {a:02X} {b:02X}"
        if cmd.startswith("01 0D"):
            speed = random.randint(0, 120)
            return f"41 0D {speed:02X}"
        return "NO DATA"
