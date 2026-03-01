"""Simple PySide6 UI starter for the client."""

import sys

try:
    from PySide6.QtWidgets import QApplication, QMainWindow, QLabel
except Exception:
    # If PySide6 isn't installed, fail gracefully.
    print("PySide6 not available. Install via 'pip install pyside6'")
    sys.exit(1)


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("XAW DealerScan Pro - Client")
        self.setCentralWidget(QLabel("UI placeholder - implement views here"))


def main():
    app = QApplication(sys.argv)
    w = MainWindow()
    w.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
