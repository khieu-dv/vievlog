

# 🎓 **Bài 11: Xây dựng Trang Profile**

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu được **cấu trúc và vai trò của trang Profile** trong ứng dụng web.
* Biết cách **hiển thị và cập nhật thông tin người dùng** từ API.
* Thành thạo việc sử dụng **React Hook Form** để xử lý form một cách hiệu quả.
* Thực hành **validation dữ liệu người dùng** phía client.
* Tích hợp **upload avatar/profile picture** một cách trực quan.
* Nắm được khái niệm **optimistic update** và cách áp dụng cơ bản.
* Sử dụng linh hoạt **ShadcnUI components** để xây dựng UI profile.

## 📝 Nội dung chi tiết

### I. Khái niệm & Giới thiệu

#### 📌 Trang Profile là gì?

Trang Profile là nơi người dùng xem và chỉnh sửa thông tin cá nhân của mình như: tên, email, avatar, mô tả,… Đây là tính năng phổ biến trong hầu hết các ứng dụng có đăng nhập.

👉 **Lý do nên làm tốt trang này:**

* Tăng trải nghiệm người dùng
* Thể hiện cá nhân hóa
* Là một phần của tính năng quản lý tài khoản

### II. Hiển thị thông tin người dùng

**Khái niệm: Lấy dữ liệu từ API và render trong component**

👉 Chúng ta sẽ dùng `Server Component` hoặc `useEffect` (nếu cần) để fetch dữ liệu người dùng (ví dụ từ API Golang của bạn).

**Ví dụ:**

```tsx
// app/profile/page.tsx
import { getCurrentUser } from "@/lib/api";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân</h1>
      <ProfileForm user={user} />
    </div>
  );
}
```

### III. Xử lý Form với React Hook Form

**Khái niệm: Thư viện giúp quản lý form, validation và cập nhật state hiệu quả.**

👉 Vì form chỉnh sửa profile có thể phức tạp (nhiều field, validation), ta dùng thư viện `react-hook-form` thay vì quản lý bằng tay.

```tsx
// app/profile/profile-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/api";
import { useState } from "react";

type ProfileFormProps = {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    await updateProfile(data);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("name", { required: true })} placeholder="Tên" />
      {errors.name && <p className="text-red-500 text-sm">Tên là bắt buộc</p>}

      <Input {...register("email", { required: true })} placeholder="Email" />
      {errors.email && <p className="text-red-500 text-sm">Email là bắt buộc</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
}
```

### IV. Upload Avatar đơn giản

**Khái niệm: File upload là quá trình gửi file từ client lên server.**

* Sử dụng `<input type="file" />` để chọn ảnh
* Dùng `FormData` để gửi file qua API

```tsx
// Upload avatar đơn giản
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });
    }
  }}
/>
```

Bạn có thể dùng [ShadcnUI Avatar Component](https://ui.shadcn.dev/docs/components/avatar) để hiển thị ảnh người dùng.

### V. Optimistic Update cơ bản

**Khái niệm: Cập nhật giao diện trước khi server xác nhận thành công.**

👉 Tăng trải nghiệm mượt mà, nhưng cần rollback nếu thất bại.

```tsx
const onSubmit = async (data: any) => {
  const prevData = { ...user }; // Backup
  setUser(data); // Update giao diện ngay

  const success = await updateProfile(data);
  if (!success) {
    setUser(prevData); // Quay lại nếu thất bại
  }
};
```

## 🏆 Bài tập thực hành có lời giải

### Đề bài:

Tạo một trang `/profile` có thể:

1. Hiển thị tên và email người dùng
2. Cho phép chỉnh sửa tên/email
3. Upload avatar (hiển thị được ảnh)
4. Validation đơn giản: không được bỏ trống

### Gợi ý cấu trúc:

* `app/profile/page.tsx`
* `app/profile/profile-form.tsx`
* `lib/api.ts`: mô phỏng fetch/update user

### ✅ Lời giải:

> File `lib/api.ts`:

```ts
export async function getCurrentUser() {
  return {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: "/avatar.png",
  };
}

export async function updateProfile(data: any) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Cập nhật thông tin:", data);
  return true;
}
```

> File `app/profile/page.tsx` và `profile-form.tsx`: như trong phần trên.

## 🔑 Những điểm quan trọng cần lưu ý

* `react-hook-form` giúp giảm boilerplate code khi quản lý form.
* Cần thêm `use client` ở component nào có tương tác (form, input,…).
* Validation phía client rất quan trọng, nhưng validation phía server vẫn cần.
* Upload file không thể dùng `JSON.stringify()` – phải dùng `FormData`.
* Khi cập nhật profile, nên cho người dùng biết đang xử lý (`loading spinner`).

## 📝 Bài tập về nhà

**Đề bài:**
Hãy mở rộng form profile để cho phép người dùng cập nhật thêm:

* Mô tả bản thân (`bio`)
* Số điện thoại (`phone`)

**Yêu cầu:**

* Cập nhật hiển thị dữ liệu từ API
* Validation: `bio` tối đa 160 ký tự, `phone` bắt buộc và phải là số
* Cho phép lưu và hiển thị `bio`/`phone` khi reload

