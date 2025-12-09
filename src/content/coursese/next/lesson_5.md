
# 🎓 **Bài 5: ShadcnUI - Thư viện Component UI**

## 🎯 Mục tiêu bài học


* Hiểu **ShadcnUI là gì** và **vì sao nên sử dụng** thay vì các thư viện UI khác.
* Biết cách **cài đặt và cấu hình ShadcnUI** trong dự án Next.js App Router.
* Sử dụng thành thạo các **component phổ biến** như `Button`, `Input`, `Card`, `Dialog`, `Form`,...
* Biết cách **tùy chỉnh theme** và tích hợp hoàn hảo với **TailwindCSS**.
* Tự tin xây dựng **một giao diện form đăng nhập** với ShadcnUI theo tiêu chuẩn hiện đại.

## 📝 Nội dung chi tiết

### 1. 📌 ShadcnUI là gì?

**Mô tả:**
ShadcnUI là **thư viện component UI mã nguồn mở** được xây dựng bằng **React**, **TailwindCSS**, và **Radix UI**. Điểm đặc biệt là **bạn tự sở hữu code** – các component được thêm trực tiếp vào dự án, cho phép bạn tùy chỉnh dễ dàng, không bị ràng buộc bởi package bên ngoài.

**Điểm nổi bật của ShadcnUI:**

* Sử dụng **TailwindCSS thuần** ➜ dễ kiểm soát styling.
* Dựa trên **Radix UI** ➜ accessibility cao, keyboard support tốt.
* **TypeScript-ready** ➜ typing chính xác.
* Component theo **design system chuẩn**: Button, Input, Card, Form, Dialog...

**So sánh ngắn với các thư viện khác:**

| Thư viện     | Mức tùy chỉnh | Tối ưu Tailwind | Code kiểm soát | Accessibility |
| ------------ | ------------- | --------------- | -------------- | ------------- |
| **ShadcnUI** | ✅ Cao         | ✅ Tuyệt vời     | ✅ Có           | ✅ Tốt         |
| MUI          | ❌ Thấp        | ❌ Ràng buộc CSS | ❌ Không có     | ✅ Tốt         |
| Chakra UI    | ⚠ Trung bình  | ❌ Không dùng    | ❌ Không có     | ✅ Tốt         |
| Tailwind UI  | ⚠ Cao         | ✅ Tốt           | ⚠ Giới hạn     | ⚠ Thủ công    |

### 2. ⚙️ Cài đặt ShadcnUI

**Bước 1: Cài đặt CLI**

```bash
npx shadcn-ui@latest init
```

* Chọn framework: `Next.js (App Router)`
* Tailwind config tự động được cập nhật.
* Tự động thêm các file cần thiết như `components/ui`, `lib/utils.ts`, `tailwind.config.ts`

**Bước 2: Cấu hình ThemeProvider**

Thêm vào `app/layout.tsx`:

```tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 3. 🧱 Làm quen với các Component phổ biến

#### 🧩 3.1 Button

**Mô tả:**
Component `Button` hỗ trợ nhiều biến thể (`variant`), trạng thái (`loading`, `disabled`), size.

**Ví dụ:**

```tsx
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="space-x-2">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  );
}
```

#### 🧩 3.2 Input

**Mô tả:**
Input được thiết kế đơn giản nhưng hỗ trợ đầy đủ `placeholder`, `disabled`, `type`,...

**Ví dụ:**

```tsx
import { Input } from "@/components/ui/input";

export default function InputExample() {
  return <Input placeholder="Nhập email của bạn" type="email" />;
}
```

#### 🧩 3.3 Card

**Mô tả:**
Card là container giao diện lý tưởng cho hiển thị nội dung theo dạng khối.

**Ví dụ:**

```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CardExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chào mừng!</CardTitle>
      </CardHeader>
      <CardContent>Đây là nội dung của card.</CardContent>
    </Card>
  );
}
```

#### 🧩 3.4 Form (với Zod)

**Mô tả:**
Form Shadcn kết hợp với `react-hook-form` và `zod` để validate form mạnh mẽ.

**Cài đặt:**

```bash
npm install react-hook-form zod @hookform/resolvers
```

**Ví dụ Form:**

```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email(),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("email")} placeholder="Email" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <Button type="submit">Gửi</Button>
    </form>
  );
}
```

### 🧩 3.5 Dialog (Modal)

**Mô tả:**
`Dialog` là modal component có thể mở/đóng linh hoạt.

**Ví dụ:**

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Hiển thị Modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thông báo</DialogTitle>
        </DialogHeader>
        <p>Đây là nội dung của Modal!</p>
      </DialogContent>
    </Dialog>
  );
}
```

## 🧪 Bài tập thực hành có lời giải

### 📌 Đề bài: Xây dựng form đăng nhập sử dụng ShadcnUI

**Yêu cầu:**

* Form gồm 2 trường: `email` và `password`
* Validate với `zod`: email phải đúng định dạng, password không được rỗng
* Có trạng thái loading khi submit
* Hiển thị lỗi rõ ràng

### ✅ Lời giải và phân tích:

```tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      console.log(data);
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[300px]">
      <Input {...register("email")} placeholder="Email" />
      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

      <Input {...register("password")} placeholder="Mật khẩu" type="password" />
      {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
```

## 🔑 Những điểm quan trọng cần lưu ý

| 💡 Khái niệm                                                                                 | 🔍 Ghi nhớ |
| -------------------------------------------------------------------------------------------- | ---------- |
| **ShadcnUI** là *không phải là package*, mà là bộ sưu tập component copy vào project của bạn |            |
| **Tích hợp Tailwind** rất chặt chẽ ➜ cần hiểu cơ bản về Tailwind trước                       |            |
| **Cấu trúc folder**: component được lưu tại `components/ui`, có thể tuỳ chỉnh thoải mái      |            |
| **Zod + React Hook Form** là cặp đôi lý tưởng để validate form                               |            |
| **ThemeProvider** phải bao bọc toàn app nếu muốn sử dụng dark/light mode                     |            |

## 📝 Bài tập về nhà

### 🧠 Đề bài:

Tạo một **modal (dialog)** sử dụng ShadcnUI hiển thị **form đăng ký** gồm:

* `email`, `username`, `password`
* Validate với `zod`
* Nút mở modal ở ngoài
* Khi submit thành công, hiển thị alert `"Đăng ký thành công"` trong console

**Gợi ý:** Dùng `Dialog`, `Form`, `Button`, `Input`, `zod` và `react-hook-form`.

