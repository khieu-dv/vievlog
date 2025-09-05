---
title: "Bài 13: Cấu hình và Thiết lập"
postId: "vw1smcwh2ar6yyv"
category: "NextJS"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 13: Cấu hình và Thiết lập


## 🎯 Mục tiêu học tập

Sau khi hoàn thành bài học này, bạn sẽ có thể:
- Cấu hình NextJS một cách toàn diện với next.config.js
- Quản lý environment variables và configuration
- Thiết lập TypeScript configuration tối ưu
- Cấu hình ESLint và Prettier cho code quality
- Triển khai Webpack customization và plugins
- Thiết lập development và production environments
- Cấu hình PWA và service workers
- Tối ưu hóa build process và bundle analysis

## 📝 Nội dung chi tiết

### 1. Next.js Configuration (next.config.js)

**Next.js Configuration** là hệ thống cho phép tùy chỉnh toàn diện cách thức hoạt động của Next.js thông qua file `next.config.js`. File cấu hình này đóng vai trò như bộ điều khiển trung tâm, cho phép developers:

- Điều chỉnh quá trình build và runtime behavior
- Cấu hình webpack customization và plugins
- Thiết lập environment-specific settings
- Tối ưu hóa performance, security và SEO
- Quản lý static assets và CDN integration

#### 1.1 Cấu hình cơ bản

**Các khái niệm cần hiểu trước khi cấu hình:**

- **reactStrictMode**: Chế độ nghiêm ngặt của React giúp phát hiện các vấn đề tiềm ẩn trong ứng dụng như deprecated APIs, side effects không mong muốn, và các anti-patterns
- **swcMinify**: SWC (Speedy Web Compiler) là compiler mới thay thế Terser, viết bằng Rust, giúp minify JavaScript nhanh hơn 20x
- **poweredByHeader**: Header "X-Powered-By: Next.js" mặc định, tắt để tăng security (không tiết lộ framework)
- **assetPrefix**: URL prefix cho static assets, thường dùng với CDN để tăng tốc độ tải trang
- **basePath**: Đường dẫn gốc khi deploy ứng dụng trong sub-directory (ví dụ: `/my-app`)
- **trailingSlash**: Quy định URL có dấu `/` cuối hay không (SEO và routing)

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configurations
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  
  // Output configuration
  output: 'standalone', // 'standalone' | 'export' | undefined
  distDir: '.next',
  generateBuildId: async () => {
    // Custom build ID for multi-instance deployments
    return process.env.BUILD_ID || 'build-' + Date.now()
  },
  
  // Asset prefix for CDN
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.example.com' 
    : '',
  
  // Base path for sub-directory deployment
  basePath: process.env.BASE_PATH || '',
  
  // Trailing slash configuration
  trailingSlash: false,
  
  // Experimental features
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['mongoose'],
    optimizePackageImports: ['lodash', 'date-fns'],
    typedRoutes: true,
  },
}

module.exports = nextConfig
```

#### 1.2 Advanced Configuration

**Advanced Configuration** bao gồm các tính năng nâng cao cho production environments. Trước khi thực hiện, cần hiểu các khái niệm sau:

**Runtime Configuration:**
- **env**: Server-side environment variables được expose ra client (cẩn thận với sensitive data)
- **publicRuntimeConfig**: Config có thể access từ cả client và server
- **serverRuntimeConfig**: Config chỉ accessible từ server-side (an toàn hơn cho secrets)

**URL Handling:**
- **Rewrites**: Thay đổi URL destination mà không thay đổi URL trong browser (internal routing)
- **Redirects**: Chuyển hướng user từ URL này sang URL khác (browser URL sẽ thay đổi)
- **Headers**: Thêm custom HTTP headers cho responses (security, CORS, caching)

**Image Optimization:**
- **deviceSizes**: Các kích thước device để tối ưu responsive images
- **imageSizes**: Kích thước cụ thể cho Next.js Image component
- **formats**: Định dạng hình ảnh hiện đại (WebP, AVIF) cho performance tốt hơn
- **remotePatterns**: Whitelist các domains được phép load external images

**Webpack Customization:**
- Cho phép customize webpack config để thêm loaders, plugins, aliases
- Hữu ích cho advanced use cases như custom SVG handling, bundle analysis

```javascript
// next.config.js
const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment-specific configurations
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    API_VERSION: 'v1',
  },
  
  // Public runtime config
  publicRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.production.com'
      : 'http://localhost:3001',
  },
  
  // Server runtime config (only available server-side)
  serverRuntimeConfig: {
    mySecret: 'secret-key',
    secondSecret: process.env.SECOND_SECRET,
  },
  
  // Image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Rewrites for API proxying
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.API_BASE_URL}/api/v1/:path*`,
      },
      {
        source: '/blog/:slug*',
        destination: '/posts/:slug*',
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
      {
        source: '/posts/:slug*',
        destination: '/blog/:slug*',
        permanent: false,
      },
    ]
  },
  
  // Headers configuration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },
  
  // Webpack customization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          generateStatsFile: true,
        })
      )
    }
    
    // Custom alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/styles': path.resolve(__dirname, 'styles'),
    }
    
    // Custom rules
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    
    // Ignore certain packages in client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    
    return config
  },
}

module.exports = nextConfig
```

### 2. Environment Variables Management

**Environment Variables** là các biến môi trường cho phép ứng dụng hoạt động khác nhau tùy theo môi trường (development, production, testing). Đây là phương pháp best practice để:

- Quản lý configuration không hard-code vào source code
- Bảo mật thông tin nhạy cảm (API keys, database URLs)
- Tách biệt config giữa các môi trường khác nhau
- Dễ dàng deploy ứng dụng trên nhiều servers khác nhau

#### 2.1 Environment Configuration

**Các loại Environment Files trong Next.js:**

- **.env.local**: File môi trường local, không được commit vào Git (chứa secrets)
- **.env.development**: Config cho development environment
- **.env.production**: Config cho production environment  
- **.env**: File mặc định với default values, được commit vào Git

**Quy tắc đặt tên và bảo mật:**
- **NEXT_PUBLIC_** prefix: Biến được expose ra client-side (public)
- **Không có prefix**: Chỉ accessible từ server-side (private/secure)
- **Thứ tự ưu tiên**: .env.local > .env.development/production > .env

```bash
# .env.local (local development - không commit)
DATABASE_URL=postgresql://localhost:5432/myapp_dev
JWT_SECRET=super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_...

# .env.development
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ANALYTICS_ID=dev-analytics-id
LOG_LEVEL=debug

# .env.production
NEXT_PUBLIC_API_URL=https://api.production.com
NEXT_PUBLIC_ANALYTICS_ID=prod-analytics-id
LOG_LEVEL=error

# .env (default values)
NEXT_PUBLIC_APP_NAME=My Next.js App
NEXT_PUBLIC_APP_VERSION=1.0.0
DATABASE_POOL_SIZE=10
```

#### 2.2 Environment Variables Validation

**Environment Variables Validation** là quá trình kiểm tra tính hợp lệ của các biến môi trường khi ứng dụng khởi động. Điều này quan trọng vì:

- **Fail Fast Principle**: Phát hiện lỗi config ngay từ đầu, không phải khi runtime
- **Type Safety**: Đảm bảo đúng kiểu dữ liệu (string, number, boolean, URL)
- **Required Validation**: Đảm bảo các biến bắt buộc không bị thiếu
- **Format Validation**: Kiểm tra định dạng (email, URL, JWT format)

**Zod Schema Validation** là thư viện mạnh mẽ cho việc validate và transform data với TypeScript. Nó cung cấp:
- Runtime validation với compile-time type inference
- Detailed error messages khi validation fails
- Automatic type conversion (string to number, boolean)
- Complex validation rules (min length, URL format, regex patterns)

```typescript
// lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  
  // Public variables (NEXT_PUBLIC_*)
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  
  // Server-only variables
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  EMAIL_SERVER_PASSWORD: z.string(),
  ADMIN_EMAIL: z.string().email(),
})

type Env = z.infer<typeof envSchema>

const parseEnv = (): Env => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:', error)
    process.exit(1)
  }
}

export const env = parseEnv()

// Type-safe environment access
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
```

```typescript
// lib/config.ts
import { env } from './env'

export const config = {
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    version: env.NEXT_PUBLIC_APP_VERSION,
    env: env.NODE_ENV,
  },
  
  api: {
    baseUrl: env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
  },
  
  database: {
    url: env.DATABASE_URL,
    poolSize: parseInt(env.DATABASE_POOL_SIZE || '10'),
  },
  
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiry: '7d',
  },
  
  analytics: {
    enabled: !!env.NEXT_PUBLIC_ANALYTICS_ID,
    id: env.NEXT_PUBLIC_ANALYTICS_ID,
  },
  
  features: {
    enableBetaFeatures: env.NODE_ENV === 'development',
    enableAnalytics: env.NODE_ENV === 'production',
    enableDebugMode: env.NODE_ENV === 'development',
  },
} as const

export type Config = typeof config
```

### 3. TypeScript Configuration

**TypeScript Configuration** là việc thiết lập TypeScript compiler để hoạt động tối ưu với Next.js. File `tsconfig.json` định nghĩa cách TypeScript compiler xử lý code và các tùy chọn type checking.

**Tại sao cần cấu hình TypeScript nâng cao:**
- **Type Safety**: Phát hiện lỗi tại compile time thay vì runtime
- **Developer Experience**: IntelliSense, auto-completion, refactoring tools
- **Code Quality**: Enforce coding standards và best practices
- **Performance**: Tối ưu compilation speed và bundle size

#### 3.1 Advanced tsconfig.json

**Các nhóm cấu hình quan trọng:**

**Compiler Options:**
- **target**: Phiên bản JavaScript đầu ra (ES2018, ES2020, ESNext)
- **lib**: Các library types được include (DOM, ES6, etc.)
- **strict**: Bật tất cả strict type checking options
- **moduleResolution**: Cách resolve modules (node, bundler)

**Path Mapping:**
- **baseUrl**: Thư mục gốc cho relative imports
- **paths**: Alias mapping để import ngắn gọn (@/components thay vì ../../components)

**Type Checking Strictness:**
- **noUnusedLocals**: Báo lỗi khi có biến local không sử dụng
- **noUnusedParameters**: Báo lỗi khi có parameters không sử dụng  
- **noImplicitReturns**: Đảm bảo tất cả code paths đều return value
- **exactOptionalPropertyTypes**: Strict checking cho optional properties

```json
{
  "compilerOptions": {
    "target": "es2018",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/styles/*": ["./styles/*"],
      "@/types/*": ["./types/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/utils/*": ["./utils/*"]
    },
    "types": ["next", "next/types/global"],
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "out",
    "dist"
  ]
}
```

#### 3.2 Custom Type Definitions

**Custom Type Definitions** là việc định nghĩa các types tùy chỉnh để mở rộng functionality của TypeScript cho dự án cụ thể. Điều này bao gồm:

**Global Type Augmentation:**
- **Window Interface**: Mở rộng đối tượng `window` để include custom properties (analytics, third-party scripts)
- **Process.env Interface**: Type safety cho environment variables
- **Module Augmentation**: Mở rộng types của existing modules (Next.js, libraries)

**Utility Types:**
- **Optional<T, K>**: Làm một số properties optional
- **RequiredBy<T, K>**: Làm một số properties required
- **Prettify<T>**: Flatten intersected types để dễ đọc

**Domain-Specific Types:**
- **API Response Types**: Chuẩn hóa format responses từ API
- **Database Model Types**: Types cho entities và relationships
- **Configuration Types**: Type-safe configuration objects

```typescript
// types/global.d.ts
export {}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      DATABASE_URL: string
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL: string
    }
  }
}

// Extend Next.js types
declare module 'next' {
  interface NextApiRequest {
    user?: {
      id: string
      email: string
      role: string
    }
  }
}

// Custom utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
```

```typescript
// types/api.ts
// API Response types
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  timestamp: string
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: any
  }
  success: false
  timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Database types
export interface BaseModel {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface User extends BaseModel {
  email: string
  name?: string
  role: 'user' | 'admin' | 'moderator'
  isActive: boolean
}

export interface Post extends BaseModel {
  title: string
  content: string
  slug: string
  published: boolean
  authorId: string
  author?: User
  tags: Tag[]
}

export interface Tag extends BaseModel {
  name: string
  slug: string
}
```

### 4. Code Quality Configuration

**Code Quality Configuration** là việc thiết lập các công cụ để đảm bảo code consistency, detect bugs, và enforce best practices trong dự án. Đây là foundation cho maintainable codebase.

**Tại sao Code Quality Tools quan trọng:**
- **Consistency**: Đảm bảo coding style thống nhất across team
- **Bug Prevention**: Phát hiện potential bugs trước khi production
- **Best Practices**: Enforce React/TypeScript best practices
- **Maintainability**: Code dễ đọc, dễ maintain và refactor

#### 4.1 ESLint Configuration

**ESLint** là static analysis tool để identify và fix problems trong JavaScript/TypeScript code. Nó hoạt động thông qua:

**Core Concepts:**
- **Rules**: Các quy tắc kiểm tra code (no-unused-vars, prefer-const)
- **Plugins**: Mở rộng ESLint với rules cho specific frameworks (React, TypeScript)
- **Extends**: Kế thừa configurations từ popular style guides
- **Parser**: Hiểu syntax của different languages (TypeScript, JSX)

**Rule Categories:**
- **TypeScript Rules**: Type-specific checks và best practices
- **Import Rules**: Manage imports order và organization
- **React Rules**: React-specific patterns và anti-patterns
- **Unused Imports**: Tự động remove unused imports

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // Import rules
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external', 
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    
    // Remove unused imports
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    
    // General rules
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'dist/',
    '*.config.js',
  ],
}
```

#### 4.2 Prettier Configuration

**Prettier** là opinionated code formatter giúp tự động format code theo một style nhất quán. Khác với ESLint tập trung vào code quality, Prettier chỉ quan tâm đến code formatting.

**Tại sao cần Prettier:**
- **Automatic Formatting**: Không cần tranh luận về spacing, indentation
- **Consistency**: Toàn bộ codebase có format giống nhau
- **Time Saving**: Không mất thời gian manually format code
- **Team Harmony**: Giảm code review conflicts về formatting

**Key Configuration Options:**
- **semi**: Có sử dụng semicolon hay không
- **singleQuote**: Single quotes vs double quotes
- **trailingComma**: Comma cuối trong objects/arrays
- **printWidth**: Độ dài dòng tối đa trước khi wrap
- **importOrder**: Thứ tự sắp xếp imports

```javascript
// .prettierrc.js
module.exports = {
  semi: false,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  quoteProps: 'as-needed',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  
  // Plugin configurations
  importOrder: [
    '^react$',
    '^next',
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
```

```json
// .prettierignore
node_modules/
.next/
out/
dist/
*.config.js
*.min.js
*.min.css
coverage/
public/
```

#### 4.3 Husky và lint-staged

**Git Hooks Automation** là cách tự động chạy code quality checks trước khi commit code. Điều này đảm bảo chỉ clean code được commit vào repository.

**Husky** là tool quản lý Git hooks một cách dễ dàng:
- **pre-commit**: Chạy checks trước khi commit
- **pre-push**: Chạy tests trước khi push
- **commit-msg**: Validate commit message format

**lint-staged** chỉ chạy linters trên staged files (files được git add):
- **Performance**: Không scan toàn bộ codebase, chỉ changed files
- **Focused**: Chỉ fix lỗi ở files đang được commit
- **Fast**: Significantly faster than full project linting

**Workflow Integration:**
1. Developer commits code
2. Husky triggers pre-commit hook  
3. lint-staged runs ESLint + Prettier on staged files
4. Type checking runs on entire project
5. Commit proceeds if all checks pass

```json
// package.json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,mdx,css,html,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

```bash
#!/usr/bin/env sh
# .husky/pre-commit
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
npm run type-check
```

### 5. Development Tools Configuration

**Development Tools Configuration** là việc thiết lập môi trường phát triển để tối ưu productivity và developer experience. Điều này bao gồm editor settings, extensions, và development scripts.

**Tại sao cần cấu hình Development Tools:**
- **Productivity**: Giảm thời gian setup và configuration
- **Consistency**: Đảm bảo team members có cùng experience  
- **Automation**: Tự động format, lint, type checking
- **Integration**: Seamless workflow giữa các tools

#### 5.1 VS Code Configuration

**VS Code Workspace Settings** cho phép customize editor behavior cho project cụ thể:

**Editor Behavior:**
- **formatOnSave**: Tự động format code khi save file
- **codeActionsOnSave**: Chạy ESLint fixes và organize imports khi save
- **defaultFormatter**: Chỉ định formatter mặc định (Prettier)

**TypeScript Integration:**
- **importModuleSpecifier**: Prefer relative imports vs absolute
- **path intellisense**: Auto-completion cho file paths

**Extension Recommendations:**
- **Tailwind CSS IntelliSense**: Auto-completion cho Tailwind classes
- **ESLint**: Real-time linting trong editor
- **Prettier**: Code formatting integration
- **Auto Rename Tag**: Automatically rename paired HTML/JSX tags

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-npm-scripts"
  ]
}
```

#### 5.2 Development Scripts

**Development Scripts** là các npm scripts tùy chỉnh để tự động hóa common development tasks. Chúng giúp standardize workflow và giảm manual commands.

**Categories of Scripts:**

**Development Scripts:**
- **dev**: Khởi động development server với hot reload
- **dev:debug**: Development mode với debugger attached
- **dev:turbo**: Sử dụng Turbopack (experimental fast bundler)

**Build Scripts:**
- **build**: Production build với optimizations
- **build:analyze**: Build với bundle analyzer để check bundle size
- **start**: Khởi động production server

**Quality Assurance Scripts:**
- **lint**: Run ESLint để check code quality
- **type-check**: Run TypeScript compiler để check types
- **test**: Run test suite với coverage

**Database Scripts:**
- **db:migrate**: Run database migrations
- **db:generate**: Generate TypeScript types từ schema
- **db:studio**: Mở database GUI

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "dev:debug": "NODE_OPTIONS='--inspect' next dev",
    "dev:turbo": "next dev --turbo",
    "build": "next build",
    "build:analyze": "ANALYZE=true next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio"
  }
}
```

### 6. Build Optimization

**Build Optimization** là quá trình tối ưu hóa ứng dụng cho production environment, tập trung vào performance, bundle size, và user experience.

**Tại sao Build Optimization quan trọng:**
- **Performance**: Faster page loads = better user experience
- **SEO**: Tốc độ tải trang ảnh hưởng đến search rankings
- **Cost**: Nhỏ bundle size = ít bandwidth = tiết kiệm hosting costs
- **Mobile**: Đặc biệt quan trọng cho mobile users với slow connections

#### 6.1 Bundle Analysis

**Bundle Analysis** là quá trình phân tích composition của JavaScript bundles để identify optimization opportunities.

**Bundle Analyzer Benefits:**
- **Size Visualization**: Xem exact size của từng module trong bundle
- **Dependency Analysis**: Identify thư viện nào đang chiếm nhiều space nhất
- **Code Splitting Opportunities**: Tìm code có thể tách ra separate chunks
- **Duplicate Detection**: Phát hiện duplicate dependencies

**Webpack Bundle Analyzer** cung cấp interactive treemap visualization:
- **Parsed Size**: Size sau khi minify và gzip
- **Stat Size**: Size trước optimization
- **Gzipped Size**: Size sau compression (closest to actual transfer size)

```javascript
// scripts/analyze-bundle.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: '../bundle-analyzer-report.html',
          openAnalyzer: false,
        })
      )
    }
    return config
  },
})
```

#### 6.2 Performance Monitoring

**Performance Monitoring** là hệ thống track và measure performance metrics của ứng dụng trong cả development và production environments.

**Tại sao cần Performance Monitoring:**
- **Regression Detection**: Phát hiện sớm khi performance giảm
- **Bottleneck Identification**: Tìm chính xác components/functions chậm
- **User Experience**: Quantify impact lên user experience
- **Optimization Guidance**: Data-driven decisions cho optimization efforts

**Performance Metrics:**
- **Component Render Time**: Thời gian render của từng component
- **Function Execution Time**: Timing cho expensive operations
- **Bundle Load Time**: Time to first meaningful paint
- **API Response Time**: Backend performance tracking

**Performance.now() API** cung cấp high-resolution timestamps:
- **Precision**: Microsecond-level accuracy
- **Monotonic**: Không bị ảnh hưởng bởi system clock adjustments  
- **Relative**: Measures elapsed time từ navigation start

```typescript
// lib/performance.ts
export class PerformanceMonitor {
  private static metrics: Map<string, number> = new Map()
  
  static startTimer(label: string): () => number {
    const start = performance.now()
    
    return (): number => {
      const duration = performance.now() - start
      this.metrics.set(label, duration)
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
      }
      
      return duration
    }
  }
  
  static getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics)
  }
  
  static clearMetrics(): void {
    this.metrics.clear()
  }
}

// Usage in components
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceWrapper(props: T) {
    const endTimer = PerformanceMonitor.startTimer(`${componentName} render`)
    
    React.useEffect(() => {
      endTimer()
    })
    
    return <Component {...props} />
  }
}
```

## 🏆 Bài tập thực hành

### Bài tập 1: Complete Project Configuration

Tạo một cấu hình NextJS hoàn chỉnh cho production:

```javascript
// next.config.js
const path = require('path')
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Security headers
  poweredByHeader: false,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
    ],
  },
  
  // Experimental features
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['mongoose', 'bcryptjs'],
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
  },
  
  // Environment configuration
  env: {
    BUILD_TIME: new Date().toISOString(),
    BUILD_TIMESTAMP: Date.now().toString(),
  },
  
  // API configuration
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.API_BASE_URL || 'http://localhost:8000'}/api/v1/:path*`,
      },
    ]
  },
  
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ]
  },
  
  // Webpack customization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Alias configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/styles': path.resolve(__dirname, 'styles'),
      '@/types': path.resolve(__dirname, 'types'),
      '@/hooks': path.resolve(__dirname, 'hooks'),
      '@/utils': path.resolve(__dirname, 'utils'),
    }
    
    // Bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          generateStatsFile: true,
        })
      )
    }
    
    // Custom loaders
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    
    // Optimize chunks
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }
    
    return config
  },
}

module.exports = withPWA(nextConfig)
```

### Bài tập 2: Environment-Specific Configuration System

```typescript
// lib/config/index.ts
import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  
  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_SIZE: z.coerce.number().default(10),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // External services
  STRIPE_PUBLIC_KEY: z.string().startsWith('pk_'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  SENDGRID_API_KEY: z.string().startsWith('SG.'),
  
  // Public environment variables
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  
  // Feature flags
  FEATURE_BETA_ENABLED: z.coerce.boolean().default(false),
  FEATURE_ANALYTICS_ENABLED: z.coerce.boolean().default(true),
})

type Environment = z.infer<typeof environmentSchema>

function validateEnvironment(): Environment {
  const parsed = environmentSchema.safeParse(process.env)
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment configuration')
  }
  
  return parsed.data
}

const env = validateEnvironment()

export const config = {
  app: {
    name: 'My Next.js App',
    version: process.env.npm_package_version || '1.0.0',
    environment: env.NODE_ENV,
    url: env.NEXT_PUBLIC_APP_URL,
  },
  
  database: {
    url: env.DATABASE_URL,
    poolSize: env.DATABASE_POOL_SIZE,
  },
  
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
  },
  
  stripe: {
    publicKey: env.STRIPE_PUBLIC_KEY,
    secretKey: env.STRIPE_SECRET_KEY,
  },
  
  email: {
    apiKey: env.SENDGRID_API_KEY,
  },
  
  monitoring: {
    sentryDsn: env.NEXT_PUBLIC_SENTRY_DSN,
    analyticsId: env.NEXT_PUBLIC_ANALYTICS_ID,
  },
  
  features: {
    betaEnabled: env.FEATURE_BETA_ENABLED,
    analyticsEnabled: env.FEATURE_ANALYTICS_ENABLED,
  },
  
  // Environment-specific configurations
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
} as const

export type Config = typeof config
```

```typescript
// lib/config/feature-flags.ts
import { config } from './index'

export class FeatureFlags {
  private static flags: Record<string, boolean> = {
    betaFeatures: config.features.betaEnabled,
    analytics: config.features.analyticsEnabled,
    newDashboard: config.isDevelopment,
    advancedSearch: true,
  }
  
  static isEnabled(flag: keyof typeof this.flags): boolean {
    return this.flags[flag] ?? false
  }
  
  static enable(flag: keyof typeof this.flags): void {
    this.flags[flag] = true
  }
  
  static disable(flag: keyof typeof this.flags): void {
    this.flags[flag] = false
  }
  
  static getAllFlags(): Record<string, boolean> {
    return { ...this.flags }
  }
}

// Hook for React components
export function useFeatureFlag(flag: keyof typeof FeatureFlags.flags) {
  return FeatureFlags.isEnabled(flag)
}
```

### Bài tập 3: Development Workflow Automation

```json
// package.json scripts section
{
  "scripts": {
    "dev": "next dev",
    "dev:https": "next dev --experimental-https",
    "dev:debug": "NODE_OPTIONS='--inspect' next dev",
    "build": "npm run type-check && next build",
    "build:analyze": "ANALYZE=true npm run build",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "validate": "npm run type-check && npm run lint && npm run format:check",
    "clean": "rm -rf .next out dist",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:studio": "prisma studio",
    "docker:build": "docker build -t my-nextjs-app .",
    "docker:run": "docker run -p 3000:3000 my-nextjs-app"
  }
}
```

```bash
# scripts/setup-dev.sh
#!/bin/bash

echo "🚀 Setting up development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Setup environment
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local from template..."
  cp .env.example .env.local
  echo "⚠️  Please update .env.local with your configuration"
fi

# Setup database
echo "🗄️ Setting up database..."
npm run db:migrate
npm run db:generate

# Setup Git hooks
echo "🔧 Setting up Git hooks..."
npm run prepare

# Type check
echo "🔍 Running type check..."
npm run type-check

# Run linting
echo "✨ Running linting..."
npm run lint

echo "✅ Development environment setup complete!"
echo "Run 'npm run dev' to start the development server"
```

```dockerfile
# Dockerfile.dev
FROM node:18-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=development

# Copy source code
COPY . .

# Development setup
RUN npm run db:generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

## 🔑 Điểm quan trọng cần nhớ

### Configuration Best Practices
1. **Environment validation** với schema validation (Zod)
2. **Proper secrets management** - không commit sensitive data
3. **Feature flags** cho controlled rollouts
4. **Type-safe configuration** với TypeScript

### Development Workflow
1. **Automated code quality checks** với ESLint + Prettier
2. **Git hooks** để enforce standards
3. **Bundle analysis** cho performance monitoring
4. **Docker integration** cho consistent environments

### Security Considerations
1. **Security headers** configuration
2. **Environment variable isolation**
3. **CORS policy** setup
4. **Content Security Policy** implementation

### Performance Optimization
1. **Bundle optimization** và code splitting
2. **Image optimization** configuration
3. **Caching strategies** setup
4. **Build process** optimization

## 📝 Bài tập về nhà

1. **Complete CI/CD Setup**: Tạo GitHub Actions workflow cho:
   - Automated testing
   - Code quality checks
   - Security scanning
   - Automated deployment

2. **Multi-Environment Configuration**: Thiết lập:
   - Development, staging, production environments
   - Environment-specific feature flags
   - Configuration management system
   - Secrets management strategy

3. **Performance Monitoring**: Implement:
   - Bundle size monitoring
   - Build time optimization
   - Runtime performance tracking
   - Error monitoring setup

4. **Docker Configuration**: Tạo:
   - Multi-stage Docker builds
   - Development và production containers
   - Docker Compose setup
   - Container optimization strategies

---

*Post ID: vw1smcwh2ar6yyv*  
*Category: NextJS*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
