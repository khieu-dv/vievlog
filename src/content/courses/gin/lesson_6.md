

# Bài 6: Middleware cơ bản trong Gin Framework

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ **middleware** là gì, cách hoạt động và vai trò trong Gin framework.
* Biết sử dụng các middleware **có sẵn** (built-in) như `Logger`, `Recovery`, `CORS`.
* Tự tạo được middleware **tùy chỉnh** (custom middleware) để xử lý các yêu cầu theo nhu cầu.
* Biết cách áp dụng middleware cho **toàn bộ ứng dụng**, cho **nhóm route**, hoặc cho **route riêng biệt**.
* Nắm được cách kiểm thử middleware để đảm bảo hoạt động chính xác.

## 📝 Nội dung chi tiết

### 1. Middleware là gì?

**Middleware** là các hàm được gọi giữa thời điểm server nhận request và trước khi trả response cho client. Nói đơn giản, middleware là các lớp xử lý trung gian giúp:

* Xử lý, thay đổi hoặc kiểm tra dữ liệu request/response
* Thực hiện các tác vụ chung như logging, xác thực, xử lý lỗi
* Tạo pipeline xử lý request tuần tự

**Ví dụ:** Khi có một request, middleware `Logger` sẽ ghi lại thông tin request vào log trước khi chuyển tiếp tới handler chính.

### 2. Cách hoạt động của Middleware trong Gin

Middleware trong Gin là các hàm có kiểu:

```go
func(c *gin.Context)
```

Trong đó:

* `c.Next()` gọi middleware tiếp theo hoặc handler
* Nếu middleware không gọi `c.Next()`, request sẽ dừng ở middleware đó

Giải thích: Middleware tạo thành chuỗi xử lý request. Khi request tới, Gin gọi lần lượt các middleware theo thứ tự đăng ký. Middleware có thể dừng request (ví dụ xác thực thất bại) hoặc tiếp tục chạy đến handler.

### 3. Các middleware built-in phổ biến trong Gin

* `gin.Logger()`: Ghi log các thông tin request (method, path, status code, thời gian)
* `gin.Recovery()`: Bắt panic, tránh crash server và trả lỗi 500 an toàn
* `cors` middleware (thường dùng thư viện bên ngoài như `github.com/gin-contrib/cors`)

### 4. Tạo middleware tùy chỉnh (Custom Middleware)

Bạn có thể tự viết middleware để thực hiện các nghiệp vụ riêng như xác thực token, đo thời gian xử lý, kiểm tra quyền...

**Ví dụ: Middleware ghi log thời gian xử lý request**

```go
func TimingMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        c.Next() // tiếp tục xử lý
        duration := time.Since(start)
        log.Printf("Request %s took %v", c.Request.URL.Path, duration)
    }
}
```

### 5. Áp dụng middleware trong Gin

* **Toàn ứng dụng:**

```go
r := gin.New()
r.Use(gin.Logger(), gin.Recovery(), TimingMiddleware())
```

* **Nhóm route (route groups):**

```go
apiGroup := r.Group("/api")
apiGroup.Use(AuthMiddleware())
apiGroup.GET("/profile", ProfileHandler)
```

* **Riêng lẻ route:**

```go
r.GET("/dashboard", AuthMiddleware(), DashboardHandler)
```

### 6. Middleware phổ biến khác

* **Authentication middleware đơn giản:** kiểm tra header có token hay không, nếu không có trả lỗi 401.

```go
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            return
        }
        // Có thể thêm kiểm tra token hợp lệ ở đây
        c.Next()
    }
}
```

## 🛠️ Ví dụ minh họa dự án với cấu trúc chuẩn

```
myginapp/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── user_handler.go
│   ├── middleware/
│   │   └── auth.go
│   └── models/
│       └── user.go
├── go.mod
└── go.sum
```

### File: `cmd/main.go`

```go
package main

import (
    "log"
    "myginapp/internal/handlers"
    "myginapp/internal/middleware"
    "time"

    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.New()

    // Sử dụng middleware built-in
    r.Use(gin.Logger())
    r.Use(gin.Recovery())

    // Sử dụng custom middleware
    r.Use(middleware.TimingMiddleware())

    // Route không yêu cầu auth
    r.GET("/ping", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "pong"})
    })

    // Route nhóm yêu cầu auth
    authGroup := r.Group("/api")
    authGroup.Use(middleware.AuthMiddleware())
    authGroup.GET("/profile", handlers.GetProfile)

    if err := r.Run(":8080"); err != nil {
        log.Fatal(err)
    }
}
```

### File: `internal/middleware/timing.go`

```go
package middleware

import (
    "log"
    "time"

    "github.com/gin-gonic/gin"
)

func TimingMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        start := time.Now()
        c.Next()
        duration := time.Since(start)
        log.Printf("Request %s took %v", c.Request.URL.Path, duration)
    }
}
```

### File: `internal/middleware/auth.go`

```go
package middleware

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            return
        }
        // Thêm kiểm tra token hợp lệ nếu cần
        c.Next()
    }
}
```

### File: `internal/handlers/user_handler.go`

```go
package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
)

func GetProfile(c *gin.Context) {
    // Ví dụ trả về profile giả định
    c.JSON(http.StatusOK, gin.H{
        "user": "John Doe",
        "email": "john@example.com",
    })
}
```

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài

Xây dựng một middleware tên là `RequestIDMiddleware` có chức năng:

* Tạo ra một `request_id` (dạng string) duy nhất cho mỗi request (có thể dùng `uuid` hoặc timestamp + random).
* Gắn `request_id` này vào **header response** với key `"X-Request-ID"`.
* Gắn `request_id` này vào **context của Gin** để handler có thể lấy ra sử dụng.
* Tạo một route `/hello` sử dụng middleware này, khi truy cập trả về JSON có key `"request_id"` với giá trị của request\_id đó.

### Lời giải

**1. Cài thư viện tạo UUID (nếu dùng UUID):**

```bash
go get github.com/google/uuid
```

**2. Code middleware `RequestIDMiddleware`**

```go
package middleware

import (
    "github.com/gin-gonic/gin"
    "github.com/google/uuid"
)

const RequestIDKey = "RequestID"

func RequestIDMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Tạo UUID
        requestID := uuid.New().String()

        // Gắn vào header response
        c.Writer.Header().Set("X-Request-ID", requestID)

        // Gắn vào context Gin
        c.Set(RequestIDKey, requestID)

        c.Next()
    }
}
```

**3. Sử dụng middleware và lấy request\_id trong handler**

```go
package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "myginapp/internal/middleware"
)

func HelloHandler(c *gin.Context) {
    requestID, exists := c.Get(middleware.RequestIDKey)
    if !exists {
        requestID = "unknown"
    }

    c.JSON(http.StatusOK, gin.H{
        "message":    "Hello, Middleware!",
        "request_id": requestID,
    })
}
```

**4. Đăng ký middleware và route trong `main.go`**

```go
package main

import (
    "log"
    "myginapp/internal/handlers"
    "myginapp/internal/middleware"

    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.New()
    r.Use(gin.Logger(), gin.Recovery())

    // Áp dụng RequestIDMiddleware cho route /hello
    r.GET("/hello", middleware.RequestIDMiddleware(), handlers.HelloHandler)

    if err := r.Run(":8080"); err != nil {
        log.Fatal(err)
    }
}
```

### Giải thích từng bước

* Middleware tạo ra một `request_id` duy nhất.
* Middleware đẩy `request_id` vào header HTTP để client biết.
* Middleware lưu `request_id` vào Gin context để handler có thể sử dụng.
* Handler đọc `request_id` từ context và trả về JSON cùng với thông báo.

## 🔑 Những điểm quan trọng cần lưu ý

* Middleware trong Gin là chuỗi các hàm được gọi lần lượt theo thứ tự đăng ký.
* Gọi `c.Next()` trong middleware để tiếp tục xử lý, nếu không gọi sẽ dừng tại middleware đó.
* `c.Abort()` hoặc `c.AbortWithStatus()` dùng để dừng chuỗi middleware/handler.
* Middleware có thể áp dụng toàn cục (`r.Use()`), nhóm route (`group.Use()`) hoặc từng route riêng biệt.
* Middleware nên nhẹ nhàng, không làm chậm quá trình xử lý request.
* Lưu ý thứ tự đăng ký middleware có thể ảnh hưởng logic xử lý.

## 📝 Bài tập về nhà

### Đề bài

Viết một middleware `RateLimitMiddleware` với chức năng:

* Giới hạn số request tối đa **5 request/phút** cho mỗi client dựa trên IP.
* Nếu vượt quá giới hạn, trả về HTTP status `429 Too Many Requests` và JSON lỗi thích hợp.
* Áp dụng middleware này cho một nhóm route `/api`.
* Tạo một route `/api/data` trả về JSON `"data": "some secure data"`.

*Gợi ý:* Bạn có thể dùng `map[string]int` để lưu số request và `time.Ticker` hoặc `time.AfterFunc` để reset định kỳ. Không cần dùng Redis hoặc cache phức tạp trong bài này.

