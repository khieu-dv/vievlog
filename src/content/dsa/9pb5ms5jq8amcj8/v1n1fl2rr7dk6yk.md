---
title: "Ngăn Xếp (Stack)"
postId: "v1n1fl2rr7dk6yk"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Ngăn Xếp (Stack)



## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Stack** là gì và nguyên tắc **LIFO** (vào sau, ra trước).
- Phân biệt Stack với Queue và các cấu trúc dữ liệu khác.
- Cài đặt Stack bằng JavaScript (Array hoặc Linked List).
- Áp dụng Stack vào bài toán như kiểm tra dấu ngoặc, lịch sử duyệt web.
- So sánh các cách cài đặt và chọn cách phù hợp.

## 📝 Nội Dung Chi Tiết

### Stack Là Gì?

**Stack (Ngăn xếp)** là một cấu trúc dữ liệu hoạt động theo nguyên tắc **LIFO** (Last In, First Out - vào sau, ra trước). Phần tử thêm vào sau cùng sẽ được lấy ra trước, giống như chồng đĩa: bạn chỉ lấy được đĩa ở trên cùng.

**Ví dụ thực tế**:
- Chồng sách trên bàn: sách đặt sau cùng được lấy đầu tiên.
- Nút "Quay lại" trong trình duyệt: trang web mới nhất được quay lại trước.

![Stack](https://www.vievlog.com/dsa/images/stack.jpeg)

*Minh họa Stack với LIFO*

### Cách Hoạt Động

Stack có hai thao tác chính:
1. **Push**: Thêm phần tử vào **đỉnh** stack.
2. **Pop**: Lấy phần tử từ **đỉnh** stack.

**Ví dụ minh họa**:
```
Stack rỗng: []
Push("A"): [A]
Push("B"): [A, B]
Push("C"): [A, B, C]
Pop(): Lấy "C", còn [A, B]
Pop(): Lấy "B", còn [A]
```

### So Sánh Với Cấu Trúc Khác

| Đặc Điểm     | Stack (LIFO)        | Queue (FIFO)         | Array         |
|--------------|---------------------|----------------------|---------------|
| Thêm         | Đỉnh stack          | Cuối queue           | Bất kỳ        |
| Lấy          | Đỉnh stack          | Đầu queue            | Bất kỳ        |
| Nguyên tắc   | Vào sau, ra trước   | Vào trước, ra trước  | Tự do         |
| Ứng dụng     | Undo/Redo           | Xử lý công việc      | Linh hoạt     |

### Cài Đặt Stack bằng JavaScript

#### Cách 1: Dùng Array (Khuyến nghị)

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  // Thêm vào đỉnh - O(1)
  push(value) {
    this.items.push(value);
  }

  // Lấy từ đỉnh - O(1)
  pop() {
    return this.items.length === 0 ? null : this.items.pop();
  }

  // Xem đỉnh - O(1)
  peek() {
    return this.items.length === 0 ? null : this.items[this.items.length - 1];
  }

  // Kiểm tra rỗng - O(1)
  isEmpty() {
    return this.items.length === 0;
  }

  // Lấy kích thước - O(1)
  size() {
    return this.items.length;
  }

  // Hiển thị stack
  toString() {
    return `[${this.items.join(' -> ')}]`;
  }
}
```

**Ưu điểm**:
- Thêm/lấy nhanh (O(1)).
- Đơn giản, dễ sử dụng.
- Tiết kiệm bộ nhớ.

#### Cách 2: Dùng Linked List

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedListStack {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Thêm vào đỉnh - O(1)
  push(value) {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
    this.size++;
  }

  // Lấy từ đỉnh - O(1)
  pop() {
    if (this.isEmpty()) return null;
    const value = this.head.value;
    this.head = this.head.next;
    this.size--;
    return value;
  }

  // Xem đỉnh - O(1)
  peek() {
    return this.isEmpty() ? null : this.head.value;
  }

  // Kiểm tra rỗng - O(1)
  isEmpty() {
    return this.size === 0;
  }

  // Lấy kích thước - O(1)
  size() {
    return this.size;
  }

  // Hiển thị stack
  toString() {
    let result = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return `[${result.join(' -> ')}]`;
  }
}
```

**Ưu điểm**:
- Linh hoạt, không cần biết kích thước trước.
- Thêm/lấy nhanh (O(1)).
**Nhược điểm**:
- Dùng nhiều bộ nhớ hơn do con trỏ.
- Phức tạp hơn để cài đặt.

### So Sánh Cài Đặt

| Cách Cài Đặt | Push | Pop | Peek | Kích Thước | Bộ Nhớ     |
|--------------|------|-----|------|------------|------------|
| Array        | O(1) | O(1) | O(1) | O(1)       | Tiết kiệm  |
| Linked List  | O(1) | O(1) | O(1) | O(1)       | Nhiều hơn  |

**Kết luận**: Array-based Stack là lựa chọn tốt nhất vì đơn giản và hiệu quả.

### Ví Dụ Minh Hóa

#### Ví Dụ: Lịch Sử Duyệt Web

```javascript
const stack = new Stack();

function visitPage(url) {
  stack.push(url);
  console.log(`🌐 Truy cập: ${url}`);
}

function goBack() {
  const current = stack.pop();
  const previous = stack.peek();
  if (previous) {
    console.log(`⬅️ Quay lại từ ${current} đến ${previous}`);
    return previous;
  }
  console.log('❌ Không thể quay lại thêm');
  return null;
}

// Demo
visitPage('google.com');
visitPage('github.com');
visitPage('stackoverflow.com');
console.log('Trang hiện tại:', stack.peek()); // stackoverflow.com
goBack(); // Từ stackoverflow.com đến github.com
goBack(); // Từ github.com đến google.com
goBack(); // Không thể quay lại
```

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Kiểm Tra Dấu Ngoặc

**Đề bài**: Xây dựng chương trình kiểm tra dấu ngoặc có cân bằng:
- Hỗ trợ 3 loại ngoặc: (), [], {}.
- Báo lỗi nếu ngoặc không khớp hoặc thiếu.
- Hiển thị vị trí lỗi và gợi ý sửa.

```javascript
class BracketChecker {
  constructor() {
    this.stack = new Stack();
    this.pairs = { ')': '(', ']': '[', '}': '{' };
  }

  check(input) {
    this.stack = new Stack();
    const errors = [];

    console.log(`🔍 Kiểm tra: "${input}"`);
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if ('([{'.includes(char)) {
        this.stack.push({ char, pos: i + 1 });
        console.log(`- Thêm '${char}' tại vị trí ${i + 1}`);
      } else if (')]}'.includes(char)) {
        const top = this.stack.pop();
        if (!top) {
          errors.push(`Dư ngoặc đóng '${char}' tại vị trí ${i + 1}`);
          console.log(`❌ Dư '${char}' tại ${i + 1}`);
        } else if (top.char !== this.pairs[char]) {
          errors.push(`Không khớp: '${char}' tại ${i + 1}, cần '${this.pairs[char]}' tại ${top.pos}`);
          console.log(`❌ Không khớp '${char}' với '${top.char}'`);
        } else {
          console.log(`✅ Khớp '${top.char}' với '${char}'`);
        }
      }
    }

    while (!this.stack.isEmpty()) {
      const top = this.stack.pop();
      errors.push(`Thiếu ngoặc đóng cho '${top.char}' tại vị trí ${top.pos}`);
      console.log(`❌ Thiếu đóng cho '${top.char}' tại ${top.pos}`);
    }

    console.log('\n📊 Kết quả:');
    if (errors.length === 0) {
      console.log('✅ Cân bằng!');
    } else {
      console.log(`❌ Không cân bằng, lỗi: ${errors.join(', ')}`);
    }

    return errors.length === 0;
  }
}

// Demo
const checker = new BracketChecker();
checker.check('{[()]}'); // Cân bằng
checker.check('{[}'); // Không khớp
checker.check('((('); // Thiếu đóng
checker.check('))'); // Dư đóng
```

**Giải thích**:
- Dùng Stack để lưu ngoặc mở.
- Khi gặp ngoặc đóng, kiểm tra khớp với ngoặc mở trên đỉnh.
- Báo lỗi chi tiết nếu không khớp hoặc thiếu/dư.

### Bài Tập 2: Máy Tính Đơn Giản

**Đề bài**: Xây dựng máy tính xử lý biểu thức số học:
- Chuyển biểu thức trung tố (infix) sang hậu tố (postfix).
- Tính kết quả từ biểu thức hậu tố.
- Hỗ trợ +, -, *, / và ().
- Báo lỗi nếu biểu thức không hợp lệ.

```javascript
class Calculator {
  constructor() {
    this.precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
  }

  infixToPostfix(expr) {
    const tokens = expr.replace(/\s+/g, '').match(/(\d+|[+\-*/()])/g) || [];
    const output = [];
    const stack = new Stack();

    for (const token of tokens) {
      if (!isNaN(token)) {
        output.push(token);
      } else if ('+-*/'.includes(token)) {
        while (!stack.isEmpty() && stack.peek() !== '(' && 
               this.precedence[stack.peek()] >= this.precedence[token]) {
          output.push(stack.pop());
        }
        stack.push(token);
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (!stack.isEmpty() && stack.peek() !== '(') {
          output.push(stack.pop());
        }
        if (stack.peek() === '(') stack.pop();
        else throw new Error('Thiếu ngoặc mở');
      }
    }

    while (!stack.isEmpty()) {
      const op = stack.pop();
      if (op === '(') throw new Error('Thiếu ngoặc đóng');
      output.push(op);
    }

    return output.join(' ');
  }

  evaluatePostfix(postfix) {
    const stack = new Stack();
    const tokens = postfix.split(' ');

    for (const token of tokens) {
      if (!isNaN(token)) {
        stack.push(parseFloat(token));
      } else if ('+-*/'.includes(token)) {
        if (stack.size() < 2) throw new Error('Biểu thức không đủ toán hạng');
        const b = stack.pop();
        const a = stack.pop();
        switch (token) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': 
            if (b === 0) throw new Error('Chia cho 0');
            stack.push(a / b); break;
        }
      }
    }

    if (stack.size() !== 1) throw new Error('Biểu thức không hợp lệ');
    return stack.pop();
  }

  calculate(expr) {
    try {
      console.log(`🧮 Tính: ${expr}`);
      const postfix = this.infixToPostfix(expr);
      console.log(`Postfix: ${postfix}`);
      const result = this.evaluatePostfix(postfix);
      console.log(`Kết quả: ${result}`);
      return result;
    } catch (error) {
      console.log(`❌ Lỗi: ${error.message}`);
      return null;
    }
  }
}

// Demo
const calc = new Calculator();
calc.calculate('3 + 4 * 2'); // 11
calc.calculate('(3 + 4) * 2'); // 14
calc.calculate('3 + 4 * 2 / (1 - 5)'); // 1
```

**Giải thích**:
- **infixToPostfix**: Dùng Stack để chuyển biểu thức trung tố sang hậu tố, xử lý độ ưu tiên toán tử.
- **evaluatePostfix**: Dùng Stack để tính toán biểu thức hậu tố.
- Báo lỗi chi tiết cho các trường hợp không hợp lệ.

## 🔑 Những Điểm Quan Trọng

### Khái Niệm Cốt Lõi
1. **LIFO**: Vào sau, ra trước.
2. **Thao tác chính**: `push` (thêm đỉnh), `pop` (lấy đỉnh).
3. **Chỉ truy cập đỉnh**: Không thể lấy phần tử ở giữa.

### Ưu Điểm
- **Đơn giản**: Dễ cài đặt với Array.
- **Hiệu quả**: Push/pop là O(1).
- **Ứng dụng nhiều**: Phù hợp với Undo, lịch sử duyệt web, xử lý biểu thức.

### Lỗi Thường Gặp
1. **Không kiểm tra rỗng**:
   ```javascript
   // Sai
   stack.pop(); // Lỗi nếu rỗng
   // Đúng
   if (!stack.isEmpty()) stack.pop();
   ```
2. **Nhầm peek và pop**:
   ```javascript
   stack.peek(); // Chỉ xem
   stack.pop(); // Lấy ra
   ```
3. **Tràn stack**:
   ```javascript
   // Sai: Gọi đệ quy vô hạn
   function bad() { bad(); }
   // Đúng: Có điều kiện dừng
   function good(n) { if (n <= 0) return; good(n - 1); }
   ```

### So Sánh Stack vs Queue

| Đặc Điểm     | Stack (LIFO)        | Queue (FIFO)         |
|--------------|---------------------|----------------------|
| Truy cập     | Mới nhất trước      | Cũ nhất trước        |
| Ví dụ        | Chồng sách          | Hàng đợi             |
| Ứng dụng     | Undo, biểu thức     | Công việc tuần tự    |

### Ứng Dụng Thực Tế
1. **Undo/Redo**: Lưu lịch sử thao tác.
2. **Lịch sử duyệt web**: Quay lại/trở về trang.
3. **Xử lý biểu thức**: Tính toán hoặc kiểm tra ngoặc.
4. **Đệ quy**: Quản lý lời gọi hàm.

### Hiệu Suất

| Thao tác | Array Stack | LinkedList Stack |
|----------|-------------|------------------|
| Push     | O(1)        | O(1)             |
| Pop      | O(1)        | O(1)             |
| Peek     | O(1)        | O(1)             |
| Size     | O(1)        | O(1)             |
| Bộ nhớ   | Tiết kiệm   | Nhiều hơn        |

**Kết luận**: Array-based Stack là lựa chọn tốt nhất.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Theo Dõi Lời Gọi Hàm
Xây dựng hệ thống theo dõi lời gọi hàm:
- Ghi lại tên hàm và thời gian gọi.
- Theo dõi độ sâu lời gọi (call depth).
- Hiển thị cây lời gọi (call tree).
- Phát hiện đệ quy quá sâu.

**Gợi ý**: Dùng Stack để lưu trạng thái lời gọi, thêm thời gian và độ sâu.

### Bài Tập 2: Trình Phân Tích Biểu Thức
Xây dựng trình phân tích biểu thức:
- Hỗ trợ cú pháp của nhiều ngôn ngữ (JS, Python).
- Xử lý toán tử tùy chỉnh (+, -, *, /, ^).
- Tạo cây cú pháp (AST) từ biểu thức.
- Báo lỗi cú pháp chi tiết.

**Gợi ý**: Dùng nhiều Stack để quản lý toán tử, toán hạng và phạm vi.



---

*Post ID: v1n1fl2rr7dk6yk*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
