

# 🎓 **BÀI 4: TailwindCSS và Styling trong NextJS App Router**



## 🎯 **Mục tiêu bài học**


* Hiểu rõ cách **cài đặt và cấu hình TailwindCSS** trong dự án NextJS với App Router.
* Nắm được **triết lý “Utility-First”** của TailwindCSS.
* Sử dụng các lớp Tailwind để **thiết kế giao diện nhanh chóng và có tổ chức**.
* Biết cách áp dụng **Responsive Design**, **Dark Mode** và **tùy chỉnh theme** với TailwindCSS.
* Hiểu được sự khác biệt và khi nào nên dùng **TailwindCSS** so với **CSS Modules**.
* Có thể xây dựng một giao diện **đẹp, nhất quán và phản hồi tốt trên nhiều thiết bị**.



## 📝 **Nội dung chi tiết**

### 1. **Giới thiệu TailwindCSS là gì?**

TailwindCSS là một **utility-first CSS framework**, cung cấp các class ngắn gọn để bạn *styling trực tiếp trong HTML/JSX*. Không cần viết CSS riêng.

**Ví dụ:**
Thay vì viết:

```css
.btn {
  background-color: blue;
  padding: 8px;
  color: white;
}
```

Bạn chỉ cần viết trong JSX:

```jsx
<button className="bg-blue-500 px-4 py-2 text-white">Click</button>
```

➡️ **Ưu điểm:** nhanh, dễ tái sử dụng, dễ kiểm soát style trong component.

### 2. **Cài đặt TailwindCSS vào dự án NextJS**

👉 Hướng dẫn học viên làm từng bước:

#### ✅ Bước 1: Cài Tailwind

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### ✅ Bước 2: Cấu hình `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### ✅ Bước 3: Tạo `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Rồi import vào `app/layout.tsx`:

```tsx
import "./globals.css";
```



### 3. **Utility-First CSS là gì?**

Khái niệm “Utility-First” có nghĩa là sử dụng các **class nhỏ, cụ thể để style từng thuộc tính** (thay vì dùng class tổng hợp như trong Bootstrap).

**Ví dụ:**

```html
<div className="bg-gray-100 text-center py-4 rounded shadow-md">
  Welcome to Tailwind!
</div>
```



### 4. **Responsive Design trong TailwindCSS**

Tailwind hỗ trợ responsive theo breakpoint:

* `sm`: ≥ 640px
* `md`: ≥ 768px
* `lg`: ≥ 1024px
* `xl`: ≥ 1280px

**Ví dụ:**

```jsx
<p className="text-sm md:text-lg">Responsive Text</p>
```

➡️ Trên mobile: nhỏ, trên tablet: lớn hơn.



### 5. **Triển khai Dark Mode**

Tailwind hỗ trợ chế độ tối với `dark:` prefix.

#### ✅ Cấu hình:

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',
}
```

#### ✅ Sử dụng:

```html
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Dark Mode Ready!
</div>
```

➡️ Bạn có thể dùng toggle:

```tsx
document.documentElement.classList.toggle('dark');
```



### 6. **Tùy chỉnh Theme TailwindCSS**

Bạn có thể mở rộng màu, font, spacing... trong `tailwind.config.js`

**Ví dụ: Thêm màu thương hiệu**

```js
theme: {
  extend: {
    colors: {
      brand: '#0070f3'
    }
  }
}
```

Dùng trong code:

```jsx
<h1 className="text-brand text-2xl">My Brand</h1>
```



### 7. **So sánh TailwindCSS vs CSS Modules**

| Tiêu chí          | TailwindCSS         | CSS Modules           |
| ----------------- | ------------------- | --------------------- |
| Tốc độ phát triển | ⚡ Rất nhanh         | 🐢 Trung bình         |
| Tái sử dụng       | ⭐⭐ (qua components) | ⭐⭐⭐ (class reuse tốt) |
| Quản lý dự án lớn | Cần tổ chức tốt     | Có thể gọn gàng hơn   |
| Learning curve    | Dễ trung cấp        | Dễ cơ bản             |

➡️ **Lời khuyên:** Dùng Tailwind cho layout, spacing, responsive. CSS modules cho các style phức tạp hoặc độc lập.



## 🏆 **Bài tập thực hành (có lời giải)**

### **🎯 Đề bài:**

Xây dựng một *"Profile Card"* responsive, có hỗ trợ dark mode, dùng TailwindCSS. Card gồm:

* Avatar
* Tên người dùng
* Email
* Nút "Follow"

### **✅ Lời giải và phân tích:**

```tsx
// components/ProfileCard.tsx
export default function ProfileCard() {
  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center">
      <img
        className="w-24 h-24 rounded-full mx-auto mb-4"
        src="https://i.pravatar.cc/150?img=3"
        alt="User avatar"
      />
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Nguyen Van A</h2>
      <p className="text-gray-600 dark:text-gray-300">nguyenvana@example.com</p>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Follow
      </button>
    </div>
  );
}
```

### 🧠 Phân tích:

* `dark:` để hỗ trợ giao diện tối.
* `max-w-sm` và `mx-auto` tạo bố cục giữa màn hình.
* `hover:bg-blue-600 transition` giúp UX mượt mà.
* Tối ưu thiết kế responsive không cần media queries.



## 🔑 **Những điểm quan trọng cần lưu ý**

| Chủ đề         | Ghi nhớ                                                                                |
| -------------- | -------------------------------------------------------------------------------------- |
| Dark Mode      | Phải dùng `darkMode: 'class'` và toggle class bằng JS                                  |
| Responsive     | Sử dụng prefix như `md:`, `lg:`… để thay đổi theo breakpoint                           |
| Lỗi phổ biến   | Không import `globals.css` vào layout ➜ Tailwind không hoạt động                       |
| Ghi đè style   | Tailwind theo thứ tự class: lớp sau ghi đè lớp trước                                   |
| Phối hợp class | Dễ bị lặp lại class, nên tách component hoặc dùng thư viện `clsx`, `tailwind-variants` |



## 📝 **Bài tập về nhà**

### **🎯 Đề bài:**

Tạo một giao diện đơn giản cho một blog post:

* Tiêu đề bài viết
* Ảnh minh họa (img)
* Nội dung bài viết (2 đoạn văn)
* Giao diện cần **responsive** và có hỗ trợ **dark mode**

➡️ Sử dụng `tailwind.config.js` để tùy chỉnh màu nền theo chủ đề blog của bạn (ví dụ: màu pastel nhẹ).
