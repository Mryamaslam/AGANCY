@echo off
cd /d "%~dp0"
echo.
echo === Bilal Raza Agency Website - GitHub Push ===
echo.

gh auth status >nul 2>&1
if errorlevel 1 (
  echo GitHub login required. Browser will open...
  gh auth login -h github.com -p https -w
  if errorlevel 1 (
    echo Login failed. Run: gh auth login
    pause
    exit /b 1
  )
)

echo Creating repo and pushing (public)...
gh repo create bilal-raza-agency --public --source=. --remote=origin --push
if errorlevel 1 (
  echo.
  echo If repo already exists, run:
  echo   git remote add origin https://github.com/YOUR_USERNAME/bilal-raza-agency.git
  echo   git push -u origin main
)

echo.
pause
