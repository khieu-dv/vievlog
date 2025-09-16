#!/bin/bash

# Find all .md files, excluding the .git directory, and rename them to .mdx
for file in $(find . -path ./.git -prune -o -name "*.md" -print); do
    mv "$file" "${file%.md}.mdx"
done

echo "Đã chuyển đổi xong các tệp .md thành .mdx"
