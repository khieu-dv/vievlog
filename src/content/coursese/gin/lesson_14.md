
# 🎓 **Bài 14: Rate Limiting và Security**

### 🔐 Khóa học: Golang Gin Framework - Trung cấp

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

✅ Hiểu rõ khái niệm và mục đích của **Rate Limiting**
✅ Biết cách **bảo vệ API** khỏi các cuộc tấn công phổ biến (DDoS, brute-force, injection)
✅ Cài đặt **Rate Limiting Middleware** trong Gin
✅ Cấu hình các **Security Headers (CORS, CSP, HSTS...)**
✅ Biết cách **sanitize input** và **phòng chống SQL Injection**
✅ Thực hành một bài tập API có tích hợp bảo mật & giới hạn truy cập
✅ Phân biệt và tránh các lỗi bảo mật thường gặp

## 📝 Nội dung chi tiết

### 🔹 1. Khái niệm Rate Limiting

**Rate Limiting** là kỹ thuật giới hạn số lượng request mà người dùng có thể gửi đến server trong một khoảng thời gian.

**Ví dụ**: Tối đa 100 requests/phút/IP.

👉 Mục đích:

* Bảo vệ API khỏi **DDoS**
* Ngăn chặn **brute-force**
* Tối ưu hiệu suất server

### 🔹 2. Cài đặt Rate Limiting với middleware

#### ✅ Mô tả:

Ta sẽ sử dụng thư viện `golang.org/x/time/rate` hoặc `github.com/ulule/limiter/v3` để giới hạn request.

#### 📁 Cấu trúc thư mục:

```
.
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── limiter_handler.go
│   └── middleware/
│       └── rate_limiter.go
├── go.mod
└── go.sum
```

#### 📄 `internal/middleware/rate_limiter.go`

```go
package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

var limiter = rate.NewLimiter(1, 5) // 1 request/sec, burst 5

func RateLimiter() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !limiter.Allow() {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests",
			})
			return
		}
		c.Next()
	}
}
```

#### 📄 `cmd/main.go`

```go
package main

import (
	"myapp/internal/handlers"
	"myapp/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.Use(middleware.RateLimiter())
	r.GET("/ping", handlers.Ping)
	r.Run(":8080")
}
```

#### 📄 `internal/handlers/limiter_handler.go`

```go
package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func Ping(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "pong"})
}
```

### 🔹 3. Thêm Security Headers

#### ✅ Mô tả:

Security headers bảo vệ trình duyệt và API khỏi các tấn công như **XSS**, **Clickjacking**, và **CSRF**.

#### 🔒 Headers quan trọng:

* `X-Content-Type-Options: nosniff`
* `X-Frame-Options: DENY`
* `Strict-Transport-Security: max-age=31536000`
* `Content-Security-Policy`

#### 📄 `internal/middleware/security_headers.go`

```go
package middleware

import "github.com/gin-gonic/gin"

func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("X-Content-Type-Options", "nosniff")
		c.Writer.Header().Set("X-Frame-Options", "DENY")
		c.Writer.Header().Set("Content-Security-Policy", "default-src 'self'")
		c.Writer.Header().Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains")
		c.Next()
	}
}
```

#### 📄 `cmd/main.go` (cập nhật)

```go
r.Use(middleware.SecurityHeaders())
```

### 🔹 4. Input Validation & SQL Injection Prevention

#### ✅ Mô tả:

SQL Injection xảy ra khi input không được kiểm soát được truyền thẳng vào câu truy vấn SQL.

#### Giải pháp:

* Luôn **dùng GORM hoặc prepared statements**
* **Validate và sanitize input** (dùng `binding:"required"`)

#### 📄 `internal/handlers/user_handler.go`

```go
type LoginInput struct {
	Username string `json:"username" binding:"required,min=4"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Use GORM's WHERE clause (safe from SQL injection)
	var user models.User
	if err := database.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
}
```

## 🏆 Bài tập thực hành có lời giải

### 🎯 Đề bài:

> Viết một API `/login` có:
>
> * Giới hạn tối đa **5 request / phút / IP**
> * Kiểm tra **username** và **password** từ JSON request
> * Trả về `"Login success"` nếu đúng, `"Invalid"` nếu sai

### 🧩 Lời giải & Giải thích:

#### 📄 Cấu trúc lại middleware để theo IP:

```go
// internal/middleware/ip_rate_limiter.go
package middleware

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
	"sync"
)

var visitors = make(map[string]*rate.Limiter)
var mtx sync.Mutex

func getVisitor(ip string) *rate.Limiter {
	mtx.Lock()
	defer mtx.Unlock()
	limiter, exists := visitors[ip]
	if !exists {
		limiter = rate.NewLimiter(1, 5) // 1 req/sec, burst 5
		visitors[ip] = limiter
	}
	return limiter
}

func IPRateLimiter() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		limiter := getVisitor(ip)
		if !limiter.Allow() {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Too many requests from your IP",
			})
			return
		}
		c.Next()
	}
}
```

#### 📄 `cmd/main.go` (thêm route `/login`):

```go
r.POST("/login", middleware.IPRateLimiter(), handlers.Login)
```

#### 📄 `internal/handlers/login_handler.go`

```go
package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if input.Username == "admin" && input.Password == "123456" {
		c.JSON(http.StatusOK, gin.H{"message": "Login success"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
	}
}
```

## 🔑 Những điểm quan trọng cần lưu ý

| 🔍 Chủ đề        | 📌 Ghi nhớ                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| Rate Limiting    | Dùng `golang.org/x/time/rate` hoặc `ulule/limiter`, nên áp dụng theo IP    |
| Middleware       | Áp dụng middleware trước khi vào handler                                   |
| Security Headers | Bắt buộc dùng cho production để tăng cường bảo mật                         |
| Input Validation | Dùng `binding:"required"` để tránh truyền dữ liệu thiếu hoặc sai định dạng |
| SQL Injection    | Luôn dùng GORM hoặc parameterized queries                                  |
| Tránh dùng       | string concatenation cho SQL (`"... WHERE name = " + userInput`)           |

## 📝 Bài tập về nhà

### 🎯 Đề bài:

> Viết một API `/api/upload-report` cho phép người dùng upload báo cáo (PDF).
>
> * **Giới hạn 3 lần upload/phút/IP**
> * **Kiểm tra định dạng file là .pdf**
> * Trả về thông báo `"File uploaded successfully"` nếu thành công
> * Trả về lỗi nếu sai định dạng hoặc quá giới hạn


