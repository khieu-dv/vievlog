---
title: "Bài 3: Chuỗi và Xử lý văn bản trong Go"
postId: "jfbuxz68vdqsvc6"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 3: Chuỗi và Xử lý văn bản trong Go





## 🎯 Mục tiêu bài học

Sau khi học xong bài này, học viên sẽ:

* Hiểu rõ kiểu dữ liệu **string** trong Go và tính chất **immutable** (không thay đổi được).
* Biết cách khai báo chuỗi với *raw string literals* và *interpreted string literals*.
* Sử dụng thành thạo các **escape sequences** như `\n`, `\t`, `\"`.
* Làm việc với các package quan trọng: `strings`, `strconv`, `fmt`.
* Hiểu cách xử lý chuỗi chứa Unicode/UTF-8.
* Nắm được cách nối chuỗi hiệu quả bằng **strings.Builder**.

\---

## 📝 Nội dung chi tiết

### 1. Kiểu String và đặc điểm Immutable

Trong Go, **string** là một dãy byte bất biến (*immutable*).

```go
s := "Hello"
fmt.Println(s[0]) // 72 (byte của 'H')
```

* Không thể thay đổi trực tiếp ký tự trong chuỗi:

```go
s[0] = 'h' // ❌ Lỗi biên dịch
```

* Muốn thay đổi phải tạo chuỗi mới.

\---

### 2. Raw String Literals và Interpreted String Literals

* **Interpreted string literals**: dùng dấu `"` (double quotes), hỗ trợ escape sequences.

```go
s := "Hello\nWorld"
```

* **Raw string literals**: dùng dấu backticks `` ` ``, giữ nguyên tất cả ký tự.

```go
s := `Hello\nWorld`
fmt.Println(s) // in ra Hello\nWorld chứ không xuống dòng
```

\---

### 3. Escape Sequences

Một số ký tự đặc biệt thường dùng:

* `\n` : xuống dòng
* `\t` : tab
* `\"` : in dấu ngoặc kép
* `\\` : in dấu `\`

Ví dụ:

```go
fmt.Println("Line1\nLine2")
fmt.Println("She said: \"Go is great!\"")
```

\---

### 4. Package `strings`

Go cung cấp nhiều hàm xử lý chuỗi trong package `strings`:

```go
import "strings"

s := "Go Programming"
fmt.Println(strings.ToUpper(s))   // "GO PROGRAMMING"
fmt.Println(strings.Contains(s, "Go")) // true
fmt.Println(strings.Split(s, " "))     // ["Go", "Programming"]
fmt.Println(strings.Join([]string{"Go", "Lang"}, "-")) // "Go-Lang"
```

\---

### 5. Package `strconv`

Dùng để chuyển đổi giữa chuỗi và số:

```go
import "strconv"

i, _ := strconv.Atoi("123")  // "123" -> 123
s := strconv.Itoa(456)       // 456 -> "456"

f, _ := strconv.ParseFloat("3.14", 64)
fmt.Println(f) // 3.14
```

\---

### 6. Package `fmt` với định dạng chuỗi

* `Printf` in ra trực tiếp:

```go
name := "Alice"
age := 25
fmt.Printf("Name: %s, Age: %d\n", name, age)
```

* `Sprintf` trả về chuỗi thay vì in ra:

```go
msg := fmt.Sprintf("Name: %s, Age: %d", name, age)
fmt.Println(msg)
```

\---

### 7. Chuỗi và Unicode/UTF-8

Chuỗi trong Go mặc định lưu dưới dạng **UTF-8**.

* Duyệt chuỗi bằng **for-range** để lấy ký tự Unicode thay vì byte:

```go
s := "Xin chào"
for i, r := range s {
    fmt.Printf("%d: %c\n", i, r)
}
```

\---

### 8. Hiệu suất nối chuỗi

Nếu nối nhiều chuỗi bằng `+`, hiệu suất sẽ kém.
👉 Giải pháp: dùng **strings.Builder**

```go
var builder strings.Builder
builder.WriteString("Hello")
builder.WriteString(", ")
builder.WriteString("World")
fmt.Println(builder.String()) // "Hello, World"
```

\---

## 🏆 Bài tập thực hành

### Đề bài

Viết chương trình Go yêu cầu người dùng nhập **họ tên** và **tuổi**, sau đó in ra:

```
Your name is <name> and you are <age> years old.
```

### Lời giải chi tiết

**Bước 1:** Sử dụng package `fmt` để nhập dữ liệu từ bàn phím.
**Bước 2:** Dùng `Printf` để in chuỗi với định dạng.

```go
package main

import (
    "fmt"
)

func main() {
    var name string
    var age int

    // Bước 1: Nhập dữ liệu
    fmt.Print("Enter your name: ")
    fmt.Scanln(&name)

    fmt.Print("Enter your age: ")
    fmt.Scanln(&age)

    // Bước 2: In ra kết quả
    fmt.Printf("Your name is %s and you are %d years old.\n", name, age)
}
```

👉 Giải thích:

* `fmt.Scanln(&name)` đọc input từ bàn phím và lưu vào biến `name`.
* `&` dùng để lấy địa chỉ của biến (Scanln cần con trỏ để gán giá trị).
* `Printf` với `%s` (chuỗi) và `%d` (số nguyên).

\---

## 🔑 Những điểm quan trọng cần lưu ý

* **Chuỗi trong Go là immutable** → không thay đổi được từng ký tự.
* Phân biệt giữa `"` (interpreted string) và `` ` `` (raw string).
* Khi cần xử lý Unicode → dùng `for range` thay vì truy cập theo index.
* Khi nối nhiều chuỗi → dùng `strings.Builder` để tối ưu hiệu suất.
* Package quan trọng cần nhớ: `strings`, `strconv`, `fmt`.

\---

## 📝 Bài tập về nhà

### Bài tập 1

Viết chương trình đọc vào một câu từ bàn phím.

* In ra số lượng ký tự (Unicode) trong câu.
* In ra câu viết hoa toàn bộ.

\---

### Bài tập 2

Viết chương trình khai báo một slice chứa các chuỗi: `["Go", "is", "fun"]`.

* Nối chúng lại thành một chuỗi duy nhất với khoảng trắng ở giữa.
* In ra kết quả:

```
Go is fun
```



---

*Post ID: jfbuxz68vdqsvc6*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
