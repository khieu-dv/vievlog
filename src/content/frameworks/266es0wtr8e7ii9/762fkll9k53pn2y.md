# Bài 10: Tối ưu hóa hiệu suất (Caching)


## 🎯 Mục tiêu học tập

Sau khi hoàn thành bài học này, bạn sẽ có thể:
- Hiểu các loại cache trong NextJS và cách chúng hoạt động
- Sử dụng Request Memoization để tối ưu hóa các request trùng lặp
- Triển khai Data Cache cho dữ liệu động và tĩnh
- Cấu hình Full Route Cache cho hiệu suất tối đa
- Sử dụng Router Cache để tối ưu hóa navigation
- Triển khai các chiến lược cache invalidation
- Tối ưu hóa hiệu suất với unstable_cache và revalidate
- Sử dụng ISR (Incremental Static Regeneration) hiệu quả

## 📝 Nội dung chi tiết

### 1. Giới thiệu về Caching trong NextJS

**Caching (bộ nhớ đệm)** là kỹ thuật lưu trữ dữ liệu tạm thời ở một vị trí truy cập nhanh để tránh phải tính toán lại hoặc tải dữ liệu từ nguồn chậm hơn. Trong web development, caching giúp:

- **Tăng tốc độ tải trang**: Dữ liệu được lưu sẵn không cần tải lại
- **Giảm tải server**: Ít request đến server hơn
- **Tiết kiệm bandwidth**: Không cần truyền dữ liệu trùng lặp
- **Cải thiện trải nghiệm người dùng**: Trang web phản hồi nhanh hơn

NextJS cung cấp 4 loại cache chính, mỗi loại hoạt động ở một tầng khác nhau:

#### 1.1 Request Memoization

**Request Memoization** là kỹ thuật lưu trữ kết quả của các function calls trong cùng một request cycle. Khi cùng một function được gọi với cùng tham số trong một request, NextJS sẽ trả về kết quả đã được lưu thay vì thực hiện lại function đó. Điều này đặc biệt hữu ích khi:

- Nhiều component cần cùng một dữ liệu
- Tránh duplicate API calls trong server components
- Tối ưu hiệu suất render server-side

```typescript
// app/utils/api.ts
import { cache } from 'react'

export const getUser = cache(async (id: string) => {
  console.log('Fetching user:', id) // Chỉ log một lần trong cùng request
  const response = await fetch(`/api/users/${id}`)
  return response.json()
})

// app/profile/page.tsx
import { getUser } from '@/utils/api'

export default async function ProfilePage() {
  // Cả hai lần gọi chỉ thực hiện 1 request duy nhất
  const user = await getUser('123')
  const userAgain = await getUser('123') // Sử dụng cached result
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

#### 1.2 Data Cache

**Data Cache** là bộ nhớ đệm lưu trữ kết quả của các data fetching operations (như fetch API). Khác với Request Memoization chỉ hoạt động trong một request, Data Cache có thể lưu trữ dữ liệu qua nhiều request và người dùng khác nhau. Data Cache có các đặc điểm:

- **Persistent**: Dữ liệu được lưu giữa các request
- **Configurable**: Có thể cấu hình thời gian cache và chiến lược revalidation
- **Shared**: Chia sẻ giữa các user và request

```typescript
// app/lib/data.ts
export async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    cache: 'force-cache', // Cache mãi mãi
  })
  return res.json()
}

export async function getLatestNews() {
  const res = await fetch('https://api.example.com/news', {
    next: { revalidate: 3600 }, // Cache 1 giờ
  })
  return res.json()
}

export async function getRealTimeData() {
  const res = await fetch('https://api.example.com/realtime', {
    cache: 'no-store', // Không cache
  })
  return res.json()
}
```

#### 1.3 Full Route Cache
```typescript
// app/products/page.tsx - Static Route (được cache)
export default async function ProductsPage() {
  const products = await getProducts() // Sử dụng cached data
  
  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}

// app/dashboard/page.tsx - Dynamic Route (không cache)
export default async function DashboardPage() {
  const data = await getRealTimeData()
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Last updated: {new Date().toISOString()}</p>
    </div>
  )
}
```

#### 1.4 Router Cache
```typescript
// app/components/Navigation.tsx
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const router = useRouter()
  
  const handlePrefetch = () => {
    // Prefetch route để cache
    router.prefetch('/products')
  }
  
  return (
    <nav>
      <Link 
        href="/products" 
        prefetch={true} // Tự động prefetch
      >
        Products
      </Link>
      <button onClick={handlePrefetch}>
        Prefetch Products
      </button>
    </nav>
  )
}
```

### 2. Chiến lược Cache Invalidation

#### 2.1 Time-based Revalidation
```typescript
// app/lib/blog.ts
export async function getBlogPosts() {
  const res = await fetch('https://api.blog.com/posts', {
    next: { 
      revalidate: 3600, // Revalidate sau 1 giờ
      tags: ['blog-posts'] // Để on-demand revalidation
    }
  })
  return res.json()
}

// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }
  
  try {
    // Revalidate specific tag
    revalidateTag('blog-posts')
    
    // Hoặc revalidate specific path
    revalidatePath('/blog')
    
    return Response.json({ revalidated: true })
  } catch (error) {
    return Response.json({ error: 'Error revalidating' }, { status: 500 })
  }
}
```

#### 2.2 On-demand Revalidation
```typescript
// app/admin/blog/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function createBlogPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  // Tạo blog post mới
  await fetch('https://api.blog.com/posts', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
    headers: { 'Content-Type': 'application/json' }
  })
  
  // Invalidate cache
  revalidateTag('blog-posts')
  revalidatePath('/blog')
}
```

### 3. unstable_cache API

```typescript
// app/lib/cache.ts
import { unstable_cache } from 'next/cache'

export const getCachedUserStats = unstable_cache(
  async (userId: string) => {
    console.log('Computing user stats for:', userId)
    
    const [posts, comments, likes] = await Promise.all([
      fetch(`/api/users/${userId}/posts`).then(r => r.json()),
      fetch(`/api/users/${userId}/comments`).then(r => r.json()),
      fetch(`/api/users/${userId}/likes`).then(r => r.json()),
    ])
    
    return {
      totalPosts: posts.length,
      totalComments: comments.length,
      totalLikes: likes.reduce((sum, like) => sum + like.count, 0)
    }
  },
  ['user-stats'], // Cache key parts
  {
    tags: ['user-stats'],
    revalidate: 3600, // 1 hour
  }
)

// app/profile/[id]/page.tsx
interface Props {
  params: { id: string }
}

export default async function ProfilePage({ params }: Props) {
  const stats = await getCachedUserStats(params.id)
  
  return (
    <div>
      <h1>User Profile</h1>
      <div className="stats">
        <p>Posts: {stats.totalPosts}</p>
        <p>Comments: {stats.totalComments}</p>
        <p>Likes: {stats.totalLikes}</p>
      </div>
    </div>
  )
}
```

### 4. Incremental Static Regeneration (ISR)

#### 4.1 Cơ bản về ISR
```typescript
// app/products/[id]/page.tsx
interface Product {
  id: string
  name: string
  price: number
  description: string
}

interface Props {
  params: { id: string }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id)
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <p>{product.description}</p>
    </div>
  )
}

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://api.shop.com/products/${id}`, {
    next: { revalidate: 60 } // ISR: revalidate mỗi 60 giây
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch product')
  }
  
  return res.json()
}

// Static params generation
export async function generateStaticParams() {
  const products = await fetch('https://api.shop.com/products').then(res => res.json())
  
  return products.map((product: Product) => ({
    id: product.id,
  }))
}
```

#### 4.2 ISR với Dynamic Routing
```typescript
// app/blog/[slug]/page.tsx
interface BlogPost {
  slug: string
  title: string
  content: string
  publishedAt: string
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}

async function getBlogPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`https://api.blog.com/posts/${slug}`, {
    next: { 
      revalidate: 3600, // 1 hour
      tags: [`blog-post-${slug}`]
    }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch blog post')
  }
  
  return res.json()
}

export async function generateStaticParams() {
  const posts = await fetch('https://api.blog.com/posts').then(res => res.json())
  
  // Chỉ generate cho 50 bài viết phổ biến nhất
  const popularPosts = posts.slice(0, 50)
  
  return popularPosts.map((post: BlogPost) => ({
    slug: post.slug,
  }))
}
```

### 5. Cache Optimization Techniques

#### 5.1 Conditional Caching
```typescript
// app/lib/cache-utils.ts
export function getCacheConfig(userRole: string) {
  switch (userRole) {
    case 'admin':
      return { cache: 'no-store' } // Admins get fresh data
    case 'premium':
      return { next: { revalidate: 300 } } // 5 minutes for premium
    default:
      return { next: { revalidate: 3600 } } // 1 hour for regular users
  }
}

// app/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { getCacheConfig } from '@/lib/cache-utils'

export default async function DashboardPage() {
  const user = await auth()
  const cacheConfig = getCacheConfig(user.role)
  
  const data = await fetch('https://api.example.com/dashboard', cacheConfig)
    .then(res => res.json())
  
  return (
    <div>
      <h1>Dashboard ({user.role})</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

#### 5.2 Cache Warming
```typescript
// app/lib/cache-warming.ts
import { unstable_cache } from 'next/cache'

const warmCache = async () => {
  // Warm up popular content
  const popularPosts = await getPopularPosts()
  
  await Promise.all(
    popularPosts.map(post => 
      getCachedBlogPost(post.slug)
    )
  )
}

const getCachedBlogPost = unstable_cache(
  async (slug: string) => {
    return fetch(`https://api.blog.com/posts/${slug}`).then(r => r.json())
  },
  ['blog-post'],
  { revalidate: 3600 }
)

// app/api/warm-cache/route.ts
export async function POST() {
  await warmCache()
  return Response.json({ success: true })
}
```

### 6. Monitoring và Debugging Cache

#### 6.1 Cache Headers
```typescript
// app/api/debug/cache/route.ts
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const response = await fetch('https://api.example.com/data')
  
  const cacheStatus = response.headers.get('cf-cache-status') || 'unknown'
  const age = response.headers.get('age') || '0'
  
  return Response.json({
    cacheStatus,
    age: parseInt(age),
    data: await response.json()
  })
}
```

#### 6.2 Cache Analytics
```typescript
// app/components/CacheDebugger.tsx
'use client'

import { useEffect, useState } from 'react'

interface CacheInfo {
  route: string
  cached: boolean
  timestamp: number
}

export default function CacheDebugger() {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo[]>([])
  
  useEffect(() => {
    // Monitor cache performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('/_next/')) {
          setCacheInfo(prev => [...prev, {
            route: entry.name,
            cached: entry.transferSize === 0,
            timestamp: Date.now()
          }])
        }
      })
    })
    
    observer.observe({ entryTypes: ['navigation', 'resource'] })
    
    return () => observer.disconnect()
  }, [])
  
  if (process.env.NODE_ENV === 'production') return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded">
      <h3>Cache Debug</h3>
      {cacheInfo.slice(-5).map((info, i) => (
        <div key={i} className="text-xs">
          {info.cached ? '✅' : '❌'} {info.route}
        </div>
      ))}
    </div>
  )
}
```

## 🏆 Bài tập thực hành

### Bài tập 1: Xây dựng hệ thống cache đa tầng

Tạo một ứng dụng tin tức với cache optimization:

```typescript
// app/types/news.ts
export interface NewsArticle {
  id: string
  title: string
  content: string
  category: string
  publishedAt: string
  views: number
}

export interface NewsCategory {
  id: string
  name: string
  description: string
}
```

```typescript
// app/lib/news.ts
import { unstable_cache } from 'next/cache'
import { NewsArticle, NewsCategory } from '@/types/news'

// Level 1: Request Memoization
import { cache } from 'react'

export const getCategories = cache(async (): Promise<NewsCategory[]> => {
  const res = await fetch('https://api.news.com/categories', {
    next: { revalidate: 7200, tags: ['categories'] } // 2 hours
  })
  return res.json()
})

// Level 2: Data Cache với ISR
export async function getArticlesByCategory(
  categoryId: string, 
  page: number = 1
): Promise<NewsArticle[]> {
  const res = await fetch(`https://api.news.com/articles?category=${categoryId}&page=${page}`, {
    next: { 
      revalidate: 1800, // 30 minutes
      tags: [`articles-${categoryId}`]
    }
  })
  return res.json()
}

// Level 3: Advanced caching with unstable_cache
export const getTrendingArticles = unstable_cache(
  async (limit: number = 10): Promise<NewsArticle[]> => {
    const res = await fetch(`https://api.news.com/trending?limit=${limit}`)
    const articles = await res.json()
    
    // Expensive computation
    const articlesWithScore = articles.map(article => ({
      ...article,
      trendingScore: calculateTrendingScore(article)
    }))
    
    return articlesWithScore.sort((a, b) => b.trendingScore - a.trendingScore)
  },
  ['trending-articles'],
  {
    revalidate: 600, // 10 minutes
    tags: ['trending']
  }
)

function calculateTrendingScore(article: NewsArticle): number {
  const hoursSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60)
  return article.views / Math.max(hoursSincePublished, 1)
}

// Level 4: Conditional caching
export async function getPersonalizedNews(userId: string): Promise<NewsArticle[]> {
  const cacheConfig = userId ? 
    { next: { revalidate: 1800, tags: [`user-${userId}`] } } : 
    { cache: 'no-store' as const }
  
  const res = await fetch(`https://api.news.com/personalized?userId=${userId}`, cacheConfig)
  return res.json()
}
```

```typescript
// app/news/page.tsx
import { getCategories, getTrendingArticles } from '@/lib/news'
import CategoryNav from '@/components/CategoryNav'
import TrendingSection from '@/components/TrendingSection'

export default async function NewsPage() {
  // Parallel fetch with different cache strategies
  const [categories, trendingArticles] = await Promise.all([
    getCategories(), // Cached for 2 hours
    getTrendingArticles(5), // Cached for 10 minutes
  ])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest News</h1>
      
      <CategoryNav categories={categories} />
      <TrendingSection articles={trendingArticles} />
    </div>
  )
}
```

```typescript
// app/news/[category]/page.tsx
import { getArticlesByCategory, getCategories } from '@/lib/news'
import ArticleCard from '@/components/ArticleCard'

interface Props {
  params: { category: string }
  searchParams: { page?: string }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = parseInt(searchParams.page || '1')
  const articles = await getArticlesByCategory(params.category, page)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{params.category}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const categories = await getCategories()
  
  return categories.map(category => ({
    category: category.id
  }))
}
```

```typescript
// app/components/ArticleCard.tsx
import Link from 'next/link'
import { NewsArticle } from '@/types/news'

interface Props {
  article: NewsArticle
}

export default function ArticleCard({ article }: Props) {
  return (
    <Link 
      href={`/news/article/${article.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.content}
        </p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{article.category}</span>
          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-2 text-sm text-blue-600">
          {article.views} views
        </div>
      </div>
    </Link>
  )
}
```

```typescript
// app/api/revalidate/news/route.ts
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const type = searchParams.get('type')
  const id = searchParams.get('id')
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }
  
  try {
    switch (type) {
      case 'article':
        revalidateTag(`articles-${id}`)
        revalidatePath(`/news/${id}`)
        break
      case 'trending':
        revalidateTag('trending')
        revalidatePath('/news')
        break
      case 'categories':
        revalidateTag('categories')
        revalidatePath('/news')
        break
      case 'all':
        revalidatePath('/', 'layout')
        break
      default:
        return Response.json({ error: 'Invalid type' }, { status: 400 })
    }
    
    return Response.json({ revalidated: true, type, id })
  } catch (error) {
    return Response.json({ error: 'Error revalidating' }, { status: 500 })
  }
}
```

### Bài tập 2: Performance monitoring và cache analytics

```typescript
// app/lib/cache-monitor.ts
interface CacheMetrics {
  hitRate: number
  missRate: number
  totalRequests: number
  averageResponseTime: number
}

class CacheMonitor {
  private metrics: Map<string, CacheMetrics> = new Map()
  
  recordHit(key: string, responseTime: number) {
    const current = this.metrics.get(key) || {
      hitRate: 0,
      missRate: 0,
      totalRequests: 0,
      averageResponseTime: 0
    }
    
    current.totalRequests++
    current.hitRate++
    current.averageResponseTime = 
      (current.averageResponseTime + responseTime) / 2
    
    this.metrics.set(key, current)
  }
  
  recordMiss(key: string, responseTime: number) {
    const current = this.metrics.get(key) || {
      hitRate: 0,
      missRate: 0,
      totalRequests: 0,
      averageResponseTime: 0
    }
    
    current.totalRequests++
    current.missRate++
    current.averageResponseTime = 
      (current.averageResponseTime + responseTime) / 2
    
    this.metrics.set(key, current)
  }
  
  getMetrics(key?: string) {
    if (key) return this.metrics.get(key)
    return Object.fromEntries(this.metrics)
  }
}

export const cacheMonitor = new CacheMonitor()
```

```typescript
// app/components/CacheAnalytics.tsx
'use client'

import { useState, useEffect } from 'react'

export default function CacheAnalytics() {
  const [metrics, setMetrics] = useState<any>({})
  
  useEffect(() => {
    const fetchMetrics = async () => {
      const res = await fetch('/api/cache-metrics')
      const data = await res.json()
      setMetrics(data)
    }
    
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Cache Analytics</h3>
      
      {Object.entries(metrics).map(([key, metric]: [string, any]) => (
        <div key={key} className="mb-4 p-3 bg-white rounded">
          <h4 className="font-medium">{key}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Hit Rate: </span>
              <span className="font-medium">
                {((metric.hitRate / metric.totalRequests) * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Total Requests: </span>
              <span className="font-medium">{metric.totalRequests}</span>
            </div>
            <div>
              <span className="text-gray-600">Avg Response: </span>
              <span className="font-medium">{metric.averageResponseTime.toFixed(0)}ms</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

## 🔑 Điểm quan trọng cần nhớ

### Cache Layers trong NextJS
1. **Request Memoization**: Cache trong cùng một request cycle
2. **Data Cache**: Cache response từ fetch API
3. **Full Route Cache**: Cache toàn bộ route
4. **Router Cache**: Cache ở client-side

### Best Practices
1. **Sử dụng appropriate cache strategy** cho từng loại dữ liệu
2. **Implement cache invalidation** đúng cách
3. **Monitor cache performance** để tối ưu hóa
4. **Balance freshness vs performance**

### Cache Invalidation Strategies
1. **Time-based**: Sử dụng revalidate
2. **On-demand**: Sử dụng revalidateTag/revalidatePath
3. **Event-based**: Trigger invalidation từ webhooks

### Performance Considerations
1. **Cache warming** cho nội dung quan trọng
2. **Conditional caching** based on user context
3. **Proper cache headers** configuration
4. **Monitor cache hit rates**

## 📝 Bài tập về nhà

1. **Cache Strategy Design**: Thiết kế chiến lược cache cho một e-commerce website với các yêu cầu:
   - Product catalog (ít thay đổi)
   - User-specific recommendations
   - Real-time inventory
   - Search results

2. **ISR Implementation**: Triển khai ISR cho một blog system với:
   - Static generation cho popular posts
   - On-demand revalidation cho new posts
   - Category-based cache invalidation

3. **Cache Monitoring**: Xây dựng dashboard để monitor:
   - Cache hit rates
   - Response times
   - Memory usage
   - Cache invalidation frequency

4. **Advanced Patterns**: Implement:
   - Stale-while-revalidate pattern
   - Cache warming strategies
   - Multi-level cache hierarchy
   - Cache compression techniques
