import pytest

from server.vci.elm_obd import ELMDevice, _HAVE_SERIAL


def test_elm_mock():
    dev = ELMDevice(port="mock")
    dev.open()
    resp = dev.send("01 0C")
    assert resp.startswith("41 0C")
    resp2 = dev.send("01 0D")
    assert resp2.startswith("41 0D")
    dev.close()


@pytest.mark.skipif(not _HAVE_SERIAL, reason="pyserial not installed")
def test_elm_serial_equiv(tmp_path):
    # Try opening a non-existent port should fallback to mock
    dev = ELMDevice(port="COM_DOES_NOT_EXIST")
    dev.open()
    # If open succeeded as real serial, send may error; so just ensure no crash
    resp = dev.send("01 0D")
    assert isinstance(resp, str)
    dev.close()
