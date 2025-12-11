# Bước 1: Xóa toàn bộ cache trong Git index

git rm -r --cached .

# Bước 2: Add lại toàn bộ file theo đúng case hiện tại

git add .

# Bước 3: Commit thay đổi

git commit -m "Clear Git cache and re-add all files with correct casing"

# Bước 4: Push lên GitHub

git push origin <tên-nhánh-của-bạn>

rustup override set 1.85.0

---

## 🔹 1. Cài đặt các gói cần thiết

Mở Terminal và chạy:

```bash
xcode-select --install   # cài Xcode Command Line Tools
brew install cmake python node git
```

---

## 🔹 2. Clone Emscripten SDK (emsdk)

```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
```

---

## 🔹 3. Cài đặt phiên bản mới nhất của Emscripten

```bash
./emsdk install latest
./emsdk activate latest
```

---

## 🔹 4. Thiết lập biến môi trường

Mỗi lần mở terminal bạn cần load môi trường của Emscripten:

```bash
source ./emsdk_env.sh
```

👉 Nếu muốn tự động bật mỗi lần mở terminal, thêm vào cuối file `~/.zshrc` (nếu bạn dùng zsh):

```bash
source /path/to/emsdk/emsdk_env.sh
```

> Thay `/path/to/emsdk/` bằng đường dẫn thật tới thư mục emsdk.

---

## 🔹 5. Kiểm tra cài đặt

Chạy:

```bash
emcc -v
```

Nếu thấy hiện version (ví dụ `emcc (Emscripten gcc/clang-like replacement) ...`) là thành công 🎉

---

## 🔹 6. Ví dụ test nhỏ

Tạo file `hello.cpp`:

```cpp
#include <iostream>
int main() {
    std::cout << "Hello from C++ WASM!" << std::endl;
    return 0;
}
```

Biên dịch sang WebAssembly:

```bash
emcc hello.cpp -o hello.html
```

Chạy:

```bash
python3 -m http.server 8080
```

Mở trình duyệt và vào `http://localhost:8080/hello.html` → bạn sẽ thấy chương trình chạy bằng WebAssembly.
