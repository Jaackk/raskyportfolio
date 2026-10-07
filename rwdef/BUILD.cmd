@echo off
cd /d "%~dp0"
node --check app.js
if errorlevel 1 exit /b 1
node --check documents.js
if errorlevel 1 exit /b 1
node --check legal.js
if errorlevel 1 exit /b 1
node --check workspaces.js
if errorlevel 1 exit /b 1
node --check sw.js
if errorlevel 1 exit /b 1
echo Static production files validated. No build dependencies required.
