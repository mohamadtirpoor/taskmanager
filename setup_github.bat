@echo off
echo ========================================
echo GitHub Setup Script
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Get repository URL from user
set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL is required!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 1: Initializing Git repository
echo ========================================
git init
if errorlevel 1 (
    echo [ERROR] Failed to initialize Git repository
    pause
    exit /b 1
)
echo [OK] Git repository initialized
echo.

echo ========================================
echo Step 2: Adding files to Git
echo ========================================
git add .
if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)
echo [OK] Files added
echo.

echo ========================================
echo Step 3: Creating initial commit
echo ========================================
git commit -m "Initial commit: Scrum Management Platform with Jira Integration"
if errorlevel 1 (
    echo [ERROR] Failed to create commit
    pause
    exit /b 1
)
echo [OK] Initial commit created
echo.

echo ========================================
echo Step 4: Adding remote repository
echo ========================================
git remote add origin %REPO_URL%
if errorlevel 1 (
    echo [WARNING] Remote might already exist, removing and re-adding...
    git remote remove origin
    git remote add origin %REPO_URL%
)
echo [OK] Remote repository added
echo.

echo ========================================
echo Step 5: Renaming branch to main
echo ========================================
git branch -M main
echo [OK] Branch renamed to main
echo.

echo ========================================
echo Step 6: Pushing to GitHub
echo ========================================
echo This may ask for your GitHub credentials...
echo.
git push -u origin main
if errorlevel 1 (
    echo [ERROR] Failed to push to GitHub
    echo.
    echo Possible reasons:
    echo 1. Wrong repository URL
    echo 2. No permission to push
    echo 3. Authentication failed
    echo.
    echo Please check your credentials and try again
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Project uploaded to GitHub
echo ========================================
echo.
echo Your project is now available at:
echo %REPO_URL%
echo.
echo Next steps:
echo 1. Visit your repository on GitHub
echo 2. Add a description
echo 3. Add topics/tags
echo 4. Invite collaborators if needed
echo.
pause
