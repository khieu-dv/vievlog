---
title: "Bài 9: Pointers và Quản lý Bộ nhớ trong Go"
postId: "0r0il5yyf6lvebb"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 9: Pointers và Quản lý Bộ nhớ trong Go



## 🎯 **Mục tiêu bài học**

Sau khi học xong bài này, học viên sẽ:

1. Hiểu bản chất của **pointers** trong Go và cách sử dụng chúng.
2. Biết cách **truyền tham chiếu** vào hàm để thay đổi giá trị gốc.
3. Nắm được cơ chế **stack vs heap allocation** và ảnh hưởng đến hiệu suất.
4. Hiểu cơ bản về **garbage collection (GC)** và cách quản lý bộ nhớ trong Go.
5. Áp dụng các **best practices** khi làm việc với pointers, maps và slices.

\---

## 📝 **Nội dung chi tiết**

### 1. **Pointer cơ bản**

Pointer là một biến lưu địa chỉ bộ nhớ của một giá trị khác.

* **`&` operator:** Lấy địa chỉ của biến.
* **`*` operator:** Truy cập giá trị từ địa chỉ pointer.

```go
package main
import "fmt"

func main() {
    a := 10          // biến a
    var p *int = &a  // p là pointer trỏ tới a

    fmt.Println("Giá trị a:", a)     // 10
    fmt.Println("Địa chỉ a:", &a)    // 0xc000014088 (ví dụ)
    fmt.Println("Pointer p:", p)     // 0xc000014088
    fmt.Println("Giá trị qua p:", *p) // 10

    *p = 20
    fmt.Println("a sau khi đổi qua pointer:", a) // 20
}
```

**Giải thích:** `p` lưu địa chỉ của `a`. Khi thay đổi giá trị thông qua `*p`, giá trị của `a` cũng thay đổi.

**Lưu ý:** Zero value của pointer là `nil`.

```go
var ptr *int
fmt.Println(ptr == nil) // true
```

\---

### 2. **Pointer với Structs**

Pointers thường dùng với struct để tránh copy toàn bộ dữ liệu.

```go
type Person struct {
    Name string
    Age  int
}

func main() {
    p := Person{Name: "John", Age: 30}
    ptr := &p

    ptr.Age = 31 // thay đổi trực tiếp trên struct thông qua pointer
    fmt.Println(p) // {John 31}
}
```

\---

### 3. **Pointer với Maps và Slices**

* Maps và slices là **reference types**, bản thân chúng chứa pointer ngầm định.
* Khi truyền vào hàm, giá trị gốc có thể bị thay đổi mà không cần dùng `*`.

```go
func updateSlice(s []int) {
    s[0] = 100
}

func main() {
    numbers := []int{1,2,3}
    updateSlice(numbers)
    fmt.Println(numbers) // [100 2 3]
}
```

\---

### 4. **Không có Pointer Arithmetic**

Khác với C/C++, Go **không cho phép arithmetic trên pointer**, giúp tránh lỗi tràn bộ nhớ.

\---

### 5. **Pass by Reference với Pointers**

* Khi muốn hàm thay đổi giá trị gốc, truyền pointer thay vì giá trị.

```go
func increment(x *int) {
    *x++
}

func main() {
    num := 5
    increment(&num)
    fmt.Println(num) // 6
}
```

\---

### 6. **Stack vs Heap Allocation**

* **Stack:** Biến tạm thời, tự động xóa khi hàm kết thúc.
* **Heap:** Biến cần sống lâu hơn scope hiện tại, được garbage collector quản lý.
* **Escape analysis:** Go tự quyết định biến nào nên nằm heap dựa vào việc biến có "thoát" khỏi scope hay không.

```go
func createPointer() *int {
    x := 10
    return &x // x "thoát" khỏi hàm => Go đặt nó trên heap
}
```

\---

### 7. **Garbage Collection (GC)**

* Go có GC tự động, giải phóng bộ nhớ không còn được sử dụng.
* Lưu ý: Không dùng GC để bù lỗi thiết kế, vẫn nên quản lý reference hợp lý.

\---

### 8. **Memory Profiling cơ bản**

* Go cung cấp package `runtime/pprof` để phân tích memory usage.
* Ví dụ: đo heap allocation trong chương trình lớn.

\---

### 9. **Best Practices với Pointers**

1. Tránh pointer nil: luôn khởi tạo trước khi dùng.
2. Dùng pointer với struct lớn để tránh copy nặng.
3. Tránh pointer trỏ đến local variable nếu không cần thiết (xem escape analysis).
4. Không lạm dụng pointer với slices/maps vì chúng vốn đã reference type.
5. Giữ code đơn giản, dễ đọc, tránh nhiều layer pointer lồng nhau.

\---

## 🏆 **Bài tập thực hành**

**Đề bài:**
Viết một chương trình quản lý danh sách học viên. Mỗi học viên có `Name` và `Score`.

1. Khởi tạo danh sách 3 học viên.
2. Tạo hàm **updateScore** nhận pointer tới học viên và cộng thêm điểm.
3. In danh sách trước và sau khi cập nhật.

**Lời giải chi tiết:**

```go
package main

import "fmt"

type Student struct {
    Name  string
    Score int
}

// Hàm nhận pointer để thay đổi giá trị gốc
func updateScore(s *Student, added int) {
    s.Score += added
}

func main() {
    students := []Student{
        {"Alice", 80},
        {"Bob", 75},
        {"Charlie", 90},
    }

    fmt.Println("Trước khi cập nhật:")
    for _, s := range students {
        fmt.Println(s.Name, s.Score)
    }

    // Cập nhật điểm từng học viên
    for i := range students {
        updateScore(&students[i], 5) // truyền pointer
    }

    fmt.Println("Sau khi cập nhật:")
    for _, s := range students {
        fmt.Println(s.Name, s.Score)
    }
}
```

**Giải thích logic:**

* `updateScore` dùng pointer để thay đổi trực tiếp giá trị gốc của `Student`.
* Khi lặp slice, dùng `&students[i]` để lấy pointer tới phần tử.
* Kết quả: tất cả học viên đều tăng 5 điểm, không cần copy struct.

\---

## 🔑 **Những điểm quan trọng cần lưu ý**

1. `*` và `&` là cơ bản để thao tác với pointer.
2. Pointer zero value = `nil`, luôn kiểm tra trước khi dereference.
3. Maps và slices là reference types, không cần pointer để thay đổi dữ liệu.
4. Go không có pointer arithmetic => an toàn hơn C/C++.
5. Escape analysis xác định stack vs heap, ảnh hưởng performance.
6. Garbage collection tự động nhưng vẫn cần quản lý reference hợp lý.
7. Tránh lạm dụng pointer, giữ code dễ đọc và maintainable.

\---

## 📝 **Bài tập về nhà**

1. Viết chương trình quản lý danh sách sách (`Book`) với các trường `Title`, `Author`, `Price`. Tạo hàm giảm giá nhận pointer tới book, giảm giá 10% cho mỗi sách. In danh sách trước và sau khi giảm giá.
2. Viết chương trình nhận slice số nguyên. Tạo hàm nhân đôi giá trị tất cả phần tử trong slice bằng cách truyền slice vào hàm. In trước và sau khi nhân đôi.



---

*Post ID: 0r0il5yyf6lvebb*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
