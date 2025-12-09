# BÀI 13: COLLECTIONS - VECTORS TRONG RUST

## 1. Giới thiệu về Collections và Vec&lt;T&gt;

Trong lập trình, chúng ta thường xuyên cần làm việc với tập hợp các giá trị. Rust cung cấp nhiều cấu trúc collections khác nhau để đáp ứng các nhu cầu khác nhau. Trong bài học hôm nay, chúng ta sẽ tập trung vào cấu trúc phổ biến nhất: **Vector**.

### Vec&lt;T&gt; là gì?

Vector, hay `Vec&lt;T&gt;`, là một collection có thể thay đổi kích thước, lưu trữ các phần tử cùng kiểu dữ liệu và được cấp phát trên heap. Đặc điểm quan trọng nhất của vector:

- Có thể tăng giảm kích thước linh hoạt
- Lưu trữ dữ liệu liên tiếp trong bộ nhớ
- Tất cả phần tử phải cùng kiểu dữ liệu
- Chỉ mục bắt đầu từ 0

### Khai báo và khởi tạo Vector

```rust
// Tạo vector rỗng
let mut v1: Vec<i32> = Vec::new();

// Sử dụng macro vec! để khởi tạo có giá trị
let v2 = vec![1, 2, 3, 4, 5];

// Tạo vector với capacity ban đầu
let mut v3: Vec<String> = Vec::with_capacity(10);

// Khởi tạo vector với giá trị mặc định
let v4 = vec![0; 10]; // Vector có 10 phần tử, mỗi phần tử có giá trị 0
```

## 2. Các phương thức cơ bản với Vector

### Thêm phần tử (Push)

```rust
fn main() {
    let mut v = Vec::new();
    
    // Thêm phần tử vào cuối vector
    v.push(1);
    v.push(2);
    v.push(3);
    
    println!("Vector sau khi thêm: {:?}", v); // Output: [1, 2, 3]
}
```

### Lấy và xóa phần tử cuối (Pop)

```rust
fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    
    // Lấy và xóa phần tử cuối cùng
    let last = v.pop(); // Option&lt;T&gt;
    
    println!("Phần tử vừa xóa: {:?}", last); // Output: Some(5)
    println!("Vector sau khi xóa: {:?}", v);  // Output: [1, 2, 3, 4]
}
```

### Truy cập phần tử

Có hai cách chính để truy cập phần tử của vector:

#### 1. Sử dụng chỉ mục (indexing)

```rust
fn main() {
    let v = vec![10, 20, 30, 40, 50];
    
    // Sử dụng chỉ mục (panic nếu chỉ mục không hợp lệ)
    let third = &v[2];
    println!("Phần tử thứ 3: {}", third); // Output: 30
    
    // Lưu ý: dòng sau sẽ gây crash chương trình
    // let does_not_exist = &v[100]; // panic!
}
```

#### 2. Sử dụng phương thức get() (an toàn hơn)

```rust
fn main() {
    let v = vec![10, 20, 30, 40, 50];
    
    // Sử dụng get() trả về Option<&T>
    match v.get(2) {
        Some(third) => println!("Phần tử thứ 3: {}", third),
        None => println!("Không tìm thấy phần tử!"),
    }
    
    // Truy cập phần tử không tồn tại
    match v.get(100) {
        Some(value) => println!("Giá trị: {}", value),
        None => println!("Chỉ mục không hợp lệ!"),
    }
}
```

### Các phương thức hữu ích khác

```rust
fn main() {
    let mut v = vec![1, 2, 3];
    
    // Lấy độ dài
    println!("Độ dài: {}", v.len()); // Output: 3
    
    // Kiểm tra vector có rỗng không
    println!("Vector rỗng? {}", v.is_empty()); // Output: false
    
    // Xóa tất cả phần tử
    v.clear();
    println!("Vector sau clear: {:?}", v); // Output: []
    
    // Chèn phần tử vào vị trí chỉ định
    v.push(10);
    v.push(20);
    v.insert(1, 15);
    println!("Sau khi insert: {:?}", v); // Output: [10, 15, 20]
    
    // Xóa phần tử ở vị trí chỉ định
    v.remove(0);
    println!("Sau khi remove: {:?}", v); // Output: [15, 20]
    
    // Thay đổi kích thước vector
    v.resize(5, 0);
    println!("Sau khi resize: {:?}", v); // Output: [15, 20, 0, 0, 0]
}
```

## 3. Ownership và Borrowing với Vectors

Vectors tuân theo các quy tắc ownership tiêu chuẩn của Rust. Điều này đặc biệt quan trọng khi làm việc với vectors vì chúng thường được sử dụng trong nhiều tình huống khác nhau.

### Mượn và tham chiếu

```rust
fn main() {
    let mut v = vec![1, 2, 3, 4, 5];
    
    // Tham chiếu bất biến (immutable borrow)
    let first = &v[0];
    
    // Lỗi: không thể mượn v dưới dạng khả biến vì nó đã được mượn dưới dạng bất biến
    // v.push(6); // Error!
    
    println!("Phần tử đầu tiên là: {}", first);
    
    // Sau khi in first, tham chiếu hết hạn, ta có thể mượn v dưới dạng khả biến
    v.push(6);
    println!("Vector sau khi thêm: {:?}", v);
}
```

### Cẩn trọng với invalidation

```rust
fn main() {
    let mut v = vec![1, 2, 3];
    
    // Lấy tham chiếu đến phần tử đầu tiên
    let first = &v[0];
    
    // v.push(4); // Error! Có thể làm vector phải cấp phát lại bộ nhớ,
    // khiến cho tham chiếu first trở nên không hợp lệ
    
    println!("Phần tử đầu tiên: {}", first);
    
    // Sau khi dùng xong first, ta có thể thay đổi vector
    v.push(4);
    println!("Vector sau khi thêm: {:?}", v);
}
```

## 4. Duyệt qua Vector (Iterating)

Rust cung cấp nhiều cách để duyệt qua vector:

### Sử dụng vòng lặp for

```rust
fn main() {
    let v = vec![10, 20, 30];
    
    // Duyệt các phần tử
    for element in &v {
        println!("{}", element);
    }
    
    // Duyệt và thay đổi các phần tử
    let mut v = vec![10, 20, 30];
    for element in &mut v {
        *element += 5;
    }
    println!("Vector sau khi thay đổi: {:?}", v); // Output: [15, 25, 35]
}
```

### Sử dụng iterator methods

```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];
    
    // Sử dụng map để biến đổi các phần tử
    let doubled: Vec<i32> = v.iter().map(|x| x * 2).collect();
    println!("Doubled: {:?}", doubled); // Output: [2, 4, 6, 8, 10]
    
    // Sử dụng filter để lọc các phần tử
    let even: Vec<&i32> = v.iter().filter(|&&x| x % 2 == 0).collect();
    println!("Even: {:?}", even); // Output: [2, 4]
    
    // Tính tổng sử dụng fold
    let sum: i32 = v.iter().fold(0, |acc, &x| acc + x);
    println!("Tổng: {}", sum); // Output: 15
}
```

### Iterator và mut, into_iter

Rust cung cấp 3 loại iterator cho vector:

```rust
fn main() {
    let v = vec![1, 2, 3];
    
    // iter() - mượn các phần tử dưới dạng bất biến
    for element in v.iter() {
        println!("iter(): {}", element);
    }
    
    let mut v = vec![1, 2, 3];
    // iter_mut() - mượn các phần tử dưới dạng khả biến
    for element in v.iter_mut() {
        *element *= 2;
    }
    println!("Sau iter_mut(): {:?}", v); // [2, 4, 6]
    
    // into_iter() - lấy quyền sở hữu và tiêu thụ vector
    for element in v.into_iter() {
        println!("into_iter(): {}", element);
    }
    
    // v không còn sử dụng được sau câu lệnh trên
    // println!("{:?}", v); // Error!
}
```

## 5. Vector và Generics

Vectors sử dụng generics (`Vec&lt;T&gt;`) để lưu trữ bất kỳ kiểu dữ liệu nào. Điều này cho phép tạo các cấu trúc dữ liệu linh hoạt:

```rust
fn main() {
    // Vector chứa các số nguyên
    let v_i32: Vec<i32> = vec![1, 2, 3];
    
    // Vector chứa các chuỗi
    let v_string: Vec<String> = vec![
        String::from("hello"),
        String::from("world"),
    ];
    
    // Vector chứa các kiểu dữ liệu tùy chỉnh
    #[derive(Debug)]
    struct Point {
        x: i32,
        y: i32,
    }
    
    let v_points: Vec<Point> = vec![
        Point { x: 0, y: 0 },
        Point { x: 1, y: 2 },
        Point { x: 10, y: -3 },
    ];
    
    println!("Points: {:?}", v_points);
}
```

### Vector chứa nhiều kiểu khác nhau với enum

```rust
fn main() {
    #[derive(Debug)]
    enum SpreadsheetCell {
        Int(i32),
        Float(f64),
        Text(String),
    }
    
    let row = vec![
        SpreadsheetCell::Int(42),
        SpreadsheetCell::Float(3.14),
        SpreadsheetCell::Text(String::from("Rust")),
    ];
    
    for cell in &row {
        match cell {
            SpreadsheetCell::Int(value) => println!("Int: {}", value),
            SpreadsheetCell::Float(value) => println!("Float: {}", value),
            SpreadsheetCell::Text(value) => println!("Text: {}", value),
        }
    }
}
```

## 6. So sánh Vec, Array và Slice

| Đặc điểm | Vec&lt;T&gt; | Array [T; N] | Slice &[T] |
|---------|--------|--------------|------------|
| **Kích thước** | Động, có thể thay đổi | Cố định tại thời điểm biên dịch | Tham chiếu đến một phần của array hoặc vec |
| **Vị trí bộ nhớ** | Heap | Stack (nhỏ) hoặc heap (lớn) | Không sở hữu dữ liệu |
| **Hiệu suất** | Truy cập nhanh O(1), cấp phát lại khi cần | Truy cập cực nhanh O(1) | Truy cập nhanh O(1) |
| **Use case** | Khi cần thay đổi kích thước | Khi kích thước cố định và biết trước | Khi cần truyền tham chiếu đến một phần của array/vec |
| **Cú pháp** | `let v: Vec<i32> = vec![1, 2, 3]` | `let a: [i32; 3] = [1, 2, 3]` | `let s: &[i32] = &v[0..2]` |

```rust
fn main() {
    // Vector
    let mut vector = vec![1, 2, 3, 4, 5];
    vector.push(6); // Có thể thay đổi kích thước
    
    // Array
    let array = [1, 2, 3, 4, 5];
    // array.push(6); // Error! Array không thể thay đổi kích thước
    
    // Slice
    let slice = &vector[1..4]; // Tham chiếu đến một phần của vector
    println!("Slice: {:?}", slice); // [2, 3, 4]
    
    let array_slice = &array[1..4]; // Tham chiếu đến một phần của array
    println!("Array slice: {:?}", array_slice); // [2, 3, 4]
}
```

## 7. Ứng dụng thực tế: Ứng dụng quản lý danh sách công việc

Hãy xây dựng một ứng dụng đơn giản để quản lý danh sách công việc sử dụng các kiến thức về vector đã học:

```rust
struct TodoItem {
    id: usize,
    title: String,
    completed: bool,
}

struct TodoList {
    tasks: Vec<TodoItem>,
    next_id: usize,
}

impl TodoList {
    // Khởi tạo danh sách công việc mới
    fn new() -> TodoList {
        TodoList {
            tasks: Vec::new(),
            next_id: 1,
        }
    }
    
    // Thêm công việc mới
    fn add_task(&mut self, title: &str) -> usize {
        let id = self.next_id;
        self.tasks.push(TodoItem {
            id,
            title: String::from(title),
            completed: false,
        });
        self.next_id += 1;
        id
    }
    
    // Đánh dấu công việc đã hoàn thành
    fn complete_task(&mut self, id: usize) -> Result<(), String> {
        if let Some(task) = self.tasks.iter_mut().find(|t| t.id == id) {
            task.completed = true;
            Ok(())
        } else {
            Err(format!("Không tìm thấy công việc với ID {}", id))
        }
    }
    
    // Xóa công việc
    fn remove_task(&mut self, id: usize) -> Result<TodoItem, String> {
        if let Some(pos) = self.tasks.iter().position(|t| t.id == id) {
            Ok(self.tasks.remove(pos))
        } else {
            Err(format!("Không tìm thấy công việc với ID {}", id))
        }
    }
    
    // Hiển thị danh sách công việc
    fn list_tasks(&self) {
        if self.tasks.is_empty() {
            println!("Danh sách công việc trống!");
            return;
        }
        
        println!("DANH SÁCH CÔNG VIỆC:");
        println!("{:<5} {:<30} {:<10}", "ID", "Tên công việc", "Trạng thái");
        println!("{}", "-".repeat(50));
        
        for task in &self.tasks {
            let status = if task.completed { "✓ Hoàn thành" } else { "⏳ Đang làm" };
            println!("{:<5} {:<30} {:<10}", task.id, task.title, status);
        }
    }
    
    // Lọc công việc theo trạng thái
    fn filter_by_status(&self, completed: bool) -> Vec<&TodoItem> {
        self.tasks.iter()
            .filter(|task| task.completed == completed)
            .collect()
    }
}

fn main() {
    let mut todo_list = TodoList::new();
    
    // Thêm công việc
    todo_list.add_task("Học Rust vectors");
    todo_list.add_task("Viết chương trình quản lý công việc");
    todo_list.add_task("Chuẩn bị bài thuyết trình");
    
    // Hiển thị danh sách
    todo_list.list_tasks();
    
    // Đánh dấu hoàn thành
    if let Err(e) = todo_list.complete_task(1) {
        println!("Lỗi: {}", e);
    }
    
    // Xóa một công việc
    match todo_list.remove_task(3) {
        Ok(task) => println!("Đã xóa công việc: {}", task.title),
        Err(e) => println!("Lỗi: {}", e),
    }
    
    // Hiển thị lại danh sách
    todo_list.list_tasks();
    
    // Lọc công việc đã hoàn thành
    let completed_tasks = todo_list.filter_by_status(true);
    println!("\nCông việc đã hoàn thành: {}", completed_tasks.len());
    
    // Lọc công việc chưa hoàn thành
    let pending_tasks = todo_list.filter_by_status(false);
    println!("Công việc chưa hoàn thành: {}", pending_tasks.len());
}
```

## 8. Các lỗi thường gặp và cách giải quyết

### 1. Borrow checker errors

```rust
fn main() {
    let mut v = vec![1, 2, 3];
    
    // Lỗi: không thể mượn v dưới dạng khả biến vì nó đã được mượn dưới dạng bất biến
    let first = &v[0];
    v.push(4); // Error!
    println!("First: {}", first);
    
    // Cách giải quyết: đảm bảo tham chiếu bất biến hết hạn trước khi mượn dưới dạng khả biến
    let mut v = vec![1, 2, 3];
    let first = &v[0];
    println!("First: {}", first); // Tham chiếu đã sử dụng xong
    v.push(4); // OK
}
```

### 2. Panic khi truy cập ngoài phạm vi

```rust
fn main() {
    let v = vec![1, 2, 3];
    
    // Lỗi: chỉ mục ngoài phạm vi
    // let value = &v[10]; // Panic!
    
    // Cách giải quyết: sử dụng get() để kiểm tra an toàn
    match v.get(10) {
        Some(value) => println!("Giá trị: {}", value),
        None => println!("Chỉ mục không hợp lệ"),
    }
}
```

### 3. Quên clone khi cần sở hữu

```rust
fn main() {
    let v = vec![String::from("hello"), String::from("world")];
    
    // Lỗi: không thể chuyển quyền sở hữu
    // let first_word = v[0]; // Error!
    
    // Cách giải quyết: clone nếu cần sở hữu
    let first_word = v[0].clone();
    println!("First word: {}", first_word);
    
    // Hoặc sử dụng tham chiếu nếu không cần sở hữu
    let first_word_ref = &v[0];
    println!("First word ref: {}", first_word_ref);
}
```

## 9. Bài tập thực hành

### Bài tập 1: Xây dựng Vector để thống kê dữ liệu
Viết một chương trình nhập vào một danh sách số nguyên, sau đó tính các thông số:
- Giá trị lớn nhất, nhỏ nhất
- Giá trị trung bình
- Tổng các số chẵn, tổng các số lẻ

### Bài tập 2: Vận dụng Vector với các kiểu dữ liệu phức tạp
Mở rộng ứng dụng TodoList với các chức năng:
- Thêm ngày đến hạn cho mỗi công việc
- Sắp xếp công việc theo ngày đến hạn
- Phân loại công việc theo mức độ ưu tiên

### Bài tập 3: Thực hiện các thao tác trên Vector
Viết các hàm sau:
- Loại bỏ các phần tử trùng lặp trong vector
- Hợp nhất hai vector đã sắp xếp thành một vector mới vẫn có thứ tự
- Tìm phần tử xuất hiện nhiều nhất trong vector

## 10. Tổng kết

Trong bài học này, chúng ta đã tìm hiểu về:

1. Vector là gì và cách khởi tạo vector trong Rust
2. Các phương thức cơ bản để thao tác với vector
3. Ownership và borrowing với vectors
4. Các cách duyệt qua vector
5. Sử dụng generics với vector
6. So sánh vector với array và slice
7. Ứng dụng thực tế với ứng dụng quản lý danh sách công việc

Vectors là một trong những kiểu dữ liệu quan trọng nhất trong Rust, và hiểu rõ cách sử dụng chúng là nền tảng để làm việc hiệu quả với ngôn ngữ. Trong các bài học tiếp theo, chúng ta sẽ khám phá các collections khác như HashMap và HashSet.

## Tài liệu tham khảo
- [Rust Book Chapter 8.1: Vectors](https://doc.rust-lang.org/book/ch08-01-vectors.html)
- [Rust Standard Library: Vec Documentation](https://doc.rust-lang.org/std/vec/struct.Vec.html)
- [Rust by Example: Vectors](https://doc.rust-lang.org/rust-by-example/std/vec.html)