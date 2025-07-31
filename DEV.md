git config core.ignorecase false
git add -A
git commit -m "Fix: enforce case-sensitive renames"
git push


# Đổi tên sang tên tạm
git mv src/components/ui/button.tsx src/components/ui/button_temp.tsx
# Commit thay đổi tạm
git commit -m "Rename button.tsx to button_temp.tsx"

# Sau đó đổi sang tên đúng với chữ hoa
git mv src/components/ui/button_temp.tsx src/components/ui/Button.tsx
git commit -m "Rename button_temp.tsx to Button.tsx"
