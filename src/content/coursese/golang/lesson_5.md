# Bài 5: Cấu Trúc Điều Khiển - Vòng Lặp Trong Golang




## 🎯 Mục Tiêu Bài Học
- Hiểu và nắm vững các loại vòng lặp trong Golang
- Thành thạo cú pháp và cách sử dụng các vòng lặp `for`
- Khám phá các kỹ thuật điều khiển vòng lặp nâng cao

## 📝 Nội Dung Chi Tiết

### 1. Vòng Lặp Cơ Bản `for`

#### 1.1 Cú Pháp Cổ Điển
Golang sử dụng từ khóa `for` để thực hiện các vòng lặp, với cú pháp linh hoạt và mạnh mẽ. Cú pháp đầy đủ bao gồm ba phần:

```go
for initialization; condition; post {
}
```


#### 1.2 Vòng Lặp Kiểu While

Golang không có từ khóa `while` riêng biệt. Thay vào đó, bạn sử dụng `for` để thực hiện các vòng lặp có điều kiện:

```go
count := 0
for count < 5 {
    fmt.Println("Đếm:", count)
    count++
}
```

#### 1.3 Vòng Lặp Vô Hạn

Vòng lặp vô hạn rất hữu ích trong một số trường hợp đặc biệt như máy chủ, game, hoặc các ứng dụng liên tục xử lý:

```go
for {
    if điềuKiện {
        break
    }
}

```

### 2. Từ Khóa Điều Khiển Vòng Lặp

#### 2.1 Từ Khóa `break`
Từ khóa `break` cho phép thoát hoàn toàn khỏi vòng lặp ngay lập tức:

```go
for i := 0; i < 10; i++ {
    if i == 5 {
        fmt.Println("Gặp số 5, dừng vòng lặp")
        break  
    }
    fmt.Println(i)
}
```

#### 2.2 Từ Khóa `continue`
Từ khóa `continue` bỏ qua phần còn lại của lần lặp hiện tại và chuyển sang lần lặp tiếp theo:

```go
for i := 0; i < 10; i++ {
    if i % 2 == 0 {
        continue  
    }
    fmt.Println(i) 
}
```

**Ứng Dụng:**
- Bỏ qua các phần tử không mong muốn
- Tối ưu hóa logic xử lý trong vòng lặp

### 3. Vòng Lặp Trên Các Cấu Trúc Dữ Liệu


#### 3.1 Vòng Lặp `range` Với Slice
Từ khóa `range` cung cấp cách duyệt dễ dàng qua các phần tử của slice:

```go
numbers := []int{1, 2, 3, 4, 5}
for index, value := range numbers {
    fmt.Printf("Chỉ số %d: Giá trị %d\n", index, value)
}

for _, value := range numbers {
    fmt.Println("Giá trị:", value)
}
```


#### 3.2 Vòng Lặp `range` Với Map
Duyệt qua các cặp key-value trong map:

```go
student := map[string]int{
    "Minh": 90,
    "Hoa": 85,
    "Lan": 92,
}

for key, value := range student {
    fmt.Printf("Tên: %s, Điểm: %d\n", key, value)
}

for key := range student {
    fmt.Println("Tên học sinh:", key)
}
```

**Đặc Điểm:**
- Thứ tự duyệt không được đảm bảo

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Tính Tổng Các Số Nguyên
**Đề Bài:** 
Viết chương trình tính tổng các số nguyên từ 1 đến n (n do người dùng nhập).


### Bài Tập 2: In Bảng Cửu Chương
**Đề Bài:** 
Tạo chương trình in ra bảng cửu chương từ 1 đến 10.


### Bài Tập 3: Kiểm Tra Số Nguyên Tố
**Đề Bài:** 
Viết hàm kiểm tra một số có phải số nguyên tố không.

## 🔑 Những Điểm Quan Trọng Cần Lưu Ý
- Golang không có vòng lặp `while` truyền thống
- Từ khóa `break` và `continue` giúp kiểm soát luồng vòng lặp
- Sử dụng `range` để duyệt qua slice, map, channel


## 📝 Bài Tập Về Nhà

### Bài Tập 1: Đếm Số Ký Tự
Viết chương trình đếm số lượng ký tự trong một chuỗi mà không sử dụng hàm `len()`.

### Bài Tập 2: Tìm Số Lớn Nhất
Tạo chương trình tìm số lớn nhất trong một mảng số nguyên sử dụng vòng lặp.

### Bài Tập 3: Chuyển Đổi Số Nhị Phân
Viết hàm chuyển đổi một số nguyên dương sang dạng nhị phân.

### Bài Tập 4: Vẽ Tam Giác Sao
Tạo chương trình in ra hình tam giác sao với chiều cao do người dùng nhập.

