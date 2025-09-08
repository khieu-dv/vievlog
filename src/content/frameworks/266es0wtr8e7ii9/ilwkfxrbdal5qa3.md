# Bài 7: Các chiến lược render trang


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:
- Hiểu các chiến lược rendering trong Next.js: SSR, SSG, CSR, ISR
- Phân biệt Server Components và Client Components
- Chọn chiến lược rendering phù hợp cho từng use case
- Triển khai Static Generation với generateStaticParams
- Sử dụng Incremental Static Regeneration (ISR) hiệu quả
- Tối ưu performance với rendering strategies

## 📝 Nội dung chi tiết

### 1. Tổng quan các chiến lược Rendering

Next.js cung cấp nhiều chiến lược rendering để tối ưu performance và user experience:

#### Server-Side Rendering (SSR)
**Server-Side Rendering (SSR)** là quá trình tạo HTML trên máy chủ cho mỗi request từ người dùng:
- Render HTML trên server cho mỗi request
- SEO friendly, fast initial page load
- Slower subsequent navigations

#### Static Site Generation (SSG)
**Static Site Generation (SSG)** là quá trình tạo trước các trang HTML tại thời điểm build, trước khi deploy:
- Pre-render HTML tại build time
- Fastest performance, CDN cacheable
- Chỉ phù hợp với static content

#### Client-Side Rendering (CSR)
**Client-Side Rendering (CSR)** là quá trình render giao diện trên trình duyệt của người dùng thay vì trên server:
- Render trên browser với JavaScript
- Fast subsequent navigations
- Slower initial load, không SEO friendly

#### Incremental Static Regeneration (ISR)
**Incremental Static Regeneration (ISR)** là chiến lược kết hợp SSG với khả năng cập nhật nội dung tự động ở background:
- Hybrid: Static generation + background updates
- Best of both worlds: fast + fresh content
- Complex caching strategies

### 2. Server Components vs Client Components

#### Server Components (Default trong App Router)
**Server Components** là các React component được render và thực thi trên server, sau đó gửi HTML đã render về client. Server Components render trên server và gửi HTML về client:

```tsx
// app/blog/page.tsx - Server Component (default)
async function getBlogPosts() {
  // This runs on the server
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  return res.json()
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="space-y-6">
        {posts.map((post: any) => (
          <article key={post.id} className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.excerpt}</p>
            <time className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </article>
        ))}
      </div>
    </div>
  )
}
```

**Ưu điểm Server Components:**
- Zero JavaScript bundle
- Access to server resources (databases, file system)
- Improved SEO
- Better performance cho static content

**Nhược điểm:**
- Không thể sử dụng browser APIs
- Không có interactivity
- Không thể use React hooks như useState, useEffect

#### Client Components
**Client Components** là các React component được render và thực thi trên trình duyệt của người dùng, có thể tương tác và sử dụng React hooks. Client Components cần directive `'use client'` và render trên browser:

```tsx
// app/components/InteractiveCounter.tsx - Client Component
'use client'
import { useState, useEffect } from 'react'

export default function InteractiveCounter({ initialCount = 0 }: { initialCount?: number }) {
  const [count, setCount] = useState(initialCount)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Avoid hydration mismatch
    return <div className="h-20 bg-gray-100 animate-pulse rounded" />
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Interactive Counter</h3>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -
        </button>
        
        <span className="text-2xl font-bold">{count}</span>
        
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          +
        </button>
      </div>
      
      <p className="mt-4 text-sm text-gray-500">
        This component runs on the client and can handle user interactions
      </p>
    </div>
  )
}
```

#### Hybrid Approach - Combining Server và Client Components
```tsx
// app/dashboard/page.tsx - Server Component
import UserStats from './components/UserStats'
import InteractiveChart from './components/InteractiveChart'
import RealtimeNotifications from './components/RealtimeNotifications'

async function getDashboardData() {
  const res = await fetch('https://api.example.com/dashboard', {
    next: { revalidate: 300 } // 5 minutes
  })
  return res.json()
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Server Component - Static data */}
          <div className="lg:col-span-2">
            <UserStats stats={data.stats} />
          </div>
          
          {/* Client Component - Interactive */}
          <div>
            <RealtimeNotifications userId={data.userId} />
          </div>
        </div>
        
        {/* Client Component - Interactive charts */}
        <div className="mt-8">
          <InteractiveChart data={data.chartData} />
        </div>
      </div>
    </div>
  )
}
```

### 3. Static Site Generation (SSG)

#### Basic Static Generation
```tsx
// app/products/page.tsx
async function getProducts() {
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">Product Image</span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price}
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### Dynamic Static Generation với generateStaticParams
```tsx
// app/products/[id]/page.tsx
interface Props {
  params: {
    id: string
  }
}

// Generate static params at build time
// generateStaticParams là function đặc biệt để tạo danh sách các tham số tĩnh tại build time
export async function generateStaticParams() {
  const products = await fetch('https://api.example.com/products')
    .then(res => res.json())
  
  return products.map((product: any) => ({
    id: product.id.toString()
  }))
}

async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`)
  
  if (!res.ok) {
    throw new Error('Failed to fetch product')
  }
  
  return res.json()
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id)
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Product Image</span>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="mb-6">
            <span className="text-3xl font-bold text-blue-600">
              ${product.price}
            </span>
          </div>
          
          <div className="space-y-4">
            <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add to Cart
            </button>
            <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Add to Wishlist
            </button>
          </div>
          
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Product Details</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>SKU: {product.sku}</li>
              <li>Category: {product.category}</li>
              <li>Stock: {product.stock} units</li>
              <li>Brand: {product.brand}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate metadata for each product
export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.id)
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}
```

### 4. Incremental Static Regeneration (ISR)

ISR cho phép bạn cập nhật static pages mà không cần rebuild toàn bộ site:

```tsx
// app/news/page.tsx - ISR with revalidation
async function getNews() {
  const res = await fetch('https://api.example.com/news', {
    next: { 
      revalidate: 60 // Revalidate every 60 seconds
    }
  })
  
  return res.json()
}

export default async function NewsPage() {
  const news = await getNews()
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Latest News</h1>
      <div className="space-y-6">
        {news.map((article: any) => (
          <article key={article.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600 mb-4">{article.summary}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>By {article.author}</span>
              <time>{new Date(article.publishedAt).toLocaleDateString()}</time>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
```

#### On-Demand ISR với revalidateTag
**On-Demand Revalidation** là tính năng cho phép làm mới (revalidate) cache của các trang tĩnh theo yêu cầu, thay vì chờ thời gian revalidate tự động hết hạn.
```tsx
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }
  
  const tag = request.nextUrl.searchParams.get('tag')
  
  if (tag) {
    revalidateTag(tag)
    return NextResponse.json({ message: `Revalidated tag: ${tag}` })
  }
  
  return NextResponse.json({ message: 'No tag provided' }, { status: 400 })
}
```

```tsx
// app/blog/page.tsx - Using cache tags
async function getBlogPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { 
      revalidate: 3600, // 1 hour
      tags: ['blog-posts'] // Tag for on-demand revalidation
    }
  })
  
  return res.json()
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6">
        {posts.map((post: any) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
```

### 5. Server-Side Rendering (SSR)

Force SSR bằng cách disable caching:

```tsx
// app/user/[id]/page.tsx - Dynamic SSR
interface Props {
  params: {
    id: string
  }
}

async function getUserProfile(id: string) {
  // Force fresh data on every request
  const res = await fetch(`https://api.example.com/users/${id}`, {
    cache: 'no-store' // Disable caching = SSR
  })
  
  return res.json()
}

async function getUserPosts(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}/posts`, {
    cache: 'no-store'
  })
  
  return res.json()
}

export default async function UserProfilePage({ params }: Props) {
  // These run in parallel on the server
  const [user, posts] = await Promise.all([
    getUserProfile(params.id),
    getUserPosts(params.id)
  ])
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600">Avatar</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-6">Recent Posts</h2>
      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.excerpt}</p>
            <time className="text-sm text-gray-500 block mt-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 6. Streaming và Suspense

**Streaming** là kỹ thuật gửi HTML từng phần (chunks) từ server về client, cho phép hiển thị nội dung ngay khi có sẵn thay vì chờ toàn bộ trang được render xong. **Suspense** là React component cho phép hiển thị fallback UI trong khi đang chờ load dữ liệu. Streaming cho phép render và gửi HTML theo chunks:

```tsx
// app/dashboard/page.tsx - Streaming with Suspense
import { Suspense } from 'react'
import UserInfo from './components/UserInfo'
import RecentActivity from './components/RecentActivity'
import Analytics from './components/Analytics'

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fast loading component */}
        <div className="lg:col-span-2">
          <Suspense fallback={<UserInfoSkeleton />}>
            <UserInfo />
          </Suspense>
        </div>
        
        {/* Slower loading component */}
        <div>
          <Suspense fallback={<ActivitySkeleton />}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>
      
      {/* Very slow loading component */}
      <div className="mt-8">
        <Suspense fallback={<AnalyticsSkeleton />}>
          <Analytics />
        </Suspense>
      </div>
    </div>
  )
}

function UserInfoSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-300 rounded"></div>
      </div>
    </div>
  )
}
```

### 7. Performance Optimization

#### Partial Pre-rendering (Experimental)
```tsx
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true, // Partial Pre-rendering
  },
}

module.exports = nextConfig
```

```tsx
// app/product/[id]/page.tsx - PPR
export default async function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Static shell - pre-rendered */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Product Details</h1>
        <nav className="text-sm text-gray-500 mt-2">
          Home / Products / Product Details
        </nav>
      </div>
      
      {/* Dynamic content - streamed */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductDetails id={params.id} />
      </Suspense>
      
      {/* Static content - pre-rendered */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
        <RelatedProducts />
      </div>
    </div>
  )
}
```

## 🏆 Bài tập thực hành

### Đề bài: Xây dựng E-commerce với Multiple Rendering Strategies

Tạo một trang web e-commerce sử dụng các rendering strategies khác nhau:
1. **Homepage**: SSG với ISR (product catalogs)
2. **Product Details**: SSG với generateStaticParams
3. **User Dashboard**: SSR với streaming
4. **Search Results**: CSR với client-side filtering
5. **Cart**: Client Components với state management

### Lời giải chi tiết:

**Bước 1**: Setup dự án
```bash
npx create-next-app@latest ecommerce-rendering --typescript --tailwind --eslint --app
cd ecommerce-rendering
```

**Bước 2**: Mock Data API
```typescript
// lib/api.ts
export interface Product {
  id: number
  name: string
  price: number
  category: string
  description: string
  image: string
  stock: number
  rating: number
  reviews: number
}

export interface User {
  id: string
  name: string
  email: string
  orders: Order[]
}

export interface Order {
  id: string
  total: number
  status: string
  items: OrderItem[]
  createdAt: string
}

export interface OrderItem {
  productId: number
  quantity: number
  price: number
}

// Mock database
const products: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 199.99,
    category: 'electronics',
    description: 'High-quality wireless headphones with noise cancellation',
    image: '/images/headphones.jpg',
    stock: 50,
    rating: 4.8,
    reviews: 127
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    price: 299.99,
    category: 'electronics',
    description: 'Advanced smartwatch with health tracking features',
    image: '/images/smartwatch.jpg',
    stock: 30,
    rating: 4.6,
    reviews: 89
  },
  // Add more products...
]

const users: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    orders: [
      {
        id: 'order1',
        total: 199.99,
        status: 'delivered',
        items: [{ productId: 1, quantity: 1, price: 199.99 }],
        createdAt: '2024-01-15T10:30:00Z'
      }
    ]
  }
]

// API functions with simulated delays
export async function getProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))
  return products
}

export async function getProduct(id: number): Promise<Product | null> {
  await new Promise(resolve => setTimeout(resolve, 50))
  return products.find(p => p.id === id) || null
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return products.slice(0, 6)
}

export async function getUser(id: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return users.find(u => u.id === id) || null
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  const user = users.find(u => u.id === userId)
  return user?.orders || []
}

export async function searchProducts(query: string): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  )
}
```

**Bước 3**: Homepage với SSG + ISR
```tsx
// app/page.tsx - Static Generation with ISR
import { getFeaturedProducts } from '@/lib/api'
import ProductCard from './components/ProductCard'
import Hero from './components/Hero'

async function getHomepageData() {
  const [featuredProducts] = await Promise.all([
    getFeaturedProducts()
  ])
  
  return { featuredProducts }
}

export default async function HomePage() {
  const { featuredProducts } = await getHomepageData()
  
  return (
    <div>
      {/* Static Hero Section */}
      <Hero />
      
      {/* Featured Products - ISR */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            Discover our most popular items
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

// ISR configuration
export const revalidate = 3600 // Revalidate every hour
```

**Bước 4**: Product Details với SSG
```tsx
// app/products/[id]/page.tsx - Static Generation
import { getProducts, getProduct } from '@/lib/api'
import { notFound } from 'next/navigation'
import AddToCartButton from './components/AddToCartButton'
import ProductReviews from './components/ProductReviews'

interface Props {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const products = await getProducts()
  
  return products.map((product) => ({
    id: product.id.toString()
  }))
}

export async function generateMetadata({ params }: Props) {
  const product = await getProduct(parseInt(params.id))
  
  if (!product) {
    return {
      title: 'Product Not Found'
    }
  }
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(parseInt(params.id))
  
  if (!product) {
    notFound()
  }
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500 text-lg">{product.name}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              ${product.price}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviews} reviews)
            </span>
          </div>
          
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Category: <span className="font-medium capitalize">{product.category}</span>
            </p>
            <p className="text-sm text-gray-600">
              Stock: <span className="font-medium">{product.stock} units</span>
            </p>
          </div>
          
          {/* Client Component for interactivity */}
          <AddToCartButton product={product} />
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-16">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  )
}
```

**Bước 5**: User Dashboard với SSR + Streaming
```tsx
// app/dashboard/page.tsx - Server-Side Rendering with Streaming
import { Suspense } from 'react'
import { getUser } from '@/lib/api'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import UserProfile from './components/UserProfile'
import RecentOrders from './components/RecentOrders'
import OrderSummary from './components/OrderSummary'

async function getCurrentUser() {
  const cookieStore = cookies()
  const userId = cookieStore.get('userId')?.value
  
  if (!userId) {
    redirect('/login')
  }
  
  // This data is always fresh (SSR)
  return getUser(userId)
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {user.name}!
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile - Fast loading */}
          <div className="lg:col-span-1">
            <Suspense fallback={<ProfileSkeleton />}>
              <UserProfile user={user} />
            </Suspense>
          </div>
          
          {/* Recent Orders - Slower loading */}
          <div className="lg:col-span-2">
            <Suspense fallback={<OrdersSkeleton />}>
              <RecentOrders userId={user.id} />
            </Suspense>
          </div>
        </div>
        
        {/* Order Summary - Very slow loading */}
        <div className="mt-8">
          <Suspense fallback={<SummarySkeleton />}>
            <OrderSummary userId={user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="animate-pulse space-y-4">
        <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b pb-4">
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SummarySkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="grid md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-8 bg-gray-300 rounded w-16 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

**Bước 6**: Search với Client-Side Rendering
```tsx
// app/search/page.tsx - Client-Side Rendering
'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchProducts, Product } from '@/lib/api'
import ProductCard from '../components/ProductCard'
import SearchFilters from './components/SearchFilters'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'name'
  })

  // Fetch products based on query
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const results = await searchProducts(query)
        setProducts(results)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    if (query) {
      fetchProducts()
    }
  }, [query])

  // Client-side filtering and sorting
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      if (filters.category && product.category !== filters.category) {
        return false
      }
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false
      }
      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [products, filters])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Search Results
        </h1>
        <p className="text-gray-600">
          {query ? `Results for "${query}"` : 'All products'} 
          ({filteredProducts.length} found)
        </p>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

**Bước 7**: Shopping Cart với Client State
```tsx
// app/cart/page.tsx - Client Component with State
'use client'
import { useState, useEffect } from 'react'
import { Product } from '@/lib/api'
import CartItem from './components/CartItem'
import CartSummary from './components/CartSummary'

export interface CartItem {
  product: Product
  quantity: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, loading])

  const updateQuantity = (productId: number, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    )
  }

  const removeItem = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <a
          href="/products"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
          
          <div className="pt-4 border-t">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <CartSummary
            totalItems={totalItems}
            totalPrice={totalPrice}
            onCheckout={() => alert('Checkout functionality would go here')}
          />
        </div>
      </div>
    </div>
  )
}
```

**Giải thích logic:**
1. **Homepage**: SSG với ISR cho featured products - cập nhật mỗi giờ
2. **Product Details**: SSG với generateStaticParams - pre-generate all products
3. **Dashboard**: SSR với streaming - fresh user data mỗi lần load
4. **Search**: CSR với client-side filtering và sorting
5. **Cart**: Client state với localStorage persistence

## 🔑 Những điểm quan trọng cần lưu ý

1. **Choosing Right Strategy**:
   - SSG: Static content, blogs, marketing pages
   - SSR: User-specific content, real-time data
   - CSR: Interactive features, client-side filtering
   - ISR: Hybrid - static với fresh updates

2. **Server vs Client Components**:
   - Server: Default, better performance, no interactivity
   - Client: For state, events, browser APIs
   - Use 'use client' directive sparingly

3. **Caching Strategies**:
   - `{ cache: 'force-cache' }` - Default, cache indefinitely
   - `{ cache: 'no-store' }` - Always fetch fresh
   - `{ next: { revalidate: 60 } }` - ISR with time-based revalidation

4. **Performance Best Practices**:
   - Minimize client JavaScript bundle
   - Use streaming và Suspense cho slow components
   - Implement proper loading states
   - Consider partial pre-rendering

5. **SEO Considerations**:
   - Server rendering is best for SEO
   - Generate proper metadata
   - Use structured data when appropriate

6. **Common Pitfalls**:
   - Hydration mismatches
   - Over-using client components
   - Not handling loading states properly
   - Forgetting to optimize images và fonts

## 📝 Bài tập về nhà

Xây dựng một **News Platform** với rendering strategies phức tạp:

### Yêu cầu chính:
1. **Homepage** (SSG + ISR):
   - Breaking news section (revalidate every 5 minutes)
   - Featured articles (revalidate every hour)
   - Categories sidebar (static)

2. **Article Pages** (SSG):
   - Pre-generate top 100 articles
   - On-demand generation cho articles khác
   - Dynamic metadata và structured data

3. **User Dashboard** (SSR + Streaming):
   - Reading history (slow loading)
   - Personalized recommendations (very slow)
   - User preferences (fast loading)

4. **Live News Feed** (CSR):
   - Real-time updates với WebSocket simulation
   - Client-side filtering by category
   - Infinite scroll

5. **Search Results** (Hybrid):
   - Server-side initial results
   - Client-side filtering và sorting
   - Search suggestions

### Advanced Features:
- Comment system với optimistic updates
- Dark/light theme với no-flash loading
- Internationalization với different rendering strategies
- Analytics tracking với proper hydration
- Progressive Web App features

### Technical Requirements:
- TypeScript với proper error boundaries
- Comprehensive loading states và skeletons
- Performance monitoring với Core Web Vitals
- Accessibility compliance
- Mobile-first responsive design

### Bonus Points:
- Edge API routes cho geolocation-based news
- Service worker cho offline reading
- Push notifications cho breaking news
- Advanced caching strategies với multiple layers
- A/B testing different rendering approaches
