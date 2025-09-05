---
title: "Bài 5: Arrays và Slices"
postId: "85ff7ph550vhgqe"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 5: Arrays và Slices



### 🎯 Mục tiêu bài học

Sau khi học xong bài này, học viên sẽ:

* Hiểu khái niệm **Array** (mảng) trong Go và đặc điểm "value type".
* Nắm vững cách khai báo, khởi tạo, và sử dụng **multidimensional arrays**.
* Hiểu rõ **Slice** – cấu trúc dữ liệu động mạnh mẽ của Go.
* Nắm được **cách hoạt động nội bộ của Slice (slice header: pointer, length, capacity)**.
* Biết cách sử dụng **make(), append(), copy()** để làm việc với slices.
* Nhận biết và tránh được các lỗi thường gặp khi sử dụng arrays và slices.
* Vận dụng arrays và slices để giải quyết các bài toán thực tế.

\---

### 📝 Nội dung chi tiết

#### 1. Array trong Go

* **Định nghĩa:** Array là một tập hợp các phần tử có **cùng kiểu dữ liệu**, có **độ dài cố định**.
* **Đặc điểm quan trọng:** Array trong Go là **value type**. Nghĩa là khi gán array này cho array khác, nó sẽ **tạo bản sao hoàn toàn** chứ không tham chiếu.

👉 **Ví dụ:**

```go
package main

import "fmt"

func main() {
    var numbers [3]int // khai báo mảng 3 phần tử kiểu int, mặc định = 0
    numbers[0] = 10
    numbers[1] = 20
    numbers[2] = 30

    fmt.Println("Mảng numbers:", numbers)

    copyArr := numbers // tạo bản sao, không tham chiếu
    copyArr[0] = 99

    fmt.Println("Original:", numbers) // vẫn giữ nguyên
    fmt.Println("Copy:", copyArr)    // thay đổi độc lập
}
```

\---

#### 2. Multidimensional Arrays

Array có thể nhiều chiều (2D, 3D,…). Ví dụ thường dùng trong ma trận hoặc bảng dữ liệu.

👉 **Ví dụ:**

```go
package main

import "fmt"

func main() {
    matrix := [2][3]int{
        {1, 2, 3},
        {4, 5, 6},
    }

    fmt.Println("Matrix:", matrix)
    fmt.Println("Phần tử [1][2]:", matrix[1][2]) // 6
}
```

\---

#### 3. Slice – "Dynamic Array" của Go

* **Vấn đề của Array:** kích thước cố định, ít linh hoạt.
* **Giải pháp:** Slice là một cấu trúc dữ liệu **linh hoạt**, cho phép tăng giảm số phần tử.
* Slice không lưu trực tiếp dữ liệu, mà lưu **slice header** gồm:

  * `pointer` → trỏ tới array nền tảng
  * `length` → số phần tử hiện có
  * `capacity` → dung lượng tối đa trước khi cần cấp phát lại

👉 **Ví dụ:**

```go
package main

import "fmt"

func main() {
    arr := [5]int{1, 2, 3, 4, 5}
    slice := arr[1:4] // lấy từ index 1 đến 3 (không bao gồm 4)

    fmt.Println("Slice:", slice)     // [2 3 4]
    fmt.Println("Length:", len(slice)) // 3
    fmt.Println("Capacity:", cap(slice)) // 4 (tính từ arr[1] đến hết arr)
}
```

\---

#### 4. Tạo Slice với `make()`

Hàm `make()` được dùng để tạo slice mà không cần array có sẵn.

👉 **Ví dụ:**

```go
s := make([]int, 3, 5) // length=3, capacity=5
fmt.Println(s)         // [0 0 0]
```

\---

#### 5. Thao tác với Slices

* **Append:** thêm phần tử, tự động mở rộng dung lượng khi cần.

```go
slice := []int{1, 2, 3}
slice = append(slice, 4, 5)
fmt.Println(slice) // [1 2 3 4 5]
```

* **Copy:** sao chép phần tử giữa slices.

```go
src := []int{1, 2, 3}
dst := make([]int, len(src))
copy(dst, src)
fmt.Println(dst) // [1 2 3]
```

\---

#### 6. Chuyển đổi giữa Array và Slice

* Array → Slice:

```go
arr := [3]int{1, 2, 3}
slice := arr[:] // slice bao trọn array
```

* Slice → Array (Go 1.17+):

```go
slice := []int{1, 2, 3}
arr := [3]int(slice) // cần đúng độ dài
```

\---

#### 7. Memory Management & Pitfalls

* Slice vẫn **giữ tham chiếu tới array gốc**. Nếu chỉ lấy một phần slice nhỏ nhưng array gốc lớn → có thể gây giữ bộ nhớ không cần thiết.
* Nên sao chép slice khi chỉ cần dữ liệu nhỏ.

👉 **Ví dụ minh họa vấn đề:**

```go
large := make([]int, 1000000)
small := large[:10] // small vẫn giữ reference tới large
fmt.Println(len(small), cap(small)) // 10, 1000000
```

➡️ Giải pháp: dùng `copy()` để tạo slice mới nhỏ gọn.

\---

### 🏆 Bài tập thực hành

**Đề bài:**
Viết chương trình quản lý danh sách điểm số của một lớp học.

* Khai báo một slice rỗng để lưu điểm số (int).
* Thêm điểm số của 5 học sinh vào slice.
* Tính **điểm trung bình** của cả lớp.
* In ra danh sách điểm và điểm trung bình.

\---

**Lời giải chi tiết:**

```go
package main

import "fmt"

func main() {
    // Bước 1: Khai báo slice rỗng
    var scores []int

    // Bước 2: Thêm điểm 5 học sinh
    scores = append(scores, 85, 90, 78, 92, 88)

    // Bước 3: Tính tổng điểm
    sum := 0
    for _, score := range scores {
        sum += score
    }

    // Bước 4: Tính trung bình
    average := float64(sum) / float64(len(scores))

    // Bước 5: In kết quả
    fmt.Println("Danh sách điểm:", scores)
    fmt.Printf("Điểm trung bình: %.2f\n", average)
}
```

**Phân tích tư duy:**

* Dùng `append` để thêm dữ liệu động → linh hoạt hơn array.
* Dùng vòng lặp `for range` để duyệt qua slice → cú pháp ngắn gọn.
* Cần ép kiểu `float64` khi chia để ra kết quả chính xác.

\---

### 🔑 Những điểm quan trọng cần lưu ý

* **Array là value type**, còn **Slice là reference type**.
* Khi cắt slice, nó vẫn **chia sẻ dữ liệu** với array gốc.
* `len(slice)` = số phần tử, `cap(slice)` = dung lượng từ vị trí bắt đầu đến hết array gốc.
* `append()` có thể tạo ra slice mới nếu capacity không đủ.
* Cẩn thận khi giữ slice nhỏ từ array lớn → gây lãng phí bộ nhớ.

\---

### 📝 Bài tập về nhà

1. **Quản lý danh sách tên học sinh**

   * Tạo một slice chứa tên của ít nhất 5 học sinh.
   * Thêm một học sinh mới vào slice.
   * In ra danh sách học sinh sau khi thêm.

2. **Lọc điểm số cao**

   * Cho slice điểm số `[60, 75, 82, 90, 45, 100]`.
   * Hãy tạo slice mới chỉ chứa các điểm **>= 80**.
   * In ra danh sách điểm đã lọc.



---

*Post ID: 85ff7ph550vhgqe*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
