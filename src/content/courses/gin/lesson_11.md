

# 🧩 **Bài 11: Authentication JWT**

## 🎯 Mục tiêu bài học

Sau khi học xong bài này, học viên sẽ:

✅ Hiểu được JWT là gì và vì sao nên dùng trong API authentication
✅ Biết cách tạo và xác thực JWT trong Golang với Gin
✅ Xây dựng API đăng ký, đăng nhập và middleware bảo vệ route
✅ Hiểu rõ cách lưu trữ và sử dụng JWT ở phía client
✅ Thực hành triển khai đầy đủ flow authentication cơ bản cho REST API

## 📝 Nội dung chi tiết

### 🔐 **1. JWT là gì?**

**JWT (JSON Web Token)** là một chuẩn mở (RFC 7519) để truyền tải thông tin giữa các bên như là một *object JSON* an toàn và có thể xác thực được.

#### 📘 Giải thích:

* JWT gồm 3 phần: `Header.Payload.Signature` (dạng Base64Url encoded)
* Header chứa thuật toán mã hóa và loại token
* Payload chứa thông tin như user ID, role, exp...
* Signature được tạo từ `Header + Payload + secret`, đảm bảo token không bị chỉnh sửa

#### ✅ Tại sao dùng JWT trong Golang Gin?

* Stateless (không lưu session trên server)
* Dễ tích hợp với mobile, frontend, microservices
* Hỗ trợ xác thực nhanh chóng

### ⚙️ **2. Kiến trúc thư mục áp dụng**

```
.
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── auth_handler.go
│   ├── models/
│   │   └── user.go
│   ├── middleware/
│   │   └── jwt_middleware.go
│   ├── utils/
│   │   └── jwt.go
├── go.mod
└── go.sum
```

### 🔨 **3. Cài đặt thư viện cần thiết**

```bash
go get github.com/gin-gonic/gin
go get github.com/golang-jwt/jwt/v5
go get golang.org/x/crypto/bcrypt
```

### 🧩 **4. Tạo model người dùng**

```go
// internal/models/user.go
package models

type User struct {
    ID       int64  `json:"id"`
    Username string `json:"username"`
    Password string `json:"password"` // hashed password
}
```

### 🔐 **5. Tạo JWT Token (utils)**

```go
// internal/utils/jwt.go
package utils

import (
    "time"
    "github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your_secret_key")

func GenerateToken(userID int64) (string, error) {
    claims := jwt.MapClaims{
        "user_id": userID,
        "exp":     time.Now().Add(time.Hour * 72).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString(jwtSecret)
}

func ValidateToken(tokenStr string) (jwt.MapClaims, error) {
    token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
        return jwtSecret, nil
    })

    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        return claims, nil
    }

    return nil, err
}
```

### 🎮 **6. Handler đăng ký và đăng nhập**

```go
// internal/handlers/auth_handler.go
package handlers

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "golang.org/x/crypto/bcrypt"
    "your_project/internal/models"
    "your_project/internal/utils"
)

var userDB = []models.User{}

func Register(c *gin.Context) {
    var user models.User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    hashed, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
    user.Password = string(hashed)
    user.ID = int64(len(userDB) + 1)
    userDB = append(userDB, user)

    c.JSON(http.StatusCreated, gin.H{"message": "User registered"})
}

func Login(c *gin.Context) {
    var login models.User
    if err := c.ShouldBindJSON(&login); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    var user models.User
    for _, u := range userDB {
        if u.Username == login.Username {
            user = u
            break
        }
    }

    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(login.Password)); err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
        return
    }

    token, _ := utils.GenerateToken(user.ID)
    c.JSON(http.StatusOK, gin.H{"token": token})
}
```

### 🛡️ **7. Middleware kiểm tra JWT**

```go
// internal/middleware/jwt_middleware.go
package middleware

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "your_project/internal/utils"
)

func JWTAuth() gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenStr := c.GetHeader("Authorization")
        if tokenStr == "" || !strings.HasPrefix(tokenStr, "Bearer ") {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid token"})
            return
        }

        tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")
        claims, err := utils.ValidateToken(tokenStr)
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            return
        }

        c.Set("user_id", claims["user_id"])
        c.Next()
    }
}
```

### 🚀 **8. main.go – đăng ký router**

```go
// cmd/main.go
package main

import (
    "github.com/gin-gonic/gin"
    "your_project/internal/handlers"
    "your_project/internal/middleware"
)

func main() {
    r := gin.Default()

    r.POST("/register", handlers.Register)
    r.POST("/login", handlers.Login)

    auth := r.Group("/auth")
    auth.Use(middleware.JWTAuth())
    auth.GET("/profile", func(c *gin.Context) {
        userID := c.MustGet("user_id")
        c.JSON(200, gin.H{"message": "Welcome", "user_id": userID})
    })

    r.Run(":8080")
}
```

## 🏆 Bài tập thực hành có lời giải

### 📋 Đề bài:

Tạo API đăng ký, đăng nhập và xem hồ sơ cá nhân với Gin và JWT. Hồ sơ chỉ hiển thị được khi đã login.

### ✅ Yêu cầu:

* Gửi `POST /register` với username/password
* Gửi `POST /login` và nhận token
* Gửi `GET /auth/profile` kèm token → Trả về user\_id

### ✅ Lời giải: Đã được trình bày trong phần trên.

## 🔑 Những điểm quan trọng cần lưu ý

| ⚠️ Lưu ý | Nội dung                                                                  |
| -------- | ------------------------------------------------------------------------- |
| 1️⃣      | JWT không mã hóa dữ liệu → **Không nên lưu password, thông tin nhạy cảm** |
| 2️⃣      | Token nên có thời gian hết hạn (`exp`) để tăng bảo mật                    |
| 3️⃣      | Header Authorization phải có định dạng: `Bearer <token>`                  |
| 4️⃣      | Đừng chia sẻ `secret key` trong public repo                               |
| 5️⃣      | Nên bổ sung refresh token (nâng cao – giới thiệu sau)                     |

## 📝 Bài tập về nhà

### 📋 Đề bài:

Tạo thêm một endpoint `/auth/change-password`
Yêu cầu người dùng đăng nhập và cung cấp `old_password`, `new_password`. Nếu đúng, thay đổi mật khẩu thành công.

### 📎 Gợi ý:

* Sử dụng `JWTAuth()` để bảo vệ route
* Lấy `user_id` từ `c.MustGet("user_id")`
* Kiểm tra old password
* Hash và cập nhật password mới


