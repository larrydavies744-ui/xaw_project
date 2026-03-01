@echo off
python -m uvicorn server.app:app --reload
pause
