@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py server.py
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  python server.py
  goto :eof
)
echo Python 3 was not found.
echo Install Python 3 and make sure "python" is available on PATH.
pause
