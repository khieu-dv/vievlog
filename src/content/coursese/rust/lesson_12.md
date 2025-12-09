# Bài 12: Enums và Pattern Matching trong Rust

## 1. Giới thiệu

Xin chào các bạn! Hôm nay chúng ta sẽ tìm hiểu về một trong những tính năng mạnh mẽ nhất trong Rust: Enums và Pattern Matching. Đây là những công cụ cho phép chúng ta viết mã linh hoạt, an toàn và dễ bảo trì.

### Mục tiêu bài học:
- Hiểu được cách định nghĩa và sử dụng enums
- Nắm vững cách làm việc với enums có chứa dữ liệu
- Thông thạo Option enum để xử lý giá trị có thể không tồn tại
- Thành thạo pattern matching với match
- Sử dụng thành thạo if let và while let cho việc xử lý pattern

## 2. Enums trong Rust

### 2.1. Định nghĩa cơ bản của Enum

Enum (viết tắt của Enumeration) cho phép bạn định nghĩa một kiểu dữ liệu bằng cách liệt kê các biến thể có thể có của nó.

```rust
// Định nghĩa enum cơ bản
enum Direction {
    North,
    South,
    East,
    West,
}

fn main() {
    let direction = Direction::North;
    
    // Sử dụng enum trong hàm
    print_direction(direction);
}

fn print_direction(direction: Direction) {
    match direction {
        Direction::North => println!("Hướng Bắc"),
        Direction::South => println!("Hướng Nam"),
        Direction::East => println!("Hướng Đông"),
        Direction::West => println!("Hướng Tây"),
    }
}
```

> **Điểm quan trọng**: Khác với C/C++, enums trong Rust là kiểu dữ liệu đầy đủ, không chỉ là các số nguyên được đặt tên.

### 2.2. Enums với dữ liệu

Một tính năng mạnh mẽ của enums trong Rust là khả năng đính kèm dữ liệu vào từng biến thể.

```rust
// Enum với dữ liệu khác nhau cho mỗi biến thể
enum Message {
    Quit,                       // Không có dữ liệu
    Move { x: i32, y: i32 },    // Struct nội tuyến
    Write(String),              // Tuple với một phần tử
    ChangeColor(i32, i32, i32), // Tuple với ba phần tử
}

fn main() {
    let messages = [
        Message::Quit,
        Message::Move { x: 10, y: 5 },
        Message::Write(String::from("Xin chào!")),
        Message::ChangeColor(255, 0, 0),
    ];
    
    for msg in messages {
        process_message(msg);
    }
}

fn process_message(msg: Message) {
    match msg {
        Message::Quit => println!("Thoát chương trình"),
        Message::Move { x, y } => println!("Di chuyển đến vị trí: ({}, {})", x, y),
        Message::Write(text) => println!("Thông điệp: {}", text),
        Message::ChangeColor(r, g, b) => println!("Đổi màu thành RGB: ({}, {}, {})", r, g, b),
    }
}
```

> **Thủ thuật**: Enums với dữ liệu giúp chúng ta mô hình hóa các khái niệm mà có thể tồn tại trong nhiều dạng khác nhau, mỗi dạng có các thông tin liên quan riêng.

## 3. Option Enum

### 3.1. Giới thiệu Option

`Option` là một enum được định nghĩa sẵn trong thư viện chuẩn của Rust để xử lý giá trị có thể không tồn tại. Nó loại bỏ vấn đề null pointer mà nhiều ngôn ngữ khác gặp phải.

```rust
// Định nghĩa của Option trong thư viện chuẩn
enum Option<T> {
    None,    // Không có giá trị
    Some(T), // Có giá trị kiểu T
}
```

### 3.2. Làm việc với Option

```rust
fn main() {
    // Ví dụ về Option
    let some_number = Some(5);
    let some_string = Some("một chuỗi");
    let absent_number: Option<i32> = None;
    
    // Truy cập giá trị trong Option
    match some_number {
        Some(value) => println!("Có giá trị: {}", value),
        None => println!("Không có giá trị"),
    }
    
    // Sử dụng các phương thức của Option
    let doubled = some_number.map(|x| x * 2);
    println!("Giá trị gấp đôi: {:?}", doubled);
    
    // Phương thức unwrap_or
    let value = absent_number.unwrap_or(0);
    println!("Giá trị hoặc mặc định: {}", value);
}
```

> **Lưu ý an toàn**: Tránh sử dụng `unwrap()` trong mã sản phẩm vì nó có thể gây panic nếu gặp `None`. Thay vào đó, hãy sử dụng `unwrap_or()`, `unwrap_or_else()`, hoặc pattern matching.

## 4. Pattern Matching với match

### 4.1. Cú pháp cơ bản của match

```rust
fn main() {
    let number = 13;
    
    match number {
        // Khớp với một giá trị cụ thể
        0 => println!("Số không"),
        
        // Khớp với nhiều giá trị
        1 | 2 => println!("Một hoặc hai"),
        
        // Khớp với một phạm vi
        3..=9 => println!("Từ ba đến chín"),
        
        // Điều kiện bảo vệ (guard)
        n if n % 2 == 0 => println!("{} là số chẵn", n),
        
        // Khớp với tất cả các trường hợp còn lại
        _ => println!("{} là số lẻ lớn hơn 9", number),
    }
}
```

### 4.2. Phân rã cấu trúc với pattern matching

```rust
struct Point {
    x: i32,
    y: i32,
}

enum Shape {
    Circle(Point, i32),         // Tâm và bán kính
    Rectangle(Point, Point),    // Góc trên bên trái và góc dưới bên phải
}

fn main() {
    let shapes = [
        Shape::Circle(Point { x: 0, y: 0 }, 5),
        Shape::Rectangle(
            Point { x: -1, y: 2 },
            Point { x: 3, y: -4 }
        ),
    ];
    
    for shape in shapes {
        // Phân rã cấu trúc lồng nhau
        match shape {
            Shape::Circle(Point { x, y }, radius) => {
                println!("Hình tròn có tâm tại ({}, {}) với bán kính {}", x, y, radius);
            },
            Shape::Rectangle(Point { x: x1, y: y1 }, Point { x: x2, y: y2 }) => {
                println!("Hình chữ nhật với các điểm ({}, {}) và ({}, {})", x1, y1, x2, y2);
                println!("Diện tích: {}", (x2 - x1).abs() * (y2 - y1).abs());
            },
        }
    }
}
```

> **Thực tiễn tốt**: Pattern matching trong Rust phải bao quát tất cả các trường hợp có thể xảy ra. Compiler sẽ kiểm tra tính exhaustive này để đảm bảo tính an toàn.

## 5. if let và while let

### 5.1. if let - Xử lý một pattern duy nhất

`if let` cho phép chúng ta xử lý một pattern cụ thể mà không cần liệt kê tất cả các trường hợp khác như với `match`.

```rust
fn main() {
    let some_value = Some(42);
    
    // Sử dụng match
    match some_value {
        Some(value) => println!("Giá trị là: {}", value),
        None => (), // Không làm gì nếu là None
    }
    
    // Tương đương nhưng ngắn gọn hơn với if let
    if let Some(value) = some_value {
        println!("Giá trị là: {}", value);
    }
    
    // if let với else
    if let Some(value) = some_value {
        println!("Giá trị là: {}", value);
    } else {
        println!("Không có giá trị");
    }
}
```

### 5.2. while let - Xử lý các pattern trong vòng lặp

`while let` cho phép chúng ta lặp lại một hành động cho đến khi một pattern không còn khớp nữa.

```rust
fn main() {
    let mut stack = Vec::new();
    
    stack.push(1);
    stack.push(2);
    stack.push(3);
    
    // Lấy và xử lý các phần tử cho đến khi stack trống
    while let Some(top) = stack.pop() {
        println!("Phần tử trên cùng: {}", top);
    }
}
```

## 6. Result Enum và Xử lý Lỗi

### 6.1. Giới thiệu Result

`Result` là một enum được định nghĩa sẵn để xử lý các hoạt động có thể thành công hoặc thất bại.

```rust
// Định nghĩa của Result trong thư viện chuẩn
enum Result<T, E> {
    Ok(T),  // Thành công với giá trị kiểu T
    Err(E), // Lỗi với giá trị kiểu E
}
```

### 6.2. Xử lý lỗi với Result

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file_contents(path: &str) -> Result<String, io::Error> {
    let mut file = match File::open(path) {
        Ok(file) => file,
        Err(error) => return Err(error),
    };
    
    let mut contents = String::new();
    match file.read_to_string(&mut contents) {
        Ok(_) => Ok(contents),
        Err(error) => Err(error),
    }
}

fn main() {
    let result = read_file_contents("hello.txt");
    
    match result {
        Ok(contents) => println!("Nội dung file:\n{}", contents),
        Err(error) => println!("Lỗi khi đọc file: {}", error),
    }
    
    // Sử dụng toán tử ?
    fn read_file_simplified(path: &str) -> Result<String, io::Error> {
        let mut file = File::open(path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;
        Ok(contents)
    }
}
```

> **Mẹo chuyên nghiệp**: Toán tử `?` giúp mã xử lý lỗi ngắn gọn hơn. Nó tự động unwrap giá trị `Ok` hoặc return sớm với giá trị `Err`.

## 7. Ứng dụng Thực tế: Xây dựng Ứng dụng Xử lý Trạng thái

Hãy xây dựng một ứng dụng đơn giản mô phỏng máy rút tiền tự động (ATM) sử dụng enums và pattern matching.

```rust
enum ATMState {
    Idle,
    CardInserted(String),  // Số thẻ
    PinEntered(String, String),  // Số thẻ, mã PIN
    AmountSelected(String, String, u64),  // Số thẻ, mã PIN, số tiền
}

enum ATMOperation {
    InsertCard(String),  // Số thẻ
    EnterPin(String),    // Mã PIN
    SelectAmount(u64),   // Số tiền
    Cancel,
}

enum ATMResult {
    Success(String),  // Thông báo thành công
    Error(String),    // Thông báo lỗi
    NoChange,
}

fn process_atm_operation(current_state: ATMState, operation: ATMOperation) -> (ATMState, ATMResult) {
    match (current_state, operation) {
        // Từ trạng thái Idle
        (ATMState::Idle, ATMOperation::InsertCard(card_num)) => {
            (ATMState::CardInserted(card_num), ATMResult::Success(String::from("Vui lòng nhập mã PIN")))
        },
        
        // Từ trạng thái CardInserted
        (ATMState::CardInserted(card_num), ATMOperation::EnterPin(pin)) => {
            // Trong thực tế, ta sẽ xác thực PIN ở đây
            (ATMState::PinEntered(card_num, pin), ATMResult::Success(String::from("Vui lòng chọn số tiền")))
        },
        (ATMState::CardInserted(_), ATMOperation::Cancel) => {
            (ATMState::Idle, ATMResult::Success(String::from("Đã trả lại thẻ")))
        },
        
        // Từ trạng thái PinEntered
        (ATMState::PinEntered(card_num, pin), ATMOperation::SelectAmount(amount)) => {
            // Kiểm tra số dư và xử lý rút tiền
            if amount <= 1000 {
                (
                    ATMState::AmountSelected(card_num, pin, amount),
                    ATMResult::Success(format!("Đang xử lý rút {} VND", amount))
                )
            } else {
                (
                    ATMState::PinEntered(card_num, pin),
                    ATMResult::Error(String::from("Số tiền vượt quá giới hạn!"))
                )
            }
        },
        (ATMState::PinEntered(_, _), ATMOperation::Cancel) => {
            (ATMState::Idle, ATMResult::Success(String::from("Đã hủy giao dịch")))
        },
        
        // Từ trạng thái AmountSelected
        (ATMState::AmountSelected(_, _, amount), ATMOperation::Cancel) => {
            (
                ATMState::Idle,
                ATMResult::Success(format!("Đã rút {} VND. Cảm ơn bạn đã sử dụng dịch vụ!", amount))
            )
        },
        
        // Xử lý tất cả các trường hợp không hợp lệ
        (state, operation) => {
            let error_msg = match operation {
                ATMOperation::InsertCard(_) => "Vui lòng lấy thẻ ra trước khi chèn thẻ mới",
                ATMOperation::EnterPin(_) => "Vui lòng chèn thẻ trước khi nhập PIN",
                ATMOperation::SelectAmount(_) => "Vui lòng nhập PIN trước khi chọn số tiền",
                ATMOperation::Cancel => "Không có gì để hủy",
            };
            (state, ATMResult::Error(String::from(error_msg)))
        }
    }
}

fn main() {
    let mut current_state = ATMState::Idle;
    
    // Mô phỏng một luồng giao dịch
    let operations = [
        ATMOperation::InsertCard(String::from("1234-5678-9012-3456")),
        ATMOperation::EnterPin(String::from("1234")),
        ATMOperation::SelectAmount(500),
        ATMOperation::Cancel,
        
        // Mô phỏng một luồng giao dịch lỗi
        ATMOperation::SelectAmount(100),  // Không hợp lệ vì chưa chèn thẻ
        ATMOperation::InsertCard(String::from("9876-5432-1098-7654")),
        ATMOperation::EnterPin(String::from("4321")),
        ATMOperation::SelectAmount(1500),  // Vượt quá giới hạn
        ATMOperation::Cancel,
    ];
    
    for operation in operations {
        // Xử lý hoạt động
        let operation_name = match &operation {
            ATMOperation::InsertCard(card) => format!("Chèn thẻ {}", card),
            ATMOperation::EnterPin(_) => String::from("Nhập PIN"),
            ATMOperation::SelectAmount(amount) => format!("Chọn số tiền {}", amount),
            ATMOperation::Cancel => String::from("Hủy"),
        };
        
        println!("Thực hiện: {}", operation_name);
        
        let (new_state, result) = process_atm_operation(current_state, operation);
        current_state = new_state;
        
        match result {
            ATMResult::Success(msg) => println!("✅ {}", msg),
            ATMResult::Error(msg) => println!("❌ {}", msg),
            ATMResult::NoChange => println!("Không có thay đổi"),
        }
        
        println!("-------------------");
    }
}
```

## 8. Tổng kết

Trong bài học này, chúng ta đã tìm hiểu:

1. **Enums cơ bản** - cách định nghĩa và sử dụng enums trong Rust
2. **Enums với dữ liệu** - cách đính kèm và truy cập dữ liệu trong các biến thể enum
3. **Option enum** - cách xử lý các giá trị tùy chọn một cách an toàn
4. **Result enum** - cách xử lý lỗi một cách rõ ràng và mạnh mẽ
5. **Pattern matching** - cách sử dụng match để xử lý các trường hợp khác nhau
6. **if let và while let** - cú pháp ngắn gọn cho việc xử lý pattern đơn giản
7. **Ứng dụng thực tế** - cách kết hợp tất cả những kiến thức này để xây dựng một ứng dụng quản lý trạng thái

Enums và pattern matching là những tính năng nổi bật của Rust, cho phép chúng ta viết mã an toàn, rõ ràng và dễ bảo trì. Chúng đặc biệt hữu ích trong việc xử lý lỗi, biểu diễn các trạng thái và làm việc với dữ liệu có cấu trúc phức tạp.

## 9. Bài tập

1. **Bài tập cơ bản**: Tạo một enum `TrafficLight` với các biến thể Red, Yellow và Green. Viết một hàm để mô phỏng hoạt động của đèn giao thông.

2. **Bài tập trung bình**: Viết một enum `Payment` với các biến thể Cash, CreditCard và MobilePayment, mỗi biến thể chứa thông tin thích hợp. Sau đó viết hàm xử lý thanh toán sử dụng pattern matching.

3. **Bài tập nâng cao**: Xây dựng một máy trạng thái đơn giản (state machine) để mô phỏng một đơn hàng trực tuyến với các trạng thái như: Created, Processing, Shipped, Delivered, và Cancelled. Sử dụng enums để biểu diễn các trạng thái và các sự kiện có thể xảy ra.

## 10. Tài nguyên bổ sung

- [Tài liệu chính thức của Rust về Enums](https://doc.rust-lang.org/book/ch06-00-enums.html)
- [Tài liệu chính thức của Rust về Pattern Matching](https://doc.rust-lang.org/book/ch18-00-patterns.html)
- [Rust By Example: Enums](https://doc.rust-lang.org/rust-by-example/custom_types/enum.html)
- [Rust By Example: Match](https://doc.rust-lang.org/rust-by-example/flow_control/match.html)