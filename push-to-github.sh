#!/bin/bash

# Portal Regulasi - Git Push Helper Script
# For macOS and Linux users

echo ""
echo "========================================="
echo "Portal Regulasi - Git Push Helper"
echo "========================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed!"
    echo ""
    echo "Please install Git:"
    echo "  macOS: brew install git"
    echo "  Linux: sudo apt-get install git"
    echo ""
    exit 1
fi

echo "[1/6] Checking git configuration..."
if ! git config --global user.name &> /dev/null; then
    echo ""
    echo "ERROR: Git user not configured!"
    echo "Please run these commands first:"
    echo "  git config --global user.name \"Your Name\""
    echo "  git config --global user.email \"your.email@gmail.com\""
    echo ""
    exit 1
fi
echo "[OK] Git configured"

echo ""
echo "[2/6] Checking git status..."
if ! git status &> /dev/null; then
    echo "[INIT] Not a git repository, initializing..."
    git init
fi
echo "[OK] Git status OK"

echo ""
echo "[3/6] Staging all files..."
git add .
echo "[OK] Files staged"

echo ""
echo "[4/6] Showing changes..."
git status --short

echo ""
echo "[5/6] Enter commit message"
read -p "Commit message (default: 'Update app'): " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-"Update app"}

echo ""
echo "Committing: \"$COMMIT_MSG\""
git commit -m "$COMMIT_MSG"

echo ""
echo "[6/6] Checking remote..."
if ! git remote get-url origin &> /dev/null; then
    echo ""
    echo "[WARNING] No remote repository configured!"
    echo ""
    echo "You need to add GitHub repository:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/portal-regulasi-kepolisian-futuristik.git"
    echo ""
    exit 1
fi

echo ""
echo "========================================="
echo "Ready to push to GitHub!"
echo "========================================="
echo ""
read -p "Continue with push? (y/n): " PROCEED

if [[ "$PROCEED" == "y" || "$PROCEED" == "Y" ]]; then
    echo ""
    echo "Pushing to GitHub..."
    git push origin main
    
    echo ""
    echo "========================================="
    echo "[SUCCESS] Push completed!"
    echo "========================================="
    echo ""
    echo "Next steps:"
    echo "1. Go to: https://vercel.com/new"
    echo "2. Import your GitHub repository"
    echo "3. Add environment variables"
    echo "4. Click Deploy"
    echo ""
else
    echo "[CANCELLED] Push cancelled"
fi
