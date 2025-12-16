

# BÀI 5: TEMPLATE RENDERING TRONG GOLANG GIN FRAMEWORK

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ khái niệm về **Template Rendering** trong Gin Framework.
* Biết cách **cài đặt và cấu hình thư mục template** chuẩn.
* Nắm vững cú pháp template HTML cơ bản trong Go (Go's `html/template`).
* Biết cách **truyền dữ liệu từ handler vào template** để hiển thị động.
* Hiểu cách sử dụng **layout templates** để tái sử dụng giao diện chung.
* Biết cách phục vụ các **static files** như CSS, JS, hình ảnh trong dự án.
* Có khả năng xây dựng một trang web đơn giản có form và hiển thị kết quả.
* Làm quen với cách tổ chức code theo cấu trúc dự án chuẩn (`cmd/`, `internal/handlers`, `internal/models`).

## 📝 Nội dung chi tiết

### 1. Khái niệm Template Rendering

**Template rendering** là quá trình lấy một file template chứa mã HTML có các placeholder, sau đó thay thế các placeholder này bằng dữ liệu thực tế để tạo ra trang HTML động gửi về trình duyệt.

* Trong Gin, template rendering được dựa trên thư viện chuẩn `html/template` của Go.
* Giúp tách biệt logic xử lý dữ liệu và phần trình bày giao diện.
* Hỗ trợ xây dựng các trang web động như hiển thị danh sách, form nhập liệu, dashboard...

### 2. Cách Gin sử dụng Template Engine

* Gin hỗ trợ nạp nhiều template HTML từ thư mục chỉ định.
* Các template có thể kế thừa layout, sử dụng `{{ define "name" }}` để tái sử dụng.
* Phương thức `c.HTML()` của Gin dùng để render template với dữ liệu truyền vào.

### 3. Cấu trúc thư mục cho template và static files

* Mặc định, ta có thể để template trong thư mục như: `templates/`
* Static files (CSS, JS, images) đặt trong thư mục: `assets/` hoặc `static/`

Ví dụ cấu trúc thư mục:

```
project-root/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── web.go
│   ├── models/
│   └── templates/
│       ├── layout.html
│       ├── index.html
│       └── form.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── go.mod
└── go.sum
```

### 4. Template Syntax cơ bản trong Go

* `{{.}}` đại diện cho toàn bộ dữ liệu truyền vào.
* `{{.FieldName}}` truy cập trường cụ thể của struct hoặc map.
* Các câu lệnh điều khiển: `{{if}}`, `{{range}}`, `{{with}}`.
* Định nghĩa template con: `{{define "name"}} ... {{end}}`.
* Kế thừa layout thông qua `{{ template "layout" .}}`.

### 5. Ví dụ thực hành: Render Trang Chủ đơn giản

* Tạo layout `layout.html` có phần header/footer chung.
* Tạo trang `index.html` kế thừa layout, hiển thị tiêu đề và danh sách.
* Handler `Index` trong `handlers/web.go` trả về trang này với dữ liệu.

### 6. Phục vụ static files

* Dùng `router.Static("/assets", "./assets")` để phục vụ CSS, JS, hình ảnh.
* Trong template, dùng đường dẫn `/assets/css/style.css` để link file.

### 7. Tạo form HTML và xử lý dữ liệu form

* Tạo form trong template `form.html`.
* Handler hiển thị form và nhận POST request xử lý dữ liệu.
* Trả về kết quả nhập hoặc thông báo.

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài

**Xây dựng một ứng dụng web nhỏ với các yêu cầu:**

* Hiển thị trang chủ với danh sách sản phẩm (Product) bao gồm: ID, Tên, Giá.
* Sử dụng template để render trang chủ với layout chung.
* Tạo trang form thêm sản phẩm mới gồm các trường: Tên, Giá.
* Xử lý POST form, thêm sản phẩm vào danh sách (lưu tạm trong bộ nhớ).
* Sau khi thêm, redirect về trang chủ để thấy sản phẩm mới.

### Lời giải chi tiết

#### Cấu trúc thư mục (theo yêu cầu)

```
project/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── product.go
│   ├── models/
│   │   └── product.go
│   └── templates/
│       ├── layout.html
│       ├── index.html
│       └── form.html
├── assets/
│   └── css/
│       └── style.css
├── go.mod
└── go.sum
```

#### 1. Model - internal/models/product.go

```go
package models

type Product struct {
    ID    int
    Name  string
    Price float64
}

// Dữ liệu tạm lưu trong bộ nhớ
var Products []Product

func AddProduct(p Product) {
    p.ID = len(Products) + 1
    Products = append(Products, p)
}
```

#### 2. Handlers - internal/handlers/product.go

```go
package handlers

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "your_module_name/internal/models"
)

// Hiển thị trang chủ với danh sách sản phẩm
func Index(c *gin.Context) {
    c.HTML(http.StatusOK, "index.html", gin.H{
        "title":    "Danh sách sản phẩm",
        "products": models.Products,
    })
}

// Hiển thị form thêm sản phẩm mới
func ShowAddForm(c *gin.Context) {
    c.HTML(http.StatusOK, "form.html", gin.H{
        "title": "Thêm sản phẩm mới",
    })
}

// Xử lý form thêm sản phẩm
func AddProduct(c *gin.Context) {
    name := c.PostForm("name")
    priceStr := c.PostForm("price")

    price, err := strconv.ParseFloat(priceStr, 64)
    if err != nil || name == "" {
        c.HTML(http.StatusBadRequest, "form.html", gin.H{
            "title": "Thêm sản phẩm mới",
            "error": "Tên sản phẩm và Giá phải hợp lệ",
        })
        return
    }

    models.AddProduct(models.Product{
        Name:  name,
        Price: price,
    })

    c.Redirect(http.StatusSeeOther, "/")
}
```

#### 3. Templates - internal/templates/

**layout.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>{{ .title }}</title>
    <link rel="stylesheet" href="/assets/css/style.css" />
</head>
<body>
    <header>
        <h1>Ứng dụng Quản lý Sản phẩm</h1>
        <nav>
            <a href="/">Trang chủ</a> | 
            <a href="/products/new">Thêm sản phẩm</a>
        </nav>
    </header>

    <main>
        {{ block "content" . }}{{ end }}
    </main>

    <footer>
        <p>© 2025 Golang Gin Course</p>
    </footer>
</body>
</html>
```

**index.html**

```html
{{ define "content" }}
<h2>Danh sách sản phẩm</h2>

{{ if .products }}
<table border="1" cellpadding="5">
    <tr>
        <th>ID</th>
        <th>Tên</th>
        <th>Giá</th>
    </tr>
    {{ range .products }}
    <tr>
        <td>{{ .ID }}</td>
        <td>{{ .Name }}</td>
        <td>{{ printf "%.2f" .Price }}</td>
    </tr>
    {{ end }}
</table>
{{ else }}
<p>Chưa có sản phẩm nào.</p>
{{ end }}
{{ end }}
```

**form.html**

```html
{{ define "content" }}
<h2>Thêm sản phẩm mới</h2>

{{ if .error }}
<p style="color: red;">{{ .error }}</p>
{{ end }}

<form action="/products" method="POST">
    <label for="name">Tên sản phẩm:</label><br/>
    <input type="text" id="name" name="name" /><br/>

    <label for="price">Giá:</label><br/>
    <input type="text" id="price" name="price" /><br/><br/>

    <button type="submit">Thêm sản phẩm</button>
</form>
{{ end }}
```

#### 4. Main - cmd/main.go

```go
package main

import (
    "github.com/gin-gonic/gin"
    "your_module_name/internal/handlers"
    "html/template"
    "net/http"
    "path/filepath"
)

func main() {
    router := gin.Default()

    // Phục vụ static files
    router.Static("/assets", "./assets")

    // Load templates với layout
    router.SetFuncMap(template.FuncMap{})
    router.LoadHTMLGlob("internal/templates/*.html")

    // Routes
    router.GET("/", handlers.Index)
    router.GET("/products/new", handlers.ShowAddForm)
    router.POST("/products", handlers.AddProduct)

    // Chạy server
    router.Run(":8080")
}
```

### Phân tích từng bước:

* **Model:** Chúng ta dùng slice lưu tạm danh sách sản phẩm, để tập trung vào template rendering.
* **Handler:** Chia handler theo chức năng (hiển thị danh sách, hiển thị form, xử lý form).
* **Template:** Sử dụng layout chung để tái sử dụng header/footer. Các trang con `index.html` và `form.html` định nghĩa block `content` để chèn vào layout.
* **Static files:** CSS đặt trong `assets/css/`, phục vụ bởi `router.Static`.
* **Chạy server:** Cấu hình template và static files đúng chuẩn.

## 🔑 Những điểm quan trọng cần lưu ý

* **Template syntax Go khá khác so với các template engine khác,** cần chú ý dấu ngoặc `{{}}` và cách truyền data.
* Luôn **tách layout và các template nhỏ** để dễ bảo trì.
* Khi truyền dữ liệu từ handler vào template, phải **đảm bảo đúng kiểu và tên trường** để truy cập trong template.
* `router.Static()` rất quan trọng để phục vụ CSS, JS, ảnh... nếu không sẽ không load được.
* Đối với form, dữ liệu POST cần xử lý kỹ (validate đơn giản trước khi lưu).
* Tránh lưu dữ liệu trạng thái lâu dài trong slice tạm ở production, đây chỉ là ví dụ học tập.
* `router.LoadHTMLGlob()` hoặc `LoadHTMLFiles()` để load template. Có thể dùng template FuncMap để mở rộng nếu cần.
* Dùng `c.Redirect()` để điều hướng sau khi xử lý form tránh resubmission.

## 📝 Bài tập về nhà

### Đề bài

**Phát triển thêm tính năng cho ứng dụng quản lý sản phẩm:**

1. Tạo trang chi tiết sản phẩm theo đường dẫn `/products/:id`.
2. Trang chi tiết hiển thị thông tin chi tiết sản phẩm, gồm ID, Tên, Giá.
3. Từ trang chủ, mỗi sản phẩm có liên kết tới trang chi tiết.
4. Nếu sản phẩm không tồn tại, trả về trang lỗi 404 với thông báo phù hợp.
5. Sử dụng template riêng cho trang chi tiết và trang lỗi, vẫn kế thừa layout chung.

### Yêu cầu:

* Áp dụng kiến thức về template rendering, truyền dữ liệu, routing có param.
* Giữ cấu trúc code rõ ràng, chia handler phù hợp.
* Bài tập giúp học viên luyện tập sử dụng template với dữ liệu động, route parameters và xử lý lỗi đơn giản.

Nếu bạn muốn, tôi có thể chuẩn bị lời giải chi tiết cho bài tập này ở buổi học tiếp theo.


