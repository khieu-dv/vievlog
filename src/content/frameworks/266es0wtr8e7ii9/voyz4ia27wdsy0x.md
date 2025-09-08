# Bài 2: Hệ thống định tuyến (Routing)


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:
- Hiểu các khái niệm cơ bản về routing trong Next.js
- Nắm vững thuật ngữ định tuyến và cách hoạt động
- Phân biệt được các loại router trong Next.js
- Tạo được các route cơ bản sử dụng App Router
- Hiểu cách Next.js xử lý navigation giữa các trang

## 📝 Nội dung chi tiết

### 1. Routing là gì?

Routing (định tuyến) là quá trình xác định trang hoặc component nào sẽ được hiển thị dựa trên URL mà người dùng truy cập. Trong ứng dụng web, routing cho phép:

- **Navigation**: Di chuyển giữa các trang khác nhau
- **Deep linking**: Truy cập trực tiếp vào một trang cụ thể thông qua URL
- **Back/Forward**: Sử dụng nút back/forward của browser
- **Bookmarking**: Lưu bookmark các trang cụ thể

### 2. Thuật ngữ định tuyến

#### Tree (Cây)
Là cấu trúc dữ liệu để tổ chức thứ bậc. Trong Next.js, file system tạo thành một cây thư mục.

```
app/
├── page.tsx          # Root page
├── about/
│   └── page.tsx      # About page  
└── products/
    ├── page.tsx      # Products listing
    └── [id]/
        └── page.tsx  # Product detail
```

#### Subtree (Cây con)
Là một phần của cây, bắt đầu từ một node và bao gồm tất cả descendants của nó.

#### Root (Gốc)
Node đầu tiên trong tree hoặc subtree, trong Next.js là thư mục `app/`.

#### Leaf (Lá)
Nodes không có children, như file `page.tsx` trong segment cuối cùng.

#### URL Segment
Là phần của URL path được phân tách bằng dấu `/`.

```
https://example.com/products/shoes/nike
                   |---------|-----|----| 
                   segment 1|seg 2|seg 3
```

#### URL Path
Phần của URL đi sau domain (bao gồm các segments).

### 3. Các loại Router trong Next.js

#### App Router (Khuyến nghị - Next.js 13+)
- **Thư mục**: `app/`
- **Đặc điểm**: 
  - Hỗ trợ Server Components
  - Cải thiện hiệu suất với Streaming và Suspense
  - Hỗ trợ layouts lồng nhau
  - Cải thiện data fetching

#### Pages Router (Legacy - Next.js 12 trở xuống)
- **Thư mục**: `pages/`
- **Đặc điểm**:
  - Cách tiếp cận cũ nhưng vẫn được hỗ trợ
  - Client Components by default
  - API Routes trong `pages/api/`

### 4. Cách hoạt động của App Router

#### File System Based Routing
**File System Based Routing** là cách tiếp cận định tuyến dựa trên cấu trúc thư mục và tên file. Next.js sử dụng file system để định nghĩa routes:

```
app/
├── page.tsx                 # / 
├── about/
│   └── page.tsx            # /about
├── blog/
│   ├── page.tsx            # /blog
│   └── [slug]/
│       └── page.tsx        # /blog/[slug]
└── dashboard/
    ├── page.tsx            # /dashboard
    ├── settings/
    │   └── page.tsx        # /dashboard/settings
    └── profile/
        └── page.tsx        # /dashboard/profile
```

#### Special Files
Trong App Router, các file đặc biệt có ý nghĩa riêng:

- **`page.tsx`**: Trang chính của route
- **`layout.tsx`**: Layout chia sẻ cho route và children
- **`loading.tsx`**: UI hiển thị khi đang loading
- **`error.tsx`**: UI hiển thị khi có lỗi
- **`not-found.tsx`**: UI hiển thị khi không tìm thấy

### 5. Tạo Routes cơ bản

#### Static Routes
**Static Routes** là các tuyến đường với đường dẫn cố định, không thay đổi. Routes với path cố định:

```tsx
// app/page.tsx - Homepage (/)
export default function Home() {
  return <h1>Trang chủ</h1>
}

// app/about/page.tsx - About page (/about)
export default function About() {
  return <h1>Giới thiệu</h1>
}

// app/contact/page.tsx - Contact page (/contact)
export default function Contact() {
  return <h1>Liên hệ</h1>
}
```

#### Dynamic Routes
**Dynamic Routes** là các tuyến đường có thể thay đổi dựa trên tham số được truyền vào URL. Routes với tham số động:

```tsx
// app/blog/[slug]/page.tsx - Blog post (/blog/my-first-post)
interface Props {
  params: {
    slug: string
  }
}

export default function BlogPost({ params }: Props) {
  return <h1>Bài viết: {params.slug}</h1>
}

// app/products/[category]/[id]/page.tsx - Product (/products/electronics/123)
interface Props {
  params: {
    category: string
    id: string
  }
}

export default function Product({ params }: Props) {
  return (
    <div>
      <h1>Sản phẩm ID: {params.id}</h1>
      <p>Danh mục: {params.category}</p>
    </div>
  )
}
```

### 6. Navigation giữa các trang

#### Link Component
Sử dụng `Link` component để navigation client-side:

```tsx
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="flex gap-4">
      <Link href="/" className="text-blue-500 hover:underline">
        Trang chủ
      </Link>
      <Link href="/about" className="text-blue-500 hover:underline">
        Giới thiệu
      </Link>
      <Link href="/blog" className="text-blue-500 hover:underline">
        Blog
      </Link>
      <Link href="/contact" className="text-blue-500 hover:underline">
        Liên hệ
      </Link>
    </nav>
  )
}
```

#### useRouter Hook
Sử dụng programmatic navigation:

```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()

  const handleLogin = async (formData: FormData) => {
    // Logic đăng nhập
    const success = await login(formData)
    
    if (success) {
      // Chuyển hướng sau khi đăng nhập thành công
      router.push('/dashboard')
    }
  }

  return (
    <form action={handleLogin}>
      {/* Form fields */}
      <button type="submit">Đăng nhập</button>
    </form>
  )
}
```

### 7. Nested Routes và Layouts

#### Nested Routing
**Nested Routing** là cách tổ chức các tuyến đường theo cấu trúc phân cấp, cho phép tạo ra các route con bên trong route cha. Tạo routes lồng nhau:

```
app/
├── layout.tsx           # Root layout
├── page.tsx            # Home page
└── dashboard/
    ├── layout.tsx      # Dashboard layout
    ├── page.tsx        # Dashboard home
    ├── profile/
    │   └── page.tsx    # Profile page
    └── settings/
        └── page.tsx    # Settings page
```

#### Dashboard Layout
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link href="/dashboard" className="flex items-center">
                Dashboard
              </Link>
              <Link href="/dashboard/profile" className="flex items-center">
                Profile
              </Link>
              <Link href="/dashboard/settings" className="flex items-center">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  )
}
```

## 🏆 Bài tập thực hành

### Đề bài: Xây dựng trang web Blog đơn giản

Tạo một trang web blog với cấu trúc routing như sau:
- Trang chủ (`/`): Hiển thị danh sách bài viết
- Trang blog (`/blog`): Danh sách tất cả bài viết
- Chi tiết bài viết (`/blog/[slug]`): Hiển thị nội dung bài viết
- Trang giới thiệu (`/about`): Thông tin về blog
- Navigation bar có mặt trên tất cả trang

### Lời giải chi tiết:

**Bước 1**: Tạo dự án mới
```bash
npx create-next-app@latest blog-routing --typescript --tailwind --eslint --app
cd blog-routing
```

**Bước 2**: Tạo cấu trúc thư mục
```
app/
├── layout.tsx
├── page.tsx
├── about/
│   └── page.tsx
├── blog/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
└── components/
    └── Navigation.tsx
```

**Bước 3**: Tạo Navigation component
```tsx
// app/components/Navigation.tsx
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">MyBlog</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300"
            >
              Trang chủ
            </Link>
            <Link 
              href="/blog" 
              className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300"
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="py-4 px-2 text-gray-500 hover:text-blue-500 transition duration-300"
            >
              Giới thiệu
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
```

**Bước 4**: Cập nhật Root Layout
```tsx
// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Blog',
  description: 'Blog cá nhân về lập trình',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
```

**Bước 5**: Tạo trang chủ
```tsx
// app/page.tsx
import Link from 'next/link'

const featuredPosts = [
  {
    slug: 'gioi-thieu-nextjs',
    title: 'Giới thiệu về Next.js',
    excerpt: 'Next.js là framework React mạnh mẽ cho phát triển ứng dụng web full-stack.',
    date: '2024-01-15'
  },
  {
    slug: 'typescript-co-ban',
    title: 'TypeScript cơ bản',
    excerpt: 'Tìm hiểu các khái niệm cơ bản của TypeScript và cách áp dụng.',
    date: '2024-01-10'
  },
  {
    slug: 'tailwind-css',
    title: 'Styling với Tailwind CSS',
    excerpt: 'Hướng dẫn sử dụng Tailwind CSS để tạo giao diện đẹp mắt.',
    date: '2024-01-05'
  }
]

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chào mừng đến với Blog của tôi
        </h1>
        <p className="text-xl text-gray-600">
          Chia sẻ kiến thức về lập trình và công nghệ
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết nổi bật</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <article 
              key={post.slug}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="font-semibold text-xl text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="text-center">
        <Link 
          href="/blog"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Xem tất cả bài viết
        </Link>
      </div>
    </main>
  )
}
```

**Bước 6**: Tạo trang blog
```tsx
// app/blog/page.tsx
import Link from 'next/link'

const allPosts = [
  {
    slug: 'gioi-thieu-nextjs',
    title: 'Giới thiệu về Next.js',
    excerpt: 'Next.js là framework React mạnh mẽ cho phát triển ứng dụng web full-stack.',
    date: '2024-01-15',
    category: 'Framework'
  },
  {
    slug: 'typescript-co-ban',
    title: 'TypeScript cơ bản',
    excerpt: 'Tìm hiểu các khái niệm cơ bản của TypeScript và cách áp dụng.',
    date: '2024-01-10',
    category: 'Programming'
  },
  {
    slug: 'tailwind-css',
    title: 'Styling với Tailwind CSS',
    excerpt: 'Hướng dẫn sử dụng Tailwind CSS để tạo giao diện đẹp mắt.',
    date: '2024-01-05',
    category: 'CSS'
  },
  {
    slug: 'react-hooks',
    title: 'React Hooks nâng cao',
    excerpt: 'Khám phá các React Hooks nâng cao và cách sử dụng hiệu quả.',
    date: '2024-01-01',
    category: 'React'
  }
]

export default function BlogList() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tất cả bài viết</h1>
        <p className="text-gray-600">
          Khám phá các bài viết về lập trình và công nghệ
        </p>
      </div>

      <div className="space-y-6">
        {allPosts.map((post) => (
          <article 
            key={post.slug}
            className="border-b border-gray-200 pb-6 last:border-b-0"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {post.category}
              </span>
              <span className="text-sm text-gray-500">{post.date}</span>
            </div>
            
            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
            </Link>
            
            <p className="text-gray-600 mb-4">
              {post.excerpt}
            </p>
            
            <Link 
              href={`/blog/${post.slug}`}
              className="text-blue-500 hover:text-blue-700 font-medium"
            >
              Đọc bài viết →
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
```

**Bước 7**: Tạo trang chi tiết bài viết (Dynamic Route)
```tsx
// app/blog/[slug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: {
    slug: string
  }
}

// Mock data - trong thực tế sẽ fetch từ database hoặc CMS
const posts: { [key: string]: any } = {
  'gioi-thieu-nextjs': {
    title: 'Giới thiệu về Next.js',
    content: `
      Next.js là một React framework được phát triển bởi Vercel...
      
      ## Tính năng chính
      - Server-Side Rendering (SSR)
      - Static Site Generation (SSG)
      - Automatic Code Splitting
      - Built-in Routing
    `,
    date: '2024-01-15',
    category: 'Framework'
  },
  'typescript-co-ban': {
    title: 'TypeScript cơ bản',
    content: `
      TypeScript là superset của JavaScript...
      
      ## Lợi ích của TypeScript
      - Type Safety
      - Better IDE Support
      - Enhanced Refactoring
    `,
    date: '2024-01-10',
    category: 'Programming'
  }
}

export default function BlogPost({ params }: Props) {
  const post = posts[params.slug]
  
  if (!post) {
    notFound()
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        href="/blog"
        className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6"
      >
        ← Quay lại blog
      </Link>

      <article>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
              {post.category}
            </span>
            <span className="text-gray-500">{post.date}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
        </div>

        <div className="prose max-w-none">
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {post.content}
          </div>
        </div>
      </article>
    </main>
  )
}
```

**Bước 8**: Tạo trang About
```tsx
// app/about/page.tsx
export default function About() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Giới thiệu về tôi
        </h1>
        <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
          <span className="text-4xl">👨‍💻</span>
        </div>
      </div>

      <div className="prose max-w-none mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Xin chào!</h2>
          <p className="text-gray-600 mb-4">
            Tôi là một Frontend Developer đam mê công nghệ và chia sẻ kiến thức. 
            Blog này được tạo ra để chia sẻ những kinh nghiệm, kiến thức mà tôi học được
            trong quá trình phát triển ứng dụng web.
          </p>
          
          <h3 className="text-xl font-semibold mb-3">Kỹ năng chính</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="font-medium mb-2">Frontend</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• React.js & Next.js</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tools & Others</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Git & GitHub</li>
                <li>• VS Code</li>
                <li>• Figma</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-600">
            Nếu bạn có bất kỳ câu hỏi nào hoặc muốn kết nối, đừng ngần ngại liên hệ với tôi!
          </p>
        </div>
      </div>
    </main>
  )
}
```

**Giải thích logic:**
1. **File-based routing**: Sử dụng cấu trúc thư mục để định nghĩa routes
2. **Navigation component**: Tạo component dùng chung cho navigation
3. **Dynamic routing**: Sử dụng `[slug]` để tạo dynamic routes
4. **Type safety**: Định nghĩa interfaces cho props
5. **Error handling**: Sử dụng `notFound()` khi không tìm thấy bài viết

## 🔑 Những điểm quan trọng cần lưu ý

1. **File-based Routing**: Next.js sử dụng file system để định nghĩa routes, không cần config routing
2. **Special Files**: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` có ý nghĩa đặc biệt
3. **Dynamic Routes**: Sử dụng `[]` để tạo dynamic segments như `[id]`, `[slug]`
4. **Navigation**: 
   - Sử dụng `Link` component cho client-side navigation  
   - Sử dụng `useRouter` hook cho programmatic navigation
5. **Nested Layouts**: Layouts có thể lồng nhau, layout cha sẽ bao bọc layout con
6. **Lỗi thường gặp**:
   - Quên export default cho page components
   - Sai tên file (phải là `page.tsx`, không phải `index.tsx`)
   - Không sử dụng `'use client'` cho client components khi cần thiết

## 📝 Bài tập về nhà

Tạo một trang web **E-commerce** đơn giản với cấu trúc routing như sau:

1. **Trang chủ** (`/`): Hiển thị sản phẩm nổi bật
2. **Danh mục sản phẩm** (`/products`): Hiển thị tất cả sản phẩm
3. **Chi tiết sản phẩm** (`/products/[id]`): Hiển thị chi tiết một sản phẩm
4. **Giỏ hàng** (`/cart`): Hiển thị giỏ hàng (UI only)
5. **Navigation**: Navigation bar responsive với logo và menu

**Yêu cầu:**
- Sử dụng Next.js App Router với TypeScript
- Áp dụng Tailwind CSS cho styling  
- Mock data cho sản phẩm (ít nhất 6 sản phẩm)
- Navigation responsive (hamburger menu trên mobile)
- Hiệu ứng hover và transition mượt mà

**Cấu trúc dữ liệu sản phẩm:**
```typescript
interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
}
```

**Gợi ý:**
- Tạo component `ProductCard` để tái sử dụng
- Sử dụng Grid layout cho danh sách sản phẩm
- Thêm breadcrumb navigation cho UX tốt hơn
- Sử dụng Next.js `Image` component cho tối ưu hình ảnh
