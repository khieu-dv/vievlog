

# BÀI 21: MICROservices VỚI GIN

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu được **khái niệm Microservices** và lý do vì sao nên sử dụng kiến trúc này thay vì Monolith.
* Nắm rõ các **thành phần cơ bản của Microservices** như service discovery, API Gateway, inter-service communication.
* Biết cách **chia một ứng dụng Gin monolith thành các microservices** riêng biệt.
* Thực hành **tạo 2 microservices đơn giản bằng Gin**, tổ chức theo kiến trúc thư mục chuẩn.
* Biết cách **giao tiếp giữa các microservices bằng HTTP REST**.
* Hiểu và triển khai **API Gateway đơn giản** để tập trung quản lý các microservices.
* Nắm các lưu ý quan trọng khi xây dựng microservices với Gin.

## 📝 Nội dung chi tiết

### 1. Microservices là gì?

* **Định nghĩa:** Microservices là kiến trúc xây dựng ứng dụng dưới dạng tập hợp các dịch vụ nhỏ, độc lập, mỗi dịch vụ thực hiện một chức năng riêng biệt.
* **Ưu điểm:** Dễ bảo trì, phát triển song song, mở rộng linh hoạt, deploy độc lập.
* **Khác biệt so với Monolith:** Monolith là ứng dụng lớn gộp chung mọi chức năng, microservices tách nhỏ theo domain.

**Ví dụ:** Một ứng dụng e-commerce có thể chia thành các dịch vụ: User Service, Product Service, Order Service, Payment Service.

### 2. Các thành phần chính trong hệ thống microservices

* **Service Discovery:** Giúp các dịch vụ tìm thấy nhau (vd: Consul, etcd, hay hard-code host\:port cho đơn giản).
* **Inter-service communication:** Thường dùng HTTP REST hoặc gRPC.
* **API Gateway:** Cổng duy nhất client gọi vào, API Gateway chuyển tiếp request tới các microservices tương ứng.
* **Authentication và Authorization:** Có thể làm tại API Gateway hoặc riêng từng service.

### 3. Ví dụ minh họa: Tách Monolith thành 2 microservices đơn giản

* **User Service:** Quản lý người dùng (đăng ký, thông tin).
* **Product Service:** Quản lý sản phẩm (danh sách, chi tiết).

### 4. Cấu trúc dự án microservice chuẩn (theo yêu cầu)

```
user-service/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── user_handler.go
│   ├── models/
│   │   └── user.go
│   └── services/
│       └── user_service.go
├── go.mod
└── go.sum

product-service/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── product_handler.go
│   ├── models/
│   │   └── product.go
│   └── services/
│       └── product_service.go
├── go.mod
└── go.sum

api-gateway/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   └── routes/
├── go.mod
└── go.sum
```

### 5. Tạo User Service đơn giản với Gin

**Khái niệm:**
User Service cung cấp REST API quản lý người dùng: lấy danh sách người dùng, lấy chi tiết user theo ID.

```go
// internal/models/user.go
package models

type User struct {
    ID   int    `json:"id"`
    Name string `json:"name"`
    Email string `json:"email"`
}

// internal/services/user_service.go
package services

import "errors"

var users = []User{
    {ID: 1, Name: "Alice", Email: "alice@example.com"},
    {ID: 2, Name: "Bob", Email: "bob@example.com"},
}

func GetAllUsers() []User {
    return users
}

func GetUserByID(id int) (User, error) {
    for _, u := range users {
        if u.ID == id {
            return u, nil
        }
    }
    return User{}, errors.New("User not found")
}

// internal/handlers/user_handler.go
package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "your_module/internal/models"
    "your_module/internal/services"
)

func GetUsers(c *gin.Context) {
    users := services.GetAllUsers()
    c.JSON(http.StatusOK, users)
}

func GetUser(c *gin.Context) {
    idParam := c.Param("id")
    id, err := strconv.Atoi(idParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    user, err := services.GetUserByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, user)
}

// cmd/main.go
package main

import (
    "github.com/gin-gonic/gin"
    "your_module/internal/handlers"
)

func main() {
    r := gin.Default()

    r.GET("/users", handlers.GetUsers)
    r.GET("/users/:id", handlers.GetUser)

    r.Run(":8081") // User service chạy cổng 8081
}
```

### 6. Tạo Product Service tương tự

```go
// internal/models/product.go
package models

type Product struct {
    ID    int     `json:"id"`
    Name  string  `json:"name"`
    Price float64 `json:"price"`
}

// internal/services/product_service.go
package services

var products = []Product{
    {ID: 1, Name: "Keyboard", Price: 29.99},
    {ID: 2, Name: "Mouse", Price: 19.99},
}

func GetAllProducts() []Product {
    return products
}

func GetProductByID(id int) (Product, error) {
    for _, p := range products {
        if p.ID == id {
            return p, nil
        }
    }
    return Product{}, errors.New("Product not found")
}

// internal/handlers/product_handler.go
package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "your_module/internal/models"
    "your_module/internal/services"
)

func GetProducts(c *gin.Context) {
    products := services.GetAllProducts()
    c.JSON(http.StatusOK, products)
}

func GetProduct(c *gin.Context) {
    idParam := c.Param("id")
    id, err := strconv.Atoi(idParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
        return
    }

    product, err := services.GetProductByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, product)
}

// cmd/main.go
package main

import (
    "github.com/gin-gonic/gin"
    "your_module/internal/handlers"
)

func main() {
    r := gin.Default()

    r.GET("/products", handlers.GetProducts)
    r.GET("/products/:id", handlers.GetProduct)

    r.Run(":8082") // Product service chạy cổng 8082
}
```

### 7. API Gateway đơn giản

* Là service duy nhất client gọi vào.
* Proxy request đến các microservices tương ứng.

```go
// cmd/main.go
package main

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "net/http/httputil"
    "net/url"
    "log"
)

func reverseProxy(targetHost string) gin.HandlerFunc {
    url, err := url.Parse(targetHost)
    if err != nil {
        log.Fatal(err)
    }
    proxy := httputil.NewSingleHostReverseProxy(url)

    return func(c *gin.Context) {
        proxy.ServeHTTP(c.Writer, c.Request)
    }
}

func main() {
    r := gin.Default()

    // Proxy /users/* tới User service
    r.Any("/users/*proxyPath", reverseProxy("http://localhost:8081"))

    // Proxy /products/* tới Product service
    r.Any("/products/*proxyPath", reverseProxy("http://localhost:8082"))

    r.Run(":8080") // API Gateway chạy cổng 8080
}
```

### 8. Tổng kết kiến thức

* Microservices giúp tách biệt domain rõ ràng, dễ bảo trì.
* Mỗi service chạy độc lập, có thể deploy riêng.
* API Gateway giúp đơn giản hóa client chỉ cần gọi 1 endpoint.
* Giao tiếp giữa các services đơn giản nhất là REST API HTTP.
* Cần lưu ý về authentication, service discovery khi scale thực tế.

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài

Xây dựng một microservice mới tên là **Order Service** có chức năng:

* Lấy danh sách các đơn hàng (Order), mỗi order gồm ID, UserID, ProductID, Quantity.
* Lấy chi tiết đơn hàng theo ID.
* Sử dụng Gin theo kiến trúc thư mục chuẩn:

```
order-service/
├── cmd/main.go
├── internal/
│   ├── handlers/order_handler.go
│   ├── models/order.go
│   └── services/order_service.go
├── go.mod
└── go.sum
```

Sau đó, mở rộng API Gateway để chuyển tiếp các request `/orders/*` sang Order Service.

### Lời giải

```go
// internal/models/order.go
package models

type Order struct {
    ID        int `json:"id"`
    UserID    int `json:"user_id"`
    ProductID int `json:"product_id"`
    Quantity  int `json:"quantity"`
}

// internal/services/order_service.go
package services

import "errors"

var orders = []Order{
    {ID: 1, UserID: 1, ProductID: 2, Quantity: 3},
    {ID: 2, UserID: 2, ProductID: 1, Quantity: 1},
}

func GetAllOrders() []Order {
    return orders
}

func GetOrderByID(id int) (Order, error) {
    for _, o := range orders {
        if o.ID == id {
            return o, nil
        }
    }
    return Order{}, errors.New("Order not found")
}

// internal/handlers/order_handler.go
package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "your_module/internal/models"
    "your_module/internal/services"
)

func GetOrders(c *gin.Context) {
    orders := services.GetAllOrders()
    c.JSON(http.StatusOK, orders)
}

func GetOrder(c *gin.Context) {
    idParam := c.Param("id")
    id, err := strconv.Atoi(idParam)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
        return
    }

    order, err := services.GetOrderByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, order)
}

// cmd/main.go
package main

import (
    "github.com/gin-gonic/gin"
    "your_module/internal/handlers"
)

func main() {
    r := gin.Default()

    r.GET("/orders", handlers.GetOrders)
    r.GET("/orders/:id", handlers.GetOrder)

    r.Run(":8083") // Order service chạy cổng 8083
}
```

**Mở rộng API Gateway:**

```go
// Thêm dòng này vào api-gateway main.go trong hàm main
r.Any("/orders/*proxyPath", reverseProxy("http://localhost:8083"))
```

## 🔑 Những điểm quan trọng cần lưu ý

* Microservices nên có **ranh giới rõ ràng**, tránh trùng chéo domain.
* **API Gateway** giúp client đơn giản hơn, nhưng cũng là điểm nghẽn nếu không tối ưu.
* Khi gọi các microservices qua HTTP, cần xử lý timeout, lỗi mạng.
* Nên dùng **Service Discovery** để tránh hardcode địa chỉ IP, cổng.
* Đảm bảo **bảo mật** cho microservices, tránh lộ dữ liệu.
* Giữ cấu trúc thư mục rõ ràng, tách biệt giữa handlers, services, models.
* Mỗi microservice có thể độc lập deploy, nâng cấp mà không ảnh hưởng toàn hệ thống.

## 📝 Bài tập về nhà

### Đề bài

* Mở rộng **Order Service** bằng cách thêm API:

  * Tạo mới một đơn hàng (POST `/orders`) với payload JSON: `{ "user_id": 1, "product_id": 2, "quantity": 5 }`.
  * Xóa đơn hàng theo ID (DELETE `/orders/:id`).

* Cập nhật API Gateway để hỗ trợ các request mới này.

* Triển khai logic đơn giản validate dữ liệu đầu vào (quantity > 0).

* Tự chạy 3 microservices (User, Product, Order) và API Gateway, kiểm tra gọi API qua API Gateway với Postman hoặc curl.

