import time
import threading
import pytest

from server.can.can_monitor import start_monitor, stop_monitor


def test_mock_can_monitor():
    frames = []
    def cb(f):
        frames.append(f)
        # stop after first frame
        stop_monitor()
    start_monitor(interface="nonexistent", callback=cb)
    # wait briefly for monitor to invoke callback
    time.sleep(0.5)
    assert len(frames) == 1


# if python-can is available and channel exists, we could write another test,
# but on CI environment we usually won't have it, so we skip.
