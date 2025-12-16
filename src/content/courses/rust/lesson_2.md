# Bài 2: Kiểu dữ liệu cơ bản và biến trong Rust

## 🎯 Mục tiêu bài học

- Hiểu và áp dụng được cơ chế khai báo biến trong Rust với từ khóa `let`
- Nắm vững khái niệm bất biến (immutability) - một trong những đặc trưng quan trọng của Rust
- Làm quen với các kiểu dữ liệu cơ bản trong Rust
- Hiểu sự khác biệt giữa type annotation và type inference
- Phân biệt được constants, static variables và biến thông thường


## 📝 Nội dung chi tiết

### 1. Khai báo biến với `let` và tính bất biến (immutability)

#### 1.1. Khai báo biến cơ bản

Trong Rust, chúng ta khai báo biến bằng từ khóa `let`:

```rust
let x = 5;
```


#### 1.2. Biến có thể thay đổi (mutable)

Nếu muốn tạo biến có thể thay đổi giá trị, bạn cần sử dụng từ khóa `mut`:

```rust
let mut y = 5;
y = 6; // Hợp lệ
println!("Giá trị của y là: {}", y);
```

#### 1.3. Tại sao Rust chọn mặc định là bất biến?

- **An toàn về bộ nhớ**: 
- **Ngăn chặn lỗi**: 
- **Tối ưu hóa**:
- **Lập trình đồng thời**: 

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


#### 2.2. Kiểu số thực (Float)

Rust có hai kiểu số thực:

- `f32`: Số thực 32-bit,
- `f64`: Số thực 64-bit,

```rust
let x = 2.0;
let y: f32 = 3.0; 
```

#### 2.3. Kiểu boolean

```rust
let t = true;
let f: bool = false; 
```

#### 2.4. Kiểu ký tự (Character)

Kiểu `char` trong Rust là 4 bytes và biểu diễn được một giá trị Unicode scalar, không chỉ là ASCII:


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
let x = 5; 
let y = 3.14; 
```

#### 3.3. Khi nào cần type annotation?

- Khi khai báo biến mà không khởi tạo giá trị ngay lập tức
- Khi bạn muốn dùng kiểu khác với kiểu mặc định

```rust
let guess: u32 = "42".parse().expect("Không phải là số!");
```

### 4. Constants và static variables

#### 4.1. Constants

Constants trong Rust là những giá trị không thể thay đổi và phải được gán giá trị tại thời điểm biên dịch:

```rust
const MAX_POINTS: u32 = 100_000;
```


#### 4.2. Static variables

Static variables tương tự như constants nhưng có địa chỉ bộ nhớ cố định:

```rust
static HELLO_WORLD: &str = "Xin chào, thế giới!";
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
let x = x + 1;
let x = x * 2; 
```

#### 5.1. Ưu điểm của shadowing

- Tránh đặt tên biến khác nhau cho cùng một khái niệm
- Có thể thay đổi kiểu dữ liệu trong khi giữ nguyên tên biến

```rust
let spaces = "   "; 
let spaces = spaces.len(); 
```

#### 5.2. Sự khác biệt giữa shadowing và `mut`

- `mut` cho phép thay đổi giá trị nhưng không thay đổi kiểu dữ liệu
- Shadowing cho phép thay đổi cả giá trị và kiểu dữ liệu

```rust
let mut spaces = "   ";
spaces = spaces.len(); 
```

#### 5.3. Phạm vi của shadowing

Shadowing chỉ có hiệu lực trong phạm vi khai báo:

```rust
let x = 5;
{
    let x = 12; 
    println!("Giá trị của x trong block nội: {}", x); 
}
println!("Giá trị của x: {}", x); 
```

## 🏆 Bài tập thực hành

### Bài tập 1: Thử nghiệm với biến bất biến và mutable

**Yêu cầu**: Hãy viết chương trình minh họa sự khác biệt giữa biến bất biến và biến mutable.


### Bài tập 2: Khám phá các kiểu dữ liệu số nguyên

**Yêu cầu**: Viết chương trình thể hiện các kiểu dữ liệu số nguyên khác nhau và phạm vi của chúng.

### Bài tập 3: So sánh shadowing và mutable

**Yêu cầu**: Viết chương trình minh họa sự khác biệt giữa shadowing và biến mutable.

## 🔑 Những điểm quan trọng cần lưu ý

1. **Immutability mặc định**:

2. **Sử dụng `mut` có chủ đích**:

3. **Rust có hệ thống kiểu dữ liệu phong phú**:

4. **Shadowing không phải là mutation**: 

5. **Thiết kế có chủ đích**: 
6. **Annotation khi cần**: 
7. **Constants vs. Static**: 

## 📝 Bài tập về nhà

### Bài 1: Chuyển đổi nhiệt độ
Viết một chương trình Rust cho phép người dùng nhập vào nhiệt độ theo độ Celsius và chuyển đổi sang độ Fahrenheit (công thức: F = C * 9/5 + 32). Hãy sử dụng constants để lưu trữ hệ số chuyển đổi.

### Bài 2: Tính toán kích thước hình học
Viết chương trình tính diện tích và chu vi của hình chữ nhật, hình tròn và tam giác. Sử dụng shadowing để tái sử dụng tên biến khi tính toán.

### Bài 3: Khám phá giới hạn kiểu dữ liệu
Viết một chương trình thể hiện giá trị lớn nhất và nhỏ nhất của các kiểu dữ liệu số nguyên khác nhau (i8, u8, i16, u16, i32, u32, i64, u64). Sử dụng các hằng số có sẵn như `std::i8::MAX`, `std::u8::MAX`, v.v.
