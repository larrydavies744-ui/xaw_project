"""J1979 (OBD-II) protocol helpers.

Includes minimal parsing for a few common PIDs used in examples.
"""
from typing import Union


def _hex_bytes(src: Union[bytes, str]) -> bytes:
    if isinstance(src, bytes):
        return src
    # remove whitespace and make bytes from hex string
    s = src.replace(" ", "")
    return bytes.fromhex(s)


def parse_response(raw: Union[bytes, str]) -> dict:
    """Parse a raw response (bytes or hex string) into structured dict.

    Supports simple responses like "41 0C AA BB" (engine RPM) and
    "41 0D XX" (vehicle speed).
    """
    b = _hex_bytes(raw)
    if len(b) < 2:
        return {"raw": b}
    # First byte is mode + 0x40 for responses (0x41 -> mode 1 response)
    mode = b[0]
    pid = b[1]
    if mode == 0x41 and pid == 0x0C and len(b) >= 4:
        # Engine RPM: ((A*256)+B)/4
        a = b[2]
        c = b[3]
        rpm = ((a << 8) + c) / 4
        return {"pid": 0x0C, "name": "engine_rpm", "value": rpm}
    if mode == 0x41 and pid == 0x0D and len(b) >= 3:
        # Vehicle speed: A (km/h)
        speed = b[2]
        return {"pid": 0x0D, "name": "speed_kmh", "value": speed}
    return {"raw": b}
