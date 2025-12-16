

# Bài 10: Advanced GORM Operations

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu và áp dụng được các kiểu **quan hệ giữa các bảng (Associations)** trong GORM: One-to-One, One-to-Many, Many-to-Many.
* Thực hiện các truy vấn phức tạp với **joins** và **preloading** để tối ưu hiệu suất.
* Sử dụng **transaction** để đảm bảo tính nhất quán dữ liệu trong các thao tác phức tạp.
* Tận dụng **hooks (callbacks)** để tự động xử lý logic trước/sau các thao tác database.
* Xây dựng API đơn giản mô hình Blog với User và Post có mối quan hệ One-to-Many.

## 📝 Nội dung chi tiết

### 1. **Associations trong GORM**

**Khái niệm:**
Associations là cách GORM giúp quản lý các mối quan hệ giữa các bảng trong database, ví dụ:

* **One-to-One:** Một record trong bảng A tương ứng với một record trong bảng B.
* **One-to-Many:** Một record trong bảng A có thể có nhiều record liên quan trong bảng B.
* **Many-to-Many:** Nhiều record trong bảng A có thể liên kết với nhiều record trong bảng B, thông qua bảng trung gian (join table).

### 2. **Mô hình hóa các Associations**

GORM hỗ trợ tự động thiết lập quan hệ dựa trên các struct tags và tên trường.

Ví dụ:

* `User` có nhiều `Post` (One-to-Many).
* `Post` thuộc về `User`.

GORM tự động tạo khóa ngoại (`UserID`) và liên kết.

### 3. **Query Optimization: Preloading & Joins**

* **Preload:** Nạp dữ liệu quan hệ (eager loading) để tránh N+1 query.
* **Joins:** Sử dụng join SQL để truy vấn phức tạp hơn.

### 4. **Transactions**

* Đóng gói nhiều thao tác database thành một khối.
* Nếu có lỗi, rollback để tránh dữ liệu không nhất quán.

### 5. **Hooks (Callbacks)**

* Các hàm tự động gọi trước hoặc sau khi thao tác dữ liệu (Create, Update, Delete...).
* Dùng để validate, logging, hay chuẩn hóa dữ liệu.

## Ví dụ minh họa dự án Gin + GORM theo cấu trúc:

```
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── blog.go
│   ├── models/
│   │   └── blog.go
│   └── db/
│       └── db.go
├── go.mod
└── go.sum
```

### 1. **Mô hình dữ liệu (models/blog.go)**

```go
package models

import (
    "gorm.io/gorm"
    "time"
)

type User struct {
    ID        uint           `gorm:"primaryKey" json:"id"`
    Name      string         `json:"name"`
    Email     string         `gorm:"uniqueIndex" json:"email"`
    Posts     []Post         `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"posts"`
    CreatedAt time.Time      `json:"created_at"`
    UpdatedAt time.Time      `json:"updated_at"`
}

type Post struct {
    ID        uint           `gorm:"primaryKey" json:"id"`
    Title     string         `json:"title"`
    Content   string         `json:"content"`
    UserID    uint           `json:"user_id"` // khóa ngoại liên kết với User
    CreatedAt time.Time      `json:"created_at"`
    UpdatedAt time.Time      `json:"updated_at"`
}

// Hook: Tự động kiểm tra tiêu đề bài post trước khi tạo
func (p *Post) BeforeCreate(tx *gorm.DB) (err error) {
    if len(p.Title) < 5 {
        return tx.AddError(gorm.ErrInvalidData) // hoặc tạo error custom
    }
    return nil
}
```

### 2. **Cấu hình database (internal/db/db.go)**

```go
package db

import (
    "log"
    "gorm.io/driver/sqlite" // Hoặc mysql/postgres
    "gorm.io/gorm"

    "your_module_path/internal/models"
)

var DB *gorm.DB

func ConnectDatabase() {
    var err error
    DB, err = gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect database: ", err)
    }

    // Tự động migrate
    err = DB.AutoMigrate(&models.User{}, &models.Post{})
    if err != nil {
        log.Fatal("AutoMigrate failed: ", err)
    }
}
```

### 3. **Handler ví dụ: CRUD với quan hệ (internal/handlers/blog.go)**

```go
package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"

    "your_module_path/internal/db"
    "your_module_path/internal/models"
)

// Tạo User kèm Post (sử dụng transaction)
func CreateUserWithPosts(c *gin.Context) {
    var input struct {
        Name  string           `json:"name" binding:"required"`
        Email string           `json:"email" binding:"required,email"`
        Posts []models.Post    `json:"posts"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    err := db.DB.Transaction(func(tx *gorm.DB) error {
        user := models.User{
            Name:  input.Name,
            Email: input.Email,
            Posts: input.Posts,
        }
        if err := tx.Create(&user).Error; err != nil {
            return err
        }
        return nil
    })

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "User and posts created successfully"})
}

// Lấy User kèm Posts (preload)
func GetUserWithPosts(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user id"})
        return
    }

    var user models.User
    if err := db.DB.Preload("Posts").First(&user, id).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        }
        return
    }

    c.JSON(http.StatusOK, user)
}
```

### 4. **main.go**

```go
package main

import (
    "your_module_path/internal/db"
    "your_module_path/internal/handlers"

    "github.com/gin-gonic/gin"
)

func main() {
    db.ConnectDatabase()

    r := gin.Default()

    v1 := r.Group("/api/v1")
    {
        v1.POST("/users", handlers.CreateUserWithPosts)
        v1.GET("/users/:id", handlers.GetUserWithPosts)
    }

    r.Run(":8080")
}
```

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài:

**Xây dựng API quản lý Blog với các yêu cầu:**

* Model `User` và `Post` có quan hệ One-to-Many (1 user có nhiều bài post).
* Tạo endpoint tạo mới user kèm danh sách bài post (sử dụng transaction để đảm bảo tính nhất quán).
* Tạo endpoint lấy thông tin user kèm danh sách bài post (dùng Preload).
* Áp dụng hook kiểm tra tiêu đề bài viết trước khi tạo (tiêu đề phải >= 5 ký tự).
* Xử lý lỗi và trả về response phù hợp.

### Lời giải & phân tích

* **Step 1:** Tạo models User và Post với mối quan hệ rõ ràng.
* **Step 2:** Định nghĩa hook BeforeCreate cho Post để kiểm tra tiêu đề.
* **Step 3:** Viết handler `CreateUserWithPosts` sử dụng transaction `db.DB.Transaction` để tạo user và posts đồng thời.
* **Step 4:** Viết handler `GetUserWithPosts` dùng `Preload("Posts")` để nạp bài viết cùng user.
* **Step 5:** Thêm validation input JSON và xử lý lỗi trả về client.
* **Step 6:** Test API qua Postman hoặc curl.

## 🔑 Những điểm quan trọng cần lưu ý

* **Association Types:**
  GORM tự động nhận dạng quan hệ dựa trên tên struct và khóa ngoại (`UserID`). Nên đặt đúng tên trường để tránh lỗi.

* **Preload vs Joins:**
  `Preload` thích hợp để load quan hệ đơn giản, dễ dùng. `Joins` dùng khi cần điều kiện lọc phức tạp hoặc tính toán trên nhiều bảng.

* **Transaction:**
  Dùng transaction để đảm bảo atomicity, rollback nếu có lỗi xảy ra trong quá trình thao tác đa bước.

* **Hooks:**
  Hooks giúp đảm bảo dữ liệu hợp lệ trước khi thao tác, nhưng không nên để logic quá phức tạp trong hook để tránh khó debug.

* **Error Handling:**
  Luôn kiểm tra lỗi khi thao tác với database và trả về response rõ ràng, giúp client dễ dàng xử lý.

## 📝 Bài tập về nhà

### Đề bài:

**Mở rộng API Blog:**

* Thêm quan hệ Many-to-Many giữa `Post` và `Tag` (ví dụ: mỗi bài post có thể có nhiều tag, mỗi tag có thể thuộc nhiều bài post).
* Tạo model `Tag` với trường `Name`.
* Viết endpoint tạo mới post kèm tag (nếu tag chưa tồn tại thì tạo mới).
* Viết endpoint lấy bài post cùng danh sách tag của nó.
* Thực hiện preload tags khi lấy post.
* Kiểm tra và xử lý lỗi hợp lệ (vd: tên tag không được để trống).

### Yêu cầu:

* Áp dụng kiến thức về Many-to-Many association trong GORM.
* Sử dụng transaction khi tạo post và tag liên quan.
* Viết API tuân thủ kiến trúc dự án.
* Có comments và giải thích rõ ràng trong code.

