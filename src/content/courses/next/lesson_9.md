

# 📘 **Bài 9: Data Fetching và API Integration**

## 🎯 **Mục tiêu bài học**

Sau khi hoàn thành bài học này, học viên sẽ:

* Hiểu rõ các cách thức *lấy dữ liệu* trong Next.js App Router (Server-side & Client-side).
* Biết cách sử dụng `fetch()` trong Server Components.
* Tạo và tích hợp **Route Handlers (API Routes)** trong App Router.
* Biết sử dụng thư viện **SWR** để fetch data từ client một cách hiệu quả.
* Biết xử lý **loading state**, **error state** và **caching** dữ liệu.
* Kết nối được với một API backend thực tế (ví dụ: Golang REST API).
* Hiểu rõ thời điểm và lý do nên chọn cách fetch tương ứng.

## 📝 **Nội dung chi tiết**

### I. Giới thiệu tổng quan về Data Fetching

#### 🔹 Data Fetching là gì?

Là quá trình lấy dữ liệu từ một nguồn bên ngoài (API, cơ sở dữ liệu, v.v...) để hiển thị lên giao diện người dùng.

#### 🔹 Tại sao cần hiểu đúng cách Fetch Data?

Trong Next.js App Router, dữ liệu có thể được lấy ở cả **server** và **client**. Việc lựa chọn đúng cách fetch sẽ tối ưu hiệu suất và trải nghiệm người dùng.

### II. Data Fetching trong **Server Components**

#### 📘 Khái niệm:

Next.js App Router ưu tiên fetch data trong **Server Components** để cải thiện performance và SEO.

#### ✅ Ưu điểm:

* Tải trang nhanh hơn.
* Không cần fetch lại trên client.
* Tối ưu SEO.

#### 💡 Ví dụ: Lấy danh sách bài viết từ API

```ts
// app/posts/page.tsx
import { Post } from "@/types";

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://api.example.com/posts", {
    next: { revalidate: 60 }, // ISR caching
  });

  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 border rounded">{post.title}</div>
      ))}
    </div>
  );
}
```

### III. Tạo Route Handlers (API Routes) trong App Router

#### 📘 Khái niệm:

Trong App Router, API Routes được gọi là **Route Handlers**, nằm trong thư mục `/app/api`.

#### 🛠 Cách tổ chức:

```
/app/api/posts/route.ts
```

#### 💡 Ví dụ: Tạo API trả về danh sách bài viết

```ts
// app/api/posts/route.ts
import { NextResponse } from "next/server";

const data = [
  { id: 1, title: "Next.js là gì?" },
  { id: 2, title: "App Router chuyên sâu" },
];

export async function GET() {
  return NextResponse.json(data);
}
```

### IV. Data Fetching trong **Client Components**

#### 📘 Khái niệm:

Client-side fetching cho phép dữ liệu được tải sau khi trang đã render — phù hợp cho dữ liệu động hoặc real-time.

#### 🔧 Các thư viện phổ biến:

* `SWR` (Stale While Revalidate)
* `React Query` (advanced, không dùng trong bài này)

#### 💡 Ví dụ: Dùng SWR lấy danh sách bài viết

```ts
"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PostListClient() {
  const { data, error, isLoading } = useSWR("/api/posts", fetcher);

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi khi tải dữ liệu</p>;

  return (
    <div>
      {data.map((post: any) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### V. Xử lý Loading và Error State

Khi fetch dữ liệu, cần **hiển thị trạng thái rõ ràng** cho người dùng:

#### ✅ Loading:

* Hiển thị spinner hoặc placeholder.

#### ✅ Error:

* Thông báo rõ ràng lỗi.
* Có thể có nút retry.

💡 Trong SWR, trạng thái được xác định bởi `isLoading` và `error`.

## 🏆 **Bài tập thực hành**

### Đề bài:

> Hãy xây dựng một trang `/books` sử dụng Server Component để fetch danh sách sách từ API giả lập `/api/books`. Mỗi sách có `id`, `title`, `author`.

### Bước 1: Tạo Route Handler `/api/books`

```ts
// app/api/books/route.ts
import { NextResponse } from "next/server";

const books = [
  { id: 1, title: "Learn Next.js", author: "John Doe" },
  { id: 2, title: "Tailwind Mastery", author: "Jane Smith" },
];

export async function GET() {
  return NextResponse.json(books);
}
```

### Bước 2: Tạo page `/books` để fetch từ API

```ts
// app/books/page.tsx

async function getBooks() {
  const res = await fetch("http://localhost:3000/api/books", {
    next: { revalidate: 30 },
  });

  return res.json();
}

export default async function BookPage() {
  const books = await getBooks();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Danh sách sách</h1>
      {books.map((book: any) => (
        <div key={book.id} className="border p-4 rounded">
          <p className="font-semibold">{book.title}</p>
          <p className="text-gray-500">Tác giả: {book.author}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🔑 **Những điểm quan trọng cần lưu ý**

| Chủ đề                          | Ghi nhớ                                                |
| ------------------------------- | ------------------------------------------------------ |
| `fetch` trong Server Components | Không cần `useEffect`, tự động chạy server-side        |
| `use client`                    | Bắt buộc khi dùng `useSWR`, `useEffect`, hooks React   |
| API Routes App Router           | Đặt trong `/app/api/.../route.ts`                      |
| `SWR` vs `fetch`                | SWR dùng cho client, có caching, revalidate            |
| Tránh fetch đúp                 | Không fetch ở cả Server và Client cho cùng một dữ liệu |

## 📝 **Bài tập về nhà**

### Đề bài:

> Tạo một trang `/users` sử dụng **Client Component + SWR** để fetch dữ liệu từ API `/api/users`, mỗi user gồm `id`, `name`, `email`. Hiển thị danh sách user và xử lý loading/error rõ ràng.

### Gợi ý:

1. Tạo `app/api/users/route.ts` giống như phần `books`.
2. Sử dụng `useSWR` để fetch dữ liệu trong `app/users/page.tsx` (phải dùng `"use client"`).
3. Styling bằng TailwindCSS hoặc ShadcnUI nếu muốn đẹp hơn.

