#!/bin/bash
# DropFlow Pro - Auto Push Script
# Automatically commits and pushes changes to the repository

set -e

echo "🚀 DropFlow Pro Auto-Push Tool"
echo "-----------------------------"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed or not in PATH"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📂 Current branch: $CURRENT_BRANCH"

# Check for changes
STATUS=$(git status --porcelain)

if [ -z "$STATUS" ]; then
    echo "✅ No changes to push"
    exit 0
fi

echo "🔍 Changes detected:"
echo "$STATUS"

# Add all changes
git add .
echo "✅ Added all changes to staging area"

# Get commit message from argument or use default
COMMIT_MESSAGE=${1:-"Auto-sync: Update files $(date +%Y-%m-%d-%H-%M-%S)"}

# Commit changes
git commit -m "$COMMIT_MESSAGE"
echo "✅ Committed changes with message: \"$COMMIT_MESSAGE\""

# Pull latest changes first to avoid conflicts
echo "🔄 Pulling latest changes..."
git pull origin $CURRENT_BRANCH || echo "⚠️ Failed to pull latest changes. There might be conflicts."

# Push changes
echo "🚀 Pushing to $CURRENT_BRANCH..."
git push origin $CURRENT_BRANCH
echo "✅ Changes pushed successfully"

echo "✨ Done! Your changes are now live."