

# **Bài 15: Caching Strategies**

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ bản chất của caching và vai trò quan trọng của caching trong tối ưu hiệu năng ứng dụng web.
* Nắm được các loại cache phổ biến: in-memory cache, distributed cache (Redis).
* Biết cách tích hợp caching vào ứng dụng Gin theo chuẩn kiến trúc module.
* Hiểu các chiến lược invalidation cache (cache invalidation) và cache-aside pattern.
* Hiểu cách áp dụng HTTP cache headers để tối ưu hiệu suất client-server.
* Thực hành xây dựng các ví dụ caching cơ bản và nâng cao với Redis.
* Tự tay triển khai 1 bài tập caching thực tế có lời giải rõ ràng.

## 📝 Nội dung chi tiết

### 1. **Caching là gì?**

**Khái niệm:**
Caching là kỹ thuật lưu trữ dữ liệu tạm thời ở nơi truy cập nhanh hơn (ví dụ: RAM, bộ nhớ trong server hoặc các dịch vụ cache như Redis) để giảm thiểu thời gian truy vấn lại dữ liệu gốc (database, API chậm...).

**Tại sao cần caching?**

* Giảm tải cho hệ thống backend và database.
* Tăng tốc độ phản hồi (response time).
* Giúp ứng dụng mở rộng tốt hơn.

### 2. **Các loại caching phổ biến**

* **In-memory cache:** cache nằm trong bộ nhớ RAM của server (ví dụ: map trong Go, package `sync.Map` hoặc thư viện như `golang/groupcache`, `go-cache`).
* **Distributed cache:** cache nằm trên hệ thống riêng biệt, có thể truy cập từ nhiều server (ví dụ Redis, Memcached).

### 3. **Cache invalidation (làm mới cache)**

Làm mới cache là quá trình xóa hoặc cập nhật cache khi dữ liệu gốc thay đổi. Các chiến lược phổ biến:

* **Time-based expiration:** Cache tự động hết hạn sau một khoảng thời gian (TTL).
* **Explicit invalidation:** Thủ công xóa cache khi dữ liệu thay đổi.
* **Cache-aside pattern:** Ứng dụng tự quản lý việc đọc và ghi cache, đọc cache trước, nếu không có thì lấy DB, cập nhật cache.

### 4. **HTTP Caching headers**

Giúp trình duyệt và proxy cache dữ liệu. Ví dụ:

* `Cache-Control: max-age=xxx`
* `ETag`
* `Last-Modified`

### 5. **Áp dụng caching trong Gin**

Chúng ta sẽ làm ví dụ xây dựng API đơn giản có cache bằng:

* In-memory cache (sử dụng `go-cache`) cho dữ liệu đơn giản.
* Redis cache cho cache phân tán (distributed cache).

## 📌 **Ví dụ code minh họa**

### Cấu trúc dự án theo yêu cầu:

```
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── product_handler.go
│   ├── models/
│   │   └── product.go
│   └── cache/
│       └── cache.go
├── go.mod
└── go.sum
```

### 5.1. Tạo model Product (internal/models/product.go)

```go
package models

type Product struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Price int    `json:"price"`
}
```

### 5.2. Tạo module cache với 2 loại cache (internal/cache/cache.go)

```go
package cache

import (
    "context"
    "encoding/json"
    "time"

    "github.com/go-redis/redis/v8"
    "github.com/patrickmn/go-cache"
)

var (
    // In-memory cache: expiration 5 minutes, cleanup interval 10 minutes
    MemCache = cache.New(5*time.Minute, 10*time.Minute)

    // Redis client
    Rdb *redis.Client
    Ctx = context.Background()
)

func InitRedis(addr, password string, db int) {
    Rdb = redis.NewClient(&redis.Options{
        Addr:     addr,
        Password: password,
        DB:       db,
    })
}

// In-memory cache functions
func SetMemCache(key string, value interface{}, duration time.Duration) {
    MemCache.Set(key, value, duration)
}

func GetMemCache(key string) (interface{}, bool) {
    return MemCache.Get(key)
}

// Redis cache functions
func SetRedisCache(key string, value interface{}, duration time.Duration) error {
    bytes, err := json.Marshal(value)
    if err != nil {
        return err
    }
    return Rdb.Set(Ctx, key, bytes, duration).Err()
}

func GetRedisCache(key string, dest interface{}) (bool, error) {
    val, err := Rdb.Get(Ctx, key).Result()
    if err == redis.Nil {
        return false, nil // key not found
    } else if err != nil {
        return false, err
    }
    err = json.Unmarshal([]byte(val), dest)
    if err != nil {
        return false, err
    }
    return true, nil
}
```

### 5.3. Tạo handler sản phẩm (internal/handlers/product\_handler.go)

```go
package handlers

import (
    "net/http"
    "strconv"
    "time"

    "github.com/gin-gonic/gin"
    "your_module_name/internal/cache"
    "your_module_name/internal/models"
)

var sampleProducts = []models.Product{
    {ID: 1, Name: "Apple iPhone 14", Price: 1000},
    {ID: 2, Name: "Samsung Galaxy S23", Price: 900},
    {ID: 3, Name: "Google Pixel 7", Price: 800},
}

// Handler trả về danh sách sản phẩm có caching Redis
func GetProducts(c *gin.Context) {
    var products []models.Product
    cacheKey := "products_all"

    // Thử lấy cache Redis
    found, err := cache.GetRedisCache(cacheKey, &products)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Cache error"})
        return
    }
    if found {
        c.JSON(http.StatusOK, gin.H{"source": "cache", "data": products})
        return
    }

    // Nếu không có cache, giả lập lấy từ "DB"
    products = sampleProducts

    // Lưu cache Redis trong 10 phút
    err = cache.SetRedisCache(cacheKey, products, 10*time.Minute)
    if err != nil {
        // Log lỗi cache, nhưng vẫn trả data
    }

    c.JSON(http.StatusOK, gin.H{"source": "db", "data": products})
}

// Handler trả về chi tiết sản phẩm với cache in-memory
func GetProductByID(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product id"})
        return
    }

    cacheKey := "product_" + idStr
    var product models.Product

    // Lấy cache in-memory
    cacheData, found := cache.GetMemCache(cacheKey)
    if found {
        product = cacheData.(models.Product)
        c.JSON(http.StatusOK, gin.H{"source": "cache", "data": product})
        return
    }

    // Giả lập truy vấn DB
    for _, p := range sampleProducts {
        if p.ID == id {
            product = p
            // Lưu cache trong 5 phút
            cache.SetMemCache(cacheKey, product, 5*time.Minute)
            c.JSON(http.StatusOK, gin.H{"source": "db", "data": product})
            return
        }
    }

    c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
}
```

### 5.4. Tạo main.go (cmd/main.go)

```go
package main

import (
    "log"
    "your_module_name/internal/cache"
    "your_module_name/internal/handlers"

    "github.com/gin-gonic/gin"
)

func main() {
    // Khởi tạo Redis (giả định Redis chạy localhost:6379, không có mật khẩu)
    cache.InitRedis("localhost:6379", "", 0)

    r := gin.Default()

    r.GET("/products", handlers.GetProducts)
    r.GET("/products/:id", handlers.GetProductByID)

    log.Println("Server running at http://localhost:8080")
    r.Run(":8080")
}
```

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài:

Xây dựng một API endpoint `/products/:id/price` trả về giá sản phẩm theo `id` với caching in-memory. Yêu cầu:

* Nếu có giá trong cache, trả cache.
* Nếu không, lấy giá từ danh sách sản phẩm mẫu, lưu cache trong 2 phút.
* Nếu không tìm thấy, trả 404.

### Lời giải:

Bạn chỉ cần tạo thêm handler mới:

```go
func GetProductPriceByID(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product id"})
        return
    }

    cacheKey := "product_price_" + idStr
    var price int

    cacheData, found := cache.GetMemCache(cacheKey)
    if found {
        price = cacheData.(int)
        c.JSON(http.StatusOK, gin.H{"source": "cache", "price": price})
        return
    }

    for _, p := range sampleProducts {
        if p.ID == id {
            price = p.Price
            cache.SetMemCache(cacheKey, price, 2*time.Minute)
            c.JSON(http.StatusOK, gin.H{"source": "db", "price": price})
            return
        }
    }

    c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
}
```

Và đăng ký route:

```go
r.GET("/products/:id/price", handlers.GetProductPriceByID)
```

## 🔑 Những điểm quan trọng cần lưu ý

* **Cache không phải là nơi lưu trữ dữ liệu chính** mà chỉ là bản sao giúp tăng tốc truy xuất. Dữ liệu gốc vẫn là DB hoặc API.
* **Cache invalidation** là phần khó nhất trong caching, phải tính toán thời điểm làm mới cache phù hợp để tránh dữ liệu lỗi thời.
* **Không nên cache dữ liệu quá lớn hoặc quá phức tạp**, vì in-memory cache giới hạn RAM. Redis phù hợp cho cache phân tán, nhiều server.
* Luôn kiểm tra cache miss (khi không có cache) và cache hit (khi có cache) để đảm bảo dữ liệu luôn đúng và nhất quán.
* Sử dụng HTTP cache headers để tận dụng cache phía client và proxy, giảm tải server.
* Tận dụng các thư viện đã có (go-cache, redis client) giúp giảm thiểu lỗi và tăng hiệu suất phát triển.

## 📝 Bài tập về nhà

### Đề bài:

Tạo API `/users/:id/profile` với tính năng caching sử dụng Redis cache. Yêu cầu:

* Giả lập dữ liệu user profile trong bộ nhớ.
* Nếu có cache, trả về cache.
* Nếu không, lấy dữ liệu và lưu cache Redis trong 15 phút.
* Thêm HTTP header `Cache-Control` để client cache trong 60 giây.
* Viết test đơn giản bằng curl để kiểm tra cache hoạt động.

**Yêu cầu:** Áp dụng kiến trúc module đã học, code rõ ràng, có comment giải thích.

