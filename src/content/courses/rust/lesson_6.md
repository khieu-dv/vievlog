# Bài 6: Ownership - Khái niệm cốt lõi trong Rust

## 🎯 Mục tiêu bài học

- Hiểu rõ khái niệm ownership và vai trò của nó trong Rust
- Phân biệt được Stack và Heap trong quản lý bộ nhớ
- Nắm vững 3 nguyên tắc ownership cơ bản
- Hiểu sự khác biệt giữa di chuyển (move) và sao chép (copy)
- Phát hiện và giải quyết các lỗi phổ biến liên quan đến ownership

## 📝 Nội dung chi tiết

### 1. Giới thiệu về Ownership

Ownership là một trong những đặc điểm quan trọng nhất của Rust, giúp đảm bảo an toàn bộ nhớ mà không cần garbage collector.

#### 1.1. Vấn đề Rust giải quyết

- **Quản lý bộ nhớ thủ công** (như C/C++): Dễ gây ra lỗi memory leak, dangling pointer
- **Garbage collector** (như Java, Python): Tiêu tốn tài nguyên, không dự đoán được thời điểm giải phóng bộ nhớ
- **Rust với ownership**: Giải phóng bộ nhớ tự động nhưng có thể dự đoán được, không ảnh hưởng hiệu suất

#### 1.2. Định nghĩa ownership

Ownership là một tập hợp các quy tắc xác định cách Rust quản lý bộ nhớ:
- Mỗi giá trị trong Rust đều có một biến được gọi là owner (chủ sở hữu)
- Tại một thời điểm chỉ có thể có một owner
- Khi owner ra khỏi phạm vi (scope), giá trị sẽ bị hủy

### 2. Stack vs Heap

#### 2.1. Stack

- **Đặc điểm**: Nhanh, dữ liệu có kích thước cố định và biết trước lúc biên dịch
- **Hoạt động**: LIFO (Last In First Out) - dữ liệu được thêm/xóa từ "đỉnh" stack
- **Kiểu dữ liệu trên Stack**: Các kiểu có kích thước cố định như integer, float, boolean, char, tuple/array có kích thước cố định

```rust
fn example() {
    let x = 5; // x được lưu trên stack
    let y = true; // y cũng được lưu trên stack
    let z = 'c'; // z cũng vậy
} // Khi ra khỏi hàm, x, y, z tự động bị hủy
```

#### 2.2. Heap

- **Đặc điểm**: Chậm hơn Stack, dữ liệu có kích thước không xác định tại thời điểm biên dịch
- **Hoạt động**: Yêu cầu bộ nhớ → OS tìm không gian trống → trả về con trỏ
- **Kiểu dữ liệu trên Heap**: String, Vec, Box, các kiểu dynamic khác

```rust
fn example() {
    let s = String::from("hello"); // s trỏ đến dữ liệu trên heap
} // Khi ra khỏi hàm, s bị hủy và bộ nhớ heap được giải phóng
```

#### 2.3. So sánh trực quan

```
Stack                  |  Heap
---------------------- | -----------------------
[x: 5]                 | [address: 0x001]
[y: true]              | ["hello"]
[s: ptr to 0x001]      |
```

### 3. Ba nguyên tắc ownership trong Rust

#### 3.1. Mỗi giá trị trong Rust có một biến được gọi là owner

```rust
let s = String::from("hello"); // s là owner của string "hello"
```

#### 3.2. Tại một thời điểm chỉ có thể có một owner

```rust
let s1 = String::from("hello");
let s2 = s1; // s1 không còn hợp lệ, ownership chuyển sang s2
// println!("{}", s1); // Lỗi: s1 đã bị move
```

#### 3.3. Khi owner ra khỏi phạm vi, giá trị sẽ bị hủy

```rust
{
    let s = String::from("hello"); // s hợp lệ từ đây
    // làm việc với s
} // phạm vi kết thúc, s không còn hợp lệ và bộ nhớ được giải phóng
```

### 4. Di chuyển (Move) và Sao chép (Copy)

#### 4.1. Di chuyển (Move)

- Áp dụng cho dữ liệu được lưu trên heap
- Chỉ di chuyển con trỏ, không sao chép dữ liệu
- Biến cũ không còn sử dụng được

```rust
let s1 = String::from("hello");
let s2 = s1; // s1 bị vô hiệu hóa, ownership đã di chuyển sang s2
```

Minh họa bộ nhớ:
```
Trước:                 |  Sau:
---------------------- | -----------------------
s1: ptr -> heap ["hello"] | s1: không hợp lệ
                       | s2: ptr -> heap ["hello"]
```

#### 4.2. Sao chép (Copy)

- Áp dụng cho dữ liệu được lưu trên stack
- Sao chép toàn bộ dữ liệu
- Cả hai biến đều có thể sử dụng

```rust
let x = 5;
let y = x; // x vẫn hợp lệ, y là một bản sao riêng biệt
println!("x = {}, y = {}", x, y); // Không lỗi
```

#### 4.3. Trait Copy

Các kiểu dữ liệu implement trait Copy:
- Kiểu số nguyên (i32, u32, ...)
- Kiểu boolean (bool)
- Kiểu ký tự (char)
- Kiểu số thực (f32, f64)
- Tuple chứa các kiểu Copy (ví dụ: (i32, bool))
- Array có kích thước cố định chứa các kiểu Copy

### 5. Clone - Sao chép sâu (Deep Copy)

Khi muốn sao chép dữ liệu trên heap, sử dụng phương thức clone():

```rust
let s1 = String::from("hello");
let s2 = s1.clone(); // Sao chép dữ liệu trên heap

println!("s1 = {}, s2 = {}", s1, s2); // Cả hai đều hợp lệ
```

### 6. Ownership và Functions

#### 6.1. Chuyển ownership vào function

```rust
fn main() {
    let s = String::from("hello");
    takes_ownership(s); // s bị di chuyển vào function và không còn hợp lệ
    // println!("{}", s); // Lỗi: s đã bị move

    let x = 5;
    makes_copy(x); // x được copy, vẫn hợp lệ sau khi gọi hàm
    println!("{}", x); // Không lỗi
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
} // some_string ra khỏi phạm vi và bị drop

fn makes_copy(some_integer: i32) {
    println!("{}", some_integer);
} // some_integer ra khỏi phạm vi, không có gì đặc biệt xảy ra
```

#### 6.2. Trả về ownership từ function

```rust
fn main() {
    let s1 = gives_ownership(); // gives_ownership chuyển giá trị trả về cho s1
    
    let s2 = String::from("hello"); // s2 đi vào phạm vi
    
    let s3 = takes_and_gives_back(s2); // s2 bị di chuyển vào hàm và giá trị trả về được gán cho s3
    // println!("{}", s2); // Lỗi: s2 đã bị move
}

fn gives_ownership() -> String {
    let some_string = String::from("hello"); // some_string đi vào phạm vi
    some_string // trả về some_string, chuyển ownership cho caller
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string // trả về a_string, chuyển ownership cho caller
}
```

### 7. References và Borrowing

Xem bài tiếp theo để biết thêm chi tiết về cách mượn giá trị thay vì nhận ownership.

## 🏆 Bài tập thực hành kèm lời giải chi tiết

### Bài tập 1: Xác định kiểu di chuyển hay sao chép

**Yêu cầu**: Chỉ ra những dòng code nào tạo ra move và những dòng nào tạo ra copy.

```rust
fn main() {
    // Câu 1
    let a = 10;
    let b = a;
    
    // Câu 2
    let s1 = String::from("rust");
    let s2 = s1;
    
    // Câu 3
    let t1 = (1, 2);
    let t2 = t1;
    
    // Câu 4
    let v1 = vec![1, 2, 3];
    let v2 = v1;
    
    // Câu 5
    let arr1 = [1, 2, 3];
    let arr2 = arr1;
}
```

**Lời giải**:

```rust
fn main() {
    // Câu 1: COPY - i32 là kiểu Copy
    let a = 10;
    let b = a;
    println!("a = {}, b = {}", a, b); // Hợp lệ, a vẫn sử dụng được
    
    // Câu 2: MOVE - String không phải kiểu Copy
    let s1 = String::from("rust");
    let s2 = s1;
    // println!("s1 = {}", s1); // Lỗi: s1 đã bị move
    println!("s2 = {}", s2); // Hợp lệ
    
    // Câu 3: COPY - Tuple chứa các kiểu i32 là Copy
    let t1 = (1, 2);
    let t2 = t1;
    println!("t1 = {:?}, t2 = {:?}", t1, t2); // Hợp lệ
    
    // Câu 4: MOVE - Vec không phải kiểu Copy
    let v1 = vec![1, 2, 3];
    let v2 = v1;
    // println!("v1 = {:?}", v1); // Lỗi: v1 đã bị move
    println!("v2 = {:?}", v2); // Hợp lệ
    
    // Câu 5: COPY - Array có kích thước cố định chứa i32 là Copy
    let arr1 = [1, 2, 3];
    let arr2 = arr1;
    println!("arr1 = {:?}, arr2 = {:?}", arr1, arr2); // Hợp lệ
}
```

### Bài tập 2: Sửa lỗi liên quan đến ownership

**Yêu cầu**: Sửa các lỗi ownership trong đoạn code dưới đây để chương trình chạy được.

```rust
fn main() {
    // Đoạn code 1
    let s = String::from("hello");
    print_string(s);
    print_string(s); // Lỗi: s đã bị move
    
    // Đoạn code 2
    let numbers = vec![1, 2, 3];
    let first = get_first(numbers);
    let sum = sum_all(numbers); // Lỗi: numbers đã bị move
    println!("First: {}, Sum: {}", first, sum);
}

fn print_string(s: String) {
    println!("{}", s);
}

fn get_first(v: Vec<i32>) -> i32 {
    v[0]
}

fn sum_all(v: Vec<i32>) -> i32 {
    let mut sum = 0;
    for num in v {
        sum += num;
    }
    sum
}
```

**Lời giải**:

Phương pháp 1: Sử dụng references

```rust
fn main() {
    // Đoạn code 1 - Sửa bằng references
    let s = String::from("hello");
    print_string(&s); // Truyền reference thay vì ownership
    print_string(&s); // Giờ có thể gọi lại với cùng một reference
    
    // Đoạn code 2 - Sửa bằng references
    let numbers = vec![1, 2, 3];
    let first = get_first(&numbers); // Truyền reference
    let sum = sum_all(&numbers); // Truyền reference
    println!("First: {}, Sum: {}", first, sum);
}

fn print_string(s: &String) { // Nhận reference thay vì ownership
    println!("{}", s);
}

fn get_first(v: &Vec<i32>) -> i32 { // Nhận reference
    v[0]
}

fn sum_all(v: &Vec<i32>) -> i32 { // Nhận reference
    let mut sum = 0;
    for num in v {
        sum += num;
    }
    sum
}
```

Phương pháp 2: Sử dụng clone()

```rust
fn main() {
    // Đoạn code 1 - Sửa bằng clone
    let s = String::from("hello");
    print_string(s.clone()); // Clone s để giữ bản gốc
    print_string(s); // Giờ có thể sử dụng s
    
    // Đoạn code 2 - Sửa bằng clone
    let numbers = vec![1, 2, 3];
    let first = get_first(numbers.clone()); // Clone numbers
    let sum = sum_all(numbers); // Sử dụng bản gốc
    println!("First: {}, Sum: {}", first, sum);
}

// Các hàm giữ nguyên như ban đầu
fn print_string(s: String) {
    println!("{}", s);
}

fn get_first(v: Vec<i32>) -> i32 {
    v[0]
}

fn sum_all(v: Vec<i32>) -> i32 {
    let mut sum = 0;
    for num in v {
        sum += num;
    }
    sum
}
```

Phương pháp 3: Trả về ownership

```rust
fn main() {
    // Đoạn code 1 - Sửa bằng trả về ownership
    let mut s = String::from("hello");
    s = print_string_and_return(s); // Nhận lại ownership
    s = print_string_and_return(s); // Sử dụng lại
    
    // Đoạn code 2 - Sửa bằng trả về ownership
    let numbers = vec![1, 2, 3];
    let (first, numbers) = get_first_and_return(numbers); // Nhận giá trị và ownership
    let sum = sum_all(numbers); // Sử dụng numbers
    println!("First: {}, Sum: {}", first, sum);
}

fn print_string_and_return(s: String) -> String {
    println!("{}", s);
    s // Trả về ownership
}

fn get_first_and_return(v: Vec<i32>) -> (i32, Vec<i32>) {
    let first = v[0];
    (first, v) // Trả về cả giá trị lấy được và vector gốc
}

fn sum_all(v: Vec<i32>) -> i32 {
    let mut sum = 0;
    for num in v {
        sum += num;
    }
    sum
}
```

### Bài tập 3: Phân tích ownership trong code thực tế

**Yêu cầu**: Phân tích quá trình ownership trong đoạn code sau, chỉ ra các điểm ownership thay đổi và giải thích tại sao.

```rust
fn main() {
    let input = String::from("hello world");
    
    let first_word = get_first_word(&input);
    
    let mut words = Vec::new();
    for word in input.split_whitespace() {
        words.push(String::from(word));
    }
    
    let sorted_words = sort_words(words);
    
    println!("Input: {}", input);
    println!("First word: {}", first_word);
    println!("Sorted words: {:?}", sorted_words);
}

fn get_first_word(s: &String) -> &str {
    match s.split_whitespace().next() {
        Some(word) => word,
        None => ""
    }
}

fn sort_words(mut words: Vec<String>) -> Vec<String> {
    words.sort();
    words
}
```

**Lời giải**:

Phân tích ownership:

1. `let input = String::from("hello world")`:
   - `input` trở thành owner của String trên heap

2. `let first_word = get_first_word(&input)`:
   - `&input` tạo một reference đến `input` (không move)
   - `get_first_word` nhận reference và trả về một slice (&str) của `input`
   - `first_word` mượn một phần của `input` thông qua slice

3. `for word in input.split_whitespace()`:
   - `input.split_whitespace()` tạo một iterator mà không chuyển ownership của `input`
   - `word` là các slice (&str) từ `input`

4. `words.push(String::from(word))`:
   - `String::from(word)` tạo một String mới trên heap từ slice `word`
   - `words.push()` nhận ownership của String mới tạo

5. `let sorted_words = sort_words(words)`:
   - `words` bị move vào `sort_words`
   - `words` không còn hợp lệ sau lời gọi này
   - `sort_words` nhận ownership của Vec, sắp xếp nó, và trả ownership cho `sorted_words`

6. `println!("Input: {}", input)`:
   - `input` vẫn hợp lệ vì chưa bị move

7. `println!("First word: {}", first_word)`:
   - `first_word` vẫn hợp lệ vì là một reference đến `input`

8. `println!("Sorted words: {:?}", sorted_words)`:
   - `sorted_words` hợp lệ vì đã nhận ownership từ hàm `sort_words`

Chi tiết thay đổi ownership:
- `words` bị move vào `sort_words`
- Mỗi String được tạo từ `String::from(word)` bị move vào Vec `words`

## 🔑 Những điểm quan trọng cần lưu ý

1. **Ownership là đặc trưng của Rust**: Không có ngôn ngữ phổ biến nào khác sử dụng ownership system như Rust.

2. **Không có garbage collector**: Rust quản lý bộ nhớ tại thời điểm biên dịch, không có overhead khi chạy.

3. **Quy tắc Move vs Copy**:
   - Kiểu dữ liệu trên Stack (i32, char, bool, ...) = Copy
   - Kiểu dữ liệu trên Heap (String, Vec, Box, ...) = Move

4. **Mô hình Mental về Ownership**:
   - Khi gán một giá trị từ biến này sang biến khác, hãy luôn tự hỏi: đây là kiểu Copy hay Move?
   - Với kiểu Move, biến ban đầu sẽ không còn sử dụng được

5. **Hiểu rõ scope**:
   - Bộ nhớ được giải phóng khi biến ra khỏi scope
   - Đây là cách Rust đảm bảo không có memory leaks

6. **Lỗi phổ biến**:
   - Sử dụng biến sau khi đã move
   - Nhầm lẫn giữa kiểu Copy và Move
   - Quên về ownership khi làm việc với functions

7. **Ownership và hiệu suất**:
   - Rust không ẩn bản sao (copies) đắt đỏ
   - Khi cần sao chép dữ liệu trên heap, phải gọi rõ ràng `.clone()`

8. **Để xử lý ownership**:
   - Trả về giá trị từ function
   - Sử dụng references/borrowing (xem bài tiếp theo)
   - Sử dụng Clone khi cần sao chép dữ liệu

## 📝 Bài tập về nhà

1. **Tạo trò chơi đoán số**: Viết một chương trình nhỏ yêu cầu người dùng đoán một số từ 1-100 và phân tích các ownership patterns trong code của bạn.

2. **Fix lỗi ownership**: Sửa các lỗi ownership trong đoạn code sau:
```rust
fn main() {
    let name = String::from("Rust");
    let greeting = create_greeting(name);
    println!("Original name: {}", name); // Lỗi: name đã bị move
    println!("Greeting: {}", greeting);
    
    let mut values = vec![1, 2, 3, 4, 5];
    let first_three = get_first_three(values);
    values.push(6); // Lỗi: values đã bị move
    
    println!("Original values: {:?}", values);
    println!("First three: {:?}", first_three);
}

fn create_greeting(name: String) -> String {
    format!("Hello, {}!", name)
}

fn get_first_three(values: Vec<i32>) -> Vec<i32> {
    values.iter().take(3).cloned().collect()
}
```

3. **Cài đặt cấu trúc dữ liệu Stack**: Viết một cấu trúc dữ liệu Stack đơn giản trong Rust, phân tích các quyết định về ownership trong thiết kế của bạn.

4. **Trò chơi quản lý nhà hàng**: Tạo một chương trình mô phỏng quản lý nhà hàng với các món ăn (struct Food), đơn hàng (struct Order). Chương trình phải xử lý được việc:
   - Tạo món ăn mới
   - Thêm món vào đơn hàng
   - Hoàn thành đơn hàng
   - Hiển thị danh sách đơn hàng

5. **Bài tập nghiên cứu**: Tìm hiểu về trait Drop trong Rust và viết một ví dụ minh họa cách nó liên quan đến ownership.

**Tài liệu tham khảo:**
- [The Rust Book - Chapter 4: Understanding Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
- [Rust By Example - Ownership](https://doc.rust-lang.org/rust-by-example/scope/move.html)
- [Rustonomicon - Ownership](https://doc.rust-lang.org/nomicon/ownership.html)