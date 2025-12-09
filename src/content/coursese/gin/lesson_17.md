

# BÀI 17: TESTING GIN APPLICATIONS

## 🎯 MỤC TIÊU BÀI HỌC

Sau bài học này, học viên sẽ:

* Hiểu được tầm quan trọng của testing trong phát triển ứng dụng Gin.
* Nắm rõ cách viết **unit test** cho các handler trong Gin.
* Biết cách viết **integration test** để kiểm tra toàn bộ flow với test database.
* Hiểu về **mocking** dependencies để cô lập code cần test (ví dụ: mock database).
* Biết cách đo và cải thiện **test coverage** cho dự án Gin.
* Có thể áp dụng quy trình test vào CI/CD pipeline.

## 📝 NỘI DUNG CHI TIẾT

### 1. Tổng quan về Testing trong Gin

* **Testing là gì?**
  Là quá trình chạy các đoạn code kiểm tra (test cases) nhằm xác minh rằng các phần của ứng dụng hoạt động đúng như kỳ vọng.

* **Các loại test phổ biến:**

  * **Unit Test:** Kiểm tra từng thành phần nhỏ, thường là một hàm hoặc một handler riêng lẻ.
  * **Integration Test:** Kiểm tra sự phối hợp của nhiều thành phần, ví dụ cả handler và database.
  * **End-to-End Test:** Kiểm tra toàn bộ ứng dụng từ đầu đến cuối (phía client và server), ít gặp trong phạm vi bài học Gin.

* **Tại sao cần test trong Gin?**

  * Đảm bảo code chạy đúng.
  * Giúp phát hiện bug sớm.
  * Hỗ trợ refactoring và mở rộng dự án an toàn.

### 2. Cấu trúc dự án mẫu theo kiến trúc yêu cầu

```plaintext
my-gin-app/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── user_handler.go
│   ├── models/
│   │   └── user.go
│   ├── services/
│   │   └── user_service.go
├── go.mod
└── go.sum
```

* `handlers/`: Chứa các HTTP handlers (controller).
* `models/`: Định nghĩa các struct model.
* `services/`: Logic nghiệp vụ, tương tác DB hoặc external service.

> **Lưu ý:** Việc tách service giúp dễ dàng mock khi test.

### 3. Viết Unit Test cho Gin Handlers

#### Khái niệm Unit Test

* Unit test là test riêng lẻ từng hàm, không phụ thuộc vào DB hoặc các service bên ngoài.
* Để test handler, ta thường **mock** các service để kiểm soát dữ liệu.

#### Ví dụ: Unit Test handler tạo user

**Mô tả bài toán:**
Viết unit test cho handler `CreateUser` nhận JSON user, gọi service tạo user, trả về JSON kết quả.

**Code mẫu:**

**internal/models/user.go**

```go
package models

type User struct {
    ID    uint   `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}
```

**internal/services/user\_service.go**

```go
package services

import "my-gin-app/internal/models"

type UserService interface {
    CreateUser(user *models.User) (*models.User, error)
}

type userService struct{}

func NewUserService() UserService {
    return &userService{}
}

func (s *userService) CreateUser(user *models.User) (*models.User, error) {
    // Giả sử lưu DB ở đây, tạm return user với ID 1
    user.ID = 1
    return user, nil
}
```

**internal/handlers/user\_handler.go**

```go
package handlers

import (
    "net/http"
    "my-gin-app/internal/models"
    "my-gin-app/internal/services"

    "github.com/gin-gonic/gin"
)

type UserHandler struct {
    service services.UserService
}

func NewUserHandler(s services.UserService) *UserHandler {
    return &UserHandler{service: s}
}

func (h *UserHandler) CreateUser(c *gin.Context) {
    var user models.User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    createdUser, err := h.service.CreateUser(&user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, createdUser)
}
```

**Unit Test cho handler:**

**internal/handlers/user\_handler\_test.go**

```go
package handlers

import (
    "bytes"
    "errors"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
    "my-gin-app/internal/models"
    "my-gin-app/internal/services"
)

// Mock service để test handler
type mockUserService struct {
    createUserFunc func(user *models.User) (*models.User, error)
}

func (m *mockUserService) CreateUser(user *models.User) (*models.User, error) {
    return m.createUserFunc(user)
}

func TestCreateUser_Success(t *testing.T) {
    gin.SetMode(gin.TestMode)

    mockService := &mockUserService{
        createUserFunc: func(user *models.User) (*models.User, error) {
            user.ID = 123
            return user, nil
        },
    }
    handler := NewUserHandler(mockService)

    // Chuẩn bị request JSON
    jsonStr := `{"name":"John Doe","email":"john@example.com"}`
    req := httptest.NewRequest(http.MethodPost, "/users", bytes.NewBufferString(jsonStr))
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()

    c, _ := gin.CreateTestContext(w)
    c.Request = req

    handler.CreateUser(c)

    assert.Equal(t, http.StatusCreated, w.Code)
    expected := `{"id":123,"name":"John Doe","email":"john@example.com"}`
    assert.JSONEq(t, expected, w.Body.String())
}

func TestCreateUser_BadRequest(t *testing.T) {
    gin.SetMode(gin.TestMode)

    mockService := &mockUserService{}
    handler := NewUserHandler(mockService)

    jsonStr := `{"name":"", "email":"not-an-email"}`
    req := httptest.NewRequest(http.MethodPost, "/users", bytes.NewBufferString(jsonStr))
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()

    c, _ := gin.CreateTestContext(w)
    c.Request = req

    handler.CreateUser(c)

    assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestCreateUser_ServiceError(t *testing.T) {
    gin.SetMode(gin.TestMode)

    mockService := &mockUserService{
        createUserFunc: func(user *models.User) (*models.User, error) {
            return nil, errors.New("service failure")
        },
    }
    handler := NewUserHandler(mockService)

    jsonStr := `{"name":"John","email":"john@example.com"}`
    req := httptest.NewRequest(http.MethodPost, "/users", bytes.NewBufferString(jsonStr))
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()

    c, _ := gin.CreateTestContext(w)
    c.Request = req

    handler.CreateUser(c)

    assert.Equal(t, http.StatusInternalServerError, w.Code)
    assert.Contains(t, w.Body.String(), "service failure")
}
```

### 4. Viết Integration Test với Test Database

#### Khái niệm Integration Test

* Integration test kiểm tra nhiều phần phối hợp, ví dụ handler + service + DB thật.
* Thường cần setup môi trường test database riêng (sqlite in-memory hoặc PostgreSQL test DB).
* Kiểm thử full flow API.

#### Ví dụ: Test API tạo user với sqlite in-memory

**Setup DB dùng GORM trong test**

**internal/services/user\_service.go** (bổ sung hàm khởi tạo với DB)

```go
package services

import (
    "gorm.io/gorm"
    "my-gin-app/internal/models"
)

type userService struct {
    db *gorm.DB
}

func NewUserService(db *gorm.DB) UserService {
    return &userService{db: db}
}

func (s *userService) CreateUser(user *models.User) (*models.User, error) {
    if err := s.db.Create(user).Error; err != nil {
        return nil, err
    }
    return user, nil
}
```

**Integration test**:

**internal/handlers/user\_handler\_integration\_test.go**

```go
package handlers

import (
    "bytes"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"

    "my-gin-app/internal/models"
    "my-gin-app/internal/services"
)

func setupRouterWithDB() (*gin.Engine, *gorm.DB) {
    gin.SetMode(gin.TestMode)

    db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
    if err != nil {
        panic("failed to connect database")
    }
    db.AutoMigrate(&models.User{})

    userService := services.NewUserService(db)
    userHandler := NewUserHandler(userService)

    router := gin.Default()
    router.POST("/users", userHandler.CreateUser)
    return router, db
}

func TestCreateUser_Integration(t *testing.T) {
    router, db := setupRouterWithDB()

    jsonStr := `{"name":"Integration Test","email":"inttest@example.com"}`
    req := httptest.NewRequest(http.MethodPost, "/users", bytes.NewBufferString(jsonStr))
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()

    router.ServeHTTP(w, req)

    assert.Equal(t, http.StatusCreated, w.Code)
    var user models.User
    err := db.First(&user, "email = ?", "inttest@example.com").Error
    assert.NoError(t, err)
    assert.Equal(t, "Integration Test", user.Name)
}
```

### 5. Mocking trong Testing

* Khi test, không muốn gọi DB thật hoặc dịch vụ bên ngoài → sử dụng **mock**.
* Ở trên đã dùng `mockUserService` để mô phỏng service.
* Các thư viện hỗ trợ mocking: `testify/mock`, `gomock`...
* Mock giúp cô lập và kiểm soát hành vi khi test.

### 6. Đo test coverage

* Sử dụng câu lệnh: `go test -cover ./...` để đo độ bao phủ mã nguồn.
* Giúp xác định phần code chưa có test.
* Cần tối ưu test coverage > 80% cho phần quan trọng.

### 7. Thiết lập CI/CD với tests

* Trong pipeline (GitHub Actions, GitLab CI...), chạy lệnh `go test ./...` và check kết quả.
* Nếu test fail → pipeline fail, không cho deploy.
* Giúp đảm bảo chất lượng liên tục.

## 🏆 BÀI TẬP THỰC HÀNH CÓ LỜI GIẢI

### Đề bài

Tạo một API quản lý `Product` với các chức năng:

* POST `/products`: tạo sản phẩm mới với JSON `{ "name": string, "price": float }`.
* Viết **unit test** cho handler POST `/products`, bao gồm:

  * Test thành công trả về 201 với dữ liệu đúng.
  * Test lỗi invalid JSON trả về 400.
  * Test lỗi service trả về 500.

Áp dụng kiến trúc dự án như mẫu.

### Lời giải chi tiết

**internal/models/product.go**

```go
package models

type Product struct {
    ID    uint    `json:"id"`
    Name  string  `json:"name"`
    Price float64 `json:"price"`
}
```

**internal/services/product\_service.go**

```go
package services

import "my-gin-app/internal/models"

type ProductService interface {
    CreateProduct(product *models.Product) (*models.Product, error)
}

type productService struct{}

func NewProductService() ProductService {
    return &productService{}
}

func (s *productService) CreateProduct(product *models.Product) (*models.Product, error) {
    product.ID = 1 // Giả lập DB
    return product, nil
}
```

**internal/handlers/product\_handler.go**

```go
package handlers

import (
    "net/http"
    "my-gin-app/internal/models"
    "my-gin-app/internal/services"

    "github.com/gin-gonic/gin"
)

type ProductHandler struct {
    service services.ProductService
}

func NewProductHandler(s services.ProductService) *ProductHandler {
    return &ProductHandler{service: s}
}

func (h *ProductHandler) CreateProduct(c *gin.Context) {
    var product models.Product
    if err := c.ShouldBindJSON(&product); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    created, err := h.service.CreateProduct(&product)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, created)
}
```

**internal/handlers/product\_handler\_test.go**

```go
package handlers

import (
    "bytes"
    "errors"
    "net/http"
    "net/http/httptest"
    "testing"

    "github.com/gin-gonic/gin"
    "github.com/stretchr/testify/assert"
    "my-gin-app/internal/models"
    "my-gin-app/internal/services"
)

type mockProductService struct {
    createFunc func(product *models.Product) (*models.Product, error)
}

func (m *mockProductService) CreateProduct(product *models.Product) (*models.Product, error) {
    return m.createFunc(product)
}

func TestCreateProduct_Success(t *testing.T) {
    gin.SetMode(gin.TestMode)

    mockSvc := &mockProductService{
        createFunc: func(p *models.Product) (*models.Product, error) {
            p.ID = 101
            return p, nil
        },
    }
    handler := NewProductHandler(mockSvc)

    jsonStr := `{"name":"Test Product","price":123.45}`
    req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBufferString(jsonStr))
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()

    c, _ := gin.CreateTestContext(w)
    c.Request = req

    handler.CreateProduct(c)

    assert.Equal(t, http.StatusCreated, w.Code)
    expected := `{"id":101,"name":"Test Product","price":123.45}`
    assert.JSONEq(t, expected, w.Body.String())
}

func TestCreateProduct_BadRequest(t *testing.T) {
    gin.SetMode(gin.TestMode)

    mockSvc := &mockProductService{}
    handler := NewProductHandler(mockSvc)

    jsonStr := `{"name":123, "price":"abc"}`
    req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBufferString(jsonStr))
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()

    c, _ := gin.CreateTestContext(w)
    c.Request = req

    handler.CreateProduct(c)

    assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestCreateProduct_ServiceError(t *testing.T) {
    gin.SetMode(gin.TestMode)

    mockSvc := &mockProductService{
        createFunc: func(p *models.Product) (*models.Product, error) {
            return nil, errors.New("service failure")
        },
    }
    handler := NewProductHandler(mockSvc)

    jsonStr := `{"name":"Prod","price":50}`
    req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewBufferString(jsonStr))
    req.Header.Set("Content-Type", "application/json")
    w := httptest.NewRecorder()

    c, _ := gin.CreateTestContext(w)
    c.Request = req

    handler.CreateProduct(c)

    assert.Equal(t, http.StatusInternalServerError, w.Code)
    assert.Contains(t, w.Body.String(), "service failure")
}
```

## 🔑 NHỮNG ĐIỂM QUAN TRỌNG CẦN LƯU Ý

* **Phân tách rõ ràng handler và service** để dễ dàng mock service khi test handler.
* Dùng `httptest.NewRecorder()` và `gin.CreateTestContext()` để test handler mà không cần chạy server.
* Test cần cover cả trường hợp thành công và lỗi (ví dụ invalid input, lỗi service).
* Với integration test, sử dụng database in-memory (sqlite) để test luồng dữ liệu thật.
* Luôn set `gin.SetMode(gin.TestMode)` khi test để giảm log không cần thiết.
* Dùng thư viện `testify/assert` giúp viết test dễ đọc và ngắn gọn hơn.
* Đo test coverage để đảm bảo test đủ và giúp phát hiện thiếu sót.

## 📝 BÀI TẬP VỀ NHÀ

### Đề bài:

1. Xây dựng API quản lý `Order` gồm các trường: `ID`, `ProductID`, `Quantity`.
2. Viết handler POST `/orders` tạo mới order.
3. Viết unit test cho handler với mock service, test các trường hợp: thành công, lỗi invalid JSON, lỗi service.
4. Viết integration test với sqlite in-memory để test handler + service + DB.
5. Báo cáo test coverage của module `internal/handlers/order_handler.go`.

### Gợi ý:

* Áp dụng kiến trúc tách handler - service - model như bài học.
* Sử dụng thư viện `github.com/stretchr/testify` để assert.
* Sử dụng `gorm.io/driver/sqlite` cho test DB in-memory.
* Chạy test với lệnh:
