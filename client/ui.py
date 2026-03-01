"""PySide6 desktop client for XAW DealerScan Pro.

Connects to the FastAPI backend running on 127.0.0.1:8000 and provides
tabs for VCI device selection, OBD live data, and CAN monitoring.
"""

import sys
import httpx
import json
from threading import Thread
from time import sleep

try:
    from PySide6.QtWidgets import (
        QApplication,
        QMainWindow,
        QTabWidget,
        QWidget,
        QVBoxLayout,
        QHBoxLayout,
        QPushButton,
        QLabel,
        QComboBox,
        QTextEdit,
        QLineEdit,
        QSpinBox,
    )
    from PySide6.QtCore import QTimer, Signal, QObject
except Exception:
    print("PySide6 not available. Install via 'pip install pyside6'")
    sys.exit(1)

BASE_URL = "http://127.0.0.1:8000"


class SignalEmitter(QObject):
    """Helper to emit signals from threads."""
    status_changed = Signal(str)


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("XAW DealerScan Pro - Client")
        self.setGeometry(100, 100, 900, 600)
        self.emitter = SignalEmitter()
        self.emitter.status_changed.connect(self.on_status_update)

        tabs = QTabWidget()
        tabs.addTab(self.vci_tab(), "VCI")
        tabs.addTab(self.obd_tab(), "OBD")
        tabs.addTab(self.can_tab(), "CAN")
        tabs.addTab(self.status_tab(), "Status")
        self.setCentralWidget(tabs)

        # refresh timer
        self.timer = QTimer()
        self.timer.timeout.connect(self.refresh_data)
        self.timer.start(1000)

    def vci_tab(self):
        w = QWidget()
        layout = QVBoxLayout(w)

        # list devices
        layout.addWidget(QLabel("J2534 Devices:"))
        self.device_list = QComboBox()
        layout.addWidget(self.device_list)

        btn_list = QPushButton("List Devices")
        btn_list.clicked.connect(self.list_devices)
        layout.addWidget(btn_list)

        # elm connect
        layout.addWidget(QLabel("ELM Serial Port:"))
        self.elm_port = QLineEdit("COM5")
        layout.addWidget(self.elm_port)

        btn_elm = QPushButton("Connect ELM")
        btn_elm.clicked.connect(self.connect_elm)
        layout.addWidget(btn_elm)

        # status
        self.vci_status = QTextEdit()
        self.vci_status.setReadOnly(True)
        layout.addWidget(self.vci_status)

        return w

    def obd_tab(self):
        w = QWidget()
        layout = QVBoxLayout(w)

        btn_health = QPushButton("OBD Healthcheck")
        btn_health.clicked.connect(self.obd_healthcheck)
        layout.addWidget(btn_health)

        btn_live_start = QPushButton("Start Live Data")
        btn_live_start.clicked.connect(self.obd_live_start)
        layout.addWidget(btn_live_start)

        btn_live_stop = QPushButton("Stop Live Data")
        btn_live_stop.clicked.connect(self.obd_live_stop)
        layout.addWidget(btn_live_stop)

        self.obd_data = QTextEdit()
        self.obd_data.setReadOnly(True)
        layout.addWidget(self.obd_data)

        return w

    def can_tab(self):
        w = QWidget()
        layout = QVBoxLayout(w)

        # backend selection
        layout.addWidget(QLabel("CAN Backend:"))
        self.can_backend = QComboBox()
        self.can_backend.addItems(["mock", "slcan"])
        layout.addWidget(self.can_backend)

        # channel
        layout.addWidget(QLabel("CAN Channel:"))
        self.can_channel = QLineEdit("can0")
        layout.addWidget(self.can_channel)

        # bitrate
        layout.addWidget(QLabel("Bitrate:"))
        self.can_bitrate = QSpinBox()
        self.can_bitrate.setValue(500000)
        layout.addWidget(self.can_bitrate)

        btn_connect = QPushButton("Connect CAN")
        btn_connect.clicked.connect(self.can_connect)
        layout.addWidget(btn_connect)

        # logging
        btn_log_start = QPushButton("Start Logging")
        btn_log_start.clicked.connect(self.can_log_start)
        layout.addWidget(btn_log_start)

        btn_log_stop = QPushButton("Stop Logging")
        btn_log_stop.clicked.connect(self.can_log_stop)
        layout.addWidget(btn_log_stop)

        self.can_data = QTextEdit()
        self.can_data.setReadOnly(True)
        layout.addWidget(self.can_data)

        return w

    def status_tab(self):
        w = QWidget()
        layout = QVBoxLayout(w)
        self.status_text = QTextEdit()
        self.status_text.setReadOnly(True)
        layout.addWidget(self.status_text)
        return w

    def list_devices(self):
        try:
            r = httpx.get(f"{BASE_URL}/vci/j2534/list", timeout=2)
            devices = r.json().get("devices", [])
            self.device_list.clear()
            for d in devices:
                self.device_list.addItem(d["name"], d["path"])
            self.vci_status.setText(f"Found {len(devices)} device(s)")
        except Exception as e:
            self.vci_status.setText(f"Error: {e}")

    def connect_elm(self):
        port = self.elm_port.text()
        try:
            r = httpx.post(
                f"{BASE_URL}/vci/elm/connect",
                json={"port": port, "baud": 38400},
                timeout=2,
            )
            self.vci_status.setText(f"ELM connected: {r.json()}")
        except Exception as e:
            self.vci_status.setText(f"Error: {e}")

    def obd_healthcheck(self):
        try:
            r = httpx.post(f"{BASE_URL}/obd/healthcheck", timeout=2)
            self.obd_data.setText(json.dumps(r.json(), indent=2))
        except Exception as e:
            self.obd_data.setText(f"Error: {e}")

    def obd_live_start(self):
        try:
            httpx.post(f"{BASE_URL}/obd/live/start", timeout=2)
            self.obd_data.setText("Live data polling started...")
        except Exception as e:
            self.obd_data.setText(f"Error: {e}")

    def obd_live_stop(self):
        try:
            httpx.post(f"{BASE_URL}/obd/live/stop", timeout=2)
            self.obd_data.setText("Live data polling stopped.")
        except Exception as e:
            self.obd_data.setText(f"Error: {e}")

    def can_connect(self):
        try:
            r = httpx.post(
                f"{BASE_URL}/can/connect",
                json={
                    "backend": self.can_backend.currentText(),
                    "channel": self.can_channel.text(),
                    "bitrate": self.can_bitrate.value(),
                },
                timeout=2,
            )
            self.can_data.setText(f"CAN connected: {r.json()}")
        except Exception as e:
            self.can_data.setText(f"Error: {e}")

    def can_log_start(self):
        try:
            httpx.post(f"{BASE_URL}/can/log/start", timeout=2)
            self.can_data.setText("CAN logging started.")
        except Exception as e:
            self.can_data.setText(f"Error: {e}")

    def can_log_stop(self):
        try:
            httpx.post(f"{BASE_URL}/can/log/stop", timeout=2)
            self.can_data.setText("CAN logging stopped.")
        except Exception as e:
            self.can_data.setText(f"Error: {e}")

    def refresh_data(self):
        # periodically refresh status
        try:
            r = httpx.get(f"{BASE_URL}/status", timeout=1)
            status = r.json()
            self.status_text.setText(json.dumps(status, indent=2))

            # also refresh live OBD if polling
            r2 = httpx.get(f"{BASE_URL}/obd/live", timeout=1)
            live = r2.json()
            if live:
                self.obd_data.setText(
                    "Live OBD Data:\n" + json.dumps(live, indent=2)
                )

            # refresh CAN last frame
            r3 = httpx.get(f"{BASE_URL}/can/last", timeout=1)
            can = r3.json()
            if can.get("frame"):
                self.can_data.setText(
                    f"Last CAN Frame (count={can.get('count')}):\n"
                    + json.dumps(can["frame"], indent=2)
                )
        except Exception:
            pass  # silently skip refresh errors

    def on_status_update(self, msg):
        pass


def main():
    app = QApplication(sys.argv)
    w = MainWindow()
    w.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
