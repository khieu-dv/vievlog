# BÀI 8: SLICES TRONG RUST

## 1. GIỚI THIỆU (3-5 phút)

### Mở đầu
- Chào mừng các bạn đến với Bài 8 trong chuỗi bài giảng về Rust
- Recap nhanh các khái niệm trong bài trước về ownership và borrowing
- Giới thiệu về Slices: Một trong những tính năng quan trọng của Rust

### Định nghĩa Slice
- Slice là con trỏ đến một phần của collection, không sở hữu dữ liệu
- Slice giúp truy cập một phần của dữ liệu mà không cần chuyển quyền sở hữu
- Đảm bảo an toàn bộ nhớ thông qua borrowing system

### Biểu diễn trực quan
- Vẽ sơ đồ minh họa slice là "view" vào dữ liệu gốc
- So sánh với các ngôn ngữ khác (Python, JavaScript)

## 2. STRING SLICES (7-10 phút)

### Cú pháp cơ bản
```rust
let s = String::from("Học lập trình Rust");
let slice = &s[0..3]; // "Học"
```

### Ví dụ chi tiết với String slices
```rust
let s = String::from("Xin chào Việt Nam");

// Các cách tạo slice
let slice1 = &s[0..3];     // "Xin"
let slice2 = &s[4..8];     // "chào"
let slice3 = &s[..3];      // "Xin" (từ đầu)
let slice4 = &s[9..];      // "Việt Nam" (đến cuối)
let slice5 = &s[..];       // "Xin chào Việt Nam" (toàn bộ)

println!("slice1: {}", slice1);
println!("slice2: {}", slice2);
println!("slice3: {}", slice3);
println!("slice4: {}", slice4);
println!("slice5: {}", slice5);
```

### String literals và &str
- String literals là string slices sẵn có
```rust
let s: &str = "Đây là string literal";
```
- So sánh `String` và `&str`
- Khi nào dùng `&str` và khi nào dùng `String`

### Lỗi phổ biến với UTF-8
```rust
let s = String::from("Xin chào");
// Lỗi khi slice không khớp ranh giới UTF-8
// let bad_slice = &s[0..2]; // Lỗi!

// Cách xử lý đúng với tiếng Việt và các ký tự Unicode
for (i, c) in s.char_indices() {
    println!("Vị trí {}: '{}'", i, c);
}
```

### Thực hành với String slices
```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    
    &s[..]
}

fn main() {
    let s = String::from("Học Rust rất vui");
    let word = first_word(&s);
    println!("Từ đầu tiên: {}", word);
    
    // String slices giúp ngăn chặn lỗi
    // s.clear(); // Lỗi: không thể mượn `s` làm mutable khi nó đã được mượn làm immutable
    
    // Hoạt động với string literals
    let literal = "Xin chào";
    let first = first_word(literal);
    println!("Từ đầu tiên của literal: {}", first);
}
```

## 3. ARRAY SLICES (5-7 phút)

### Cú pháp và cách sử dụng
```rust
let numbers = [1, 2, 3, 4, 5];
let slice = &numbers[1..4];  // [2, 3, 4]

println!("Slice: {:?}", slice);
```

### Ví dụ nâng cao với slices kiểu Generic
```rust
fn sum_of_slice(slice: &[i32]) -> i32 {
    let mut sum = 0;
    for &item in slice {
        sum += item;
    }
    sum
}

fn main() {
    let numbers = [1, 2, 3, 4, 5];
    
    println!("Tổng của tất cả: {}", sum_of_slice(&numbers));
    println!("Tổng của 3 số đầu: {}", sum_of_slice(&numbers[0..3]));
    println!("Tổng của 2 số cuối: {}", sum_of_slice(&numbers[3..]));
}
```

### Slices với các cấu trúc dữ liệu khác
```rust
let vec = vec![10, 20, 30, 40, 50];
let vec_slice = &vec[..3];  // [10, 20, 30]

println!("Vector slice: {:?}", vec_slice);
```

## 4. CÁC PHƯƠNG THỨC LÀM VIỆC VỚI SLICES (5-7 phút)

### String slice methods
```rust
fn main() {
    let s = String::from("Rust programming language");
    
    // Các phương thức
    println!("Độ dài: {}", s.len());
    println!("Có chứa 'program': {}", s.contains("program"));
    println!("Bắt đầu với 'Rust': {}", s.starts_with("Rust"));
    println!("Kết thúc với 'age': {}", s.ends_with("age"));
    
    // Tách chuỗi
    let parts: Vec<&str> = s.split(' ').collect();
    println!("Các phần: {:?}", parts);
    
    // Trim và các biến thể
    let text = "   Xin chào   ";
    println!("Trim: '{}'", text.trim());
    
    // Chuyển đổi case
    println!("Uppercase: {}", s.to_uppercase());
    println!("Lowercase: {}", s.to_lowercase());
}
```

### Array slice methods
```rust
fn main() {
    let numbers = [10, 20, 30, 40, 50];
    let slice = &numbers[..];
    
    // Truy cập phần tử
    println!("Phần tử đầu tiên: {:?}", slice.first());
    println!("Phần tử cuối cùng: {:?}", slice.last());
    println!("Phần tử ở vị trí 2: {:?}", slice.get(2));
    println!("Phần tử ở vị trí 10 (ngoài phạm vi): {:?}", slice.get(10));
    
    // Kiểm tra
    println!("Slice có rỗng không? {}", slice.is_empty());
    println!("Độ dài: {}", slice.len());
    
    // Chia nhỏ slice
    if let Some((left, right)) = slice.split_first() {
        println!("Phần tử đầu: {}, Phần còn lại: {:?}", left, right);
    }
    
    // Lặp qua các cặp liền kề
    for window in slice.windows(2) {
        println!("Cặp liền kề: {:?}", window);
    }
    
    // Chia thành các phần có kích thước cố định
    for chunk in slice.chunks(2) {
        println!("Chunk: {:?}", chunk);
    }
}
```

## 5. PATTERN MATCHING VỚI SLICES (5-7 phút)

### Cú pháp cơ bản
```rust
fn main() {
    let numbers = [1, 2, 3, 4, 5];
    
    match numbers {
        [1, second, ..] => println!("Phần tử thứ hai: {}", second),
        _ => println!("Không khớp mẫu"),
    }
}
```

### Ví dụ nâng cao
```rust
fn analyze_slice(slice: &[i32]) {
    match slice {
        [] => println!("Slice rỗng"),
        [single] => println!("Chỉ có một phần tử: {}", single),
        [first, second] => println!("Có hai phần tử: {} và {}", first, second),
        [first, .., last] => println!("Có nhiều phần tử, đầu: {}, cuối: {}", first, last),
    }
}

fn main() {
    analyze_slice(&[]);
    analyze_slice(&[100]);
    analyze_slice(&[10, 20]);
    analyze_slice(&[1, 2, 3, 4, 5]);
}
```

### Pattern matching với string slices
```rust
fn check_greeting(greeting: &str) {
    match greeting {
        "xin chào" => println!("Lời chào tiếng Việt"),
        "hello" => println!("Lời chào tiếng Anh"),
        greeting if greeting.starts_with("hi") => println!("Lời chào ngắn gọn"),
        _ => println!("Lời chào khác: {}", greeting),
    }
}

fn main() {
    check_greeting("xin chào");
    check_greeting("hello");
    check_greeting("hi there");
    check_greeting("bonjour");
}
```

## 6. THỰC HÀNH: BÀI TẬP (7-10 phút)

### Bài tập 1: Tìm từ đầu tiên trong câu
```rust
fn first_word(s: &str) -> &str {
    // Chuyển chuỗi thành mảng bytes
    let bytes = s.as_bytes();
    
    // Tìm vị trí của khoảng trắng đầu tiên
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }
    
    // Nếu không tìm thấy khoảng trắng, trả về cả chuỗi
    &s[..]
}

fn main() {
    let sentence = String::from("Rust là ngôn ngữ lập trình tuyệt vời");
    let first = first_word(&sentence);
    println!("Từ đầu tiên: {}", first);
    
    // Thử với các ví dụ khác
    println!("Từ đầu tiên: {}", first_word("Hello World"));
    println!("Từ đầu tiên: {}", first_word("Programming"));
}
```

### Bài tập 2: So sánh hiệu suất của slices và cloning
```rust
use std::time::{Duration, Instant};

fn process_with_slice(data: &[i32]) -> i32 {
    data.iter().sum()
}

fn process_with_clone(data: Vec<i32>) -> i32 {
    data.iter().sum()
}

fn benchmark<F>(name: &str, count: usize, func: F)
where
    F: Fn(),
{
    let start = Instant::now();
    
    for _ in 0..count {
        func();
    }
    
    let duration = start.elapsed();
    println!(
        "{}: {} lần trong {:?} (trung bình: {:?} mỗi lần)",
        name,
        count,
        duration,
        duration / count as u32
    );
}

fn main() {
    let data: Vec<i32> = (0..10000).collect();
    let iterations = 10000;
    
    benchmark("Sử dụng slice", iterations, || {
        let _ = process_with_slice(&data);
    });
    
    benchmark("Sử dụng clone", iterations, || {
        let _ = process_with_clone(data.clone());
    });
    
    println!("\nKết luận:");
    println!("- Slices không có chi phí sao chép dữ liệu");
    println!("- Cloning sao chép toàn bộ dữ liệu, tiêu tốn bộ nhớ và thời gian");
    println!("- Sử dụng slices là cách tối ưu trong hầu hết các trường hợp");
}
```

## 7. TỐI ƯU HÓA VỚI SLICES (5 phút)

### Khi nào nên dùng Slices
- Khi chỉ cần truy cập dữ liệu, không cần thay đổi
- Khi muốn truyền reference tới một phần của collection
- Khi cần viết hàm linh hoạt làm việc với nhiều loại chuỗi/mảng

### Khi nào nên dùng Clone
- Khi cần sở hữu và thay đổi dữ liệu
- Khi cần giữ dữ liệu sau khi đối tượng gốc bị hủy
- Khi đối tượng gốc bị sử dụng trong một luồng khác

### Một số lưu ý về hiệu suất
```rust
fn guidelines() {
    // Tốt: Sử dụng &str cho tham số
    fn good_function(s: &str) {
        // Code xử lý
    }
    
    // Không tối ưu: Yêu cầu String
    fn less_flexible(s: String) {
        // Code xử lý
    }
    
    // Tối ưu: Nhận bất kỳ loại mảng nào
    fn process_numbers(numbers: &[i32]) {
        // Code xử lý
    }
    
    let s1 = "Hello";               // &str
    let s2 = String::from("World"); // String
    
    // Cả hai đều hoạt động với hàm nhận &str
    good_function(s1);
    good_function(&s2);
    
    // Chỉ String hoạt động (hoặc phải clone &str)
    less_flexible(String::from(s1)); // Phải clone
    less_flexible(s2.clone());       // Phải clone
}
```

## 8. KẾT LUẬN VÀ TỔNG KẾT (3-5 phút)

### Tóm tắt kiến thức
- Slices là cách an toàn để tham chiếu đến một phần của collection
- String slices (`&str`) và Array slices (`&[T]`) hoạt động tương tự
- Pattern matching với slices mở ra nhiều khả năng xử lý dữ liệu
- Slices giúp tối ưu hiệu suất và bộ nhớ so với cloning

### Kết nối với các bài học trước và sau
- Liên kết với bài học về ownership và borrowing
- Tiếp theo chúng ta sẽ học về struct trong Rust

### Bài tập về nhà
1. Viết hàm `find_substring` để tìm vị trí đầu tiên của chuỗi con trong chuỗi
2. Viết hàm tìm từ cuối cùng trong câu
3. Cài đặt hàm `split_at_nth_word` để tách chuỗi tại từ thứ n

## 9. NGUỒN TÀI LIỆU BỔ SUNG

- [The Rust Book - Chapter 4.3: Slices](https://doc.rust-lang.org/book/ch04-03-slices.html)
- [Rust By Example - Slices](https://doc.rust-lang.org/rust-by-example/primitives/array.html)
- [Reference: str - Rust](https://doc.rust-lang.org/std/primitive.str.html)
- [Reference: slice - Rust](https://doc.rust-lang.org/std/primitive.slice.html)

## 10. MÃ NGUỒN MẪU ĐẦY ĐỦ

Mã nguồn đầy đủ cho tất cả các ví dụ trong bài học này có sẵn tại GitHub: [RustVietnam/lesson-08-slices](https://github.com/khieu-dv/rust-course/tree/main/lesson-08-slices)

# CÁC CHÚ Ý KHI GIẢNG DẠY

1. **Trước khi bắt đầu bài giảng**:
   - Chuẩn bị tất cả các ví dụ code trong môi trường phát triển
   - Kiểm tra xem code chạy đúng với các phiên bản Rust mới nhất
   - Tạo một danh sách các lỗi thường gặp để trình bày

2. **Trong khi giảng**:
   - Dành thời gian giải thích về các lỗi phổ biến khi sử dụng slices
   - Đặc biệt nhấn mạnh về vấn đề UTF-8 khi sử dụng string slices
   - Minh họa rõ mối quan hệ giữa slice và ownership

3. **Thời gian cho từng phần**:
   - Giới thiệu: 3-5 phút
   - String slices: 7-10 phút
   - Array slices: 5-7 phút
   - Các phương thức: 5-7 phút
   - Pattern matching: 5-7 phút
   - Thực hành: 7-10 phút
   - Tối ưu hóa: 5 phút
   - Kết luận: 3-5 phút
   - Tổng thời gian: 40-56 phút

4. **Điểm nhấn quan trọng**:
   - Slices là borrowed view, không sở hữu dữ liệu
   - Slices giúp ngăn ngừa các lỗi phổ biến về ownership
   - So sánh hiệu suất giữa slice và clone
   - Thực hành nhiều với các ví dụ thực tế