
# 🎓 **Bài 2: Cấu trúc thư mục App Router trong Next.js**


## 🎯 **Mục tiêu bài học**

Sau khi hoàn thành bài học này, học viên sẽ:

✅ Hiểu rõ vai trò và chức năng của thư mục `app/` trong Next.js  
✅ Nắm được cách hoạt động của các file đặc biệt: `page.tsx`, `layout.tsx`, `loading.tsx`    
✅ Biết cách tạo route cơ bản và tổ chức layout dùng lại giữa các trang  
✅ Làm quen với route groups, dynamic routes và metadata  
 

## 📝 **Nội dung chi tiết**

### 1. 🔍 Giới thiệu thư mục `app/`

**Khái niệm**:
Thư mục `app/` là trung tâm của cấu trúc routing mới trong Next.js kể từ phiên bản 13+. Mỗi thư mục con bên trong `app/` đại diện cho một route.


**Ví dụ**:

```bash
app/
├── layout.tsx    
├── page.tsx      
├── about/
│   └── page.tsx  
└── contact/
    └── page.tsx  
```


### 2. 📄 Các file đặc biệt trong App Router

#### ✅ `page.tsx`

* Là **entry point** của mỗi route.
* Mỗi folder có file `page.tsx` sẽ tạo ra một route tương ứng.

📌 **Ví dụ**:
`app/about/page.tsx` → route `/about`

#### ✅ `layout.tsx`

* Xác định layout cho toàn bộ hoặc một phần cụ thể của ứng dụng.
* Layout được dùng lại khi chuyển route → tránh render lại các phần không đổi.

📌 **Ví dụ**:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

#### ✅ `loading.tsx`

* Tự động hiển thị khi đang chờ load component bên trong (đặc biệt khi fetch data).
* Giúp nâng cao trải nghiệm người dùng.

📌 **Ví dụ**:

```tsx
// app/about/loading.tsx
export default function Loading() {
  return <p>Đang tải trang Giới thiệu...</p>
}
```

### 3. 📁 Route Groups và Dynamic Routes

#### ✅ Route Groups

* Nhóm các route mà **không ảnh hưởng đến URL**.
* Dùng để tổ chức code, áp dụng layout chung.

📌 Cú pháp: `(group-name)`

```bash
app/
├── (public)/
│   ├── about/page.tsx    
│   └── contact/page.tsx 
```

> ⚠️ URL không chứa `(public)`, chỉ để tổ chức file.


#### ✅ Dynamic Routes

* Cho phép route động theo tham số

📌 Cú pháp: `[param]`

```bash
app/products/[id]/page.tsx → "/products/123"
```

**Cách sử dụng `params`**:

```tsx
export default function ProductPage({ params }) {
  return <p>ID sản phẩm: {params.id}</p>
}
```


### 4. 🌐 Metadata và SEO trong App Router

**Khái niệm**: Metadata là thông tin giúp cải thiện SEO, chia sẻ mạng xã hội, hiển thị title...

📌 Tích hợp bằng cách export `metadata` trong mỗi `page.tsx` hoặc `layout.tsx`:

```tsx
export const metadata = {
  title: "Trang Giới Thiệu",
  description: "Thông tin về công ty WatchControls",
}
```

> Metadata được render ở `<head>` và hỗ trợ tự động cập nhật theo route.


## 🏆 **Bài tập thực hành**

### 🔧 Đề bài:

**Mục tiêu**: Tạo website gồm các route: `/`, `/about`, `/contact`
**Yêu cầu**:

* Tạo layout chung cho toàn bộ trang
* Trang loading riêng cho `/about`
* Thêm metadata cho từng trang


#### YC: cấu trúc thư mục

```bash
app/
├── layout.tsx
├── page.tsx
├── about/
│   ├── page.tsx
│   └── loading.tsx
├── contact/
│   └── page.tsx
```


## 🔑 **Những điểm quan trọng cần lưu ý**

| Khái niệm            | Ghi nhớ                                                        |
| -------------------- | -------------------------------------------------------------- |
| `page.tsx`           | Entry point của từng route                                     |
| `layout.tsx`         | Dùng để bọc layout cho toàn bộ hoặc một phần ứng dụng          |
| `loading.tsx`        | Hiển thị khi đang fetch hoặc lazy load component               |
| Route Group `(name)` | Tổ chức code, không ảnh hưởng đến URL                          |
| `[param]`            | Dynamic route, lấy dữ liệu động từ URL                         |
| `metadata`           | Thêm title, description,... phục vụ SEO và chia sẻ mạng xã hội |

## 📝 **Bài tập về nhà**

**Đề bài**:

1. Tạo thêm một route `/services` để hiển thị danh sách dịch vụ.
2. Thêm `layout.tsx` riêng cho `services/` để hiển thị thanh sidebar trái.
3. Thêm metadata cho trang `/services`.

📌 Gợi ý:

* `app/services/layout.tsx` → chứa `sidebar`
* `app/services/page.tsx` → nội dung chính
* Dùng `export const metadata = {...}` như đã học


