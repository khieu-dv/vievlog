

## ✅ Cách sửa lỗi `npx tauri init`:

### 🔧 **Cách 1: Dùng `cargo` để khởi tạo Tauri**

```bash
cargo install tauri-cli
cargo tauri init
```

Bạn dùng lệnh cho Android:

```bash
cargo tauri android init
```



Để **chạy dự án Tauri với Next.js** (dev mode), bạn làm theo các bước **chuẩn sau đây**:

---

## ✅ 1. Khởi động dev server của Next.js

Tauri sẽ load frontend từ địa chỉ `http://localhost:3000`, nên trước tiên bạn cần chạy:

```bash
npm run dev
# hoặc
yarn dev
```

---

## ✅ 2. Chạy Tauri ở chế độ dev

Ở một **terminal khác**, chạy:

```bash
cargo tauri dev
```

> ⚠️ Lệnh này sẽ:
>
> * Mở một cửa sổ native Tauri
> * Và load nội dung từ `http://localhost:3000`

---

## ✅ Cấu trúc thư mục sau khi init (ví dụ)

```bash
my-next-app/
├── node_modules/
├── pages/
├── public/
├── src/
├── out/                    # Dùng khi build production
├── src-tauri/              # Tauri files
│   ├── icons/
│   ├── tauri.conf.json
│   └── ...
├── package.json
├── tauri.conf.json
├── tsconfig.json
└── ...
```



## ✅ (Tuỳ chọn) Build production Tauri

Khi bạn đã sẵn sàng để build:

### 1. Export Next.js ra static site:

```bash
npm run build && npm run export
```

> Thư mục `out/` sẽ được tạo.

### 2. Kiểm tra lại trong `src-tauri/tauri.conf.json`:

```json
"build": {
  "distDir": "../out",
  "devPath": "http://localhost:3000"
}
```

### 3. Build app:

```bash
cargo tauri build
```


