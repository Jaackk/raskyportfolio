@echo off
cd /d "%~dp0"
echo Open http://localhost:4298/ in your browser.
echo Keep this window open while using the local workspace.
python -m http.server 4298 --bind 127.0.0.1
pause
