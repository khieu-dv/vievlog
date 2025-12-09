
# Bài 19: Monitoring và Logging trong Golang Gin Framework

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ **monitoring** và **logging** là gì, tầm quan trọng của chúng trong phát triển và vận hành ứng dụng web.
* Nắm được các khái niệm như **structured logging**, **metrics**, **health checks** và cách áp dụng trong Gin.
* Biết cách tích hợp công cụ logging (ví dụ: logrus) vào dự án Gin theo chuẩn cấu trúc.
* Triển khai các endpoint để xuất metrics, health check phù hợp để giám sát ứng dụng.
* Hiểu và thực hành cơ bản tích hợp Prometheus cho metrics monitoring.
* Phát triển kỹ năng xây dựng hệ thống logging và monitoring đơn giản nhưng hiệu quả cho ứng dụng backend.

## 📝 Nội dung chi tiết

### 1. **Giới thiệu về Monitoring và Logging**

* **Monitoring** là quá trình thu thập, phân tích dữ liệu vận hành của ứng dụng (metrics, logs, health status…) để theo dõi tình trạng hoạt động và phát hiện vấn đề sớm.
* **Logging** là việc ghi lại các sự kiện (event), lỗi (error), trạng thái (state) trong ứng dụng theo thời gian thực hoặc theo từng request.

**Tại sao cần?**

* Giúp developer nhanh chóng phát hiện lỗi, bottleneck, hoặc sự cố sản phẩm.
* Giúp vận hành (DevOps) kiểm soát, cảnh báo khi hệ thống có dấu hiệu bất thường.
* Hỗ trợ phân tích nguyên nhân gốc rễ khi có sự cố.

### 2. **Structured Logging là gì?**

* Là hình thức ghi log có cấu trúc dạng key-value thay vì log thuần text, giúp dễ dàng phân tích, tìm kiếm tự động.
* Ví dụ: `{"level":"info", "msg":"user login", "user_id":123, "time":"2025-08-04T09:00:00Z"}`

**Ưu điểm:**

* Máy móc dễ parse, xử lý, chuyển lên hệ thống logging tập trung (ELK, Loki, Graylog...)
* Người đọc dễ dàng tìm kiếm, lọc, phân loại log.

### 3. **Các công cụ logging trong Golang**

* **logrus**: Thư viện logging structured phổ biến, dễ dùng.
* **zap**: Logging tốc độ cao, hiệu suất cao.
* **zerolog**: Logging dạng JSON nhẹ.

Bài này sẽ sử dụng **logrus** để minh họa.

### 4. **Metrics và Health Checks**

* **Metrics**: số liệu đo đạc như số request, thời gian phản hồi, lỗi, CPU usage…
* **Health Check**: endpoint cho biết ứng dụng còn “sống” (alive) và hoạt động bình thường (ready).
* Được Prometheus thu thập để giám sát trực quan.

### 5. **Triển khai ví dụ dự án Gin với logging và monitoring**

### 6. **Cấu trúc dự án**

```
myapp/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   ├── health.go
│   │   └── user.go
│   ├── logger/
│   │   └── logger.go
│   ├── metrics/
│   │   └── metrics.go
│   └── models/
│       └── user.go
├── go.mod
└── go.sum
```

### 7. **Code ví dụ chi tiết**

#### a) **Setup logger với logrus**

```go
// internal/logger/logger.go
package logger

import (
    "github.com/sirupsen/logrus"
    "os"
)

var Log *logrus.Logger

func Init() {
    Log = logrus.New()
    Log.Out = os.Stdout
    Log.SetFormatter(&logrus.JSONFormatter{})
    Log.SetLevel(logrus.InfoLevel)
}
```

#### b) **Metrics cho Prometheus**

```go
// internal/metrics/metrics.go
package metrics

import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promhttp"
    "net/http"
)

var (
    RequestCount = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Count of all HTTP requests",
        },
        []string{"path", "method", "status"},
    )
)

func Init() {
    prometheus.MustRegister(RequestCount)
}

// Middleware Gin để đếm số request
func MetricsMiddleware() func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return promhttp.InstrumentHandlerCounter(RequestCount, next)
    }
}

// Gin middleware function
func GinMiddleware() func(c *gin.Context) {
    return func(c *gin.Context) {
        path := c.FullPath()
        method := c.Request.Method
        c.Next()
        status := c.Writer.Status()
        RequestCount.WithLabelValues(path, method, http.StatusText(status)).Inc()
    }
}
```

#### c) **Health check handler**

```go
// internal/handlers/health.go
package handlers

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func HealthCheck(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
        "status": "healthy",
    })
}
```

#### d) **User handler mẫu**

```go
// internal/handlers/user.go
package handlers

import (
    "github.com/gin-gonic/gin"
    "net/http"
    "myapp/internal/logger"
)

func GetUser(c *gin.Context) {
    userID := c.Param("id")
    logger.Log.WithFields(map[string]interface{}{
        "user_id": userID,
        "action":  "get_user",
    }).Info("Get user request received")

    // Giả sử data tĩnh
    user := map[string]interface{}{
        "id":   userID,
        "name": "John Doe",
    }

    c.JSON(http.StatusOK, user)
}
```

#### e) **Main.go**

```go
// cmd/main.go
package main

import (
    "myapp/internal/handlers"
    "myapp/internal/logger"
    "myapp/internal/metrics"

    "github.com/gin-gonic/gin"
)

func main() {
    logger.Init()
    metrics.Init()

    r := gin.New()
    r.Use(gin.Recovery())
    r.Use(metrics.GinMiddleware()) // metrics middleware

    r.GET("/health", handlers.HealthCheck)
    r.GET("/users/:id", handlers.GetUser)

    // Endpoint cho Prometheus scrape metrics
    r.GET("/metrics", gin.WrapH(promhttp.Handler()))

    logger.Log.Info("Starting server at :8080")
    r.Run(":8080")
}
```

## 🏆 Bài tập thực hành có lời giải

### Đề bài

Xây dựng một API endpoint mới `/products/:id`:

* Trả về thông tin product giả lập.
* Ghi log chi tiết khi có request vào endpoint (bao gồm product\_id và timestamp).
* Sử dụng structured logging với logrus.
* Tích hợp monitoring để đếm số lượng request đến endpoint này.
* Kiểm tra tính năng health check và metrics đã hoạt động.

### Lời giải

**Bước 1:** Tạo handler trong `internal/handlers/product.go`

```go
package handlers

import (
    "github.com/gin-gonic/gin"
    "net/http"
    "time"
    "myapp/internal/logger"
    "myapp/internal/metrics"
)

func GetProduct(c *gin.Context) {
    productID := c.Param("id")

    logger.Log.WithFields(map[string]interface{}{
        "product_id": productID,
        "timestamp":  time.Now().Format(time.RFC3339),
        "action":     "get_product",
    }).Info("Product request received")

    // Giả lập data sản phẩm
    product := map[string]interface{}{
        "id":    productID,
        "name":  "Sample Product",
        "price": 100.0,
    }

    // Tăng metric cho endpoint này
    metrics.RequestCount.WithLabelValues(c.FullPath(), c.Request.Method, http.StatusText(http.StatusOK)).Inc()

    c.JSON(http.StatusOK, product)
}
```

**Bước 2:** Đăng ký route trong `cmd/main.go`

```go
r.GET("/products/:id", handlers.GetProduct)
```

**Bước 3:** Chạy server, test:

* Truy cập `/products/123`
* Quan sát log JSON in ra chuẩn
* Truy cập `/metrics` kiểm tra số lượng request tăng

### Phân tích

* Logging structured giúp lọc nhanh theo product\_id.
* Metrics theo dõi chính xác số request theo từng endpoint, method và trạng thái HTTP.
* Health check luôn trả về trạng thái “healthy” để Prometheus hoặc hệ thống giám sát ping.

## 🔑 Những điểm quan trọng cần lưu ý

* **Structured logging**: luôn nên log dưới dạng key-value để dễ phân tích tự động, tránh log chuỗi thuần.
* **Log level**: phân biệt rõ info, error, warn, debug để dễ lọc.
* **Middleware metrics**: đo đếm request phải được dùng middleware để không sót request.
* **Health check**: nên có ít nhất 1 endpoint trả về status code 200 và trạng thái hệ thống đơn giản.
* **Metrics exposure**: endpoint `/metrics` phải trả về dữ liệu theo chuẩn Prometheus để tích hợp dễ dàng.
* **Không log thông tin nhạy cảm** (password, token...) trong log.
* Sử dụng `gin.Recovery()` để ứng dụng không crash và log lỗi panic.

## 📝 Bài tập về nhà

### Đề bài

1. Mở rộng API với endpoint `/orders/:id`:

* Trả về thông tin order giả lập.
* Log đầy đủ request, bao gồm `order_id` và thời gian.
* Tạo middleware logging riêng, ghi lại request method, path, thời gian xử lý (latency).
* Thêm metric đếm số request và thời gian xử lý (histogram) cho endpoint này.
* Tạo endpoint health check mở rộng kiểm tra kết nối tới database (giả lập).
* Triển khai và chạy ứng dụng, test tất cả endpoint.

### Yêu cầu:

* Áp dụng kiến trúc chuẩn (cmd/, internal/handlers, internal/logger, internal/metrics).
* Sử dụng logrus cho logging.
* Sử dụng prometheus/client\_golang cho metrics.
* Ghi chú rõ ràng từng bước trong code.
