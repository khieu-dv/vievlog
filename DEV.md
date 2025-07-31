# Bước 1: Xóa toàn bộ cache trong Git index
git rm -r --cached .

# Bước 2: Add lại toàn bộ file theo đúng case hiện tại
git add .

# Bước 3: Commit thay đổi
git commit -m "Clear Git cache and re-add all files with correct casing"

# Bước 4: Push lên GitHub
git push origin <tên-nhánh-của-bạn>
