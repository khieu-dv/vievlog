# Bài 17: Triển khai (Deployment)


## 🎯 Mục tiêu học tập

Sau khi hoàn thành bài học này, bạn sẽ có thể:
- Hiểu các phương pháp deployment NextJS khác nhau
- Triển khai ứng dụng lên Vercel với automatic deployment
- Deploy NextJS lên các cloud platforms (AWS, Google Cloud, Azure)
- Cấu hình CI/CD pipelines cho automated deployment
- Optimize build performance và static exports
- Implement environment-specific configurations
- Monitor và troubleshoot production deployments
- Setup custom domains và SSL certificates

## 📝 Nội dung chi tiết

### 1. Giới thiệu về Deployment

**Deployment (triển khai)** là quá trình đưa ứng dụng từ môi trường development lên production server để người dùng cuối có thể truy cập. Trong NextJS, có nhiều cách deployment khác nhau:

- **Static Export**: Tạo các file HTML/CSS/JS tĩnh
- **Server-side Rendering**: Chạy Node.js server
- **Serverless Deployment**: Chạy trên serverless functions
- **Edge Deployment**: Deploy gần người dùng với edge computing

**Build process** là bước biên dịch và tối ưu code từ development sang production. NextJS build process bao gồm:
- Code compilation và minification
- Static asset optimization
- Bundle splitting và tree shaking
- Route pre-rendering (SSG)

### 2. Vercel Deployment

#### 2.1 Automatic Deployment với Git Integration

**Vercel** là platform được tạo bởi team NextJS, cung cấp deployment tự động và tối ưu cho NextJS apps. **Git Integration** cho phép deploy tự động mỗi khi push code lên repository.

```bash
# Cài đặt Vercel CLI
npm install -g vercel

# Login vào Vercel
vercel login

# Deploy dự án lần đầu
vercel

# Deploy với custom domain
vercel --prod
```

```json
# vercel.json - Configuration file
{
  "version": 2,
  "name": "my-nextjs-app",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://api.production.com"
    }
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1", "hkg1"],
  "cleanUrls": true,
  "trailingSlash": false
}
```

#### 2.2 Environment Variables Management

**Environment variables** là các biến cấu hình được set ở runtime, cho phép app hoạt động khác nhau ở các môi trường khác nhau mà không cần thay đổi code.

```bash
# .env.production - Production environment variables
DATABASE_URL=postgresql://prod-db-url
JWT_SECRET=super-secure-production-key
STRIPE_SECRET_KEY=sk_live_...

# .env.preview - Preview environment variables  
DATABASE_URL=postgresql://staging-db-url
JWT_SECRET=staging-jwt-key
STRIPE_SECRET_KEY=sk_test_...
```

```javascript
// next.config.js - Environment-specific configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Different configs per environment
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: true,
    },
    experimental: {
      optimizeCss: true,
    },
  }),
  
  // Asset prefix for CDN in production
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.example.com' 
    : '',
    
  // Different image domains per environment
  images: {
    domains: process.env.NODE_ENV === 'production'
      ? ['prod-images.example.com']
      : ['dev-images.example.com'],
  },
}

module.exports = nextConfig
```

#### 2.3 Preview Deployments

**Preview deployments** là các deployment tự động được tạo cho mỗi pull request, cho phép test changes trước khi merge vào main branch.

```yaml
# .github/workflows/preview.yml
name: Preview Deployment
on:
  pull_request:
    branches: [main]

jobs:
  deploy-preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test
        
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.PREVIEW_API_URL }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          scope: ${{ secrets.TEAM_ID }}
```

### 3. Docker Deployment

#### 3.1 Docker Configuration

**Docker** là platform containerization cho phép đóng gói ứng dụng cùng với dependencies thành container có thể chạy trên bất kỳ môi trường nào. **Containerization** giúp đảm bảo ứng dụng chạy consistent across environments.

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  nextjs-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
    networks:
      - app-network
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - nextjs-app
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

#### 3.2 Multi-stage Build Optimization

**Multi-stage build** là kỹ thuật Docker cho phép sử dụng multiple FROM statements để tạo các stage khác nhau, giúp optimize final image size.

```dockerfile
# Multi-stage Dockerfile with optimizations
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build && npm run export

FROM nginx:alpine AS runner

# Copy built static files
COPY --from=builder /app/out /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 4. Cloud Platform Deployment

#### 4.1 AWS Deployment với Amplify

**AWS Amplify** là service của Amazon Web Services cung cấp full-stack deployment và hosting cho web applications. **Continuous Deployment** tự động deploy khi có changes trong repository.

```yaml
# amplify.yml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
          - .next/cache/**/*
    appRoot: /
    
    # Environment variables
    environmentVariables:
      - name: NEXT_PUBLIC_API_URL
        value: https://api.example.com
      - name: NODE_ENV
        value: production

# Custom headers and redirects
customHeaders:
  - pattern: '**/*'
    headers:
      - key: 'X-Frame-Options'
        value: 'DENY'
      - key: 'X-XSS-Protection'
        value: '1; mode=block'
      - key: 'Strict-Transport-Security'
        value: 'max-age=31536000; includeSubDomains'

redirects:
  - source: '/old-page'
    target: '/new-page'
    status: '301'
  - source: '/<*>'
    target: '/index.html'
    status: '404-200'
```

#### 4.2 Google Cloud Platform với Cloud Run

**Google Cloud Run** là serverless container platform cho phép deploy containerized applications. **Serverless** có nghĩa là không cần quản lý servers, platform tự động scale và chỉ charge khi có requests.

```yaml
# cloudbuild.yaml - Google Cloud Build configuration
steps:
  # Build Docker image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/nextjs-app:$COMMIT_SHA', '.']
  
  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/nextjs-app:$COMMIT_SHA']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'nextjs-app'
      - '--image=gcr.io/$PROJECT_ID/nextjs-app:$COMMIT_SHA'
      - '--platform=managed'
      - '--region=us-central1'
      - '--allow-unauthenticated'
      - '--memory=512Mi'
      - '--cpu=1'
      - '--concurrency=80'
      - '--max-instances=10'
      - '--set-env-vars=NODE_ENV=production'

# Cloud Run service configuration
# service.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: nextjs-app
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/execution-environment: gen2
        autoscaling.knative.dev/maxScale: "10"
        autoscaling.knative.dev/minScale: "0"
    spec:
      containerConcurrency: 80
      containers:
      - image: gcr.io/PROJECT_ID/nextjs-app
        ports:
        - containerPort: 3000
        resources:
          limits:
            cpu: "1"
            memory: "512Mi"
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: url
```

#### 4.3 Azure Deployment với Container Instances

**Azure Container Instances** là service cho phép chạy containers mà không cần quản lý virtual machines. **Infrastructure as Code** sử dụng ARM templates hoặc Terraform để define infrastructure.

```json
// azure-deploy.json - ARM Template
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "containerGroupName": {
      "type": "string",
      "defaultValue": "nextjs-app-group"
    },
    "containerName": {
      "type": "string", 
      "defaultValue": "nextjs-app"
    },
    "image": {
      "type": "string",
      "defaultValue": "myregistry.azurecr.io/nextjs-app:latest"
    }
  },
  "resources": [
    {
      "type": "Microsoft.ContainerInstance/containerGroups",
      "apiVersion": "2021-03-01",
      "name": "[parameters('containerGroupName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "containers": [
          {
            "name": "[parameters('containerName')]",
            "properties": {
              "image": "[parameters('image')]",
              "ports": [
                {
                  "port": 3000,
                  "protocol": "TCP"
                }
              ],
              "environmentVariables": [
                {
                  "name": "NODE_ENV",
                  "value": "production"
                },
                {
                  "name": "PORT",
                  "value": "3000"
                }
              ],
              "resources": {
                "requests": {
                  "cpu": 1,
                  "memoryInGB": 1
                }
              }
            }
          }
        ],
        "osType": "Linux",
        "ipAddress": {
          "type": "Public",
          "ports": [
            {
              "port": 3000,
              "protocol": "TCP"
            }
          ]
        },
        "restartPolicy": "Always"
      }
    }
  ]
}
```

### 5. CI/CD Pipelines

#### 5.1 GitHub Actions Workflow

**CI/CD (Continuous Integration/Continuous Deployment)** là phương pháp tự động hóa việc build, test, và deploy code. **GitHub Actions** là CI/CD platform tích hợp sẵn trong GitHub.

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm run test -- --coverage
        env:
          NODE_ENV: test

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    outputs:
      image: ${{ steps.image.outputs.image }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - id: image
        run: echo "image=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}" >> $GITHUB_OUTPUT

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref != 'refs/heads/main'
    environment: staging

    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying ${{ needs.build.outputs.image }} to staging"
          # Add your staging deployment commands here

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying ${{ needs.build.outputs.image }} to production"
          # Add your production deployment commands here

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### 5.2 Advanced Deployment Strategies

**Blue-Green Deployment** là strategy deploy hai environments giống hệt nhau (blue và green), switch traffic giữa chúng để zero-downtime deployment.

```yaml
# .github/workflows/blue-green-deploy.yml
name: Blue-Green Deployment

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment (blue/green)'
        required: true
        type: choice
        options:
          - blue
          - green

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to ${{ inputs.environment }}
        run: |
          # Deploy to the specified environment
          echo "Deploying to ${{ inputs.environment }} environment"
          
          # Health check
          echo "Running health checks..."
          curl -f "https://${{ inputs.environment }}.example.com/health" || exit 1
          
          # Switch traffic if health checks pass
          if [ "${{ inputs.environment }}" == "blue" ]; then
            echo "Switching traffic to blue environment"
            # Update load balancer to point to blue
          else
            echo "Switching traffic to green environment" 
            # Update load balancer to point to green
          fi

      - name: Rollback on failure
        if: failure()
        run: |
          echo "Deployment failed, initiating rollback"
          # Rollback logic here
```

### 6. Performance Monitoring

#### 6.1 Monitoring Setup

**Application Performance Monitoring (APM)** theo dõi hiệu suất ứng dụng trong production để detect issues và optimize performance.

```typescript
// lib/monitoring.ts
import { NextRequest, NextResponse } from 'next/server'

interface MetricData {
  name: string
  value: number
  timestamp: number
  labels?: Record<string, string>
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: MetricData[] = []

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor()
    }
    return this.instance
  }

  recordMetric(name: string, value: number, labels?: Record<string, string>) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
      labels,
    })

    // Send to monitoring service
    this.sendToMonitoringService({
      name,
      value,
      timestamp: Date.now(),
      labels,
    })
  }

  private async sendToMonitoringService(metric: MetricData) {
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      })
    } catch (error) {
      console.error('Failed to send metric:', error)
    }
  }

  // Middleware to monitor API performance
  static withMonitoring(handler: Function) {
    return async function(request: NextRequest, ...args: any[]) {
      const start = Date.now()
      const monitor = PerformanceMonitor.getInstance()
      
      try {
        const response = await handler(request, ...args)
        const duration = Date.now() - start
        
        monitor.recordMetric('api_request_duration', duration, {
          path: request.nextUrl.pathname,
          method: request.method,
          status: response.status?.toString() || '200',
        })
        
        return response
      } catch (error) {
        const duration = Date.now() - start
        
        monitor.recordMetric('api_request_duration', duration, {
          path: request.nextUrl.pathname,
          method: request.method,
          status: '500',
          error: error.message,
        })
        
        throw error
      }
    }
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
```

#### 6.2 Health Checks và Uptime Monitoring

**Health checks** là endpoints để check trạng thái ứng dụng. **Uptime monitoring** theo dõi availability của ứng dụng.

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface HealthStatus {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  checks: {
    database: 'up' | 'down'
    redis: 'up' | 'down'
    external_api: 'up' | 'down'
  }
  version: string
  uptime: number
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const startTime = process.hrtime()

  const checks = {
    database: 'down' as const,
    redis: 'down' as const,
    external_api: 'down' as const,
  }

  // Database health check
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = 'up'
  } catch (error) {
    console.error('Database health check failed:', error)
  }

  // Redis health check
  try {
    // const redis = new Redis(process.env.REDIS_URL)
    // await redis.ping()
    checks.redis = 'up'
  } catch (error) {
    console.error('Redis health check failed:', error)
  }

  // External API health check
  try {
    const response = await fetch('https://api.external-service.com/health', {
      method: 'HEAD',
      timeout: 5000,
    })
    if (response.ok) {
      checks.external_api = 'up'
    }
  } catch (error) {
    console.error('External API health check failed:', error)
  }

  const allHealthy = Object.values(checks).every(status => status === 'up')
  const [seconds, nanoseconds] = process.hrtime(startTime)
  const responseTime = seconds * 1000 + nanoseconds / 1000000

  const healthStatus: HealthStatus = {
    status: allHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks,
    version: process.env.npm_package_version || 'unknown',
    uptime: process.uptime(),
  }

  return NextResponse.json(healthStatus, {
    status: allHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Response-Time': `${responseTime.toFixed(2)}ms`,
    },
  })
}
```

## 🏆 Bài tập thực hành

### Bài tập 1: Complete CI/CD Pipeline

Tạo một CI/CD pipeline hoàn chỉnh với multiple environments:

```yaml
# .github/workflows/complete-pipeline.yml
name: Complete CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  DOCKER_REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
        
      - name: Run ESLint
        run: npm run lint
        
      - name: Run TypeScript check
        run: npm run type-check
        
      - name: Run Prettier check
        run: npm run format:check
        
      - name: Run tests with coverage
        run: npm run test:coverage
        
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run npm audit
        run: npm audit --audit-level high
        
      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  build-and-test:
    needs: [code-quality, security-scan]
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        environment: [development, staging, production]
        
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: ${{ matrix.environment }}
          NEXT_PUBLIC_API_URL: ${{ secrets[format('API_URL_{0}', matrix.environment)] }}
          
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000

  docker-build:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    outputs:
      image: ${{ steps.image.outputs.image }}
      digest: ${{ steps.build.outputs.digest }}
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2
        
      - name: Login to Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.DOCKER_REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.DOCKER_REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}
            
      - name: Build and push
        id: build
        uses: docker/build-push-action@v4
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          
      - id: image
        run: echo "image=${{ env.DOCKER_REGISTRY }}/${{ env.IMAGE_NAME }}@${{ steps.build.outputs.digest }}" >> $GITHUB_OUTPUT

  deploy-staging:
    needs: docker-build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying ${{ needs.docker-build.outputs.image }} to staging"
          # Kubernetes deployment
          kubectl set image deployment/nextjs-app nextjs-app=${{ needs.docker-build.outputs.image }} -n staging
          kubectl rollout status deployment/nextjs-app -n staging
          
      - name: Run smoke tests
        run: |
          curl -f https://staging.example.com/api/health
          npm run test:smoke -- --baseUrl=https://staging.example.com

  deploy-production:
    needs: docker-build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying ${{ needs.docker-build.outputs.image }} to production"
          # Blue-green deployment
          kubectl set image deployment/nextjs-app-green nextjs-app=${{ needs.docker-build.outputs.image }} -n production
          kubectl rollout status deployment/nextjs-app-green -n production
          
          # Health check
          curl -f https://green.example.com/api/health
          
          # Switch traffic
          kubectl patch service nextjs-app-service -p '{"spec":{"selector":{"version":"green"}}}' -n production
          
      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Bài tập 2: Multi-Cloud Deployment Strategy

```terraform
# terraform/main.tf - Infrastructure as Code
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

# AWS Provider
provider "aws" {
  region = var.aws_region
}

# Google Cloud Provider
provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# Azure Provider
provider "azurerm" {
  features {}
}

# AWS ECS Deployment
resource "aws_ecs_cluster" "nextjs_cluster" {
  name = "nextjs-app-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_service" "nextjs_service" {
  name            = "nextjs-app-service"
  cluster         = aws_ecs_cluster.nextjs_cluster.id
  task_definition = aws_ecs_task_definition.nextjs_task.arn
  desired_count   = var.desired_count

  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 50
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.nextjs_tg.arn
    container_name   = "nextjs-app"
    container_port   = 3000
  }
}

# Google Cloud Run Deployment
resource "google_cloud_run_service" "nextjs_service" {
  name     = "nextjs-app-service"
  location = var.gcp_region

  template {
    spec {
      containers {
        image = var.docker_image

        ports {
          container_port = 3000
        }

        env {
          name  = "NODE_ENV"
          value = "production"
        }

        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
        }
      }

      container_concurrency = 80
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "10"
        "autoscaling.knative.dev/minScale" = "0"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Azure Container Instances Deployment
resource "azurerm_container_group" "nextjs_container" {
  name                = "nextjs-app-container"
  location           = var.azure_location
  resource_group_name = var.azure_resource_group
  ip_address_type    = "Public"
  dns_name_label     = "nextjs-app"
  os_type            = "Linux"

  container {
    name   = "nextjs-app"
    image  = var.docker_image
    cpu    = "1"
    memory = "1"

    ports {
      port     = 3000
      protocol = "TCP"
    }

    environment_variables = {
      NODE_ENV = "production"
    }

    secure_environment_variables = {
      DATABASE_URL = var.database_url
      JWT_SECRET   = var.jwt_secret
    }
  }

  restart_policy = "Always"
}
```

## 🔑 Điểm quan trọng cần nhớ

### Deployment Strategies
1. **Static Export** cho sites không có server-side features
2. **Server-side Rendering** cho dynamic content
3. **Serverless Deployment** cho auto-scaling và cost efficiency
4. **Container Deployment** cho consistency và portability

### CI/CD Best Practices
1. **Automated testing** ở mọi stage của pipeline
2. **Environment parity** giữa dev, staging, và production
3. **Blue-green deployment** cho zero-downtime releases
4. **Rollback strategies** khi có issues

### Monitoring và Maintenance
1. **Health checks** để monitor application status
2. **Performance monitoring** để track metrics
3. **Error tracking** để detect và fix issues
4. **Log aggregation** để troubleshooting

### Security Considerations
1. **Environment variables** để store sensitive data
2. **Security scanning** trong CI/CD pipeline
3. **Container security** với proper base images
4. **Network security** với proper firewall rules

## 📝 Bài tập về nhà

1. **Advanced Deployment Pipeline**: Tạo pipeline với:
   - Multi-environment deployments
   - Canary releases
   - Automated rollbacks
   - Performance testing integration

2. **Infrastructure Automation**: Implement:
   - Terraform infrastructure as code
   - Auto-scaling configurations
   - Disaster recovery setup
   - Cost optimization strategies

3. **Monitoring Dashboard**: Xây dựng:
   - Real-time performance metrics
   - Error tracking và alerting
   - Business metrics tracking
   - SLA monitoring

4. **Multi-Cloud Strategy**: Thiết kế:
   - Load balancing across regions
   - Failover mechanisms
   - Data synchronization
   - Cost comparison analysis
