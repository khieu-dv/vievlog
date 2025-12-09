

# 📘 **Bài 6: Xây dựng Layout và Navigation**

## 🎯 Mục tiêu bài học


* Hiểu và áp dụng được **khái niệm layout lồng nhau (layout nesting)** trong App Router.
* Tạo và quản lý **layout đặc biệt** cho từng nhóm route (ví dụ: trang xác thực, trang admin).
* Xây dựng **navigation menu** thân thiện với người dùng bằng `next/link` và `usePathname`.
* Tạo **metadata động** để hỗ trợ SEO và chia sẻ mạng xã hội.
* Biết cách thiết kế layout **responsive** kết hợp giữa **TailwindCSS** và **ShadcnUI**.

## 🧠 **Nội dung chi tiết**

### 1. **Layout là gì trong NextJS App Router?**

**Khái niệm**:
Trong App Router, `layout.tsx` định nghĩa **khung giao diện (layout)** dùng chung cho các trang con bên trong nó. Nó cho phép tái sử dụng các phần như Header, Sidebar, Footer.

**Ví dụ thực tế**: Layout chính cho toàn bộ app có thể chứa Navigation bar, trong khi layout của trang xác thực chỉ là một box nhỏ.

### 2. **Layout lồng nhau (Nested Layouts)**

**Khái niệm**:
NextJS cho phép tạo **layout bên trong layout**, nghĩa là layout ở thư mục cha bao bọc layout của thư mục con. Điều này giúp tổ chức UI một cách rõ ràng và hiệu quả.

**Ví dụ thư mục**:

```
/app
  layout.tsx ← layout chính
  /auth
    layout.tsx ← layout riêng cho trang auth
    login/page.tsx
    register/page.tsx
  /dashboard
    layout.tsx ← layout riêng cho dashboard
    page.tsx
```

### 3. **Tạo Layout Cơ Bản**

Tạo `app/layout.tsx`:

```tsx
// app/layout.tsx
import "~/styles/globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 text-gray-900">
        <header className="p-4 shadow bg-white">Logo & Navigation</header>
        <main className="p-6">{children}</main>
        <footer className="p-4 text-center text-sm text-gray-500">© 2025</footer>
      </body>
    </html>
  );
}
```

### 4. **Tạo Layout cho Trang Đăng Nhập/Đăng Ký**

Tạo `app/auth/layout.tsx`:

```tsx
// app/auth/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">{children}</div>
    </div>
  );
}
```

### 5. **Navigation với `next/link`**

**Khái niệm**:
`next/link` giúp tạo link chuyển trang trong SPA mà không reload lại toàn bộ trang.

**Ví dụ**:

```tsx
// components/Navbar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="flex space-x-4">
      {["/", "/about", "/dashboard"].map((path) => (
        <Link
          key={path}
          href={path}
          className={`px-3 py-2 rounded ${
            pathname === path ? "bg-blue-600 text-white" : "text-gray-700"
          }`}
        >
          {path === "/" ? "Trang chủ" : path.replace("/", "").toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
```

### 6. **Metadata động và SEO**

**Khái niệm**:
NextJS cho phép định nghĩa metadata cho từng trang để hỗ trợ SEO.

**Ví dụ**:

```tsx
// app/about/page.tsx
export const metadata = {
  title: "Giới thiệu - Vievlog",
  description: "Trang giới thiệu về ứng dụng Vievlog.",
};
```

### 7. **Responsive Navigation với TailwindCSS & ShadcnUI**

Dùng component từ ShadcnUI:

```tsx
// components/ResponsiveNav.tsx
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function ResponsiveNav() {
  return (
    <div className="md:hidden flex justify-between items-center p-4 border-b">
      <span className="font-bold text-xl">Vievlog</span>
      <Button variant="outline" size="icon">
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  );
}
```

Kết hợp với menu full trong `md:flex` để có layout thích ứng.

## 🏆 Bài tập thực hành

### 🧾 Đề bài:

> **Tạo một hệ thống layout cho ứng dụng có 2 vùng layout:**
>
> * `app/layout.tsx` chứa navigation chung và footer.
> * `app/auth/layout.tsx` dùng riêng cho `login` và `register`, không có navigation.
>   Đồng thời, tạo một navigation menu highlight tab hiện tại bằng `usePathname`.

### ✅ Lời giải & Phân tích:

**1. Cấu trúc thư mục**:

```
app/
  layout.tsx
  page.tsx
  about/page.tsx
  auth/
    layout.tsx
    login/page.tsx
    register/page.tsx
  components/
    Navbar.tsx
```

**2. Navigation component**:

```tsx
// app/components/Navbar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { name: "Trang chủ", href: "/" },
    { name: "Giới thiệu", href: "/about" },
  ];

  return (
    <nav className="flex space-x-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-4 py-2 rounded ${
            pathname === link.href ? "bg-blue-600 text-white" : "text-gray-800"
          }`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
}
```

**3. Tích hợp vào layout chính**:

```tsx
// app/layout.tsx
import Navbar from "./components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <footer className="text-sm text-gray-500 p-4 text-center">© 2025</footer>
      </body>
    </html>
  );
}
```

**4. Layout auth đơn giản**:

```tsx
// app/auth/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">{children}</div>
    </div>
  );
}
```

## 🔑 Những điểm quan trọng cần lưu ý

| Nội dung                | Cần ghi nhớ                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| Layout trong App Router | `layout.tsx` sẽ bao bọc các `page.tsx` bên trong cùng cấp thư mục             |
| Nested layout           | Có thể tạo nhiều lớp layout trong các thư mục con (auth, dashboard,...)       |
| `next/link`             | Luôn dùng để thay thế `<a>` trong nội bộ ứng dụng để tránh reload trang       |
| `usePathname`           | Dùng để biết URL hiện tại, hỗ trợ highlight menu hoặc breadcrumbs             |
| Metadata                | Giúp cải thiện SEO, nên khai báo ở mỗi `page.tsx`                             |
| Navigation responsive   | Sử dụng Tailwind (`hidden`, `block`, `md:flex`,...) và ShadcnUI cho giao diện |

## 📝 Bài tập về nhà

> **Tạo thêm một layout riêng cho phần `dashboard`:**
>
> * `app/dashboard/layout.tsx` có sidebar bên trái chứa 3 menu: Tổng quan, Cài đặt, Người dùng.
> * Tạo `dashboard/page.tsx` hiển thị "Chào mừng đến Dashboard"
> * Khi người dùng truy cập vào /dashboard, sidebar phải luôn hiển thị và menu hiện tại được highlight.

👉 **Gợi ý**: Sử dụng `usePathname` để kiểm tra đường dẫn và highlight menu tương ứng.

