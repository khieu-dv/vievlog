---
title: "Bài 11: Làm việc với assets tĩnh và tối ưu hóa hình ảnh"
postId: "9d2afssukszim97"
category: "NextJS"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 11: Làm việc với assets tĩnh và tối ưu hóa hình ảnh


## 🎯 Mục tiêu học tập

Sau khi hoàn thành bài học này, bạn sẽ có thể:
- Quản lý assets tĩnh trong NextJS hiệu quả
- Sử dụng Next.js Image component để tối ưu hóa hình ảnh
- Triển khai lazy loading và responsive images
- Cấu hình Image Optimization API
- Làm việc với external images và CDN
- Tối ưu hóa fonts và các assets khác
- Sử dụng Webpack asset modules
- Triển khai Progressive Web App (PWA) assets

## 📝 Nội dung chi tiết

### 1. Assets tĩnh trong NextJS

**Assets tĩnh (Static Assets)** là các tài nguyên không thay đổi như hình ảnh, video, font, icon, document được serve trực tiếp từ server mà không qua xử lý.

#### 1.1 Thư mục public
**Thư mục public** là nơi chứa các assets tĩnh được serve trực tiếp từ root domain của website.
```typescript
// Cấu trúc thư mục
public/
├── images/
│   ├── hero-banner.jpg
│   ├── logo.svg
│   └── products/
│       ├── product-1.jpg
│       └── product-2.jpg
├── icons/
│   ├── favicon.ico
│   └── manifest-icon.png
├── fonts/
│   └── custom-font.woff2
└── videos/
    └── intro.mp4
```

```typescript
// app/components/StaticAssets.tsx
import Image from 'next/image'

export default function StaticAssets() {
  return (
    <div>
      {/* Sử dụng assets từ thư mục public */}
      <Image
        src="/images/logo.svg"
        alt="Company Logo"
        width={200}
        height={50}
      />
      
      {/* Video từ thư mục public */}
      <video controls width="100%">
        <source src="/videos/intro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Link đến file PDF */}
      <a href="/documents/brochure.pdf" download>
        Download Brochure
      </a>
    </div>
  )
}
```

#### 1.2 Import assets trong components
```typescript
// app/components/ImportedAssets.tsx
import heroImage from '@/public/images/hero-banner.jpg'
import logoSvg from '@/public/icons/logo.svg'

export default function ImportedAssets() {
  return (
    <div>
      {/* Sử dụng imported static assets */}
      <Image
        src={heroImage}
        alt="Hero Banner"
        placeholder="blur" // Automatic blur placeholder
        className="w-full h-auto"
      />
      
      {/* SVG as component */}
      <div className="w-12 h-12">
        <Image src={logoSvg} alt="Logo" width={48} height={48} />
      </div>
    </div>
  )
}
```

### 2. Next.js Image Component

**Next.js Image Component** là component được tối ưu hóa để hiển thị hình ảnh với các tính năng như lazy loading, responsive images, và automatic optimization.

#### 2.1 Cơ bản về Image component
```typescript
// app/components/BasicImage.tsx
import Image from 'next/image'

export default function BasicImage() {
  return (
    <div>
      {/* Fixed size image */}
      <Image
        src="/images/product.jpg"
        alt="Product Image"
        width={300}
        height={200}
        priority // Load image with high priority
      />
      
      {/* Fill container */}
      <div className="relative w-full h-64">
        <Image
          src="/images/banner.jpg"
          alt="Banner"
          fill
          className="object-cover"
        />
      </div>
      
      {/* Responsive image */}
      <Image
        src="/images/hero.jpg"
        alt="Hero"
        width={800}
        height={600}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="w-full h-auto"
      />
    </div>
  )
}
```

#### 2.2 Advanced Image optimizations
```typescript
// app/components/AdvancedImage.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageWithPlaceholderProps {
  src: string
  alt: string
  width: number
  height: number
}

function ImageWithPlaceholder({ src, alt, width, height }: ImageWithPlaceholderProps) {
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  return (
    <div className="relative overflow-hidden rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {error ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-100">
          <span className="text-gray-500">Failed to load image</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`
            duration-700 ease-in-out
            ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
          `}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true)
            setLoading(false)
          }}
        />
      )}
    </div>
  )
}

export default function AdvancedImage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ImageWithPlaceholder
        src="/images/product-1.jpg"
        alt="Product 1"
        width={300}
        height={200}
      />
      <ImageWithPlaceholder
        src="/images/product-2.jpg"
        alt="Product 2"
        width={300}
        height={200}
      />
      <ImageWithPlaceholder
        src="/images/product-3.jpg"
        alt="Product 3"
        width={300}
        height={200}
      />
    </div>
  )
}
```

#### 2.3 Responsive Images với srcSet
```typescript
// app/components/ResponsiveImage.tsx
import Image from 'next/image'

interface ResponsiveImageProps {
  src: string
  alt: string
}

export default function ResponsiveImage({ src, alt }: ResponsiveImageProps) {
  return (
    <div className="w-full">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={600}
        sizes="
          (max-width: 640px) 100vw,
          (max-width: 1024px) 80vw,
          1200px
        "
        style={{
          width: '100%',
          height: 'auto',
        }}
        priority
      />
    </div>
  )
}

// app/components/ArtDirectionImage.tsx
export function ArtDirectionImage() {
  return (
    <picture>
      <source
        media="(max-width: 640px)"
        srcSet="/images/hero-mobile.jpg"
      />
      <source
        media="(max-width: 1024px)"
        srcSet="/images/hero-tablet.jpg"
      />
      <Image
        src="/images/hero-desktop.jpg"
        alt="Hero Image"
        width={1200}
        height={400}
        className="w-full h-auto"
      />
    </picture>
  )
}
```

### 3. External Images và CDN

#### 3.1 Cấu hình external images
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
}

module.exports = nextConfig
```

#### 3.2 Sử dụng external images
**External images** là hình ảnh được lưu trữ trên các domain khác (CDN, cloud storage) thay vì trên server của ứng dụng.
```typescript
// app/components/ExternalImages.tsx
import Image from 'next/image'

interface UnsplashImageProps {
  imageId: string
  alt: string
  width: number
  height: number
}

export function UnsplashImage({ imageId, alt, width, height }: UnsplashImageProps) {
  const src = `https://images.unsplash.com/${imageId}?w=${width}&h=${height}&fit=crop&auto=format`
  
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="rounded-lg shadow-md"
    />
  )
}

// app/components/CDNImage.tsx
interface CDNImageProps {
  src: string
  alt: string
  width: number
  height: number
  quality?: number
}

export function CDNImage({ src, alt, width, height, quality = 75 }: CDNImageProps) {
  // Cloudinary transformation
  const cloudinaryUrl = `https://res.cloudinary.com/your-cloud/image/fetch/w_${width},h_${height},c_fill,q_${quality},f_auto/${encodeURIComponent(src)}`
  
  return (
    <Image
      src={cloudinaryUrl}
      alt={alt}
      width={width}
      height={height}
      className="w-full h-auto"
    />
  )
}

export default function ExternalImages() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UnsplashImage
        imageId="photo-1506905925346-21bda4d32df4"
        alt="Nature landscape"
        width={400}
        height={300}
      />
      
      <CDNImage
        src="https://example.com/original-image.jpg"
        alt="CDN optimized image"
        width={400}
        height={300}
        quality={80}
      />
    </div>
  )
}
```

### 4. Font Optimization

**Font Optimization** là quá trình tối ưu hóa việc tải và hiển thị font để cải thiện performance và user experience.

#### 4.1 Google Fonts với next/font
**next/font** là module tích hợp sẵn trong Next.js để tối ưu hóa việc tải Google Fonts.
```typescript
// app/layout.tsx
import { Inter, Roboto_Mono, Playfair_Display } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${robotoMono.variable} ${playfair.variable}`}
    >
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
```

```css
/* app/globals.css */
:root {
  --font-inter: 'Inter', sans-serif;
  --font-roboto-mono: 'Roboto Mono', monospace;
  --font-playfair: 'Playfair Display', serif;
}

.font-sans {
  font-family: var(--font-inter);
}

.font-mono {
  font-family: var(--font-roboto-mono);
}

.font-serif {
  font-family: var(--font-playfair);
}

/* Custom font utilities */
.heading-font {
  font-family: var(--font-playfair);
  font-weight: 700;
}

.code-font {
  font-family: var(--font-roboto-mono);
  font-size: 0.875rem;
}
```

#### 4.2 Custom fonts
```typescript
// app/fonts/index.ts
import localFont from 'next/font/local'

export const customFont = localFont({
  src: [
    {
      path: './custom-font-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './custom-font-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './custom-font-italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-custom',
  display: 'swap',
  preload: true,
})

// app/components/CustomFontComponent.tsx
import { customFont } from '@/fonts'

export default function CustomFontComponent() {
  return (
    <div className={`${customFont.variable} font-custom`}>
      <h1 className="text-3xl font-bold">Custom Font Heading</h1>
      <p className="text-lg">This text uses a custom font family.</p>
    </div>
  )
}
```

### 5. Asset Loading Strategies

#### 5.1 Lazy Loading
**Lazy Loading** là kỹ thuật tải tài nguyên (hình ảnh, video) chỉ khi chúng sắp hiển thị trên viewport, giúp tăng tốc độ tải trang ban đầu.
```typescript
// app/components/LazyImageGallery.tsx
'use client'

import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
}

function LazyImage({ src, alt, width, height }: LazyImageProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px', // Load 200px before entering viewport
  })
  
  return (
    <div ref={ref} className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
      {inView && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />
      )}
    </div>
  )
}

export default function LazyImageGallery() {
  const images = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    src: `/images/gallery/image-${i + 1}.jpg`,
    alt: `Gallery image ${i + 1}`,
  }))
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <LazyImage
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={300}
          height={200}
        />
      ))}
    </div>
  )
}
```

#### 5.2 Progressive image loading
**Progressive Image Loading** là kỹ thuật hiển thị ảnh chất lượng thấp trước, sau đó thay thế bằng ảnh chất lượng cao khi đã tải xong.
```typescript
// app/components/ProgressiveImage.tsx
'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface ProgressiveImageProps {
  src: string
  lowQualitySrc: string
  alt: string
  width: number
  height: number
}

export default function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  width,
  height
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc)
  
  useEffect(() => {
    const img = new window.Image()
    img.src = src
    img.onload = () => {
      setCurrentSrc(src)
      setIsLoaded(true)
    }
  }, [src])
  
  return (
    <div className="relative overflow-hidden">
      <Image
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={`
          transition-all duration-1000 ease-in-out
          ${isLoaded ? 'blur-0' : 'blur-md scale-105'}
        `}
        priority={lowQualitySrc === currentSrc}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      )}
    </div>
  )
}
```

### 6. PWA Assets

**PWA (Progressive Web App)** là ứng dụng web có thể hoạt động như native app trên mobile device. **PWA Assets** bao gồm manifest file, icons, và các tài nguyên cần thiết để ứng dụng có thể cài đặt được.

#### 6.1 Manifest và Icons
**Web App Manifest** là file JSON chứa metadata về ứng dụng web, giúp browser hiểu cách hiển thị ứng dụng khi được cài đặt.
```json
// public/manifest.json
{
  "name": "Next.js PWA App",
  "short_name": "NextPWA",
  "description": "A Progressive Web App built with Next.js",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/icons/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Next.js PWA',
  },
}
```

#### 6.2 Service Worker với assets caching
```javascript
// public/sw.js
const CACHE_NAME = 'nextjs-pwa-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/images/logo.png',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      }
    )
  )
})

// Image caching strategy
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('images').then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response
          }
          return fetch(event.request).then((fetchResponse) => {
            cache.put(event.request, fetchResponse.clone())
            return fetchResponse
          })
        })
      })
    )
  }
})
```

### 7. Performance Monitoring

#### 7.1 Image loading analytics
```typescript
// app/utils/imageAnalytics.ts
interface ImageLoadMetrics {
  src: string
  loadTime: number
  size: {
    natural: { width: number; height: number }
    rendered: { width: number; height: number }
  }
  cached: boolean
}

class ImageAnalytics {
  private metrics: ImageLoadMetrics[] = []
  
  recordImageLoad(metrics: ImageLoadMetrics) {
    this.metrics.push(metrics)
    
    // Send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_load', {
        custom_parameter_src: metrics.src,
        custom_parameter_load_time: metrics.loadTime,
        custom_parameter_cached: metrics.cached,
      })
    }
  }
  
  getAverageLoadTime(): number {
    if (this.metrics.length === 0) return 0
    const totalTime = this.metrics.reduce((sum, metric) => sum + metric.loadTime, 0)
    return totalTime / this.metrics.length
  }
  
  getCacheHitRate(): number {
    if (this.metrics.length === 0) return 0
    const cachedCount = this.metrics.filter(metric => metric.cached).length
    return (cachedCount / this.metrics.length) * 100
  }
}

export const imageAnalytics = new ImageAnalytics()
```

```typescript
// app/components/AnalyticsImage.tsx
'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { imageAnalytics } from '@/utils/imageAnalytics'

interface AnalyticsImageProps {
  src: string
  alt: string
  width: number
  height: number
}

export default function AnalyticsImage({ src, alt, width, height }: AnalyticsImageProps) {
  const startTime = useRef<number>(0)
  const imageRef = useRef<HTMLImageElement>(null)
  
  const handleLoadStart = () => {
    startTime.current = performance.now()
  }
  
  const handleLoad = () => {
    const loadTime = performance.now() - startTime.current
    const image = imageRef.current
    
    if (image) {
      const metrics = {
        src,
        loadTime,
        size: {
          natural: {
            width: image.naturalWidth,
            height: image.naturalHeight,
          },
          rendered: {
            width: image.width,
            height: image.height,
          },
        },
        cached: loadTime < 50, // Assume cached if very fast
      }
      
      imageAnalytics.recordImageLoad(metrics)
    }
  }
  
  return (
    <Image
      ref={imageRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      onLoadStart={handleLoadStart}
      onLoad={handleLoad}
      className="w-full h-auto"
    />
  )
}
```

## 🏆 Bài tập thực hành

### Bài tập 1: Xây dựng Image Gallery với optimization

Tạo một image gallery với tất cả tính năng optimization:

```typescript
// app/types/gallery.ts
export interface GalleryImage {
  id: string
  src: string
  alt: string
  width: number
  height: number
  category: string
  tags: string[]
  photographer?: string
}

export interface GalleryCategory {
  id: string
  name: string
  description: string
}
```

```typescript
// app/lib/gallery.ts
import { GalleryImage, GalleryCategory } from '@/types/gallery'

export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  // Simulate API call
  const allImages: GalleryImage[] = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
      alt: 'Mountain landscape',
      width: 800,
      height: 600,
      category: 'nature',
      tags: ['mountain', 'landscape', 'scenic'],
      photographer: 'John Doe'
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
      alt: 'Forest path',
      width: 800,
      height: 600,
      category: 'nature',
      tags: ['forest', 'path', 'trees'],
      photographer: 'Jane Smith'
    },
    // Add more images...
  ]
  
  return category 
    ? allImages.filter(img => img.category === category)
    : allImages
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  return [
    { id: 'nature', name: 'Nature', description: 'Beautiful nature photography' },
    { id: 'urban', name: 'Urban', description: 'City and architecture photos' },
    { id: 'portrait', name: 'Portrait', description: 'People and portrait photography' },
  ]
}
```

```typescript
// app/components/GalleryImage.tsx
'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { GalleryImage } from '@/types/gallery'

interface GalleryImageProps {
  image: GalleryImage
  onImageLoad?: (loadTime: number) => void
}

export default function GalleryImageComponent({ image, onImageLoad }: GalleryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const startTime = useRef<number>(0)
  
  const handleLoadStart = () => {
    startTime.current = performance.now()
  }
  
  const handleLoad = () => {
    const loadTime = performance.now() - startTime.current
    setIsLoaded(true)
    onImageLoad?.(loadTime)
  }
  
  const handleError = () => {
    setHasError(true)
  }
  
  if (hasError) {
    return (
      <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">Failed to load image</span>
      </div>
    )
  }
  
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-video relative">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`
            object-cover transition-all duration-700 ease-in-out
            ${isLoaded 
              ? 'scale-100 blur-0 grayscale-0' 
              : 'scale-110 blur-2xl grayscale'
            }
            group-hover:scale-105
          `}
          onLoadingComplete={handleLoad}
          onLoadStart={handleLoadStart}
          onError={handleError}
          loading="lazy"
        />
      </div>
      
      {/* Image overlay with info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="font-semibold">{image.alt}</p>
          {image.photographer && (
            <p className="text-sm opacity-90">by {image.photographer}</p>
          )}
          <div className="flex flex-wrap gap-1 mt-2">
            {image.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-white/20 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  )
}
```

```typescript
// app/gallery/page.tsx
import { getGalleryImages, getGalleryCategories } from '@/lib/gallery'
import GalleryGrid from '@/components/GalleryGrid'
import CategoryFilter from '@/components/CategoryFilter'

interface Props {
  searchParams: { category?: string }
}

export default async function GalleryPage({ searchParams }: Props) {
  const [images, categories] = await Promise.all([
    getGalleryImages(searchParams.category),
    getGalleryCategories()
  ])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Image Gallery</h1>
      
      <CategoryFilter categories={categories} currentCategory={searchParams.category} />
      
      <GalleryGrid images={images} />
    </div>
  )
}

export const metadata = {
  title: 'Image Gallery - Optimized with Next.js',
  description: 'Browse our collection of high-quality optimized images',
}
```

```typescript
// app/components/GalleryGrid.tsx
'use client'

import { useState } from 'react'
import { GalleryImage } from '@/types/gallery'
import GalleryImageComponent from './GalleryImage'

interface GalleryGridProps {
  images: GalleryImage[]
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [loadTimes, setLoadTimes] = useState<number[]>([])
  
  const handleImageLoad = (loadTime: number) => {
    setLoadTimes(prev => [...prev, loadTime])
  }
  
  const averageLoadTime = loadTimes.length > 0 
    ? Math.round(loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length)
    : 0
  
  return (
    <div>
      {/* Performance stats */}
      {loadTimes.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900">Performance Stats</h3>
          <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
            <div>
              <span className="text-blue-700">Images loaded: </span>
              <span className="font-medium">{loadTimes.length}</span>
            </div>
            <div>
              <span className="text-blue-700">Avg load time: </span>
              <span className="font-medium">{averageLoadTime}ms</span>
            </div>
            <div>
              <span className="text-blue-700">Total images: </span>
              <span className="font-medium">{images.length}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Image grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map(image => (
          <GalleryImageComponent
            key={image.id}
            image={image}
            onImageLoad={handleImageLoad}
          />
        ))}
      </div>
    </div>
  )
}
```

### Bài tập 2: PWA với offline image caching

```typescript
// app/lib/imageCache.ts
class ImageCache {
  private cacheName = 'image-cache-v1'
  
  async cacheImage(url: string): Promise<void> {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheName)
      await cache.add(url)
    }
  }
  
  async getCachedImage(url: string): Promise<Response | undefined> {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheName)
      return cache.match(url)
    }
  }
  
  async preloadImages(urls: string[]): Promise<void> {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheName)
      await Promise.all(urls.map(url => cache.add(url)))
    }
  }
  
  async clearCache(): Promise<void> {
    if ('caches' in window) {
      await caches.delete(this.cacheName)
    }
  }
}

export const imageCache = new ImageCache()
```

```typescript
// app/components/OfflineGallery.tsx
'use client'

import { useEffect, useState } from 'react'
import { imageCache } from '@/lib/imageCache'
import Image from 'next/image'

interface OfflineGalleryProps {
  images: Array<{
    id: string
    src: string
    alt: string
    width: number
    height: number
  }>
}

export default function OfflineGallery({ images }: OfflineGalleryProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [cachedImages, setCachedImages] = useState<string[]>([])
  
  useEffect(() => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  useEffect(() => {
    // Preload images when online
    if (isOnline) {
      const imageSrcs = images.map(img => img.src)
      imageCache.preloadImages(imageSrcs)
      setCachedImages(imageSrcs)
    }
  }, [images, isOnline])
  
  return (
    <div>
      {/* Online/Offline indicator */}
      <div className={`
        mb-4 p-2 rounded-lg text-sm
        ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
      `}>
        {isOnline ? '🟢 Online' : '🔴 Offline'} 
        - {cachedImages.length} images cached
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map(image => (
          <div key={image.id} className="relative">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="w-full h-auto rounded-lg"
              onLoad={() => {
                if (isOnline) {
                  imageCache.cacheImage(image.src)
                }
              }}
            />
            
            {!isOnline && !cachedImages.includes(image.src) && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-500">Offline - Not Cached</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## 🔑 Điểm quan trọng cần nhớ

### Image Optimization
1. **Luôn sử dụng Next.js Image component** cho automatic optimization
2. **Cấu hình remotePatterns** cho external images
3. **Sử dụng appropriate sizes prop** cho responsive images
4. **Implement lazy loading** cho images không critical

### Performance Best Practices
1. **Priority loading** cho above-the-fold images
2. **Proper aspect ratios** để tránh layout shift
3. **Placeholder strategies** để improve UX
4. **Monitor image loading metrics**

### Font Optimization
1. **Use next/font** cho Google Fonts
2. **Implement font display strategies**
3. **Preload critical fonts**
4. **Use font-display: swap**

### PWA Assets
1. **Proper manifest configuration**
2. **Multiple icon sizes**
3. **Service worker caching strategies**
4. **Offline fallbacks**

## 📝 Bài tập về nhà

1. **Advanced Image Gallery**: Tạo gallery với:
   - Image zoom functionality
   - Infinite scroll
   - Advanced filtering và sorting
   - Performance analytics dashboard

2. **PWA Implementation**: Xây dựng PWA với:
   - Offline image caching
   - Background sync
   - Push notifications
   - App-like navigation

3. **Performance Optimization**: Optimize một existing website:
   - Audit image performance
   - Implement progressive loading
   - Add performance monitoring
   - Create optimization report

4. **Custom Image CDN**: Tạo custom image transformation service:
   - Dynamic resizing
   - Format conversion
   - Quality optimization
   - Caching strategies

---

*Post ID: 9d2afssukszim97*  
*Category: NextJS*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
