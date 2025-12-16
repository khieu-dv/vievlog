# Rust Core - Từ Cơ Bản Đến Chuyên Sâu

### PHẦN 1: LÀM QUEN VỚI RUST (5 bài)

#### Bài 1: Giới thiệu Rust - Tại sao nên học Rust?

- **Nội dung:**
  - Lịch sử và triết lý của Rust
  - Ưu điểm của Rust: an toàn bộ nhớ, hiệu suất cao, xử lý đồng thời
  - So sánh với các ngôn ngữ khác (C++, Python, JavaScript)
  - Các lĩnh vực ứng dụng của Rust
  - Demo một ứng dụng Rust đơn giản
- **Hoạt động:**
  - Giới thiệu tổng quan khóa học
  - Hướng dẫn cài đặt môi trường

#### Bài 2: Cài đặt và sử dụng công cụ Rust

- **Nội dung:**
  - Cài đặt Rust thông qua Rustup
  - Tìm hiểu về Cargo (trình quản lý gói của Rust)
  - Tạo dự án đầu tiên với `cargo new`
  - Biên dịch và chạy chương trình với `cargo build` và `cargo run`
  - Kiểm tra mã với `cargo check`
- **Hoạt động:**
  - Demo tạo dự án "Hello World"
  - Giải thích cấu trúc thư mục dự án

#### Bài 3: Kiểu dữ liệu cơ bản và biến

- **Nội dung:**
  - Khai báo biến với `let` và tính bất biến (immutability)
  - Kiểu dữ liệu nguyên thủy: integer, float, boolean, character
  - Type annotation và type inference
  - Constants và static variables
  - Shadowing trong Rust
- **Hoạt động:**
  - Demo các ví dụ thực tế
  - Giải thích lỗi khi thay đổi biến immutable

#### Bài 4: Cấu trúc điều khiển và vòng lặp

- **Nội dung:**
  - Câu lệnh if-else và if let
  - Vòng lặp: loop, while, for
  - Break và continue
  - Expressions vs Statements trong Rust
- **Hoạt động:**
  - Viết chương trình tính số Fibonacci
  - Demo cách sử dụng if như một biểu thức

#### Bài 5: Hàm và scope trong Rust

- **Nội dung:**
  - Định nghĩa và gọi hàm
  - Tham số và giá trị trả về
  - Expressions và return values
  - Scope và ownership (giới thiệu)
- **Hoạt động:**
  - Viết chương trình tính giai thừa
  - Giải thích biểu thức trả về ngầm định

### PHẦN 2: CƠ CHẾ OWNERSHIP TRONG RUST (5 bài)

#### Bài 6: Ownership - Khái niệm cốt lõi

- **Nội dung:**
  - Hiểu về ownership và cơ chế quản lý bộ nhớ
  - Stack vs Heap
  - Nguyên tắc ownership trong Rust
  - Di chuyển (move) và sao chép (copy)
- **Hoạt động:**
  - Minh họa trực quan cơ chế ownership
  - Debug các lỗi ownership phổ biến

#### Bài 7: Borrowing và References

- **Nội dung:**
  - References và borrowing
  - Immutable references vs mutable references
  - Quy tắc borrowing
  - Dangling references và cách Rust ngăn chặn
- **Hoạt động:**
  - Viết chương trình minh họa borrowing
  - Phân tích lỗi và cách khắc phục

#### Bài 8: Slices trong Rust

- **Nội dung:**
  - String slices (`&str`)
  - Array slices (`&[T]`)
  - Các phương thức làm việc với slices
  - Pattern matching với slices
- **Hoạt động:**
  - Viết hàm tìm từ đầu tiên trong câu
  - So sánh hiệu suất của slices và cloning

#### Bài 9: Lifetime trong Rust

- **Nội dung:**
  - Khái niệm lifetime
  - Annotation lifetime
  - Lifetime elision rules
  - Static lifetime
- **Hoạt động:**
  - Demo các trường hợp cần chỉ định lifetime
  - Debug lỗi lifetime phổ biến

#### Bài 10: Ownership trong thực tiễn

- **Nội dung:**
  - Recap về ownership, borrowing, lifetime
  - Các design pattern liên quan đến ownership
  - Khi nào sử dụng Clone, Copy
  - Optimization với ownership
- **Hoạt động:**
  - Refactor code để tối ưu ownership
  - Project nhỏ: xây dựng ứng dụng quản lý văn bản

### PHẦN 3: KIỂU DỮ LIỆU PHỨC HỢP (5 bài)

#### Bài 11: Structs và Method Syntax

- **Nội dung:**
  - Định nghĩa và khởi tạo struct
  - Field init shorthand
  - Struct update syntax
  - Method syntax với `impl`
  - Associated functions
- **Hoạt động:**
  - Xây dựng struct Rectangle với các methods
  - Demo ứng dụng tính toán hình học

#### Bài 12: Enums và Pattern Matching

- **Nội dung:**
  - Định nghĩa và sử dụng enums
  - Enums với dữ liệu
  - Option enum
  - Pattern matching với match
  - if let và while let
- **Hoạt động:**
  - Xây dựng ứng dụng xử lý trạng thái
  - Demo xử lý lỗi với Option và Result

#### Bài 13: Collections - Vectors

- **Nội dung:**
  - Vec&lt;T&gt; và các phương thức
  - Push, pop và truy cập phần tử
  - Ownership với vectors
  - Iterating qua vector
  - Vector và generics
- **Hoạt động:**
  - Viết chương trình quản lý danh sách công việc
  - So sánh với arrays và slices

#### Bài 14: Collections - Strings

- **Nội dung:**
  - String vs &str
  - UTF-8 và Unicode trong Rust
  - Các phương thức xử lý chuỗi
  - String concatenation và formatting
  - Hiệu suất khi làm việc với chuỗi
- **Hoạt động:**
  - Viết ứng dụng phân tích văn bản
  - Demo xử lý chuỗi unicode phức tạp

#### Bài 15: Collections - HashMaps

- **Nội dung:**
  - HashMap&lt;K, V&gt; và các phương thức
  - Inserting và retrieving
  - Ownership với HashMap
  - Updating based on old value
  - Hashing functions
- **Hoạt động:**
  - Viết chương trình đếm từ trong văn bản
  - Sử dụng HashMap để lưu trữ cấu hình

### PHẦN 4: ERROR HANDLING VÀ GENERIC TYPES (5 bài)

#### Bài 16: Error Handling trong Rust

- **Nội dung:**
  - Panic! và unrecoverable errors
  - Result&lt;T, E&gt; và recoverable errors
  - Propagating errors với ?
  - Custom error types
  - thiserror và anyhow crates
- **Hoạt động:**
  - Viết ứng dụng đọc và xử lý file
  - Cải thiện thông báo lỗi trong ứng dụng

#### Bài 17: Generic Types

- **Nội dung:**
  - Định nghĩa structs và enums với generics
  - Generic function parameters
  - Generic với method definitions
  - Performance của code generic
  - Monomorphization
- **Hoạt động:**
  - Xây dựng cấu trúc dữ liệu generic
  - Refactor code để sử dụng generics

#### Bài 18: Traits - Đặc điểm trong Rust

- **Nội dung:**
  - Định nghĩa và implements traits
  - Default implementations
  - Trait bounds
  - Trait objects và dynamic dispatch
  - Standard library traits (Display, Debug, Clone, etc.)
- **Hoạt động:**
  - Xây dựng trait hierarchy cho ứng dụng
  - Implement Display và Debug traits

#### Bài 19: Lifetimes với Generics

- **Nội dung:**
  - Generic lifetime parameters
  - Kết hợp lifetime và generic type parameters
  - Lifetime bounds
  - Static lifetime
  - Tiếp cận lifetime annotation hiệu quả
- **Hoạt động:**
  - Phân tích và fix lifetime errors
  - Xây dựng API với generic và lifetime

#### Bài 20: Advanced Trait Patterns

- **Nội dung:**
  - Associated types
  - Default type parameters
  - Operator overloading
  - Fully qualified syntax
  - Supertraits
  - Newtype pattern
- **Hoạt động:**
  - Implement Iterator trait cho cấu trúc dữ liệu
  - Sử dụng operator overloading

### PHẦN 5: CONCURRENCY VÀ ỨNG DỤNG THỰC TẾ (10 bài)

#### Bài 21: Closures trong Rust

- **Nội dung:**
  - Syntax và semantics của closures
  - Closure type inference và annotation
  - Capturing environment: moving và borrowing
  - FnOnce, FnMut, và Fn traits
  - Closures với iterators
- **Hoạt động:**
  - Sử dụng closures với collections
  - Implement một custom sorting function

#### Bài 22: Iterators

- **Nội dung:**
  - Iterator trait và next method
  - Consuming adaptors: sum, collect
  - Iterator adaptors: map, filter, chain
  - Creating custom iterators
  - Iterator performance
- **Hoạt động:**
  - Implement Iterator cho cấu trúc dữ liệu tự định nghĩa
  - Benchmark performance với iterators

#### Bài 23: Smart Pointers - Box

- **Nội dung:**
  - Box&lt;T&gt; và heap allocation
  - Recursive types với Box
  - Deref trait
  - Drop trait
  - Sizing considerations
- **Hoạt động:**
  - Implement cấu trúc dữ liệu đệ quy (linked list, tree)
  - Demo memory management với Box

#### Bài 24: Smart Pointers - Rc và RefCell

- **Nội dung:**
  - Rc&lt;T&gt; và shared ownership
  - Reference counting
  - Interior mutability với RefCell&lt;T&gt;
  - Combining Rc và RefCell
  - Weak&lt;T&gt; và memory leaks
- **Hoạt động:**
  - Implement cấu trúc dữ liệu graph
  - Debug memory leaks với RefCell và Rc

#### Bài 25: Threads và Shared State Concurrency

- **Nội dung:**
  - Spawning threads
  - Thread communication
  - Thread::spawn và join handles
  - Send và Sync traits
  - Arc&lt;T&gt; cho thread safety
- **Hoạt động:**
  - Viết chương trình đa luồng đơn giản
  - Demo race conditions và cách tránh

#### Bài 26: Mutex và Atomic Types

- **Nội dung:**
  - Mutex&lt;T&gt; và mutual exclusion
  - Poisoned locks
  - Atomic types (AtomicBool, AtomicUsize, etc.)
  - Compare and swap operations
  - Lock-free programming
- **Hoạt động:**
  - Implement thread-safe counter
  - So sánh hiệu suất Mutex và Atomic

#### Bài 27: Channels và Message Passing

- **Nội dung:**
  - Message passing concurrency
  - mpsc channels (multi-producer, single-consumer)
  - Sending và receiving messages
  - Blocking và non-blocking receives
  - Multiple producers
- **Hoạt động:**
  - Viết ứng dụng producer-consumer
  - Xây dựng worker pool đơn giản

#### Bài 28: Async/Await và Futures

- **Nội dung:**
  - Asynchronous programming với Rust
  - Futures và poll method
  - async/await syntax
  - Tokio runtime
  - Error handling với async
- **Hoạt động:**
  - Viết HTTP client sử dụng reqwest
  - So sánh hiệu suất với mô hình đồng bộ

#### Bài 29: Web Development với Rust

- **Nội dung:**
  - Giới thiệu web frameworks (Actix, Rocket, Warp)
  - Routing và handlers
  - Request và response
  - Middleware
  - Database connections
- **Hoạt động:**
  - Xây dựng REST API đơn giản
  - Kết nối với database

#### Bài 30: Project cuối khóa - Xây dựng ứng dụng hoàn chỉnh

- **Nội dung:**
  - Tổng hợp kiến thức đã học
  - System design
  - Testing và benchmarking
  - Documentation
  - Deployment
- **Hoạt động:**
  - Thực hiện project: CLI app hoặc Web service
  - Code review và refactoring
