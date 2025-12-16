
# 🎓 **Bài 1: Giới thiệu NextJS App router và xây dựng ứng dụng**


## 🎯 Mục tiêu bài học


✅ Hiểu được **Next.js là gì** và lý do nên sử dụng Next.js   
✅ Biết sự khác nhau giữa **App Router** và **Pages Router**  
✅ Hiểu rõ cấu trúc thư mục mới với `app/`  
✅ Phân biệt được **Server Component** và **Client Component**  


## 📝 Nội dung chi tiết

### 1. **Next.js là gì và tại sao nên sử dụng?**

**Khái niệm**:
Next.js là một **React framework** phát triển bởi Vercel, giúp xây dựng ứng dụng web **hiệu suất cao, có khả năng SEO tốt**, hỗ trợ cả **SSR (server-side rendering)** và **SSG (static site generation)**.



### 2. **App Router vs Pages Router**

| Tiêu chí       | Pages Router (`pages/`)  | App Router (`app/`)                   |
| -------------- | ------------------------ | ------------------------------------- |
| Cách routing   | Theo file trong `pages/` | Theo file trong `app/`                |
| Component type | Chỉ có Client Component  | Hỗ trợ Server & Client Component      |
| Layout         | Không có Layout gốc      | Có layout lồng nhau (`layout.tsx`)    |
| Ưu điểm        | Đơn giản, quen thuộc     | Hiện đại, mạnh mẽ, tối ưu performance |



### 3. **Cấu trúc thư mục App Router**

```
my-app/
├── app/
│   ├── layout.tsx    
│   ├── page.tsx      
│   └── about/
│       └── page.tsx  
├── public/           
├── styles/           
├── tsconfig.json     
└── next.config.js    
```


### 4. **Server Component vs Client Component**

**Khái niệm**:

* **Server Component**:

  * Mặc định trong App Router.
  * Được render **trên server**, không gửi JavaScript không cần thiết về client.
  * Không dùng `useState`, `useEffect`, `onClick`,...

* **Client Component**:

  * Dùng khi cần interactivity (nút nhấn, hiệu ứng, state).
  * Phải khai báo `"use client"` ở đầu file.



## 💻 **Thực hành: Tạo dự án Next.js đầu tiên với App Router**

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

> 🔎 `--app`: Chọn App Router  
> 🔎 `--typescript`: Tạo project với TypeScript  


## 🏆 **Bài tập thực hành**

### 🔖 Đề bài:

Hãy tạo thêm 1 trang mới tên là **Giới thiệu (About)** tại đường dẫn `/about`. Trang này hiển thị tiêu đề và đoạn mô tả về Next.js.



## 🔑 Những điểm quan trọng cần lưu ý

| Điểm cần chú ý                                                              |
| --------------------------------------------------------------------------- |
| App Router sử dụng thư mục `app/` thay vì `pages/`                          |
| `layout.tsx` phải trả về cấu trúc `<html><body>{children}</body></html>`    |
| Server Component là mặc định, chỉ thêm `"use client"` khi cần interactivity |
| `page.tsx` = mỗi route trong app/                                           |


## 📝 Bài tập về nhà

### 🧠 Đề bài:

Tạo thêm một trang tên là **Liên hệ (Contact)** tại đường dẫn `/contact`, gồm các nội dung:

* Tiêu đề: "Liên hệ với chúng tôi"
* Đoạn mô tả: "Bạn có thể gửi email đến [contact@myapp.com](mailto:contact@myapp.com) để liên hệ."

> 💡 Mở rộng: Hãy thử thêm CSS class Tailwind như `bg-white`, `shadow`, `rounded` vào trang này để luyện tập thêm.

