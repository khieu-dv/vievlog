# BÀI 10: OWNERSHIP TRONG THỰC TIỄN

## GIỚI THIỆU BÀI HỌC (5 phút)

**Chào mừng các bạn đến với bài giảng thứ 10 trong chuỗi bài giảng về Rust!**

Trong các bài học trước, chúng ta đã tìm hiểu về lý thuyết ownership - một trong những tính năng cốt lõi và độc đáo nhất của Rust. Hôm nay, chúng ta sẽ đi sâu vào cách áp dụng chúng trong thực tiễn lập trình.

**Mục tiêu bài học:**
- Hiểu sâu hơn về ownership, borrowing và lifetime
- Nắm được các design pattern phổ biến liên quan đến ownership
- Biết khi nào nên sử dụng Clone và Copy
- Học cách tối ưu hóa code thông qua quản lý ownership
- Áp dụng kiến thức vào một dự án thực tế

## PHẦN 1: RECAP VỀ OWNERSHIP, BORROWING, LIFETIME (10 phút)

### 1.1 Tổng quan về Ownership

Ownership là cách Rust quản lý bộ nhớ mà không cần garbage collector hay việc manual allocation/deallocation. Các nguyên tắc cơ bản:

- **Mỗi giá trị trong Rust có một biến được gọi là owner**
- **Tại một thời điểm, chỉ có thể có một owner**
- **Khi owner ra khỏi scope, giá trị sẽ bị drop**

```rust
fn main() {
    {
        let s = String::from("hello"); // s là owner của chuỗi
        // s có thể sử dụng ở đây
    } // scope kết thúc, s bị drop, bộ nhớ được giải phóng
}
```

### 1.2 Borrowing và References

Borrowing cho phép sử dụng giá trị mà không lấy quyền sở hữu:

- **Immutable references** (`&T`): Có thể có nhiều references cùng lúc, chỉ đọc
- **Mutable references** (`&mut T`): Chỉ có thể có một reference tại một thời điểm, có thể thay đổi giá trị

Quy tắc: Tại một thời điểm, bạn có thể có:
- Một mutable reference
- HOẶC nhiều immutable references
- Không được có cả hai loại cùng lúc

```rust
fn main() {
    let mut s = String::from("hello");
    
    // Immutable borrowing
    let r1 = &s; // OK
    let r2 = &s; // OK - nhiều immutable references được phép
    println!("{} and {}", r1, r2);
    
    // Mutable borrowing
    let r3 = &mut s; // OK - r1, r2 không còn được sử dụng sau điểm này
    r3.push_str(", world");
    println!("{}", r3);
}
```

### 1.3 Lifetime

Lifetime là cách Rust đảm bảo references luôn hợp lệ:

- Đảm bảo references không trỏ đến dữ liệu đã bị giải phóng
- Thường được xác định ngầm bởi compiler
- Đôi khi cần chỉ định rõ bằng annotations (`'a`)

```rust
// Lifetime annotation rõ ràng
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
```

## PHẦN 2: CÁC DESIGN PATTERN LIÊN QUAN ĐẾN OWNERSHIP (15 phút)

### 2.1 Passing Ownership

Khi cần chuyển quyền sở hữu:

```rust
fn process_and_consume(data: String) {
    // Hàm này lấy ownership của data
    println!("Processing: {}", data);
    // data tự động được giải phóng khi hàm kết thúc
}

fn main() {
    let s = String::from("hello");
    process_and_consume(s);
    // s không còn hợp lệ ở đây
}
```

### 2.2 Borrowing với References

Khi chỉ cần truy cập tạm thời:

```rust
fn analyze(data: &String) {
    // Hàm này mượn data, không lấy ownership
    println!("Analyzing: {}", data);
}

fn main() {
    let s = String::from("hello");
    analyze(&s);
    // s vẫn hợp lệ và có thể sử dụng ở đây
    println!("Original: {}", s);
}
```

### 2.3 Taking and Returning Ownership

Khi cần thay đổi và trả lại:

```rust
fn transform(mut data: String) -> String {
    data.push_str(" world");
    data  // Trả lại ownership
}

fn main() {
    let s1 = String::from("hello");
    let s2 = transform(s1);
    // s1 không còn hợp lệ, s2 là owner mới
    println!("Transformed: {}", s2);
}
```

### 2.4 RAII (Resource Acquisition Is Initialization)

Sử dụng structs để quản lý tài nguyên:

```rust
struct ResourceManager {
    resource: String,
}

impl ResourceManager {
    fn new(resource: String) -> ResourceManager {
        println!("Resource acquired: {}", resource);
        ResourceManager { resource }
    }
}

impl Drop for ResourceManager {
    fn drop(&mut self) {
        println!("Resource released: {}", self.resource);
    }
}

fn main() {
    {
        let manager = ResourceManager::new(String::from("database connection"));
        // Sử dụng resource ở đây
    } // `manager` bị drop, resource tự động được giải phóng
}
```

## PHẦN 3: KHI NÀO SỬ DỤNG CLONE, COPY (10 phút)

### 3.1 Trait Copy

**Copy** dành cho các kiểu dữ liệu đơn giản có kích thước cố định và lưu trên stack:

- Các kiểu nguyên thủy (i32, f64, bool, char...)
- Tuples chỉ chứa các kiểu Copy (`(i32, bool)`)
- Arrays với kích thước cố định chỉ chứa kiểu Copy

```rust
fn main() {
    let x = 5;
    let y = x;  // x được copy sang y, cả hai đều hợp lệ
    
    println!("x: {}, y: {}", x, y);
}
```

### 3.2 Trait Clone

**Clone** dành cho các kiểu phức tạp lưu trên heap, tạo bản sao sâu (deep copy):

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();  // Tạo bản sao sâu của s1
    
    println!("s1: {}, s2: {}", s1, s2);
}
```

### 3.3 Khi nào nên sử dụng Clone

**Nên sử dụng Clone khi:**
- Cần giữ dữ liệu gốc và làm việc trên bản sao
- Không thể sử dụng borrowing vì lý do lifetime
- Cần truyền ownership nhưng vẫn muốn giữ dữ liệu gốc

**Không nên lạm dụng Clone khi:**
- Dữ liệu lớn, tốn nhiều bộ nhớ và CPU để sao chép
- Có thể sử dụng borrowing đơn giản
- Trong vòng lặp hoặc thao tác diễn ra nhiều lần

### 3.4 Hiệu suất và Trade-offs

```rust
// Inefficient - Uses clone
fn process_inefficient(data: &String) -> String {
    let mut cloned = data.clone();
    cloned.push_str(" processed");
    cloned
}

// Efficient - Uses references where possible
fn process_efficient(data: &str) -> String {
    let mut result = String::from(data);
    result.push_str(" processed");
    result
}
```

## PHẦN 4: OPTIMIZATION VỚI OWNERSHIP (15 phút)

### 4.1 Sử dụng &str thay vì &String

```rust
// Không tối ưu
fn process_string(s: &String) {
    println!("Processing: {}", s);
}

// Tối ưu hơn - linh hoạt hơn
fn process_str(s: &str) {
    println!("Processing: {}", s);
}

fn main() {
    let s = String::from("hello");
    
    // Cả hai đều hoạt động
    process_string(&s);
    process_str(&s);
    
    // Chỉ process_str hoạt động với string literal
    let literal = "hello";
    process_str(literal);
    // process_string(&literal); // Lỗi!
}
```

### 4.2 Tránh sao chép không cần thiết

```rust
// Không tối ưu
fn get_first_word_inefficient(s: &String) -> String {
    let bytes = s.as_bytes();
    
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return s[0..i].to_string(); // Tạo String mới không cần thiết
        }
    }
    
    s.clone() // Clone toàn bộ String
}

// Tối ưu hơn
fn get_first_word(s: &str) -> &str {
    let bytes = s.as_bytes();
    
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i]; // Chỉ trả về slice, không copy
        }
    }
    
    s // Trả về cả chuỗi nếu không có khoảng trắng
}
```

### 4.3 Sử dụng Cow (Clone on Write)

```rust
use std::borrow::Cow;

fn capitalize(s: &str) -> Cow<str> {
    if s.chars().next().map_or(false, |c| c.is_uppercase()) {
        // Đã viết hoa, không cần clone
        Cow::Borrowed(s)
    } else {
        // Cần viết hoa, phải clone
        let mut owned = String::with_capacity(s.len());
        let mut chars = s.chars();
        
        if let Some(first) = chars.next() {
            owned.push(first.to_uppercase().next().unwrap());
            owned.extend(chars);
        }
        
        Cow::Owned(owned)
    }
}
```

### 4.4 Sử dụng String Builder Pattern

```rust
fn build_greeting(name: &str, title: &str) -> String {
    let mut result = String::with_capacity(20 + name.len() + title.len());
    result.push_str("Dear ");
    result.push_str(title);
    result.push_str(" ");
    result.push_str(name);
    result.push_str(", welcome!");
    result
}
```

## PHẦN 5: REFACTOR CODE ĐỂ TỐI ƯU OWNERSHIP (15 phút)

### 5.1 Phân tích code chưa tối ưu

```rust
// Code ban đầu - chưa tối ưu
fn process_data(data: String) -> String {
    let first_part = data.clone(); // Clone không cần thiết
    
    let modified = String::from("Modified: ") + &first_part;
    
    let result = modified.clone(); // Clone không cần thiết
    result
}
```

### 5.2 Refactor step-by-step

```rust
// Bước 1: Loại bỏ clone không cần thiết
fn process_data_step1(data: String) -> String {
    let first_part = &data; // Dùng reference thay vì clone
    
    let modified = String::from("Modified: ") + first_part;
    
    modified // Không cần clone, trả về ownership
}

// Bước 2: Sử dụng &str thay vì String khi có thể
fn process_data_step2(data: &str) -> String {
    let modified = String::from("Modified: ") + data;
    modified
}

// Bước 3: Tối ưu bộ nhớ với String::with_capacity
fn process_data_final(data: &str) -> String {
    let mut modified = String::with_capacity(10 + data.len());
    modified.push_str("Modified: ");
    modified.push_str(data);
    modified
}
```

### 5.3 So sánh hiệu suất

```rust
fn benchmark() {
    let test_string = String::from("This is a test string for benchmarking");
    
    // Đo thời gian cho từng phiên bản
    let start = std::time::Instant::now();
    for _ in 0..100000 {
        let _ = process_data(test_string.clone());
    }
    println!("Original version: {:?}", start.elapsed());
    
    let start = std::time::Instant::now();
    for _ in 0..100000 {
        let _ = process_data_final(&test_string);
    }
    println!("Optimized version: {:?}", start.elapsed());
}
```

## PHẦN 6: DỰ ÁN THỰC HÀNH - ỨNG DỤNG QUẢN LÝ VĂN BẢN (20 phút)

### 6.1 Thiết kế ứng dụng

**Yêu cầu**:
- Tạo, đọc, cập nhật văn bản
- Tìm kiếm từ khóa trong văn bản
- Thống kê từ, câu, đoạn
- Áp dụng các nguyên tắc ownership đã học

### 6.2 Thiết kế cấu trúc dữ liệu

```rust
struct TextDocument {
    title: String,
    content: String,
    created_at: std::time::SystemTime,
    modified_at: std::time::SystemTime,
}

impl TextDocument {
    fn new(title: &str, content: &str) -> Self {
        let now = std::time::SystemTime::now();
        TextDocument {
            title: String::from(title),
            content: String::from(content),
            created_at: now,
            modified_at: now,
        }
    }
    
    fn update_content(&mut self, new_content: &str) {
        self.content = String::from(new_content);
        self.modified_at = std::time::SystemTime::now();
    }
    
    fn search(&self, keyword: &str) -> Vec<usize> {
        self.content
            .match_indices(keyword)
            .map(|(index, _)| index)
            .collect()
    }
    
    fn word_count(&self) -> usize {
        self.content.split_whitespace().count()
    }
    
    fn sentence_count(&self) -> usize {
        self.content
            .split(|c| c == '.' || c == '!' || c == '?')
            .filter(|s| !s.trim().is_empty())
            .count()
    }
    
    fn summary(&self, max_length: usize) -> &str {
        if self.content.len() <= max_length {
            &self.content
        } else {
            let boundary = self.content[..max_length]
                .rfind(|c| c == ' ' || c == '\n')
                .unwrap_or(max_length);
            &self.content[..boundary]
        }
    }
}
```

### 6.3 Document Manager

```rust
struct DocumentManager {
    documents: Vec<TextDocument>,
}

impl DocumentManager {
    fn new() -> Self {
        DocumentManager {
            documents: Vec::new(),
        }
    }
    
    fn add_document(&mut self, title: &str, content: &str) -> usize {
        let doc = TextDocument::new(title, content);
        self.documents.push(doc);
        self.documents.len() - 1
    }
    
    fn get_document(&self, index: usize) -> Option<&TextDocument> {
        self.documents.get(index)
    }
    
    fn get_document_mut(&mut self, index: usize) -> Option<&mut TextDocument> {
        self.documents.get_mut(index)
    }
    
    fn search_all(&self, keyword: &str) -> Vec<(usize, Vec<usize>)> {
        self.documents
            .iter()
            .enumerate()
            .filter_map(|(doc_idx, doc)| {
                let matches = doc.search(keyword);
                if matches.is_empty() {
                    None
                } else {
                    Some((doc_idx, matches))
                }
            })
            .collect()
    }
}
```

### 6.4 Client Code

```rust
fn main() {
    let mut manager = DocumentManager::new();
    
    // Thêm tài liệu
    let doc1_idx = manager.add_document(
        "Rust Ownership",
        "Rust's ownership system is unique and powerful. It ensures memory safety without garbage collection."
    );
    
    let doc2_idx = manager.add_document(
        "Programming Languages",
        "There are many programming languages. Each has its strengths and weaknesses. Rust focuses on safety and performance."
    );
    
    // Đọc tài liệu
    if let Some(doc) = manager.get_document(doc1_idx) {
        println!("Title: {}", doc.title);
        println!("Summary: {}", doc.summary(20));
        println!("Word count: {}", doc.word_count());
    }
    
    // Cập nhật tài liệu
    if let Some(doc) = manager.get_document_mut(doc1_idx) {
        doc.update_content("Rust's ownership system guarantees memory safety without a garbage collector. It uses RAII principles.");
    }
    
    // Tìm kiếm
    let results = manager.search_all("Rust");
    for (doc_idx, positions) in results {
        if let Some(doc) = manager.get_document(doc_idx) {
            println!("Found 'Rust' in document '{}' at positions: {:?}", doc.title, positions);
        }
    }
}
```

## TỔNG KẾT VÀ BÀI TẬP THÊM (5 phút)

### Tổng kết

- Ownership là cơ chế độc đáo của Rust để quản lý bộ nhớ an toàn và hiệu quả
- Borrowing cho phép truy cập dữ liệu mà không cần chuyển ownership
- Clone/Copy nên được sử dụng có chọn lọc, tránh lãng phí tài nguyên
- Tối ưu hóa code bằng cách sử dụng references, slices và các pattern phù hợp

### Bài tập thêm

1. Mở rộng TextDocument để hỗ trợ phiên bản lịch sử (version history)
2. Thêm chức năng xuất văn bản sang nhiều định dạng (TXT, Markdown)
3. Tối ưu hóa tìm kiếm sử dụng chỉ mục (index)
4. Implement chức năng merge tài liệu mà không tạo bản sao không cần thiết

## TÀI LIỆU THAM KHẢO

1. [Rust Book - Chapter on Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
2. [Rust by Example - Ownership and Borrowing](https://doc.rust-lang.org/rust-by-example/scope/ownership.html)
3. [Rust Performance Book](https://nnethercote.github.io/perf-book/)
4. [Common Rust Lifetime Misconceptions](https://github.com/pretzelhammer/rust-blog/blob/master/posts/common-rust-lifetime-misconceptions.md)