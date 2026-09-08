@echo off
title Apple .pages Offline Converter Launcher
cd /d "%~dp0"

echo [1/2] Checking Python environment...
if not exist ".venv\Scripts\python.exe" (
    echo [*] Setting up virtual environment for first-time use...
    python -m venv .venv
    echo [*] Installing dependencies...
    .\.venv\Scripts\pip.exe install -r requirements.txt
)

echo [2/2] Launching Offline .pages Converter Desktop App...
start "" ".\.venv\Scripts\pythonw.exe" gui.py
exit
