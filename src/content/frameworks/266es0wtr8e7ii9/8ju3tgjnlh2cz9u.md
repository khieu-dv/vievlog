# Bài 14: Middleware và API Endpoints


## 🎯 Mục tiêu học tập

Sau khi hoàn thành bài học này, bạn sẽ có thể:
- Xây dựng API endpoints hiệu quả với App Router
- Triển khai middleware cho authentication và authorization
- Xử lý các HTTP methods (GET, POST, PUT, DELETE) properly
- Implement request/response validation và error handling
- Sử dụng middleware cho rate limiting và security
- Tạo API middleware chains và composition
- Optimize API performance với caching strategies
- Implement file upload và streaming responses

## 📝 Nội dung chi tiết

### 1. API Routes với App Router

**API Routes** là tính năng cho phép tạo các endpoints API ngay trong ứng dụng NextJS. Với App Router, API routes được định nghĩa trong thư mục `app/api/` và sử dụng file naming convention để định nghĩa HTTP methods.

**Middleware** là các function chạy trước khi request được xử lý bởi page hoặc API route. Middleware có thể:
- Xác thực người dùng (authentication)
- Kiểm tra quyền truy cập (authorization) 
- Rate limiting để bảo vệ API
- Logging và monitoring
- Redirect hoặc rewrite requests

#### 1.1 Cấu trúc API Routes

Trong App Router, mỗi HTTP method được export như một named function từ file `route.ts`:

- `GET` - Xử lý HTTP GET requests
- `POST` - Xử lý HTTP POST requests  
- `PUT` - Xử lý HTTP PUT requests
- `DELETE` - Xử lý HTTP DELETE requests
- `PATCH` - Xử lý HTTP PATCH requests
- `HEAD` - Xử lý HTTP HEAD requests
- `OPTIONS` - Xử lý HTTP OPTIONS requests
```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Request validation schema
const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(18).max(120),
})

const updateUserSchema = createUserSchema.partial()

// GET /api/users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    
    // Simulate database query
    const users = await getUsersFromDatabase({
      page,
      limit,
      search,
    })
    
    return NextResponse.json({
      data: users,
      pagination: {
        page,
        limit,
        total: users.length,
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = createUserSchema.parse(body)
    
    // Create user
    const newUser = await createUserInDatabase(validatedData)
    
    return NextResponse.json(
      { data: newUser, message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

// Helper functions
async function getUsersFromDatabase({ page, limit, search }: {
  page: number
  limit: number
  search: string
}) {
  // Database logic here
  return []
}

async function createUserInDatabase(userData: z.infer<typeof createUserSchema>) {
  // Database logic here
  return { id: '1', ...userData }
}
```

#### 1.2 Dynamic API Routes
```typescript
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

interface RouteParams {
  params: { id: string }
}

// GET /api/users/[id]
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    
    // Validate ID
    const userId = z.string().uuid().parse(id)
    
    const user = await getUserById(userId)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ data: user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }
    
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const body = await request.json()
    
    // Validate ID and body
    const userId = z.string().uuid().parse(id)
    const validatedData = updateUserSchema.parse(body)
    
    const updatedUser = await updateUserInDatabase(userId, validatedData)
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      data: updatedUser,
      message: 'User updated successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params
    const userId = z.string().uuid().parse(id)
    
    const deleted = await deleteUserFromDatabase(userId)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

// Helper functions
async function getUserById(id: string) {
  // Database logic
  return null
}

async function updateUserInDatabase(id: string, data: any) {
  // Database logic
  return null
}

async function deleteUserFromDatabase(id: string) {
  // Database logic
  return false
}
```

### 2. Middleware Implementation

#### 2.1 Authentication Middleware
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  // Skip middleware for public routes
  if (isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.next()
  }
  
  // Get token from header or cookie
  const token = getTokenFromRequest(request)
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    )
  }
  
  try {
    // Verify JWT token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    // Add user info to headers for API routes
    const response = NextResponse.next()
    response.headers.set('X-User-ID', payload.userId as string)
    response.headers.set('X-User-Role', payload.role as string)
    response.headers.set('X-User-Email', payload.email as string)
    
    return response
  } catch (error) {
    console.error('JWT verification failed:', error)
    return NextResponse.json(
      { error: 'Unauthorized - Invalid token' },
      { status: 401 }
    )
  }
}

// Helper functions
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/health',
    '/api/public',
  ]
  
  return publicRoutes.some(route => pathname.startsWith(route))
}

function getTokenFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  
  // Try cookie
  const tokenCookie = request.cookies.get('auth-token')
  return tokenCookie?.value || null
}

// Configure matcher
export const config = {
  matcher: [
    '/api/((?!auth|health|public).*)/',
    '/dashboard/:path*',
    '/admin/:path*',
  ]
}
```

#### 2.2 Rate Limiting Middleware
```typescript
// lib/middleware/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create Redis instance
const redis = Redis.fromEnv()

// Create rate limiter
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
})

interface RateLimitOptions {
  requests: number
  window: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (request: NextRequest) => string
}

export function createRateLimitMiddleware(options: RateLimitOptions) {
  return async function rateLimitMiddleware(request: NextRequest) {
    // Generate rate limit key
    const key = options.keyGenerator?.(request) || getClientKey(request)
    
    try {
      const { success, limit, reset, remaining } = await ratelimit.limit(key)
      
      // Create response
      const response = success 
        ? NextResponse.next()
        : NextResponse.json(
            { error: 'Too many requests' },
            { status: 429 }
          )
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', limit.toString())
      response.headers.set('X-RateLimit-Remaining', remaining.toString())
      response.headers.set('X-RateLimit-Reset', reset.toString())
      
      return response
    } catch (error) {
      console.error('Rate limiting error:', error)
      // Continue on rate limiter error
      return NextResponse.next()
    }
  }
}

function getClientKey(request: NextRequest): string {
  // Try to get user ID from headers (set by auth middleware)
  const userId = request.headers.get('X-User-ID')
  if (userId) {
    return `user:${userId}`
  }
  
  // Fall back to IP address
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor?.split(',')[0] || request.ip || 'unknown'
  return `ip:${ip}`
}

// Usage in API routes
export const apiRateLimit = createRateLimitMiddleware({
  requests: 100,
  window: '1 h',
  keyGenerator: (request) => {
    const userId = request.headers.get('X-User-ID')
    return userId ? `api:user:${userId}` : `api:ip:${request.ip}`
  }
})
```

#### 2.3 CORS Middleware
```typescript
// lib/middleware/cors.ts
import { NextRequest, NextResponse } from 'next/server'

interface CorsOptions {
  origin?: string | string[] | boolean
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

export function createCorsMiddleware(options: CorsOptions = {}) {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization'],
    exposedHeaders = [],
    credentials = true,
    maxAge = 86400, // 24 hours
  } = options
  
  return function corsMiddleware(request: NextRequest) {
    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 })
      
      // Set CORS headers
      setCorsHeaders(response, {
        origin,
        methods,
        allowedHeaders,
        exposedHeaders,
        credentials,
        maxAge,
      })
      
      return response
    }
    
    // Continue with the request and add CORS headers to response
    const response = NextResponse.next()
    
    setCorsHeaders(response, {
      origin,
      methods,
      allowedHeaders,
      exposedHeaders,
      credentials,
      maxAge,
    })
    
    return response
  }
}

function setCorsHeaders(response: NextResponse, options: CorsOptions) {
  const {
    origin,
    methods,
    allowedHeaders,
    exposedHeaders,
    credentials,
    maxAge,
  } = options
  
  // Set Access-Control-Allow-Origin
  if (typeof origin === 'string') {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (Array.isArray(origin)) {
    // Note: In a real implementation, you'd check the request origin
    // against the allowed origins array
    response.headers.set('Access-Control-Allow-Origin', origin[0])
  } else if (origin === true) {
    response.headers.set('Access-Control-Allow-Origin', '*')
  }
  
  // Set other CORS headers
  if (methods) {
    response.headers.set('Access-Control-Allow-Methods', methods.join(', '))
  }
  
  if (allowedHeaders) {
    response.headers.set('Access-Control-Allow-Headers', allowedHeaders.join(', '))
  }
  
  if (exposedHeaders && exposedHeaders.length > 0) {
    response.headers.set('Access-Control-Expose-Headers', exposedHeaders.join(', '))
  }
  
  if (credentials) {
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  if (maxAge) {
    response.headers.set('Access-Control-Max-Age', maxAge.toString())
  }
}
```

### 3. Advanced API Patterns

#### 3.1 API Middleware Chain
```typescript
// lib/api/middleware-chain.ts
import { NextRequest, NextResponse } from 'next/server'

type MiddlewareFunction = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse | void> | NextResponse | void

export class MiddlewareChain {
  private middlewares: MiddlewareFunction[] = []
  
  use(middleware: MiddlewareFunction): this {
    this.middlewares.push(middleware)
    return this
  }
  
  async execute(request: NextRequest, context: any = {}): Promise<NextResponse> {
    for (const middleware of this.middlewares) {
      const result = await middleware(request, context)
      
      if (result instanceof NextResponse) {
        return result
      }
    }
    
    return NextResponse.next()
  }
}

// Usage in API routes
// app/api/protected/users/route.ts
import { MiddlewareChain } from '@/lib/api/middleware-chain'
import { authMiddleware } from '@/lib/middleware/auth'
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit'
import { corsMiddleware } from '@/lib/middleware/cors'

const middleware = new MiddlewareChain()
  .use(corsMiddleware)
  .use(rateLimitMiddleware)
  .use(authMiddleware)

export async function GET(request: NextRequest) {
  // Execute middleware chain
  const middlewareResponse = await middleware.execute(request)
  
  if (middlewareResponse.status !== 200) {
    return middlewareResponse
  }
  
  // Your API logic here
  return NextResponse.json({ message: 'Protected route accessed' })
}
```

#### 3.2 Request/Response Interceptors
```typescript
// lib/api/interceptors.ts
import { NextRequest, NextResponse } from 'next/server'

interface RequestInterceptor {
  (request: NextRequest): Promise<NextRequest> | NextRequest
}

interface ResponseInterceptor {
  (response: NextResponse): Promise<NextResponse> | NextResponse
}

export class ApiInterceptors {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor)
  }
  
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor)
  }
  
  async processRequest(request: NextRequest): Promise<NextRequest> {
    let processedRequest = request
    
    for (const interceptor of this.requestInterceptors) {
      processedRequest = await interceptor(processedRequest)
    }
    
    return processedRequest
  }
  
  async processResponse(response: NextResponse): Promise<NextResponse> {
    let processedResponse = response
    
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse)
    }
    
    return processedResponse
  }
}

// Global interceptors instance
export const apiInterceptors = new ApiInterceptors()

// Request interceptors
apiInterceptors.addRequestInterceptor((request) => {
  // Add request ID for tracking
  request.headers.set('X-Request-ID', crypto.randomUUID())
  return request
})

apiInterceptors.addRequestInterceptor((request) => {
  // Log all requests
  console.log(`${request.method} ${request.url}`)
  return request
})

// Response interceptors
apiInterceptors.addResponseInterceptor((response) => {
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  return response
})

apiInterceptors.addResponseInterceptor(async (response) => {
  // Add response time
  const responseTime = Date.now() - parseInt(
    response.headers.get('X-Request-Start-Time') || '0'
  )
  response.headers.set('X-Response-Time', `${responseTime}ms`)
  return response
})
```

#### 3.3 File Upload API
```typescript
// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { z } from 'zod'

const uploadSchema = z.object({
  file: z.instanceof(File),
  category: z.enum(['image', 'document', 'video']).default('document'),
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file
    const validatedData = uploadSchema.parse({ file, category })
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large (max 10MB)' },
        { status: 400 }
      )
    }
    
    // Validate file type
    if (!isAllowedFileType(file.type, category)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }
    
    // Generate unique filename
    const fileName = generateUniqueFileName(file.name)
    const uploadDir = join(process.cwd(), 'uploads', category)
    const filePath = join(uploadDir, fileName)
    
    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true })
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)
    
    // Return file info
    return NextResponse.json({
      success: true,
      data: {
        fileName,
        originalName: file.name,
        size: file.size,
        type: file.type,
        category,
        url: `/uploads/${category}/${fileName}`,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid upload data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

function isAllowedFileType(mimeType: string, category: string): boolean {
  const allowedTypes: Record<string, string[]> = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    document: ['application/pdf', 'text/plain', 'application/msword'],
    video: ['video/mp4', 'video/mpeg', 'video/quicktime'],
  }
  
  return allowedTypes[category]?.includes(mimeType) ?? false
}

function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2)
  const extension = originalName.split('.').pop()
  return `${timestamp}-${random}.${extension}`
}
```

#### 3.4 Streaming Responses
```typescript
// app/api/stream/route.ts
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const count = parseInt(searchParams.get('count') || '10')
  
  // Create a readable stream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (let i = 1; i <= count; i++) {
          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 100))
          
          const data = {
            id: i,
            message: `Item ${i}`,
            timestamp: new Date().toISOString(),
          }
          
          // Send data chunk
          const chunk = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(new TextEncoder().encode(chunk))
        }
        
        // End the stream
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}

// Server-Sent Events example
// app/api/events/route.ts
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (data: any) => {
        const chunk = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(new TextEncoder().encode(chunk))
      }
      
      // Send initial event
      sendEvent({ type: 'connection', message: 'Connected to SSE' })
      
      // Send periodic updates
      const interval = setInterval(() => {
        sendEvent({
          type: 'update',
          message: 'Periodic update',
          timestamp: new Date().toISOString(),
        })
      }, 5000)
      
      // Cleanup on close
      const cleanup = () => {
        clearInterval(interval)
        controller.close()
      }
      
      // Handle client disconnect
      setTimeout(cleanup, 30000) // Auto-cleanup after 30 seconds
    },
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
```

### 4. API Testing và Validation

#### 4.1 API Route Testing
```typescript
// __tests__/api/users.test.ts
import { GET, POST } from '@/app/api/users/route'
import { NextRequest } from 'next/server'

// Mock database functions
jest.mock('@/lib/database', () => ({
  getUsersFromDatabase: jest.fn(),
  createUserInDatabase: jest.fn(),
}))

describe('/api/users', () => {
  describe('GET', () => {
    it('should return users with pagination', async () => {
      const request = new NextRequest('http://localhost/api/users?page=1&limit=10')
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('data')
      expect(data).toHaveProperty('pagination')
    })
    
    it('should handle search parameter', async () => {
      const request = new NextRequest('http://localhost/api/users?search=john')
      const response = await GET(request)
      
      expect(response.status).toBe(200)
    })
  })
  
  describe('POST', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      }
      
      const request = new NextRequest('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const response = await POST(request)
      
      expect(response.status).toBe(201)
      
      const data = await response.json()
      expect(data.data).toMatchObject(userData)
    })
    
    it('should validate required fields', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
      }
      
      const request = new NextRequest('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const response = await POST(request)
      
      expect(response.status).toBe(400)
      
      const data = await response.json()
      expect(data).toHaveProperty('error')
      expect(data).toHaveProperty('details')
    })
  })
})
```

#### 4.2 Integration Testing
```typescript
// __tests__/integration/api.test.ts
import { NextRequest } from 'next/server'
import { testApiHandler } from 'next-test-api-route-handler'
import * as usersHandler from '@/app/api/users/route'

describe('/api/users integration', () => {
  it('should handle full user lifecycle', async () => {
    // Create user
    await testApiHandler({
      handler: usersHandler,
      test: async ({ fetch }) => {
        const createResponse = await fetch({
          method: 'POST',
          body: JSON.stringify({
            name: 'Integration Test User',
            email: 'integration@test.com',
            age: 30,
          }),
        })
        
        expect(createResponse.status).toBe(201)
        const createData = await createResponse.json()
        const userId = createData.data.id
        
        // Get user
        const getResponse = await fetch({
          method: 'GET',
        })
        
        expect(getResponse.status).toBe(200)
        
        // Update user
        const updateResponse = await fetch({
          method: 'PUT',
          body: JSON.stringify({
            name: 'Updated User',
          }),
        })
        
        expect(updateResponse.status).toBe(200)
        
        // Delete user
        const deleteResponse = await fetch({
          method: 'DELETE',
        })
        
        expect(deleteResponse.status).toBe(200)
      },
    })
  })
})
```

## 🏆 Bài tập thực hành

### Bài tập 1: Complete REST API với Authentication

Tạo một REST API hoàn chỉnh cho blog system:

```typescript
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyAuth } from '@/lib/auth'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(300).optional(),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const tag = searchParams.get('tag')
    const published = searchParams.get('published') === 'true'
    
    const posts = await getPostsFromDatabase({
      page,
      limit,
      tag,
      published,
    })
    
    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        total: posts.length,
      },
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
    // Verify authentication
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const validatedData = createPostSchema.parse(body)
    
    const newPost = await createPostInDatabase({
      ...validatedData,
      authorId: user.id,
    })
    
    return NextResponse.json(
      { data: newPost, message: 'Post created successfully' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
```

```typescript
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyAuth } from '@/lib/auth'

interface RouteParams {
  params: { id: string }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const post = await getPostById(params.id)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    // Increment view count
    await incrementPostViews(params.id)
    
    return NextResponse.json({ data: post })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const post = await getPostById(params.id)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    
    // Check ownership or admin role
    if (post.authorId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)
    
    const updatedPost = await updatePostInDatabase(params.id, validatedData)
    
    return NextResponse.json({
      data: updatedPost,
      message: 'Post updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}
```

### Bài tập 2: Advanced Middleware System

```typescript
// lib/middleware/advanced-auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

interface AuthOptions {
  required?: boolean
  roles?: string[]
  permissions?: string[]
}

export function createAuthMiddleware(options: AuthOptions = {}) {
  return async function authMiddleware(request: NextRequest) {
    const token = getTokenFromRequest(request)
    
    if (!token && options.required) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    if (!token) {
      return NextResponse.next()
    }
    
    try {
      // Verify token
      const { payload } = await jwtVerify(token, JWT_SECRET)
      const user = payload as any
      
      // Check if token is blacklisted
      const isBlacklisted = await redis.get(`blacklist:${token}`)
      if (isBlacklisted) {
        return NextResponse.json(
          { error: 'Token has been revoked' },
          { status: 401 }
        )
      }
      
      // Check role requirements
      if (options.roles && !options.roles.includes(user.role)) {
        return NextResponse.json(
          { error: 'Insufficient role privileges' },
          { status: 403 }
        )
      }
      
      // Check permissions
      if (options.permissions) {
        const userPermissions = user.permissions || []
        const hasPermission = options.permissions.some(permission =>
          userPermissions.includes(permission)
        )
        
        if (!hasPermission) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        }
      }
      
      // Add user info to request headers
      const response = NextResponse.next()
      response.headers.set('X-User-ID', user.id)
      response.headers.set('X-User-Role', user.role)
      response.headers.set('X-User-Email', user.email)
      
      return response
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }
}
```

## 🔑 Điểm quan trọng cần nhớ

### API Design Best Practices
1. **RESTful conventions** cho endpoints và HTTP methods
2. **Consistent response format** cho tất cả APIs
3. **Proper error handling** với meaningful error messages
4. **Input validation** với schema validation

### Security Considerations
1. **Authentication và authorization** cho protected routes
2. **Rate limiting** để prevent abuse
3. **CORS configuration** cho cross-origin requests
4. **Input sanitization** để prevent injection attacks

### Performance Optimization
1. **Response caching** cho frequently accessed data
2. **Pagination** cho large datasets
3. **Compression** cho API responses
4. **Database query optimization**

### Monitoring và Debugging
1. **Request/response logging** cho debugging
2. **Error tracking** với proper error handling
3. **Performance metrics** monitoring
4. **API documentation** với OpenAPI/Swagger

## 📝 Bài tập về nhà

1. **GraphQL API Integration**: Implement GraphQL endpoint:
   - Schema definition
   - Resolvers implementation
   - Query optimization
   - Subscription support

2. **Microservices Communication**: Create API gateway:
   - Service discovery
   - Load balancing
   - Circuit breaker pattern
   - Request/response transformation

3. **Real-time Features**: Implement:
   - WebSocket connections
   - Server-sent events
   - Real-time notifications
   - Chat system

4. **API Documentation**: Create comprehensive docs:
   - OpenAPI specification
   - Interactive documentation
   - Code examples
   - Testing guides
