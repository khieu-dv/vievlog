# Bài 14: Collections - Strings trong Rust

## 1. Giới thiệu

Xin chào các bạn! Trong bài học hôm nay, chúng ta sẽ đi sâu vào một trong những kiểu dữ liệu quan trọng nhất trong lập trình - chuỗi ký tự (strings). Rust có cách tiếp cận độc đáo đối với chuỗi so với các ngôn ngữ khác, đặc biệt là trong việc xử lý Unicode và hiệu suất. Hiểu rõ cách Rust xử lý chuỗi sẽ giúp bạn viết code hiệu quả và tránh được nhiều lỗi phổ biến.

### Mục tiêu bài học:
- Hiểu sự khác biệt giữa `String` và `&str`
- Nắm vững cách Rust xử lý UTF-8 và Unicode
- Thành thạo các phương thức xử lý chuỗi trong Rust
- Học cách nối chuỗi và định dạng chuỗi hiệu quả
- Tối ưu hiệu suất khi làm việc với chuỗi

## 2. String vs &str

### 2.1. Hai kiểu chuỗi cơ bản

Rust có hai kiểu chuỗi chính: `String` và `&str`. Sự khác biệt giữa chúng liên quan đến quyền sở hữu, bộ nhớ và khả năng thay đổi.

#### String
- Kiểu dữ liệu được sở hữu (owned type)
- Được cấp phát trên heap
- Có thể thay đổi (mutable)
- Tương tự như `Vec<u8>` nhưng đảm bảo là UTF-8 hợp lệ
- Được sử dụng khi cần điều chỉnh nội dung chuỗi

```rust
// Khởi tạo String
let mut s1 = String::new(); // Chuỗi rỗng
let s2 = String::from("Xin chào"); // Từ literal
let s3 = "Rust".to_string(); // Phương thức to_string()

// Thay đổi String
s1.push_str("Học Rust!"); // s1 bây giờ là "Học Rust!"
```

#### &str (String slice)
- Kiểu tham chiếu (reference)
- Trỏ đến một chuỗi UTF-8 hợp lệ ở đâu đó trong bộ nhớ
- Không thể thay đổi (immutable)
- Hiệu quả vì không yêu cầu cấp phát bộ nhớ mới
- Được sử dụng khi chỉ cần đọc dữ liệu

```rust
// String literals là &str
let greeting: &str = "Xin chào Việt Nam";

// Tạo string slice từ String
let s = String::from("Học lập trình Rust");
let slice: &str = &s[0..3]; // slice = "Học"
```

### 2.2. Khi nào sử dụng String và khi nào sử dụng &str

```rust
// Sử dụng &str trong tham số hàm để linh hoạt
fn print_greeting(message: &str) {
    println!("{}", message);
}

// Có thể truyền cả String và &str
let s1: String = String::from("Xin chào");
let s2: &str = "Xin chào";

print_greeting(&s1); // &String được chuyển thành &str tự động
print_greeting(s2);
```

**Nguyên tắc chung:**
- Sử dụng `&str` cho tham số hàm khi chỉ cần đọc chuỗi
- Sử dụng `String` khi cần sở hữu và thay đổi chuỗi
- Sử dụng `&str` cho chuỗi cố định trong chương trình (literals)

## 3. UTF-8 và Unicode trong Rust

### 3.1. Rust và UTF-8

Rust hỗ trợ UTF-8 một cách native. Điều này có nghĩa là:
- Tất cả `String` và `&str` đều là UTF-8 hợp lệ
- Rust đảm bảo tính toàn vẹn của UTF-8 - không thể tạo chuỗi không hợp lệ
- Các ký tự Unicode có thể chiếm 1-4 byte

### 3.2. Thách thức khi làm việc với Unicode

Unicode mang đến một số thách thức khi xử lý chuỗi:

```rust
let vi_text = "Tiếng Việt";
println!("Độ dài: {}", vi_text.len()); // Không phải số ký tự mà là số byte!

// Lấy ký tự thứ 2 - KHÔNG hoạt động như mong đợi với các ký tự đa byte
// let second_char = vi_text[1]; // Lỗi! Rust không cho phép truy cập trực tiếp

// Cách đúng để duyệt qua các codepoint Unicode
for c in vi_text.chars() {
    println!("{}", c);
}

// Đếm số lượng ký tự (graphemes)
println!("Số ký tự: {}", vi_text.chars().count());
```

### 3.3. Các đơn vị trong chuỗi Unicode

Rust cung cấp nhiều cách để làm việc với các đơn vị khác nhau trong chuỗi Unicode:

- **Bytes**: Dữ liệu UTF-8 thô
  ```rust
  for b in "Xin chào".bytes() {
      println!("{}", b);
  }
  ```

- **Scalar values** (chars): Các code point Unicode
  ```rust
  for c in "Xin chào".chars() {
      println!("{}", c);
  }
  ```

- **Grapheme clusters**: Các ký tự hiển thị (cần thư viện ngoài như `unicode-segmentation`)
  ```rust
  use unicode_segmentation::UnicodeSegmentation;
  
  for g in "Xin chào".graphemes(true) {
      println!("{}", g);
  }
  ```

## 4. Các phương thức xử lý chuỗi

### 4.1. Phương thức khởi tạo và chuyển đổi

```rust
// Khởi tạo String
let mut s = String::new();
let s = String::with_capacity(20); // Dự phòng dung lượng để tối ưu hiệu suất

// Chuyển đổi giữa các kiểu
let s = "hello".to_string(); // &str -> String
let s = String::from("hello"); // &str -> String
let s_slice: &str = &s; // String -> &str
```

### 4.2. Phương thức thêm và chỉnh sửa

```rust
let mut s = String::from("Xin ");

// Thêm vào cuối
s.push('c'); // Thêm một ký tự
s.push_str("hào"); // Thêm một chuỗi

// Chèn ở giữa
// Rust không có phương thức insert built-in tối ưu
// Thường phải chuyển đổi thành bytes, sửa đổi và chuyển lại

// Xóa
s.clear(); // Xóa toàn bộ, giữ lại capacity
s.truncate(3); // Giữ lại 3 byte đầu tiên
```

### 4.3. Phương thức tìm kiếm và trích xuất

```rust
let text = "Rust là ngôn ngữ lập trình tuyệt vời";

// Tìm kiếm
if text.contains("Rust") {
    println!("Tìm thấy 'Rust'");
}

// Kiểm tra tiền tố/hậu tố
if text.starts_with("Rust") {
    println!("Bắt đầu bằng 'Rust'");
}

if text.ends_with("vời") {
    println!("Kết thúc bằng 'vời'");
}

// Vị trí của từ
if let Some(pos) = text.find("ngôn ngữ") {
    println!("'ngôn ngữ' bắt đầu tại vị trí {}", pos);
}

// Trích xuất substring
let sub = &text[5..12]; // "là ngôn"
// Cẩn thận: phải cắt tại ranh giới ký tự UTF-8 hợp lệ!
```

### 4.4. Phương thức biến đổi

```rust
let text = "  Rust Programming  ";

// Loại bỏ khoảng trắng
let trimmed = text.trim(); // "Rust Programming"
let trim_start = text.trim_start(); // "Rust Programming  "
let trim_end = text.trim_end(); // "  Rust Programming"

// Thay thế
let replaced = text.replace("Rust", "Golang"); // "  Golang Programming  "

// Chuyển đổi case (cần feature Unicode)
// text.to_lowercase(); 
// text.to_uppercase();
```

## 5. String concatenation và formatting

### 5.1. Cách nối chuỗi

Rust cung cấp nhiều cách để nối chuỗi:

#### Sử dụng toán tử `+`

```rust
let s1 = String::from("Xin ");
let s2 = String::from("chào");
let s3 = s1 + &s2; // Lưu ý: s1 đã bị move, không thể sử dụng nữa
```

#### Sử dụng phương thức `push_str`

```rust
let mut s1 = String::from("Xin ");
let s2 = String::from("chào");
s1.push_str(&s2); // s1 = "Xin chào", s2 vẫn có thể sử dụng
```

#### Sử dụng macro `format!`

```rust
let s1 = String::from("Xin");
let s2 = String::from("chào");
let s3 = String::from("bạn");
let result = format!("{} {} {}", s1, s2, s3); // "Xin chào bạn"
// s1, s2, s3 vẫn có thể sử dụng
```

### 5.2. Định dạng chuỗi với format!

`format!` là một macro mạnh mẽ để định dạng chuỗi:

```rust
// Định dạng cơ bản
let name = "Rust";
let version = 2018;
let formatted = format!("{} phiên bản {}", name, version);

// Định dạng với vị trí
let formatted = format!("{1} phiên bản {0}", version, name);

// Định dạng với tên
let formatted = format!("{language} phiên bản {year}", 
                        language = name, year = version);

// Định dạng số
let pi = 3.14159;
let formatted = format!("PI = {:.2}", pi); // PI = 3.14

// Căn lề
let formatted = format!("{:>10}", "right"); // "     right"
let formatted = format!("{:<10}", "left");  // "left     "
let formatted = format!("{:^10}", "center"); // "  center  "

// Định dạng với các loại khác
let num = 42;
let formatted = format!("Binary: {:b}, Hex: {:x}, Octal: {:o}", num, num, num);
```

### 5.3. Hiệu suất của các phương pháp nối chuỗi

```rust
// Kém hiệu quả: tạo nhiều String tạm thời
let result = String::from("a") + &String::from("b") + &String::from("c");

// Hiệu quả hơn: sử dụng format!
let result = format!("{}{}{}", "a", "b", "c");

// Hiệu quả nhất khi biết trước kích thước
let mut result = String::with_capacity(3);
result.push_str("a");
result.push_str("b");
result.push_str("c");
```

## 6. Hiệu suất khi làm việc với chuỗi

### 6.1. Tối ưu bộ nhớ

```rust
// Cấp phát capacity trước để tránh tái cấp phát
let mut s = String::with_capacity(1000);

// Kiểm tra capacity hiện tại
println!("Capacity: {}", s.capacity());

// Đảm bảo đủ capacity
s.reserve(2000); // Thêm 2000 bytes nữa

// Thu nhỏ capacity để phù hợp với nội dung
s.shrink_to_fit();
```

### 6.2. Tránh tạo chuỗi tạm không cần thiết

```rust
// Kém hiệu quả
let mut result = String::new();
for i in 0..100 {
    result = result + &i.to_string(); // Tạo nhiều chuỗi tạm
}

// Hiệu quả hơn
let mut result = String::with_capacity(100 * 2); // Ước tính kích thước
for i in 0..100 {
    result.push_str(&i.to_string());
}

// Hoặc sử dụng collect
let result: String = (0..100).map(|i| i.to_string()).collect();
```

### 6.3. Sử dụng string slice khi có thể

```rust
// Hàm nhận tham chiếu &str thay vì String
fn process(s: &str) -> usize {
    s.len()
}

let owned = String::from("hello");
let len = process(&owned); // Không cần clone, chỉ truyền tham chiếu

// Đối với các APIs đòi hỏi String, chỉ clone khi cần
let input = "hello";
let owned = input.to_string(); // Clone chỉ khi cần String
```

## 7. Hoạt động thực hành

### 7.1. Ứng dụng phân tích văn bản

Bây giờ chúng ta sẽ xây dựng một ứng dụng nhỏ để phân tích văn bản, áp dụng các kiến thức về String trong Rust.

```rust
fn main() {
    let text = "Rust là một ngôn ngữ lập trình hệ thống được phát triển bởi Mozilla.
Rust được thiết kế để an toàn về bộ nhớ và có hiệu suất cao.
Rust giúp lập trình viên viết phần mềm đáng tin cậy và hiệu quả.";

    // Phân tích văn bản
    let text_analyzer = TextAnalyzer::new(text);
    
    println!("Thống kê văn bản:");
    println!("------------------");
    println!("Số từ: {}", text_analyzer.word_count());
    println!("Số câu: {}", text_analyzer.sentence_count());
    println!("Số ký tự (không bao gồm khoảng trắng): {}", text_analyzer.char_count(false));
    println!("Số ký tự (bao gồm khoảng trắng): {}", text_analyzer.char_count(true));
    
    println!("\nTop 5 từ xuất hiện nhiều nhất:");
    for (word, count) in text_analyzer.most_common_words(5) {
        println!("- '{}': {} lần", word, count);
    }
    
    println!("\nĐộ dài trung bình của từ: {:.2} ký tự", text_analyzer.average_word_length());
}

struct TextAnalyzer<'a> {
    text: &'a str,
}

impl<'a> TextAnalyzer<'a> {
    fn new(text: &'a str) -> Self {
        TextAnalyzer { text }
    }
    
    fn word_count(&self) -> usize {
        self.text.split_whitespace().count()
    }
    
    fn sentence_count(&self) -> usize {
        self.text.split(['.', '!', '?']).filter(|s| !s.trim().is_empty()).count()
    }
    
    fn char_count(&self, include_whitespace: bool) -> usize {
        if include_whitespace {
            self.text.chars().count()
        } else {
            self.text.chars().filter(|c| !c.is_whitespace()).count()
        }
    }
    
    fn average_word_length(&self) -> f64 {
        let words: Vec<&str> = self.text.split_whitespace().collect();
        if words.is_empty() {
            return 0.0;
        }
        
        let total_chars: usize = words.iter()
            .map(|word| word.chars().count())
            .sum();
            
        total_chars as f64 / words.len() as f64
    }
    
    fn most_common_words(&self, limit: usize) -> Vec<(&str, usize)> {
        use std::collections::HashMap;
        
        // Chuẩn hóa và đếm từ
        let mut word_counts = HashMap::new();
        
        for word in self.text.split_whitespace() {
            // Loại bỏ dấu câu và chuyển về chữ thường
            let clean_word = word.trim_matches(|c: char| !c.is_alphanumeric())
                                 .to_lowercase();
            
            if !clean_word.is_empty() {
                *word_counts.entry(clean_word).or_insert(0) += 1;
            }
        }
        
        // Chuyển sang vector để sắp xếp
        let mut word_count_vec: Vec<(String, usize)> = word_counts.into_iter()
            .map(|(word, count)| (word, count))
            .collect();
        
        // Sắp xếp theo số lần xuất hiện (giảm dần)
        word_count_vec.sort_by(|a, b| b.1.cmp(&a.1));
        
        // Lấy top N từ
        word_count_vec.iter()
            .take(limit)
            .map(|(word, count)| (word.as_str(), *count))
            .collect()
    }
}
```

### 7.2. Demo xử lý chuỗi Unicode phức tạp

```rust
use unicode_segmentation::UnicodeSegmentation;

fn main() {
    // Ví dụ với một chuỗi Unicode phức tạp
    let complex_text = "Xin chào thế giới! 你好世界! नमस्ते दुनिया! مرحبا بالعالم! 👋🌍";
    
    println!("Demo xử lý chuỗi Unicode phức tạp trong Rust:");
    println!("---------------------------------------------");
    
    // Hiển thị độ dài theo các đơn vị khác nhau
    println!("1. Độ dài theo bytes: {}", complex_text.len());
    println!("2. Độ dài theo Unicode scalar values: {}", complex_text.chars().count());
    println!("3. Độ dài theo grapheme clusters: {}", complex_text.graphemes(true).count());
    
    // Hiển thị từng đơn vị
    println!("\nBytes:");
    for (i, b) in complex_text.bytes().enumerate() {
        print!("{:02X} ", b);
        if (i + 1) % 8 == 0 {
            println!();
        }
    }
    
    println!("\n\nUnicode scalar values (chars):");
    for (i, c) in complex_text.chars().enumerate() {
        println!("{}: '{}' (U+{:04X})", i, c, c as u32);
    }
    
    println!("\nGrapheme clusters:");
    for (i, g) in complex_text.graphemes(true).enumerate() {
        println!("{}: '{}' ({} chars, {} bytes)", 
                i, g, g.chars().count(), g.len());
    }
    
    // Demo tìm kiếm và cắt chuỗi Unicode
    demo_unicode_search(complex_text);
    
    // Demo chuyển đổi giữa các hệ thống mã hóa
    demo_encoding_conversion();
}

fn demo_unicode_search(text: &str) {
    println!("\nTìm kiếm và cắt chuỗi Unicode:");
    println!("------------------------------");
    
    // Tìm ký tự đầu tiên của mỗi ngôn ngữ
    if let Some(pos) = text.find('你') {
        println!("Tiếng Trung bắt đầu tại vị trí byte: {}", pos);
        println!("Đoạn tiếng Trung: {}", &text[pos..pos+9]);
    }
    
    if let Some(pos) = text.find('न') {
        println!("Tiếng Hindi bắt đầu tại vị trí byte: {}", pos);
        println!("Đoạn tiếng Hindi: {}", &text[pos..pos+13]);
    }
    
    // Tìm emoji
    if let Some(pos) = text.find('👋') {
        println!("Emoji bắt đầu tại vị trí byte: {}", pos);
        println!("Các emoji: {}", &text[pos..]);
    }
    
    // Cắt chuỗi an toàn sử dụng grapheme
    println!("\nCắt chuỗi an toàn theo grapheme:");
    let graphemes: Vec<&str> = text.graphemes(true).collect();
    if graphemes.len() > 5 {
        let safe_substring: String = graphemes[0..5].join("");
        println!("5 grapheme đầu tiên: {}", safe_substring);
    }
}

fn demo_encoding_conversion() {
    // Trong ứng dụng thực tế, bạn sẽ cần thư viện như encoding_rs
    println!("\nMô phỏng chuyển đổi mã hóa:");
    println!("---------------------------");
    
    let utf8_string = "Xin chào";
    
    // Chuyển đổi sang bytes
    let bytes = utf8_string.as_bytes();
    println!("UTF-8 bytes: {:?}", bytes);
    
    // Trong thực tế, bạn sẽ dùng thư viện để chuyển đổi sang các encoding khác
    println!("Để chuyển đổi giữa các encoding khác nhau như UTF-16, Latin1, etc.");
    println!("bạn cần sử dụng các thư viện như 'encoding_rs'");
}
```

## 8. Tóm tắt và những điểm chính cần nhớ

1. **String vs &str**
   - `String`: Kiểu dữ liệu được sở hữu, có thể thay đổi
   - `&str`: Kiểu tham chiếu, không thể thay đổi
   - Sử dụng `&str` cho tham số hàm khi có thể

2. **UTF-8 và Unicode**
   - Rust sử dụng UTF-8 mặc định cho tất cả các chuỗi
   - Cần chú ý khi làm việc với ký tự không phải ASCII
   - Sử dụng `.chars()` hoặc thư viện `unicode-segmentation` khi xử lý Unicode

3. **Các phương thức hữu ích**
   - `.push_str()`, `.push()` để thêm nội dung
   - `.contains()`, `.find()` để tìm kiếm
   - `.trim()`, `.replace()` để biến đổi chuỗi

4. **Nối chuỗi và định dạng**
   - Toán tử `+` và phương thức `push_str()` để nối
   - `format!` để định dạng và nối chuỗi một cách linh hoạt
   - `format!` không làm thay đổi tính sở hữu của các tham số

5. **Hiệu suất**
   - Sử dụng `String::with_capacity()` khi biết trước kích thước
   - Tránh tạo nhiều chuỗi tạm thời
   - Ưu tiên sử dụng `&str` khi có thể

## 9. Bài tập về nhà

1. Viết một hàm đếm số từ trong một văn bản, không tính các từ có độ dài nhỏ hơn 3.
2. Viết một chương trình đảo ngược từng từ trong câu, nhưng giữ nguyên thứ tự các từ.
3. Tạo một hàm kiểm tra tính hợp lệ của một địa chỉ email đơn giản.
4. Mở rộng ứng dụng phân tích văn bản để tính toán độ phức tạp của văn bản (dựa trên độ dài câu và từ).

## 10. Tài liệu tham khảo

1. [Rust Book - Chapter on Strings](https://doc.rust-lang.org/book/ch08-02-strings.html)
2. [Rust Standard Library - String Documentation](https://doc.rust-lang.org/std/string/struct.String.html)
3. [Rust by Example - Strings](https://doc.rust-lang.org/rust-by-example/std/str.html)
4. [The `unicode-segmentation` crate](https://crates.io/crates/unicode-segmentation)
5. [Rust Cookbook - Text Processing](https://rust-lang-nursery.github.io/rust-cookbook/text/string_parsing.html)

Chúc các bạn học tập hiệu quả và thành công với Rust!