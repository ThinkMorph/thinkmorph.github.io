#!/bin/bash

# ThinkMorph Website Deployment Script

echo "🚀 Deploying ThinkMorph website..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "⚠️  No remote repository configured."
    echo "Please run: git remote add origin https://github.com/ThinkMorph/thinkmorph.github.io.git"
    echo "Or create and configure your GitHub repository first."
    exit 1
fi

# Add changes
echo "📝 Adding changes..."
git add .

# Get commit message from user or use default
if [ -z "$1" ]; then
    COMMIT_MSG="Update website: $(date '+%Y-%m-%d %H:%M:%S')"
else
    COMMIT_MSG="$1"
fi

# Commit
echo "💾 Committing changes..."
git commit -m "$COMMIT_MSG"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site will be updated at: https://thinkmorph.github.io"
echo "⏳ Changes may take 1-2 minutes to appear"
echo ""

