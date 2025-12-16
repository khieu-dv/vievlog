#!/bin/bash

# Fix all quote inconsistencies in imports

cd /Users/jpeople/Documents/dev/self2/vvlog

# Find all TypeScript files and fix quotes
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | while IFS= read -r -d '' file; do
  # Fix mixed quotes: from "@/ with ending '
  sed -i '' 's|from "@/\([^"]*\)'"'"';|from '"'"'@/\1'"'"';|g' "$file"
  
  # Fix mixed quotes: from '@/ with ending "
  sed -i '' 's|from '"'"'@/\([^'"'"']*\)";|from '"'"'@/\1'"'"';|g' "$file"
  
  # Ensure all @/ imports use single quotes
  sed -i '' 's|from "@/|from '"'"'@/|g' "$file"
  sed -i '' 's|@/\([^'"'"']*\)";$|@/\1'"'"';|g' "$file"
done

echo "✅ Fixed all quote inconsistencies"
