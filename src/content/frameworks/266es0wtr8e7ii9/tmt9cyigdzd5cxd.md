---
title: "Bài 3: Cấu trúc thư mục định tuyến (App Router vs Pages Router)"
postId: "tmt9cyigdzd5cxd"
category: "NextJS"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 3: Cấu trúc thư mục định tuyến (App Router vs Pages Router)


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:
- Hiểu rõ sự khác biệt giữa App Router và Pages Router
- Nắm vững cấu trúc thư mục của App Router
- Biết cách migration từ Pages Router sang App Router
- Hiểu các file đặc biệt và convention trong App Router
- Áp dụng được cấu trúc thư mục phù hợp cho dự án

## 📝 Nội dung chi tiết

### 1. Tổng quan về hai hệ thống Router

#### Pages Router (Legacy - Next.js 12 và trước)
Pages Router là hệ thống routing truyền thống của Next.js, sử dụng thư mục `pages/`:

```
pages/
├── index.js          # / (Homepage)
├── about.js          # /about
├── blog/
│   ├── index.js     # /blog
│   └── [slug].js    # /blog/[slug]
├── _app.js          # Custom App component
├── _document.js     # Custom Document
└── api/
    └── users.js     # API route /api/users
```

**Đặc điểm của Pages Router:**
- File-based routing đơn giản
- Mỗi file trong `pages/` tự động trở thành một route
- Hỗ trợ API routes trong `pages/api/`
- Sử dụng `_app.js` và `_document.js` cho custom app và document
- Client Components by default

#### App Router (Modern - Next.js 13+)
App Router là hệ thống routing mới, sử dụng thư mục `app/`:

```
app/
├── layout.tsx        # Root layout
├── page.tsx         # Homepage (/)
├── loading.tsx      # Loading UI
├── error.tsx        # Error UI
├── not-found.tsx    # 404 page
├── about/
│   └── page.tsx     # /about
├── blog/
│   ├── layout.tsx   # Blog layout
│   ├── page.tsx     # /blog
│   └── [slug]/
│       └── page.tsx # /blog/[slug]
└── api/
    └── users/
        └── route.ts # API route /api/users
```

**Đặc điểm của App Router:**
- Server Components by default
- Hỗ trợ layouts lồng nhau (nested layouts)
- Streaming và Suspense built-in
- Cải thiện data fetching
- File conventions mới (page.tsx, layout.tsx, loading.tsx, error.tsx)

### 2. So sánh chi tiết App Router vs Pages Router

| Tính năng | Pages Router | App Router |
|-----------|--------------|------------|
| **Thư mục** | `pages/` | `app/` |
| **Routing** | File-based | Folder-based với file conventions |
| **Default Component** | Client Component | Server Component |
| **Layouts** | Một layout chung với `_app.js` | Nested layouts với `layout.tsx` |
| **Loading States** | Tự implement | Built-in với `loading.tsx` |
| **Error Handling** | Tự implement | Built-in với `error.tsx` |
| **API Routes** | `pages/api/` | `app/api/*/route.ts` |
| **Data Fetching** | `getServerSideProps`, `getStaticProps` | `fetch()` trong Server Components |
| **Streaming** | Không hỗ trợ | Hỗ trợ với Suspense |

### 3. Cấu trúc thư mục App Router chi tiết

#### File Conventions trong App Router

**Routing Files:**
- **`layout.tsx`**: **Layout** là thành phần UI được chia sẻ giữa nhiều trang, cung cấp shared UI cho một route và children routes
- **`page.tsx`**: **Page** là thành phần UI duy nhất cho một route cụ thể và làm cho route publicly accessible
- **`loading.tsx`**: **Loading UI** là giao diện hiển thị trong khi đang tải dữ liệu cho một route và children routes
- **`not-found.tsx`**: **Not Found UI** là giao diện hiển thị khi không tìm thấy trang cho một route và children routes
- **`error.tsx`**: **Error UI** là giao diện hiển thị khi có lỗi xảy ra cho một route và children routes
- **`global-error.tsx`**: **Global Error UI** là giao diện xử lý lỗi toàn cục của ứng dụng
- **`route.tsx`**: **Route Handler** là endpoint API phía server để xử lý HTTP requests
- **`template.tsx`**: **Template** là layout đặc biệt được re-render lại mỗi khi navigate
- **`default.tsx`**: **Default UI** là giao diện fallback cho Parallel Routes khi không có match

#### Ví dụ cấu trúc thư mục phức tạp

```
app/
├── globals.css
├── layout.tsx           # Root layout
├── page.tsx            # Home page (/)
├── loading.tsx         # Global loading
├── error.tsx           # Global error
├── not-found.tsx       # Global 404
│
├── (marketing)/         # Route Group
│   ├── about/
│   │   └── page.tsx    # /about
│   └── contact/
│       └── page.tsx    # /contact
│
├── dashboard/
│   ├── layout.tsx      # Dashboard layout
│   ├── page.tsx        # /dashboard
│   ├── loading.tsx     # Dashboard loading
│   ├── settings/
│   │   ├── page.tsx    # /dashboard/settings
│   │   └── profile/
│   │       └── page.tsx # /dashboard/settings/profile
│   └── @analytics/      # Parallel Route
│       └── page.tsx
│
├── blog/
│   ├── layout.tsx
│   ├── page.tsx        # /blog
│   └── [category]/
│       ├── page.tsx    # /blog/[category]
│       └── [slug]/
│           └── page.tsx # /blog/[category]/[slug]
│
└── api/
    ├── auth/
    │   └── route.ts    # /api/auth
    └── posts/
        └── [id]/
            └── route.ts # /api/posts/[id]
```

### 4. Route Groups và Organization

#### Route Groups `(name)`
**Route Groups** là cách tổ chức các thư mục route theo nhóm logic mà không ảnh hưởng đến cấu trúc URL. Route groups cho phép tổ chức routes mà không ảnh hưởng đến URL path:

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx    # /login (không có /auth)
│   └── register/
│       └── page.tsx    # /register
├── (shop)/
│   ├── products/
│   │   └── page.tsx    # /products
│   └── cart/
│       └── page.tsx    # /cart
└── (marketing)/
    ├── about/
    │   └── page.tsx    # /about
    └── contact/
        └── page.tsx    # /contact
```

#### Private Folders `_folder`
**Private Folders** là các thư mục bắt đầu với dấu gạch dưới (_) được Next.js coi là thư mục riêng tư, không tạo ra routes. Folders bắt đầu với underscore được coi là private:

```
app/
├── _lib/               # Private folder - không tạo routes
│   ├── utils.ts
│   └── constants.ts
├── _components/        # Private folder
│   ├── Header.tsx
│   └── Footer.tsx
└── dashboard/
    └── page.tsx       # /dashboard
```

### 5. Nested Layouts

**Nested Layouts** là tính năng cho phép tạo ra các layout lồng nhau, trong đó layout con sẽ được render bên trong layout cha. Một trong những tính năng mạnh mẽ nhất của App Router là nested layouts:

#### Root Layout
```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <header className="bg-blue-600 text-white p-4">
          <h1>My Website</h1>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white p-4">
          <p>&copy; 2024 My Website</p>
        </footer>
      </body>
    </html>
  )
}
```

#### Dashboard Layout
```tsx
// app/dashboard/layout.tsx
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <nav className="w-64 bg-gray-100 p-4">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="block p-2 hover:bg-gray-200">
              Overview
            </Link>
          </li>
          <li>
            <Link href="/dashboard/settings" className="block p-2 hover:bg-gray-200">
              Settings
            </Link>
          </li>
          <li>
            <Link href="/dashboard/profile" className="block p-2 hover:bg-gray-200">
              Profile
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  )
}
```

### 6. Migration từ Pages Router sang App Router

#### Bước 1: Tạo thư mục `app/`
```bash
mkdir app
```

#### Bước 2: Di chuyển Root Layout
**Pages Router:**
```jsx
// pages/_app.js
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}
```

**App Router:**
```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
```

#### Bước 3: Di chuyển Pages
**Pages Router:**
```jsx
// pages/index.js
export default function HomePage() {
  return <h1>Home</h1>
}

// pages/about.js
export default function AboutPage() {
  return <h1>About</h1>
}
```

**App Router:**
```tsx
// app/page.tsx
export default function HomePage() {
  return <h1>Home</h1>
}

// app/about/page.tsx
export default function AboutPage() {
  return <h1>About</h1>
}
```

#### Bước 4: Di chuyển API Routes
**Pages Router:**
```js
// pages/api/users.js
export default function handler(req, res) {
  res.status(200).json({ users: [] })
}
```

**App Router:**
```ts
// app/api/users/route.ts
export async function GET() {
  return Response.json({ users: [] })
}
```

## 🏆 Bài tập thực hành

### Đề bài: Tạo ứng dụng E-learning với cấu trúc App Router

Xây dựng một ứng dụng e-learning với các yêu cầu:
1. **Homepage**: Trang chủ hiển thị khóa học nổi bật
2. **Courses**: Danh sách tất cả khóa học
3. **Course Detail**: Chi tiết khóa học và danh sách bài học
4. **Lesson**: Nội dung bài học cụ thể
5. **Dashboard**: Khu vực quản trị với sidebar navigation
6. **Profile**: Trang profile người dùng
7. Sử dụng nested layouts và route groups

### Lời giải chi tiết:

**Bước 1**: Tạo dự án
```bash
npx create-next-app@latest elearning-app --typescript --tailwind --eslint --app
cd elearning-app
```

**Bước 2**: Tạo cấu trúc thư mục
```
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── components/
│   ├── Navigation.tsx
│   └── CourseCard.tsx
│
├── (learning)/           # Route group cho learning
│   ├── courses/
│   │   ├── layout.tsx
│   │   ├── page.tsx     # /courses
│   │   └── [id]/
│   │       ├── page.tsx  # /courses/[id]
│   │       └── lessons/
│   │           └── [lessonId]/
│   │               └── page.tsx # /courses/[id]/lessons/[lessonId]
│   └── profile/
│       └── page.tsx     # /profile
│
├── dashboard/
│   ├── layout.tsx       # Dashboard layout with sidebar
│   ├── page.tsx        # /dashboard
│   ├── courses/
│   │   ├── page.tsx    # /dashboard/courses
│   │   └── create/
│   │       └── page.tsx # /dashboard/courses/create
│   └── users/
│       └── page.tsx    # /dashboard/users
│
└── api/
    ├── courses/
    │   └── route.ts
    └── lessons/
        └── route.ts
```

**Bước 3**: Root Layout
```tsx
// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'E-Learning Platform',
  description: 'Learn new skills online',
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

**Bước 4**: Navigation Component
```tsx
// app/components/Navigation.tsx
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              ELearning
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Trang chủ
            </Link>
            <Link href="/courses" className="text-gray-600 hover:text-blue-600">
              Khóa học
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-blue-600">
              Profile
            </Link>
            <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
```

**Bước 5**: Homepage
```tsx
// app/page.tsx
import Link from 'next/link'
import CourseCard from './components/CourseCard'

const featuredCourses = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    instructor: 'John Doe',
    duration: '4 weeks',
    students: 1250,
    image: '/course-1.jpg'
  },
  {
    id: 2,
    title: 'Next.js Mastery',
    description: 'Master Next.js for full-stack development',
    instructor: 'Jane Smith',
    duration: '6 weeks',
    students: 890,
    image: '/course-2.jpg'
  },
  {
    id: 3,
    title: 'TypeScript Pro',
    description: 'Advanced TypeScript concepts and patterns',
    instructor: 'Mike Johnson',
    duration: '3 weeks',
    students: 654,
    image: '/course-3.jpg'
  }
]

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Học hỏi không giới hạn
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Khám phá hàng nghìn khóa học chất lượng cao từ các chuyên gia hàng đầu
            </p>
            <div className="space-x-4">
              <Link 
                href="/courses"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Khám phá khóa học
              </Link>
              <Link 
                href="/profile"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Bắt đầu học
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Khóa học nổi bật</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Những khóa học được yêu thích nhất từ cộng đồng học viên
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/courses"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xem tất cả khóa học
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
```

**Bước 6**: Course Card Component
```tsx
// app/components/CourseCard.tsx
import Link from 'next/link'

interface Course {
  id: number
  title: string
  description: string
  instructor: string
  duration: string
  students: number
  image: string
}

interface Props {
  course: Course
}

export default function CourseCard({ course }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500"></div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>👨‍🏫 {course.instructor}</span>
          <span>⏱️ {course.duration}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            👥 {course.students} học viên
          </span>
          <Link 
            href={`/courses/${course.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  )
}
```

**Bước 7**: Courses Layout
```tsx
// app/(learning)/courses/layout.tsx
export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}
```

**Bước 8**: Courses List Page
```tsx
// app/(learning)/courses/page.tsx
import CourseCard from '../../components/CourseCard'

const allCourses = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Learn the basics of React development',
    instructor: 'John Doe',
    duration: '4 weeks',
    students: 1250,
    image: '/course-1.jpg'
  },
  {
    id: 2,
    title: 'Next.js Mastery',
    description: 'Master Next.js for full-stack development',
    instructor: 'Jane Smith',
    duration: '6 weeks',
    students: 890,
    image: '/course-2.jpg'
  },
  {
    id: 3,
    title: 'TypeScript Pro',
    description: 'Advanced TypeScript concepts and patterns',
    instructor: 'Mike Johnson',
    duration: '3 weeks',
    students: 654,
    image: '/course-3.jpg'
  },
  {
    id: 4,
    title: 'Node.js Backend',
    description: 'Build scalable backend applications',
    instructor: 'Sarah Wilson',
    duration: '5 weeks',
    students: 432,
    image: '/course-4.jpg'
  }
]

export default function CoursesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tất cả khóa học</h1>
        <p className="text-gray-600">
          Khám phá thư viện khóa học phong phú của chúng tôi
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
```

**Bước 9**: Dashboard Layout
```tsx
// app/dashboard/layout.tsx
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
        </div>
        
        <ul className="space-y-1">
          <li>
            <Link 
              href="/dashboard" 
              className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              📊 Tổng quan
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/courses" 
              className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              📚 Quản lý khóa học
            </Link>
          </li>
          <li>
            <Link 
              href="/dashboard/users" 
              className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            >
              👥 Quản lý người dùng
            </Link>
          </li>
        </ul>
      </nav>
      
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
```

**Giải thích logic:**
1. **Route Groups**: Sử dụng `(learning)` để nhóm routes liên quan mà không ảnh hưởng URL
2. **Nested Layouts**: Dashboard có layout riêng với sidebar
3. **File Conventions**: Sử dụng `page.tsx`, `layout.tsx` theo chuẩn App Router
4. **Component Organization**: Tách components ra thành files riêng để tái sử dụng
5. **TypeScript**: Định nghĩa interfaces cho type safety

## 🔑 Những điểm quan trọng cần lưu ý

1. **App Router vs Pages Router**: App Router là future của Next.js, nên ưu tiên sử dụng
2. **File Conventions**: 
   - `page.tsx`: Tạo route công khai
   - `layout.tsx`: Shared UI cho route và children
   - `loading.tsx`, `error.tsx`: UI states đặc biệt
3. **Route Groups**: Sử dụng `(name)` để tổ chức mà không ảnh hưởng URL
4. **Private Folders**: `_folder` không tạo routes, dùng để tổ chức code
5. **Server Components**: Default trong App Router, tốt cho performance
6. **Migration Strategy**: Có thể sử dụng cả App Router và Pages Router trong cùng project
7. **Lỗi thường gặp**:
   - Quên export default trong page components
   - Sai tên file conventions (page.tsx, not index.tsx)
   - Không hiểu sự khác biệt Server vs Client Components

## 📝 Bài tập về nhà

Tạo một **Blog Management System** sử dụng App Router với cấu trúc phức tạp:

### Yêu cầu chính:
1. **Public Area** (Route Group: `(public)`):
   - Homepage với blog posts nổi bật
   - Blog listing page với pagination
   - Blog post detail với comments
   - Author profile pages
   - Categories và Tags pages

2. **Admin Area** (Route: `admin/`):
   - Dashboard với thống kê
   - Posts management (CRUD)
   - Categories management
   - Users management
   - Nested layouts với sidebar navigation

3. **API Routes**:
   - `/api/posts` - CRUD operations
   - `/api/categories` - Categories management
   - `/api/comments` - Comments management

### Cấu trúc thư mục yêu cầu:
```
app/
├── layout.tsx
├── page.tsx
├── (public)/
│   ├── blog/
│   │   ├── page.tsx              # /blog
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # /blog/category/[slug]
│   │   └── [slug]/
│   │       └── page.tsx          # /blog/[slug]
│   ├── authors/
│   │   └── [id]/
│   │       └── page.tsx          # /authors/[id]
│   └── about/
│       └── page.tsx              # /about
├── admin/
│   ├── layout.tsx                # Admin layout với sidebar
│   ├── page.tsx                  # /admin
│   ├── posts/
│   │   ├── page.tsx             # /admin/posts
│   │   ├── create/
│   │   │   └── page.tsx         # /admin/posts/create
│   │   └── [id]/
│   │       ├── page.tsx         # /admin/posts/[id]
│   │       └── edit/
│   │           └── page.tsx     # /admin/posts/[id]/edit
│   ├── categories/
│   │   └── page.tsx             # /admin/categories
│   └── users/
│       └── page.tsx             # /admin/users
└── api/
    ├── posts/
    │   ├── route.ts
    │   └── [id]/
    │       └── route.ts
    ├── categories/
    │   └── route.ts
    └── comments/
        └── route.ts
```

### Yêu cầu kỹ thuật:
- Sử dụng TypeScript và Tailwind CSS
- Implement nested layouts cho admin area
- Tạo loading.tsx và error.tsx cho các routes chính
- Sử dụng Route Groups để tổ chức code
- Mock data cho posts, categories, users
- Responsive design cho cả public và admin areas

### Bonus:
- Implement search functionality
- Add pagination cho blog listing
- Create breadcrumb navigation
- Add dark/light theme toggle

---

*Post ID: tmt9cyigdzd5cxd*  
*Category: NextJS*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
