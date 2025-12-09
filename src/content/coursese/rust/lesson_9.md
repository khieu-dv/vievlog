# BÀI 9: LIFETIME TRONG RUST

## TỔNG QUAN BÀI GIẢNG
- **Thời lượng**: 30-40 phút
- **Đối tượng học viên**: Lập trình viên đã có kiến thức cơ bản về Rust
- **Yêu cầu kiến thức**: Đã hiểu về kiểu dữ liệu, borrowing, ownership trong Rust

## MỤC TIÊU BÀI GIẢNG
Sau bài học này, học viên sẽ:
- Hiểu rõ khái niệm lifetime trong Rust và tại sao nó quan trọng
- Biết cách sử dụng annotation lifetime
- Nắm được lifetime elision rules
- Hiểu về static lifetime và các trường hợp ứng dụng
- Có khả năng debug các lỗi lifetime phổ biến

## GIỚI THIỆU (3-5 phút)
- Chào mừng học viên đến với Bài 9 của khóa học Rust
- Tóm tắt nhanh bài học trước về structs/traits/enums
- Giới thiệu về thách thức của quản lý bộ nhớ: Khi nào giải phóng references?
- Nhấn mạnh: Lifetime là một trong những khái niệm khó nhưng quan trọng nhất trong Rust

## PHẦN 1: KHÁI NIỆM LIFETIME (7-8 phút)
### Định nghĩa và vai trò
- Lifetime là "thời gian sống" của một reference
- Compiler sử dụng lifetime để đảm bảo references luôn hợp lệ
- So sánh với các ngôn ngữ khác: C++ (dangling pointers), Java/C# (garbage collection)

### Vấn đề cần giải quyết
- Demo đơn giản về dangling reference:
```rust
fn main() {
    let r;
    {
        let x = 5;
        r = &x; // `x` không tồn tại đủ lâu!
    }
    println!("r: {}", r); // Lỗi: borrowed value does not live long enough
}
```
- Giải thích sự khác biệt giữa scope và lifetime

### Cách Rust giải quyết vấn đề
- Borrow checker
- Lifetime annotations
- Minh họa bằng hình ảnh (có thể vẽ timeline để biểu diễn lifetime)

## PHẦN 2: ANNOTATION LIFETIME (8-10 phút)
### Cú pháp cơ bản
- Ký hiệu: `'a`, `'b`, `'c`, v.v.
- Lifetime trong functions:
```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

### Lifetime trong structs
```rust
struct BookExcerpt<'a> {
    content: &'a str,
}
```

### Lifetime trong impl blocks
```rust
impl<'a> BookExcerpt<'a> {
    fn get_first_line(&self) -> &str {
        self.content.lines().next().unwrap_or("")
    }
}
```

### Multiple lifetime parameters
```rust
fn complex_function<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    // Function body
    x
}
```

## PHẦN 3: LIFETIME ELISION RULES (7-8 phút)
### Rule 1: Input lifetimes
- Mỗi parameter là reference được gán một lifetime parameter riêng biệt
```rust
fn foo(x: &i32)                  // thực tế là: fn foo<'a>(x: &'a i32)
fn foo(x: &i32, y: &i32)         // thực tế là: fn foo<'a, 'b>(x: &'a i32, y: &'b i32)
```

### Rule 2: Output lifetimes từ self
- Nếu có một input parameter là `&self` hoặc `&mut self`, lifetime của self được gán cho tất cả output parameters
```rust
impl<'a> BookExcerpt<'a> {
    fn get_content(&self) -> &str {  // thực tế là: -> &'a str
        self.content
    }
}
```

### Rule 3: Output lifetimes từ input parameters 
- Nếu chỉ có một input lifetime parameter, lifetime đó được gán cho tất cả output parameters
```rust
fn first_word(s: &str) -> &str {  // thực tế là: fn first_word<'a>(s: &'a str) -> &'a str
    // Function body
}
```

### Trường hợp cần chỉ định rõ
- Demo các trường hợp không thể áp dụng elision rules
```rust
fn longest(x: &str, y: &str) -> &str {  // Lỗi: cần chỉ định rõ lifetime
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

## PHẦN 4: STATIC LIFETIME (5-6 phút)
### Định nghĩa
- `'static` là lifetime tồn tại trong suốt chương trình
- String literals có static lifetime
```rust
let s: &'static str = "Hello, world!";
```

### Khi nào sử dụng
- Đối với constants và statics
- Khi nào KHÔNG nên sử dụng `'static` (lạm dụng)
- Lỗi phổ biến: "Thêm `'static` để fix lỗi compiler"

## PHẦN 5: DEBUG LỖI LIFETIME PHỔ BIẾN (8-10 phút)
### Các lỗi thường gặp
1. **Borrowed value does not live long enough**
   ```rust
   fn main() {
       let string1 = String::from("long string is long");
       let result;
       {
           let string2 = String::from("xyz");
           result = longest(string1.as_str(), string2.as_str());
       }
       println!("The longest string is {}", result); // Lỗi!
   }
   ```

2. **Missing lifetime specifier**
   ```rust
   struct User {
       name: &str, // Lỗi: thiếu lifetime annotation
   }
   ```

3. **Lifetime mismatch**
   ```rust
   fn invalid_mix<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
       let result = y; // Lỗi: không thể return y vì nó có lifetime 'b
       result
   }
   ```

### Cách tiếp cận và sửa lỗi
- Đọc hiểu thông báo lỗi từ compiler
- Sử dụng `--explain` với rustc
- Vẽ sơ đồ visualize lifetime
- Demo một use case thực tế và debug từng bước

## TỔNG KẾT (3-4 phút)
- Nhắc lại các điểm chính về lifetime
- Liên hệ với ownership và borrowing
- Khuyến khích thực hành
- Giới thiệu nội dung bài học tiếp theo

## BÀI TẬP VỀ NHÀ
1. Viết một function nhận vào hai string slices và trả về string slice có chữ cái đầu tiên
2. Tạo một struct `Document` chứa references đến các phần của một văn bản
3. Fix một đoạn code có lỗi lifetime (cung cấp code mẫu)

## TÀI LIỆU THAM KHẢO
- [The Rust Programming Language Book - Chapter 10.3](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html)
- [Rust By Example - Lifetimes](https://doc.rust-lang.org/rust-by-example/scope/lifetime.html)
- [Rust Nomicon - Lifetimes](https://doc.rust-lang.org/nomicon/lifetimes.html)

## MẪU CODE DEMO
Dưới đây là các đoạn code đầy đủ để demo trong bài giảng:

### Demo 1: Longest string function
```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";
    
    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}
```

### Demo 2: Struct với lifetime
```rust
struct BookExcerpt<'a> {
    content: &'a str,
}

impl<'a> BookExcerpt<'a> {
    fn get_first_sentence(&self) -> &str {
        match self.content.find('.') {
            Some(idx) => &self.content[..=idx],
            None => self.content,
        }
    }
    
    fn contains(&self, pattern: &str) -> bool {
        self.content.contains(pattern)
    }
}

fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let excerpt = BookExcerpt {
        content: &novel[..],
    };
    
    let first = excerpt.get_first_sentence();
    println!("First sentence: {}", first);
}
```

### Demo 3: Multiple lifetime parameters
```rust
fn first_char_of_either<'a, 'b>(x: &'a str, _y: &'b str) -> &'a str {
    &x[0..1]
}

fn main() {
    let string1 = String::from("hello");
    let string2 = String::from("world");
    
    let result = first_char_of_either(string1.as_str(), string2.as_str());
    println!("First character: {}", result);
}
```

### Demo 4: Debugging a lifetime error
```rust
// Code có lỗi
fn main() {
    let result;
    {
        let s = String::from("hello");
        result = &s;
    } // s goes out of scope here
    println!("{}", result); // Error: `s` does not live long enough
}

// Code sửa lỗi
fn main() {
    let s = String::from("hello");
    let result = &s;
    println!("{}", result); // OK
}
```

### Demo 5: Static lifetime
```rust
fn main() {
    let s: &'static str = "I have a static lifetime.";
    
    // Tạo String từ static str
    let dynamic_string = String::from(s);
    
    // Reference đến dynamic_string không phải 'static
    let dynamic_ref: &str = &dynamic_string;
    
    println!("Static string: {}", s);
    println!("Dynamic reference: {}", dynamic_ref);
}
```