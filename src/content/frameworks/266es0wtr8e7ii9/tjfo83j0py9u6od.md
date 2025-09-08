# Bài 4: Các mẫu định tuyến (Routing Patterns)


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:
- Hiểu và áp dụng các pattern routing phổ biến trong Next.js
- Tạo được dynamic routes với các mức độ phức tạp khác nhau
- Sử dụng catch-all routes và optional catch-all routes
- Xây dựng cấu trúc route có tính mở rộng và bảo trì cao
- Hiểu cách tổ chức routes cho các dự án thực tế

## 📝 Nội dung chi tiết

### 1. Tổng quan về Routing Patterns

Routing patterns là các cách thức tổ chức và cấu trúc URL trong ứng dụng web. Next.js cung cấp nhiều pattern giúp xây dựng routes linh hoạt và mạnh mẽ:

- **Static Routes**: Routes với đường dẫn cố định
- **Dynamic Routes**: Routes với tham số động
- **Nested Routes**: Routes lồng nhau với layouts
- **Catch-all Routes**: Routes bắt tất cả segments
- **Optional Catch-all Routes**: Routes bắt tất cả (có thể không có)
- **Route Groups**: Nhóm routes để tổ chức code

### 2. Static Routes

Static routes là những routes có đường dẫn cố định, được định nghĩa trực tiếp bằng tên thư mục và file.

```
app/
├── page.tsx           # /
├── about/
│   └── page.tsx      # /about
├── contact/
│   └── page.tsx      # /contact
├── services/
│   ├── page.tsx      # /services
│   ├── web-design/
│   │   └── page.tsx  # /services/web-design
│   └── consulting/
│       └── page.tsx  # /services/consulting
```

**Ví dụ:**
```tsx
// app/services/web-design/page.tsx
export default function WebDesignPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Web Design Services</h1>
      <p className="text-gray-600">
        Chúng tôi cung cấp dịch vụ thiết kế web chuyên nghiệp...
      </p>
    </div>
  )
}
```

### 3. Dynamic Routes

Dynamic routes cho phép tạo ra các routes với tham số động, sử dụng cú pháp `[parameter]`.

#### Single Dynamic Segment
```
app/
├── blog/
│   ├── page.tsx      # /blog
│   └── [slug]/
│       └── page.tsx  # /blog/my-first-post
└── products/
    ├── page.tsx      # /products
    └── [id]/
        └── page.tsx  # /products/123
```

**Ví dụ:**
```tsx
// app/blog/[slug]/page.tsx
interface Props {
  params: {
    slug: string
  }
}

export default function BlogPost({ params }: Props) {
  const { slug } = params
  
  // Trong thực tế, bạn sẽ fetch data dựa trên slug
  const post = {
    title: `Bài viết: ${slug.replace('-', ' ')}`,
    content: 'Nội dung bài viết...',
    publishedAt: '2024-01-15'
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-6">Xuất bản: {post.publishedAt}</p>
      <div className="prose max-w-none">
        <p>{post.content}</p>
      </div>
    </article>
  )
}
```

#### Multiple Dynamic Segments
```
app/
└── shop/
    └── [category]/
        └── [product]/
            └── page.tsx  # /shop/electronics/laptop
```

**Ví dụ:**
```tsx
// app/shop/[category]/[product]/page.tsx
interface Props {
  params: {
    category: string
    product: string
  }
}

export default function ProductPage({ params }: Props) {
  const { category, product } = params

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-4">
        <span>Shop</span> / <span className="capitalize">{category}</span> / 
        <span className="capitalize font-medium">{product}</span>
      </nav>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 aspect-square rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Product Image</span>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4 capitalize">
            {product.replace('-', ' ')}
          </h1>
          <p className="text-gray-600 mb-4">
            Danh mục: <span className="capitalize">{category}</span>
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-6">$299.99</p>
          
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  )
}
```

### 4. Catch-all Routes

Catch-all routes sử dụng cú pháp `[...param]` để bắt tất cả các segments sau đó.

```
app/
└── docs/
    └── [...slug]/
        └── page.tsx  # /docs/a/b/c => params.slug = ['a', 'b', 'c']
```

**Ví dụ:**
```tsx
// app/docs/[...slug]/page.tsx
interface Props {
  params: {
    slug: string[]
  }
}

export default function DocsPage({ params }: Props) {
  const { slug } = params
  
  // slug sẽ là một array: ['getting-started', 'installation']
  // cho URL: /docs/getting-started/installation
  
  const breadcrumbs = slug.map((item, index) => ({
    name: item.replace('-', ' '),
    href: `/docs/${slug.slice(0, index + 1).join('/')}`
  }))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-6">
        <span>Docs</span>
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            {' / '}
            <span className="capitalize">{crumb.name}</span>
          </span>
        ))}
      </nav>
      
      <h1 className="text-4xl font-bold mb-6 capitalize">
        {slug[slug.length - 1]?.replace('-', ' ')}
      </h1>
      
      <div className="prose max-w-none">
        <p>Đây là trang documentation cho: {slug.join(' → ')}</p>
        
        {/* Sidebar với navigation */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Đường dẫn hiện tại:</h3>
          <code className="bg-white px-2 py-1 rounded">
            /docs/{slug.join('/')}
          </code>
        </div>
      </div>
    </div>
  )
}
```

### 5. Optional Catch-all Routes

Optional catch-all routes sử dụng cú pháp `[[...param]]` (double brackets) để bắt tất cả segments bao gồm cả route gốc.

```
app/
└── shop/
    └── [[...category]]/
        └── page.tsx  # Matches /shop, /shop/electronics, /shop/electronics/phones
```

**Ví dụ:**
```tsx
// app/shop/[[...category]]/page.tsx
interface Props {
  params: {
    category?: string[]
  }
}

export default function ShopPage({ params }: Props) {
  const { category = [] } = params
  
  // category có thể là:
  // undefined hoặc [] cho /shop
  // ['electronics'] cho /shop/electronics  
  // ['electronics', 'phones'] cho /shop/electronics/phones

  const renderContent = () => {
    if (category.length === 0) {
      // /shop - Trang chủ shop
      return (
        <div>
          <h1 className="text-4xl font-bold mb-8">Cửa hàng</h1>
          <div className="grid md:grid-cols-3 gap-6">
            <CategoryCard name="Electronics" href="/shop/electronics" />
            <CategoryCard name="Clothing" href="/shop/clothing" />
            <CategoryCard name="Books" href="/shop/books" />
          </div>
        </div>
      )
    }
    
    if (category.length === 1) {
      // /shop/electronics - Trang danh mục
      const categoryName = category[0]
      return (
        <div>
          <h1 className="text-4xl font-bold mb-8 capitalize">
            {categoryName}
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard name="Smartphone" category={categoryName} />
            <ProductCard name="Laptop" category={categoryName} />
            <ProductCard name="Headphones" category={categoryName} />
          </div>
        </div>
      )
    }
    
    // /shop/electronics/phones - Trang sản phẩm chi tiết
    const [categoryName, productType] = category
    return (
      <div>
        <nav className="text-sm text-gray-500 mb-6">
          <span>Shop</span>
          <span> / {categoryName}</span>
          <span> / {productType}</span>
        </nav>
        
        <h1 className="text-4xl font-bold mb-8 capitalize">
          {productType}
        </h1>
        <p>Trang chi tiết cho {productType} trong danh mục {categoryName}</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {renderContent()}
    </div>
  )
}

// Helper components
function CategoryCard({ name, href }: { name: string, href: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 mb-4">Khám phá sản phẩm {name.toLowerCase()}</p>
      <a href={href} className="text-blue-600 hover:text-blue-700 font-medium">
        Xem thêm →
      </a>
    </div>
  )
}

function ProductCard({ name, category }: { name: string, category: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="bg-gray-100 aspect-square rounded-lg mb-4 flex items-center justify-center">
        <span className="text-gray-400">Image</span>
      </div>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-gray-500">{category}</p>
      <p className="text-lg font-bold text-blue-600 mt-2">$199.99</p>
    </div>
  )
}
```

### 6. Route Groups để tổ chức code

Route Groups giúp tổ chức code mà không ảnh hưởng đến URL structure.

```
app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx    # /about
│   ├── contact/
│   │   └── page.tsx    # /contact
│   └── layout.tsx      # Layout cho marketing pages
├── (shop)/
│   ├── products/
│   │   └── page.tsx    # /products
│   ├── cart/
│   │   └── page.tsx    # /cart
│   └── layout.tsx      # Layout cho shop pages
└── (auth)/
    ├── login/
    │   └── page.tsx    # /login
    └── register/
        └── page.tsx    # /register
```

**Marketing Layout:**
```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm border-b">
        <nav className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">Brand</div>
            <div className="space-x-6">
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/products">Shop</a>
            </div>
          </div>
        </nav>
      </header>
      
      <main>{children}</main>
      
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
```

### 7. Nested Dynamic Routes

Kết hợp dynamic routes với nested structure để tạo URL hierarchy phức tạp.

```
app/
└── forum/
    ├── page.tsx          # /forum
    └── [category]/
        ├── page.tsx      # /forum/javascript
        └── [topic]/
            ├── page.tsx  # /forum/javascript/react-hooks
            └── posts/
                └── [postId]/
                    └── page.tsx  # /forum/javascript/react-hooks/posts/123
```

**Ví dụ Forum Topic:**
```tsx
// app/forum/[category]/[topic]/page.tsx
interface Props {
  params: {
    category: string
    topic: string
  }
}

export default function TopicPage({ params }: Props) {
  const { category, topic } = params

  // Mock data - trong thực tế sẽ fetch từ database
  const topicData = {
    title: topic.replace('-', ' '),
    category: category,
    posts: [
      { id: 1, title: 'Getting started with React Hooks', author: 'John' },
      { id: 2, title: 'useState vs useEffect', author: 'Jane' },
      { id: 3, title: 'Custom hooks best practices', author: 'Mike' }
    ]
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <a href="/forum">Forum</a>
        <span> / </span>
        <a href={`/forum/${category}`} className="capitalize">{category}</a>
        <span> / </span>
        <span className="capitalize font-medium">{topic.replace('-', ' ')}</span>
      </nav>

      <h1 className="text-3xl font-bold mb-8 capitalize">
        {topicData.title}
      </h1>

      <div className="space-y-4">
        {topicData.posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <h3 className="font-semibold mb-2">
              <a 
                href={`/forum/${category}/${topic}/posts/${post.id}`}
                className="text-blue-600 hover:text-blue-700"
              >
                {post.title}
              </a>
            </h3>
            <p className="text-sm text-gray-500">by {post.author}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 🏆 Bài tập thực hành

### Đề bài: Xây dựng hệ thống Documentation với routing patterns phức tạp

Tạo một website documentation với các yêu cầu:
1. **Homepage** (`/`): Trang chủ với overview
2. **Docs structure**: `/docs/[...slug]` - Support unlimited nesting
3. **API References**: `/api/[version]/[endpoint]` - Versioned API docs  
4. **Examples**: `/examples/[[...path]]` - Optional nested examples
5. **Blog**: `/blog/[year]/[month]/[slug]` - Date-based blog structure
6. Sử dụng route groups để tổ chức layouts khác nhau

### Lời giải chi tiết:

**Bước 1**: Tạo cấu trúc dự án
```bash
npx create-next-app@latest docs-site --typescript --tailwind --eslint --app
cd docs-site
```

**Bước 2**: Cấu trúc thư mục
```
app/
├── layout.tsx
├── page.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── Breadcrumb.tsx
│   └── CodeBlock.tsx
│
├── (docs)/
│   ├── layout.tsx
│   └── docs/
│       └── [...slug]/
│           └── page.tsx    # /docs/getting-started/installation
│
├── (api-docs)/
│   ├── layout.tsx
│   └── api/
│       └── [version]/
│           └── [endpoint]/
│               └── page.tsx # /api/v1/users
│
├── examples/
│   └── [[...path]]/
│       └── page.tsx        # /examples/react/hooks
│
└── blog/
    └── [year]/
        └── [month]/
            └── [slug]/
                └── page.tsx # /blog/2024/01/next-js-tips
```

**Bước 3**: Root Layout
```tsx
// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DevDocs - Documentation Platform',
  description: 'Comprehensive documentation for developers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-blue-600">
                  DevDocs
                </a>
              </div>
              <div className="flex items-center space-x-8">
                <a href="/docs" className="text-gray-600 hover:text-blue-600">
                  Documentation
                </a>
                <a href="/api/v1" className="text-gray-600 hover:text-blue-600">
                  API Reference
                </a>
                <a href="/examples" className="text-gray-600 hover:text-blue-600">
                  Examples
                </a>
                <a href="/blog" className="text-gray-600 hover:text-blue-600">
                  Blog
                </a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

**Bước 4**: Docs Layout với Sidebar
```tsx
// app/(docs)/layout.tsx
import Sidebar from '../components/Sidebar'

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 max-w-none">
        {children}
      </main>
    </div>
  )
}
```

**Bước 5**: Sidebar Component
```tsx
// app/components/Sidebar.tsx
const docStructure = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Introduction', href: '/docs/getting-started/introduction' },
      { name: 'Installation', href: '/docs/getting-started/installation' },
      { name: 'Configuration', href: '/docs/getting-started/configuration' }
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      { name: 'Routing', href: '/docs/core-concepts/routing' },
      { name: 'Data Fetching', href: '/docs/core-concepts/data-fetching' },
      { name: 'Styling', href: '/docs/core-concepts/styling' }
    ]
  },
  {
    title: 'Advanced',
    items: [
      { name: 'Performance', href: '/docs/advanced/performance' },
      { name: 'Security', href: '/docs/advanced/security' }
    ]
  }
]

export default function Sidebar() {
  return (
    <nav className="w-64 bg-gray-50 min-h-screen p-6">
      <div className="space-y-8">
        {docStructure.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold text-gray-900 mb-3">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-600 hover:text-blue-600 text-sm block py-1"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
```

**Bước 6**: Docs Pages (Catch-all Route)
```tsx
// app/(docs)/docs/[...slug]/page.tsx
import Breadcrumb from '../../../components/Breadcrumb'

interface Props {
  params: {
    slug: string[]
  }
}

// Mock content database
const docsContent: { [key: string]: any } = {
  'getting-started/introduction': {
    title: 'Introduction to DevDocs',
    content: `
      Welcome to DevDocs! This comprehensive platform provides everything you need 
      to understand and implement modern web development practices.
      
      ## What you'll learn
      - Core concepts of modern web development
      - Best practices and patterns
      - Advanced techniques and optimizations
    `,
    lastUpdated: '2024-01-15'
  },
  'getting-started/installation': {
    title: 'Installation Guide',
    content: `
      ## Prerequisites
      - Node.js 18.0 or later
      - npm or yarn package manager
      
      ## Installation Steps
      1. Create a new project
      2. Install dependencies
      3. Configure your environment
    `,
    lastUpdated: '2024-01-14'
  },
  'core-concepts/routing': {
    title: 'Understanding Routing',
    content: `
      Routing is the mechanism that determines which component renders 
      for a given URL path.
      
      ## Types of Routing
      - Static Routes
      - Dynamic Routes
      - Nested Routes
    `,
    lastUpdated: '2024-01-13'
  }
}

export default function DocsPage({ params }: Props) {
  const { slug } = params
  const path = slug.join('/')
  const doc = docsContent[path]
  
  if (!doc) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Documentation Not Found
        </h1>
        <p className="text-gray-600">
          The documentation page you're looking for doesn't exist.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Path: /docs/{path}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <Breadcrumb segments={['docs', ...slug]} />
      
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {doc.title}
        </h1>
        <p className="text-sm text-gray-500">
          Last updated: {doc.lastUpdated}
        </p>
      </header>

      <div className="prose max-w-none">
        <div className="whitespace-pre-line">
          {doc.content}
        </div>
      </div>
      
      {/* Navigation */}
      <div className="mt-12 flex justify-between items-center pt-8 border-t border-gray-200">
        <button className="flex items-center text-blue-600 hover:text-blue-700">
          ← Previous
        </button>
        <button className="flex items-center text-blue-600 hover:text-blue-700">
          Next →
        </button>
      </div>
    </div>
  )
}
```

**Bước 7**: API Documentation (Multiple Dynamic Routes)
```tsx
// app/(api-docs)/api/[version]/[endpoint]/page.tsx
interface Props {
  params: {
    version: string
    endpoint: string
  }
}

const apiDocs: { [key: string]: any } = {
  'v1-users': {
    title: 'Users API',
    version: 'v1',
    endpoint: '/users',
    methods: [
      {
        method: 'GET',
        description: 'Retrieve all users',
        parameters: [
          { name: 'page', type: 'number', description: 'Page number' },
          { name: 'limit', type: 'number', description: 'Items per page' }
        ],
        response: {
          example: `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "total": 100,
  "page": 1
}`
        }
      },
      {
        method: 'POST',
        description: 'Create a new user',
        body: {
          example: `{
  "name": "Jane Doe",
  "email": "jane@example.com"
}`
        },
        response: {
          example: `{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}`
        }
      }
    ]
  }
}

export default function APIDocPage({ params }: Props) {
  const { version, endpoint } = params
  const key = `${version}-${endpoint}`
  const apiDoc = apiDocs[key]
  
  if (!apiDoc) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          API Documentation Not Found
        </h1>
        <p className="text-gray-600">
          API documentation for {version}/{endpoint} doesn't exist.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <header className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <span>API Reference</span>
          <span>/</span>
          <span>{version}</span>
          <span>/</span>
          <span>{endpoint}</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {apiDoc.title}
        </h1>
        
        <div className="flex items-center space-x-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {apiDoc.version}
          </span>
          <code className="bg-gray-100 px-3 py-1 rounded text-sm">
            {apiDoc.endpoint}
          </code>
        </div>
      </header>

      <div className="space-y-8">
        {apiDoc.methods.map((method: any, index: number) => (
          <div key={index} className="border rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                method.method === 'GET' ? 'bg-green-100 text-green-800' :
                method.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {method.method}
              </span>
              <code className="text-lg">{apiDoc.endpoint}</code>
            </div>
            
            <p className="text-gray-600 mb-6">{method.description}</p>
            
            {method.parameters && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Parameters</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 border-b">Name</th>
                        <th className="text-left p-3 border-b">Type</th>
                        <th className="text-left p-3 border-b">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {method.parameters.map((param: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-3 border-b font-mono">{param.name}</td>
                          <td className="p-3 border-b text-blue-600">{param.type}</td>
                          <td className="p-3 border-b">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="grid md:grid-cols-2 gap-6">
              {method.body && (
                <div>
                  <h4 className="font-semibold mb-2">Request Body</h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                    <code>{method.body.example}</code>
                  </pre>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2">Response</h4>
                <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
                  <code>{method.response.example}</code>
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Giải thích logic:**
1. **Catch-all Routes**: `/docs/[...slug]` bắt tất cả nested paths
2. **Multiple Dynamic Segments**: `/api/[version]/[endpoint]` cho versioned API
3. **Route Groups**: `(docs)` và `(api-docs)` để tổ chức layouts khác nhau
4. **Content Management**: Sử dụng object để mock CMS content
5. **Error Handling**: Kiểm tra và hiển thị 404 khi content không tồn tại

## 🔑 Những điểm quan trọng cần lưu ý

1. **Dynamic Segments**: Sử dụng `[param]` cho single segment, `[...param]` cho catch-all
2. **Optional Catch-all**: `[[...param]]` match cả route gốc
3. **Route Priority**: Static routes có priority cao hơn dynamic routes
4. **Parameter Access**: Sử dụng `params` object trong component props
5. **SEO Considerations**: Dynamic routes cần metadata dynamic
6. **Performance**: Cân nhắc việc pre-generate static paths cho SEO
7. **Route Groups**: Dùng `(name)` để tổ chức mà không ảnh hưởng URL
8. **Error Boundaries**: Luôn handle trường hợp params không tồn tại

## 📝 Bài tập về nhà

Xây dựng một **Multi-tenant E-commerce Platform** với routing patterns phức tạp:

### Yêu cầu chính:
1. **Multi-store Structure**: 
   - `[store]/` - Dynamic store routing
   - `[store]/products/[[...category]]` - Nested product categories
   - `[store]/products/[productId]` - Product details

2. **Admin Dashboard**:
   - `admin/[store]/` - Store-specific admin
   - `admin/[store]/products/[...path]` - Nested admin sections
   - `admin/[store]/orders/[status]/[orderId]` - Order management

3. **User Dashboard**:
   - `dashboard/orders/[year]/[month]` - Date-based order history
   - `dashboard/wishlist/[category]` - Categorized wishlists

### Cấu trúc routing yêu cầu:
```
app/
├── [store]/
│   ├── layout.tsx
│   ├── page.tsx                    # /{store}
│   ├── products/
│   │   ├── page.tsx               # /{store}/products
│   │   ├── [[...category]]/
│   │   │   └── page.tsx           # /{store}/products/electronics/phones
│   │   └── [productId]/
│   │       └── page.tsx           # /{store}/products/123
│   └── cart/
│       └── page.tsx               # /{store}/cart
├── admin/
│   └── [store]/
│       ├── layout.tsx
│       ├── page.tsx               # /admin/{store}
│       ├── products/
│       │   └── [...path]/
│       │       └── page.tsx       # /admin/{store}/products/categories/electronics
│       └── orders/
│           └── [status]/
│               └── [orderId]/
│                   └── page.tsx   # /admin/{store}/orders/pending/123
└── dashboard/
    ├── layout.tsx
    ├── orders/
    │   └── [year]/
    │       └── [month]/
    │           └── page.tsx       # /dashboard/orders/2024/01
    └── wishlist/
        └── [category]/
            └── page.tsx           # /dashboard/wishlist/electronics
```

### Yêu cầu kỹ thuật:
- TypeScript với proper typing cho tất cả params
- Tailwind CSS cho styling
- Mock data cho stores, products, orders
- Breadcrumb navigation cho tất cả nested routes
- Store-specific theming based on store slug
- Responsive layouts cho admin và user areas

### Bonus features:
- Store validation (redirect 404 nếu store không tồn tại)
- Dynamic metadata based on store và product info
- Search functionality với query params
- Multi-language support với route prefixes
