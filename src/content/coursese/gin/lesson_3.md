# 🎓 **BÀI 3: HANDLERS VÀ CONTEXT**

## 🎯 **Mục tiêu bài học**

* Hiểu rõ khái niệm **Handler function** 
* Sử dụng **`*gin.Context`** 
* Trả về response ở nhiều định dạng khác nhau
* Sử dụng status code và header trong response.
* Có khả năng viết API đơn giản sử dụng đầy đủ handler logic.


## 📝 **Nội dung chi tiết**


### 1. Handler Function là gì?

**Khái niệm:**
Trong Gin, một **handler** là một hàm chịu trách nhiệm xử lý một HTTP request. Gin sử dụng kiểu `func(*gin.Context)` để định nghĩa một handler.

```go
func handler(c *gin.Context) {
    // logic xử lý
}
```



### 2. Giới thiệu `*gin.Context`

**Khái niệm:**
`*gin.Context` là một **cấu trúc trung tâm** của Gin, đại diện cho **ngữ cảnh** của một request. Nó giúp:

* Truy cập thông tin request: params, query, body, headers...
* Gửi phản hồi về client: JSON, HTML, XML...
* Điều khiển luồng xử lý middleware/handlers.

**Các method phổ biến:**

| Method              | 
| ------------------- | 
| `c.Param("name")`   | 
| `c.Query("key")`    | 
| `c.PostForm("key")` | 
| `c.JSON(...)`       | 
| `c.String(...)`     | 
| `c.XML(...)`        | 
| `c.HTML(...)`       | 
| `c.Status(...)`     | 
| `c.Header(...)`     | 


### 3. Trả về Response

#### 3.1 Trả về JSON

```go
c.JSON(200, gin.H{
    "message": "Thành công",
    "data":    []string{"apple", "banana", "orange"},
})
```

#### 3.2 Trả về HTML

```go
c.HTML(200, "index.html", gin.H{
    "title": "Trang chủ",
})
```

#### 3.3 Trả về XML

```go
c.XML(200, gin.H{"status": "OK", "user": "Nguyễn Văn A"})
```

#### 3.4 Trả về String (Text)

```go
c.String(200, "Chào mừng bạn đến với khóa học Gin!")
```

### 4. Status Code và Header

#### 4.1 Trả về status code

```go
c.JSON(http.StatusBadRequest, gin.H{
    "error": "Tham số không hợp lệ",
})
```

#### 4.2 Thêm custom header

```go
c.Header("X-App-Version", "1.0.0")
c.JSON(200, gin.H{"message": "Header đã được set"})
```



## 🏆 **Bài tập thực hành**

### **Đề bài:**

Viết API quản lý thông tin sinh viên:

* `GET /students`: Trả về danh sách sinh viên.
* `GET /students/:id`: Trả về sinh viên theo `id`.
* `POST /students`: Thêm sinh viên mới (nhận JSON `{ "id": 3, "name": "Tùng", "age": 22 }`).

## 🔑 **Những điểm quan trọng cần lưu ý**

| Khái niệm      | Ghi nhớ                                               |
| -------------- | ----------------------------------------------------- |
| `*gin.Context` | Là trái tim của mỗi request                           |
| Handler        | Luôn có signature `func(c *gin.Context)`              |
| JSON/XML/HTML  | Mỗi loại response có method riêng                     |
| Status code    | Nên sử dụng `http.Status...` để rõ nghĩa              |
| Headers        | Cần gọi `c.Header(key, value)` trước khi gửi response |





## 📝 **Bài tập về nhà**

### **Đề bài:**

Viết một mini API quản lý sách:

* `GET /books`: Trả về danh sách sách.
* `POST /books`: Thêm sách mới từ JSON `{ "id": 1, "title": "Clean Code", "author": "Robert C. Martin" }`.
* `GET /books/:id`: Lấy thông tin sách theo `id`.

**Gợi ý:**

* Tạo struct `Book`.
* Dùng slice để chứa danh sách sách.
* Sử dụng `c.Param()` và `c.ShouldBindJSON()`.


