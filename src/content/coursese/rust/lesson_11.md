# Bài 11: Structs và Method Syntax trong Rust

## Mục tiêu bài học
- Hiểu và sử dụng được structs trong Rust
- Thành thạo các phương pháp khởi tạo structs
- Nắm vững method syntax và cách triển khai
- Hiểu rõ về associated functions
- Áp dụng kiến thức vào ứng dụng thực tế

## Phần 1: Giới thiệu về Structs

### 1.1 Structs là gì?
Structs (cấu trúc) là một kiểu dữ liệu tổng hợp cho phép đóng gói nhiều giá trị có kiểu dữ liệu khác nhau vào một đơn vị có ý nghĩa. Mỗi phần tử trong struct được gọi là một field (trường).

Structs giúp mô hình hóa các thực thể trong thế giới thực như: người dùng, sản phẩm, hình học, v.v.

### 1.2 Tại sao cần sử dụng Structs?
- **Tổ chức dữ liệu**: Nhóm các dữ liệu liên quan thành một đơn vị có ý nghĩa
- **Tái sử dụng mã**: Định nghĩa một lần, sử dụng nhiều lần
- **Trừu tượng hóa**: Ẩn chi tiết triển khai, chỉ hiển thị các giao diện cần thiết
- **Mô hình hóa thực tế**: Biểu diễn các đối tượng thế giới thực trong mã

## Phần 2: Định nghĩa và Khởi tạo Struct

### 2.1 Cú pháp định nghĩa Struct
```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
```

### 2.2 Khởi tạo Struct
```rust
fn main() {
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
    
    // Truy cập vào fields trong struct
    println!("Email: {}", user1.email);
}
```

### 2.3 Tính chất Struct
- Mỗi field có thể có kiểu dữ liệu khác nhau
- Truy cập fields qua toán tử dấu chấm (`.`)
- Struct là immutable theo mặc định
- Có thể tạo struct mutable để thay đổi giá trị fields

### 2.4 Struct Mutable
```rust
fn main() {
    let mut user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };

    // Thay đổi giá trị của field
    user1.email = String::from("new_email@example.com");
    println!("New email: {}", user1.email);
}
```

## Phần 3: Field Init Shorthand

### 3.1 Vấn đề khi khởi tạo Struct
Khi tên biến trùng với tên field, việc viết lặp lại có thể khiến mã trở nên dài dòng:

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email: email,
        username: username,
        active: true,
        sign_in_count: 1,
    }
}
```

### 3.2 Field Init Shorthand
Rust cung cấp field init shorthand để tránh lặp lại:

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email,      // Thay vì email: email
        username,   // Thay vì username: username
        active: true,
        sign_in_count: 1,
    }
}
```

## Phần 4: Struct Update Syntax

### 4.1 Vấn đề khi tạo struct từ struct khác
Khi muốn tạo một instance mới dựa trên instance đã có, việc sao chép từng field có thể dài dòng:

```rust
fn main() {
    // user1 đã khai báo từ trước...
    
    let user2 = User {
        email: String::from("another@example.com"),
        username: String::from("anotherusername"),
        active: user1.active,
        sign_in_count: user1.sign_in_count,
    };
}
```

### 4.2 Struct Update Syntax
Rust cung cấp cú pháp cập nhật struct để sao chép các field còn lại từ một instance khác:

```rust
fn main() {
    // user1 đã khai báo từ trước...
    
    let user2 = User {
        email: String::from("another@example.com"),
        username: String::from("anotherusername"),
        ..user1  // Sao chép các field còn lại từ user1
    };
}
```

### 4.3 Lưu ý về quyền sở hữu (ownership)
- Nếu struct có fields với kiểu dữ liệu implement Copy trait (như u32, bool), giá trị sẽ được sao chép
- Nếu struct có fields với kiểu dữ liệu không implement Copy trait (như String), quyền sở hữu sẽ được chuyển giao
- Trong ví dụ trên, `user1` không thể sử dụng lại nếu `User` có các fields kiểu String được chuyển quyền sở hữu

## Phần 5: Tuple Structs

### 5.1 Tuple Structs là gì?
Tuple structs là các structs không có tên field, chỉ có kiểu dữ liệu của field:

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
    
    // Truy cập bằng chỉ số như trong tuple
    println!("First value: {}", black.0);
}
```

### 5.2 Khi nào sử dụng Tuple Structs?
- Khi muốn đặt tên cho cả tuple (để phân biệt các kiểu)
- Khi không cần đặt tên cho từng field
- Khi muốn tạo kiểu mới hoàn toàn khác về ngữ nghĩa

## Phần 6: Unit-Like Structs

### 6.1 Unit-Like Structs là gì?
Unit-like structs là các structs không có fields nào:

```rust
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
}
```

### 6.2 Công dụng
- Khi cần implement một trait nhưng không cần lưu trữ dữ liệu
- Khi cần một kiểu dữ liệu riêng biệt nhưng không cần lưu trữ dữ liệu
- Thường dùng làm marker types hoặc trong các pattern khác

## Phần 7: Method Syntax

### 7.1 Methods là gì?
Methods là các hàm được định nghĩa trong ngữ cảnh của một struct (hoặc enum, trait), tham số đầu tiên luôn là `self` (hoặc dẫn xuất của `self`).

### 7.2 Định nghĩa Method với `impl`
```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    
    println!("Area: {} square pixels", rect1.area());
}
```

### 7.3 Các kiểu tham số `self`
- `&self`: Mượn struct một cách immutable
- `&mut self`: Mượn struct một cách mutable
- `self`: Lấy quyền sở hữu của struct

```rust
impl Rectangle {
    // Immutable borrow
    fn area(&self) -> u32 {
        self.width * self.height
    }
    
    // Mutable borrow
    fn resize(&mut self, width: u32, height: u32) {
        self.width = width;
        self.height = height;
    }
    
    // Take ownership
    fn destroy(self) -> String {
        String::from("Rectangle destroyed")
    }
}
```

## Phần 8: Associated Functions

### 8.1 Associated Functions là gì?
Associated functions là các hàm được định nghĩa trong khối `impl` nhưng không lấy `self` làm tham số:

```rust
impl Rectangle {
    // Associated function (không có self)
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

fn main() {
    // Gọi associated function bằng toán tử ::
    let square = Rectangle::square(20);
}
```

### 8.2 Công dụng của Associated Functions
- Tạo constructors (hàm tạo)
- Factory methods (tạo instance với các cấu hình cụ thể)
- Utility functions liên quan đến kiểu
- Tương tự static methods trong các ngôn ngữ OOP khác

### 8.3 Nhiều khối `impl`
Một struct có thể có nhiều khối `impl`:

```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
```

## Phần 9: Ứng dụng thực tế

### 9.1 Ứng dụng tính toán hình học
```rust
#[derive(Debug)]
struct Point {
    x: f64,
    y: f64,
}

#[derive(Debug)]
struct Circle {
    center: Point,
    radius: f64,
}

impl Point {
    fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }
    
    fn distance_to(&self, other: &Point) -> f64 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        (dx * dx + dy * dy).sqrt()
    }
}

impl Circle {
    fn new(center: Point, radius: f64) -> Self {
        Self { center, radius }
    }
    
    fn area(&self) -> f64 {
        std::f64::consts::PI * self.radius * self.radius
    }
    
    fn circumference(&self) -> f64 {
        2.0 * std::f64::consts::PI * self.radius
    }
    
    fn contains(&self, point: &Point) -> bool {
        self.center.distance_to(point) <= self.radius
    }
}

fn main() {
    let origin = Point::new(0.0, 0.0);
    let p1 = Point::new(5.0, 5.0);
    
    println!("Distance from origin to p1: {}", origin.distance_to(&p1));
    
    let circle = Circle::new(origin, 10.0);
    println!("Circle area: {}", circle.area());
    println!("Circle circumference: {}", circle.circumference());
    println!("Circle contains p1? {}", circle.contains(&p1));
}
```

### 9.2 Ứng dụng Rectangle
```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn new(width: u32, height: u32) -> Self {
        Self { width, height }
    }
    
    fn square(size: u32) -> Self {
        Self::new(size, size)
    }
    
    fn area(&self) -> u32 {
        self.width * self.height
    }
    
    fn perimeter(&self) -> u32 {
        2 * (self.width + self.height)
    }
    
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width >= other.width && self.height >= other.height
    }
    
    fn rotate(&mut self) {
        std::mem::swap(&mut self.width, &mut self.height);
    }
}

fn main() {
    let rect1 = Rectangle::new(30, 50);
    let rect2 = Rectangle::new(10, 40);
    let square = Rectangle::square(20);
    
    println!("rect1 is {:?}", rect1);
    println!("Area of rect1: {}", rect1.area());
    println!("Perimeter of rect1: {}", rect1.perimeter());
    
    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));
    println!("Can rect1 hold square? {}", rect1.can_hold(&square));
    
    let mut rect3 = Rectangle::new(10, 20);
    println!("Before rotation: {:?}", rect3);
    rect3.rotate();
    println!("After rotation: {:?}", rect3);
}
```

## Bài tập thực hành

### Bài tập 1: Tạo một hệ thống quản lý tài khoản ngân hàng
Tạo các structs và methods để biểu diễn hệ thống tài khoản ngân hàng với các chức năng:
- Tạo tài khoản mới
- Gửi tiền
- Rút tiền
- Chuyển tiền giữa các tài khoản
- Hiển thị thông tin tài khoản

### Bài tập 2: Xây dựng hệ thống hình học
Tạo các structs và methods để biểu diễn và tính toán với các hình như:
- Điểm (Point)
- Đường thẳng (Line)
- Hình tam giác (Triangle)
- Hình chữ nhật (Rectangle)
- Hình tròn (Circle)

Thêm các phương thức để tính diện tích, chu vi, kiểm tra giao nhau, etc.

## Tổng kết

### Các điểm chính đã học
1. Structs giúp nhóm các dữ liệu liên quan thành một đơn vị có ý nghĩa
2. Có ba loại structs: classic structs, tuple structs, và unit-like structs
3. Field init shorthand giúp rút gọn mã khi tên biến trùng với tên field
4. Struct update syntax giúp tạo instance mới dựa trên instance đã có
5. Methods là các hàm gắn với một kiểu dữ liệu, tham số đầu tiên là `self`
6. Associated functions là các hàm gắn với một kiểu dữ liệu nhưng không lấy `self` làm tham số
7. Rust hỗ trợ OOP theo cách riêng, tập trung vào tính năng hơn là kế thừa

### Tài nguyên học thêm
- [The Rust Book - Chapter 5: Using Structs](https://doc.rust-lang.org/book/ch05-00-structs.html)
- [Rust By Example - Structs](https://doc.rust-lang.org/rust-by-example/custom_types/structs.html)
- [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)

## Bài tiếp theo
Bài 12: Enums và Pattern Matching