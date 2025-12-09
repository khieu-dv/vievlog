

# BÀI 7: ERROR HANDLING TRONG GOLANG GIN FRAMEWORK

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ các khái niệm cơ bản về xử lý lỗi (error handling) trong Golang và Gin.
* Nắm được các pattern phổ biến trong xử lý lỗi API với Gin.
* Biết cách tạo và sử dụng custom error types để quản lý lỗi tốt hơn.
* Biết cách tạo middleware xử lý lỗi toàn cục (global error handler).
* Xây dựng định dạng response lỗi nhất quán, dễ theo dõi.
* Biết cách ghi log lỗi (logging) và xử lý validation errors hiệu quả.
* Áp dụng kiến thức để xây dựng API Gin có khả năng xử lý lỗi tốt, chuẩn mực và thân thiện với người dùng.

## 📝 Nội dung chi tiết

### 1. **Khái niệm về Error Handling trong Golang**

* **Error là gì?**
  Trong Go, `error` là một interface chuẩn định nghĩa phương thức:

  ```go
  type error interface {
      Error() string
  }
  ```
* **Cách Go xử lý lỗi:**
  Go không dùng cơ chế exceptions mà trả về lỗi trực tiếp từ hàm, ví dụ:

  ```go
  result, err := SomeFunc()
  if err != nil {
      // Xử lý lỗi
  }
  ```
* **Tại sao cần xử lý lỗi cẩn thận?**
  Để tránh crash, thông báo lỗi rõ ràng cho client, debug dễ dàng và bảo vệ ứng dụng khỏi tình trạng không mong muốn.

### 2. **Error Handling trong Gin Framework**

* Gin hỗ trợ trả về lỗi qua HTTP status codes và JSON response.
* Cần có cách chuẩn hóa format lỗi trả về API để client dễ hiểu.
* Cần có middleware để bắt và xử lý lỗi global, tránh viết xử lý lỗi ở nhiều nơi gây trùng lặp.

### 3. **Custom Error Types**

* Tạo custom error type giúp phân biệt loại lỗi dễ dàng, ví dụ: lỗi validate, lỗi hệ thống, lỗi không tìm thấy.
* Ví dụ:

```go
package errors

import "fmt"

type APIError struct {
    Code    int    // HTTP status code
    Message string // Thông báo lỗi thân thiện
}

func (e *APIError) Error() string {
    return fmt.Sprintf("code: %d, message: %s", e.Code, e.Message)
}

func NewAPIError(code int, message string) *APIError {
    return &APIError{Code: code, Message: message}
}
```

### 4. **Middleware xử lý lỗi toàn cục**

* Middleware sẽ intercept tất cả lỗi không được xử lý ở handlers, trả về response lỗi thống nhất và ghi log.
* Ví dụ middleware error handler:

```go
package middleware

import (
    "github.com/gin-gonic/gin"
    "log"
    "net/http"
    "your_project/internal/errors"
)

func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next() // Xử lý các handlers trước

        errs := c.Errors
        if len(errs) > 0 {
            // Lấy lỗi đầu tiên để xử lý
            err := errs[0].Err
            var apiErr *errors.APIError
            if ok := errors.As(err, &apiErr); ok {
                // Lỗi custom APIError
                c.JSON(apiErr.Code, gin.H{"error": apiErr.Message})
                log.Printf("APIError: %v", apiErr)
            } else {
                // Lỗi không xác định
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
                log.Printf("Unknown error: %v", err)
            }
            c.Abort()
            return
        }
    }
}
```

### 5. **Xử lý validation errors trong Gin**

* Gin hỗ trợ binding với struct tags để validate dữ liệu.
* Validation errors cần được bắt và trả về cho client một cách rõ ràng.
* Ví dụ xử lý validation errors:

```go
package handlers

import (
    "github.com/gin-gonic/gin"
    "net/http"
    "your_project/internal/errors"
)

type UserRegisterRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
}

func RegisterUser(c *gin.Context) {
    var req UserRegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.Error(errors.NewAPIError(http.StatusBadRequest, "Invalid input data"))
        return
    }

    // Xử lý đăng ký thành công
    c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}
```

### 6. **Logging lỗi**

* Sử dụng `log` package hoặc các thư viện logging như `logrus` để ghi log lỗi vào file hoặc hệ thống.
* Việc logging giúp debug và giám sát hệ thống dễ dàng.

### 7. **Định dạng response lỗi chuẩn**

* Một cấu trúc JSON lỗi phổ biến:

```json
{
  "error": {
    "code": 400,
    "message": "Invalid email format",
    "details": {}
  }
}
```

* Giúp client dễ xử lý và hiển thị thông tin lỗi chính xác.

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài:

**Xây dựng API đăng ký người dùng với yêu cầu:**

* Endpoint POST `/api/register`
* Nhận JSON body gồm `email` (bắt buộc, phải đúng định dạng email), `password` (bắt buộc, tối thiểu 6 ký tự).
* Nếu dữ liệu không hợp lệ, trả về lỗi với status 400 và định dạng lỗi chuẩn.
* Sử dụng custom error type và middleware xử lý lỗi toàn cục.
* Ghi log lỗi khi có lỗi xảy ra.
* Áp dụng cấu trúc dự án chuẩn:

```
│
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── user.go
│   ├── middleware/
│   │   └── error_handler.go
│   └── errors/
│       └── api_error.go
├── go.mod
└── go.sum
```

### Lời giải chi tiết (code):

#### 1. `internal/errors/api_error.go`

```go
package errors

import "fmt"

type APIError struct {
    Code    int
    Message string
}

func (e *APIError) Error() string {
    return fmt.Sprintf("code: %d, message: %s", e.Code, e.Message)
}

func NewAPIError(code int, message string) *APIError {
    return &APIError{Code: code, Message: message}
}
```

#### 2. `internal/middleware/error_handler.go`

```go
package middleware

import (
    "log"
    "net/http"
    "your_project/internal/errors"

    "github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next()

        if len(c.Errors) > 0 {
            err := c.Errors[0].Err
            var apiErr *errors.APIError
            if ok := errors.As(err, &apiErr); ok {
                log.Printf("[API ERROR] %v", apiErr)
                c.JSON(apiErr.Code, gin.H{
                    "error": gin.H{
                        "code":    apiErr.Code,
                        "message": apiErr.Message,
                    },
                })
            } else {
                log.Printf("[UNKNOWN ERROR] %v", err)
                c.JSON(http.StatusInternalServerError, gin.H{
                    "error": gin.H{
                        "code":    http.StatusInternalServerError,
                        "message": "Internal Server Error",
                    },
                })
            }
            c.Abort()
        }
    }
}
```

#### 3. `internal/handlers/user.go`

```go
package handlers

import (
    "net/http"
    "your_project/internal/errors"

    "github.com/gin-gonic/gin"
)

type UserRegisterRequest struct {
    Email    string `json:"email" binding:"required,email"`
    Password string `json:"password" binding:"required,min=6"`
}

func RegisterUser(c *gin.Context) {
    var req UserRegisterRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        // Trả lỗi validation
        c.Error(errors.NewAPIError(http.StatusBadRequest, "Invalid input data: email must be valid, password min 6 chars"))
        return
    }

    // Giả lập logic đăng ký thành công
    c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}
```

#### 4. `cmd/main.go`

```go
package main

import (
    "your_project/internal/handlers"
    "your_project/internal/middleware"

    "github.com/gin-gonic/gin"
)

func main() {
    r := gin.New()

    // Middleware logger và recovery
    r.Use(gin.Logger())
    r.Use(gin.Recovery())

    // Middleware xử lý lỗi toàn cục
    r.Use(middleware.ErrorHandler())

    api := r.Group("/api")
    {
        api.POST("/register", handlers.RegisterUser)
    }

    r.Run(":8080")
}
```

### Phân tích lời giải

* **Custom error type** giúp tách biệt lỗi API và dễ quản lý.
* **Middleware ErrorHandler** giúp thu gom tất cả lỗi, trả về chuẩn, và log lỗi, tránh lặp code xử lý lỗi ở mỗi handler.
* **Validation errors** được bắt tại handler và trả về lỗi rõ ràng cho client.
* **Cấu trúc dự án** chuẩn giúp phân chia rõ ràng trách nhiệm.

## 🔑 Những điểm quan trọng cần lưu ý

* Trong Go, **luôn kiểm tra lỗi** sau khi gọi hàm có thể trả lỗi, không bỏ qua.
* Trong Gin, lỗi nên được trả qua `c.Error()` rồi dùng middleware xử lý chung, giúp code sạch hơn.
* Tạo **custom error type** để phân loại lỗi dễ dàng, thuận tiện cho việc xử lý và logging.
* Định dạng lỗi trả về API cần **đồng bộ và dễ hiểu** cho client.
* Middleware xử lý lỗi cần được đặt sau middleware logger và recovery để không bị bỏ qua lỗi.
* Validation là lớp kiểm tra đầu vào quan trọng, giúp giảm lỗi và bảo vệ API.
* Logging lỗi giúp phát hiện và sửa lỗi nhanh hơn khi ứng dụng chạy thực tế.

## 📝 Bài tập về nhà

### Đề bài:

* Mở rộng API đăng ký người dùng (POST `/api/register`) bằng cách thêm:

  * Trường `username` (bắt buộc, ít nhất 3 ký tự).
  * Kiểm tra trùng username giả định (ví dụ `admin` là username đã tồn tại).
  * Trả về lỗi rõ ràng nếu username đã tồn tại với status 409.
  * Áp dụng lại các kỹ thuật xử lý lỗi, middleware, logging đã học.
  * Cấu trúc dự án giữ nguyên.

### Yêu cầu:

* Gửi request với JSON body chứa `username`, `email`, `password`.
* Nếu username tồn tại, trả về JSON lỗi chuẩn, status 409.
* Nếu dữ liệu không hợp lệ, trả về lỗi 400.
* Nếu thành công, trả về message xác nhận.
