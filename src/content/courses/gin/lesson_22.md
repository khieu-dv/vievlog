
# Bài 22: Deployment và Production Best Practices

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu được các bước chuẩn bị cấu hình cho môi trường production khi triển khai ứng dụng Golang Gin.
* Nắm rõ cách xây dựng Dockerfile chuẩn để container hóa ứng dụng.
* Biết cách thiết lập Load Balancer để tối ưu phân phối tải.
* Hiểu và thực hiện kỹ thuật graceful shutdown giúp ứng dụng an toàn khi dừng/chạy lại.
* Thực hành profiling và tối ưu hiệu suất cho ứng dụng Gin.
* Biết các bước cơ bản để triển khai ứng dụng lên các nền tảng đám mây phổ biến như AWS, GCP, DigitalOcean.
* Áp dụng các biện pháp bảo mật và monitoring cơ bản khi chạy production.

## 📝 Nội dung chi tiết

### 1. **Khái niệm Production Configuration**

* **Production Configuration** là việc cấu hình ứng dụng phù hợp cho môi trường thực tế vận hành (khác với môi trường dev/test).
* Mục tiêu:

  * Tối ưu hiệu suất
  * Tăng bảo mật
  * Dễ dàng mở rộng
  * Giảm thiểu downtime
* Các điểm cần lưu ý:

  * Thiết lập biến môi trường (environment variables) để tách biệt config giữa dev và prod.
  * Cấu hình logger ở mức độ phù hợp (ví dụ: production thường chỉ log error/warning).
  * Giới hạn truy cập (CORS, rate limiting...).
  * Kết nối database, cache phải được bảo mật (ví dụ không để lộ mật khẩu).

### 2. **Docker Containerization cho Gin App**

* **Docker** giúp đóng gói ứng dụng và môi trường chạy, tăng tính nhất quán khi deploy.
* Dockerfile cần tối ưu cho production: nhỏ gọn, bảo mật, đa giai đoạn (multi-stage build).
* Multi-stage build giúp giảm kích thước image bằng cách chỉ copy file thực thi cuối cùng vào image chạy.

**Ví dụ Dockerfile chuẩn cho Gin app (multi-stage build):**

```dockerfile
# Build stage
FROM golang:1.20-alpine AS builder

WORKDIR /app

# Copy go.mod và go.sum để cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy toàn bộ source code
COPY . .

# Build binary với flags tối ưu production
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o ginapp ./cmd

# Run stage
FROM alpine:latest

WORKDIR /app

# Copy binary từ builder
COPY --from=builder /app/ginapp .

# Tạo user không root để chạy app (bảo mật)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

CMD ["./ginapp"]
```

### 3. **Load Balancer & Reverse Proxy**

* Load balancer phân phối tải đến nhiều instances của ứng dụng, giúp:

  * Tăng khả năng chịu tải
  * Cân bằng lưu lượng
  * Giảm downtime khi có instance lỗi
* Có thể dùng Nginx hoặc HAProxy làm load balancer cho app Gin.
* Nginx cũng có thể làm reverse proxy, kết hợp với TLS termination (HTTPS).

### 4. **Graceful Shutdown trong Gin**

* Đảm bảo khi server dừng, các kết nối hiện tại được xử lý xong thay vì bị ngắt đột ngột.
* Tránh mất request, tránh lỗi khi deploy.
* Kỹ thuật: lắng nghe signal (SIGINT, SIGTERM), gọi `server.Shutdown()`.

**Ví dụ implement graceful shutdown trong `cmd/main.go`:**

```go
package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "myapp/internal/handlers"

    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.New()
    r.Use(gin.Logger(), gin.Recovery())

    // Register routes
    handlers.RegisterRoutes(r)

    srv := &http.Server{
        Addr:    ":8080",
        Handler: r,
    }

    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %s\n", err)
        }
    }()
    log.Println("Server started on port 8080")

    // Wait for interrupt signal
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Println("Shutting down server...")

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }

    log.Println("Server exiting")
}
```

### 5. **Performance Profiling và Optimization**

* Công cụ profiling trong Go: `pprof`
* Giúp phát hiện bottlenecks CPU, memory leaks
* Cách dùng:

  * Import `"net/http/pprof"`
  * Mở endpoint `/debug/pprof/`
* Phân tích sau khi chạy profile để tối ưu code.
* Cách tối ưu:

  * Giảm allocations không cần thiết
  * Sử dụng connection pool cho database
  * Cache các kết quả nặng

### 6. **Triển khai lên Cloud Platforms**

* Các bước cơ bản khi deploy lên AWS, GCP, DigitalOcean:

  * Tạo server VM (EC2, Compute Engine, Droplet)
  * Cài Docker và deploy container
  * Thiết lập firewall (security groups)
  * Cấu hình domain, SSL certificate (Let's Encrypt)
  * Thiết lập monitoring (CloudWatch, Stackdriver, hoặc Prometheus)
* Có thể sử dụng CI/CD pipelines để tự động build & deploy.

### 7. **Security Hardening**

* Không chạy app với quyền root trong container
* Sử dụng HTTPS (TLS)
* Giới hạn truy cập API (rate limiting, IP whitelist)
* Cập nhật dependencies thường xuyên
* Bảo mật biến môi trường (secrets management)
* Xử lý lỗi tránh leak thông tin nhạy cảm
* Sử dụng helmet, CSP headers (nếu có frontend)

### 8. **Monitoring & Alerting**

* Giúp phát hiện sự cố nhanh, theo dõi hiệu suất ứng dụng.
* Thông dụng:

  * Log aggregation (ELK stack, Loki)
  * Metrics (Prometheus + Grafana)
  * Health checks (endpoint `/healthz`)
  * Alerting (PagerDuty, Slack integration)

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài

Xây dựng một ứng dụng Gin đơn giản với cấu trúc thư mục chuẩn, có chức năng:

* Một API GET `/ping` trả về `{ "message": "pong" }`.
* Thiết lập graceful shutdown.
* Viết Dockerfile đa giai đoạn để build và chạy ứng dụng trong container.
* Viết hướng dẫn chạy container và kiểm tra API.
* Triển khai container lên một server (local hoặc cloud) và dùng Nginx làm reverse proxy (cấu hình mẫu).

### Lời giải chi tiết và phân tích từng bước

#### 1. Cấu trúc thư mục

```
myapp/
├── cmd/
│   └── main.go
├── internal/
│   └── handlers/
│       └── ping.go
├── go.mod
└── go.sum
```

#### 2. Code file `internal/handlers/ping.go`

```go
package handlers

import "github.com/gin-gonic/gin"

func RegisterRoutes(r *gin.Engine) {
    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "pong"})
    })
}
```

#### 3. Code file `cmd/main.go`

```go
package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "syscall"
    "time"

    "myapp/internal/handlers"

    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.New()
    r.Use(gin.Logger(), gin.Recovery())

    handlers.RegisterRoutes(r)

    srv := &http.Server{
        Addr:    ":8080",
        Handler: r,
    }

    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("listen: %s\n", err)
        }
    }()
    log.Println("Server started on port 8080")

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    log.Println("Shutting down server...")

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }

    log.Println("Server exiting")
}
```

#### 4. Dockerfile (đặt ở root `myapp/`)

```dockerfile
# Build stage
FROM golang:1.20-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o ginapp ./cmd

# Run stage
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/ginapp .

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

CMD ["./ginapp"]
```

#### 5. Hướng dẫn build và chạy container

```bash
# Build image
docker build -t myapp:latest .

# Run container
docker run -d -p 8080:8080 --name myapp_container myapp:latest

# Kiểm tra API
curl http://localhost:8080/ping
# Kết quả: {"message":"pong"}
```

#### 6. Ví dụ cấu hình Nginx làm reverse proxy (nếu deploy trên server)

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔑 Những điểm quan trọng cần lưu ý

* **Không chạy app với quyền root** trong container (sử dụng user không root).
* **Graceful shutdown** giúp tránh mất request khi deploy.
* Dockerfile **multi-stage build** giảm kích thước và tăng bảo mật image.
* **Load balancer** (ví dụ Nginx) cần cấu hình reverse proxy và xử lý HTTPS.
* **Biến môi trường** (env vars) dùng để cấu hình secrets, không hardcode.
* Sử dụng công cụ **profiling pprof** để phát hiện và tối ưu bottlenecks.
* Luôn **theo dõi logs và health checks** để đảm bảo app hoạt động ổn định.
* Cập nhật dependencies, patch bảo mật định kỳ.

## 📝 Bài tập về nhà

### Đề bài

* Mở rộng ứng dụng `myapp` để có thêm endpoint POST `/echo` nhận JSON `{ "message": "..." }` và trả về JSON với trường `"echo": "..."`.
* Tạo Docker Compose file để chạy `myapp` cùng một Redis container.
* Tích hợp middleware cache sử dụng Redis để cache kết quả trả về của endpoint `/ping` trong 10 giây.
* Viết README hướng dẫn build, deploy và test ứng dụng.


