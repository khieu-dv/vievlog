

# Bài 16: Performance Optimization (Tối ưu hiệu năng)

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ **Core Web Vitals** và tầm quan trọng của chúng trong tối ưu trải nghiệm người dùng.
* Biết cách áp dụng các kỹ thuật **code splitting** và **lazy loading** để giảm kích thước bundle và tăng tốc độ tải trang.
* Sử dụng hiệu quả component `<Image>` của Next.js để **tối ưu hóa hình ảnh**.
* Hiểu và thiết lập **caching strategies** phù hợp nhằm tăng tốc truy xuất dữ liệu và tài nguyên.
* Thực hành phân tích bundle để phát hiện và xử lý các điểm nghẽn về hiệu năng.

## 📝 Nội dung chi tiết

### 1. Tổng quan về hiệu năng web và Core Web Vitals

**Khái niệm:**

* **Hiệu năng web** là tốc độ và trải nghiệm người dùng khi truy cập một trang web.
* **Core Web Vitals** là bộ chỉ số chính của Google đánh giá trải nghiệm người dùng về tốc độ, tương tác và độ ổn định hình ảnh trên trang.

**Core Web Vitals bao gồm:**

* **LCP (Largest Contentful Paint):** Thời gian để phần tử lớn nhất trên trang hiển thị đầy đủ, đo tốc độ tải chính của trang.
* **FID (First Input Delay):** Thời gian từ khi người dùng tương tác (click, tap) đến khi trình duyệt phản hồi.
* **CLS (Cumulative Layout Shift):** Đo độ ổn định bố cục, mức độ “nhảy” layout trong khi tải trang.

**Tại sao quan trọng?**
Google ưu tiên xếp hạng trang có Core Web Vitals tốt, cải thiện SEO và trải nghiệm người dùng.

### 2. Code Splitting và Lazy Loading

**Khái niệm:**

* **Code splitting** là kỹ thuật chia nhỏ bundle JavaScript thành nhiều phần nhỏ hơn, tải theo nhu cầu để giảm thời gian tải ban đầu.
* **Lazy loading** là tải các phần của trang (component, hình ảnh, module) chỉ khi cần, thay vì tải toàn bộ ngay từ đầu.

**Ứng dụng trong Next.js:**

* Next.js tự động tách code theo route (route-based code splitting).
* Dùng `dynamic()` để lazy load component.

**Ví dụ:**

```tsx
import dynamic from 'next/dynamic';

// Lazy load component, chỉ tải khi render
const Chart = dynamic(() => import('../components/Chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false,  // không render trên server nếu cần
});

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Chart />
    </div>
  );
}
```

**Giải thích:**
Thay vì tải toàn bộ mã cho `Chart` khi người dùng vào Dashboard, mã của `Chart` sẽ được tải khi component được render, giúp giảm bundle ban đầu và tăng tốc tải trang.

### 3. Image Optimization với `<Image>` của Next.js

**Khái niệm:**

* Hình ảnh thường chiếm dung lượng lớn nhất trên trang web, ảnh hưởng trực tiếp đến tốc độ tải.
* Next.js cung cấp component `<Image>` tích hợp tối ưu như: tự động nén, chọn định dạng phù hợp, lazy loading mặc định, responsive sizing.

**Ví dụ:**

```tsx
import Image from 'next/image';

export default function Profile() {
  return (
    <Image
      src="/avatar.jpg"
      alt="User Avatar"
      width={200}
      height={200}
      priority // tải ưu tiên cho hình ảnh quan trọng
      placeholder="blur" // hiệu ứng mờ dần khi tải
      blurDataURL="/avatar-blur.jpg"
    />
  );
}
```

**Giải thích:**
Component `<Image>` tự động resize và nén ảnh, giúp giảm thời gian tải và băng thông, đặc biệt trên thiết bị di động. Các thuộc tính như `priority` giúp bạn chỉ định ảnh nào cần tải ngay lập tức, còn ảnh ít quan trọng sẽ được lazy load.

### 4. Caching Strategies (Chiến lược bộ nhớ đệm)

**Khái niệm:**

* **Caching** là lưu trữ tạm thời tài nguyên hoặc dữ liệu để tránh tải lại từ server nhiều lần, giúp tăng tốc độ và giảm tải server.
* Trong Next.js, bạn có thể cấu hình caching ở nhiều nơi: static assets, API routes, ISR (Incremental Static Regeneration).

**Ví dụ cache HTTP header:**

* Cấu hình trong API route hoặc server response:

```ts
export async function GET() {
  const data = await fetchData();

  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=59',
    },
  });
}
```

**Giải thích:**
`max-age=3600` cho phép trình duyệt cache dữ liệu trong 1 giờ, `stale-while-revalidate` cho phép dùng bản cache cũ trong khi tải lại dữ liệu mới nền sau.

**ISR example:**
Trang static có thể tự động cập nhật sau khoảng thời gian xác định, kết hợp caching với khả năng cập nhật nội dung.

### 5. Bundle Analysis và Optimization

**Khái niệm:**

* Bundle analysis giúp bạn xem kích thước các phần trong bundle JavaScript, từ đó phát hiện thư viện lớn, code thừa hoặc duplicate.
* Từ đó tối ưu hóa bằng cách loại bỏ, thay thế hoặc lazy load hợp lý.

**Cách sử dụng:**

* Cài đặt `@next/bundle-analyzer`

```bash
npm install --save-dev @next/bundle-analyzer
```

* Cấu hình `next.config.js`:

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({});
```

* Chạy build với biến môi trường:

```bash
ANALYZE=true npm run build
```

* Mở file báo cáo ra xem chi tiết kích thước các module.

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài

Xây dựng một trang Dashboard đơn giản trong Next.js, có các yêu cầu:

* Hiển thị một biểu đồ (chart) bằng một component tốn nhiều tài nguyên, bạn cần lazy load component này.
* Có một avatar người dùng sử dụng component `<Image>` với tối ưu lazy loading và placeholder.
* Cấu hình caching header cho API route lấy dữ liệu biểu đồ, cache trong 10 phút.
* Phân tích bundle bằng `@next/bundle-analyzer` và nêu cách bạn sẽ cải thiện hiệu năng nếu phát hiện điểm nghẽn.

### Lời giải

**Bước 1: Tạo component Chart và lazy load**

```tsx
// components/Chart.tsx
import React from 'react';

export default function Chart() {
  return <div>Đây là biểu đồ tốn tài nguyên</div>;
}
```

```tsx
// app/dashboard/page.tsx
import dynamic from 'next/dynamic';
import Image from 'next/image';

const Chart = dynamic(() => import('../../components/Chart'), {
  loading: () => <p>Đang tải biểu đồ...</p>,
  ssr: false,
});

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Image
        src="/avatar.jpg"
        alt="User Avatar"
        width={100}
        height={100}
        placeholder="blur"
        blurDataURL="/avatar-blur.jpg"
      />
      <Chart />
    </div>
  );
}
```

**Bước 2: Tạo API route với caching**

```ts
// app/api/chart-data/route.ts
export async function GET() {
  const chartData = { value: 123 }; // ví dụ dữ liệu

  return new Response(JSON.stringify(chartData), {
    headers: {
      'Cache-Control': 'public, max-age=600, stale-while-revalidate=59',
      'Content-Type': 'application/json',
    },
  });
}
```

**Bước 3: Cài đặt bundle analyzer**

* Cài đặt `@next/bundle-analyzer`
* Cấu hình `next.config.js` như ở phần hướng dẫn trên
* Chạy `ANALYZE=true npm run build` để xem báo cáo.

**Phân tích & cải thiện:**

* Nếu thấy một thư viện lớn hoặc code chưa dùng nhiều vẫn được đóng gói, bạn có thể:

  * Thay thế bằng thư viện nhỏ hơn.
  * Lazy load phần đó.
  * Loại bỏ code thừa.

## 🔑 Những điểm quan trọng cần lưu ý

* **Core Web Vitals** là tiêu chí hàng đầu để đánh giá hiệu năng và trải nghiệm, hãy ưu tiên cải thiện chúng.
* **Lazy loading** giúp giảm tải ban đầu, nhưng đừng quá lạm dụng khiến trải nghiệm bị trì hoãn.
* Dùng `<Image>` của Next.js giúp tự động tối ưu hình ảnh mà không cần thủ công.
* Thiết lập **caching header** đúng giúp tăng tốc tải lại trang và giảm tải server.
* Luôn phân tích **bundle** để biết được code nào chiếm nhiều dung lượng, từ đó tối ưu hợp lý.
* Không nên import tất cả các thư viện một cách đồng loạt, hãy dùng dynamic import cho những phần ít dùng.

## 📝 Bài tập về nhà

**Đề bài:**

1. Tạo một trang Gallery trong Next.js, trong đó có nhiều ảnh được tối ưu với `<Image>`, sử dụng lazy loading và hiệu ứng placeholder mờ.
2. Tạo một component Video Player (giả lập, chỉ hiển thị div) và lazy load nó trên trang Gallery.
3. Tạo một API route giả lập trả về danh sách ảnh, sử dụng caching header với thời gian cache 15 phút.
4. Sử dụng bundle analyzer để kiểm tra bundle của trang Gallery, ghi lại các thư viện hoặc phần code chiếm dung lượng lớn nhất, và đề xuất cách cải thiện.

**Yêu cầu:**
Gửi code lên GitHub, giải thích từng bước trong README và nhận xét về kết quả tối ưu hiệu năng bạn đạt được.


