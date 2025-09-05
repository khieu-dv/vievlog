---
title: "Bài 2: Cú pháp cơ bản và Kiểu dữ liệu trong Go"
postId: "o31tnepdq0uibwd"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 2: Cú pháp cơ bản và Kiểu dữ liệu trong Go



## 🎯 Mục tiêu bài học

Sau khi học xong bài này, học viên sẽ:

* Nắm được cách khai báo biến trong Go bằng nhiều cú pháp khác nhau.
* Hiểu giá trị mặc định (*zero values*) của các kiểu dữ liệu.
* Biết cách khai báo hằng số với `const` và từ khóa đặc biệt `iota`.
* Phân biệt phạm vi biến (*scope*) và hiện tượng *shadowing*.
* Hiểu rõ các kiểu dữ liệu cơ bản: Boolean, số nguyên, số thực, số phức, ký tự, chuỗi.
* Biết cách chuyển đổi kiểu dữ liệu một cách an toàn trong Go.

\---

## 📝 Nội dung chi tiết

### 1. Khai báo biến với `var`

Trong Go, biến có thể khai báo bằng từ khóa `var`:

```go
var age int
age = 25

var name string = "Alice"
```

* Nếu không gán giá trị, biến sẽ nhận giá trị mặc định (*zero value*).
* Có thể khai báo nhiều biến cùng lúc:

```go
var x, y int = 1, 2
```

\---

### 2. Khai báo nhanh với `:=`

Go hỗ trợ cú pháp ngắn gọn:

```go
message := "Hello, Go!"
count := 10
```

* `:=` vừa **khai báo** vừa **gán giá trị**.
* Chỉ sử dụng được bên trong hàm (không dùng ngoài package scope).

\---

### 3. Zero Values

Khi khai báo biến mà không gán giá trị ban đầu, Go gán giá trị mặc định:

* `int`, `float` → `0`
* `bool` → `false`
* `string` → `""` (chuỗi rỗng)
* `pointer`, `slice`, `map` → `nil`

Ví dụ:

```go
var a int     // 0
var b string  // ""
var c bool    // false
```

\---

### 4. Hằng số với `const` và `iota`

* `const` dùng để khai báo hằng số:

```go
const Pi = 3.14
```

* `iota` là bộ đếm tự động, thường dùng cho enum:

```go
const (
    Red = iota   // 0
    Green        // 1
    Blue         // 2
)
```

\---

### 5. Scope và Shadowing

* **Scope**: phạm vi mà biến có thể được truy cập.
* **Shadowing**: khi một biến mới trùng tên với biến cũ trong phạm vi nhỏ hơn, biến cũ sẽ bị “che khuất”.

Ví dụ:

```go
var x = 10

func main() {
    x := 5 // shadowing biến x bên ngoài
    fmt.Println(x) // 5
}
```

\---

### 6. Kiểu dữ liệu Boolean

* Có hai giá trị: `true`, `false`.
* Dùng trong điều kiện `if`, `for`:

```go
isReady := true
if isReady {
    fmt.Println("Ready to go!")
}
```

\---

### 7. Kiểu số

Go hỗ trợ nhiều loại số:

* **Số nguyên có dấu**: `int`, `int8`, `int16`, `int32`, `int64`
* **Số nguyên không dấu**: `uint`, `uint8`, `uint16`, `uint32`, `uint64`
* **Số thực**: `float32`, `float64`
* **Số phức**: `complex64`, `complex128`

Ví dụ:

```go
var a int = 42
var b float64 = 3.14
c := complex(2, 3) // 2 + 3i
```

\---

### 8. Kiểu Rune và Unicode

* `rune` là alias của `int32`, biểu diễn một ký tự Unicode.

```go
var ch rune = 'A' // rune
fmt.Println(ch)   // in ra 65 (mã Unicode)
```

\---

### 9. Chuyển đổi kiểu dữ liệu (Type Conversion)

Go không tự động ép kiểu, cần chuyển đổi tường minh:

```go
var x int = 10
var y float64 = float64(x)
var z int = int(y)
```

\---

## 🏆 Bài tập thực hành

### Đề bài

Viết chương trình Go khai báo:

1. Một biến `name` kiểu string với giá trị `"Alice"`.
2. Một biến `age` kiểu int với giá trị `25`.
3. In ra màn hình câu:

```
My name is Alice and I am 25 years old.
```

### Lời giải chi tiết

**Bước 1:** Khai báo biến `name` và `age`.
**Bước 2:** Dùng `Printf` để in kèm định dạng.
**Bước 3:** Sử dụng `%s` cho chuỗi, `%d` cho số nguyên.

```go
package main

import "fmt"

func main() {
    // Bước 1: Khai báo biến
    var name string = "Alice"
    var age int = 25

    // Bước 2: In ra màn hình với Printf
    fmt.Printf("My name is %s and I am %d years old.\n", name, age)
}
```

👉 Giải thích:

* `%s` là placeholder cho chuỗi.
* `%d` là placeholder cho số nguyên.
* `\n` để xuống dòng sau khi in.

\---

## 🔑 Những điểm quan trọng cần lưu ý

* `var` có thể dùng ở mọi nơi, `:=` chỉ dùng trong hàm.
* Mỗi biến luôn có **zero value**, không có “undefined” như JavaScript.
* `const` bắt buộc phải có giá trị cố định tại thời điểm biên dịch.
* `iota` rất hữu ích để khai báo các hằng số liên tiếp.
* Go không tự động ép kiểu → luôn cần chuyển đổi rõ ràng.
* Dễ nhầm giữa `rune` (ký tự Unicode) và `byte` (một byte).

\---

## 📝 Bài tập về nhà

### Bài tập 1

Khai báo 3 biến:

* `city` (string),
* `population` (int),
* `isCapital` (bool).

In ra màn hình câu:

```
City: Seoul, Population: 9500000, Capital: true
```

\---

### Bài tập 2

Tạo một hằng số `Day` sử dụng `iota` để biểu diễn các ngày trong tuần (Monday, Tuesday, …, Sunday).
Viết chương trình in ra giá trị số nguyên tương ứng của `Wednesday` và `Friday`.



---

*Post ID: o31tnepdq0uibwd*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
