"""J2534 registry placeholder.

Provides a helper for enumerating installed J2534 DLLs.  When a real
``j2534`` binding is available, it delegates to ``j2534.listDevices()``.
"""

try:
    import j2534  # type: ignore
    _HAVE_REAL = True
except ImportError:  # pragma: no cover
    _HAVE_REAL = False


def list_devices() -> list:
    """Return a list of available J2534 devices.

    Each entry is a dict with ``name`` and ``path`` keys.
    """
    if _HAVE_REAL:
        try:
            devices = j2534.listDevices()
            return [{"name": d.name, "path": d.path} for d in devices]
        except Exception:
            pass
    # fallback dummy list
    return [
        {"name": "MockDevice1", "path": "C:\\Windows\\SysWOW64\\passthru.dll"},
        {"name": "MockDevice2", "path": "C:\\Windows\\SysWOW64\\passthru2.dll"},
    ]
