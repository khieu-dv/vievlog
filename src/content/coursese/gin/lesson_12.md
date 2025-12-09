

# 🎓 **Bài 12: Authorization và Role-Based Access**

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ nắm được:

* Sự khác biệt giữa **Authentication** và **Authorization**.
* Khái niệm **RBAC (Role-Based Access Control)**.
* Cách tổ chức **Role** và **Permission** trong hệ thống.
* Cách xây dựng **middleware kiểm tra quyền** trong Gin.
* Cách bảo vệ các endpoint tùy theo vai trò của người dùng.
* Áp dụng vào ví dụ thực tế: phân quyền giữa **Admin** và **User**.

## 🧠 Nội dung chi tiết

### 1. **Phân biệt Authentication và Authorization**

* **Authentication**: Xác thực người dùng là ai.
* **Authorization**: Sau khi đã xác thực, xác định người dùng **có quyền làm gì**.

🧾 Ví dụ thực tế:

* Đăng nhập (authentication) chỉ là chứng minh bạn là **John**.
* Nhưng bạn có được **xóa bài viết**, **truy cập trang admin**,… hay không lại là **authorization**.

### 2. **Khái niệm Role-Based Access Control (RBAC)**

🔑 **RBAC** là mô hình kiểm soát quyền dựa trên **vai trò** của người dùng:

* **Role**: Nhóm quyền (ví dụ: Admin, User, Moderator).
* **Permission**: Quyền cụ thể (xem, thêm, xóa, sửa...).

RBAC là cách tiếp cận phổ biến và dễ mở rộng trong xây dựng hệ thống lớn.

### 3. **Mô hình dữ liệu cho Role và User**

Trong thư mục `internal/models/user.go`:

```go
package models

type Role string

const (
	Admin Role = "admin"
	User  Role = "user"
)

type User struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Password string `json:"-"` // Hashed password
	Role     Role   `json:"role"`
}
```

### 4. **Middleware kiểm tra quyền (Authorization Middleware)**

Trong `internal/handlers/middleware.go`:

```go
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"your_project/internal/models"
)

func AuthorizeRole(requiredRole models.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleValue, exists := c.Get("userRole")
		if !exists || roleValue != requiredRole {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Forbidden: insufficient role"})
			return
		}
		c.Next()
	}
}
```

### 5. **Giả lập Authentication để có userRole**

Trong dự án thật, bạn sẽ có JWT chứa vai trò (`role`) được giải mã. Ở đây, để đơn giản, ta mock middleware đặt role vào context:

```go
func MockAuthMiddleware(role models.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("userRole", role)
		c.Next()
	}
}
```

### 6. **Handler và Route cho Role**

Trong `internal/handlers/admin.go`:

```go
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminDashboard(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Welcome to Admin Dashboard"})
}
```

Trong `cmd/main.go`:

```go
package main

import (
	"github.com/gin-gonic/gin"
	"your_project/internal/handlers"
	"your_project/internal/models"
)

func main() {
	r := gin.Default()

	// Apply mock authentication middleware
	r.Use(handlers.MockAuthMiddleware(models.Admin)) // Giả sử đang login bằng Admin

	adminRoutes := r.Group("/admin")
	adminRoutes.Use(handlers.AuthorizeRole(models.Admin))
	{
		adminRoutes.GET("/dashboard", handlers.AdminDashboard)
	}

	r.Run(":8080")
}
```

## 🏆 Bài tập thực hành (có lời giải)

### 🔖 **Đề bài:**

Xây dựng một API `/user/profile` mà **mọi người dùng đều có thể truy cập**, và một API `/admin/users` mà **chỉ admin mới được truy cập**. Giả lập người dùng với 2 role: `"admin"` và `"user"`.

### ✅ **Lời giải:**

#### 📁 Cấu trúc project:

```
.
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   ├── middleware.go
│   │   ├── admin.go
│   │   └── user.go
│   └── models/
│       └── user.go
├── go.mod
```

#### 📄 `models/user.go`

```go
package models

type Role string

const (
	Admin Role = "admin"
	User  Role = "user"
)

type User struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Role     Role   `json:"role"`
}
```

#### 📄 `handlers/middleware.go`

```go
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"your_project/internal/models"
)

func MockAuthMiddleware(role models.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("userRole", role)
		c.Next()
	}
}

func AuthorizeRole(requiredRole models.Role) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("userRole")
		if !exists || role != requiredRole {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access denied"})
			return
		}
		c.Next()
	}
}
```

#### 📄 `handlers/admin.go`

```go
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetAllUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Admin: list of all users"})
}
```

#### 📄 `handlers/user.go`

```go
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func UserProfile(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "User: this is your profile"})
}
```

#### 📄 `cmd/main.go`

```go
package main

import (
	"github.com/gin-gonic/gin"
	"your_project/internal/handlers"
	"your_project/internal/models"
)

func main() {
	r := gin.Default()

	// User routes (accessible to all roles)
	r.Use(handlers.MockAuthMiddleware(models.User)) // Change to Admin to test admin routes
	r.GET("/user/profile", handlers.UserProfile)

	adminGroup := r.Group("/admin")
	adminGroup.Use(handlers.AuthorizeRole(models.Admin))
	adminGroup.GET("/users", handlers.GetAllUsers)

	r.Run(":8080")
}
```

#### ✅ Kết quả:

* Truy cập `/user/profile`: ✅ OK
* Truy cập `/admin/users`: ❌ Nếu role là `user`, sẽ nhận lỗi 403

## 🔑 Những điểm quan trọng cần lưu ý

| Khái niệm          | Ghi nhớ                                               |
| ------------------ | ----------------------------------------------------- |
| **Authentication** | Là quá trình xác minh danh tính người dùng            |
| **Authorization**  | Kiểm tra xem người dùng có quyền làm gì               |
| **RBAC**           | Dựa trên vai trò, mỗi vai trò chứa nhiều quyền        |
| **Middleware**     | Là nơi kiểm tra logic trước khi tiếp tục xử lý route  |
| **Gin Context**    | Dùng để lưu thông tin như userRole xuyên suốt request |

## 📝 Bài tập về nhà

### 🔖 Đề bài:

1. Thêm role mới `"moderator"` vào hệ thống.
2. Tạo một route `/moderator/reports` chỉ cho phép moderator truy cập.
3. Viết middleware để chỉ cho phép truy cập nếu user có role là `"moderator"`.

📌 *Gợi ý:* Dựa theo cấu trúc như bài thực hành, mở rộng file `models/user.go` và `middleware.go`.


