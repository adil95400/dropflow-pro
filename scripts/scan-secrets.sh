#!/bin/bash
# DropFlow Pro - Security Scanner for Secrets and API Keys
# This script scans the codebase for potential secrets and API keys

set -e

echo "🔒 DropFlow Pro Security Scanner"
echo "-------------------------------"
echo "Scanning for potential secrets and API keys..."

# Define patterns to search for
PATTERNS=(
  # API Keys
  "api[_-]key"
  "apikey"
  "api[_-]secret"
  "apisecret"
  
  # AWS
  "AKIA[0-9A-Z]{16}"
  
  # Stripe
  "sk_live_[0-9a-zA-Z]{24}"
  "pk_live_[0-9a-zA-Z]{24}"
  "rk_live_[0-9a-zA-Z]{24}"
  
  # Google
  "AIza[0-9A-Za-z\\-_]{35}"
  
  # GitHub
  "github[_-]token"
  
  # Generic Tokens
  "access[_-]token"
  "auth[_-]token"
  "secret[_-]key"
  "token"
  "secret"
  "password"
  
  # Private Keys
  "BEGIN PRIVATE KEY"
  "BEGIN RSA PRIVATE KEY"
  "BEGIN DSA PRIVATE KEY"
  "BEGIN EC PRIVATE KEY"
  "BEGIN PGP PRIVATE KEY BLOCK"
  
  # OpenAI
  "sk-[a-zA-Z0-9]{48}"
)

# Directories to exclude
EXCLUDE_DIRS=(
  "node_modules"
  "dist"
  ".git"
  "build"
  ".next"
)

# Files to exclude
EXCLUDE_FILES=(
  "scan-secrets.sh"
  "package-lock.json"
  "yarn.lock"
)

# Build exclude pattern
EXCLUDE_PATTERN=""
for dir in "${EXCLUDE_DIRS[@]}"; do
  EXCLUDE_PATTERN="$EXCLUDE_PATTERN --exclude-dir=$dir"
done

for file in "${EXCLUDE_FILES[@]}"; do
  EXCLUDE_PATTERN="$EXCLUDE_PATTERN --exclude=$file"
done

# Function to check if a file is in .gitignore
is_ignored() {
  git check-ignore -q "$1"
  return $?
}

# Count total files to scan
TOTAL_FILES=$(find . -type f -not -path "*/\.*" | wc -l)
echo "Total files to scan: $TOTAL_FILES"

# Initialize counters
SCANNED=0
FLAGGED=0
FLAGGED_FILES=()

# Scan each file
while IFS= read -r -d '' file; do
  # Skip if file is in .gitignore
  if is_ignored "$file"; then
    continue
  fi
  
  # Update progress
  ((SCANNED++))
  if [ $((SCANNED % 100)) -eq 0 ]; then
    echo -ne "Progress: $SCANNED/$TOTAL_FILES files scanned\r"
  fi
  
  # Check for patterns
  for pattern in "${PATTERNS[@]}"; do
    if grep -i -q "$pattern" "$file"; then
      echo "⚠️  Potential secret found in: $file"
      echo "   Pattern: $pattern"
      echo "   Please review this file manually."
      echo ""
      FLAGGED_FILES+=("$file")
      ((FLAGGED++))
      break
    fi
  done
done < <(find . -type f -not -path "*/\.*" -print0)

echo "-------------------------------"
echo "🔍 Scan complete!"
echo "Files scanned: $SCANNED"
echo "Files flagged: $FLAGGED"

if [ ${#FLAGGED_FILES[@]} -gt 0 ]; then
  echo ""
  echo "⚠️  Files that need review:"
  for file in "${FLAGGED_FILES[@]}"; do
    echo "   - $file"
  done
  echo ""
  echo "Please review these files and ensure no secrets are committed to the repository."
  echo "Consider using environment variables or a secrets management solution."
  exit 1
else
  echo "✅ No potential secrets found!"
  exit 0
fi