---
title: "Bài 4: Cấu trúc điều khiển"
postId: "27u0mdjslvnq7b3"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 4: Cấu trúc điều khiển




### 🎯 **Mục tiêu bài học**

Sau khi hoàn thành bài này, học viên sẽ:

* Hiểu và sử dụng thành thạo các cấu trúc điều khiển trong Go: `if`, `switch`, `for`, `break`, `continue`, `goto`.
* Biết cách kết hợp các cấu trúc điều khiển để xây dựng logic điều kiện và vòng lặp phức tạp.
* Hiểu rõ các trường hợp đặc biệt trong Go như **switch không điều kiện**, **type switch**, **if với initialization**.
* Nhận diện và tránh được các lỗi thường gặp khi sử dụng cấu trúc điều khiển.

\---

### 📝 **Nội dung chi tiết**

#### 1. Câu lệnh `if` và `if-else`

* Trong Go, `if` **không cần dấu ngoặc tròn** `()` quanh điều kiện, nhưng **bắt buộc có dấu ngoặc nhọn `{}`** cho khối lệnh.
* Cấu trúc:

```go
if condition {
    // code khi điều kiện đúng
} else {
    // code khi điều kiện sai
}
```

Ví dụ:

```go
age := 20
if age >= 18 {
    fmt.Println("Bạn đủ tuổi trưởng thành")
} else {
    fmt.Println("Bạn chưa đủ tuổi trưởng thành")
}
```

\---

#### 2. If với **Initialization Statement**

Go cho phép khai báo biến ngay trong `if`, biến này chỉ có phạm vi trong `if`.

```go
if score := 85; score >= 50 {
    fmt.Println("Đậu kỳ thi")
} else {
    fmt.Println("Rớt kỳ thi")
}
```

\---

#### 3. Câu lệnh `switch`

* Dùng khi có nhiều nhánh rẽ.
* Go **tự động break** sau mỗi case, không cần viết `break` như C/Java.

```go
day := 3
switch day {
case 1:
    fmt.Println("Thứ Hai")
case 2:
    fmt.Println("Thứ Ba")
case 3:
    fmt.Println("Thứ Tư")
default:
    fmt.Println("Ngày không hợp lệ")
}
```

👉 **Lưu ý:** có thể dùng `fallthrough` để ép chạy tiếp case tiếp theo.

\---

#### 4. Type Switch

Dùng để kiểm tra **kiểu dữ liệu** của một biến interface.

```go
var x interface{} = "hello"

switch v := x.(type) {
case int:
    fmt.Println("Kiểu int", v)
case string:
    fmt.Println("Kiểu string", v)
default:
    fmt.Println("Kiểu khác")
}
```

\---

#### 5. Switch không điều kiện

Có thể bỏ điều kiện và sử dụng như `if-else if`.

```go
num := -10
switch {
case num > 0:
    fmt.Println("Số dương")
case num < 0:
    fmt.Println("Số âm")
default:
    fmt.Println("Số 0")
}
```

\---

#### 6. Vòng lặp `for`

* **Go chỉ có 1 vòng lặp duy nhất là `for`**, nhưng có nhiều biến thể.

**Dạng cơ bản (giống C):**

```go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
```

**For như while:**

```go
i := 0
for i < 5 {
    fmt.Println(i)
    i++
}
```

**For vô hạn:**

```go
for {
    fmt.Println("Chạy mãi")
    break
}
```

\---

#### 7. For với `range`

Dùng để duyệt **slice, array, map, string**.

```go
nums := []int{1, 2, 3}
for index, value := range nums {
    fmt.Println(index, value)
}
```

\---

#### 8. `break`, `continue`, `goto`, `labels`

* `break`: thoát vòng lặp.
* `continue`: bỏ qua vòng lặp hiện tại, sang vòng tiếp theo.
* `goto`: nhảy tới nhãn, **ít dùng** vì dễ gây khó đọc code.

Ví dụ `continue`:

```go
for i := 1; i <= 5; i++ {
    if i%2 == 0 {
        continue
    }
    fmt.Println(i) // in số lẻ
}
```

\---

### 🏆 **Bài tập thực hành**

**Đề bài:**
Viết chương trình yêu cầu người dùng nhập một số nguyên `n`.

* Nếu `n` chia hết cho 3 → in `"Fizz"`.
* Nếu `n` chia hết cho 5 → in `"Buzz"`.
* Nếu `n` chia hết cho cả 3 và 5 → in `"FizzBuzz"`.
* Nếu không chia hết cho 3 hoặc 5 → in số đó.

👉 Đây là một biến thể đơn giản của bài toán kinh điển **FizzBuzz**.

\---

**Lời giải chi tiết:**

```go
package main

import (
    "fmt"
)

func main() {
    var n int
    fmt.Print("Nhập một số: ")
    fmt.Scan(&n)

    if n%3 == 0 && n%5 == 0 {
        fmt.Println("FizzBuzz")
    } else if n%3 == 0 {
        fmt.Println("Fizz")
    } else if n%5 == 0 {
        fmt.Println("Buzz")
    } else {
        fmt.Println(n)
    }
}
```

🔎 **Phân tích từng bước:**

1. Dùng `fmt.Scan` để nhập giá trị từ bàn phím.
2. Dùng chuỗi `if-else` để kiểm tra:

   * Nếu chia hết cho cả 3 và 5 → ưu tiên in `"FizzBuzz"`.
   * Nếu chỉ chia hết cho 3 → `"Fizz"`.
   * Nếu chỉ chia hết cho 5 → `"Buzz"`.
   * Nếu không → in số `n`.
3. Chú ý thứ tự kiểm tra: phải kiểm tra `(n%3==0 && n%5==0)` trước, nếu không thì `"FizzBuzz"` sẽ không bao giờ chạy.

\---

### 🔑 **Những điểm quan trọng cần lưu ý**

* Go **không có** `while` hay `do-while`, chỉ dùng `for`.
* `switch` trong Go **tự break** sau mỗi `case`.
* `fallthrough` hiếm khi cần, chỉ dùng khi thực sự muốn logic chạy tiếp.
* `goto` chỉ nên dùng trong trường hợp đặc biệt, vì dễ làm code khó đọc.
* Khi dùng `range` với `map`, thứ tự các phần tử **không đảm bảo**.

\---

### 📝 **Bài tập về nhà**

1. Viết chương trình nhập vào một số nguyên `n`. Kiểm tra và in ra:

   * `"Số chẵn"` nếu n là số chẵn.
   * `"Số lẻ"` nếu n là số lẻ.

2. Viết chương trình in ra bảng cửu chương từ 1 đến 9 bằng vòng lặp `for`.


---

*Post ID: 27u0mdjslvnq7b3*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
