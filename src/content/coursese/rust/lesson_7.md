# Bài 7: Borrowing và References trong Rust


## 🎯 Mục tiêu bài học

- Hiểu được khái niệm references và borrowing trong Rust
- Phân biệt được immutable references và mutable references
- Nắm vững các quy tắc borrowing của Rust
- Nhận biết và tránh dangling references
- Áp dụng được các kiến thức về borrowing vào thực tế lập trình

## 📝 Nội dung chi tiết

### 1. References và Borrowing: Khái niệm cơ bản

**References là gì?**
- References trong Rust là một cách để truy cập dữ liệu mà không cần sở hữu nó
- Sử dụng ký hiệu `&` để tạo reference đến một giá trị
- Giúp chúng ta có thể sử dụng giá trị mà không chuyển quyền sở hữu (ownership)

**Borrowing là gì?**
- Borrowing là hành động tạo một reference đến dữ liệu
- Khi bạn tạo reference, bạn đang "mượn" giá trị đó
- Có hai loại: immutable borrowing và mutable borrowing

**Ví dụ minh họa:**

```rust
fn main() {
    let s1 = String::from("xin chào");
    
    // Chúng ta "mượn" s1 qua reference
    let len = calculate_length(&s1);
    
    println!("Độ dài của '{}' là {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

### 2. Immutable References vs Mutable References

**Immutable References (&T)**
- Cho phép đọc dữ liệu nhưng không thay đổi
- Có thể có nhiều immutable references cùng một lúc
- Sử dụng cú pháp: `&T`

**Mutable References (&mut T)**
- Cho phép đọc và thay đổi dữ liệu
- Chỉ có thể có duy nhất một mutable reference tại một thời điểm
- Sử dụng cú pháp: `&mut T`

**Ví dụ về immutable references:**

```rust
fn main() {
    let s = String::from("xin chào");
    
    let r1 = &s; // immutable reference 1
    let r2 = &s; // immutable reference 2
    
    println!("{} và {}", r1, r2);
    // Hợp lệ vì có thể có nhiều immutable references
}
```

**Ví dụ về mutable references:**

```rust
fn main() {
    let mut s = String::from("xin chào");
    
    let r = &mut s; // mutable reference
    
    r.push_str(", thế giới");
    
    println!("{}", r); // xin chào, thế giới
}
```

### 3. Quy tắc Borrowing

**Quy tắc 1: Tại một thời điểm, bạn có thể có:**
- Nhiều immutable references (vô số &T)
- HOẶC chính xác một mutable reference (&mut T)

**Quy tắc 2:** References phải luôn hợp lệ - không được tồn tại reference đến dữ liệu đã bị hủy

**Ví dụ vi phạm quy tắc:**

```rust
fn main() {
    let mut s = String::from("xin chào");
    
    let r1 = &s;      // immutable reference
    let r2 = &s;      // immutable reference
    let r3 = &mut s;  // LỖI: không thể có mutable reference
                      // khi đã tồn tại immutable references
    
    println!("{}, {}, và {}", r1, r2, r3);
}
```

**Phạm vi của references:**

```rust
fn main() {
    let mut s = String::from("xin chào");
    
    {
        let r1 = &s; // immutable reference
        println!("{}", r1);
    } // r1 không còn tồn tại tại đây
    
    // Bây giờ có thể tạo mutable reference
    let r2 = &mut s;
    r2.push_str(", thế giới");
}
```

### 4. Dangling References và cách Rust ngăn chặn

**Dangling References là gì?**
- Dangling reference là reference tới dữ liệu đã bị giải phóng
- Có thể gây ra lỗi nghiêm trọng trong các ngôn ngữ khác
- Rust ngăn chặn lỗi này tại thời điểm biên dịch

**Cách Rust ngăn chặn:**
- Compiler theo dõi phạm vi (scope) của dữ liệu
- Đảm bảo dữ liệu không bị giải phóng khi references đến nó vẫn còn tồn tại

**Ví dụ về dangling reference bị ngăn chặn:**

```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String { // LỖI: trả về reference tới biến cục bộ
    let s = String::from("xin chào");
    &s // s sẽ bị giải phóng khi hàm kết thúc!
}
```

**Cách sửa lỗi dangling reference:**

```rust
fn main() {
    let string_from_function = no_dangle();
}

fn no_dangle() -> String {
    let s = String::from("xin chào");
    s // Trả về giá trị thay vì reference, ownership được chuyển
}
```

### 5. Slice - Một dạng đặc biệt của reference

**String slices:**
- Slice là reference đến một phần của String
- Cú pháp: `&str`

```rust
fn main() {
    let s = String::from("xin chào thế giới");
    
    let xin_chao = &s[0..8];  // slice từ byte 0 đến byte 8
    let the_gioi = &s[9..];   // slice từ byte 9 đến cuối
    
    println!("{} - {}", xin_chao, the_gioi);
}
```

## 🏆 Bài tập thực hành kèm lời giải chi tiết

### Bài tập 1: Sửa lỗi borrowing

**Đề bài:**
```rust
fn main() {
    let mut s = String::from("xin chào");
    
    let r1 = &s;
    let r2 = &mut s;
    
    println!("{} và {}", r1, r2);
}
```

**Lỗi:**
Chương trình trên vi phạm quy tắc borrowing vì có cả immutable reference và mutable reference cùng tồn tại.

**Lời giải:**
```rust
fn main() {
    let mut s = String::from("xin chào");
    
    // Phương án 1: Sử dụng immutable references trước,
    // rồi mới dùng mutable reference sau khi immutable references hết phạm vi
    {
        let r1 = &s;
        println!("r1: {}", r1);
    } // r1 hết phạm vi
    
    let r2 = &mut s;
    r2.push_str(", thế giới");
    println!("r2: {}", r2);
    
    // Phương án 2: Chỉ sử dụng immutable references
    let mut s2 = String::from("xin chào");
    let r1 = &s2;
    let r2 = &s2;
    println!("{} và {}", r1, r2);
}
```

### Bài tập 2: Viết hàm thay đổi chuỗi

**Đề bài:** Viết một hàm `add_suffix` nhận vào một mutable reference đến String và thêm hậu tố ", Rust!" vào chuỗi đó.

**Lời giải:**
```rust
fn main() {
    let mut greeting = String::from("Xin chào");
    
    // Gọi hàm với mutable reference
    add_suffix(&mut greeting);
    
    println!("{}", greeting); // In ra: "Xin chào, Rust!"
}

fn add_suffix(s: &mut String) {
    s.push_str(", Rust!");
}
```

**Giải thích:**
- Hàm `add_suffix` nhận vào một mutable reference (`&mut String`)
- Chúng ta có thể thay đổi nội dung của String thông qua reference này
- Ownership vẫn thuộc về biến `greeting` trong `main`

### Bài tập 3: Tìm từ dài nhất

**Đề bài:** Viết một hàm nhận vào một reference đến String và trả về từ dài nhất trong chuỗi đó.

**Lời giải:**
```rust
fn main() {
    let text = String::from("Rust là một ngôn ngữ lập trình tuyệt vời");
    
    let longest = find_longest_word(&text);
    
    println!("Từ dài nhất là: {}", longest);
}

fn find_longest_word(s: &String) -> &str {
    let words = s.split_whitespace();
    let mut longest = "";
    
    for word in words {
        if word.len() > longest.len() {
            longest = word;
        }
    }
    
    longest
}
```

**Giải thích:**
- Hàm `find_longest_word` nhận reference đến String và trả về một string slice (`&str`)
- Không cần mutable reference vì chỉ đọc dữ liệu
- Trả về string slice là reference đến một phần của String ban đầu
- Lifetime của slice sẽ gắn với lifetime của String ban đầu

## 🔑 Những điểm quan trọng cần lưu ý

1. **Quy tắc borrowing là nền tảng của mô hình bộ nhớ Rust**
   - Một trong những tính năng an toàn quan trọng nhất của Rust
   - Ngăn ngừa data races và race conditions tại thời điểm biên dịch

2. **References giúp tái sử dụng dữ liệu mà không chuyển ownership**
   - Giảm nhu cầu clone dữ liệu, tăng hiệu suất
   - Cho phép nhiều phần của chương trình truy cập dữ liệu một cách an toàn

3. **Quy tắc "một mutable XOR nhiều immutable" rất quan trọng**
   - Cần nhớ: tại một thời điểm chỉ được phép có HOẶC một mutable reference HOẶC nhiều immutable references
   - Trong Rust 2018+, phạm vi của reference được tính từ khi tạo đến lần sử dụng cuối cùng (không phải đến cuối block)

4. **Rust không cho phép null pointers**
   - References luôn hợp lệ, không có khái niệm "null reference" như các ngôn ngữ khác
   - Sử dụng Option<&T> khi cần biểu diễn reference có thể không tồn tại

5. **Borrowing thường được kết hợp với lifetimes**
   - Ở bài sau, chúng ta sẽ học về lifetimes để kiểm soát thời gian tồn tại của references
   - Compiler đảm bảo references không bao giờ sống lâu hơn dữ liệu chúng tham chiếu đến

## 📝 Bài tập về nhà

### Bài 1: Cải thiện chương trình tính trung bình
Viết một hàm nhận vào vector số nguyên và trả về trung bình cộng. Sử dụng borrowing thay vì chuyển ownership của vector.

```rust
// Bạn cần hoàn thiện hàm này:
fn calculate_average(numbers: &Vec<i32>) -> f64 {
    // Code của bạn
}

fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    let avg = calculate_average(&numbers);
    println!("Trung bình cộng: {}", avg);
    // Vẫn có thể sử dụng numbers sau khi gọi hàm
    println!("Vector ban đầu: {:?}", numbers);
}
```

### Bài 2: Xây dựng chương trình quản lý sách đơn giản
Tạo một chương trình cho phép thêm sách, cập nhật tiêu đề, và hiển thị thông tin sách. Sử dụng references và borrowing một cách phù hợp.

```rust
struct Book {
    title: String,
    author: String,
    year: u32,
}

// Viết các hàm xử lý Book sử dụng references
fn display_book(book: &Book) {
    // Code của bạn
}

fn update_title(book: &mut Book, new_title: &str) {
    // Code của bạn
}

fn main() {
    // Code của bạn
}
```

### Bài 3: Debug lỗi borrowing
Tìm và sửa lỗi trong đoạn code sau:

```rust
fn main() {
    let mut message = String::from("Học Rust ");
    
    let first = &message[0..4];
    message.push_str("rất thú vị!");
    
    println!("Phần đầu: {}", first);
    println!("Toàn bộ: {}", message);
}
```

### Bài 4: Viết hàm tìm chuỗi
Viết một hàm tìm kiếm nhận vào một reference đến mảng chuỗi và một chuỗi cần tìm, trả về chỉ số của chuỗi đó trong mảng (nếu có). Sử dụng references một cách phù hợp.

```rust
fn find_string(array: &[&str], target: &str) -> Option<usize> {
    // Code của bạn
}

fn main() {
    let words = ["rust", "java", "python", "javascript"];
    
    match find_string(&words, "python") {
        Some(index) => println!("Tìm thấy tại vị trí: {}", index),
        None => println!("Không tìm thấy"),
    }
}
```
