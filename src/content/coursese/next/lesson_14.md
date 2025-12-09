

# Bài 14: Quản lý Video và Player trong NextJS App Router

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu được khái niệm cơ bản về video player trên web và cách tích hợp trong NextJS.
* Biết cách tối ưu hóa hiển thị và phát video trong ứng dụng NextJS.
* Làm quen với các kỹ thuật tối ưu video như streaming, lazy loading, thumbnails.
* Xây dựng được trang danh sách video, trang chi tiết video tích hợp player hoạt động mượt mà.
* Hiểu và áp dụng được các kỹ thuật cơ bản về video upload và xử lý.
* Biết cách xây dựng tính năng tìm kiếm và phân loại video đơn giản.
* Áp dụng kiến thức trên để xây dựng một module quản lý video hoàn chỉnh trong dự án NextJS.

## 📝 Nội dung chi tiết

### 1. Khái niệm về video player trên web

**Video player** là một thành phần giao diện giúp người dùng xem video trên trình duyệt. Thông thường, HTML5 cung cấp sẵn thẻ `<video>` để phát video nhưng trong dự án thực tế, chúng ta thường dùng các thư viện player nâng cao (ví dụ: react-player, video.js) để có trải nghiệm người dùng tốt hơn (play, pause, seek, fullscreen, quality control,...).

*Ví dụ:* Thẻ `<video>` cơ bản:

```tsx
<video controls width="600" src="/videos/sample.mp4" />
```

*Giải thích:*

* `controls`: hiển thị thanh điều khiển (play, pause...)
* `width`: kích thước video
* `src`: nguồn video

### 2. Tích hợp video player trong NextJS với React Player

`react-player` là một thư viện phổ biến, hỗ trợ đa dạng nguồn video (YouTube, Vimeo, file local...). Ưu điểm là dễ dùng và tùy biến.

* Cài đặt: `npm install react-player`
* Sử dụng cơ bản:

```tsx
"use client";
import React from "react";
import ReactPlayer from "react-player";

export default function VideoPlayer() {
  return (
    <div className="player-wrapper">
      <ReactPlayer
        url="/videos/sample.mp4"
        controls={true}
        width="100%"
        height="360px"
      />
    </div>
  );
}
```

*Giải thích:*

* `url`: link video
* `controls`: bật thanh điều khiển
* `width`, `height`: kích thước video responsive

### 3. Video streaming và tối ưu hóa hiệu năng

* **Streaming** là kỹ thuật truyền tải video theo từng phần nhỏ, không tải toàn bộ file cùng lúc, giúp người xem có thể xem ngay mà không phải chờ tải hết video.
* Trong NextJS, ta có thể áp dụng lazy loading để chỉ tải video khi người dùng cuộn đến (dùng thư viện `react-intersection-observer`).
* Ngoài ra, nên sử dụng định dạng video nhẹ như MP4 (H.264), hoặc WebM để tối ưu băng thông.

### 4. Video thumbnails và previews

* **Thumbnail** là ảnh đại diện cho video, giúp người dùng chọn video dễ dàng hơn.
* Cách tạo: có thể upload ảnh riêng hoặc dùng ảnh tĩnh trích xuất từ video.
* Trong NextJS, dùng `next/image` để tối ưu tải ảnh thumbnail:

```tsx
import Image from "next/image";

<Image
  src="/thumbnails/sample.jpg"
  alt="Video Thumbnail"
  width={320}
  height={180}
  className="rounded-md cursor-pointer"
/>
```

### 5. Xây dựng trang danh sách video

* Hiển thị danh sách video với thumbnail, tiêu đề, mô tả ngắn.
* Mỗi video khi click sẽ dẫn tới trang chi tiết video.
* Sử dụng `app/videos/page.tsx` để liệt kê, dùng component `VideoCard` cho từng video.

### 6. Trang chi tiết video và Player

* Hiển thị video player, tiêu đề, mô tả chi tiết.
* Cho phép xem video trực tiếp trong trang.
* Thêm các tính năng cơ bản: chia sẻ, like, xem số lần xem (đơn giản).

### 7. Video upload và processing (cơ bản)

* Hiểu cách tạo form upload video với `<input type="file" />`.
* Giới hạn kích thước và định dạng video.
* Xử lý file upload (phần backend hoặc API route) để lưu trữ.
* (Gợi ý nâng cao: sử dụng Cloudinary hoặc AWS S3 để lưu video).

### 8. Tính năng tìm kiếm và phân loại video

* Tìm kiếm video theo tiêu đề hoặc mô tả (lọc mảng dữ liệu).
* Phân loại video theo chủ đề (categories).
* Hiển thị bộ lọc để người dùng dễ dàng tìm kiếm.

## 🏆 Bài tập thực hành

### Đề bài:

Xây dựng một trang quản lý video đơn giản trong NextJS App Router:

* Trang danh sách video hiển thị các video mẫu (dùng dữ liệu tĩnh trong file hoặc mock API).
* Mỗi video hiển thị thumbnail, tiêu đề và mô tả ngắn.
* Khi click vào video sẽ chuyển sang trang chi tiết với video player tích hợp (dùng `react-player`).
* Thêm thanh tìm kiếm để lọc video theo tiêu đề.
* Video player có các nút điều khiển cơ bản (play, pause).
* Video được tải lazy (chỉ tải khi video chi tiết được mở).

### Lời giải chi tiết:

1. **Chuẩn bị dữ liệu video mẫu:**
   Tạo file `data/videos.ts` chứa mảng video với các trường: id, title, description, thumbnail, url.

2. **Trang danh sách video:**

   * Tạo `app/videos/page.tsx` hiển thị danh sách với map qua mảng video.
   * Dùng `next/image` để load thumbnail.
   * Tạo input tìm kiếm, filter mảng theo từ khóa nhập.

3. **Trang chi tiết video:**

   * Tạo `app/videos/[id]/page.tsx` dùng param id để lấy video tương ứng.
   * Tích hợp `react-player` để phát video.
   * Hiển thị tiêu đề và mô tả.

4. **Lazy load video:**

   * Video player chỉ render khi trang chi tiết được mở.
   * Có thể dùng React Suspense hoặc `react-intersection-observer` để cải thiện.

5. **Tối ưu:**

   * Sử dụng TypeScript để định nghĩa kiểu dữ liệu Video.
   * Dùng TailwindCSS để style responsive.

## 🔑 Những điểm quan trọng cần lưu ý

* HTML5 `<video>` rất cơ bản, nếu cần tính năng nâng cao nên dùng thư viện chuyên biệt (ví dụ `react-player`).
* Video streaming giúp tải nhanh, tránh tải toàn bộ file video.
* Thumbnails là điểm nhấn giúp người dùng dễ chọn video, nên tối ưu hình ảnh (dung lượng, kích thước).
* Lazy loading video là kỹ thuật hiệu quả giúp cải thiện tốc độ tải trang và trải nghiệm người dùng.
* Tìm kiếm và lọc video nên được làm trên client hoặc server tùy quy mô dự án.
* Phân biệt rõ giữa component hiển thị danh sách (list) và chi tiết (detail).
* Xử lý upload video cần cẩn trọng về dung lượng, định dạng và bảo mật.

## 📝 Bài tập về nhà

**Đề bài:**
Mở rộng bài tập thực hành, xây dựng thêm các tính năng:

* Thêm tính năng phân loại video theo chủ đề (ví dụ: giáo dục, giải trí, kỹ thuật).
* Hiển thị bộ lọc để người dùng có thể chọn xem video theo từng category.
* Tính năng đếm lượt xem mỗi video và hiển thị con số này trong trang chi tiết.
* Thêm nút "Like" cho mỗi video, lưu trạng thái like cục bộ trong trình duyệt (localStorage).
* Tối ưu giao diện video player và danh sách video theo tiêu chuẩn responsive.


