# Bài 1: Giới thiệu và các khái niệm cơ bản


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:
- Hiểu được Next.js là gì và tại sao nên sử dụng nó
- Nắm vững các khái niệm cơ bản về JavaScript và React cần thiết
- Phân biệt được SPA (Single Page Application) và SSR (Server-Side Rendering)
- Tạo được dự án Next.js mới sử dụng App Router với TypeScript và Tailwind CSS
- Hiểu cấu trúc thư mục cơ bản của một dự án Next.js

## 📝 Nội dung chi tiết

### 1. Next.js là gì?

Next.js là một React framework được phát triển bởi Vercel, giúp xây dựng các ứng dụng web full-stack một cách nhanh chóng và hiệu quả. Next.js mở rộng khả năng của React bằng cách cung cấp các tính năng như:

- **Server-Side Rendering (SSR)**: Render trang trên server trước khi gửi về client
- **Static Site Generation (SSG)**: Tạo trang tĩnh tại thời điểm build
- **Automatic Code Splitting**: Tự động chia nhỏ code để tối ưu hiệu suất
- **Built-in Routing**: Hệ thống định tuyến dựa trên file system
- **API Routes**: Tạo API endpoints ngay trong ứng dụng
- **Image Optimization**: Tối ưu hóa hình ảnh tự động

### 2. Tại sao cần sử dụng JavaScript Framework?

Khi phát triển ứng dụng web hiện đại, chúng ta thường gặp các thách thức:

- **Quản lý DOM phức tạp**: Thao tác trực tiếp với DOM rất khó và dễ lỗi
- **State Management**: Quản lý trạng thái ứng dụng phức tạp
- **Code Reusability**: Khó tái sử dụng code
- **Performance**: Tối ưu hiệu suất render

Framework như React giải quyết những vấn đề này bằng cách:
- Cung cấp Virtual DOM để quản lý DOM hiệu quả
- Component-based architecture để tái sử dụng code
- Declarative programming để code dễ đọc và bảo trì

### 3. Tại sao chọn React?

React là một JavaScript library được phát triển bởi Meta (Facebook) với những ưu điểm:

- **Component-based**: Xây dựng UI bằng các component độc lập
- **Virtual DOM**: Tối ưu hiệu suất render
- **Unidirectional Data Flow**: Luồng dữ liệu một chiều dễ theo dõi
- **Rich Ecosystem**: Hệ sinh thái phong phú với nhiều library hỗ trợ
- **Large Community**: Cộng đồng lớn và tài liệu phong phú

```jsx
// Ví dụ về React component đơn giản
function Welcome({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}
```

### 4. SPA vs SSR

#### Single Page Application (SPA)
- **Đặc điểm**: Toàn bộ ứng dụng chạy trên một trang duy nhất
- **Ưu điểm**: 
  - Trải nghiệm người dùng mượt mà
  - Không cần reload trang
  - Ít tải trọng server sau lần đầu
- **Nhược điểm**: 
  - SEO kém
  - Thời gian tải trang đầu tiên chậm
  - JavaScript phải được tải và chạy trước khi hiển thị nội dung

#### Server-Side Rendering (SSR)
- **Đặc điểm**: HTML được tạo trên server cho mỗi request
- **Ưu điểm**: 
  - SEO tốt
  - Thời gian hiển thị nội dung nhanh (First Contentful Paint)
  - Hoạt động tốt với JavaScript bị tắt
- **Nhược điểm**: 
  - Tải trọng server cao hơn
  - Phức tạp hơn trong triển khai

### 5. Next.js - Kết hợp ưu điểm của cả SPA và SSR

Next.js cho phép chúng ta:
- **Hybrid Rendering**: Kết hợp SSR, SSG và CSR trong cùng một ứng dụng
- **Automatic Static Optimization**: Tự động tối ưu các trang tĩnh
- **Incremental Static Regeneration**: Cập nhật nội dung tĩnh theo thời gian

### 6. Tạo dự án Next.js mới

Để tạo dự án Next.js mới với TypeScript và Tailwind CSS:

```bash
npx create-next-app@latest my-nextjs-app --typescript --tailwind --eslint --app
```

Các tùy chọn:
- `--typescript`: Sử dụng TypeScript
- `--tailwind`: Cài đặt Tailwind CSS
- `--eslint`: Cài đặt ESLint
- `--app`: Sử dụng App Router (khuyến nghị)

### 7. Cấu trúc thư mục cơ bản

```
my-nextjs-app/
├── app/                    # App Router (Next.js 13+)
│   ├── globals.css        # CSS toàn cục
│   ├── layout.tsx         # Layout chính
│   ├── page.tsx          # Trang chủ
│   └── favicon.ico       # Icon
├── public/               # Tài nguyên tĩnh
├── next.config.js       # Cấu hình Next.js
├── package.json         # Dependencies
├── tailwind.config.js   # Cấu hình Tailwind
└── tsconfig.json       # Cấu hình TypeScript
```

### 8. File quan trọng trong App Router

#### layout.tsx - Root Layout
```tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Next.js App',
  description: 'Generated by create-next-app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

#### page.tsx - Home Page
```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Chào mừng đến với Next.js!
        </h1>
        <p className="text-center text-gray-600">
          Bắt đầu chỉnh sửa file <code className="bg-gray-100 px-1 py-0.5 rounded">app/page.tsx</code>
        </p>
      </div>
    </main>
  )
}
```

## 🏆 Bài tập thực hành

### Đề bài: Tạo trang "Giới thiệu về bản thân"

Tạo một trang web đơn giản giới thiệu về bản thân với các yêu cầu:
1. Sử dụng Next.js App Router với TypeScript
2. Áp dụng Tailwind CSS để tạo giao diện đẹp
3. Hiển thị thông tin: tên, tuổi, nghề nghiệp, sở thích
4. Thêm một nút "Liên hệ" (chưa cần chức năng)

### Lời giải chi tiết:

**Bước 1**: Tạo dự án mới
```bash
npx create-next-app@latest gioi-thieu-ban-than --typescript --tailwind --eslint --app
cd gioi-thieu-ban-than
```

**Bước 2**: Chỉnh sửa file `app/page.tsx`
```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-12 text-white text-center">
            <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">👨‍💻</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Nguyễn Văn An</h1>
            <p className="text-blue-100">Frontend Developer</p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Thông tin cơ bản */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Thông tin cơ bản</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="w-16 text-gray-600">Tuổi:</span>
                    <span className="text-gray-800">25</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-gray-600">Email:</span>
                    <span className="text-gray-800">an.nguyen@example.com</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-16 text-gray-600">Địa chỉ:</span>
                    <span className="text-gray-800">Hà Nội, Việt Nam</span>
                  </div>
                </div>
              </div>

              {/* Sở thích */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Sở thích</h2>
                <div className="flex flex-wrap gap-2">
                  {['Lập trình', 'Đọc sách', 'Du lịch', 'Chụp ảnh', 'Game'].map((hobby) => (
                    <span
                      key={hobby}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Giới thiệu</h2>
              <p className="text-gray-600 leading-relaxed">
                Tôi là một Frontend Developer với 3 năm kinh nghiệm trong việc phát triển
                ứng dụng web sử dụng React, Next.js và TypeScript. Tôi đam mê tạo ra những
                trải nghiệm người dùng tuyệt vời và luôn học hỏi các công nghệ mới.
              </p>
            </div>

            {/* Nút liên hệ */}
            <div className="mt-8 text-center">
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-colors">
                Liên hệ với tôi
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
```

**Bước 3**: Cập nhật metadata trong `app/layout.tsx`
```tsx
export const metadata = {
  title: 'Giới thiệu về Nguyễn Văn An',
  description: 'Trang cá nhân của Frontend Developer Nguyễn Văn An',
}
```

**Bước 4**: Chạy ứng dụng
```bash
npm run dev
```

**Giải thích logic:**
1. **Cấu trúc layout**: Sử dụng CSS Grid và Flexbox để tạo layout responsive
2. **Tailwind CSS**: Áp dụng utility classes để tạo giao diện đẹp mắt
3. **Component structure**: Tổ chức code thành các phần logic rõ ràng
4. **Responsive design**: Sử dụng md:grid-cols-2 để responsive trên mobile

## 🔑 Những điểm quan trọng cần lưu ý

1. **App Router vs Pages Router**: App Router là cách tiếp cận mới và được khuyến nghị từ Next.js 13+
2. **TypeScript**: Sử dụng TypeScript giúp code an toàn hơn và dễ bảo trì
3. **Tailwind CSS**: Framework CSS utility-first giúp viết CSS nhanh chóng
4. **File conventions**: Trong App Router, file đặc biệt như `layout.tsx`, `page.tsx`, `loading.tsx` có ý nghĩa riêng
5. **Lỗi thường gặp**: 
   - Không import CSS trong layout
   - Quên export default cho components
   - Sử dụng sai cấu trúc thư mục

## 📝 Bài tập về nhà

Tạo một trang web portfolio đơn giản với các yêu cầu:

1. **Trang chủ**: Hiển thị thông tin cá nhân và ảnh đại diện
2. **Phần kỹ năng**: Liệt kê các kỹ năng lập trình (HTML, CSS, JavaScript, React, v.v.) với thanh tiến trình
3. **Phần dự án**: Hiển thị 3 dự án mẫu (có thể là dự án giả) với tên, mô tả ngắn và hình ảnh
4. **Footer**: Thêm links đến mạng xã hội (GitHub, LinkedIn)
5. **Responsive**: Đảm bảo trang web hiển thị tốt trên mobile và desktop

**Yêu cầu kỹ thuật:**
- Sử dụng Next.js App Router với TypeScript
- Áp dụng Tailwind CSS cho styling
- Code phải clean và có cấu trúc rõ ràng
- Sử dụng semantic HTML tags (header, main, section, footer)

**Gợi ý:**
- Tạo các component riêng cho từng phần (SkillBar, ProjectCard)
- Sử dụng mock data để hiển thị thông tin
- Tham khảo các trang portfolio trên internet để lấy ý tưởng thiết kế
