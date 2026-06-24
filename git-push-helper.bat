@echo off
REM ===============================================
REM Portal Regulasi - Complete Git & Push Helper
REM For Windows Users
REM ===============================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ===============================================
echo Portal Regulasi - Git Push to GitHub
echo ===============================================
echo.

REM Step 1: Check if Git is installed
echo [CHECKING] Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Git is NOT installed!
    echo.
    echo Please download and install Git from:
    echo   https://git-scm.com/download/win
    echo.
    echo After installation, close and re-open Command Prompt.
    echo.
    pause
    exit /b 1
)
echo [OK] Git found!

REM Step 2: Check git config
echo.
echo [CHECKING] Git configuration...
git config --global user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [CONFIG] Setting up Git user...
    set /p GIT_NAME="Enter your name: "
    set /p GIT_EMAIL="Enter your email: "
    git config --global user.name "!GIT_NAME!"
    git config --global user.email "!GIT_EMAIL!"
    echo [OK] Git configured!
)
echo [OK] Git already configured!

REM Step 3: Initialize git in current folder
echo.
echo [SETUP] Initializing Git repository...
if not exist ".git" (
    git init
    echo [OK] Git repository initialized
) else (
    echo [OK] Git repository already exists
)

REM Step 4: Add files
echo.
echo [STAGING] Adding all files...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] Files staged

REM Step 5: Show status
echo.
echo [STATUS] Current changes:
echo.
git status --short
echo.

REM Step 6: Get commit message
set COMMIT_MSG=Initial commit: Production-ready portal with low-end device optimization
echo [COMMIT] Using message:
echo   "!COMMIT_MSG!"
echo.
set /p CUSTOM_MSG="Press Enter to confirm, or enter custom message: "
if not "!CUSTOM_MSG!"=="" (
    set COMMIT_MSG=!CUSTOM_MSG!
    echo [COMMIT] Using custom message: "!COMMIT_MSG!"
)

REM Step 7: Commit
echo.
echo [COMMITTING] Creating commit...
git commit -m "!COMMIT_MSG!"
if %errorlevel% neq 0 (
    echo [WARNING] Commit may have failed or no changes to commit
)
echo [OK] Commit done

REM Step 8: Get remote URL
echo.
echo [REMOTE] GitHub repository URL required
echo Example: https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik.git
echo.
set /p REMOTE_URL="Enter GitHub repository URL: "

if "!REMOTE_URL!"=="" (
    echo [ERROR] Remote URL cannot be empty
    pause
    exit /b 1
)

REM Step 9: Add remote
echo.
echo [REMOTE] Adding remote repository...
git remote remove origin >nul 2>&1
git remote add origin !REMOTE_URL!
if %errorlevel% neq 0 (
    echo [ERROR] Failed to add remote
    pause
    exit /b 1
)
echo [OK] Remote added

REM Step 10: Confirm push
echo.
echo ===============================================
echo READY TO PUSH TO GITHUB!
echo ===============================================
echo.
echo Repository: !REMOTE_URL!
echo Commit: !COMMIT_MSG!
echo.
set /p CONFIRM="Continue? (y/n): "
if /i not "!CONFIRM!"=="y" (
    echo [CANCELLED] Push cancelled
    pause
    exit /b 0
)

REM Step 11: Push
echo.
echo [PUSHING] Pushing to GitHub...
echo Please login with your GitHub credentials when prompted
echo (Use Personal Access Token as password - see GIT_SETUP_GUIDE.md)
echo.
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed!
    echo.
    echo Troubleshooting:
    echo 1. Check your internet connection
    echo 2. Verify GitHub URL is correct
    echo 3. Make sure you have access to repository
    echo 4. Try using GitHub Personal Access Token
    echo    https://github.com/settings/tokens
    echo.
) else (
    echo.
    echo ===============================================
    echo [SUCCESS] Push to GitHub completed!
    echo ===============================================
    echo.
    echo Next steps:
    echo 1. Visit: https://github.com (verify files uploaded)
    echo 2. Go to: https://vercel.com/new
    echo 3. Import GitHub repository
    echo 4. Add environment variables (see GITHUB_DEPLOYMENT_GUIDE.md)
    echo 5. Click Deploy
    echo 6. Wait 3-5 minutes
    echo 7. Your app is LIVE! 🚀
    echo.
)

pause
