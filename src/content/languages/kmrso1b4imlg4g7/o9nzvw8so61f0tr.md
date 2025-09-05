---
title: "Bài 11: Error Handling trong Go"
postId: "o9nzvw8so61f0tr"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 11: Error Handling trong Go



## 📌 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ:

1. Hiểu triết lý xử lý lỗi trong Go và sự khác biệt so với các ngôn ngữ khác.
2. Biết cách tạo, kiểm tra, gói và xử lý các lỗi cơ bản và nâng cao.
3. Sử dụng `panic` và `recover` một cách hợp lý.
4. Áp dụng các idiom phổ biến của Go trong xử lý lỗi, bao gồm Sentinel errors, error wrapping và unwrapping.
5. Phân biệt khi nào nên trả về lỗi thông thường và khi nào nên dùng panic.

\---

## 📝 Nội dung chi tiết

### 1. Triết lý xử lý lỗi trong Go

Trong Go, **lỗi là giá trị (error is a value)**. Thay vì ném exception, Go khuyến khích trả về lỗi dưới dạng giá trị và kiểm tra ngay sau khi thực thi.

**Ưu điểm:**

* Dễ theo dõi luồng xử lý.
* Không cần try-catch phức tạp.
* Khuyến khích lập trình defensive.

\---

### 2. Giao diện `error`

Go định nghĩa một interface chuẩn để biểu diễn lỗi:

```go
type error interface {
    Error() string
}
```

Mọi giá trị implement interface `error` đều có thể được coi là lỗi.

**Ví dụ cơ bản:**

```go
package main

import (
    "errors"
    "fmt"
)

func main() {
    var err error = errors.New("something went wrong")
    if err != nil {
        fmt.Println("Error:", err)
    }
}
```

**Giải thích:**

* `errors.New()` tạo một lỗi đơn giản với thông báo.
* Kiểm tra `if err != nil` là cách chuẩn để xử lý lỗi.

\---

### 3. Tạo lỗi với `fmt.Errorf()`

`fmt.Errorf` giúp tạo lỗi với format string và có thể **gói lỗi khác**:

```go
package main

import (
    "errors"
    "fmt"
)

func readFile(name string) error {
    return fmt.Errorf("failed to read file %s: %w", name, errors.New("file not found"))
}

func main() {
    err := readFile("data.txt")
    fmt.Println(err)
}
```

**Giải thích:**

* `%w` dùng để **wrap một lỗi khác**.
* Giúp giữ thông tin lỗi gốc để truy vết (stack trace).

\---

### 4. Custom error types

Bạn có thể tạo **loại lỗi tùy chỉnh** để chứa thêm thông tin:

```go
package main

import "fmt"

type MyError struct {
    Code    int
    Message string
}

func (e *MyError) Error() string {
    return fmt.Sprintf("Error %d: %s", e.Code, e.Message)
}

func riskyOperation() error {
    return &MyError{Code: 404, Message: "Resource not found"}
}

func main() {
    err := riskyOperation()
    if err != nil {
        fmt.Println(err)
    }
}
```

**Giải thích:**

* Implement `Error()` method để tuân theo interface `error`.
* Cho phép bạn lưu thêm thông tin, như mã lỗi.

\---

### 5. Error wrapping và unwrapping

Go 1.13+ hỗ trợ unwrap lỗi để truy xuất lỗi gốc:

```go
package main

import (
    "errors"
    "fmt"
)

func main() {
    baseErr := errors.New("network timeout")
    wrappedErr := fmt.Errorf("request failed: %w", baseErr)

    fmt.Println(wrappedErr)               // request failed: network timeout
    fmt.Println(errors.Unwrap(wrappedErr)) // network timeout
    fmt.Println(errors.Is(wrappedErr, baseErr)) // true
}
```

**Giải thích:**

* `errors.Unwrap()` lấy lỗi gốc.
* `errors.Is()` kiểm tra xem lỗi có chain đến lỗi gốc không.
* `errors.As()` dùng để cast lỗi sang custom error type.

\---

### 6. Sentinel errors

Là các lỗi được định nghĩa cố định để so sánh trực tiếp:

```go
var ErrNotFound = errors.New("not found")

func find(id int) error {
    if id != 1 {
        return ErrNotFound
    }
    return nil
}

func main() {
    err := find(2)
    if errors.Is(err, ErrNotFound) {
        fmt.Println("Resource not found!")
    }
}
```

**Lưu ý:**

* Sentinel errors thường dùng cho **so sánh trực tiếp** hoặc pattern matching.

\---

### 7. `panic` và `recover`

* **panic**: Dùng khi chương trình gặp lỗi nghiêm trọng không thể tiếp tục.
* **recover**: Dùng trong defer để bắt panic và xử lý an toàn.

```go
package main

import "fmt"

func mayPanic() {
    panic("something went terribly wrong")
}

func main() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
        }
    }()
    
    mayPanic()
    fmt.Println("Program continues safely")
}
```

**Giải thích:**

* Panic sẽ dừng execution bình thường.
* Recover cho phép chương trình **tiếp tục chạy** sau khi panic.

**Nguyên tắc:**

* Dùng panic cho lỗi **không thể phục hồi** (logic sai, bug).
* Dùng error cho lỗi **có thể xử lý hoặc báo cho người dùng**.

\---

### 8. Stack traces và debugging

* Wrapping errors giúp giữ thông tin về nơi phát sinh.
* Kết hợp với logging (ví dụ `log` hoặc `slog`) để debug dễ dàng.

\---

## 🏆 Bài tập thực hành

### Bài tập 1: Quản lý người dùng

**Đề bài:**
Tạo một chương trình quản lý người dùng với các thao tác tìm người theo ID.

* Nếu không tìm thấy người, trả về lỗi `ErrUserNotFound`.
* Nếu ID âm, trả về lỗi `ErrInvalidID`.
* Hàm `getUserByID(id int)` trả về `(string, error)`.

**Lời giải chi tiết:**

```go
package main

import (
    "errors"
    "fmt"
)

// Định nghĩa sentinel errors
var (
    ErrUserNotFound = errors.New("user not found")
    ErrInvalidID    = errors.New("invalid user ID")
)

// Dữ liệu giả lập
var users = map[int]string{
    1: "Alice",
    2: "Bob",
}

// Hàm tìm user
func getUserByID(id int) (string, error) {
    if id < 0 {
        return "", ErrInvalidID
    }
    user, ok := users[id]
    if !ok {
        return "", ErrUserNotFound
    }
    return user, nil
}

func main() {
    ids := []int{1, 3, -1}
    for _, id := range ids {
        user, err := getUserByID(id)
        if err != nil {
            if errors.Is(err, ErrUserNotFound) {
                fmt.Printf("User ID %d: not found\n", id)
            } else if errors.Is(err, ErrInvalidID) {
                fmt.Printf("User ID %d: invalid ID\n", id)
            }
        } else {
            fmt.Printf("User ID %d: %s\n", id, user)
        }
    }
}
```

**Giải thích từng bước:**

1. Định nghĩa các lỗi cố định (`ErrUserNotFound`, `ErrInvalidID`).
2. Tạo map giả lập `users`.
3. Trong `getUserByID`: kiểm tra ID hợp lệ, sau đó kiểm tra tồn tại trong map.
4. Sử dụng `errors.Is()` để kiểm tra lỗi trong `main`.
5. Output phân biệt lỗi và kết quả hợp lệ.

\---

## 🔑 Những điểm quan trọng cần lưu ý

1. **Luôn kiểm tra lỗi** sau khi gọi hàm trả về `error`.
2. **Tránh panic** trong flow thông thường; chỉ dùng cho tình huống nghiêm trọng.
3. `error` trong Go là **interface**, có thể implement để lưu thêm thông tin.
4. `errors.Is` và `errors.As` giúp xử lý lỗi wrapped và custom error hiệu quả.
5. Sentinel errors nên dùng cẩn thận: tránh lạm dụng global state.
6. Defer + recover giúp chương trình không crash toàn bộ, nhưng không thay thế xử lý lỗi đúng cách.

\---

## 📝 Bài tập về nhà

**Bài 1:**
Viết chương trình quản lý sách với map `books` (ID -> tên sách).

* Nếu sách không tồn tại, trả về `ErrBookNotFound`.
* Tạo hàm `findBook(id int) (string, error)` và xử lý lỗi ở `main`.

**Bài 2:**
Viết chương trình tính toán chia hai số `a / b`.

* Nếu `b == 0`, trả về lỗi `ErrDivideByZero`.
* Nếu `a` hoặc `b` âm, trả về lỗi `ErrNegativeNumber`.
* Hàm `divide(a, b int) (int, error)` và xử lý lỗi khi gọi hàm.



---

*Post ID: o9nzvw8so61f0tr*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
