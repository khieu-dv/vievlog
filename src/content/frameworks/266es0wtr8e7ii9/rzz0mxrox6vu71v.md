---
title: "Bài 19: SEO và Metadata"
postId: "rzz0mxrox6vu71v"
category: "NextJS"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 19: SEO và Metadata


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:
- Hiểu được tầm quan trọng của SEO trong phát triển web
- Nắm vững cách Next.js hỗ trợ SEO thông qua Metadata API
- Thiết lập metadata static và dynamic cho các trang
- Tối ưu hóa Open Graph và Twitter Cards
- Implement structured data với JSON-LD
- Tạo sitemap và robots.txt tự động
- Sử dụng Next.js Image cho SEO optimization
- Measure và monitor SEO performance
- Áp dụng SEO best practices cho Next.js applications

## 📝 Nội dung chi tiết

### 1. SEO là gì và tại sao quan trọng?

**SEO (Search Engine Optimization)** là quá trình tối ưu hóa trang web để cải thiện thứ hạng và độ hiển thị trên các công cụ tìm kiếm như Google, Bing. SEO quan trọng vì:

- **Increased Visibility**: Tăng khả năng hiển thị trên kết quả tìm kiếm
- **Organic Traffic**: Thu hút traffic tự nhiên không cần trả phí quảng cáo
- **User Experience**: Cải thiện trải nghiệm người dùng thông qua tối ưu hóa
- **Credibility**: Xây dựng độ tin cậy và uy tín cho website
- **ROI**: Mang lại lợi nhuận đầu tư cao trong dài hạn

### 2. Next.js Metadata API

**Metadata API** trong Next.js 13+ App Router cung cấp cách tiếp cận thống nhất để quản lý SEO metadata:

#### Static Metadata

```typescript
// app/layout.tsx - Root Layout Metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | My Website',
    default: 'My Website - Welcome',
  },
  description: 'My website description for SEO',
  keywords: ['Next.js', 'React', 'TypeScript', 'Web Development'],
  authors: [
    {
      name: 'Your Name',
      url: 'https://yourwebsite.com',
    },
  ],
  creator: 'Your Name',
  publisher: 'Your Company',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://yourwebsite.com',
    siteName: 'My Website',
    title: 'My Website - Welcome',
    description: 'My website description for social sharing',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My Website Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Website - Welcome',
    description: 'My website description for Twitter',
    creator: '@yourtwitterhandle',
    images: ['/twitter-image.jpg'],
  },
  verification: {
    google: 'google-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
  },
};
```

#### Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from 'next';
import { getBlogPost } from '@/lib/blog';

interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch data
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  // Optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author.name, url: post.author.url }],
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    category: post.category,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.featuredImage.url,
          width: post.featuredImage.width,
          height: post.featuredImage.height,
          alt: post.featuredImage.alt,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage.url],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### 3. Structured Data với JSON-LD

**Structured Data** giúp search engines hiểu nội dung trang web tốt hơn:

```typescript
// lib/structured-data.ts
export interface BlogPostStructuredData {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description: string;
  image: string[];
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

export function generateBlogPostStructuredData(
  post: BlogPost,
  baseUrl: string
): BlogPostStructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [post.featuredImage.url],
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Website',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  };
}
```

```tsx
// components/StructuredData.tsx
interface StructuredDataProps {
  data: Record<string, any>;
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
```

```tsx
// app/blog/[slug]/page.tsx
import StructuredData from '@/components/StructuredData';
import { generateBlogPostStructuredData } from '@/lib/structured-data';

export default async function BlogPost({ params }: Props) {
  const post = await getBlogPost(params.slug);
  const structuredData = generateBlogPostStructuredData(
    post, 
    process.env.NEXT_PUBLIC_BASE_URL!
  );

  return (
    <>
      <StructuredData data={structuredData} />
      <article>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}
```

### 4. Sitemap Generation

**Sitemap** là file XML chứa danh sách tất cả URLs của website, giúp search engines crawl hiệu quả hơn:

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { getAllProducts } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourwebsite.com';
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic blog posts
  const blogPosts = await getAllBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Dynamic products
  const products = await getAllProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes, ...productRoutes];
}
```

### 5. Robots.txt Configuration

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourwebsite.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/private/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/private/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
```

### 6. Image Optimization cho SEO

**Next.js Image component** tự động tối ưu hóa hình ảnh cho SEO và performance:

```tsx
// components/SEOImage.tsx
import Image from 'next/image';

interface SEOImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  priority?: boolean;
  className?: string;
}

export default function SEOImage({
  src,
  alt,
  width,
  height,
  title,
  priority = false,
  className,
}: SEOImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      title={title}
      priority={priority}
      className={className}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  );
}
```

### 7. SEO-friendly URLs và Navigation

```tsx
// components/Breadcrumbs.tsx
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            
            {item.current ? (
              <span 
                className="text-gray-600 font-medium"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### 8. Performance Metrics và Core Web Vitals

```typescript
// lib/analytics.ts
export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: any[];
}

export function sendToAnalytics(metric: WebVitalsMetric) {
  // Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      custom_parameter_value: Math.round(metric.value),
      custom_parameter_delta: Math.round(metric.delta),
      custom_parameter_id: metric.id,
    });
  }

  // Send to other analytics services
  console.log('Web Vitals:', metric);
}
```

```tsx
// app/layout.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { sendToAnalytics } from '@/lib/analytics';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  useReportWebVitals((metric) => {
    sendToAnalytics(metric);
  });

  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### 9. Internationalization (i18n) SEO

```typescript
// app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const locales = ['en', 'vi', 'ja'];

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!locales.includes(locale)) notFound();

  const translations = {
    en: {
      title: 'My Website - English',
      description: 'Welcome to my website in English',
    },
    vi: {
      title: 'Website của tôi - Tiếng Việt',
      description: 'Chào mừng đến với website của tôi',
    },
    ja: {
      title: '私のウェブサイト - 日本語',
      description: '私のウェブサイトへようこそ',
    },
  };

  const t = translations[locale as keyof typeof translations];

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `https://yourwebsite.com/${locale}`,
      languages: {
        en: 'https://yourwebsite.com/en',
        vi: 'https://yourwebsite.com/vi',
        ja: 'https://yourwebsite.com/ja',
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      locale: locale === 'vi' ? 'vi_VN' : locale === 'ja' ? 'ja_JP' : 'en_US',
    },
  };
}
```

### 10. SEO Monitoring và Analytics

```typescript
// lib/seo-utils.ts
export interface SEOMetrics {
  pageTitle: string;
  metaDescription: string;
  h1Count: number;
  h2Count: number;
  imageCount: number;
  imagesWithAlt: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  readingTime: number;
}

export function analyzeSEO(): SEOMetrics {
  if (typeof window === 'undefined') {
    return {} as SEOMetrics;
  }

  const pageTitle = document.title;
  const metaDescription = 
    document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  
  const h1Elements = document.querySelectorAll('h1');
  const h2Elements = document.querySelectorAll('h2');
  const images = document.querySelectorAll('img');
  const imagesWithAlt = document.querySelectorAll('img[alt]');
  
  const links = document.querySelectorAll('a[href]');
  const internalLinks = Array.from(links).filter(link => 
    link.getAttribute('href')?.startsWith('/') || 
    link.getAttribute('href')?.includes(window.location.hostname)
  );
  const externalLinks = Array.from(links).filter(link => 
    link.getAttribute('href')?.startsWith('http') && 
    !link.getAttribute('href')?.includes(window.location.hostname)
  );

  const textContent = document.body.textContent || '';
  const wordCount = textContent.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

  return {
    pageTitle,
    metaDescription,
    h1Count: h1Elements.length,
    h2Count: h2Elements.length,
    imageCount: images.length,
    imagesWithAlt: imagesWithAlt.length,
    internalLinks: internalLinks.length,
    externalLinks: externalLinks.length,
    wordCount,
    readingTime,
  };
}

export function getSEOScore(metrics: SEOMetrics): number {
  let score = 100;

  // Title length (50-60 characters is optimal)
  if (metrics.pageTitle.length < 30 || metrics.pageTitle.length > 60) {
    score -= 10;
  }

  // Meta description length (150-160 characters is optimal)
  if (metrics.metaDescription.length < 120 || metrics.metaDescription.length > 160) {
    score -= 10;
  }

  // Should have exactly one H1
  if (metrics.h1Count !== 1) {
    score -= 15;
  }

  // Should have H2 tags
  if (metrics.h2Count < 1) {
    score -= 10;
  }

  // Images should have alt text
  if (metrics.imageCount > 0) {
    const altPercentage = (metrics.imagesWithAlt / metrics.imageCount) * 100;
    if (altPercentage < 90) {
      score -= 15;
    }
  }

  // Content length (300+ words is good)
  if (metrics.wordCount < 300) {
    score -= 20;
  }

  return Math.max(0, score);
}
```

```tsx
// components/SEOReport.tsx
'use client';

import { useEffect, useState } from 'react';
import { analyzeSEO, getSEOScore, SEOMetrics } from '@/lib/seo-utils';

export default function SEOReport() {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const seoMetrics = analyzeSEO();
    const seoScore = getSEOScore(seoMetrics);
    
    setMetrics(seoMetrics);
    setScore(seoScore);
  }, []);

  if (!metrics) {
    return <div>Analyzing SEO...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">SEO Analysis</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">SEO Score</span>
          <span className={`font-bold ${
            score >= 80 ? 'text-green-600' : 
            score >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {score}/100
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              score >= 80 ? 'bg-green-600' : 
              score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Title Length:</span>
          <span className={`ml-2 ${
            metrics.pageTitle.length >= 30 && metrics.pageTitle.length <= 60 
              ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.pageTitle.length} chars
          </span>
        </div>
        
        <div>
          <span className="text-gray-600">Description Length:</span>
          <span className={`ml-2 ${
            metrics.metaDescription.length >= 120 && metrics.metaDescription.length <= 160 
              ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.metaDescription.length} chars
          </span>
        </div>
        
        <div>
          <span className="text-gray-600">H1 Tags:</span>
          <span className={`ml-2 ${
            metrics.h1Count === 1 ? 'text-green-600' : 'text-red-600'
          }`}>
            {metrics.h1Count}
          </span>
        </div>
        
        <div>
          <span className="text-gray-600">H2 Tags:</span>
          <span className="ml-2">{metrics.h2Count}</span>
        </div>
        
        <div>
          <span className="text-gray-600">Images with Alt:</span>
          <span className={`ml-2 ${
            metrics.imageCount === metrics.imagesWithAlt 
              ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {metrics.imagesWithAlt}/{metrics.imageCount}
          </span>
        </div>
        
        <div>
          <span className="text-gray-600">Word Count:</span>
          <span className={`ml-2 ${
            metrics.wordCount >= 300 ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {metrics.wordCount} words
          </span>
        </div>
      </div>
    </div>
  );
}
```

## 🏆 Bài tập thực hành

### Đề bài: Tối ưu SEO cho Blog Website

Tạo một blog website với đầy đủ SEO optimization:

1. **Metadata Management**: Dynamic metadata cho blog posts
2. **Structured Data**: JSON-LD cho articles và breadcrumbs  
3. **Sitemap Generation**: Auto-generated sitemap cho posts
4. **Image Optimization**: SEO-friendly images với proper alt text
5. **Performance**: Core Web Vitals optimization

**Requirements:**
- Next.js App Router với TypeScript
- Dynamic routes cho blog posts
- Breadcrumb navigation
- Social sharing optimization
- Mobile-friendly responsive design

### Lời giải chi tiết:

**Bước 1**: Project structure

```bash
blog-seo-app/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
├── components/
│   ├── Breadcrumbs.tsx
│   ├── SEOImage.tsx
│   └── StructuredData.tsx
├── lib/
│   ├── blog.ts
│   └── seo-utils.ts
└── types/
    └── blog.ts
```

**Bước 2**: Blog data types

```typescript
// types/blog.ts
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  author: {
    name: string;
    url: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
  postCount: number;
}
```

**Bước 3**: Blog service

```typescript
// lib/blog.ts
import { BlogPost, BlogCategory } from '@/types/blog';

// Mock data - trong thực tế sẽ fetch từ CMS hoặc database
const mockPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'getting-started-with-nextjs',
    title: 'Getting Started with Next.js: A Complete Guide',
    excerpt: 'Learn how to build modern web applications with Next.js, from setup to deployment.',
    content: '<p>Next.js is a powerful React framework...</p>',
    featuredImage: {
      url: '/images/blog/nextjs-guide.jpg',
      width: 1200,
      height: 630,
      alt: 'Next.js logo and code editor',
    },
    author: {
      name: 'John Doe',
      url: 'https://johndoe.com',
      avatar: '/images/authors/john-doe.jpg',
    },
    category: 'Web Development',
    tags: ['Next.js', 'React', 'JavaScript', 'Tutorial'],
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    readingTime: 8,
  },
  {
    id: '2',
    slug: 'seo-optimization-tips',
    title: 'SEO Optimization Tips for Modern Websites',
    excerpt: 'Discover the best practices for SEO optimization in 2024.',
    content: '<p>SEO is crucial for website visibility...</p>',
    featuredImage: {
      url: '/images/blog/seo-tips.jpg',
      width: 1200,
      height: 630,
      alt: 'SEO analytics dashboard',
    },
    author: {
      name: 'Jane Smith',
      url: 'https://janesmith.com',
      avatar: '/images/authors/jane-smith.jpg',
    },
    category: 'SEO',
    tags: ['SEO', 'Marketing', 'Web Development'],
    publishedAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
    readingTime: 6,
  },
];

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockPosts.find(post => post.slug === slug) || null;
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const posts = await getAllBlogPosts();
  const categoryMap = new Map<string, number>();
  
  posts.forEach(post => {
    categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
  });
  
  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    description: `All posts about ${name}`,
    postCount: count,
  }));
}
```

**Bước 4**: Dynamic metadata cho blog post

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getBlogPost, getAllBlogPosts } from '@/lib/blog';
import Breadcrumbs from '@/components/Breadcrumbs';
import StructuredData from '@/components/StructuredData';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourblog.com';
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | Your Blog`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author.name, url: post.author.url }],
    category: post.category,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: 'Your Blog',
      images: [
        {
          url: post.featuredImage.url,
          width: post.featuredImage.width,
          height: post.featuredImage.height,
          alt: post.featuredImage.alt,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      section: post.category,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage.url],
      creator: '@yourblog',
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourblog.com';
  
  // Structured data for the blog post
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [post.featuredImage.url],
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Your Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    wordCount: post.content.replace(/<[^>]*>/g, '').split(' ').length,
    timeRequired: `PT${post.readingTime}M`,
    articleSection: post.category,
    keywords: post.tags.join(', '),
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}`, current: true },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <StructuredData data={structuredData} />
      
      <Breadcrumbs items={breadcrumbItems} />

      <article className="prose prose-lg max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center space-x-4 text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <Image
                src={post.author.avatar}
                alt={`${post.author.name} avatar`}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>{post.author.name}</span>
            </div>
            
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            
            <span>{post.readingTime} min read</span>
          </div>
          
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mr-2">
              {post.category}
            </span>
            {post.tags.map(tag => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
          </div>

          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt}
            width={post.featuredImage.width}
            height={post.featuredImage.height}
            priority
            className="w-full rounded-lg mb-8"
          />
        </header>

        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
```

**Bước 5**: Blog listing page

```tsx
// app/blog/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts } from '@/lib/blog';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Blog | Your Website',
  description: 'Read our latest articles about web development, SEO, and digital marketing.',
  openGraph: {
    title: 'Blog | Your Website',
    description: 'Read our latest articles about web development, SEO, and digital marketing.',
    url: 'https://yourblog.com/blog',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();
  
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog', current: true },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600">
          Discover the latest insights in web development, SEO, and digital marketing
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <article
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/blog/${post.slug}`}>
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.alt}
                width={post.featuredImage.width}
                height={post.featuredImage.height}
                className="w-full h-48 object-cover"
              />
            </Link>
            
            <div className="p-6">
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                  {post.category}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold mb-3">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.author.name}</span>
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

**Giải thích logic:**
1. **Dynamic Metadata**: Tạo metadata unique cho mỗi blog post
2. **Structured Data**: JSON-LD cung cấp thông tin chi tiết cho search engines
3. **Breadcrumb Navigation**: Giúp user và search engines hiểu structure
4. **Image Optimization**: Next.js Image với proper alt text
5. **Performance**: Static generation cho SEO và loading speed

## 🔑 Những điểm quan trọng cần lưu ý

1. **Title Tags**: Unique, descriptive, 50-60 characters
2. **Meta Descriptions**: Compelling, 150-160 characters, call-to-action
3. **Header Structure**: Single H1, logical H2-H6 hierarchy
4. **Image Alt Text**: Descriptive, keyword-relevant nhưng tự nhiên
5. **Internal Linking**: Logical, contextual, helps crawling
6. **Page Speed**: Core Web Vitals impact rankings
7. **Mobile-First**: Responsive design is ranking factor
8. **Structured Data**: Helps search engines understand content
9. **URL Structure**: Clean, descriptive, keyword-friendly
10. **Content Quality**: Original, valuable, user-focused content

## 📝 Bài tập về nhà

Tạo một E-commerce website với comprehensive SEO strategy:

1. **Product Pages SEO:**
   - Dynamic metadata cho từng product
   - Product structured data (Schema.org)
   - Rich snippets với ratings, price, availability
   - Image gallery với proper alt text

2. **Category & Listing Pages:**
   - SEO-friendly category URLs
   - Pagination với proper rel="next/prev"
   - Filtering without losing SEO value
   - Breadcrumb navigation

3. **Advanced Features:**
   - Multi-language SEO với hreflang
   - Local SEO với business schema
   - FAQ schema for product questions
   - Review/rating aggregation

4. **Technical Requirements:**
   - Core Web Vitals optimization
   - Progressive Web App features
   - Accessibility compliance (WCAG 2.1)
   - Security headers và HTTPS

**Bonus challenges:**
- Implement AMP pages cho mobile
- Voice search optimization
- Featured snippets optimization
- Local business schema markup

---

*Post ID: rzz0mxrox6vu71v*  
*Category: NextJS*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
