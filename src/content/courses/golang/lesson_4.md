# Bài 4: Cấu trúc điều khiển - Rẽ nhánh

## 🎯 Mục tiêu bài học

- Hiểu và sử dụng thành thạo câu lệnh điều kiện `if-else` trong Golang
- Nắm vững cú pháp và cách sử dụng câu lệnh `switch-case`
- Áp dụng biểu thức điều kiện ngắn gọn (short statement) trong các cấu trúc rẽ nhánh

## 📝 Nội dung chi tiết

### 1. Giới thiệu về cấu trúc điều khiển rẽ nhánh

Cấu trúc điều khiển rẽ nhánh cho phép chương trình đưa ra quyết định và thực thi các đoạn mã khác nhau dựa trên điều kiện cụ thể.
- Câu lệnh `if-else`
- Câu lệnh `switch-case`

### 2. Câu lệnh if-else

#### 2.1. Cú pháp cơ bản

```go
if điều_kiện {

} else {

}
```

#### 2.2. Mẫu if-else đầy đủ

```go
if điều_kiện_1 {
    // Mã được thực thi nếu điều_kiện_1 đúng
} else if điều_kiện_2 {
    // Mã được thực thi nếu điều_kiện_1 sai và điều_kiện_2 đúng
} else if điều_kiện_3 {
    // Mã được thực thi nếu điều_kiện_1 và điều_kiện_2 sai, điều_kiện_3 đúng
} else {
    // Mã được thực thi nếu tất cả các điều kiện trên đều sai
}
```


#### 2.3. Biểu thức điều kiện ngắn gọn (Short statement)

Golang cho phép thực hiện một phép gán ngay trước điều kiện kiểm tra.

```go
if biến := biểu_thức; điều_kiện {
    // Sử dụng biến trong khối này
}
// biến không tồn tại ở đây
```


### 3. Câu lệnh switch-case

#### 3.1. Cú pháp cơ bản

```go
switch biểu_thức {
case giá_trị_1:
    // Mã được thực thi nếu biểu_thức == giá_trị_1
case giá_trị_2:
    // Mã được thực thi nếu biểu_thức == giá_trị_2
...
default:
    // Mã được thực thi nếu không có case nào khớp
}
```

#### 3.2. Những đặc điểm khác biệt của switch trong Golang

1. **Không cần từ khóa `break`**: Mỗi case tự động break sau khi thực thi, khác với C/C++/Java.
2. **Multiple cases**: Có thể liệt kê nhiều giá trị trong một case.
3. **Các case không bắt buộc phải là hằng số**


#### 3.4. Switch với short statement

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    switch today := time.Now().Weekday(); today {
    case time.Saturday, time.Sunday:
        fmt.Println("Cuối tuần vui vẻ!")
    default:
        fmt.Println("Hôm nay là", today, "- Cố gắng làm việc!")
    }
}
```

#### 3.5. Từ khóa fallthrough

Từ khóa `fallthrough` buộc thực thi đi tiếp xuống case kế tiếp, bất kể điều kiện của case đó:

```go
package main

import "fmt"

func main() {
    num := 5
    
    switch num {
    case 5:
        fmt.Println("Số 5")
        fallthrough
    case 6:
        fmt.Println("Số 6") 
        fallthrough
    case 7:
        fmt.Println("Số 7")
    case 8:
        fmt.Println("Số 8")
    }
}
```

### 4. So sánh if-else và switch-case: Khi nào sử dụng cái nào?

#### 4.1. Sử dụng if-else khi:
- Các điều kiện phức tạp, không chỉ dựa trên so sánh bằng
- Số lượng điều kiện ít (dưới 3-4 điều kiện)

#### 4.2. Sử dụng switch-case khi:
- So sánh một biến với nhiều giá trị khác nhau
- Có nhiều nhánh rẽ (trên 3-4 điều kiện)

## 🏆 Bài tập thực hành 

### Bài tập 1: Kiểm tra số chẵn/lẻ và dương/âm

**Đề bài:**  
Viết một chương trình Golang để nhận vào một số nguyên và xác định xem số đó là chẵn hay lẻ, dương hay âm. Sử dụng cấu trúc if-else để phân loại.


### Bài tập 2: Tính tiền điện theo bậc thang

**Đề bài:**  
Viết chương trình tính tiền điện theo giá bậc thang như sau:
- 50 kWh đầu tiên: 1,678 đồng/kWh
- Từ kWh 51 - 100: 1,734 đồng/kWh
- Từ kWh 101 - 200: 2,014 đồng/kWh
- Từ kWh 201 - 300: 2,536 đồng/kWh
- Từ kWh 301 - 400: 2,834 đồng/kWh
- Từ kWh 401 trở lên: 2,927 đồng/kWh


### Bài tập 3: Xây dựng chương trình chuyển đổi ngày trong tuần

**Đề bài:**  
Viết chương trình nhận vào một số nguyên từ 1 đến 7 đại diện cho ngày trong tuần và in ra tên ngày bằng tiếng Việt và tiếng Anh. Sử dụng cấu trúc switch-case để thực hiện chuyển đổi. Nếu người dùng nhập số khác từ 1-7, hiển thị thông báo lỗi.


## 🔑 Những điểm quan trọng cần lưu ý

1. **Dấu ngoặc nhọn bắt buộc**
   - Trong Golang, dấu ngoặc nhọn `{}` là bắt buộc cho các khối mã, ngay cả khi chỉ có một câu lệnh.

2. **Dấu ngoặc đơn không bắt buộc**
   - Điều kiện trong câu lệnh `if` không cần đặt trong dấu ngoặc đơn `()`.

3. **Short statement**
   - Biến được khai báo trong short statement chỉ có phạm vi trong khối lệnh đó.

4. **Switch trong Golang khác biệt**
   - Không cần từ khóa `break` cuối mỗi case (tự động break).
   - Sử dụng `fallthrough` để tiếp tục thực thi case tiếp theo.

5. **Performance**
   - `switch-case` thường nhanh hơn và hiệu quả hơn chuỗi `if-else if` dài khi so sánh một biến với nhiều giá trị khác nhau.

6. **Code style**
   - Sử dụng `switch` khi có nhiều nhánh rẽ dựa trên cùng một biến.
   - Sử dụng `if-else` cho các điều kiện logic phức tạp.

## 📝 Bài tập về nhà

### Bài tập 1: Xếp loại học lực
**Đề bài:**  
Viết chương trình nhận vào điểm số của 3 môn: Toán, Lý, Hóa. Tính điểm trung bình và xếp loại học lực theo quy tắc sau:
- Điểm trung bình >= 8.5: Loại Xuất sắc
- Điểm trung bình >= 7.0 và < 8.5: Loại Giỏi
- Điểm trung bình >= 5.5 và < 7.0: Loại Khá
- Điểm trung bình >= 4.0 và < 5.5: Loại Trung bình
- Điểm trung bình < 4.0: Loại Yếu

Yêu cầu thêm:
- Nếu có bất kỳ môn nào dưới 3.0 điểm, sẽ tự động xếp loại Yếu bất kể điểm trung bình.
- Sử dụng cấu trúc if-else để thực hiện.

### Bài tập 2: Máy tính đơn giản
**Đề bài:**  
Viết chương trình mô phỏng máy tính đơn giản thực hiện các phép tính cơ bản:
- Phép cộng (+)
- Phép trừ (-)
- Phép nhân (*)
- Phép chia (/)
- Phép lấy dư (%)
- Phép lũy thừa (^)

Chương trình nhận vào hai số và một phép toán, sau đó in ra kết quả. Sử dụng switch-case để xử lý các phép toán khác nhau. Đảm bảo xử lý các trường hợp đặc biệt như chia cho 0.

### Bài tập 3: Kiểm tra năm nhuận
**Đề bài:**  
Viết chương trình kiểm tra một năm có phải là năm nhuận hay không. Một năm nhuận thỏa mãn một trong hai điều kiện sau:
1. Chia hết cho 4 nhưng không chia hết cho 100
2. Chia hết cho 400

Sử dụng biểu thức điều kiện ngắn gọn (short statement) trong if để giải quyết bài toán này và in ra kết quả.

### Bài tập 4: Chuyển đổi số thành chữ
**Đề bài:**  
Viết chương trình nhận vào một số nguyên từ 0 đến 9 và chuyển đổi thành chữ tương ứng (không, một, hai, ba, ..., chín). Thực hiện bài tập này bằng hai cách:
1. Sử dụng if-else
2. Sử dụng switch-case

So sánh hai cách tiếp cận và rút ra kết luận về độ phức tạp, tính dễ đọc và hiệu suất.

Nếu số đầu vào nằm ngoài phạm vi từ 0 đến 9, hiển thị thông báo lỗi phù hợp.
