---
title: "Bài 12: Packages và Modules"
postId: "s82vin875tc1qp9"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 12: Packages và Modules



## 🎯 **Mục tiêu bài học**

Sau khi hoàn thành bài học này, học viên sẽ:

1. Hiểu rõ khái niệm **package** và **module** trong Go.
2. Biết cách tổ chức code thành các package để tăng tính modular và tái sử dụng.
3. Sử dụng **import**, alias, và blank imports một cách linh hoạt.
4. Quản lý dependencies bằng **Go Modules**, bao gồm init, tidy, vendor và các directive nâng cao.
5. Áp dụng semantic versioning và hiểu cách sử dụng các gói bên ngoài an toàn.

\---

## 📝 **Nội dung chi tiết**

### 1️⃣ **Package trong Go**

* **Package** là đơn vị tổ chức code cơ bản trong Go, giúp nhóm các file Go liên quan lại với nhau.
* Mỗi file Go bắt đầu bằng **package declaration**:

```go
package main
```

* **package main**: dùng để xác định điểm entry (`func main()`) cho ứng dụng thực thi.
* Các package khác dùng để tách logic, ví dụ package `math`, `strings`.

**Ví dụ:**

```go
package greetings

import "fmt"

func SayHello(name string) {
    fmt.Println("Hello,", name)
}
```

* Đây là một package `greetings` đơn giản với 1 hàm `SayHello`.

\---

### 2️⃣ **Package naming conventions**

* Tên package thường **ngắn, viết thường, không dấu gạch dưới**.
* Tránh trùng tên với chuẩn thư viện Go để giảm nhầm lẫn.
* Tên file không ảnh hưởng đến tên package.

\---

### 3️⃣ **Exported vs Unexported identifiers**

* Trong Go, **chữ cái đầu tiên** xác định khả năng truy cập:

  * **Uppercase** → Exported (có thể dùng bên ngoài package)
  * **Lowercase** → Unexported (chỉ dùng nội bộ package)

```go
package greetings

func SayHello() { // exported
    fmt.Println("Hello!")
}

func sayBye() { // unexported
    fmt.Println("Bye!")
}
```

\---

### 4️⃣ **Package initialization với `init()`**

* Go tự động gọi `init()` trước `main()`.
* Dùng để khởi tạo biến, config, kết nối DB.

```go
package config

import "fmt"

var Port int

func init() {
    Port = 8080
    fmt.Println("Config initialized!")
}
```

\---

### 5️⃣ **Import statements và aliases**

* Import các package cần thiết:

```go
import "fmt"
import m "math" // alias
```

* **Blank imports (`_`)**: chỉ chạy `init()` của package mà không dùng trực tiếp.

```go
import _ "net/http/pprof"
```

\---

### 6️⃣ **Go Modules**

* Go Modules quản lý dependencies và versioning.
* Thay thế GOPATH truyền thống.
* Tạo module mới:

```bash
go mod init mymodule
```

* Đồng bộ dependencies:

```bash
go mod tidy
```

* Vendor dependencies:

```bash
go mod vendor
```

* Sử dụng **replace** và **exclude** directives trong `go.mod` để điều chỉnh version.

```go
replace github.com/old/dependency => github.com/new/dependency v1.2.3
exclude github.com/bad/dependency v0.9.0
```

\---

### 7️⃣ **Semantic versioning**

* Versioning tuân theo **MAJOR.MINOR.PATCH**:

  * **MAJOR**: breaking changes
  * **MINOR**: tính năng mới, backward-compatible
  * **PATCH**: sửa lỗi, backward-compatible

\---

### 8️⃣ **Sử dụng gói bên ngoài**

* Tìm package từ **pkg.go.dev**.
* Cài đặt:

```bash
go get github.com/gin-gonic/gin@v1.9.0
```

* Import và sử dụng trong code:

```go
import "github.com/gin-gonic/gin"

r := gin.Default()
r.GET("/", func(c *gin.Context) {
    c.String(200, "Hello Gin!")
})
r.Run()
```

\---

### 9️⃣ **Publishing modules**

* Module Go có thể publish ra public repository (GitHub) và sử dụng semantic versioning.
* Module proxy (proxy.golang.org) giúp tải dependencies an toàn.

\---

### 10️⃣ **Replace và exclude directives**

* **Replace**: thay thế version của module (thường dùng khi dev local).
* **Exclude**: loại bỏ version không mong muốn.

\---

## 🏆 **Bài tập thực hành**

**Đề bài:**
Tạo một project Go gồm 2 package:

1. `mathops` với các hàm: `Add(a, b int) int` và `Multiply(a, b int) int`.
2. `main` sử dụng `mathops` để tính:

   * Tổng và tích của 2 số nhập từ người dùng.

**Lời giải chi tiết:**

**Bước 1:** Tạo project và module

```bash
mkdir go-modules-demo
cd go-modules-demo
go mod init go-modules-demo
```

**Bước 2:** Tạo package `mathops`
`mathops/mathops.go`:

```go
package mathops

func Add(a, b int) int {
    return a + b
}

func Multiply(a, b int) int {
    return a * b
}
```

**Bước 3:** Tạo file `main.go`

```go
package main

import (
    "fmt"
    "go-modules-demo/mathops"
)

func main() {
    var x, y int
    fmt.Print("Nhập số thứ nhất: ")
    fmt.Scan(&x)
    fmt.Print("Nhập số thứ hai: ")
    fmt.Scan(&y)

    sum := mathops.Add(x, y)
    product := mathops.Multiply(x, y)

    fmt.Println("Tổng:", sum)
    fmt.Println("Tích:", product)
}
```

**Bước 4:** Chạy chương trình

```bash
go run main.go
```

**Giải thích logic:**

* Tách logic toán học vào package `mathops` giúp code modular.
* `main` chỉ quan tâm nhập liệu và hiển thị kết quả.
* Sử dụng Go Modules để quản lý project.

\---

## 🔑 **Những điểm quan trọng cần lưu ý**

1. **package main** chỉ dùng cho chương trình thực thi, các package khác để tái sử dụng.
2. **Exported vs unexported**: chữ cái đầu tiên quyết định visibility.
3. **init()** chạy tự động trước main, chỉ dùng cho initialization.
4. Go Modules thay thế GOPATH, dùng `go mod tidy` để clean dependencies.
5. Blank imports (`_`) chỉ dùng khi cần chạy init mà không dùng trực tiếp package.
6. Semantic versioning quan trọng khi publish hoặc dùng package bên ngoài.
7. Tránh trùng tên package với standard library để hạn chế lỗi import.

\---

## 📝 **Bài tập về nhà**

**Bài 1:**
Tạo một project Go với 2 package:

* `stringsutil` có hàm: `Reverse(s string) string` (đảo ngược chuỗi) và `IsPalindrome(s string) bool` (kiểm tra palindrome).
* `main` nhập một chuỗi từ người dùng, in chuỗi đảo ngược và kết quả kiểm tra palindrome.

**Bài 2:**
Sử dụng Go Modules, import package bên ngoài `github.com/fatih/color` để in ra màu chữ:

* Viết chương trình in ra `"Hello World"` màu xanh lá.
* Tìm hiểu và áp dụng alias cho package khi import.

\---

Tài liệu này vừa **giải thích lý thuyết**, vừa có **ví dụ thực hành cụ thể**, phù hợp cho học viên từ mới bắt đầu đến nâng cao.




---

*Post ID: s82vin875tc1qp9*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
