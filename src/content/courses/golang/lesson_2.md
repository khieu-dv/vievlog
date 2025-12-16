# Bài 2: Biến và kiểu dữ liệu cơ bản trong Golang

## 🎯 Mục tiêu bài học
1. Hiểu và nắm vững cách khai báo và sử dụng biến trong Golang
2. Làm quen với các kiểu dữ liệu cơ bản của Golang: int, float, bool, string
3. Nắm được khái niệm zero values (giá trị mặc định) trong Golang
4. Hiểu và áp dụng được type conversion (chuyển đổi kiểu) và type inference (suy luận kiểu)
5. Thực hành viết code sử dụng các khái niệm đã học

## 📝 Nội dung chi tiết

### 1. Khai báo biến và hằng số

#### 1.1. Khai báo biến

Golang cung cấp nhiều cách để khai báo biến:

**Cách 1: Khai báo đầy đủ với từ khóa `var`**
```go
var tên_biến kiểu_dữ_liệu = giá_trị
```

Ví dụ:
```go
var name string = "Golang"
var age int = 25
var isActive bool = true
```

**Cách 2: Khai báo ngắn gọn với `:=` (short declaration)**
```go
tên_biến := giá_trị
```

Ví dụ:
```go
name := "Golang"
age := 25
isActive := true
```

**Cách 3: Khai báo không gán giá trị**
```go
var tên_biến kiểu_dữ_liệu
```

Ví dụ:
```go
var count int   
var name string 
```


#### 1.2. Khai báo hằng số

Hằng số trong Golang được khai báo với từ khóa `const`:

```go
const PI = 3.14159
const APP_NAME = "Golang Tutorial"
```

Khai báo nhiều hằng số:
```go
const (
    STATUS_OK    = 200
    STATUS_ERROR = 500
    MAX_SIZE     = 1024
)
```

**Sử dụng iota trong khai báo hằng số:**

`iota` là một bộ đếm được tự động tăng trong các khối khai báo `const`.

```go
const (
    MONDAY = iota   
    TUESDAY         
    WEDNESDAY       
    THURSDAY        
    FRIDAY          
)
```

### 2. Các kiểu dữ liệu cơ bản

#### 2.1. Kiểu số nguyên (Integer)

- **Kiểu có dấu (signed)**: `int`, `int8`, `int16`, `int32`, `int64`
  - `int`:
  - `int8`: 
  - `int16`:
  - `int32`:
  - `int64`:

- **Kiểu không dấu (unsigned)**: `uint`, `uint8`, `uint16`, `uint32`, `uint64`, `uintptr`
  - `uint`: 
  - `uint8`: 
  - `uint16`:
  - `uint32`:
  - `uint64`:

```go
var a int = 10
var b int8 = 127
var c uint16 = 65000
```

#### 2.2. Kiểu số thực (Float)

- `float32`: 
- `float64`: 

```go
var pi float64 = 3.14159265359
var e float32 = 2.71828
```

#### 2.3. Kiểu luận lý (Boolean)

- `bool`: true hoặc false

```go
var isValid bool = true
var isCompleted bool = false
```

#### 2.4. Kiểu chuỗi (String)

- `string`: Chuỗi ký tự UTF-8

```go
var greeting string = "Xin chào"
var name string = "Golang"
```

**Chuỗi nhiều dòng với backticks:**
```go
var poem string = `
    Đây là bài thơ
    viết trên nhiều dòng
    trong Golang
`
```


### 3. Zero values

Golang luôn tự động khởi tạo biến với giá trị mặc định (zero value) khi bạn khai báo biến mà không gán giá trị:

- Kiểu số (`int`, `float`...): `0`
- Kiểu luận lý (`bool`): `false`
- Kiểu chuỗi (`string`): `""` (chuỗi rỗng)
- Con trỏ, interface, slice, map, channel: `nil`

```go
var i int      
var f float64  
var b bool     
var s string   
```

### 4. Type conversion và type inference

#### 4.1. Type conversion (Chuyển đổi kiểu)

Golang không hỗ trợ chuyển đổi kiểu tự động (không có implicit conversion). Bạn phải chuyển đổi kiểu dữ liệu một cách tường minh:

```go
var i int = 42
var f float64 = float64(i) 

var f2 float64 = 3.14
var i2 int = int(f2)     

var r rune = 'A'
var s string = string(r)  
```

**Chuyển đổi giữa string và số:**

```go
import "strconv"

// Chuyển string thành int
s := "123"
i, err := strconv.Atoi(s)
// hoặc
i, err := strconv.ParseInt(s, 10, 64) 

// Chuyển int thành string
i := 123
s := strconv.Itoa(i)
// hoặc
s := strconv.FormatInt(int64(i), 10)  
```

#### 4.2. Type inference (Suy luận kiểu)

Golang có thể tự suy luận kiểu dữ liệu dựa vào giá trị được gán:

```go
name := "Golang"       
count := 10            
isActive := true       
pi := 3.14             
```

## 🏆 Bài tập thực hành

### Bài tập 1: Khai báo và in giá trị các loại biến

**Đề bài:**
Viết một chương trình Go khai báo và in ra giá trị thông tin cá nhân của bạn dựa vào các biến thuộc các kiểu dữ liệu cơ bản: int, float64, bool và string.

### Bài tập 2: Chuyển đổi kiểu dữ liệu

**Đề bài:**
Viết chương trình thực hiện các phép chuyển đổi kiểu dữ liệu sau:
1. Chuyển đổi từ số nguyên sang số thực và ngược lại
2. Chuyển đổi từ string sang số nguyên và ngược lại
3. Chuyển đổi giữa các kiểu số nguyên có kích thước khác nhau

### Bài tập 3: Tính toán và hiển thị thông tin sinh viên

**Đề bài:**
Viết chương trình quản lý thông tin sinh viên với các thông tin: họ tên, tuổi, điểm số các môn học (toán, lý, hóa) và tính điểm trung bình. Hiển thị tất cả thông tin ra màn hình theo định dạng phù hợp.


## 🔑 Những điểm quan trọng cần lưu ý

1. **Kiểu tĩnh và an toàn kiểu:** Golang là ngôn ngữ kiểu tĩnh (statically typed)

2. **Zero values:** Golang luôn khởi tạo biến với giá trị mặc định

3. **Không có ép kiểu ngầm định:** Golang yêu cầu ép kiểu tường minh

4. **`:=` vs `var`:** 
   - `:=` chỉ có thể sử dụng trong hàm
   - `var` có thể sử dụng ở mọi nơi

5. **Hằng số phải được xác định tại thời điểm biên dịch:** Không thể gán kết quả của một hàm cho một hằng số.


## 📝 Bài tập về nhà

### Bài 1: Tính chỉ số BMI

Viết chương trình tính chỉ số BMI (Body Mass Index) dựa trên chiều cao (m) và cân nặng (kg). Công thức: BMI = cân nặng / (chiều cao * chiều cao). Hiển thị kết quả và phân loại theo tiêu chuẩn:
- BMI < 18.5: Thiếu cân
- 18.5 <= BMI < 25.0: Bình thường
- 25.0 <= BMI < 30.0: Thừa cân
- BMI >= 30.0: Béo phì

### Bài 2: Chuyển đổi đơn vị nhiệt độ

Viết chương trình chuyển đổi giữa các đơn vị nhiệt độ: Celsius, Fahrenheit và Kelvin. Chương trình sẽ nhận vào một giá trị nhiệt độ và đơn vị nguồn, sau đó chuyển đổi sang các đơn vị khác. Công thức:
- F = C * 9/5 + 32
- K = C + 273.15
- C = (F - 32) * 5/9
- C = K - 273.15

### Bài 3: Quản lý sản phẩm

Viết chương trình quản lý thông tin một sản phẩm bao gồm: mã sản phẩm, tên sản phẩm, giá, số lượng, trạng thái còn hàng. Cho phép tính:
1. Tổng giá trị sản phẩm (giá * số lượng)
2. Thuế VAT (10% tổng giá trị)
3. Giá bán sau thuế
4. Hiển thị tất cả thông tin sản phẩm bao gồm các giá trị tính toán

### Bài 4: Thực hành iota

Sử dụng `iota` để tạo các hằng số biểu diễn:
1. Các mức độ log: DEBUG, INFO, WARNING, ERROR, FATAL
2. Các đơn vị đo dung lượng: KB, MB, GB, TB (với mỗi đơn vị là gấp 1024 lần đơn vị trước)
3. Các quyền truy cập tệp: READ, WRITE, EXECUTE (bit flags: 1, 2, 4)

Viết chương trình hiển thị các giá trị này và thực hiện một số tính toán với chúng.

### Bài 5: Xử lý chuỗi và ký tự

Viết chương trình thực hiện các thao tác sau:
1. Khai báo một chuỗi tiếng Việt có dấu
2. Đếm và hiển thị số ký tự (không phải byte) trong chuỗi
3. Chuyển chuỗi thành chữ hoa và chữ thường
4. Trích xuất 5 ký tự đầu tiên và 5 ký tự cuối cùng của chuỗi
5. Nối hai chuỗi lại với nhau

*Gợi ý: Sử dụng package "unicode/utf8" để đếm số ký tự Unicode*