# BÀI 5: Hàm và scope trong Rust

Xin chào các bạn! Hôm nay chúng ta sẽ tìm hiểu về hàm và scope trong Rust - một trong những khái niệm nền tảng quan trọng nhất của ngôn ngữ này.

## 🎯 Mục tiêu bài học
- Hiểu cách xây dựng và gọi hàm trong Rust
- Nắm vững cách truyền tham số và trả về giá trị từ hàm
- Phân biệt được statements và expressions trong Rust 
- Làm quen với khái niệm scope và tìm hiểu sơ lược về ownership
- Áp dụng kiến thức để giải quyết các bài toán thực tế

## 📝 Nội dung chi tiết

### 1. Định nghĩa và gọi hàm

#### Cú pháp cơ bản:
```rust
fn tên_hàm(tham_số1: kiểu_dữ_liệu1, tham_số2: kiểu_dữ_liệu2) -> kiểu_trả_về {
    // Thân hàm
    // Các câu lệnh
}
```

#### Ví dụ đơn giản:
```rust
fn say_hello() {
    println!("Xin chào các bạn!");
}

fn main() {
    say_hello(); // Gọi hàm
}
```

#### Quy ước đặt tên:
- Tên hàm trong Rust theo kiểu snake_case (tất cả chữ thường, các từ nối với nhau bằng dấu gạch dưới)
- Tên hàm nên mô tả đúng hành động mà hàm thực hiện

### 2. Tham số và giá trị trả về

#### Truyền tham số:
```rust
fn greet(name: &str) {
    println!("Xin chào, {}!", name);
}

fn main() {
    greet("Nguyễn Văn A");
    
    let student = "Trần Thị B";
    greet(student);
}
```

#### Hàm có giá trị trả về:
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let sum = add(5, 3);
    println!("Tổng: {}", sum); // Tổng: 8
}
```

#### Hàm không trả về giá trị:
```rust
fn print_info() -> () { // hoặc có thể bỏ qua "-> ()"
    println!("Đây là một hàm không trả về giá trị");
}
```

### 3. Expressions và return values

#### Statements vs Expressions:
- **Statement**: câu lệnh thực hiện một hành động nhưng không trả về giá trị
- **Expression**: đoạn code tính toán và trả về một giá trị

```rust
fn main() {
    let x = 5; // Statement (gán giá trị)
    
    let y = {  // Expression block
        let a = 3;
        a + 1  // Expression - không có dấu chấm phẩy
    };
    
    println!("Giá trị của y là: {}", y); // 4
}
```

#### Trả về giá trị ngầm định:
Trong Rust, biểu thức cuối cùng trong thân hàm sẽ được trả về nếu không có dấu chấm phẩy (;):

```rust
fn square(num: i32) -> i32 {
    num * num  // Không có dấu chấm phẩy -> trả về giá trị
}

fn main() {
    let result = square(5);
    println!("5 bình phương = {}", result); // 25
}
```

#### Từ khóa `return`:
```rust
fn absolute(num: i32) -> i32 {
    if num >= 0 {
        return num; // Trả về sớm với từ khóa return
    }
    
    -num // Trả về ngầm định
}
```

### 4. Scope và giới thiệu về ownership

#### Scope trong Rust:
- Scope là phạm vi mà biến tồn tại và có thể được truy cập
- Biến trong Rust được tạo khi khai báo và bị hủy khi ra khỏi scope

```rust
fn main() {
    // Biến outer_var tồn tại trong toàn bộ hàm main
    let outer_var = 10;
    
    {
        // Biến inner_var chỉ tồn tại trong block này
        let inner_var = 20;
        println!("Bên trong block: outer_var = {}, inner_var = {}", outer_var, inner_var);
    } // inner_var bị hủy tại đây
    
    // Dòng code sau sẽ gây lỗi biên dịch
    // println!("inner_var = {}", inner_var);
    
    println!("Bên ngoài block: outer_var = {}", outer_var);
}
```

#### Giới thiệu về ownership:
- Rust sử dụng hệ thống ownership để quản lý bộ nhớ
- Mỗi giá trị trong Rust có một biến là "chủ sở hữu" (owner)
- Khi chủ sở hữu ra khỏi scope, giá trị sẽ bị hủy

```rust
fn main() {
    let s = String::from("hello"); // s là chủ sở hữu của chuỗi "hello"
    
    takes_ownership(s); // Quyền sở hữu được chuyển cho hàm
    
    // Dòng code sau sẽ gây lỗi vì s không còn hợp lệ
    // println!("{}", s);
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
} // some_string ra khỏi scope và bị hủy
```

## 🏆 Bài tập thực hành kèm lời giải chi tiết

### Bài tập 1: Viết chương trình tính giai thừa

**Yêu cầu:** Viết hàm `factorial` để tính giai thừa của một số nguyên không âm.

**Lời giải:**

```rust
fn factorial(n: u64) -> u64 {
    if n == 0 || n == 1 {
        1
    } else {
        n * factorial(n - 1)
    }
}

fn main() {
    println!("0! = {}", factorial(0)); // 1
    println!("5! = {}", factorial(5)); // 120
    println!("10! = {}", factorial(10)); // 3628800
}
```

**Giải thích:**
- Sử dụng kiểu dữ liệu `u64` (unsigned 64-bit integer) để có thể lưu trữ kết quả lớn
- Hàm đệ quy, với trường hợp cơ sở là 0! = 1 và 1! = 1
- Hàm trả về giá trị ngầm định không sử dụng từ khóa `return`
- Cách tiếp cận này đơn giản nhưng có giới hạn: với n lớn có thể bị tràn stack do đệ quy sâu

**Phiên bản cải tiến (không đệ quy):**

```rust
fn factorial_iterative(n: u64) -> u64 {
    let mut result = 1;
    for i in 1..=n {
        result *= i;
    }
    result
}

fn main() {
    println!("0! = {}", factorial_iterative(0)); // 1
    println!("5! = {}", factorial_iterative(5)); // 120
    println!("10! = {}", factorial_iterative(10)); // 3628800
}
```

### Bài tập 2: Giải thích biểu thức trả về ngầm định

**Yêu cầu:** Viết một hàm `max_of_three` nhận vào ba số nguyên và trả về số lớn nhất, sử dụng biểu thức trả về ngầm định.

**Lời giải:**

```rust
fn max_of_three(a: i32, b: i32, c: i32) -> i32 {
    let max_ab = if a > b { a } else { b };
    
    if max_ab > c {
        max_ab  // Biểu thức trả về ngầm định
    } else {
        c       // Biểu thức trả về ngầm định
    }
}

fn main() {
    println!("Max của 10, 5, 15 là: {}", max_of_three(10, 5, 15)); // 15
    println!("Max của 7, 12, 3 là: {}", max_of_three(7, 12, 3));   // 12
    println!("Max của 20, 20, 10 là: {}", max_of_three(20, 20, 10)); // 20
}
```

**Giải thích:**
- Hàm sử dụng biểu thức `if-else` để tìm giá trị lớn nhất
- Không có dấu chấm phẩy ở biểu thức cuối cùng, do đó đây là biểu thức trả về
- Cú pháp gọn gàng hơn so với sử dụng từ khóa `return`

**Phiên bản sử dụng biểu thức trong một block:**

```rust
fn max_of_three_block(a: i32, b: i32, c: i32) -> i32 {
    {
        let max_ab = if a > b { a } else { b };
        if max_ab > c { max_ab } else { c }
    }
}
```

## 🔑 Những điểm quan trọng cần lưu ý

1. **Cú pháp hàm:**
   - Từ khóa `fn` để khai báo hàm
   - Tham số phải chỉ định kiểu dữ liệu
   - Kiểu trả về được khai báo sau mũi tên `->`
   - Không cần từ khóa `return` nếu biểu thức cuối cùng không có dấu chấm phẩy

2. **Tham số và scope:**
   - Các tham số chỉ tồn tại trong scope của hàm
   - Biến được tạo khi khai báo và bị hủy khi ra khỏi scope

3. **Biểu thức và câu lệnh:**
   - Biểu thức trả về giá trị, câu lệnh thì không
   - Dấu chấm phẩy (;) biến biểu thức thành câu lệnh
   - Biểu thức cuối cùng trong block không có dấu chấm phẩy sẽ là giá trị trả về của block đó

4. **Ownership:**
   - Khi truyền một biến vào hàm, ownership có thể bị chuyển, làm biến không sử dụng được nữa
   - Các kiểu dữ liệu nguyên thủy (như `i32`, `bool`) được copy khi truyền vào hàm, không bị chuyển ownership
   - Các kiểu dữ liệu phức tạp (như `String`, `Vec`) bị chuyển ownership khi truyền vào hàm

5. **Vấn đề đệ quy:**
   - Rust hỗ trợ đệ quy, nhưng có giới hạn về stack size
   - Với các hàm đệ quy sâu, nên cân nhắc phiên bản lặp (iterative)

## 📝 Bài tập về nhà

1. **Bài tập cơ bản:** Viết hàm tính tổng các số từ 1 đến n sử dụng phương pháp lặp và đệ quy.

2. **Bài tập trung bình:** Viết hàm `fibonacci(n: u32) -> u64` để tính số Fibonacci thứ n (F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2) với n >= 2).

3. **Bài tập nâng cao:** Viết hàm `is_palindrome(s: &str) -> bool` kiểm tra xem một chuỗi có phải là palindrome không (đọc từ trái sang phải và từ phải sang trái giống nhau, ví dụ "radar", "madam").

4. **Thử thách:** Viết một chương trình cho phép người dùng nhập vào một biểu thức toán học đơn giản (chỉ chứa +, -, *, / và số nguyên) và tính kết quả. Chia nhỏ chương trình thành các hàm riêng biệt.

5. **Thực hành scope và ownership:** Viết một hàm nhận vào một vector các số nguyên và trả về vector mới chứa các số đã được sắp xếp. Chú ý đến ownership trong chương trình của bạn.

