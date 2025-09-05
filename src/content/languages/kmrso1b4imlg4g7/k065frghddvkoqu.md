---
title: "Bài 6: Maps - Cấu trúc dữ liệu Key-Value"
postId: "k065frghddvkoqu"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 6: Maps - Cấu trúc dữ liệu Key-Value




## 🎯 **Mục tiêu bài học**

Sau khi hoàn thành bài học này, học viên sẽ:

* Hiểu được khái niệm **map** trong Go và lý do nó được sử dụng.
* Biết cách **khai báo, khởi tạo, thêm, sửa, xóa** phần tử trong map.
* Áp dụng được **comma-ok idiom** để kiểm tra sự tồn tại của key.
* Biết cách **duyệt qua map** bằng `range`.
* Hiểu rõ map là **reference type**, từ đó tránh những lỗi thường gặp.
* Biết sử dụng **nested maps** và **struct làm value trong map**.
* Nhận diện được các vấn đề về **thread safety** và cách xử lý với `sync.Map`.
* Tối ưu hiệu suất khi làm việc với map trong các tình huống thực tế.

\---

## 📝 **Nội dung chi tiết**

### 1. Map là gì?

Trong Go, **map** là cấu trúc dữ liệu lưu trữ dữ liệu dưới dạng **key-value**.

* Mỗi key phải là **duy nhất**.
* Value có thể trùng nhau, nhưng key thì không.
* Map trong Go được cài đặt bằng **hash table** nên thao tác tìm kiếm/ thêm/ xóa thường có **độ phức tạp O(1)**.

👉 Có thể hình dung map giống như một **từ điển**, nơi bạn tra cứu giá trị (value) dựa vào một từ khóa (key).

\---

### 2. Khai báo và khởi tạo Map

Có nhiều cách để tạo map trong Go:

```go
// Cách 1: Dùng make()
m := make(map[string]int)

// Cách 2: Khởi tạo trực tiếp
m2 := map[string]string{
    "VN": "Vietnam",
    "KR": "Korea",
    "JP": "Japan",
}
```

🔑 **Lưu ý:**

* Key có thể là bất kỳ kiểu dữ liệu nào có thể so sánh được (`int`, `string`, `bool`, struct có thể so sánh, …).
* Value có thể là bất kỳ kiểu dữ liệu nào.

\---

### 3. Thêm và cập nhật phần tử

```go
m := make(map[string]int)
m["apple"] = 5      // Thêm key "apple" với value 5
m["apple"] = 10     // Cập nhật lại value thành 10
```

\---

### 4. Xóa phần tử

Sử dụng hàm `delete()`:

```go
delete(m, "apple")
```

Nếu key không tồn tại, `delete()` sẽ **không gây lỗi**.

\---

### 5. Kiểm tra sự tồn tại (Comma-ok idiom)

Trong Go, khi truy cập một key, ta thường dùng cú pháp **comma-ok idiom**:

```go
value, exists := m["banana"]
if exists {
    fmt.Println("Giá trị:", value)
} else {
    fmt.Println("Không tìm thấy key")
}
```

👉 Đây là cách an toàn để kiểm tra key có tồn tại trong map hay không.

\---

### 6. Duyệt qua Map với `range`

```go
for key, value := range m2 {
    fmt.Println(key, ":", value)
}
```

Thứ tự duyệt **không được đảm bảo**, vì map được cài đặt dưới dạng hash table.

\---

### 7. Map là Reference Type

Map là **reference type**, nghĩa là khi gán map cho biến khác, cả hai biến sẽ cùng tham chiếu đến một vùng nhớ:

```go
m1 := map[string]int{"a": 1}
m2 := m1
m2["a"] = 100

fmt.Println(m1["a"]) // 100
```

👉 Cần chú ý khi copy map, vì thay đổi một biến sẽ ảnh hưởng đến biến kia.

\---

### 8. Nested Maps

Bạn có thể lồng nhiều map bên trong nhau:

```go
users := map[string]map[string]string{
    "u1": {"name": "Alice", "email": "alice@example.com"},
    "u2": {"name": "Bob", "email": "bob@example.com"},
}
fmt.Println(users["u1"]["name"]) // Alice
```

\---

### 9. Map với Struct Values

Kết hợp map với struct giúp quản lý dữ liệu có cấu trúc tốt hơn:

```go
type User struct {
    Name  string
    Email string
}

users := map[string]User{
    "u1": {"Alice", "alice@example.com"},
    "u2": {"Bob", "bob@example.com"},
}
fmt.Println(users["u1"].Name) // Alice
```

\---

### 10. Thread Safety và `sync.Map`

Map mặc định **không an toàn trong môi trường concurrent**. Nếu nhiều goroutines truy cập map cùng lúc để ghi dữ liệu, sẽ gây **runtime panic**.

👉 Giải pháp: sử dụng `sync.Map` khi cần map an toàn trong concurrent.

```go
var sm sync.Map
sm.Store("a", 1)
value, ok := sm.Load("a")
fmt.Println(value, ok)
```

\---

### 11. Performance Considerations

* Map trong Go được tối ưu tốt, nhưng khi số lượng phần tử quá lớn, cần cân nhắc pre-allocate với `make(map[type]type, size)` để tránh reallocations.
* Nếu cần thứ tự (ordered map), Go **không hỗ trợ sẵn** → phải dùng `slice` kết hợp với `map`.

\---

## 🏆 **Bài tập thực hành**

### Đề bài

Viết một chương trình quản lý điểm số sinh viên bằng map.

* Key: tên sinh viên (string).
* Value: điểm trung bình (float64).
  Yêu cầu:

1. Thêm dữ liệu cho ít nhất 3 sinh viên.
2. In ra danh sách sinh viên và điểm.
3. Kiểm tra một sinh viên có tồn tại trong map hay không.
4. Xóa một sinh viên khỏi danh sách.

\---

### Lời giải chi tiết

```go
package main

import "fmt"

func main() {
    // 1. Khởi tạo map
    scores := make(map[string]float64)

    // 2. Thêm dữ liệu
    scores["Alice"] = 8.5
    scores["Bob"] = 7.2
    scores["Charlie"] = 9.0

    // 3. In ra toàn bộ danh sách
    fmt.Println("Danh sách điểm số:")
    for name, score := range scores {
        fmt.Printf("%s: %.2f\n", name, score)
    }

    // 4. Kiểm tra sự tồn tại của sinh viên
    student := "Bob"
    if val, ok := scores[student]; ok {
        fmt.Printf("\n%s tồn tại với điểm: %.2f\n", student, val)
    } else {
        fmt.Printf("\n%s không có trong danh sách\n", student)
    }

    // 5. Xóa một sinh viên
    delete(scores, "Alice")
    fmt.Println("\nSau khi xóa Alice:")
    for name, score := range scores {
        fmt.Printf("%s: %.2f\n", name, score)
    }
}
```

🔎 **Phân tích tư duy:**

1. Dùng `make()` để tạo map rỗng.
2. Gán key-value để thêm sinh viên.
3. Dùng `range` để duyệt và in danh sách.
4. Dùng **comma-ok idiom** để kiểm tra sự tồn tại.
5. Dùng `delete()` để xóa phần tử.

\---

## 🔑 **Những điểm quan trọng cần lưu ý**

* Map là **reference type** → gán cho biến khác sẽ cùng tham chiếu vùng nhớ.
* Key phải là kiểu dữ liệu có thể **so sánh được**.
* Không được truy cập map trong nhiều goroutine cùng lúc nếu không dùng `sync.Map`.
* Thứ tự duyệt map bằng `range` là **không xác định**.

\---

## 📝 **Bài tập về nhà**

1. **Quản lý số điện thoại:**
   Tạo map quản lý danh bạ điện thoại:

   * Key: tên người (string).
   * Value: số điện thoại (string).
     Viết chương trình cho phép thêm, sửa, xóa, và tìm kiếm số điện thoại.

2. **Đếm số lần xuất hiện của từ trong câu:**
   Viết chương trình đọc một chuỗi, sau đó sử dụng map để đếm số lần mỗi từ xuất hiện trong chuỗi.




---

*Post ID: k065frghddvkoqu*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
