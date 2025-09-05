---
title: " Bài 8: Functions nâng cao"
postId: "h3xvhha2st6k6nh"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

#  Bài 8: Functions nâng cao


## 🎯 Mục tiêu bài học

Sau khi học xong bài này, học viên sẽ:

* Hiểu rõ cách khai báo và sử dụng hàm trong Go với nhiều hình thức khác nhau.
* Biết sử dụng **multiple return values**, **named return values**, **variadic functions**.
* Làm quen với **anonymous functions, closures, higher-order functions**.
* Hiểu về **function types, defer statement**, và cách Go quản lý tham trị (call by value).
* Áp dụng các kiến thức này để viết code linh hoạt, tái sử dụng, và dễ bảo trì.

\---

## 📝 Nội dung chi tiết

### 1. Function signatures và declarations

Trong Go, hàm được khai báo với từ khóa `func`. Hàm có thể trả về **0, 1 hoặc nhiều giá trị**.

```go
func add(a int, b int) int {
    return a + b
}
```

👉 Hàm `add` nhận vào 2 tham số `int` và trả về một `int`.

\---

### 2. Multiple return values

Go cho phép hàm trả về nhiều giá trị cùng lúc. Điều này thường được dùng để trả về kết quả và lỗi.

```go
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("không thể chia cho 0")
    }
    return a / b, nil
}
```

Sử dụng:

```go
result, err := divide(10, 2)
if err != nil {
    fmt.Println("Lỗi:", err)
} else {
    fmt.Println("Kết quả:", result)
}
```

\---

### 3. Named return values

Có thể đặt tên cho các giá trị trả về. Điều này giúp code dễ đọc hơn.

```go
func rectangle(width, height int) (area int, perimeter int) {
    area = width * height
    perimeter = 2 * (width + height)
    return // Go tự hiểu trả về area, perimeter
}
```

\---

### 4. Variadic functions

Hàm có thể nhận **số lượng tham số không cố định** bằng cách dùng `...`.

```go
func sum(numbers ...int) int {
    total := 0
    for _, v := range numbers {
        total += v
    }
    return total
}
```

Sử dụng:

```go
fmt.Println(sum(1, 2, 3, 4)) // 10
```

\---

### 5. Anonymous functions (Hàm ẩn danh)

Hàm không có tên, thường dùng khi cần nhanh gọn.

```go
func() {
    fmt.Println("Hello từ anonymous function!")
}()
```

Có thể gán cho biến:

```go
greet := func(name string) {
    fmt.Println("Xin chào,", name)
}
greet("WatchCon")
```

\---

### 6. Closures

Closure là hàm có thể **ghi nhớ và sử dụng biến bên ngoài phạm vi của nó**.

```go
func counter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

c := counter()
fmt.Println(c()) // 1
fmt.Println(c()) // 2
fmt.Println(c()) // 3
```

👉 Closure giúp lưu trạng thái giữa các lần gọi.

\---

### 7. First-class functions & Higher-order functions

Trong Go, hàm là **first-class citizens**: có thể gán cho biến, truyền vào hàm khác, hoặc trả về từ hàm.

```go
func apply(f func(int, int) int, a, b int) int {
    return f(a, b)
}

func multiply(x, y int) int { return x * y }

fmt.Println(apply(multiply, 3, 4)) // 12
```

\---

### 8. Function types và variables

Có thể định nghĩa kiểu dữ liệu cho function.

```go
type operation func(int, int) int

func calc(op operation, a, b int) int {
    return op(a, b)
}
```

\---

### 9. Defer statements

`defer` trì hoãn việc thực thi hàm cho đến khi hàm bao ngoài kết thúc.
Thường dùng để **đóng file, giải phóng tài nguyên**.

```go
func readFile() {
    file, _ := os.Open("test.txt")
    defer file.Close() // Đảm bảo file sẽ được đóng
    // xử lý file...
}
```

\---

### 10. Call by value semantics

Trong Go, **tất cả tham số truyền vào đều là copy (call by value)**.
Nếu muốn thay đổi giá trị gốc, ta phải dùng **pointer**.

```go
func changeValue(x int) {
    x = 100
}

a := 10
changeValue(a)
fmt.Println(a) // 10, không thay đổi
```

\---

## 🏆 Bài tập thực hành

**Đề bài:**
Viết hàm `analyzeText(text string)` trả về 3 giá trị:

1. Độ dài chuỗi (số ký tự).
2. Số từ trong chuỗi.
3. Chuỗi viết hoa toàn bộ.

**Lời giải chi tiết:**

```go
package main

import (
    "fmt"
    "strings"
)

func analyzeText(text string) (length int, wordCount int, upper string) {
    length = len(text)
    words := strings.Fields(text) // Tách chuỗi thành mảng từ
    wordCount = len(words)
    upper = strings.ToUpper(text)
    return
}

func main() {
    length, wordCount, upper := analyzeText("Go makes programming fun")
    fmt.Println("Độ dài:", length)
    fmt.Println("Số từ:", wordCount)
    fmt.Println("Viết hoa:", upper)
}
```

🔎 Phân tích:

* `len(text)` → tính số ký tự.
* `strings.Fields` → tách chuỗi thành các từ dựa vào khoảng trắng.
* `strings.ToUpper` → chuyển sang chữ hoa.
* Dùng **named return values** để code gọn gàng.

\---

## 🔑 Những điểm quan trọng cần lưu ý

* Go hỗ trợ **trả về nhiều giá trị** → phổ biến để xử lý lỗi.
* **Named return values** giúp code dễ hiểu nhưng nên dùng hợp lý, tránh lạm dụng.
* **Closures** rất mạnh mẽ, thường dùng trong các tình huống cần giữ trạng thái.
* Tất cả tham số truyền vào đều là **call by value** → muốn thay đổi giá trị gốc thì phải dùng con trỏ.
* `defer` thực thi theo **LIFO (Last In, First Out)** khi hàm kết thúc.

\---

## 📝 Bài tập về nhà

1. **Bài tập 1:**
   Viết hàm `minMax(numbers ...int)` trả về **giá trị nhỏ nhất và lớn nhất** trong một dãy số.

2. **Bài tập 2:**
   Viết hàm `makeMultiplier(n int)` trả về một closure. Closure này nhận vào một số và trả về kết quả nhân với `n`.
   👉 Ví dụ:

```go
double := makeMultiplier(2)
fmt.Println(double(5)) // 10
```



---

*Post ID: h3xvhha2st6k6nh*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
