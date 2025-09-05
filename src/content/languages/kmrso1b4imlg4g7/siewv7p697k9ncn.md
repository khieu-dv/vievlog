---
title: "Bài 10: Interfaces - Tính đa hình trong Go"
postId: "siewv7p697k9ncn"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 10: Interfaces - Tính đa hình trong Go



## **🎯 Mục tiêu bài học**

Sau khi học xong bài này, học viên sẽ:

1. Hiểu rõ khái niệm **interface** trong Go và vai trò của nó trong tính **đa hình** (polymorphism).
2. Biết cách khai báo, triển khai và sử dụng interface một cách linh hoạt.
3. Sử dụng các interface phổ biến của Go như `io.Reader`, `io.Writer`, và `error`.
4. Hiểu cơ chế **implicit interface satisfaction**, type assertion, type switch và interface embedding.
5. Áp dụng interface để viết code **modular**, **dễ kiểm thử** (mocking) và **mở rộng**.
6. Nhận biết các **vấn đề hiệu năng** và lỗi thường gặp khi sử dụng interface.

\---

## **📝 Nội dung chi tiết**

### 1. **Khái niệm Interface**

**Giải thích:**

* Interface trong Go định nghĩa **tập hợp các phương thức** mà một kiểu dữ liệu (type) phải triển khai.
* Interface là cách Go thực hiện **đa hình**, cho phép các hàm hoặc struct làm việc với nhiều kiểu khác nhau nếu chúng **thỏa mãn cùng một interface**.
* **Điểm khác biệt:** Go dùng **implicit implementation**, không cần khai báo rõ ràng “implements”.

**Ví dụ:**

```go
package main

import "fmt"

type Speaker interface {
    Speak() string
}

type Person struct {
    Name string
}

func (p Person) Speak() string {
    return "Hello, my name is " + p.Name
}

func saySomething(s Speaker) {
    fmt.Println(s.Speak())
}

func main() {
    p := Person{Name: "Alice"}
    saySomething(p) // Person thỏa mãn interface Speaker
}
```

**Giải thích:**

* `Speaker` là interface với phương thức `Speak() string`.
* `Person` có phương thức `Speak`, nên **ngầm hiểu** là triển khai `Speaker`.
* Hàm `saySomething` nhận bất kỳ `Speaker` nào, minh họa tính **đa hình**.

\---

### 2. **Empty Interface `interface{}`**

* `interface{}` là interface **rỗng**, có thể chứa bất kỳ giá trị nào.
* Thường dùng khi muốn viết code **tổng quát** hoặc lưu trữ các giá trị khác nhau trong cùng một cấu trúc dữ liệu.

**Ví dụ:**

```go
func printAny(value interface{}) {
    fmt.Println(value)
}

func main() {
    printAny(42)
    printAny("Hello")
    printAny(3.14)
}
```

**Lưu ý:** Sử dụng empty interface quá nhiều có thể làm mất **type safety**.

\---

### 3. **Type Assertion và Type Switch**

* **Type assertion:** Lấy giá trị thực từ interface.

```go
var i interface{} = "GoLang"
s := i.(string)  // Nếu i không phải string, sẽ panic
fmt.Println(s)
```

* **Type switch:** Kiểm tra loại dữ liệu trong interface một cách an toàn.

```go
switch v := i.(type) {
case string:
    fmt.Println("string:", v)
case int:
    fmt.Println("int:", v)
default:
    fmt.Println("other type")
}
```

\---

### 4. **Interface Composition (Embedding)**

* Interface có thể **ghép các interface khác** để tạo interface mới.

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type ReadWriter interface {
    Reader
    Writer
}
```

* `ReadWriter` yêu cầu một type phải **triển khai cả `Read` và `Write`**.

\---

### 5. **Các interface phổ biến trong Go**

* `io.Reader` và `io.Writer`: đọc/ghi dữ liệu.
* `error`: interface cơ bản để xử lý lỗi.

```go
var err error = fmt.Errorf("something went wrong")
fmt.Println(err.Error())
```

\---

### 6. **Interface Values và Nil Interface**

* Một biến interface gồm **type + value**.
* **Khác biệt giữa `nil interface` và interface chứa nil pointer**:

```go
var p *Person = nil
var s Speaker = p
fmt.Println(s == nil) // false, vì s có type *Person nhưng value nil
```

* Đây là lỗi phổ biến gây **panic khi gọi phương thức trên interface**.

\---

### 7. **Interface Segregation Principle**

* Không nên tạo interface quá lớn.
* Nên chia nhỏ thành nhiều interface nhỏ để các type chỉ phải triển khai những phương thức cần thiết.

\---

### 8. **Mocking với Interfaces**

* Khi viết unit test, interface giúp **thay thế dependency bằng mock**.

```go
type Database interface {
    Save(data string) error
}

type MockDB struct{}

func (m MockDB) Save(data string) error {
    fmt.Println("Mock save:", data)
    return nil
}
```

\---

### 9. **Performance Implications**

* Interface có **overhead nhỏ** vì Go lưu trữ thông tin type + value.
* Tránh lạm dụng interface cho các hàm **hot path** hoặc **loop lớn**.

\---

## **🏆 Bài tập thực hành**

**Đề bài:**
Tạo một hệ thống **hình học đơn giản** gồm các hình chữ nhật và hình tròn.

* Mỗi hình có thể tính **diện tích**.
* Sử dụng **interface** để viết hàm in diện tích của bất kỳ hình nào.

**Lời giải chi tiết:**

```go
package main

import (
    "fmt"
    "math"
)

// Bước 1: Khai báo interface
type Shape interface {
    Area() float64
}

// Bước 2: Tạo struct Rectangle và Circle
type Rectangle struct {
    Width, Height float64
}

type Circle struct {
    Radius float64
}

// Bước 3: Triển khai phương thức Area
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

// Bước 4: Viết hàm in diện tích
func printArea(s Shape) {
    fmt.Println("Area:", s.Area())
}

func main() {
    r := Rectangle{Width: 5, Height: 10}
    c := Circle{Radius: 7}

    printArea(r) // Sử dụng interface Shape
    printArea(c)
}
```

**Giải thích:**

1. `Shape` là interface với phương thức `Area()`.
2. `Rectangle` và `Circle` **ngầm thỏa mãn** interface `Shape`.
3. Hàm `printArea` nhận `Shape`, có thể làm việc với **bất kỳ loại hình nào**.
4. Đây là **đa hình (polymorphism)** trong Go.

\---

## **🔑 Những điểm quan trọng cần lưu ý**

1. Go sử dụng **implicit implementation**, không cần từ khóa `implements`.
2. `interface{}` chứa **type + value**, cần cẩn thận với nil pointer.
3. Type assertion và type switch là cách **truy xuất giá trị thực**.
4. Interface nhỏ và chuyên biệt giúp code **dễ bảo trì và test**.
5. Tránh sử dụng interface cho **hot path** để tối ưu hiệu năng.
6. Common interfaces: `io.Reader`, `io.Writer`, `error`.

\---

## **📝 Bài tập về nhà**

**Bài 1:**

* Tạo interface `Notifier` với phương thức `Notify(message string)`.
* Viết struct `EmailNotifier` và `SMSNotifier` triển khai interface.
* Viết hàm gửi thông báo cho tất cả Notifier trong một slice.

**Bài 2:**

* Tạo interface `Animal` với phương thức `Speak() string`.
* Viết struct `Dog`, `Cat`, `Bird` triển khai interface.
* Viết hàm in lời nói của tất cả Animal trong một slice, sử dụng **type switch** để phân biệt `Dog` và các loài khác.




---

*Post ID: siewv7p697k9ncn*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
