

# 📚 BÀI 7: Server Components vs Client Components

## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ:

* Hiểu rõ sự khác biệt giữa **Server Components** và **Client Components** trong Next.js App Router.
* Biết khi nào nên dùng từng loại component để tối ưu hiệu suất.
* Biết cách **phân biệt**, **sử dụng**, và **tổ chức** mã nguồn hiệu quả giữa Server và Client Components.
* Thành thạo directive `"use client"` và lý do tồn tại của nó.
* Biết cách **fetch dữ liệu trong Server Component**, và **xử lý tương tác người dùng trong Client Component**.
* Áp dụng **Suspense** và **Streaming** trong thực tế một cách đơn giản.

## 📝 Nội dung chi tiết

### I. **Tổng quan về Server & Client Components**

#### ❓ Khái niệm

* **Server Components**: Component chạy hoàn toàn trên server, không bao giờ gửi code JavaScript xuống client.
* **Client Components**: Component được bundle và gửi xuống client, hỗ trợ interactivity (xử lý sự kiện, animation, state...).

#### ✅ Lợi ích khi tách biệt:

| Đặc điểm                         | Server Components           | Client Components         |
| -------------------------------- | --------------------------- | ------------------------- |
| Chạy ở đâu?                      | Trên server                 | Trên trình duyệt          |
| Có thể dùng useState, useEffect? | ❌ Không                     | ✅ Có                      |
| Có thể fetch dữ liệu?            | ✅ Có thể (thậm chí tốt hơn) | ✅ Có, nhưng ít tối ưu hơn |
| Có bundle xuống client?          | ❌ Không                     | ✅ Có                      |
| Tối ưu performance?              | ✅ Tốt hơn (ít JS tải về)    | ❌ Nặng hơn                |

### II. **Cách phân biệt và khai báo**

#### 🛠 Mặc định trong App Router:

* **Mặc định là Server Component** nếu bạn không ghi gì.
* Muốn khai báo là **Client Component**? 👉 thêm dòng đầu `"use client"`

#### 📌 Ví dụ:

```tsx
// app/components/HelloServer.tsx (Server Component)
export default function HelloServer() {
  return <div>Hello from Server!</div>;
}
```

```tsx
// app/components/HelloClient.tsx (Client Component)
"use client"; // 🧠 Bắt buộc để kích hoạt JS-side logic

import { useState } from "react";

export default function HelloClient() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}
```

### III. **Khi nào sử dụng từng loại component?**

#### 🧭 Server Component – dùng khi:

* Chỉ hiển thị dữ liệu (static/dynamic)
* Không cần interactivity
* Cần bảo mật (vd: không muốn expose code xử lý logic lên client)
* Tối ưu SEO, SSR

#### 🧭 Client Component – dùng khi:

* Có tương tác người dùng (click, input, animation...)
* Sử dụng `useState`, `useEffect`, `useContext`, `ref`,...
* Dùng các thư viện JS chỉ hoạt động phía client (Chart.js, IntersectionObserver,...)

### IV. **Data Fetching trong Server Component**

```tsx
// app/components/UserList.tsx
async function getUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
}

export default async function UserList() {
  const users = await getUsers();
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

> 📌 *Không cần `useEffect`, không cần `useState`. Mọi thứ xử lý ở Server, và trả về HTML sẵn sàng.*

### V. **Hydration & Streaming (giải thích cơ bản)**

#### 💧 Hydration

* Là quá trình React nối kết (bind) các event handler vào các element đã được server render.
* Áp dụng cho Client Components.

#### ⛵ Streaming

* Cho phép server render từng phần HTML nhỏ khi có dữ liệu, không cần đợi tất cả hoàn tất.
* Dùng với `<Suspense>` để hiển thị loading.

```tsx
// app/page.tsx
import UserList from "./components/UserList";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Đang tải dữ liệu...</div>}>
      <UserList />
    </Suspense>
  );
}
```

### VI. **Tổ chức dự án hiệu quả với Server & Client Components**

```
/app
  /components
    Button.tsx          // client (có useState)
    Navbar.tsx          // client
    ArticleList.tsx     // server (fetch dữ liệu)
    ArticleCard.tsx     // server
```

> ⚙ Gợi ý: để dễ quản lý, bạn có thể tạo thư mục `/components/client` và `/components/server`

## 🏆 Bài tập thực hành có lời giải

### **📌 Đề bài: Tạo trang hiển thị danh sách người dùng và nút Like**

1. **UserList** (Server Component): fetch danh sách người dùng từ API.
2. **LikeButton** (Client Component): mỗi người có nút Like hiển thị số lượt like và có thể tăng.

### **✅ Lời giải:**

```tsx
// app/components/LikeButton.tsx
"use client";
import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes(likes + 1)} className="text-blue-600">
      👍 {likes}
    </button>
  );
}
```

```tsx
// app/components/UserList.tsx
import LikeButton from "./LikeButton";

async function getUsers() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
}

export default async function UserList() {
  const users = await getUsers();

  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <li key={user.id} className="flex justify-between items-center border p-2">
          <span>{user.name}</span>
          <LikeButton />
        </li>
      ))}
    </ul>
  );
}
```

```tsx
// app/page.tsx
import UserList from "./components/UserList";

export default function HomePage() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">Danh sách người dùng</h1>
      <UserList />
    </main>
  );
}
```

## 🔑 Những điểm quan trọng cần lưu ý

* **Mặc định component là Server** trong App Router.
* Dùng `"use client"` để khai báo component là Client.
* Server Components **không thể dùng** `useState`, `useEffect`, `ref`.
* Nên fetch dữ liệu tại Server Component nếu không cần tương tác người dùng.
* Client Component chỉ dùng khi thật sự cần **interactivity**.
* Server Component giúp giảm bundle size và cải thiện SEO.

## 📝 Bài tập về nhà

### **📌 Đề bài:**

Tạo một trang Blog đơn giản:

* `BlogList` (Server Component): fetch danh sách bài viết từ API (`https://jsonplaceholder.typicode.com/posts`)
* `ToggleContent` (Client Component): mỗi bài viết có nút "Xem nội dung" để ẩn/hiện phần nội dung bài viết.

> 📌 Gợi ý: `ToggleContent` dùng `useState` để hiện/ẩn nội dung. Hãy tách riêng như một Client Component để tái sử dụng.

## ✅ Kết luận

Bài học này là bước đệm quan trọng giúp học viên hiểu rõ cách **phân chia logic và hiệu năng giữa Server và Client**, vốn là chìa khóa để tối ưu hóa ứng dụng trong môi trường NextJS App Router hiện đại.

