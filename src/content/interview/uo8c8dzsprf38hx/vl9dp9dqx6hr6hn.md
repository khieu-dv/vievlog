---
title: "Ngôn Ngữ Lập Trình - Câu Hỏi Phỏng Vấn Backend (19-26)"
postId: "vl9dp9dqx6hr6hn"
category: "BackEnd Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Ngôn Ngữ Lập Trình - Câu Hỏi Phỏng Vấn Backend (19-26)


### Câu 19: Ba nhược điểm lớn nhất của ngôn ngữ lập trình yêu thích?

**Java:**
1. **Cú pháp dài dòng:** Cần viết nhiều code cho các tác vụ đơn giản.
   ```java
   class Person {
       private String name;
       public String getName() { return name; } // Cần viết getter/setter
   }
   ```
   So với Kotlin: `data class Person(val name: String)` (ngắn gọn hơn).
2. **Thời gian khởi động chậm:** JVM tốn thời gian khởi động ứng dụng.
3. **Tốn bộ nhớ:** Mỗi đối tượng có chi phí bộ nhớ bổ sung (header, reference).

**Python:**
1. **Hiệu năng thấp:** Global Interpreter Lock (GIL) cản trở xử lý song song.
   ```python
   def task():  # Không chạy song song vì GIL
       for i in range(1000000): pass
   ```
2. **Lỗi runtime:** Không kiểm tra kiểu lúc biên dịch.
   ```python
   def divide(a, b): return a / b
   divide("10", 2)  # Lỗi TypeError lúc chạy
   ```
3. **Quản lý phụ thuộc phức tạp:** Các gói có thể xung đột phiên bản.

**Go:**
1. **Xử lý lỗi dài dòng:**
   ```go
   file, err := os.Open("file.txt")
   if err != nil { return err }  // Lặp lại nhiều lần
   ```
2. **Thiếu generics (trước Go 1.18):** Cần viết hàm riêng cho từng kiểu.
3. **Quản lý gói phức tạp:** Phụ thuộc phiên bản có thể gây lỗi.

\---

### Câu 20: Tại sao lập trình hàm (Functional Programming) được quan tâm?

**Lý do:**
1. **Không thay đổi trạng thái (Immutability):** Giảm lỗi do dữ liệu bị thay đổi.
   ```java
   class BankAccount {
       final double balance;
       BankAccount deposit(double amount) {
           return new BankAccount(balance + amount); // Tạo mới, an toàn
       }
   }
   ```
2. **Dễ song song hóa:** Code hàm dễ chia nhỏ để xử lý song song.
   ```java
   numbers.parallelStream().map(x -> x * 2); // Tự động song song
   ```
3. **Kết quả dự đoán được:** Hàm thuần (pure function) cho kết quả nhất quán.
   ```javascript
   function add(a, b) { return a + b; } // Luôn trả cùng kết quả
   ```
4. **Code dễ đọc:** Kiểu khai báo (declarative) rõ ràng hơn.
   ```java
   people.stream().filter(p -> p.getAge() > 18).map(Person::getName);
   ```
5. **Nền tảng toán học:** Dựa trên lambda calculus, dễ kiểm chứng.

**Khái niệm chính:**
- Hàm bậc cao (Higher-Order Functions): Nhận hoặc trả về hàm.
- Đệ quy thay vòng lặp.
- So khớp mẫu (Pattern Matching).

\---

### Câu 21: Closure là gì và tác dụng?

**Định nghĩa:** Closure là hàm có thể truy cập biến từ phạm vi bên ngoài, ngay cả khi hàm bên ngoài đã kết thúc.

**Ví dụ:**
```javascript
function outer(x) {
    function inner(y) { return x + y; } // Dùng biến 'x' từ outer
    return inner;
}
const addFive = outer(5);
console.log(addFive(3)); // 8
```

**Tác dụng:**
1. **Ẩn dữ liệu (Encapsulation):**
   ```javascript
   function createCounter() {
       let count = 0; // Riêng tư
       return {
           increment: () => ++count,
           getCount: () => count
       };
   }
   ```
2. **Tạo hàm (Factory Functions):** Tạo hàm với cấu hình khác nhau.
3. **Xử lý sự kiện:** Giữ trạng thái trong hàm xử lý sự kiện.
4. **Gọi bất đồng bộ:** Theo dõi thời gian hoặc trạng thái.

**Lưu ý:** Cẩn thận với rò rỉ bộ nhớ nếu giữ tham chiếu không cần thiết.

\---

### Câu 22: Generics có tác dụng gì?

**Định nghĩa:** Generics cho phép viết code với kiểu dữ liệu linh hoạt, kiểm tra lúc biên dịch.

**Lợi ích:**
1. **An toàn kiểu (Type Safety):**
   ```java
   List<String> list = new ArrayList<>();
   list.add("Hello");
   // list.add(42); // Lỗi biên dịch
   ```
2. **Tái sử dụng code:**
   ```java
   class Box<T> {
       T value;
       void set(T value) { this.value = value; }
   }
   Box<Integer> intBox = new Box<>();
   Box<String> strBox = new Box<>();
   ```
3. **Tăng hiệu năng:** Tránh boxing/unboxing không cần thiết.
4. **Kiểm tra lỗi sớm:** Phát hiện lỗi tại compile time.

**Ví dụ nâng cao:**
- Bounded Types: `class NumberBox<T extends Number>`.
- Wildcards: `List<? extends Number>`.

**Lưu ý:** Ở Java, type erasure xóa thông tin kiểu lúc chạy.

\---

### Câu 23: Higher-Order Functions là gì?

**Định nghĩa:** Hàm bậc cao là hàm nhận hàm khác làm tham số hoặc trả về hàm.

**Ví dụ:**
```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // map là higher-order function
```

**Ví dụ trả về hàm:**
```javascript
function createMultiplier(factor) {
    return x => x * factor;
}
const double = createMultiplier(2); // Trả về hàm nhân đôi
console.log(double(5)); // 10
```

**Ứng dụng:**
1. **Tái sử dụng:** Tạo hàm sort linh hoạt.
2. **Trừu tượng:** Tạo logic retry hoặc memoization.
3. **Lập trình hàm:** Hỗ trợ map, filter, reduce.

**Ví dụ Java:**
```java
List<String> transform(List<Integer> list, Function<Integer, String> mapper) {
    return list.stream().map(mapper).collect(toList());
}
```

\---

### Câu 24: Static Typing vs Dynamic Typing?

**Static Typing (Kiểu tĩnh):**
- Kiểm tra kiểu lúc biên dịch.
- Biến có kiểu cố định.
- Ví dụ (Java):
  ```java
  String name = "John";
  // name = 42; // Lỗi biên dịch
  ```

**Dynamic Typing (Kiểu động):**
- Kiểm tra kiểu lúc chạy.
- Biến có thể đổi kiểu.
- Ví dụ (Python):
  ```python
  value = "Hello"  # String
  value = 42       # Integer
  ```

**So sánh:**
| Tiêu chí | Static Typing | Dynamic Typing |
|----------|---------------|----------------|
| Phát hiện lỗi | Lúc biên dịch | Lúc chạy |
| Hiệu năng | Nhanh hơn | Chậm hơn |
| Phát triển | Chậm hơn ban đầu | Nhanh hơn |
| Hỗ trợ IDE | Tốt | Hạn chế |
| Refactor | An toàn | Rủi ro |

**Ưu điểm Static Typing:**
- Phát hiện lỗi sớm, hỗ trợ IDE tốt, hiệu năng cao.

**Ưu điểm Dynamic Typing:**
- Phát triển nhanh, linh hoạt, hỗ trợ metaprogramming.

**Cách kết hợp:** Dùng type hints (Python) hoặc TypeScript để cân bằng.

\---

### Câu 25: Stack vs Heap?

**Stack (Ngăn xếp):**
- Lưu biến cục bộ, thông tin gọi hàm.
- Quản lý tự động, nhanh, kích thước giới hạn.
- Ví dụ:
  ```java
  void method() {
      int x = 10; // Lưu trên stack
  }
  ```

**Heap (Đống):**
- Lưu đối tượng, mảng, dữ liệu động.
- Quản lý thủ công (C/C++) hoặc bằng Garbage Collection (Java).
- Ví dụ:
  ```java
  String str = new String("Hello"); // Lưu trên heap
  ```

**So sánh:**
| Tiêu chí | Stack | Heap |
|----------|-------|------|
| Tốc độ | Nhanh | Chậm hơn |
| Quản lý | Tự động | Thủ công/GC |
| Kích thước | Nhỏ | Lớn |
| Rủi ro | Stack Overflow | Memory Leak |

**Lưu ý:**
- Stack: Tránh đệ quy sâu.
- Heap: Theo dõi rò rỉ bộ nhớ, dùng công cụ profiler.

\---

### Câu 26: Pattern Matching vs Switch?

**Switch (Câu lệnh switch truyền thống):**
- So sánh giá trị đơn giản, cần `break`, không kiểm tra đầy đủ trường hợp.
- Ví dụ (Java):
  ```java
  String processDay(int day) {
      switch (day) {
          case 1: return "Monday";
          default: return "Invalid";
      }
  }
  ```

**Pattern Matching:**
- Hỗ trợ phân rã cấu trúc, điều kiện, kiểm tra đầy đủ trường hợp.
- Ví dụ (Scala):
  ```scala
  def calculateArea(shape: Shape): Double = shape match {
      case Circle(radius) => Math.PI * radius * radius
      case Rectangle(w, h) => w * h
  }
  ```

**So sánh:**
| Tiêu chí | Switch | Pattern Matching |
|----------|--------|------------------|
| Phân rã | Không | Có |
| Điều kiện | Hạn chế | Linh hoạt |
| Kiểm tra đầy đủ | Không | Có |
| Độ rõ ràng | Dài dòng | Ngắn gọn |

**Khi nào dùng:**
- Switch: So sánh đơn giản, hiệu năng cao.
- Pattern Matching: Cấu trúc dữ liệu phức tạp, cần kiểm tra đầy đủ.


---

*Post ID: vl9dp9dqx6hr6hn*  
*Category: BackEnd Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*
