import pytest

from server.vci.j2534_api import J2534Device, _HAVE_REAL


def test_j2534_mock():
    dev = J2534Device("mock")
    assert dev.connect()
    assert dev.is_connected()
    resp = dev.send(b"test")
    assert resp == b"\x01test"
    dev.disconnect()
    assert not dev.is_connected()


@pytest.mark.skipif(not _HAVE_REAL, reason="real j2534 library not installed")
def test_j2534_real_call():
    # if a real library is present, open with invalid name should fail cleanly
    dev = J2534Device("INVALID")
    with pytest.raises(Exception):
        dev.connect()
