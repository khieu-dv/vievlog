
# 🎓 **Bài 13: API Versioning (Phân phiên bản API)**

## 🎯 **Mục tiêu bài học**

Sau bài học này, học viên sẽ:

* Hiểu được **vì sao cần API versioning** trong phát triển phần mềm.
* Biết cách triển khai **URL-based versioning** với Gin.
* Biết tổ chức code nhiều phiên bản API rõ ràng, mở rộng được.
* Xây dựng được **handlers theo version**, giữ tính **backward compatibility**.
* Thực hành xây dựng API v1 và nâng cấp sang v2 không làm hỏng client cũ.

## 🧠 **Nội dung chi tiết**

### 1. ✅ **API Versioning là gì?**

**Định nghĩa:**
API versioning là kỹ thuật quản lý các thay đổi của API mà **không làm hỏng** hoặc gây lỗi cho các hệ thống đang dùng phiên bản cũ.

### 2. 💬 **Tại sao cần API Versioning?**

* Client cũ vẫn có thể sử dụng phiên bản API trước.
* Cho phép **triển khai tính năng mới** mà không ảnh hưởng hệ thống hiện tại.
* Hỗ trợ **quản lý vòng đời API**: phát hành, bảo trì, ngừng hỗ trợ.

### 3. 🧩 **Các chiến lược versioning phổ biến**

| Loại Versioning       | Ví dụ                                   | Ưu điểm            | Nhược điểm                        |
| --------------------- | --------------------------------------- | ------------------ | --------------------------------- |
| **URL versioning**    | `/api/v1/users`                         | Rõ ràng, dễ debug  | URL dài, cần kiểm soát routes     |
| **Header versioning** | `Accept: application/vnd.myapi.v1+json` | Không thay đổi URL | Phức tạp, cần xử lý header custom |
| **Query param**       | `/api/users?version=1`                  | Dễ thử nghiệm      | Không chuẩn RESTful               |

✅ **Trong bài này ta sẽ học URL Versioning vì dễ dùng và phổ biến.**

### 4. 🏗️ **Cấu trúc thư mục dự án**

Tuân thủ kiến trúc đã thống nhất:

```
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   ├── v1/
│   │   │   └── user_handler.go
│   │   └── v2/
│   │       └── user_handler.go
│   ├── models/
│   │   └── user.go
├── go.mod
└── go.sum
```

### 5. 📘 **Ví dụ thực tế: User API V1 vs V2**

#### 💡 Mô tả:

* `GET /api/v1/users` → Trả danh sách người dùng.
* `GET /api/v2/users` → Thêm phân trang (limit, offset).

### 🔧 **Code Mẫu**

#### `main.go`

```go
package main

import (
	"github.com/gin-gonic/gin"
	v1 "your_project/internal/handlers/v1"
	v2 "your_project/internal/handlers/v2"
)

func main() {
	r := gin.Default()

	v1Group := r.Group("/api/v1")
	{
		v1Group.GET("/users", v1.GetUsers)
	}

	v2Group := r.Group("/api/v2")
	{
		v2Group.GET("/users", v2.GetUsers)
	}

	r.Run(":8080")
}
```

#### `internal/models/user.go`

```go
package models

type User struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
```

#### `internal/handlers/v1/user_handler.go`

```go
package v1

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"your_project/internal/models"
)

func GetUsers(c *gin.Context) {
	users := []models.User{
		{ID: 1, Name: "Alice"},
		{ID: 2, Name: "Bob"},
	}
	c.JSON(http.StatusOK, users)
}
```

#### `internal/handlers/v2/user_handler.go`

```go
package v2

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"your_project/internal/models"
)

func GetUsers(c *gin.Context) {
	// Giả sử có 100 users
	users := make([]models.User, 0, 100)
	for i := 1; i <= 100; i++ {
		users = append(users, models.User{ID: i, Name: "User " + strconv.Itoa(i)})
	}

	// Phân trang
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	end := offset + limit
	if end > len(users) {
		end = len(users)
	}

	c.JSON(http.StatusOK, users[offset:end])
}
```

## 🏆 **Bài tập thực hành có lời giải**

### ✅ Đề bài:

> Tạo 2 phiên bản API `/api/v1/products` và `/api/v2/products`.
>
> * V1: Trả danh sách sản phẩm.
> * V2: Trả danh sách + trường `"category"` và hỗ trợ phân trang (`limit`, `offset`).

### 🧠 Giải:

#### `internal/models/product.go`

```go
package models

type Product struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Category string `json:"category,omitempty"`
}
```

#### `internal/handlers/v1/product_handler.go`

```go
package v1

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"your_project/internal/models"
)

func GetProducts(c *gin.Context) {
	products := []models.Product{
		{ID: 1, Name: "Laptop"},
		{ID: 2, Name: "Smartphone"},
	}
	c.JSON(http.StatusOK, products)
}
```

#### `internal/handlers/v2/product_handler.go`

```go
package v2

import (
	"net/http"
	"strconv"
	"github.com/gin-gonic/gin"
	"your_project/internal/models"
)

func GetProducts(c *gin.Context) {
	allProducts := []models.Product{
		{ID: 1, Name: "Laptop", Category: "Electronics"},
		{ID: 2, Name: "Smartphone", Category: "Electronics"},
		{ID: 3, Name: "Desk", Category: "Furniture"},
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "2"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	end := offset + limit
	if end > len(allProducts) {
		end = len(allProducts)
	}

	c.JSON(http.StatusOK, allProducts[offset:end])
}
```

## 🔑 **Những điểm quan trọng cần lưu ý**

| Chủ đề                                     | Ghi nhớ                                   |
| ------------------------------------------ | ----------------------------------------- |
| ✅ Versioning cần thiết                     | Tránh làm hỏng client cũ khi cập nhật API |
| ✅ Ưu tiên URL versioning                   | Vì dễ debug, dễ triển khai trong Gin      |
| ❌ Không trộn logic giữa v1/v2              | Mỗi version nên có handler riêng          |
| ❗ Phải test lại toàn bộ khi update version | Đảm bảo backward compatibility            |

## 📝 **Bài tập về nhà**

### ✅ Đề bài:

Tạo 2 phiên bản API `/api/v1/users/:id` và `/api/v2/users/:id`.

* V1: Trả thông tin người dùng (id, name).
* V2: Trả thêm email và ngày tạo `created_at` theo ISO8601.

> Gợi ý: Dùng `time.Now().Format(time.RFC3339)` cho `created_at`.

## 🎬 Kết luận

> Trong thực tế, việc triển khai versioning là **bắt buộc** với bất kỳ hệ thống API có quy mô từ vừa trở lên. Cách triển khai theo URL như bài học này không chỉ dễ dùng mà còn giúp bạn **quản lý version rõ ràng, dễ maintain**, và chuẩn bị tốt cho các thay đổi trong tương lai.

