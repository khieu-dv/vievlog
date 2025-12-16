# Bài 3: Toán tử và biểu thức

## 🎯 Mục tiêu bài học
- Hiểu và sử dụng thành thạo các loại toán tử trong Golang
- Nắm vững thứ tự ưu tiên của các toán tử khi xuất hiện trong biểu thức
- Áp dụng các toán tử để giải quyết các bài toán thực tế
- Xây dựng ứng dụng tính toán sử dụng các loại toán tử khác nhau

## 📝 Nội dung chi tiết

### 1. Toán tử số học
Golang cung cấp các toán tử số học quen thuộc để thực hiện các phép tính cơ bản:

| Toán tử | Mô tả | Ví dụ |
|---------|-------|-------|
| `+` | Cộng | `3 + 2 = 5` |
| `-` | Trừ | `3 - 2 = 1` |
| `*` | Nhân | `3 * 2 = 6` |
| `/` | Chia | `3 / 2 = 1` (với số nguyên) |
| `%` | Chia lấy dư | `3 % 2 = 1` |


```go
a := 5 / 2      
b := 5.0 / 2   
c := 5 / 2.0    
d := float64(5) / 2   
```

Golang cũng hỗ trợ các toán tử tăng/giảm và các toán tử gán kết hợp:

| Toán tử | Mô tả | Ví dụ |
|---------|-------|-------|
| `++` | Tăng giá trị lên 1 | `a++` tương đương với `a = a + 1` |
| `--` | Giảm giá trị đi 1 | `a--` tương đương với `a = a - 1` |


```go
a := 5
a++       
```

### 2. Toán tử so sánh
Toán tử so sánh trả về kết quả kiểu `bool` (true/false):

| Toán tử | Mô tả | Ví dụ |
|---------|-------|-------|
| `==` | Bằng nhau | `3 == 2`  |
| `!=` | Khác nhau | `3 != 2` |
| `<` | Nhỏ hơn | `3 < 2` |
| `>` | Lớn hơn | `3 > 2` |
| `<=` | Nhỏ hơn hoặc bằng | `3 <= 3`  |
| `>=` | Lớn hơn hoặc bằng | `3 >= 2` |

Các toán tử so sánh thường được sử dụng trong câu lệnh điều kiện và vòng lặp:



### 3. Toán tử logic

| Toán tử | Mô tả | Ví dụ |
|---------|-------|-------|
| `&&` | Phép AND - cả hai điều kiện đều đúng | `(3 > 2) && (5 > 1)`  |
| `\|\|` | Phép OR - ít nhất một điều kiện đúng | `(3 < 2) \|\| (5 > 1)`  |
| `!` | Phép NOT - đảo ngược điều kiện | `!(3 < 2)`|



### 4. Toán tử gán
Golang cung cấp các toán tử gán để thực hiện phép gán giá trị và các phép tính kết hợp:

| Toán tử | Mô tả | Ví dụ |
|---------|-------|-------|
| `=` | Gán giá trị | `a = 5` |
| `+=` | Cộng và gán | `a += 2` tương đương `a = a + 2` |
| `-=` | Trừ và gán | `a -= 2` tương đương `a = a - 2` |
| `*=` | Nhân và gán | `a *= 2` tương đương `a = a * 2` |
| `/=` | Chia và gán | `a /= 2` tương đương `a = a / 2` |
| `%=` | Chia lấy dư và gán | `a %= 2` tương đương `a = a % 2` |



### 5. Toán tử bit
Golang hỗ trợ các toán tử thao tác trên bit:

| Toán tử | Mô tả |
|---------|-------|
| `&` | AND bit |
| `\|` | OR bit | 
| `^` | XOR bit | 
| `<<` | Dịch trái |
| `>>` | Dịch phải | 
| `&^` | Bit clear (AND NOT) | 

Các toán tử bit rất hữu ích trong các ứng dụng yêu cầu hiệu suất cao hoặc khi làm việc với cờ và mặt nạ bit.


### 7. Thứ tự ưu tiên của toán tử
Toán tử trong Golang có thứ tự ưu tiên khác nhau, quyết định thứ tự thực hiện các phép tính trong biểu thức:

| Thứ tự ưu tiên | Toán tử |
|----------------|---------|
| 5 (cao nhất) | `*`, `/`, `%`, `<<`, `>>`, `&`, `&^` |
| 4 | `+`, `-`, `\|`, `^` |
| 3 | `==`, `!=`, `<`, `<=`, `>`, `>=` |
| 2 | `&&` |
| 1 (thấp nhất) | `\|\|` |



## 🏆 Bài tập thực hành 

### Bài tập 1: Tính diện tích và chu vi hình thang
**Đề bài:** Viết chương trình Go tính diện tích và chu vi của hình thang, biết hai đáy là a và b, hai cạnh bên là c và d, và chiều cao là h.


### Bài tập 2: Kiểm tra năm nhuận
**Đề bài:** Viết chương trình Go để kiểm tra một năm có phải là năm nhuận hay không. Một năm là năm nhuận nếu nó chia hết cho 4 nhưng không chia hết cho 100, hoặc nó chia hết cho 400.


### Bài tập 3: Máy tính đơn giản
**Đề bài:** Viết một chương trình Go thực hiện chức năng máy tính đơn giản. Chương trình nhận hai số thực và một toán tử (+, -, *, /) từ người dùng, thực hiện phép tính tương ứng và hiển thị kết quả. Đảm bảo xử lý trường hợp chia cho 0.


## 🔑 Những điểm quan trọng cần lưu ý

1. **Phép chia giữa các số nguyên**:
   - Phép chia giữa hai số nguyên trong Go luôn trả về kết quả là số nguyên (phần nguyên của phép chia).

2. **Toán tử `++` và `--`**:
   - Trong Go, các toán tử `++` và `--` chỉ có thể dùng như câu lệnh, không thể như biểu thức.

3. **Đánh giá ngắn mạch (short-circuit evaluation)**:
   - Với toán tử `&&`, nếu vế trái sai thì vế phải không được đánh giá.
   - Với toán tử `||`, nếu vế trái đúng thì vế phải không được đánh giá.

4. **Toán tử bit**:
   - Nên sử dụng chú thích và comment code rõ ràng khi sử dụng các toán tử bit vì chúng thường khó đọc.


5. **Thứ tự ưu tiên của toán tử**:
   - Sử dụng dấu ngoặc `()` để làm rõ ý định và tránh sự nhầm lẫn về thứ tự ưu tiên.

6. **Xử lý các trường hợp đặc biệt**:
   - Luôn kiểm tra điều kiện chia cho 0 trước khi thực hiện phép chia.

## 📝 Bài tập về nhà

### Bài tập 1: Tính chỉ số BMI
**Đề bài**: Viết chương trình Go để tính chỉ số BMI (Body Mass Index) dựa trên chiều cao (tính bằng mét) và cân nặng (tính bằng kg) do người dùng nhập vào. Công thức tính BMI là: BMI = cân nặng / (chiều cao^2). Sau đó, chương trình phân loại chỉ số BMI như sau:
- Dưới 18.5: Thiếu cân
- 18.5 đến 24.9: Bình thường
- 25 đến 29.9: Thừa cân
- 30 trở lên: Béo phì

### Bài tập 2: Chuyển đổi nhiệt độ
**Đề bài**: Viết chương trình Go cho phép người dùng chuyển đổi nhiệt độ giữa các đơn vị Celsius (°C), Fahrenheit (°F), và Kelvin (K). Chương trình hiển thị menu cho người dùng chọn loại chuyển đổi, sau đó nhập giá trị nhiệt độ và hiển thị kết quả chuyển đổi. Công thức chuyển đổi:
- Celsius sang Fahrenheit: °F = °C × 9/5 + 32
- Celsius sang Kelvin: K = °C + 273.15
- Fahrenheit sang Celsius: °C = (°F - 32) × 5/9
- Fahrenheit sang Kelvin: K = (°F - 32) × 5/9 + 273.15
- Kelvin sang Celsius: °C = K - 273.15
- Kelvin sang Fahrenheit: °F = (K - 273.15) × 9/5 + 32

### Bài tập 3: Tính tiền điện
**Đề bài**: Viết chương trình Go tính tiền điện theo bậc thang, với giá tiền điện được tính như sau:
- 50 kWh đầu tiên: 1,678 đồng/kWh
- Từ kWh 51 - 100: 1,734 đồng/kWh
- Từ kWh 101 - 200: 2,014 đồng/kWh
- Từ kWh 201 - 300: 2,536 đồng/kWh
- Từ kWh 301 - 400: 2,834 đồng/kWh
- Từ kWh 401 trở lên: 2,927 đồng/kWh

Chương trình nhận vào số kWh tiêu thụ trong tháng và tính ra số tiền điện phải trả.

### Bài tập 4: Kiểm tra tam giác và tính diện tích
**Đề bài**: Viết chương trình Go nhận vào độ dài ba cạnh của một tam giác. Chương trình cần:
1. Kiểm tra xem ba độ dài có tạo thành tam giác hợp lệ không (tổng hai cạnh bất kỳ phải lớn hơn cạnh còn lại)
2. Nếu tam giác hợp lệ, xác định loại tam giác (đều, cân, vuông, vuông cân, thường)
3. Tính diện tích tam giác sử dụng công thức Heron:
   S = √(p*(p-a)*(p-b)*(p-c)) với p = (a+b+c)/2