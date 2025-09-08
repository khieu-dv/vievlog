# Bài 16: Bảo mật và Dữ liệu


## 🎯 Mục tiêu học tập

Sau khi hoàn thành bài học này, bạn sẽ có thể:
- Triển khai authentication và authorization trong NextJS
- Bảo mật API endpoints và protect sensitive routes
- Implement CSRF protection và XSS prevention
- Sử dụng NextAuth.js cho authentication flows
- Quản lý database connections và ORM integration
- Implement data validation và sanitization
- Secure cookie handling và session management
- Apply security headers và CSP policies

## 📝 Nội dung chi tiết

### 1. Authentication với NextAuth.js

#### 1.1 NextAuth.js Setup
```bash
npm install next-auth
npm install @next-auth/prisma-adapter prisma @prisma/client
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('No user found with this email')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      
      // OAuth account linking
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Custom sign-in logic
      if (account?.provider === 'google') {
        // Verify Google account
        return profile?.email_verified === true
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirect after sign in
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log('User signed in:', { user, account, profile })
    },
    async signOut({ session, token }) {
      console.log('User signed out:', { session, token })
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

#### 1.2 Custom Authentication Pages
```typescript
// app/auth/signin/page.tsx
'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        // Refresh session and redirect
        await getSession()
        router.push(callbackUrl)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-gray-600 mt-2">Welcome back! Please sign in to continue.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full mt-4"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="..." /> {/* Google icon path */}
            </svg>
            Continue with Google
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </a>
        </p>
      </Card>
    </div>
  )
}
```

#### 1.3 Session Management
```typescript
// lib/auth.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }
  
  return session
}

export async function requireRole(allowedRoles: string[]) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }
  
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/unauthorized')
  }
  
  return session
}

// Client-side session hook
// hooks/useAuth.ts
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useAuth(requireAuth: boolean = true) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [requireAuth, status, router])

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}

export function useRequireRole(allowedRoles: string[]) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized')
    }
  }, [isAuthenticated, user, allowedRoles, router])

  return { user, hasAccess: user && allowedRoles.includes(user.role) }
}
```

### 2. Authorization và Route Protection

#### 2.1 Route-level Authorization
```typescript
// app/admin/page.tsx
import { requireRole } from '@/lib/auth'
import { AdminDashboard } from '@/components/AdminDashboard'

export default async function AdminPage() {
  const session = await requireRole(['admin'])
  
  return <AdminDashboard user={session.user} />
}

// app/dashboard/page.tsx
import { requireAuth } from '@/lib/auth'
import { UserDashboard } from '@/components/UserDashboard'

export default async function DashboardPage() {
  const session = await requireAuth()
  
  return <UserDashboard user={session.user} />
}
```

#### 2.2 API Route Protection
```typescript
// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // Admin-only logic
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true }
  })
  
  return NextResponse.json({ users })
}

// lib/api-auth.ts
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function withAuth(
  handler: (request: NextRequest, user: any) => Promise<Response>,
  options: { roles?: string[] } = {}
) {
  return async function(request: NextRequest) {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (options.roles && !options.roles.includes(session.user.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return handler(request, session.user)
  }
}

// Usage
export const GET = withAuth(async (request, user) => {
  // Your protected logic here
  return Response.json({ message: 'Protected data', user })
}, { roles: ['admin'] })
```

### 3. Database Integration với Prisma

#### 3.1 Prisma Setup
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(USER)
  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

#### 3.2 Database Connection và Query Optimization
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Connection management
export async function connectToDatabase() {
  try {
    await prisma.$connect()
    console.log('Connected to database')
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

export async function disconnectFromDatabase() {
  await prisma.$disconnect()
}

// Query optimization utilities
export class DatabaseService {
  static async findManyWithPagination<T>(
    model: any,
    {
      page = 1,
      limit = 10,
      where,
      orderBy,
      include,
      select,
    }: {
      page?: number
      limit?: number
      where?: any
      orderBy?: any
      include?: any
      select?: any
    }
  ) {
    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      model.findMany({
        where,
        orderBy,
        include,
        select,
        skip,
        take: limit,
      }),
      model.count({ where }),
    ])

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async createWithValidation<T>(
    model: any,
    data: any,
    validation?: (data: any) => Promise<void>
  ): Promise<T> {
    if (validation) {
      await validation(data)
    }

    return model.create({ data })
  }
}
```

#### 3.3 Data Validation và Sanitization
```typescript
// lib/validation.ts
import { z } from 'zod'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Server-side DOMPurify setup
const window = new JSDOM('').window as unknown as Window
const purify = DOMPurify(window)

export const userCreateSchema = z.object({
  name: z.string().min(1).max(50).regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string().email().toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain uppercase, lowercase, number, and special character'),
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']).default('USER'),
})

export const postCreateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  published: z.boolean().default(false),
})

export function sanitizeHTML(input: string): string {
  return purify.sanitize(input, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  })
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.trim()
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value)
    }
    return sanitized
  }
  
  return input
}

// Rate limiting by user
const rateLimitMap = new Map()

export function rateLimit(identifier: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }
  
  const requests = rateLimitMap.get(identifier)
  const recentRequests = requests.filter((timestamp: number) => timestamp > windowStart)
  
  if (recentRequests.length >= limit) {
    throw new Error('Rate limit exceeded')
  }
  
  recentRequests.push(now)
  rateLimitMap.set(identifier, recentRequests)
}
```

### 4. Security Headers và CSP

#### 4.1 Security Headers Setup
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // HSTS (only in production with HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  }
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://api.example.com",
    "frame-src 'self' https://accounts.google.com",
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)

  // CSRF protection for state-changing operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')
    
    if (!origin && !referer) {
      return new Response('CSRF protection: No origin or referer', { status: 403 })
    }
    
    const allowedOrigins = [
      process.env.NEXTAUTH_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    ].filter(Boolean)
    
    if (origin && !allowedOrigins.includes(origin)) {
      return new Response('CSRF protection: Invalid origin', { status: 403 })
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

#### 4.2 CSRF Protection
```typescript
// lib/csrf.ts
import { createHash, randomBytes } from 'crypto'
import { NextRequest } from 'next/server'

export class CSRFProtection {
  private static secret = process.env.CSRF_SECRET || 'fallback-secret'
  
  static generateToken(sessionId: string): string {
    const timestamp = Date.now().toString()
    const random = randomBytes(16).toString('hex')
    const payload = `${sessionId}:${timestamp}:${random}`
    const signature = this.sign(payload)
    
    return Buffer.from(`${payload}:${signature}`).toString('base64')
  }
  
  static validateToken(token: string, sessionId: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString()
      const parts = decoded.split(':')
      
      if (parts.length !== 4) return false
      
      const [tokenSessionId, timestamp, random, signature] = parts
      
      // Check session ID match
      if (tokenSessionId !== sessionId) return false
      
      // Check token age (1 hour max)
      const tokenTime = parseInt(timestamp)
      const now = Date.now()
      if (now - tokenTime > 3600000) return false
      
      // Verify signature
      const payload = `${tokenSessionId}:${timestamp}:${random}`
      const expectedSignature = this.sign(payload)
      
      return signature === expectedSignature
    } catch {
      return false
    }
  }
  
  private static sign(payload: string): string {
    return createHash('sha256')
      .update(`${payload}:${this.secret}`)
      .digest('hex')
  }
}

// API route with CSRF protection
export async function protectedHandler(request: NextRequest, handler: Function) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // CSRF check for state-changing operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfToken = request.headers.get('x-csrf-token')
    
    if (!csrfToken || !CSRFProtection.validateToken(csrfToken, session.user.id)) {
      return Response.json({ error: 'Invalid CSRF token' }, { status: 403 })
    }
  }
  
  return handler(request, session)
}
```

### 5. Secure File Upload

#### 5.1 File Upload Security
```typescript
// app/api/upload/secure/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { createHash } from 'crypto'
import sharp from 'sharp'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const ALLOWED_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large' }, { status: 413 })
    }

    // Validate file type
    if (!ALLOWED_TYPES[file.type as keyof typeof ALLOWED_TYPES]) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 415 })
    }

    // Create secure filename
    const fileHash = createHash('sha256')
      .update(`${file.name}${Date.now()}${session.user.id}`)
      .digest('hex')
    
    const extension = extname(file.name).toLowerCase()
    const filename = `${fileHash}${extension}`
    
    // Create user-specific upload directory
    const uploadDir = join(process.cwd(), 'uploads', session.user.id)
    await mkdir(uploadDir, { recursive: true })
    
    const filePath = join(uploadDir, filename)
    
    // Get file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Additional security: scan file content
    if (await containsMaliciousContent(buffer)) {
      return NextResponse.json({ error: 'File content not allowed' }, { status: 415 })
    }

    // Process images for additional security
    if (file.type.startsWith('image/')) {
      const processedBuffer = await sharp(buffer)
        .resize(2048, 2048, { fit: 'inside', withoutEnlargement: true })
        .strip() // Remove EXIF data
        .toBuffer()
      
      await writeFile(filePath, processedBuffer)
    } else {
      await writeFile(filePath, buffer)
    }

    // Store file metadata in database
    const fileRecord = await prisma.file.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        userId: session.user.id,
        path: `/uploads/${session.user.id}/${filename}`,
      },
    })

    return NextResponse.json({
      success: true,
      file: {
        id: fileRecord.id,
        filename: fileRecord.filename,
        url: fileRecord.path,
        size: fileRecord.size,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

async function containsMaliciousContent(buffer: Buffer): Promise<boolean> {
  const content = buffer.toString()
  
  // Check for common malicious patterns
  const maliciousPatterns = [
    /<script[^>]*>/i,
    /javascript:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /<iframe[^>]*>/i,
    /<object[^>]*>/i,
    /<embed[^>]*>/i,
  ]
  
  return maliciousPatterns.some(pattern => pattern.test(content))
}
```

#### 5.2 Secure File Serving
```typescript
// app/api/files/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const file = await prisma.file.findUnique({
      where: { id: params.id },
      include: { user: true },
    })
    
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    
    // Check permissions
    const canAccess = 
      session?.user.id === file.userId || // Owner
      session?.user.role === 'admin' || // Admin
      file.isPublic // Public file
    
    if (!canAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }
    
    // Read and serve file
    const fileBuffer = await readFile(file.path)
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': file.mimeType,
        'Content-Length': file.size.toString(),
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('File serving error:', error)
    return NextResponse.json({ error: 'File serving failed' }, { status: 500 })
  }
}
```

## 🏆 Bài tập thực hành

### Bài tập 1: Complete Authentication System

Tạo một authentication system hoàn chỉnh với multiple providers:

```typescript
// lib/auth-providers.ts
import { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/lib/email'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })

        if (!user) {
          return null
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error('Please verify your email before signing in')
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error('Account temporarily locked due to too many failed attempts')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password!)

        if (!isPasswordValid) {
          // Increment failed login attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: { increment: 1 },
              lockedUntil: user.loginAttempts >= 4 
                ? new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
                : undefined,
            },
          })
          return null
        }

        // Reset login attempts on successful login
        if (user.loginAttempts > 0) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: 0,
              lockedUntil: null,
            },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (existingUser) {
          // Link OAuth account to existing user
          return true
        } else {
          // Create new user with verified email
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
            },
          })
        }
      }
      
      return true
    },

    async jwt({ token, user, account, trigger }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }

      // Handle token refresh
      if (trigger === 'update') {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        })
        if (updatedUser) {
          token.name = updatedUser.name
          token.email = updatedUser.email
          token.role = updatedUser.role
          token.picture = updatedUser.image
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  events: {
    async createUser({ user }) {
      // Send welcome email
      await sendVerificationEmail(user.email!, user.name!)
    },
    
    async signIn({ user, account, isNewUser }) {
      if (isNewUser) {
        console.log('New user signed in:', user.email)
      }
      
      // Log successful sign-in
      await prisma.loginLog.create({
        data: {
          userId: user.id,
          provider: account?.provider || 'credentials',
          success: true,
          ip: '0.0.0.0', // Would get from request in real app
        },
      })
    },
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
}
```

### Bài tập 2: Role-based Access Control System

```typescript
// lib/rbac.ts
export enum Permission {
  READ_POSTS = 'posts:read',
  WRITE_POSTS = 'posts:write',
  DELETE_POSTS = 'posts:delete',
  MANAGE_USERS = 'users:manage',
  ADMIN_ACCESS = 'admin:access',
}

export enum Role {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.READ_POSTS],
  [Role.MODERATOR]: [Permission.READ_POSTS, Permission.WRITE_POSTS, Permission.DELETE_POSTS],
  [Role.ADMIN]: [Permission.READ_POSTS, Permission.WRITE_POSTS, Permission.DELETE_POSTS, Permission.MANAGE_USERS],
  [Role.SUPER_ADMIN]: Object.values(Permission),
}

export class RBAC {
  static hasPermission(userRole: Role, permission: Permission): boolean {
    const permissions = rolePermissions[userRole] || []
    return permissions.includes(permission)
  }

  static hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRole, permission))
  }

  static hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRole, permission))
  }

  static canAccess(userRole: Role, requiredRole: Role): boolean {
    const rolePriority = {
      [Role.USER]: 1,
      [Role.MODERATOR]: 2,
      [Role.ADMIN]: 3,
      [Role.SUPER_ADMIN]: 4,
    }

    return rolePriority[userRole] >= rolePriority[requiredRole]
  }
}

// Higher-order component for permission-based rendering
export function withPermission(
  Component: React.ComponentType,
  permission: Permission
) {
  return function PermissionWrapper(props: any) {
    const { user } = useAuth()
    
    if (!user || !RBAC.hasPermission(user.role as Role, permission)) {
      return <div>Access denied</div>
    }
    
    return <Component {...props} />
  }
}

// API middleware for permission checking
export function requirePermission(permission: Permission) {
  return async function(request: NextRequest, context: { user: any }) {
    if (!RBAC.hasPermission(context.user.role, permission)) {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
  }
}
```

## 🔑 Điểm quan trọng cần nhớ

### Authentication Best Practices
1. **Multi-factor authentication** cho sensitive accounts
2. **Password hashing** với bcrypt hoặc Argon2
3. **Account lockout** sau failed attempts
4. **Email verification** cho new accounts

### Authorization Strategies
1. **Role-based access control** (RBAC)
2. **Permission-based authorization**
3. **Resource-based access control**
4. **API route protection**

### Data Security
1. **Input validation** và sanitization
2. **SQL injection prevention**
3. **XSS protection** với CSP headers
4. **CSRF token validation**

### File Upload Security
1. **File type validation**
2. **Size limitations**
3. **Content scanning**
4. **Secure file storage**

## 📝 Bài tập về nhà

1. **Advanced Authentication**: Implement:
   - Two-factor authentication (2FA)
   - Social login với multiple providers
   - Password reset flow với secure tokens
   - Account recovery system

2. **Security Audit System**: Tạo:
   - Login attempt monitoring
   - Suspicious activity detection
   - Security event logging
   - Automated security reports

3. **Data Protection Framework**: Xây dựng:
   - Field-level encryption
   - PII data handling
   - GDPR compliance features
   - Data retention policies

4. **Advanced Authorization**: Implement:
   - Dynamic permissions system
   - Resource-based access control
   - API key management
   - Service-to-service authentication
