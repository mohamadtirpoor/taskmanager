#!/bin/bash

echo "========================================"
echo "GitHub Setup Script"
echo "========================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "[ERROR] Git is not installed!"
    echo "Please install Git first"
    exit 1
fi

echo "[OK] Git is installed"
echo ""

# Get repository URL from user
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "[ERROR] Repository URL is required!"
    exit 1
fi

echo ""
echo "========================================"
echo "Step 1: Initializing Git repository"
echo "========================================"
git init
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to initialize Git repository"
    exit 1
fi
echo "[OK] Git repository initialized"
echo ""

echo "========================================"
echo "Step 2: Adding files to Git"
echo "========================================"
git add .
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to add files"
    exit 1
fi
echo "[OK] Files added"
echo ""

echo "========================================"
echo "Step 3: Creating initial commit"
echo "========================================"
git commit -m "Initial commit: Scrum Management Platform with Jira Integration"
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to create commit"
    exit 1
fi
echo "[OK] Initial commit created"
echo ""

echo "========================================"
echo "Step 4: Adding remote repository"
echo "========================================"
git remote add origin "$REPO_URL" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "[WARNING] Remote might already exist, removing and re-adding..."
    git remote remove origin
    git remote add origin "$REPO_URL"
fi
echo "[OK] Remote repository added"
echo ""

echo "========================================"
echo "Step 5: Renaming branch to main"
echo "========================================"
git branch -M main
echo "[OK] Branch renamed to main"
echo ""

echo "========================================"
echo "Step 6: Pushing to GitHub"
echo "========================================"
echo "This may ask for your GitHub credentials..."
echo ""
git push -u origin main
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to push to GitHub"
    echo ""
    echo "Possible reasons:"
    echo "1. Wrong repository URL"
    echo "2. No permission to push"
    echo "3. Authentication failed"
    echo ""
    echo "Please check your credentials and try again"
    exit 1
fi

echo ""
echo "========================================"
echo "SUCCESS! Project uploaded to GitHub"
echo "========================================"
echo ""
echo "Your project is now available at:"
echo "$REPO_URL"
echo ""
echo "Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Add a description"
echo "3. Add topics/tags"
echo "4. Invite collaborators if needed"
echo ""
