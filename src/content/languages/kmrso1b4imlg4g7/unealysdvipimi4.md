---
title: "Bài 7: Structs và Methods"
postId: "unealysdvipimi4"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 7: Structs và Methods




## 🎯 Mục tiêu bài học

Sau khi học xong bài này, học viên sẽ:

* Hiểu cách định nghĩa và khởi tạo **structs** trong Go để tạo ra các kiểu dữ liệu tùy chỉnh.
* Biết cách sử dụng **anonymous structs**, **struct embedding** và **struct tags** để xây dựng dữ liệu linh hoạt.
* Hiểu sự khác biệt giữa **methods** và **functions**, cách định nghĩa **method receivers** (value receiver vs pointer receiver).
* Áp dụng struct và method để xây dựng các mô hình dữ liệu và hành vi sát với thực tế.

\---

## 📝 Nội dung chi tiết

### 1. Struct là gì?

Trong Go, **struct** (viết tắt của "structure") là một kiểu dữ liệu tổng hợp, cho phép nhóm nhiều trường (fields) lại với nhau. Struct thường được dùng để mô hình hóa các thực thể trong thế giới thực.

👉 Ví dụ: Một "Người dùng" (User) có thể có tên, tuổi, và email.

```go
type User struct {
    Name  string
    Age   int
    Email string
}
```

Struct khác với `map` ở chỗ:

* Trường của struct được xác định tại **compile-time** (có kiểu rõ ràng).
* Không thể thêm/bớt trường động như `map`.

\---

### 2. Khởi tạo Struct

Có nhiều cách khởi tạo struct:

```go
// Cách 1: Gán trực tiếp theo thứ tự
u1 := User{"Alice", 25, "alice@example.com"}

// Cách 2: Gán theo tên trường (khuyến nghị vì rõ ràng)
u2 := User{Name: "Bob", Email: "bob@example.com"}

// Cách 3: Dùng con trỏ (Go tự động quản lý)
u3 := &User{Name: "Charlie", Age: 30}
```

\---

### 3. Anonymous Structs

Anonymous struct được dùng khi bạn chỉ cần một cấu trúc tạm thời, không cần định nghĩa type riêng.

```go
person := struct {
    Name string
    Age  int
}{Name: "David", Age: 40}
```

\---

### 4. Con trỏ đến Struct

Khi bạn dùng con trỏ tới struct, Go cho phép **truy cập trực tiếp các field mà không cần giải tham chiếu**.

```go
u := &User{Name: "Eva", Age: 22}
fmt.Println(u.Name)  // Go tự hiểu là (*u).Name
```

\---

### 5. Struct Embedding (Composition)

Go không có kế thừa như OOP truyền thống. Thay vào đó, Go dùng **composition** (struct embedding) để tái sử dụng code.

```go
type Address struct {
    City  string
    State string
}

type Employee struct {
    Name    string
    Address // Embedded struct
}
```

👉 Khi embedding, bạn có thể truy cập trực tiếp field của struct con:

```go
emp := Employee{Name: "Frank", Address: Address{City: "Seoul", State: "KR"}}
fmt.Println(emp.City) // Truy cập trực tiếp nhờ embedding
```

\---

### 6. Struct Tags

Struct tags là metadata gắn kèm field, thường dùng cho JSON/XML marshaling.

```go
type Product struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Price int    `json:"price"`
}
```

Khi marshal sang JSON:

```json
{"id":1,"name":"Laptop","price":1000}
```

\---

### 7. Methods trong Go

Phương thức (method) là một hàm gắn với một kiểu dữ liệu nhất định (thường là struct).
Cú pháp:

```go
func (receiver Type) MethodName() ReturnType {
    // code
}
```

Ví dụ:

```go
type Circle struct {
    Radius float64
}

// Method gắn với Circle
func (c Circle) Area() float64 {
    return 3.14 * c.Radius * c.Radius
}
```

\---

### 8. Value Receiver vs Pointer Receiver

* **Value Receiver**: Nhận bản sao của struct. Không thay đổi dữ liệu gốc.
* **Pointer Receiver**: Nhận con trỏ tới struct. Có thể thay đổi dữ liệu gốc, thường dùng khi struct lớn hoặc cần tối ưu.

Ví dụ:

```go
type Counter struct {
    Value int
}

func (c Counter) IncrementByValue() {
    c.Value++
}

func (c *Counter) IncrementByPointer() {
    c.Value++
}
```

\---

### 9. Method Sets và Interfaces

Một **method set** là tập hợp các phương thức gắn với một type.

* Nếu receiver là **value**, method set chỉ có các method dùng value receiver.
* Nếu receiver là **pointer**, method set có cả value receiver và pointer receiver.

Điều này quan trọng khi type implement một interface.

\---

## 🏆 Bài tập thực hành

### Đề bài

Xây dựng một hệ thống quản lý tài khoản ngân hàng đơn giản:

* Mỗi tài khoản (`Account`) có: số tài khoản (ID), tên chủ tài khoản (Owner), và số dư (Balance).
* Viết các phương thức:

  1. `Deposit(amount float64)` → nạp tiền vào tài khoản.
  2. `Withdraw(amount float64)` → rút tiền, nhưng không cho phép số dư âm.
  3. `Display()` → in thông tin tài khoản.

### Lời giải chi tiết

```go
package main

import (
    "fmt"
)

type Account struct {
    ID      string
    Owner   string
    Balance float64
}

// Nạp tiền
func (a *Account) Deposit(amount float64) {
    a.Balance += amount
    fmt.Printf("Nạp %.2f vào tài khoản %s\n", amount, a.ID)
}

// Rút tiền
func (a *Account) Withdraw(amount float64) {
    if amount > a.Balance {
        fmt.Println("Số dư không đủ!")
        return
    }
    a.Balance -= amount
    fmt.Printf("Rút %.2f từ tài khoản %s\n", amount, a.ID)
}

// Hiển thị thông tin
func (a Account) Display() {
    fmt.Printf("Tài khoản: %s | Chủ: %s | Số dư: %.2f\n", a.ID, a.Owner, a.Balance)
}

func main() {
    acc := Account{ID: "12345", Owner: "Nguyen Van A", Balance: 1000}

    acc.Display()
    acc.Deposit(500)
    acc.Display()
    acc.Withdraw(2000) // Lỗi vì không đủ số dư
    acc.Withdraw(700)
    acc.Display()
}
```

### Phân tích:

* `Deposit` và `Withdraw` dùng **pointer receiver** vì cần thay đổi dữ liệu gốc (`Balance`).
* `Display` dùng **value receiver** vì chỉ đọc dữ liệu, không thay đổi.
* Logic `Withdraw` kiểm tra số dư để tránh âm.

\---

## 🔑 Những điểm quan trọng cần lưu ý

* Struct là **value type** → khi gán cho biến mới sẽ copy dữ liệu.
* Khi dùng **pointer receiver**, thay đổi sẽ tác động trực tiếp đến struct gốc.
* Struct embedding giúp mô phỏng **composition** thay vì **inheritance**.
* Struct tags cực kỳ quan trọng khi làm việc với JSON, database ORM.
* Lỗi thường gặp:

  * Quên dùng con trỏ khi muốn thay đổi dữ liệu.
  * Gọi nhầm method set (value vs pointer).

\---

## 📝 Bài tập về nhà

### Bài 1

Tạo struct `Book` với các trường: `Title`, `Author`, `Price`.

* Viết method `Discount(percent float64)` để giảm giá sách theo phần trăm.
* Viết method `Display()` để in ra thông tin sách.

\---

### Bài 2

Xây dựng struct `Rectangle` với `Width`, `Height`.

* Viết method `Area()` để tính diện tích.
* Viết method `Scale(factor float64)` để thay đổi kích thước theo tỷ lệ.
* Tạo một hình chữ nhật, scale nó gấp đôi, rồi in diện tích mới.




---

*Post ID: unealysdvipimi4*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
