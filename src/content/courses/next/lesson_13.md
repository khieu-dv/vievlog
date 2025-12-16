

# 🎓 BÀI 13: QUẢN LÝ BÀI VIẾT VÀ MEDIA

## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ:

* Hiểu và triển khai được **CRUD cơ bản cho bài viết** sử dụng **Server Actions**.
* Biết cách **xử lý upload media (ảnh)** và tối ưu hóa ảnh với `next/image`.
* Tạo được **route động** để hiển thị chi tiết từng bài viết.
* Tích hợp được **rich text editor** vào form tạo/chỉnh sửa bài viết.
* Hiểu cách xây dựng hệ thống **comment đơn giản** (chỉ hiển thị comment trong phạm vi bài học).

## 🧠 Nội dung chi tiết

### 1. **Giới thiệu mô hình quản lý bài viết**

**Khái niệm:**
Hệ thống quản lý bài viết là nơi người dùng có thể tạo, chỉnh sửa, xóa và xem các bài viết của họ, đồng thời đính kèm hình ảnh và nội dung phong phú.

**Thành phần chính bao gồm:**

* Danh sách bài viết (trang tổng hợp)
* Trang chi tiết bài viết (dynamic route)
* Form tạo và chỉnh sửa bài viết
* Tải ảnh (media)
* Rich text editor

### 2. **Tạo giao diện danh sách bài viết**

**Giải thích:**
Trang danh sách giúp hiển thị toàn bộ các bài viết hiện có. Đây là nơi triển khai server-side data fetching.

**Ví dụ:**

```tsx
// app/posts/page.tsx
import { getPosts } from "@/lib/actions/post";
import PostCard from "@/components/post-card";

export default async function PostListPage() {
  const posts = await getPosts();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}
```

### 3. **Tạo Server Actions cho CRUD**

**Giải thích:**
Server Actions trong Next.js cho phép thực hiện các thao tác **thêm/sửa/xóa** mà không cần phải viết API thủ công.

**Ví dụ:**

```ts
// lib/actions/post.ts
"use server"

import { db } from "@/lib/db";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");
  return await db.post.create({ data: { title, content } });
}
```

### 4. **Form tạo và chỉnh sửa bài viết**

**Giải thích:**
Sử dụng `form action={serverAction}` và ShadcnUI để tạo form.

**Ví dụ:**

```tsx
<form action={createPost}>
  <Input name="title" placeholder="Tiêu đề bài viết" />
  <Textarea name="content" placeholder="Nội dung..." />
  <Button type="submit">Tạo bài viết</Button>
</form>
```

### 5. **Upload ảnh và tối ưu với `next/image`**

**Giải thích:**
Next.js hỗ trợ component `<Image />` tối ưu ảnh tự động. Media có thể lưu vào public folder (tạm thời) hoặc sử dụng dịch vụ như UploadThing/S3.

**Ví dụ:**

```tsx
// components/post-form.tsx
<Image src="/uploads/sample.jpg" width={600} height={400} alt="Ảnh mô tả" />
```

### 6. **Dynamic Route cho chi tiết bài viết**

**Giải thích:**
Dùng `[slug]/page.tsx` để tạo route động. Ví dụ: `/posts/my-first-post`.

**Ví dụ:**

```tsx
// app/posts/[slug]/page.tsx
export default async function PostDetail({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  return (
    <div>
      <h1>{post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
```

### 7. **Tích hợp Rich Text Editor (shadcn/tiptap)**

**Giải thích:**
Để người dùng có thể nhập nội dung định dạng (bold, image, link), dùng `Tiptap`.

**Tiptap là gì?**
Là trình soạn thảo văn bản mạnh mẽ, hỗ trợ markdown và HTML editor.

**Ví dụ cài đặt:**

```bash
npm install @tiptap/react @tiptap/starter-kit
```

**Tích hợp vào form:**

```tsx
// components/editor.tsx
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor({ onChange }: { onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Bắt đầu viết bài...</p>",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return <EditorContent editor={editor} />;
}
```

### 8. **Tạo hệ thống comment đơn giản**

**Giải thích:**
Không cần real-time, chỉ cần hiển thị danh sách comment (mock data hoặc từ database) và form thêm comment.

**Ví dụ hiển thị comment:**

```tsx
// components/comments.tsx
export default function CommentList({ comments }) {
  return (
    <ul>
      {comments.map(c => (
        <li key={c.id} className="border-b py-2">
          <strong>{c.author}</strong>: {c.content}
        </li>
      ))}
    </ul>
  );
}
```

## 🧪 Bài tập thực hành có lời giải

### 🚀 Đề bài:

> Xây dựng một tính năng tạo bài viết mới, bao gồm: nhập tiêu đề, nội dung định dạng (rich text), upload ảnh thumbnail, và hiển thị danh sách bài viết trên `/posts`.

### ✅ Lời giải chi tiết:

1. **Tạo action `createPost`**:

```ts
// lib/actions/post.ts
export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  // Giả sử ảnh thumbnail upload được xử lý riêng
  return await db.post.create({ data: { title, content } });
}
```

2. **Form tạo bài viết:**

```tsx
<form action={createPost}>
  <Input name="title" placeholder="Tiêu đề" />
  <Editor onChange={(html) => setContent(html)} />
  <input type="hidden" name="content" value={content} />
  <Button type="submit">Tạo bài viết</Button>
</form>
```

3. **Danh sách bài viết (page.tsx):**

```tsx
const posts = await getPosts();
return posts.map(post => (
  <Link href={`/posts/${post.slug}`}>
    <h3>{post.title}</h3>
  </Link>
));
```

## 🔑 Những điểm quan trọng cần lưu ý

* **Form + Server Actions** là xu hướng mới giúp giảm viết nhiều API thủ công.
* **Rich text content** cần xử lý kỹ với `dangerouslySetInnerHTML` để tránh XSS (nếu lấy từ người dùng).
* Nên phân biệt rõ khi nào dùng **Client Component** (`useState`, Editor) và **Server Component** (fetch data).
* Tên route động phải khớp (`[slug]`) và đảm bảo có fallback nếu `params.slug` không tìm thấy.

## 📝 Bài tập về nhà

### 📌 Đề bài:

> Xây dựng trang chi tiết bài viết sử dụng route động `/posts/[slug]`. Nội dung bài viết nên được hiển thị với định dạng HTML đã lưu từ rich text editor. Đồng thời, hiển thị danh sách comment đơn giản bên dưới bài viết.

**Gợi ý:**

* Dùng `dangerouslySetInnerHTML` để render HTML.
* Tạo mock data hoặc dùng static data cho comment.
* Dùng `params.slug` để fetch bài viết tương ứng từ cơ sở dữ liệu.

