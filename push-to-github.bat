@echo off
REM Portal Regulasi - Git Push Helper Script
REM This script automates the git push process for Windows

setlocal enabledelayedexpansion

echo.
echo =========================================
echo Portal Regulasi - Git Push Helper
echo =========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [1/6] Checking git configuration...
git config --global user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Git user not configured!
    echo Please run these commands first:
    echo   git config --global user.name "Your Name"
    echo   git config --global user.email "your.email@gmail.com"
    echo.
    pause
    exit /b 1
)
echo [OK] Git configured

echo.
echo [2/6] Checking git status...
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Not in a git repository!
    echo Running: git init
    git init
)
echo [OK] Git status OK

echo.
echo [3/6] Staging all files...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to stage files
    pause
    exit /b 1
)
echo [OK] Files staged

echo.
echo [4/6] Showing changes...
git status --short

echo.
echo [5/6] Enter commit message (default: "Update app")
set /p COMMIT_MSG="Commit message: "
if "!COMMIT_MSG!"=="" set COMMIT_MSG=Update app

echo.
echo Committing: "!COMMIT_MSG!"
git commit -m "!COMMIT_MSG!"
if %errorlevel% neq 0 (
    echo WARNING: Commit might have failed
)

echo.
echo [6/6] Checking remote...
git remote -v >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [WARNING] No remote repository configured!
    echo.
    echo You need to add GitHub repository:
    echo   git remote add origin https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik.git
    echo.
    pause
    exit /b 1
)

echo.
echo =========================================
echo Ready to push to GitHub!
echo =========================================
echo.

set /p PROCEED="Continue with push? (y/n): "
if /i "!PROCEED!"=="y" (
    echo.
    echo Pushing to GitHub...
    git push origin main
    echo.
    echo =========================================
    echo [SUCCESS] Push completed!
    echo =========================================
    echo.
    echo Next steps:
    echo 1. Go to: https://vercel.com/new
    echo 2. Import your GitHub repository
    echo 3. Add environment variables
    echo 4. Click Deploy
    echo.
) else (
    echo [CANCELLED] Push cancelled
)

pause
