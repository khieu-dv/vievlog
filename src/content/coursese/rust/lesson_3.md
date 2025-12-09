# Bài 3: Kiểu dữ liệu cơ bản và biến trong Rust

## 🎯 Mục tiêu bài học

- Hiểu và áp dụng được cơ chế khai báo biến trong Rust với từ khóa `let`
- Nắm vững khái niệm bất biến (immutability) - một trong những đặc trưng quan trọng của Rust
- Làm quen với các kiểu dữ liệu cơ bản trong Rust
- Hiểu sự khác biệt giữa type annotation và type inference
- Phân biệt được constants, static variables và biến thông thường
- Hiểu và áp dụng được khái niệm shadowing trong Rust
- Nhận diện và khắc phục các lỗi phổ biến liên quan đến quản lý biến

## 📝 Nội dung chi tiết

### 1. Khai báo biến với `let` và tính bất biến (immutability)

#### 1.1. Khai báo biến cơ bản

Trong Rust, chúng ta khai báo biến bằng từ khóa `let`:

```rust
let x = 5;
```

Điểm đặc biệt của Rust so với nhiều ngôn ngữ khác: **Tất cả các biến đều bất biến (immutable) theo mặc định**. Điều này có nghĩa là sau khi gán giá trị cho biến, bạn không thể thay đổi giá trị của nó.

```rust
let x = 5;
x = 6; // Lỗi: không thể gán giá trị hai lần cho biến bất biến
```

#### 1.2. Biến có thể thay đổi (mutable)

Nếu muốn tạo biến có thể thay đổi giá trị, bạn cần sử dụng từ khóa `mut`:

```rust
let mut y = 5;
y = 6; // Hợp lệ
println!("Giá trị của y là: {}", y);
```

#### 1.3. Tại sao Rust chọn mặc định là bất biến?

- **An toàn về bộ nhớ**: Rust được thiết kế để đảm bảo an toàn bộ nhớ
- **Ngăn chặn lỗi**: Biến bất biến giúp ngăn ngừa những thay đổi không mong muốn
- **Tối ưu hóa**: Trình biên dịch có thể tối ưu hóa mã tốt hơn với biến bất biến
- **Lập trình đồng thời**: Dễ dàng hơn khi xử lý đa luồng

### 2. Kiểu dữ liệu nguyên thủy trong Rust

#### 2.1. Kiểu số nguyên (Integer)

Rust cung cấp nhiều kiểu số nguyên với kích thước khác nhau:

| Kiểu    | Kích thước | Phạm vi                                     |
|---------|------------|---------------------------------------------|
| i8      | 8-bit      | -128 đến 127                                |
| u8      | 8-bit      | 0 đến 255                                   |
| i16     | 16-bit     | -32,768 đến 32,767                          |
| u16     | 16-bit     | 0 đến 65,535                                |
| i32     | 32-bit     | -2,147,483,648 đến 2,147,483,647            |
| u32     | 32-bit     | 0 đến 4,294,967,295                         |
| i64     | 64-bit     | -9,223,372,036,854,775,808 đến 9,223,372,036,854,775,807 |
| u64     | 64-bit     | 0 đến 18,446,744,073,709,551,615            |
| i128    | 128-bit    | -2^127 đến 2^127 - 1                        |
| u128    | 128-bit    | 0 đến 2^128 - 1                             |
| isize   | Tùy vào kiến trúc | Phụ thuộc vào kiến trúc máy tính (32 bit hoặc 64 bit) |
| usize   | Tùy vào kiến trúc | Phụ thuộc vào kiến trúc máy tính (32 bit hoặc 64 bit) |

Có thể biểu diễn số nguyên bằng nhiều cách:

```rust
let decimal = 98_222; // Thập phân với dấu _ giúp đọc dễ hơn
let hex = 0xff; // Hệ thập lục phân
let octal = 0o77; // Hệ bát phân
let binary = 0b1111_0000; // Hệ nhị phân
let byte = b'A'; // Chỉ cho u8, giá trị ASCII của 'A'
```

#### 2.2. Kiểu số thực (Float)

Rust có hai kiểu số thực:

- `f32`: Số thực 32-bit, độ chính xác đơn
- `f64`: Số thực 64-bit, độ chính xác kép (mặc định)

```rust
let x = 2.0; // f64 mặc định
let y: f32 = 3.0; // f32 với type annotation
```

#### 2.3. Kiểu boolean

```rust
let t = true;
let f: bool = false; // với type annotation rõ ràng
```

#### 2.4. Kiểu ký tự (Character)

Kiểu `char` trong Rust là 4 bytes và biểu diễn được một giá trị Unicode scalar, không chỉ là ASCII:

```rust
let c = 'z';
let z: char = 'ℤ'; // với type annotation rõ ràng
let heart_eyed_cat = '😻'; // Unicode hợp lệ!
```

### 3. Type annotation và type inference

#### 3.1. Type annotation

Type annotation là khi chúng ta chỉ định rõ kiểu dữ liệu cho biến:

```rust
let x: i32 = 5;
let y: f64 = 3.14;
let active: bool = true;
```

#### 3.2. Type inference

Rust có khả năng tự suy luận kiểu dữ liệu từ giá trị khởi tạo:

```rust
let x = 5; // Rust tự hiểu x là i32
let y = 3.14; // Rust tự hiểu y là f64
```

#### 3.3. Khi nào cần type annotation?

- Khi khai báo biến mà không khởi tạo giá trị ngay lập tức
- Khi bạn muốn dùng kiểu khác với kiểu mặc định
- Khi cần đảm bảo tính chính xác của chương trình
- Khi viết code dễ đọc hơn cho người khác

```rust
let guess: u32 = "42".parse().expect("Không phải là số!");
// Không có type annotation, trình biên dịch không biết kiểu gì 
// vì .parse() có thể trả về nhiều kiểu khác nhau
```

### 4. Constants và static variables

#### 4.1. Constants

Constants trong Rust là những giá trị không thể thay đổi và phải được gán giá trị tại thời điểm biên dịch:

```rust
const MAX_POINTS: u32 = 100_000;
```

Đặc điểm của constants:
- Luôn bất biến, không thể dùng `mut`
- Phải chỉ định kiểu dữ liệu
- Có thể khai báo ở mọi phạm vi, bao gồm phạm vi toàn cục
- Giá trị phải là biểu thức có thể tính toán tại thời điểm biên dịch
- Thường đặt tên bằng chữ HOA và dấu gạch dưới

#### 4.2. Static variables

Static variables tương tự như constants nhưng có địa chỉ bộ nhớ cố định:

```rust
static HELLO_WORLD: &str = "Xin chào, thế giới!";
```

Đặc điểm của static variables:
- Có địa chỉ bộ nhớ cố định
- Có thể khai báo là `mut` (nhưng không an toàn)
- Tồn tại suốt vòng đời chương trình
- Cần cẩn thận khi sử dụng, đặc biệt là `static mut`

```rust
static mut COUNTER: u32 = 0;

fn add_to_counter(inc: u32) {
    // Truy cập và sửa đổi static mut COUNTER là không an toàn
    unsafe {
        COUNTER += inc;
    }
}
```

#### 4.3. So sánh Constants và Static variables

| Đặc điểm             | Constants            | Static Variables     |
|----------------------|----------------------|----------------------|
| Bất biến             | Luôn bất biến        | Có thể mutable (unsafe) |
| Địa chỉ bộ nhớ       | Không cố định        | Cố định              |
| Inline               | Thường được inline   | Không được inline    |
| Phạm vi              | Mọi phạm vi          | Mọi phạm vi          |
| Biểu thức            | Compile-time         | Compile-time         |

### 5. Shadowing trong Rust

Shadowing là khả năng khai báo một biến mới với cùng tên với biến đã tồn tại, biến mới sẽ "che khuất" biến cũ:

```rust
let x = 5;
let x = x + 1; // x bây giờ là 6, biến cũ bị che khuất
let x = x * 2; // x bây giờ là 12, biến trước đó bị che khuất
```

#### 5.1. Ưu điểm của shadowing

- Tránh đặt tên biến khác nhau cho cùng một khái niệm
- Có thể thay đổi kiểu dữ liệu trong khi giữ nguyên tên biến

```rust
let spaces = "   "; // kiểu &str
let spaces = spaces.len(); // kiểu usize, số lượng khoảng trắng
```

#### 5.2. Sự khác biệt giữa shadowing và `mut`

- `mut` cho phép thay đổi giá trị nhưng không thay đổi kiểu dữ liệu
- Shadowing cho phép thay đổi cả giá trị và kiểu dữ liệu

```rust
let mut spaces = "   ";
spaces = spaces.len(); // Lỗi! Không thể thay đổi kiểu từ &str sang usize
```

#### 5.3. Phạm vi của shadowing

Shadowing chỉ có hiệu lực trong phạm vi khai báo:

```rust
let x = 5;
{
    let x = 12; // Chỉ có hiệu lực trong block này
    println!("Giá trị của x trong block nội: {}", x); // x = 12
}
println!("Giá trị của x: {}", x); // x = 5, biến bên ngoài không bị ảnh hưởng
```

## 🏆 Bài tập thực hành kèm lời giải chi tiết

### Bài tập 1: Thử nghiệm với biến bất biến và mutable

**Yêu cầu**: Hãy viết chương trình minh họa sự khác biệt giữa biến bất biến và biến mutable.

**Lời giải**:

```rust
fn main() {
    // Biến bất biến
    let x = 5;
    println!("Giá trị của x: {}", x);
    
    // Không thể thay đổi giá trị của biến bất biến
    // x = 6; // Bỏ comment dòng này để thấy lỗi
    
    // Biến mutable
    let mut y = 10;
    println!("Giá trị ban đầu của y: {}", y);
    
    // Có thể thay đổi giá trị của biến mutable
    y = 15;
    println!("Giá trị mới của y: {}", y);
}
```

**Giải thích**:
- Biến `x` được khai báo mà không có từ khóa `mut`, nên nó là bất biến
- Nếu bỏ comment dòng `x = 6`, chương trình sẽ báo lỗi vì không thể gán lại giá trị cho biến bất biến
- Biến `y` được khai báo với từ khóa `mut`, nên có thể thay đổi giá trị
- Việc gán `y = 15` là hợp lệ vì `y` là biến mutable

### Bài tập 2: Khám phá các kiểu dữ liệu số nguyên

**Yêu cầu**: Viết chương trình thể hiện các kiểu dữ liệu số nguyên khác nhau và phạm vi của chúng.

**Lời giải**:

```rust
fn main() {
    // Kiểu i8
    let a: i8 = 127;
    // let a_overflow: i8 = 128; // Lỗi: vượt quá phạm vi của i8
    println!("i8 max: {}", a);
    
    // Kiểu u8
    let b: u8 = 255;
    // let b_overflow: u8 = 256; // Lỗi: vượt quá phạm vi của u8
    println!("u8 max: {}", b);
    
    // Kiểu i32 (mặc định cho số nguyên)
    let c = 2_147_483_647;
    println!("i32 max: {}", c);
    
    // Kiểu u32
    let d: u32 = 4_294_967_295;
    println!("u32 max: {}", d);
    
    // Các cách biểu diễn số nguyên
    let decimal = 98_222;
    let hex = 0xff;
    let octal = 0o77;
    let binary = 0b1111_0000;
    let byte = b'A';
    
    println!("Decimal: {}", decimal);
    println!("Hex: {}", hex);
    println!("Octal: {}", octal);
    println!("Binary: {}", binary);
    println!("Byte: {}", byte);
}
```

**Giải thích**:
- Chương trình thể hiện các kiểu số nguyên khác nhau và giá trị lớn nhất của chúng
- Nếu bỏ comment các dòng `a_overflow` và `b_overflow`, chương trình sẽ báo lỗi vì vượt quá phạm vi
- Các cách biểu diễn số nguyên khác nhau (thập phân, thập lục phân, bát phân, nhị phân) đều được hỗ trợ
- Dấu gạch dưới `_` được sử dụng để làm cho số dễ đọc hơn, không ảnh hưởng đến giá trị

### Bài tập 3: So sánh shadowing và mutable

**Yêu cầu**: Viết chương trình minh họa sự khác biệt giữa shadowing và biến mutable.

**Lời giải**:

```rust
fn main() {
    // Shadowing với thay đổi kiểu dữ liệu
    let spaces = "   ";
    println!("spaces ban đầu: '{}' (kiểu &str)", spaces);
    
    let spaces = spaces.len();
    println!("spaces sau shadowing: {} (kiểu usize)", spaces);
    
    // Thử nghiệm với mut
    let mut word = "hello";
    println!("word ban đầu: '{}' (kiểu &str)", word);
    
    word = "world"; // Hợp lệ, giá trị mới cùng kiểu &str
    println!("word sau thay đổi: '{}' (vẫn là kiểu &str)", word);
    
    // Không thể thay đổi kiểu dữ liệu với mut
    // word = word.len(); // Lỗi: không thể gán usize cho &str
    
    // Nhưng có thể làm điều này với shadowing
    let word = word.len();
    println!("word sau shadowing: {} (giờ là kiểu usize)", word);
}
```

**Giải thích**:
- Biến `spaces` được khai báo lần đầu với kiểu `&str` (chuỗi)
- Sau đó, biến `spaces` được shadowing với một biến mới có kiểu `usize` (kết quả của phương thức `.len()`)
- Biến `word` được khai báo với `mut`, cho phép thay đổi giá trị nhưng phải giữ nguyên kiểu dữ liệu
- Thử gán `word = word.len()` sẽ gây ra lỗi vì không thể thay đổi kiểu dữ liệu của biến `mut`
- Cuối cùng, chúng ta dùng shadowing để thay đổi kiểu dữ liệu của `word` từ `&str` sang `usize`

### Bài tập 4: Sử dụng constants và static variables

**Yêu cầu**: Viết chương trình minh họa cách sử dụng constants và static variables.

**Lời giải**:

```rust
// Constants
const MAX_USERS: u32 = 100_000;
const PI: f64 = 3.14159265359;

// Static variable
static PROGRAM_NAME: &str = "Rust Demo";
static mut COUNTER: u32 = 0;

fn main() {
    println!("Chương trình: {}", PROGRAM_NAME);
    println!("Số người dùng tối đa: {}", MAX_USERS);
    println!("Giá trị Pi: {}", PI);
    
    // Sử dụng unsafe để truy cập static mut
    unsafe {
        println!("Counter ban đầu: {}", COUNTER);
        COUNTER += 1;
        println!("Counter sau khi tăng: {}", COUNTER);
    }
    
    // Demo tính toán với constants
    let radius = 5.0;
    let area = PI * radius * radius;
    println!("Diện tích hình tròn có bán kính {}: {}", radius, area);
}
```

**Giải thích**:
- Constants `MAX_USERS` và `PI` được khai báo ở phạm vi toàn cục
- Static variable `PROGRAM_NAME` cũng được khai báo ở phạm vi toàn cục
- Static mutable variable `COUNTER` phải được truy cập trong block `unsafe`
- Constants có thể được sử dụng trong các biểu thức tính toán như thông thường

## 🔑 Những điểm quan trọng cần lưu ý

1. **Immutability mặc định**: Rust mặc định mọi biến là bất biến (immutable), đây là một tính năng an toàn quan trọng.

2. **Sử dụng `mut` có chủ đích**: Chỉ sử dụng `mut` khi thực sự cần thay đổi giá trị của biến. Điều này giúp code an toàn và dễ đọc hơn.

3. **Rust có hệ thống kiểu dữ liệu phong phú**: Sử dụng kiểu dữ liệu phù hợp với nhu cầu để tối ưu bộ nhớ và hiệu suất.

4. **Shadowing không phải là mutation**: Shadowing tạo ra một biến mới và che khuất biến cũ, không phải là thay đổi giá trị của biến hiện tại.

5. **Thiết kế có chủ đích**: Khi làm việc với Rust, hãy nghĩ về cách bạn muốn quản lý dữ liệu. Immutability giúp code an toàn hơn khi xử lý đa luồng.

6. **Annotation khi cần**: Sử dụng type annotation khi không chắc chắn về kiểu dữ liệu hoặc khi muốn rõ ràng hơn.

7. **Constants vs. Static**: Constants được inline trong code trong khi static variables có địa chỉ bộ nhớ cố định. Sử dụng đúng mục đích.

8. **Phạm vi biến**: Luôn nhớ rằng biến chỉ tồn tại trong phạm vi (scope) của nó. Khi ra khỏi phạm vi, bộ nhớ được giải phóng.

9. **Tránh lỗi tràn số**: Rust sẽ gây panic khi tràn số trong chế độ debug, nhưng trong chế độ release, nó sẽ wrap around. Nên cẩn thận với phạm vi của kiểu dữ liệu.

10. **Không lạm dụng `unsafe`**: Chỉ sử dụng `unsafe` khi thực sự cần thiết và hiểu rõ hệ quả.

## 📝 Bài tập về nhà

### Bài 1: Chuyển đổi nhiệt độ
Viết một chương trình Rust cho phép người dùng nhập vào nhiệt độ theo độ Celsius và chuyển đổi sang độ Fahrenheit (công thức: F = C * 9/5 + 32). Hãy sử dụng constants để lưu trữ hệ số chuyển đổi.

### Bài 2: Tính toán kích thước hình học
Viết chương trình tính diện tích và chu vi của hình chữ nhật, hình tròn và tam giác. Sử dụng shadowing để tái sử dụng tên biến khi tính toán.

### Bài 3: Khám phá giới hạn kiểu dữ liệu
Viết một chương trình thể hiện giá trị lớn nhất và nhỏ nhất của các kiểu dữ liệu số nguyên khác nhau (i8, u8, i16, u16, i32, u32, i64, u64). Sử dụng các hằng số có sẵn như `std::i8::MAX`, `std::u8::MAX`, v.v.

### Bài 4: Nhập và xử lý thông tin sinh viên
Viết chương trình nhập thông tin của một sinh viên (tên, tuổi, điểm số) và hiển thị trạng thái đạt/không đạt dựa trên điểm số. Sử dụng biến mutable khi cần thiết và áp dụng shadowing để định dạng thông tin.

### Bài 5: Tính toán lãi kép
Viết chương trình tính toán lãi kép cho một khoản tiền gửi ngân hàng. Sử dụng constants cho lãi suất và các tham số không thay đổi, và sử dụng shadowing khi tính toán giá trị qua các năm.

**Lưu ý**: Hãy thực hiện các bài tập này để củng cố kiến thức về biến và kiểu dữ liệu trong Rust. Đặc biệt chú ý đến việc sử dụng đúng mục đích của biến bất biến, mutable, constants, và shadowing.