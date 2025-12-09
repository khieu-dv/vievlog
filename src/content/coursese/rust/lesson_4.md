# Bài 4: Cấu trúc điều khiển và vòng lặp trong Rust

## 🎯 Mục tiêu bài học
- Hiểu và áp dụng được câu lệnh điều kiện `if-else` và `if let` trong Rust
- Nắm vững các loại vòng lặp: `loop`, `while`, và `for` 
- Sử dụng thành thạo `break` và `continue` để điều khiển luồng lặp
- Phân biệt được sự khác nhau giữa Expressions và Statements trong Rust
- Hiểu cách Rust xử lý cấu trúc điều khiển như biểu thức có giá trị trả về

## 📝 Nội dung chi tiết

### 1. Câu lệnh điều kiện if-else

Trong Rust, cấu trúc `if-else` không cần dấu ngoặc đơn `()` cho điều kiện nhưng luôn yêu cầu dấu ngoặc nhọn `{}`:

```rust
let number = 7;

// Cú pháp cơ bản
if number < 5 {
    println!("Số nhỏ hơn 5");
} else if number < 10 {
    println!("Số lớn hơn hoặc bằng 5 và nhỏ hơn 10");
} else {
    println!("Số lớn hơn hoặc bằng 10");
}
```

#### Đặc điểm quan trọng:
- Điều kiện trong `if` **phải** là kiểu `bool` - Rust không tự động chuyển đổi số thành boolean
- Các block code được bao quanh bởi dấu ngoặc nhọn `{}`

#### if như một biểu thức (Expression)
Trong Rust, `if` có thể được sử dụng như một biểu thức để gán giá trị:

```rust
let condition = true;
let number = if condition { 5 } else { 6 };
println!("Giá trị của number: {}", number); // 5
```

Chú ý: Các nhánh của `if` phải trả về cùng một kiểu dữ liệu.

### 2. if let - Pattern Matching đơn giản

`if let` là cú pháp ngắn gọn cho việc pattern matching một giá trị và thực thi code nếu khớp mẫu:

```rust
let some_value = Some(3);

// Cách tiếp cận truyền thống với match
match some_value {
    Some(value) => println!("Có giá trị: {}", value),
    None => (),
}

// Cách tiếp cận ngắn gọn với if let
if let Some(value) = some_value {
    println!("Có giá trị: {}", value);
}
```

`if let` đặc biệt hữu ích khi bạn chỉ quan tâm đến một mẫu cụ thể và muốn bỏ qua các mẫu khác.

### 3. Vòng lặp trong Rust

Rust cung cấp ba dạng vòng lặp: `loop`, `while` và `for`.

#### a. loop - Vòng lặp vô hạn

Vòng lặp `loop` chạy vô hạn cho đến khi gặp lệnh `break`:

```rust
let mut counter = 0;

let result = loop {
    counter += 1;
    
    if counter == 10 {
        break counter * 2; // Trả về giá trị sau break
    }
};

println!("Kết quả: {}", result); // 20
```

#### b. while - Vòng lặp có điều kiện

Vòng lặp `while` chạy khi điều kiện còn đúng:

```rust
let mut number = 3;

while number != 0 {
    println!("{}!", number);
    number -= 1;
}

println!("Kết thúc!");
```

#### c. for - Duyệt qua các phần tử của collection

Vòng lặp `for` được sử dụng để duyệt qua các phần tử trong một collection hoặc range:

```rust
// Duyệt qua range (1..4 là từ 1 đến 3)
for number in 1..4 {
    println!("{}!", number);
}

// Duyệt qua các phần tử của một mảng
let a = [10, 20, 30, 40, 50];
for element in a.iter() {
    println!("Giá trị: {}", element);
}
```

### 4. Break và Continue

#### Break
- `break` kết thúc vòng lặp ngay lập tức
- Có thể mang giá trị trả về: `break value;`
- Có thể sử dụng nhãn (label) để thoát khỏi vòng lặp lồng nhau:

```rust
'outer: for i in 1..5 {
    for j in 1..5 {
        if i * j > 10 {
            println!("Thoát ở i={}, j={}", i, j);
            break 'outer; // Thoát khỏi vòng lặp bên ngoài
        }
    }
}
```

#### Continue
- `continue` bỏ qua phần còn lại của một lần lặp và chuyển sang lần lặp tiếp theo:

```rust
for i in 1..6 {
    if i % 2 == 0 {
        continue; // Bỏ qua số chẵn
    }
    println!("Số lẻ: {}", i);
}
```

### 5. Expressions vs Statements trong Rust

Rust là ngôn ngữ hướng biểu thức (expression-oriented):

#### Statements (câu lệnh)
- Không trả về giá trị
- Kết thúc bằng dấu chấm phẩy `;`
- Ví dụ: khai báo biến, gán giá trị

```rust
let x = 5; // Statement
```

#### Expressions (biểu thức)
- Trả về giá trị
- Không có dấu chấm phẩy ở cuối
- Ví dụ: gọi hàm, toán tử, block code `{}`

```rust
let y = {
    let x = 3;
    x + 1 // Expression - không có dấu chấm phẩy
}; // y = 4
```

Trong Rust, nhiều cấu trúc là expressions:
- Block code `{}` là một expression, trả về giá trị của expression cuối cùng
- `if` là một expression
- `match` là một expression
- Thậm chí `loop` cũng có thể là một expression với `break value`

## 🏆 Bài tập thực hành

### Bài tập 1: Chương trình tính số Fibonacci
Viết chương trình tính và in ra n số đầu tiên của dãy Fibonacci.

```rust
fn main() {
    let n = 10; // Số lượng số Fibonacci cần tính
    
    println!("Dãy {} số Fibonacci đầu tiên:", n);
    
    // Sử dụng vòng lặp để tính dãy Fibonacci
    let mut a = 0;
    let mut b = 1;
    
    print!("{}, {}", a, b);
    
    for _ in 2..n {
        let next = a + b;
        print!(", {}", next);
        a = b;
        b = next;
    }
    println!();
}
```

**Giải thích chi tiết:**
1. Khởi tạo hai số Fibonacci đầu tiên: a = 0, b = 1
2. In ra hai số đầu tiên
3. Sử dụng vòng lặp `for` từ 2 đến n-1 để tính các số tiếp theo
4. Số Fibonacci tiếp theo là tổng của hai số trước đó
5. Cập nhật giá trị của a và b cho lần lặp tiếp theo

### Bài tập 2: Sử dụng if như một biểu thức

Viết chương trình sử dụng `if` như một biểu thức để xác định số lớn nhất trong ba số.

```rust
fn main() {
    let a = 15;
    let b = 27;
    let c = 10;
    
    let max = if a > b {
        if a > c { a } else { c }
    } else {
        if b > c { b } else { c }
    };
    
    println!("Số lớn nhất trong {}, {} và {} là: {}", a, b, c, max);
}
```

**Giải thích chi tiết:**
1. Sử dụng `if` lồng nhau như một biểu thức để tìm số lớn nhất
2. Đầu tiên so sánh a và b
3. Nếu a > b, tiếp tục so sánh a với c
4. Nếu b >= a, tiếp tục so sánh b với c
5. Giá trị trả về từ biểu thức `if` được gán cho biến `max`

### Bài tập 3: Sử dụng pattern matching với if let

Viết chương trình sử dụng `if let` để xử lý một `Option`:

```rust
fn main() {
    // Một hàm có thể trả về Some(value) hoặc None
    fn find_divisible_by_3(numbers: &[i32]) -> Option<i32> {
        for &num in numbers {
            if num % 3 == 0 {
                return Some(num);
            }
        }
        None
    }
    
    let numbers = [1, 2, 4, 5, 6, 8];
    
    // Sử dụng if let để xử lý kết quả
    if let Some(first_divisible) = find_divisible_by_3(&numbers) {
        println!("Số đầu tiên chia hết cho 3 là: {}", first_divisible);
    } else {
        println!("Không tìm thấy số nào chia hết cho 3");
    }
}
```

**Giải thích chi tiết:**
1. Định nghĩa hàm `find_divisible_by_3` tìm số đầu tiên chia hết cho 3 trong mảng
2. Sử dụng `if let` để xử lý kết quả trả về
3. Nếu tìm thấy (Some), in ra số đó
4. Nếu không tìm thấy (None), in thông báo không tìm thấy

## 🔑 Những điểm quan trọng cần lưu ý

1. **Điều kiện bắt buộc là Boolean**: Rust yêu cầu điều kiện trong `if` và `while` phải là kiểu `bool` chính xác, không tự động chuyển đổi từ các kiểu khác.

2. **Dấu ngoặc nhọn bắt buộc**: Trong Rust, dấu ngoặc nhọn `{}` luôn bắt buộc cho các block code, ngay cả khi chỉ có một câu lệnh.

3. **Nhất quán về kiểu dữ liệu**: Khi sử dụng `if` như biểu thức, tất cả các nhánh phải trả về cùng một kiểu dữ liệu.

4. **Hiệu suất của vòng lặp**: `for` trong Rust được thiết kế để an toàn và hiệu quả, sử dụng iterators để tránh lỗi phạm vi (bounds checking) trong thời gian chạy.

5. **Tối ưu hóa `break` và `continue`**: Sử dụng nhãn (label) với `break` và `continue` có thể làm code rõ ràng hơn khi xử lý vòng lặp lồng nhau.

6. **Expression-oriented**: Tận dụng triệt để tính chất biểu thức của Rust để viết code ngắn gọn và rõ ràng hơn.

7. **if let và pattern matching**: Sử dụng `if let` khi chỉ quan tâm đến một trường hợp cụ thể, sử dụng `match` khi cần xử lý đầy đủ các trường hợp.

8. **Ownership trong vòng lặp**: Cẩn thận với vấn đề ownership khi lặp qua các collection, sử dụng `.iter()`, `.iter_mut()` hoặc `.into_iter()` tùy theo nhu cầu.

## 📝 Bài tập về nhà

### Bài tập 1: Kiểm tra số nguyên tố
Viết một chương trình xác định xem một số có phải là số nguyên tố hay không, sử dụng các cấu trúc điều khiển và vòng lặp đã học.

### Bài tập 2: FizzBuzz
Viết chương trình FizzBuzz cổ điển: In ra các số từ 1 đến 100, nhưng với các số chia hết cho 3 thì in "Fizz", các số chia hết cho 5 thì in "Buzz", và các số chia hết cho cả 3 và 5 thì in "FizzBuzz".

### Bài tập 3: Tam giác Pascal
Viết chương trình in ra n hàng đầu tiên của tam giác Pascal, sử dụng các vòng lặp lồng nhau.

### Bài tập 4: Chuyển đổi nhiệt độ
Viết một chương trình cho phép người dùng chọn chuyển đổi từ độ C sang độ F hoặc ngược lại, sử dụng `if` như một biểu thức để thực hiện phép tính.

### Bài tập 5: Thuật toán tìm kiếm nhị phân
Viết thuật toán tìm kiếm nhị phân sử dụng vòng lặp `while` hoặc `loop`. Chương trình nên trả về vị trí của phần tử trong mảng đã sắp xếp, hoặc `None` nếu không tìm thấy.

### Lời giải cho bài tập về nhà 1: Kiểm tra số nguyên tố

```rust
fn is_prime(n: u32) -> bool {
    if n <= 1 {
        return false;
    }
    
    if n <= 3 {
        return true;
    }
    
    if n % 2 == 0 || n % 3 == 0 {
        return false;
    }
    
    let mut i = 5;
    while i * i <= n {
        if n % i == 0 || n % (i + 2) == 0 {
            return false;
        }
        i += 6;
    }
    
    true
}

fn main() {
    let test_numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 17, 19, 23, 27];
    
    for &num in &test_numbers {
        if is_prime(num) {
            println!("{} là số nguyên tố", num);
        } else {
            println!("{} không phải là số nguyên tố", num);
        }
    }
}
```

**Giải thích thuật toán kiểm tra số nguyên tố:**
1. Số nguyên tố là số lớn hơn 1 và chỉ chia hết cho 1 và chính nó
2. Kiểm tra các trường hợp đặc biệt: n ≤ 1 (không phải số nguyên tố), n = 2 hoặc n = 3 (là số nguyên tố)
3. Kiểm tra nhanh các số chia hết cho 2 hoặc 3
4. Sử dụng một thuật toán tối ưu: mọi số nguyên tố lớn hơn 3 đều có dạng 6k ± 1
5. Chỉ cần kiểm tra các ước số đến căn bậc hai của n