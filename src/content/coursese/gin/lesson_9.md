
# Bài 9: Database Integration với GORM

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ GORM là gì và vai trò trong phát triển ứng dụng Golang.
* Biết cách thiết lập kết nối đến database (MySQL/PostgreSQL) với GORM trong dự án Gin.
* Nắm được cách định nghĩa model, cấu hình migration tự động.
* Thực hiện được các thao tác CRUD cơ bản sử dụng GORM.
* Áp dụng kiến thức để xây dựng API quản lý người dùng hoàn chỉnh với Gin và GORM theo kiến trúc chuẩn.

## 📝 Nội dung chi tiết

### 1. Giới thiệu GORM

**GORM là gì?**

GORM là một ORM (Object-Relational Mapping) phổ biến nhất trong cộng đồng Golang, giúp chúng ta tương tác với database bằng cách thao tác trực tiếp trên struct và method mà không cần viết SQL thủ công nhiều.

**Lợi ích của GORM:**

* Tự động mapping struct thành bảng trong database.
* Hỗ trợ migration schema tự động.
* Hỗ trợ CRUD dễ dàng.
* Hỗ trợ các quan hệ giữa bảng.
* Tối ưu truy vấn, hỗ trợ transactions, hooks.

### 2. Cài đặt GORM và driver database

Ví dụ dưới đây dùng MySQL (có thể thay bằng PostgreSQL, SQLite,...)

```bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/mysql
```

### 3. Thiết lập database connection

Đầu tiên, cần cấu hình kết nối đến DB trong `internal/models/db.go` để dễ dàng tái sử dụng.

**Giải thích:**
Chúng ta sẽ tạo một hàm `InitDB()` để mở kết nối, quản lý lỗi, cấu hình migration, và trả về đối tượng DB.

### 4. Định nghĩa model (struct)

Ví dụ model User:

* ID tự động tăng
* Name, Email, Password
* Timestamp: CreatedAt, UpdatedAt

GORM có hỗ trợ tự động xử lý các trường timestamp này.

### 5. Migration schema tự động

GORM hỗ trợ `AutoMigrate` giúp tạo bảng và chỉnh sửa schema dựa trên struct.

### 6. Các thao tác CRUD cơ bản

* Create: thêm bản ghi mới
* Read: lấy bản ghi (theo ID, all, filter)
* Update: cập nhật bản ghi
* Delete: xóa bản ghi

### 7. Áp dụng thực tế: Xây dựng API quản lý người dùng với Gin + GORM

* API endpoints:

  * GET `/users` — danh sách user
  * GET `/users/:id` — xem chi tiết user
  * POST `/users` — tạo user mới
  * PUT `/users/:id` — cập nhật user
  * DELETE `/users/:id` — xóa user

## 🔥 Ví dụ thực hành với lời giải chi tiết

### 1. Cấu trúc thư mục

```
project-root/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── user.go
│   ├── models/
│   │   ├── db.go
│   │   └── user.go
├── go.mod
└── go.sum
```

### 2. Code chi tiết từng phần

#### internal/models/db.go

```go
package models

import (
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "log"
)

var DB *gorm.DB

func InitDB(dsn string) {
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatalf("Failed to connect to database: %v", err)
    }

    DB = db

    // Auto migration
    err = DB.AutoMigrate(&User{})
    if err != nil {
        log.Fatalf("AutoMigrate failed: %v", err)
    }
}
```

#### internal/models/user.go

```go
package models

import (
    "time"
)

type User struct {
    ID        uint      `gorm:"primaryKey" json:"id"`
    Name      string    `gorm:"type:varchar(100);not null" json:"name"`
    Email     string    `gorm:"uniqueIndex;type:varchar(100);not null" json:"email"`
    Password  string    `gorm:"type:varchar(255);not null" json:"-"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}
```

#### internal/handlers/user.go

```go
package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "your_module_name/internal/models"
)

// GET /users
func GetUsers(c *gin.Context) {
    var users []models.User
    result := models.DB.Find(&users)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
        return
    }
    c.JSON(http.StatusOK, users)
}

// GET /users/:id
func GetUserByID(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    var user models.User
    result := models.DB.First(&user, id)
    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }
    c.JSON(http.StatusOK, user)
}

// POST /users
func CreateUser(c *gin.Context) {
    var input struct {
        Name     string `json:"name" binding:"required"`
        Email    string `json:"email" binding:"required,email"`
        Password string `json:"password" binding:"required,min=6"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    user := models.User{
        Name:     input.Name,
        Email:    input.Email,
        Password: input.Password, // Chú ý: thực tế cần hash password trước lưu
    }

    if err := models.DB.Create(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, user)
}

// PUT /users/:id
func UpdateUser(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    var user models.User
    if err := models.DB.First(&user, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    var input struct {
        Name     *string `json:"name"`
        Email    *string `json:"email"`
        Password *string `json:"password"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if input.Name != nil {
        user.Name = *input.Name
    }
    if input.Email != nil {
        user.Email = *input.Email
    }
    if input.Password != nil {
        user.Password = *input.Password
    }

    if err := models.DB.Save(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, user)
}

// DELETE /users/:id
func DeleteUser(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    if err := models.DB.Delete(&models.User{}, id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}
```

#### cmd/main.go

```go
package main

import (
    "github.com/gin-gonic/gin"
    "your_module_name/internal/handlers"
    "your_module_name/internal/models"
    "log"
    "os"
)

func main() {
    // DSN ví dụ MySQL: "user:password@tcp(localhost:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
    dsn := os.Getenv("MYSQL_DSN")
    if dsn == "" {
        log.Fatal("Please set MYSQL_DSN environment variable")
    }

    models.InitDB(dsn)

    r := gin.Default()

    userRoutes := r.Group("/users")
    {
        userRoutes.GET("", handlers.GetUsers)
        userRoutes.GET("/:id", handlers.GetUserByID)
        userRoutes.POST("", handlers.CreateUser)
        userRoutes.PUT("/:id", handlers.UpdateUser)
        userRoutes.DELETE("/:id", handlers.DeleteUser)
    }

    r.Run(":8080")
}
```

## 🏆 Bài tập thực hành có lời giải

### Đề bài:

Xây dựng API quản lý sản phẩm (Product) với các trường:

* ID (tự tăng)
* Name (string, không được để trống)
* Price (float64, lớn hơn 0)
* Description (string, có thể để trống)

Yêu cầu:

* Cài đặt model Product với GORM
* Thiết lập migration tự động
* Xây dựng các API CRUD tương tự như User
* Validate dữ liệu đầu vào (name required, price > 0)
* Trả về các lỗi rõ ràng khi validate không hợp lệ

### Lời giải:

1. Tạo `internal/models/product.go`

```go
package models

type Product struct {
    ID          uint    `gorm:"primaryKey" json:"id"`
    Name        string  `gorm:"type:varchar(255);not null" json:"name"`
    Price       float64 `gorm:"not null" json:"price"`
    Description string  `gorm:"type:text" json:"description,omitempty"`
}
```

2. Sửa `internal/models/db.go` thêm migration Product

```go
// ... phần InitDB ...
err = DB.AutoMigrate(&User{}, &Product{})
```

3. Tạo `internal/handlers/product.go`

```go
package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "your_module_name/internal/models"
)

func GetProducts(c *gin.Context) {
    var products []models.Product
    if err := models.DB.Find(&products).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, products)
}

func GetProductByID(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }
    var product models.Product
    if err := models.DB.First(&product, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
        return
    }
    c.JSON(http.StatusOK, product)
}

func CreateProduct(c *gin.Context) {
    var input struct {
        Name        string  `json:"name" binding:"required"`
        Price       float64 `json:"price" binding:"required,gt=0"`
        Description string  `json:"description"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    product := models.Product{
        Name:        input.Name,
        Price:       input.Price,
        Description: input.Description,
    }

    if err := models.DB.Create(&product).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, product)
}

func UpdateProduct(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }

    var product models.Product
    if err := models.DB.First(&product, id).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
        return
    }

    var input struct {
        Name        *string  `json:"name"`
        Price       *float64 `json:"price" binding:"omitempty,gt=0"`
        Description *string  `json:"description"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if input.Name != nil {
        product.Name = *input.Name
    }
    if input.Price != nil {
        product.Price = *input.Price
    }
    if input.Description != nil {
        product.Description = *input.Description
    }

    if err := models.DB.Save(&product).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, product)
}

func DeleteProduct(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }

    if err := models.DB.Delete(&models.Product{}, id).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Product deleted"})
}
```

4. Sửa `cmd/main.go` thêm router:

```go
productRoutes := r.Group("/products")
{
    productRoutes.GET("", handlers.GetProducts)
    productRoutes.GET("/:id", handlers.GetProductByID)
    productRoutes.POST("", handlers.CreateProduct)
    productRoutes.PUT("/:id", handlers.UpdateProduct)
    productRoutes.DELETE("/:id", handlers.DeleteProduct)
}
```

## 🔑 Những điểm quan trọng cần lưu ý

* **DSN (Data Source Name)** phải chính xác để kết nối DB thành công, chú ý phần `parseTime=True` để GORM xử lý thời gian đúng.
* `AutoMigrate` chỉ giúp tạo và cập nhật bảng cơ bản, không nên phụ thuộc hoàn toàn khi có thay đổi phức tạp.
* GORM tự động quản lý trường `ID`, `CreatedAt`, `UpdatedAt` nếu đặt đúng kiểu.
* Luôn validate dữ liệu đầu vào trước khi thao tác với DB để tránh lỗi và bảo mật.
* Trong thực tế, không lưu password thuần, cần hash trước khi lưu.
* Sử dụng con trỏ trong input để phân biệt trường có được gửi hay không khi update.
* Xử lý lỗi kỹ, trả về response rõ ràng giúp client dễ debug.

## 📝 Bài tập về nhà

**Đề bài:**

Xây dựng API quản lý `Order` với các trường:

* ID (uint, tự tăng)
* UserID (uint, không null)
* ProductID (uint, không null)
* Quantity (int, lớn hơn 0)
* TotalPrice (float64) — tự tính = Quantity \* Product.Price

Yêu cầu:

* Định nghĩa model và migration tự động.
* Xây dựng các API CRUD với validate đầu vào.
* Khi tạo hoặc cập nhật Order, tự động tính lại `TotalPrice` dựa trên `Product.Price`.
* Tạo API `GET /orders/user/:userID` để lấy danh sách đơn hàng theo user.
* Viết code tuân thủ cấu trúc dự án, rõ ràng, dễ bảo trì.

