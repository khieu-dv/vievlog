

# 🎓 **Bài 10: Xác thực và Ủy quyền (Auth)**

## 🎯 **Mục tiêu bài học**

Sau bài học này, học viên sẽ:

* Hiểu khái niệm **xác thực (authentication)** và **ủy quyền (authorization)** trong ứng dụng web.
* Biết cách triển khai **middleware bảo vệ route** trong Next.js App Router.
* Nắm được cách hoạt động của **JWT và Cookie-based Auth** trong môi trường client-server.
* Biết tạo **trang đăng nhập**, **đăng ký**, và kiểm tra trạng thái đăng nhập.
* Hiểu và áp dụng **phân quyền dựa trên vai trò (Role-based Access Control)**.
* Tích hợp với **Golang API backend** để xác thực người dùng.

## 📝 **Nội dung chi tiết**

### 1. 💡 Khái niệm cơ bản

#### ✅ Xác thực (Authentication) là gì?

**Xác thực** là quá trình kiểm tra *bạn là ai* – ví dụ: bạn nhập email và mật khẩu để hệ thống xác nhận danh tính của bạn.

👉 Ví dụ thực tế: Khi bạn đăng nhập vào Gmail bằng tài khoản Google.

#### ✅ Ủy quyền (Authorization) là gì?

**Ủy quyền** là quá trình kiểm tra *bạn được phép làm gì* – ví dụ: sau khi đăng nhập, bạn có được truy cập trang admin không?

👉 Ví dụ thực tế: Một tài khoản bình thường không thể chỉnh sửa quyền người dùng khác.

### 2. 🔐 Các hình thức xác thực phổ biến

| Loại    | Đặc điểm chính                               | Phù hợp với...           |
| ------- | -------------------------------------------- | ------------------------ |
| JWT     | Lưu token trên client (localStorage, cookie) | SPA, API-based apps      |
| Session | Lưu session trên server                      | SSR apps, legacy systems |
| OAuth   | Xác thực thông qua Google, Facebook...       | Social login, bên thứ 3  |

> Trong bài này, ta dùng **JWT + Cookie-based auth** – dễ hiểu, phù hợp với NextJS App Router và API Golang.

### 3. 📁 Kiến trúc tổng quan

```plaintext
/pages
  - login/page.tsx
  - register/page.tsx
  - dashboard/page.tsx
/middleware.ts   ← Bảo vệ route
/lib
  - auth.ts       ← Xử lý xác thực
  - roles.ts      ← Phân quyền
/context
  - auth-context.tsx ← Dùng useContext để chia sẻ trạng thái đăng nhập
```

### 4. 👤 Thiết lập trang **Đăng nhập** & **Đăng ký**

> Sử dụng **ShadcnUI Form + TailwindCSS**

#### 🧱 Mô tả quy trình:

1. Nhập email & mật khẩu.
2. Gửi thông tin đến API Golang (`/auth/login`)
3. Backend trả về `access_token` + `refresh_token`
4. Lưu `access_token` trong **cookie** (HTTP-only).
5. Redirect về `/dashboard`.

#### 📄 Đăng nhập: `/login/page.tsx`

```tsx
"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const res = await axios.post("/api/login", { email, password })
    if (res.status === 200) router.push("/dashboard")
  }

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <Input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <Button onClick={handleLogin}>Đăng nhập</Button>
    </div>
  )
}
```

### 5. ⚙️ Middleware bảo vệ route

#### 🧱 Mô tả:

* Mỗi lần user truy cập `/dashboard`, middleware kiểm tra có token trong cookie hay không.
* Nếu không có, redirect về `/login`.

#### 📄 middleware.ts

```ts
import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard")

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
```

> 🔑 Đừng quên khai báo trong `next.config.js`:

```js
matcher: ["/dashboard/:path*"]
```

### 6. 🔁 Tạo **Auth Context** để chia sẻ trạng thái

#### 📄 context/auth-context.tsx

```tsx
"use client"
import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get("/api/me").then(res => setUser(res.data)).catch(() => setUser(null))
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### 7. 🧑‍💼 Role-Based Access Control (RBAC)

#### 🧱 Mô tả:

* Backend trả về role (admin, user...)
* Frontend kiểm tra vai trò trước khi hiển thị tính năng.

#### 📄 roles.ts

```ts
export const hasRole = (user, role: string) => user?.role === role
```

#### 📄 dashboard/page.tsx

```tsx
import { useAuth } from "@/context/auth-context"
import { hasRole } from "@/lib/roles"

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) return <p>Đang tải...</p>

  return (
    <div>
      <h1>Xin chào, {user.name}</h1>
      {hasRole(user, "admin") && <p>🔧 Trang quản trị dành cho Admin</p>}
    </div>
  )
}
```

## 🏆 **Bài tập thực hành (có lời giải)**

### 📌 Đề bài:

Xây dựng hệ thống đăng nhập bằng JWT & Cookie:

* Giao diện: dùng ShadcnUI.
* Gửi form đến `/api/login`, backend trả JWT.
* Lưu JWT vào cookie.
* Middleware chặn người chưa đăng nhập khi vào `/dashboard`.

### ✅ Lời giải chi tiết:

* [x] Dùng `<Input>` và `<Button>` của Shadcn.
* [x] Gọi API bằng `axios.post("/api/login", {...})`
* [x] Nhận token và lưu bằng `setCookie` trong route handler.
* [x] middleware.ts kiểm tra token.
* [x] Thêm `AuthContext` để quản lý trạng thái đăng nhập.

## 🔑 **Những điểm quan trọng cần lưu ý**

| Khái niệm                       | Lưu ý dễ nhầm lẫn                                |
| ------------------------------- | ------------------------------------------------ |
| `middleware.ts`                 | Không thể truy cập `localStorage`, dùng `cookie` |
| `axios.post`                    | Gửi dữ liệu đúng dạng JSON (`Content-Type`)      |
| `setCookie` trong route handler | Nên sử dụng `httpOnly` để bảo mật                |
| `use client`                    | Cần thiết khi dùng state, hooks phía client      |
| `AuthContext`                   | Không thay thế hoàn toàn middleware              |

## 📝 **Bài tập về nhà**

### 📌 Đề bài:

Tạo một trang `/admin` chỉ cho phép người dùng có vai trò `"admin"` truy cập được. Nếu không phải admin, redirect về `/dashboard`.

### 🔍 Gợi ý:

* Middleware kiểm tra JWT và decode role.
* Nếu không phải admin → `redirect("/dashboard")`
* Trang `/admin/page.tsx` hiển thị nội dung quản trị.

