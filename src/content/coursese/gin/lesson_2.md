# Bài 2: Cấu trúc dự án và Routing cơ bản

## 🎯 Mục tiêu bài học


- **Thiết kế cấu trúc dự án** theo chuẩn Go project layout và best practices
- **Hiểu rõ khái niệm Routing** và cách Gin xử lý các HTTP requests
- **Sử dụng thành thạo các HTTP methods** cơ bản (GET, POST, PUT, DELETE)


## 📝 Nội dung chi tiết

### 1. Cấu trúc dự án tiêu chuẩn

#### 1.1 Tại sao cần cấu trúc dự án tốt?

Một dự án có cấu trúc tốt giúp:
- **Dễ bảo trì và mở rộng** 
- **Collaboration hiệu quả** 
- **Separation of concerns** 
- **Testing dễ dàng** 


#### 1.2 Standard Go Project Layout

```
bookstore-api/
├── cmd/
│   └── server/
│       └── main.go         
├── internal/
│   ├── handlers/           
│   ├── models/             
│   ├── middleware/         
│   └── config/             
├── pkg/
│   └── database/           
├── web/
│   ├── static/             
│   └── templates/          
├── docs/                   
├── scripts/                
├── go.mod
├── go.sum
└── README.md
```


### 2. Khái niệm Routing trong Gin

#### 2.1 Routing là gì?

**Routing** là quá trình xác định cách ứng dụng phản hồi với client request đến một endpoint cụ thể. Một endpoint được định nghĩa bởi:
- **HTTP Method** (GET, POST, PUT, DELETE...)
- **URL Path** (/users, /products/:id...)

#### 2.2 Cách Gin xử lý Routing

Gin sử dụng **Radix Tree** algorithm để match routes một cách hiệu quả:

```go
router := gin.Default()

// Static route
router.GET("/users", getUsersHandler)

// Dynamic route với parameter
router.GET("/users/:id", getUserByIDHandler)

```


### 3. HTTP Methods và RESTful APIs

#### 3.1 Các HTTP Methods cơ bản

| Method | Mục đích | Ví dụ |
|--------|----------|-------|
| **GET** | Lấy dữ liệu | `GET /users` |
| **POST** | Tạo mới | `POST /users`  |
| **PUT** | Cập nhật toàn bộ | `PUT /users/1`  |
| **PATCH** | Cập nhật một phần | `PATCH /users/1`  |
| **DELETE** | Xóa | `DELETE /users/1` |

#### 3.2 RESTful API Design Principles

```go
// ✅ Good RESTful design
GET    /books              
GET    /books/123          
POST   /books              
PUT    /books/123          
DELETE /books/123          

// ❌ Poor design
GET    /getBooks
POST   /createBook
GET    /getBookById/123
```

### 4. Route Parameters và Query Parameters

#### 4.1 Route Parameters (Path Parameters)

Route parameters được sử dụng để identify tài nguyên cụ thể:


#### 4.2 Query Parameters

Query parameters được sử dụng cho filtering, sorting, pagination:


#### 4.3 Parameter Validation

```go
router.GET("/users/:id", func(c *gin.Context) {
    idStr := c.Param("id")
    
    // Validate parameter
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(400, gin.H{"error": "Invalid user ID"})
        return
    }
    
    if id <= 0 {
        c.JSON(400, gin.H{"error": "User ID must be positive"})
        return
    }
    
    // Process with valid ID...
})
```

### 5. Route Groups

Route groups giúp organize code và apply middleware cho một nhóm routes:

```go
v1 := router.Group("/api/v1")
{
    v1.GET("/users", getUsersHandler)
    v1.POST("/users", createUserHandler)
}

v2 := router.Group("/api/v2")
{
    v2.GET("/users", getUsersV2Handler)
}

admin := router.Group("/admin")
admin.Use(AuthMiddleware()) 
{
    admin.GET("/users", adminGetUsersHandler)
    admin.DELETE("/users/:id", adminDeleteUserHandler)
}
```

## 🏆 Bài tập thực hành 

### Đề bài: Xây dựng API quản lý sách đơn giản

Tạo một API cơ bản để quản lý danh sách sách với 4 chức năng:
1. **Lấy tất cả sách** (GET)
2. **Lấy sách theo ID** (GET với parameter)
3. **Thêm sách mới** (POST)
4. **Xóa sách** (DELETE)


## 🔑 Những điểm quan trọng cần lưu ý

### 1. **Route Parameters vs Query Parameters**
- **Route Parameters** (`/users/:id`): Để identify tài nguyên cụ thể
- **Query Parameters** (`/users?age=25`): Để filtering, sorting, pagination

### 2. **HTTP Status Codes quan trọng**
- **200 OK**:
- **201 Created**: 
- **400 Bad Request**: 
- **404 Not Found**: 
- **500 Internal Server Error**: 


## 📝 Bài tập về nhà

### Bài tập 1: API quản lý danh bạ điện thoại

Tạo một API đơn giản để quản lý danh bạ với struct Contact:

```go
type Contact struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Phone string `json:"phone"`
}
```

**Yêu cầu:**
1. `GET /contacts` - Lấy tất cả danh bạ
2. `GET /contacts/:id` - Lấy contact theo ID
3. `POST /contacts` - Thêm contact mới
4. `DELETE /contacts/:id` - Xóa contact

**Validation:**
- Name không được rỗng
- Phone phải có ít nhất 10 số


