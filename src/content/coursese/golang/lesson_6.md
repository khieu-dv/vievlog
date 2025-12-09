# Bài 6: Arrays và Slices trong Golang

## 🎯 Mục tiêu bài học


- **Hiểu rõ khái niệm và cách sử dụng Arrays** trong Go
- **Nắm vững khái niệm Slices** và sự khác biệt với Arrays
- **Thao tác hiệu quả với Slices**: tạo, thêm, sao chép, và truy cập phần tử
- **Sử dụng các hàm built-in** như `len()`, `cap()`, `append()`, `copy()`

## 📝 Nội dung chi tiết

### 1. Arrays trong Go - Cấu trúc dữ liệu cố định

#### 1.1 Khái niệm Arrays

**Array** trong Go là một tập hợp các phần tử có cùng kiểu dữ liệu, được sắp xếp theo thứ tự và có kích thước cố định.

**Cú pháp khai báo:**
```go
var arrayName [size]dataType
```

#### 1.2 Các cách khai báo và khởi tạo Arrays

**Mô tả:** Go cung cấp nhiều cách linh hoạt để khai báo và khởi tạo arrays. Dưới đây là các phương pháp phổ biến từ cơ bản đến nâng cao:

```go
package main

import "fmt"

func main() {
    var numbers [5]int
    numbers[0] = 10
    numbers[1] = 20
    fmt.Println("Array numbers:", numbers) 
    
    fruits := [3]string{"apple", "banana", "orange"}
    fmt.Println("Array fruits:", fruits) 
}
```

#### 1.3 Đặc điểm quan trọng của Arrays

**Mô tả:** Hiểu rõ các đặc điểm này sẽ giúp bạn sử dụng arrays hiệu quả và tránh các lỗi phổ biến:

- **Kích thước cố định**: 
- **Zero values**: 
- **Truyền theo giá trị**:



### 2. Slices trong Go - Mảng động linh hoạt

#### 2.1 Khái niệm Slices

**Slice** là một cấu trúc dữ liệu động và linh hoạt, được xây dựng dựa trên arrays. 

**Cấu trúc của Slice:**
- **Pointer**: 
- **Length**: 
- **Capacity**: 

#### 2.2 Các cách tạo Slices

**Mô tả:** Slice có thể được tạo theo nhiều cách khác nhau. 


#### 2.3 Slicing Operations - Cắt slice

**Mô tả:** Slicing cho phép tạo slice mới từ slice hoặc array hiện có. 

```go
func main() {
    numbers := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
    
    // Cú pháp: slice[start:end] (không bao gồm end)
    fmt.Println("numbers[2:5]:", numbers[2:5])   
    fmt.Println("numbers[:4]:", numbers[:4])    
    fmt.Println("numbers[6:]:", numbers[6:])   
    fmt.Println("numbers[:]:", numbers[:])      
    
    // Slicing với capacity
    slice := numbers[2:5:8] // start:end:capacity
    fmt.Printf("Length: %d, Capacity: %d\n", len(slice), cap(slice))
    fmt.Println("Slice:", slice) // [2 3 4]
}
```

#### 2.4 Hàm append() - Thêm phần tử vào slice

```go
func main() {
    var fruits []string
    fmt.Println("Slice ban đầu:", fruits) // []
    
    fruits = append(fruits, "apple")
    fmt.Println("Sau khi thêm apple:", fruits) 
    
}
```

#### 2.5 Hàm copy() - Sao chép slice

**Mô tả:** `copy()` được sử dụng để sao chép dữ liệu từ slice này sang slice khác. Điều quan trọng là hiểu cách hoạt động để tránh các lỗi không mong muốn:


### 3. So sánh Arrays vs Slices

| Đặc điểm | Arrays | Slices |
|----------|--------|--------|
| Kích thước | Cố định, là phần của type | Động, có thể thay đổi |
| Khai báo | `[5]int` | `[]int` |
| Truyền vào function | Theo giá trị (copy) | Theo tham chiếu |
| Hiệu suất | Nhanh hơn | Linh hoạt hơn |
| Sử dụng | Khi biết chính xác kích thước | Hầu hết các trường hợp |

### 4. Một số patterns thường gặp với Slices

#### 4.1 Xóa phần tử khỏi slice

**Mô tả:** Go không có hàm built-in để xóa phần tử, nhưng chúng ta có thể sử dụng slicing và append để thực hiện:

```go
func removeElement(slice []int, index int) []int {
    return append(slice[:index], slice[index+1:]...)
}

func main() {
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Println("Trước khi xóa:", numbers) // [1 2 3 4 5]
    
    numbers = removeElement(numbers, 2) // Xóa phần tử tại index 2
    fmt.Println("Sau khi xóa:", numbers) // [1 2 4 5]
}
```

#### 4.2 Chèn phần tử vào slice

**Mô tả:** Tương tự như xóa, việc chèn phần tử vào vị trí bất kỳ trong slice cũng có thể thực hiện bằng cách kết hợp slicing và append:

```go
func insertElement(slice []int, index int, value int) []int {
    slice = append(slice[:index], append([]int{value}, slice[index:]...)...)
    return slice
}

func main() {
    numbers := []int{1, 2, 4, 5}
    fmt.Println("Trước khi chèn:", numbers) // [1 2 4 5]
    
    numbers = insertElement(numbers, 2, 3) // Chèn 3 tại index 2
    fmt.Println("Sau khi chèn:", numbers) // [1 2 3 4 5]
}
```

## 🏆 Bài tập thực hành 

### Bài tập 1: Tìm giá trị lớn nhất và nhỏ nhất trong slice

**Đề bài:** Viết chương trình tìm giá trị lớn nhất và nhỏ nhất trong một slice số nguyên.

### Bài tập 2: Lọc và tạo slice mới

**Đề bài:** Viết chương trình lọc các số chẵn từ một slice và tạo slice mới chứa các số chẵn đó.


### Bài tập 3: Quản lý danh sách sinh viên

**Đề bài:** Tạo một hệ thống quản lý danh sách sinh viên với các chức năng: them, xóa, tìm kiếm sinh viên.

## 🔑 Những điểm quan trọng cần lưu ý

### 1. **Khác biệt giữa Arrays và Slices**
- **Arrays**: Kích thước cố định, truyền theo giá trị
- **Slices**: Kích thước động, truyền theo tham chiếu

### 2. **Nil slice vs Empty slice**
```go
var nilSlice []int        // nil slice: nilSlice == nil
emptySlice := []int{}     // empty slice: emptySlice != nil
```
- **Nil slice**: Chưa được khởi tạo, length và capacity đều bằng 0
- **Empty slice**: Đã được khởi tạo nhưng không có phần tử nào

### 3. **Slice sharing underlying array**
```go
arr := [5]int{1, 2, 3, 4, 5}
slice1 := arr[1:4]  // [2, 3, 4]
slice2 := arr[2:5]  // [3, 4, 5]
slice1[1] = 999     // Thay đổi sẽ ảnh hưởng đến slice2
```
- Nhiều slice có thể chia sẻ cùng một underlying array
- Thay đổi một slice có thể ảnh hưởng đến slice khác

### 4. **Capacity và reallocation**
- Khi `append()` vượt quá capacity, Go sẽ tạo array mới với capacity gấp đôi
- Điều này có thể làm slice mất liên kết với array gốc


## 📝 Bài tập về nhà

### Bài tập 1: Tính tổng và trung bình
**Đề bài:** Viết chương trình nhập vào một slice các số thực, tính tổng và trung bình cộng của các số trong slice. In ra kết quả với 2 chữ số thập phân.

**Yêu cầu:**
- Xử lý trường hợp slice rỗng
- Sử dụng hàm riêng để tính toán
- Format kết quả đẹp mắt

### Bài tập 2: Đảo ngược slice
**Đề bài:** Viết chương trình đảo ngược một slice string mà không sử dụng slice mới. Ví dụ: `["a", "b", "c", "d"]` thành `["d", "c", "b", "a"]`.

**Yêu cầu:**
- Không tạo slice mới
- Sử dụng thuật toán in-place
- Test với slice có độ dài chẵn và lẻ

### Bài tập 3: Quản lý inventory sản phẩm
**Đề bài:** Tạo hệ thống quản lý kho hàng đơn giản với struct Product (ID, Name, Price, Quantity). Implement các chức năng:
- Thêm sản phẩm mới
- Cập nhật số lượng sản phẩm
- Tìm sản phẩm theo tên
- Hiển thị sản phẩm hết hàng (quantity = 0)
- Tính tổng giá trị kho hàng

**Yêu cầu:**
- Sử dụng slice để lưu trữ products
- Xử lý các trường hợp lỗi
- Có interface đơn giản để test

### Bài tập 4: Merge và sort slices
**Đề bài:** Viết chương trình nhận vào 2 slice số nguyên đã được sắp xếp tăng dần, merge chúng thành một slice mới cũng được sắp xếp tăng dần. Không sử dụng sort package.

**Yêu cầu:**
- Implement thuật toán merge như trong merge sort
- Xử lý trường hợp hai slice có độ dài khác nhau
- Test với các trường hợp edge cases (slice rỗng, một slice rỗng)
- Time complexity phải là O(n+m)

**Ví dụ:**
```
Input: slice1 = [1, 3, 5, 7], slice2 = [2, 4, 6, 8, 9]
Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```