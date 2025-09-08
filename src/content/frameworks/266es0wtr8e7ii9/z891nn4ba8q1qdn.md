# Bài 8: Xử lý dữ liệu (Data Fetching)


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:
- Hiểu cách data fetching hoạt động trong Next.js App Router
- Sử dụng fetch API với caching strategies khác nhau
- Xử lý dữ liệu trong Server Components và Client Components
- Triển khai parallel data fetching để tối ưu performance
- Xử lý errors và loading states hiệu quả
- Áp dụng các patterns phổ biến cho data management

## 📝 Nội dung chi tiết

### 1. Data Fetching trong Next.js App Router

Next.js App Router có cách tiếp cận mới cho data fetching, tập trung vào Server Components và Web APIs chuẩn.

#### Vị trí có thể fetch dữ liệu
- **Server Components**: Fetch trực tiếp trong component (async/await)
- **Route Handlers**: API endpoints (`app/api/*/route.ts`)
- **Client Components**: Sử dụng useEffect, SWR, TanStack Query, etc.

#### Ưu tiên Server-side Data Fetching
```tsx
// app/products/page.tsx - Server Component
async function getProducts() {
  const res = await fetch('https://api.example.com/products')
  
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  
  return res.json()
}

export default async function ProductsPage() {
  // Fetch trực tiếp trong Server Component
  const products = await getProducts()
  
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
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
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-3">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-blue-600">
          ${product.price}
        </span>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  )
}
```

### 2. Caching Strategies với fetch()

Next.js extend fetch API với các caching options:

#### Force Cache (Default)
```tsx
// Mặc định - cache indefinitely
async function getStaticData() {
  const res = await fetch('https://api.example.com/config')
  // Tương đương với { cache: 'force-cache' }
  return res.json()
}
```

#### No Store (Always Fresh)
```tsx
// Luôn fetch fresh data
async function getDynamicData() {
  const res = await fetch('https://api.example.com/live-data', {
    cache: 'no-store'
  })
  return res.json()
}
```

#### Revalidate (Time-based ISR)
```tsx
// Revalidate sau 60 giây
async function getNewsData() {
  const res = await fetch('https://api.example.com/news', {
    next: { revalidate: 60 }
  })
  return res.json()
}
```

#### Tag-based Revalidation
```tsx
// Cache với tags để revalidate on-demand
async function getUserData(userId: string) {
  const res = await fetch(`https://api.example.com/users/${userId}`, {
    next: { 
      revalidate: 3600, // 1 hour
      tags: [`user-${userId}`, 'users'] 
    }
  })
  return res.json()
}
```

### 3. Parallel Data Fetching

#### Sequential vs Parallel Fetching
```tsx
// ❌ Sequential - Chậm
async function SequentialDataPage() {
  const user = await fetchUser()
  const posts = await fetchPosts() // Đợi user xong mới fetch
  const comments = await fetchComments() // Đợi posts xong mới fetch
  
  return (
    <div>
      <UserProfile user={user} />
      <PostsList posts={posts} />
      <CommentsList comments={comments} />
    </div>
  )
}

// ✅ Parallel - Nhanh hơn
async function ParallelDataPage() {
  // Tất cả fetch cùng lúc
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(), 
    fetchComments()
  ])
  
  return (
    <div>
      <UserProfile user={user} />
      <PostsList posts={posts} />
      <CommentsList comments={comments} />
    </div>
  )
}
```

#### Parallel với Related Data
```tsx
// app/blog/[slug]/page.tsx
interface Props {
  params: { slug: string }
}

async function getBlogPost(slug: string) {
  const res = await fetch(`https://api.example.com/posts/${slug}`)
  return res.json()
}

async function getAuthor(authorId: string) {
  const res = await fetch(`https://api.example.com/authors/${authorId}`)
  return res.json()
}

async function getRelatedPosts(category: string, currentSlug: string) {
  const res = await fetch(
    `https://api.example.com/posts?category=${category}&exclude=${currentSlug}`
  )
  return res.json()
}

export default async function BlogPostPage({ params }: Props) {
  // Fetch post trước để lấy authorId và category
  const post = await getBlogPost(params.slug)
  
  // Sau đó fetch parallel các data liên quan
  const [author, relatedPosts] = await Promise.all([
    getAuthor(post.authorId),
    getRelatedPosts(post.category, params.slug)
  ])

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center space-x-4 text-gray-600">
          <img 
            src={author.avatar} 
            alt={author.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">{author.name}</p>
            <p className="text-sm">{new Date(post.publishedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </header>
      
      <div className="prose max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      
      <aside>
        <h3 className="text-2xl font-semibold mb-6">Related Posts</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {relatedPosts.map((relatedPost: any) => (
            <RelatedPostCard key={relatedPost.id} post={relatedPost} />
          ))}
        </div>
      </aside>
    </article>
  )
}
```

### 4. Error Handling

#### Basic Error Handling
```tsx
// app/dashboard/page.tsx
async function getDashboardData() {
  try {
    const res = await fetch('https://api.example.com/dashboard', {
      cache: 'no-store'
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('Dashboard data fetch failed:', error)
    throw error // Re-throw để error.tsx handle
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  
  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <DashboardContent data={data} />
    </div>
  )
}
```

#### Error Boundary với error.tsx
```tsx
// app/dashboard/error.tsx
'use client'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600">
          We couldn't load the dashboard data. This might be a temporary issue.
        </p>
      </div>
      
      <div className="space-x-4">
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
        >
          Go home
        </button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-8 p-4 bg-gray-100 rounded text-left">
          <summary className="cursor-pointer font-medium">Error details</summary>
          <pre className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  )
}
```

### 5. Client-side Data Fetching

#### Với useEffect (Basic)
```tsx
// app/components/ClientDataComponent.tsx
'use client'
import { useState, useEffect } from 'react'

interface Post {
  id: number
  title: string
  body: string
}

export default function ClientDataComponent() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        const res = await fetch('/api/posts')
        
        if (!res.ok) {
          throw new Error('Failed to fetch posts')
        }
        
        const data = await res.json()
        setPosts(data.posts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="border p-4 rounded">
          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="text-gray-600">{post.body}</p>
        </article>
      ))}
    </div>
  )
}
```

#### Với SWR (Recommended)
```tsx
// app/components/SWRDataComponent.tsx
'use client'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function SWRDataComponent() {
  const { data, error, isLoading, mutate } = useSWR('/api/posts', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // 30 seconds
  })

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load posts</p>
        <button 
          onClick={() => mutate()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return <PostsSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Posts</h2>
        <button 
          onClick={() => mutate()}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>
      
      {data.posts.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
```

### 6. Route Handlers (API Routes)

#### Basic API Route
```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Mock database
const posts = [
  { id: 1, title: 'First Post', body: 'Content of first post' },
  { id: 2, title: 'Second Post', body: 'Content of second post' },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit')
  const page = searchParams.get('page')

  try {
    // Simulate database query
    let result = [...posts]
    
    if (limit) {
      const limitNum = parseInt(limit)
      const pageNum = parseInt(page || '1')
      const start = (pageNum - 1) * limitNum
      result = posts.slice(start, start + limitNum)
    }

    return NextResponse.json({
      posts: result,
      total: posts.length,
      page: page ? parseInt(page) : 1
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.title || !body.body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      )
    }

    const newPost = {
      id: posts.length + 1,
      title: body.title,
      body: body.body,
      createdAt: new Date().toISOString()
    }

    posts.push(newPost)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    )
  }
}
```

#### Dynamic API Route
```tsx
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface Context {
  params: {
    id: string
  }
}

const posts = [
  { id: 1, title: 'First Post', body: 'Content of first post' },
  { id: 2, title: 'Second Post', body: 'Content of second post' },
]

export async function GET(
  request: NextRequest,
  { params }: Context
) {
  try {
    const id = parseInt(params.id)
    const post = posts.find(p => p.id === id)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid post ID' },
      { status: 400 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: Context
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const postIndex = posts.findIndex(p => p.id === id)

    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    posts[postIndex] = { ...posts[postIndex], ...body }

    return NextResponse.json(posts[postIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: Context
) {
  try {
    const id = parseInt(params.id)
    const postIndex = posts.findIndex(p => p.id === id)

    if (postIndex === -1) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const deletedPost = posts.splice(postIndex, 1)[0]

    return NextResponse.json({ 
      message: 'Post deleted successfully',
      post: deletedPost 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
```

### 7. Advanced Patterns

#### Data Preloading
```tsx
// lib/api.ts
export function preloadPosts() {
  // Preload without awaiting
  void fetch('/api/posts')
}

export function preloadUser(userId: string) {
  void fetch(`/api/users/${userId}`)
}
```

```tsx
// app/dashboard/page.tsx
import { preloadPosts, preloadUser } from '@/lib/api'
import { Suspense } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Preload data for likely navigation
  preloadPosts()
  preloadUser('current')

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<DashboardSkeleton />}>
        {children}
      </Suspense>
    </div>
  )
}
```

#### Optimistic Updates
```tsx
// app/components/OptimisticPosts.tsx
'use client'
import { useState, useOptimistic } from 'react'

interface Post {
  id: number
  title: string
  body: string
  pending?: boolean
}

export default function OptimisticPosts({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    posts,
    (state, newPost: Post) => [...state, { ...newPost, pending: true }]
  )

  async function createPost(formData: FormData) {
    const title = formData.get('title') as string
    const body = formData.get('body') as string

    // Add optimistic post immediately
    addOptimisticPost({
      id: Date.now(), // temporary ID
      title,
      body,
      pending: true
    })

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body })
      })

      const newPost = await response.json()
      
      // Update with real post
      setPosts(prev => [...prev, newPost])
    } catch (error) {
      console.error('Failed to create post:', error)
      // Revert optimistic update on error
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <form action={createPost} className="mb-8 space-y-4">
        <input
          name="title"
          placeholder="Post title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="body"
          placeholder="Post content"
          className="w-full p-2 border rounded h-24"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Post
        </button>
      </form>

      <div className="space-y-4">
        {optimisticPosts.map((post) => (
          <div
            key={post.id}
            className={`border p-4 rounded ${
              post.pending ? 'opacity-50' : ''
            }`}
          >
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-gray-600">{post.body}</p>
            {post.pending && (
              <span className="text-sm text-blue-600">Posting...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 🏆 Bài tập thực hành

### Đề bài: Xây dựng Blog System với Advanced Data Fetching

Tạo một hệ thống blog hoàn chỉnh với các tính năng:
1. **Homepage**: Parallel fetch featured posts + categories + stats
2. **Blog Posts**: SSG với ISR, comment system
3. **Search**: Client-side với debouncing và pagination
4. **Admin Dashboard**: Real-time data với SWR và optimistic updates
5. **API Routes**: CRUD operations với proper error handling

### Lời giải chi tiết:

**Bước 1**: Setup dự án
```bash
npx create-next-app@latest blog-system --typescript --tailwind --eslint --app
cd blog-system
npm install swr
```

**Bước 2**: Mock Data và API Utils
```typescript
// lib/types.ts
export interface Post {
  id: number
  title: string
  content: string
  excerpt: string
  slug: string
  authorId: number
  categoryId: number
  tags: string[]
  publishedAt: string
  featured: boolean
  viewCount: number
  commentCount: number
}

export interface Author {
  id: number
  name: string
  email: string
  avatar: string
  bio: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  postCount: number
}

export interface Comment {
  id: number
  postId: number
  author: string
  email: string
  content: string
  createdAt: string
}

export interface BlogStats {
  totalPosts: number
  totalViews: number
  totalComments: number
  totalAuthors: number
}
```

```typescript
// lib/data.ts
import { Post, Author, Category, Comment, BlogStats } from './types'

// Mock database
export const posts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Next.js',
    content: 'Next.js is a powerful React framework...',
    excerpt: 'Learn the basics of Next.js and how to build modern web applications.',
    slug: 'getting-started-with-nextjs',
    authorId: 1,
    categoryId: 1,
    tags: ['nextjs', 'react', 'javascript'],
    publishedAt: '2024-01-15T10:00:00Z',
    featured: true,
    viewCount: 1250,
    commentCount: 23
  },
  {
    id: 2,
    title: 'TypeScript Best Practices',
    content: 'TypeScript provides type safety...',
    excerpt: 'Discover best practices for writing maintainable TypeScript code.',
    slug: 'typescript-best-practices',
    authorId: 2,
    categoryId: 2,
    tags: ['typescript', 'javascript', 'programming'],
    publishedAt: '2024-01-10T14:30:00Z',
    featured: true,
    viewCount: 892,
    commentCount: 15
  },
  // Add more posts...
]

export const authors: Author[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatars/john.jpg',
    bio: 'Full-stack developer with 5 years of experience'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: '/avatars/jane.jpg',
    bio: 'Frontend specialist and TypeScript advocate'
  }
]

export const categories: Category[] = [
  {
    id: 1,
    name: 'React',
    slug: 'react',
    description: 'Everything about React development',
    postCount: 15
  },
  {
    id: 2,
    name: 'TypeScript',
    slug: 'typescript',
    description: 'Type-safe JavaScript development',
    postCount: 12
  }
]

export const comments: Comment[] = [
  {
    id: 1,
    postId: 1,
    author: 'Alice Johnson',
    email: 'alice@example.com',
    content: 'Great article! Very helpful for beginners.',
    createdAt: '2024-01-16T09:15:00Z'
  }
]

// API simulation functions
export async function getPosts(): Promise<Post[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return posts
}

export async function getFeaturedPosts(): Promise<Post[]> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return posts.filter(post => post.featured)
}

export async function getPost(slug: string): Promise<Post | null> {
  await new Promise(resolve => setTimeout(resolve, 150))
  return posts.find(post => post.slug === slug) || null
}

export async function getCategories(): Promise<Category[]> {
  await new Promise(resolve => setTimeout(resolve, 50))
  return categories
}

export async function getBlogStats(): Promise<BlogStats> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return {
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, post) => sum + post.viewCount, 0),
    totalComments: posts.reduce((sum, post) => sum + post.commentCount, 0),
    totalAuthors: authors.length
  }
}

export async function getPostComments(postId: number): Promise<Comment[]> {
  await new Promise(resolve => setTimeout(resolve, 200))
  return comments.filter(comment => comment.postId === postId)
}

export async function searchPosts(query: string): Promise<Post[]> {
  await new Promise(resolve => setTimeout(resolve, 300))
  return posts.filter(post =>
    post.title.toLowerCase().includes(query.toLowerCase()) ||
    post.content.toLowerCase().includes(query.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  )
}
```

**Bước 3**: Homepage với Parallel Data Fetching
```tsx
// app/page.tsx
import { Suspense } from 'react'
import { getFeaturedPosts, getCategories, getBlogStats } from '@/lib/data'
import FeaturedPosts from './components/FeaturedPosts'
import CategoriesSidebar from './components/CategoriesSidebar'
import BlogStats from './components/BlogStats'

// Parallel data fetching
async function getHomepageData() {
  const [featuredPosts, categories, stats] = await Promise.all([
    getFeaturedPosts(),
    getCategories(), 
    getBlogStats()
  ])
  
  return { featuredPosts, categories, stats }
}

export default async function HomePage() {
  const { featuredPosts, categories, stats } = await getHomepageData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Our Blog
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover insights, tutorials, and best practices in web development
          </p>
          
          {/* Stats */}
          <Suspense fallback={<StatsSkeleton />}>
            <BlogStats stats={stats} />
          </Suspense>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Featured Posts */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
            <Suspense fallback={<PostsSkeleton />}>
              <FeaturedPosts posts={featuredPosts} />
            </Suspense>
          </div>
          
          {/* Sidebar */}
          <aside className="space-y-8">
            <Suspense fallback={<CategoriesSkeleton />}>
              <CategoriesSidebar categories={categories} />
            </Suspense>
          </aside>
        </div>
      </div>
    </div>
  )
}

// Loading skeletons
function StatsSkeleton() {
  return (
    <div className="grid md:grid-cols-4 gap-6 mt-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white bg-opacity-20 p-4 rounded-lg">
          <div className="h-8 bg-white bg-opacity-30 rounded mb-2"></div>
          <div className="h-6 bg-white bg-opacity-20 rounded"></div>
        </div>
      ))}
    </div>
  )
}

function PostsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6 space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CategoriesSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  )
}
```

**Bước 4**: Blog Post Detail với Comments
```tsx
// app/blog/[slug]/page.tsx
import { Suspense } from 'react'
import { getPost, getPostComments, getPosts } from '@/lib/data'
import { notFound } from 'next/navigation'
import CommentSection from './components/CommentSection'
import RelatedPosts from './components/RelatedPosts'

interface Props {
  params: { slug: string }
}

// Generate static params for ISG
export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(post => ({ slug: post.slug }))
}

// Generate metadata
export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.slug)
  
  if (!post) {
    return { title: 'Post Not Found' }
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center space-x-4 text-gray-600">
          <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
          <span>•</span>
          <span>{post.viewCount} views</span>
          <span>•</span>
          <span>{post.commentCount} comments</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </header>
      
      <div className="prose max-w-none mb-12">
        <div className="whitespace-pre-line leading-relaxed">
          {post.content}
        </div>
      </div>
      
      {/* Comments Section */}
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentSection postId={post.id} />
      </Suspense>
      
      {/* Related Posts */}
      <Suspense fallback={<RelatedPostsSkeleton />}>
        <RelatedPosts currentPost={post} />
      </Suspense>
    </article>
  )
}

function CommentsSkeleton() {
  return (
    <div className="border-t pt-8 mt-8">
      <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border p-4 rounded">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RelatedPostsSkeleton() {
  return (
    <div className="mt-12">
      <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="border p-4 rounded">
            <div className="h-5 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Enable ISR
export const revalidate = 3600 // Revalidate every hour
```

**Bước 5**: Search với Client-side Filtering
```tsx
// app/search/page.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchPosts, Post } from '@/lib/data'
import SearchFilters from './components/SearchFilters'
import SearchResults from './components/SearchResults'
import { useDebounce } from '@/hooks/useDebounce'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    tags: [] as string[],
    sortBy: 'relevance' as 'relevance' | 'date' | 'views',
    dateRange: 'all' as 'all' | 'week' | 'month' | 'year'
  })
  
  const debouncedQuery = useDebounce(query, 300)

  // Fetch posts based on debounced query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setPosts([])
      return
    }

    const fetchPosts = async () => {
      setLoading(true)
      try {
        const results = await searchPosts(debouncedQuery)
        setPosts(results)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [debouncedQuery])

  // Client-side filtering and sorting
  const filteredPosts = useMemo(() => {
    let filtered = [...posts]

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(post => 
        post.categoryId === parseInt(filters.category)
      )
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(post =>
        filters.tags.every(tag => post.tags.includes(tag))
      )
    }

    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const cutoffDate = new Date()
      
      switch (filters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7)
          break
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1)
          break
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      filtered = filtered.filter(post =>
        new Date(post.publishedAt) >= cutoffDate
      )
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case 'views':
          return b.viewCount - a.viewCount
        case 'relevance':
        default:
          // Simple relevance: title matches > content matches
          const aRelevance = a.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ? 2 : 1
          const bRelevance = b.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ? 2 : 1
          return bRelevance - aRelevance
      }
    })

    return filtered
  }, [posts, filters, debouncedQuery])

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Posts</h1>
        <div className="max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for posts..."
            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {debouncedQuery && (
        <div className="mb-4 text-gray-600">
          {loading ? (
            'Searching...'
          ) : (
            `Found ${filteredPosts.length} result${filteredPosts.length !== 1 ? 's' : ''} for "${debouncedQuery}"`
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Search Filters */}
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <SearchResults 
            posts={filteredPosts} 
            loading={loading && !!debouncedQuery}
            query={debouncedQuery}
          />
        </div>
      </div>
    </div>
  )
}
```

**Bước 6**: API Routes với CRUD
```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { posts, Post } from '@/lib/data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit')
  const page = searchParams.get('page')
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')

  try {
    let filteredPosts = [...posts]

    // Filter by category
    if (category) {
      const categoryId = parseInt(category)
      filteredPosts = filteredPosts.filter(post => post.categoryId === categoryId)
    }

    // Filter by featured
    if (featured === 'true') {
      filteredPosts = filteredPosts.filter(post => post.featured)
    }

    // Pagination
    const totalPosts = filteredPosts.length
    if (limit) {
      const limitNum = parseInt(limit)
      const pageNum = parseInt(page || '1')
      const start = (pageNum - 1) * limitNum
      filteredPosts = filteredPosts.slice(start, start + limitNum)
    }

    return NextResponse.json({
      posts: filteredPosts,
      pagination: {
        total: totalPosts,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : totalPosts,
        totalPages: limit ? Math.ceil(totalPosts / parseInt(limit)) : 1
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    const requiredFields = ['title', 'content', 'excerpt', 'slug', 'authorId', 'categoryId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field '${field}' is required` },
          { status: 400 }
        )
      }
    }

    // Check if slug already exists
    const existingPost = posts.find(p => p.slug === body.slug)
    if (existingPost) {
      return NextResponse.json(
        { error: 'Post with this slug already exists' },
        { status: 409 }
      )
    }

    const newPost: Post = {
      id: Math.max(...posts.map(p => p.id), 0) + 1,
      title: body.title,
      content: body.content,
      excerpt: body.excerpt,
      slug: body.slug,
      authorId: body.authorId,
      categoryId: body.categoryId,
      tags: body.tags || [],
      publishedAt: new Date().toISOString(),
      featured: body.featured || false,
      viewCount: 0,
      commentCount: 0
    }

    posts.push(newPost)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    )
  }
}
```

**Bước 7**: Debounce Hook
```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

**Giải thích logic:**
1. **Parallel Fetching**: Homepage fetch 3 data sources cùng lúc với Promise.all
2. **ISG với revalidate**: Blog posts sử dụng ISR để balance performance và freshness
3. **Client-side Search**: Debounced search với filtering và sorting
4. **API Routes**: RESTful endpoints với proper validation và error handling
5. **Loading States**: Comprehensive skeleton loading cho better UX

## 🔑 Những điểm quan trọng cần lưu ý

1. **Fetch API Extensions**:
   - `cache: 'force-cache'` - Default caching
   - `cache: 'no-store'` - Always fresh data  
   - `next: { revalidate: 60 }` - Time-based revalidation
   - `next: { tags: ['users'] }` - Tag-based revalidation

2. **Performance Optimization**:
   - Use parallel fetching với Promise.all
   - Implement proper loading states
   - Consider data preloading patterns
   - Use streaming với Suspense

3. **Error Handling**:
   - Always handle fetch errors
   - Use error.tsx for error boundaries
   - Provide user-friendly error messages
   - Log errors for monitoring

4. **Client vs Server Data Fetching**:
   - Server: SEO friendly, faster initial load
   - Client: Interactive features, real-time updates
   - Hybrid: Best of both worlds

5. **Caching Strategy**:
   - Static data: force-cache
   - User-specific data: no-store  
   - Content that changes: revalidate
   - Critical updates: tag-based revalidation

6. **Common Mistakes**:
   - Not handling loading states
   - Over-fetching data
   - Not implementing proper error boundaries
   - Forgetting to handle edge cases

## 📝 Bài tập về nhà

Xây dựng một **E-commerce Product Catalog** với advanced data patterns:

### Yêu cầu chính:
1. **Product Catalog** (Server Components):
   - Parallel fetch: products, categories, filters, recommendations
   - ISR với tag-based revalidation
   - Search với full-text search simulation

2. **Product Detail Page** (Hybrid):
   - SSG cho product info
   - Client-side cho reviews, recommendations
   - Optimistic updates cho cart actions

3. **Real-time Features** (Client Components):
   - Live inventory updates
   - Recently viewed products
   - Price change notifications
   - Wishlist với persistent state

4. **Advanced Search** (Client-side):
   - Debounced search với autocomplete
   - Multi-faceted filtering (price, brand, category, rating)
   - Sort options với URL state management
   - Infinite scroll pagination

5. **Analytics Dashboard** (SSR + Client):
   - Server-side cho initial data
   - Client-side cho real-time metrics
   - Charts với streaming data
   - Export functionality

### Technical Requirements:
- TypeScript với comprehensive error types
- SWR hoặc TanStack Query cho client-side caching
- Optimistic updates với rollback on error
- Comprehensive loading states và skeletons
- URL state management cho filters và search
- Performance monitoring và optimization

### Advanced Features:
- Product comparison với client-side state
- Recently viewed với localStorage/sessionStorage
- Advanced filtering với query builder interface
- Bulk operations với progress indicators
- Offline support với service workers
- Advanced error recovery strategies
