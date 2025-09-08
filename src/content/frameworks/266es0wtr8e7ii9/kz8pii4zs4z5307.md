# Bài 15: Xử lý lỗi và tải trang


## 🎯 Mục tiêu học tập

Sau khi hoàn thành bài học này, bạn sẽ có thể:
- Hiểu error handling trong NextJS với App Router
- Triển khai Error Boundaries và error pages
- Xử lý loading states và skeleton screens
- Implement error recovery strategies
- Tạo custom error pages và 404 handling
- Sử dụng Suspense cho better UX
- Monitoring errors với error tracking
- Optimize loading performance và user experience

## 📝 Nội dung chi tiết

### 1. Error Handling trong NextJS

#### 1.1 Error Pages với App Router
```typescript
// app/error.tsx - Global error boundary
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error)
    
    // Send to error tracking service
    if (typeof window !== 'undefined') {
      // Example: Sentry, LogRocket, etc.
      // Sentry.captureException(error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-xl font-semibold text-center mb-2 text-gray-900 dark:text-gray-100">
          Something went wrong!
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
            <pre className="text-sm overflow-auto text-red-600 dark:text-red-400">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </details>
        )}
        
        <div className="flex gap-3">
          <Button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex-1"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
```

#### 1.2 Route-specific Error Handling
```typescript
// app/dashboard/error.tsx - Dashboard specific error
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface DashboardErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    // Log dashboard-specific error
    console.error('Dashboard error:', {
      error: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    })
  }, [error])

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1)
      reset()
    }
  }

  const isRetryDisabled = retryCount >= maxRetries

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Dashboard Error</h1>
          <p className="text-gray-600 mb-6">
            Unable to load dashboard data. This might be a temporary issue.
          </p>
          
          {!isRetryDisabled ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Retry attempt: {retryCount}/{maxRetries}
              </p>
              <Button onClick={handleRetry} disabled={isRetryDisabled}>
                Retry Loading Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-red-600">
                Maximum retry attempts reached. Please contact support.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Go Home
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
```

#### 1.3 Global Error Handler
```typescript
// app/global-error.tsx - Catches errors in root layout
'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Critical error logging
    console.error('Global error:', error)
    
    // Send to monitoring service
    // This is a critical error that crashed the entire app
    if (typeof window !== 'undefined') {
      // Send to error tracking with high priority
      // Sentry.captureException(error, { level: 'fatal' })
    }
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-4">
              Critical Application Error
            </h1>
            <p className="text-red-600 mb-6">
              The application has encountered a critical error. Please refresh the page.
            </p>
            <button
              onClick={reset}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
```

### 2. Loading States và Suspense

#### 2.1 Loading UI với loading.tsx
```typescript
// app/loading.tsx - Global loading UI
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-gray-600">Loading application...</p>
      </div>
    </div>
  )
}

// app/dashboard/loading.tsx - Route-specific loading
export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
        
        {/* Chart skeleton */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-64 w-full bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
```

#### 2.2 Advanced Loading Components
```typescript
// components/ui/LoadingSpinner.tsx
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
    />
  )
}

// components/ui/Skeleton.tsx
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-gray-200 rounded', className)}>
      {children}
    </div>
  )
}

// Usage in components
export function SkeletonCard() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
```

#### 2.3 Suspense với Error Boundaries
```typescript
// components/DataWrapper.tsx
'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Button } from '@/components/ui/Button'

interface DataWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
}

function DefaultErrorFallback({ 
  error, 
  resetErrorBoundary 
}: { 
  error: Error
  resetErrorBoundary: () => void 
}) {
  return (
    <div className="p-6 text-center bg-red-50 rounded-lg">
      <h3 className="text-lg font-medium text-red-800 mb-2">
        Something went wrong
      </h3>
      <p className="text-red-600 mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try Again</Button>
    </div>
  )
}

function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="lg" />
    </div>
  )
}

export function DataWrapper({ 
  children, 
  fallback = <DefaultLoadingFallback />,
  errorFallback = DefaultErrorFallback 
}: DataWrapperProps) {
  return (
    <ErrorBoundary
      FallbackComponent={errorFallback}
      onError={(error, errorInfo) => {
        console.error('DataWrapper error:', error, errorInfo)
      }}
    >
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

// Usage
export function Dashboard() {
  return (
    <div className="space-y-6">
      <DataWrapper>
        <UserStats />
      </DataWrapper>
      
      <DataWrapper>
        <RevenueChart />
      </DataWrapper>
      
      <DataWrapper>
        <RecentOrders />
      </DataWrapper>
    </div>
  )
}
```

### 3. Custom 404 và Not Found Pages

#### 3.1 Custom 404 Page
```typescript
// app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-700">
            404
          </h1>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-blue-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Actions */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="flex items-center gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
          
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <Link href="/search">
              <Search className="w-4 h-4" />
              Search Our Site
            </Link>
          </Button>
        </div>
        
        {/* Help Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
            Popular Pages
          </h3>
          <div className="space-y-2 text-sm">
            <Link href="/blog" className="block text-blue-600 hover:text-blue-800">
              Blog
            </Link>
            <Link href="/docs" className="block text-blue-600 hover:text-blue-800">
              Documentation
            </Link>
            <Link href="/contact" className="block text-blue-600 hover:text-blue-800">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
```

#### 3.2 Dynamic Not Found Handling
```typescript
// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'

interface PostPageProps {
  params: { slug: string }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    notFound() // This will render the not-found.tsx page
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}

// app/posts/[slug]/not-found.tsx - Route-specific 404
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function PostNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
      <p className="text-gray-600 mb-8">
        The blog post you're looking for doesn't exist or has been removed.
      </p>
      
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/posts">View All Posts</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
```

### 4. Error Recovery Strategies

#### 4.1 Retry Logic với Exponential Backoff
```typescript
// lib/error-recovery.ts
interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  backoffFactor?: number
}

export class RetryHandler {
  private maxRetries: number
  private baseDelay: number
  private maxDelay: number
  private backoffFactor: number

  constructor({
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
  }: RetryOptions = {}) {
    this.maxRetries = maxRetries
    this.baseDelay = baseDelay
    this.maxDelay = maxDelay
    this.backoffFactor = backoffFactor
  }

  async execute<T>(
    operation: () => Promise<T>,
    retryCondition?: (error: Error) => boolean
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        // Check if we should retry this error
        if (retryCondition && !retryCondition(lastError)) {
          throw lastError
        }
        
        // Don't delay on the last attempt
        if (attempt === this.maxRetries) {
          break
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.baseDelay * Math.pow(this.backoffFactor, attempt),
          this.maxDelay
        )
        
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, lastError.message)
        await this.sleep(delay)
      }
    }
    
    throw lastError
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Usage
const retryHandler = new RetryHandler({
  maxRetries: 3,
  baseDelay: 1000,
  backoffFactor: 2,
})

export async function fetchWithRetry<T>(url: string): Promise<T> {
  return retryHandler.execute(
    async () => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return response.json()
    },
    (error) => {
      // Retry on network errors or 5xx server errors
      return error.message.includes('fetch') || 
             error.message.includes('5')
    }
  )
}
```

#### 4.2 Circuit Breaker Pattern
```typescript
// lib/circuit-breaker.ts
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

interface CircuitBreakerOptions {
  failureThreshold?: number
  resetTimeout?: number
  monitoringWindow?: number
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED
  private failureCount: number = 0
  private lastFailureTime: number = 0
  private successCount: number = 0
  
  constructor(
    private options: CircuitBreakerOptions = {}
  ) {
    this.options = {
      failureThreshold: 5,
      resetTimeout: 30000, // 30 seconds
      monitoringWindow: 60000, // 1 minute
      ...options,
    }
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (this.shouldAttemptReset()) {
        this.state = CircuitState.HALF_OPEN
        this.successCount = 0
      } else {
        throw new Error('Circuit breaker is OPEN - request blocked')
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    this.failureCount = 0
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++
      if (this.successCount >= 3) { // Require 3 successes to close
        this.state = CircuitState.CLOSED
      }
    }
  }

  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.failureCount >= this.options.failureThreshold!) {
      this.state = CircuitState.OPEN
    }
  }

  private shouldAttemptReset(): boolean {
    const now = Date.now()
    return now - this.lastFailureTime >= this.options.resetTimeout!
  }

  getState(): CircuitState {
    return this.state
  }

  getMetrics() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    }
  }
}

// Usage
const apiCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000,
})

export async function callExternalAPI<T>(url: string): Promise<T> {
  return apiCircuitBreaker.execute(async () => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }
    return response.json()
  })
}
```

### 5. Error Monitoring và Logging

#### 5.1 Error Tracking Setup
```typescript
// lib/error-tracking.ts
interface ErrorReport {
  error: Error
  context?: Record<string, any>
  user?: {
    id?: string
    email?: string
  }
  url?: string
  userAgent?: string
  timestamp: string
}

class ErrorTracker {
  private queue: ErrorReport[] = []
  private batchSize = 10
  private flushInterval = 5000 // 5 seconds

  constructor() {
    if (typeof window !== 'undefined') {
      this.startBatchProcessor()
      this.setupGlobalHandlers()
    }
  }

  captureException(error: Error, context?: Record<string, any>) {
    const report: ErrorReport = {
      error,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    }

    this.queue.push(report)

    if (this.queue.length >= this.batchSize) {
      this.flush()
    }
  }

  private async flush() {
    if (this.queue.length === 0) return

    const batch = [...this.queue]
    this.queue = []

    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ errors: batch }),
      })
    } catch (error) {
      console.error('Failed to send error reports:', error)
      // Re-queue failed reports
      this.queue.unshift(...batch)
    }
  }

  private startBatchProcessor() {
    setInterval(() => {
      this.flush()
    }, this.flushInterval)
  }

  private setupGlobalHandlers() {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(
        new Error(event.reason),
        { type: 'unhandled-promise-rejection' }
      )
    })

    // Catch global errors
    window.addEventListener('error', (event) => {
      this.captureException(event.error, {
        type: 'global-error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })
  }
}

export const errorTracker = new ErrorTracker()

// React Error Boundary with tracking
export class TrackedErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorTracker.captureException(error, {
      type: 'react-error-boundary',
      errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-medium text-red-800">Something went wrong</h3>
          <p className="text-red-600">Please refresh the page or contact support.</p>
        </div>
      )
    }

    return this.props.children
  }
}
```

#### 5.2 Performance Monitoring
```typescript
// lib/performance-monitoring.ts
interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  context?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private observers: Map<string, PerformanceObserver> = new Map()

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupObservers()
    }
  }

  private setupObservers() {
    // Core Web Vitals
    this.observeWebVitals()
    
    // Navigation timing
    this.observeNavigation()
    
    // Resource timing
    this.observeResources()
  }

  private observeWebVitals() {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      this.recordMetric({
        name: 'LCP',
        value: lastEntry.startTime,
        unit: 'ms',
        timestamp: Date.now(),
      })
    })
    
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    this.observers.set('lcp', lcpObserver)

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.recordMetric({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          unit: 'ms',
          timestamp: Date.now(),
        })
      })
    })
    
    fidObserver.observe({ entryTypes: ['first-input'] })
    this.observers.set('fid', fidObserver)

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      
      this.recordMetric({
        name: 'CLS',
        value: clsValue,
        unit: 'score',
        timestamp: Date.now(),
      })
    })
    
    clsObserver.observe({ entryTypes: ['layout-shift'] })
    this.observers.set('cls', clsObserver)
  }

  private observeNavigation() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      this.recordMetric({
        name: 'DOM_COMPLETE',
        value: navigation.domComplete - navigation.navigationStart,
        unit: 'ms',
        timestamp: Date.now(),
      })
      
      this.recordMetric({
        name: 'LOAD_EVENT',
        value: navigation.loadEventEnd - navigation.navigationStart,
        unit: 'ms',
        timestamp: Date.now(),
      })
    })
  }

  private observeResources() {
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: PerformanceResourceTiming) => {
        if (entry.duration > 1000) { // Only track slow resources
          this.recordMetric({
            name: 'SLOW_RESOURCE',
            value: entry.duration,
            unit: 'ms',
            timestamp: Date.now(),
            context: {
              url: entry.name,
              type: entry.initiatorType,
              size: entry.transferSize,
            },
          })
        }
      })
    })
    
    resourceObserver.observe({ entryTypes: ['resource'] })
    this.observers.set('resource', resourceObserver)
  }

  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric)
    
    // Send to analytics
    this.sendMetric(metric)
  }

  private async sendMetric(metric: PerformanceMetric) {
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      })
    } catch (error) {
      console.warn('Failed to send metric:', error)
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  disconnect() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers.clear()
  }
}

export const performanceMonitor = new PerformanceMonitor()
```

## 🏆 Bài tập thực hành

### Bài tập 1: Complete Error Handling System

Tạo một error handling system toàn diện:

```typescript
// lib/error-system.ts
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export class AppError extends Error {
  public readonly type: ErrorType
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly context?: Record<string, any>

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = context

    Error.captureStackTrace(this, this.constructor)
  }

  static network(message: string, context?: Record<string, any>): AppError {
    return new AppError(message, ErrorType.NETWORK, 0, true, context)
  }

  static validation(message: string, context?: Record<string, any>): AppError {
    return new AppError(message, ErrorType.VALIDATION, 400, true, context)
  }

  static authentication(message: string = 'Authentication required'): AppError {
    return new AppError(message, ErrorType.AUTHENTICATION, 401)
  }

  static authorization(message: string = 'Insufficient permissions'): AppError {
    return new AppError(message, ErrorType.AUTHORIZATION, 403)
  }

  static notFound(resource: string = 'Resource'): AppError {
    return new AppError(`${resource} not found`, ErrorType.NOT_FOUND, 404)
  }

  static server(message: string = 'Internal server error', context?: Record<string, any>): AppError {
    return new AppError(message, ErrorType.SERVER, 500, true, context)
  }
}
```

```typescript
// components/ErrorHandler.tsx
'use client'

import { useEffect } from 'react'
import { AppError, ErrorType } from '@/lib/error-system'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, Wifi, Lock, Search, Server, RefreshCw } from 'lucide-react'

interface ErrorHandlerProps {
  error: Error
  reset?: () => void
  showDetails?: boolean
}

export function ErrorHandler({ error, reset, showDetails = false }: ErrorHandlerProps) {
  const isAppError = error instanceof AppError
  const errorType = isAppError ? error.type : ErrorType.UNKNOWN

  const getErrorConfig = (type: ErrorType) => {
    const configs = {
      [ErrorType.NETWORK]: {
        icon: Wifi,
        title: 'Connection Problem',
        description: 'Please check your internet connection and try again.',
        color: 'orange',
        actions: ['retry', 'offline'],
      },
      [ErrorType.AUTHENTICATION]: {
        icon: Lock,
        title: 'Authentication Required',
        description: 'Please sign in to access this content.',
        color: 'blue',
        actions: ['login'],
      },
      [ErrorType.AUTHORIZATION]: {
        icon: Lock,
        title: 'Access Denied',
        description: 'You don\'t have permission to access this resource.',
        color: 'red',
        actions: ['home', 'contact'],
      },
      [ErrorType.NOT_FOUND]: {
        icon: Search,
        title: 'Not Found',
        description: 'The requested resource could not be found.',
        color: 'gray',
        actions: ['home', 'search'],
      },
      [ErrorType.VALIDATION]: {
        icon: AlertTriangle,
        title: 'Invalid Data',
        description: 'Please check your input and try again.',
        color: 'yellow',
        actions: ['retry'],
      },
      [ErrorType.SERVER]: {
        icon: Server,
        title: 'Server Error',
        description: 'We\'re experiencing technical difficulties. Please try again later.',
        color: 'red',
        actions: ['retry', 'status'],
      },
      [ErrorType.UNKNOWN]: {
        icon: AlertTriangle,
        title: 'Something went wrong',
        description: 'An unexpected error occurred. Please try again.',
        color: 'red',
        actions: ['retry', 'home'],
      },
    }

    return configs[type] || configs[ErrorType.UNKNOWN]
  }

  const config = getErrorConfig(errorType)
  const Icon = config.icon

  useEffect(() => {
    // Log error for monitoring
    console.error('Error handled by ErrorHandler:', {
      message: error.message,
      type: errorType,
      stack: error.stack,
      context: isAppError ? error.context : undefined,
    })
  }, [error, errorType, isAppError])

  const handleAction = (action: string) => {
    switch (action) {
      case 'retry':
        reset?.()
        break
      case 'home':
        window.location.href = '/'
        break
      case 'login':
        window.location.href = '/login'
        break
      case 'search':
        window.location.href = '/search'
        break
      case 'contact':
        window.location.href = '/contact'
        break
      case 'status':
        window.open('https://status.example.com', '_blank')
        break
      case 'offline':
        // Handle offline mode
        break
    }
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-${config.color}-100`}>
          <Icon className={`w-8 h-8 text-${config.color}-600`} />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{config.title}</h3>
        <p className="text-gray-600 mb-6">{config.description}</p>
        
        {showDetails && isAppError && error.context && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer font-medium">Error Details</summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
              {JSON.stringify(error.context, null, 2)}
            </pre>
          </details>
        )}
        
        <div className="flex flex-wrap gap-2 justify-center">
          {config.actions.map((action) => (
            <Button
              key={action}
              variant={action === 'retry' ? 'default' : 'outline'}
              onClick={() => handleAction(action)}
              className="flex items-center gap-2"
            >
              {action === 'retry' && <RefreshCw className="w-4 h-4" />}
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Bài tập 2: Advanced Loading States

```typescript
// components/LoadingStates.tsx
'use client'

import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'
import { Progress } from '@/components/ui/Progress'

interface LoadingState {
  type: 'loading' | 'success' | 'error'
  progress?: number
  message?: string
}

export function ProgressiveLoader({ 
  steps, 
  currentStep, 
  onComplete 
}: { 
  steps: string[]
  currentStep: number
  onComplete: () => void 
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressValue = (currentStep / steps.length) * 100
    setProgress(progressValue)
    
    if (currentStep >= steps.length) {
      onComplete()
    }
  }, [currentStep, steps.length, onComplete])

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-gray-600 text-center">
          {currentStep < steps.length ? steps[currentStep] : 'Complete!'}
        </p>
      </div>
      
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`flex items-center gap-2 text-sm ${
              index < currentStep ? 'text-green-600' : 
              index === currentStep ? 'text-blue-600' : 
              'text-gray-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              index < currentStep ? 'bg-green-600' : 
              index === currentStep ? 'bg-blue-600 animate-pulse' : 
              'bg-gray-300'
            }`} />
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 🔑 Điểm quan trọng cần nhớ

### Error Handling Best Practices
1. **Specific error boundaries** cho different parts của app
2. **Graceful degradation** khi có lỗi xảy ra
3. **User-friendly error messages** thay vì technical details
4. **Error recovery strategies** như retry mechanisms

### Loading Experience
1. **Progressive loading** với skeleton screens
2. **Suspense boundaries** để tránh loading waterfalls
3. **Loading indicators** phù hợp với content type
4. **Optimistic updates** cho better UX

### Monitoring và Tracking
1. **Error tracking** để identify issues quickly
2. **Performance monitoring** cho Core Web Vitals
3. **User experience metrics** tracking
4. **Alert systems** cho critical errors

### Recovery Strategies
1. **Circuit breaker pattern** cho external services
2. **Exponential backoff** cho retry logic
3. **Fallback content** khi primary content fails
4. **Offline support** khi có thể

## 📝 Bài tập về nhà

1. **Error Analytics Dashboard**: Tạo dashboard để monitor:
   - Error frequency và trends
   - Performance metrics
   - User impact analysis
   - Recovery success rates

2. **Offline-First Error Handling**: Implement:
   - Service worker error handling
   - Offline queue management
   - Sync when back online
   - User notification system

3. **Advanced Recovery System**: Xây dựng:
   - Smart retry logic
   - Fallback content system
   - Progressive enhancement
   - A/B test error UIs

4. **Real-time Error Monitoring**: Tạo:
   - WebSocket error reporting
   - Real-time alerts
   - Error correlation
   - Impact assessment tools
