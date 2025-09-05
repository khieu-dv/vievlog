---
title: "Hàng Đợi (Queue)"
postId: "jtf8804y8kvt8ub"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Hàng Đợi (Queue)


## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Queue** là gì và nguyên tắc **FIFO** (vào trước, ra trước).
- Phân biệt Queue với Stack và các cấu trúc dữ liệu khác.
- Cài đặt Queue bằng JavaScript (Linked List hoặc Array).
- Áp dụng Queue vào bài toán thực tế như xử lý công việc.
- So sánh các cách cài đặt và chọn cách phù hợp.

## 📝 Nội Dung Chi Tiết

### Queue Là Gì?

**Queue (Hàng đợi)** là một cấu trúc dữ liệu hoạt động theo nguyên tắc **FIFO** (First In, First Out - vào trước, ra trước). Ai đến trước sẽ được xử lý trước, giống như xếp hàng mua vé.

**Ví dụ thực tế**: 
- Tại quầy thanh toán siêu thị, khách đến trước được tính tiền trước.
- Trong ứng dụng, công việc gửi email được xử lý theo thứ tự.

![Queue](https://www.vievlog.com/dsa/images/queue.jpeg)

*Minh họa Queue với FIFO*

### Cách Hoạt Động

Queue có hai thao tác chính:
1. **Enqueue**: Thêm phần tử vào **cuối** hàng đợi.
2. **Dequeue**: Lấy phần tử từ **đầu** hàng đợi.

**Ví dụ minh họa**:
```
Hàng đợi rỗng: []
Enqueue("An"): [An]
Enqueue("Bình"): [An, Bình]
Enqueue("Cường"): [An, Bình, Cường]
Dequeue(): Lấy "An", còn [Bình, Cường]
Dequeue(): Lấy "Bình", còn [Cường]
```

### So Sánh Với Cấu Trúc Khác

| Đặc Điểm | Queue (FIFO) | Stack (LIFO) | Array |
|----------|--------------|--------------|-------|
| Thêm     | Cuối hàng    | Đầu stack    | Bất kỳ |
| Lấy      | Đầu hàng     | Đầu stack    | Bất kỳ |
| Nguyên tắc | Vào trước, ra trước | Vào sau, ra trước | Tự do |
| Ứng dụng | Xử lý công việc | Undo/Redo | Linh hoạt |

### Cài Đặt Queue bằng JavaScript

#### Cách 1: Dùng Linked List (Khuyến nghị)

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class Queue {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Thêm vào cuối hàng - O(1)
  enqueue(value) {
    const node = new Node(value);
    if (this.isEmpty()) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
  }

  // Lấy từ đầu hàng - O(1)
  dequeue() {
    if (this.isEmpty()) return null;
    const value = this.head.value;
    this.head = this.head.next;
    this.size--;
    if (this.isEmpty()) this.tail = null;
    return value;
  }

  // Xem đầu hàng - O(1)
  peek() {
    return this.isEmpty() ? null : this.head.value;
  }

  // Kiểm tra rỗng - O(1)
  isEmpty() {
    return this.size === 0;
  }

  // Lấy kích thước - O(1)
  getSize() {
    return this.size;
  }

  // Hiển thị hàng đợi
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
- Thêm/lấy đều nhanh (O(1)).
- Không cần biết kích thước trước.
- Tiết kiệm bộ nhớ, tự mở rộng.

#### Cách 2: Dùng Array (Đơn giản)

```javascript
class SimpleQueue {
  constructor() {
    this.items = [];
  }

  // Thêm vào cuối - O(1)
  enqueue(value) {
    this.items.push(value);
  }

  // Lấy từ đầu - O(n)
  dequeue() {
    return this.items.length === 0 ? null : this.items.shift();
  }

  // Xem đầu hàng - O(1)
  peek() {
    return this.items.length === 0 ? null : this.items[0];
  }

  // Kiểm tra rỗng - O(1)
  isEmpty() {
    return this.items.length === 0;
  }

  // Lấy kích thước - O(1)
  getSize() {
    return this.items.length;
  }

  // Hiển thị
  toString() {
    return `[${this.items.join(' -> ')}]`;
  }
}
```

**Nhược điểm**:
- `dequeue()` chậm (O(n)) vì phải dịch chuyển mảng.
- Không phù hợp với hàng đợi lớn.

#### Cách 3: Circular Queue (Tối ưu)

```javascript
class CircularQueue {
  constructor(capacity = 10) {
    this.items = new Array(capacity);
    this.capacity = capacity;
    this.front = 0;
    this.rear = 0;
    this.count = 0;
  }

  // Kiểm tra đầy - O(1)
  isFull() {
    return this.count === this.capacity;
  }

  // Kiểm tra rỗng - O(1)
  isEmpty() {
    return this.count === 0;
  }

  // Thêm vào cuối - O(1)
  enqueue(value) {
    if (this.isFull()) throw new Error('Queue full');
    this.items[this.rear] = value;
    this.rear = (this.rear + 1) % this.capacity;
    this.count++;
  }

  // Lấy từ đầu - O(1)
  dequeue() {
    if (this.isEmpty()) return null;
    const value = this.items[this.front];
    this.items[this.front] = undefined;
    this.front = (this.front + 1) % this.capacity;
    this.count--;
    return value;
  }

  // Xem đầu hàng - O(1)
  peek() {
    return this.isEmpty() ? null : this.items[this.front];
  }

  // Lấy kích thước - O(1)
  getSize() {
    return this.count;
  }
}
```

**Ưu điểm**:
- Thêm/lấy nhanh (O(1)).
- Tiết kiệm bộ nhớ với kích thước cố định.
**Nhược điểm**:
- Cần biết kích thước tối đa.
- Phức tạp hơn để cài đặt.

### Ví Dụ Minh Hóa

#### Ví Dụ: Xử Lý Công Việc

```javascript
const queue = new Queue();
queue.enqueue({ id: 1, task: 'Gửi email' });
queue.enqueue({ id: 2, task: 'Sao lưu dữ liệu' });
queue.enqueue({ id: 3, task: 'Tạo báo cáo' });

console.log('Công việc:', queue.getSize()); // 3
while (!queue.isEmpty()) {
  const task = queue.dequeue();
  console.log(`Đang xử lý: ${task.task}`);
}
// Output:
// Công việc: 3
// Đang xử lý: Gửi email
// Đang xử lý: Sao lưu dữ liệu
// Đang xử lý: Tạo báo cáo
```

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Hệ Thống Xử Lý Đơn Hàng

**Đề bài**: Xây dựng hệ thống xử lý đơn hàng cho cửa hàng online:
- Đơn hàng xử lý theo thứ tự đến (FIFO).
- Theo dõi trạng thái: chờ, đang xử lý, hoàn thành.
- Báo cáo: tổng đơn, thời gian chờ trung bình.
- Xử lý lỗi: hết hàng, thanh toán thất bại.

**Code giải**:

```javascript
class Order {
  constructor(id, customer, total) {
    this.id = id;
    this.customer = customer;
    this.total = total;
    this.status = 'pending';
    this.createdAt = new Date();
  }

  toString() {
    return `Đơn #${this.id} - ${this.customer} ($${this.total}) [${this.status}]`;
  }

  getWaitTime() {
    return new Date() - this.createdAt;
  }
}

class OrderSystem {
  constructor() {
    this.queue = new Queue();
    this.completed = [];
    this.failed = [];
    this.orderId = 1;
  }

  createOrder(customer, total) {
    const order = new Order(this.orderId++, customer, total);
    this.queue.enqueue(order);
    console.log(`✅ Tạo đơn: ${order.toString()}`);
    return order;
  }

  processNext() {
    if (this.queue.isEmpty()) {
      console.log('📭 Không có đơn hàng');
      return;
    }
    const order = this.queue.dequeue();
    order.status = 'processing';
    console.log(`🔄 Xử lý: ${order.toString()}`);

    // Mô phỏng xử lý
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% thành công
        order.status = 'completed';
        this.completed.push(order);
        console.log(`✅ Hoàn thành: ${order.toString()}`);
      } else {
        order.status = 'failed';
        this.failed.push(order);
        console.log(`❌ Thất bại: ${order.toString()}`);
      }
    }, 1000);
  }

  getStats() {
    const total = this.completed.length + this.failed.length + this.queue.getSize();
    const avgWait = this.completed.length > 0
      ? this.completed.reduce((sum, order) => sum + order.getWaitTime(), 0) / this.completed.length
      : 0;
    console.log(`\n📊 BÁO CÁO`);
    console.log(`- Tổng đơn: ${total}`);
    console.log(`- Hoàn thành: ${this.completed.length}`);
    console.log(`- Thất bại: ${this.failed.length}`);
    console.log(`- Đang chờ: ${this.queue.getSize()}`);
    console.log(`- Thời gian chờ trung bình: ${Math.round(avgWait)}ms`);
  }

  runDemo() {
    console.log('🛒 DEMO XỬ LÝ ĐƠN HÀNG\n');
    this.createOrder('An', 100);
    this.createOrder('Bình', 200);
    this.createOrder('Cường', 50);
    this.processNext();
    setTimeout(() => this.processNext(), 1500);
    setTimeout(() => {
      this.processNext();
      this.getStats();
    }, 3000);
  }
}

const system = new OrderSystem();
system.runDemo();
```

**Giải thích**:
- **Order**: Lưu thông tin đơn hàng và trạng thái.
- **OrderSystem**: Dùng Queue để xử lý đơn theo FIFO.
- **processNext**: Xử lý từng đơn, mô phỏng thành công/thất bại.

### Bài Tập 2: Hệ Thống Hỗ Trợ Khách Hàng

**Đề bài**: Xây dựng hệ thống hỗ trợ khách hàng:
- Có 3 cấp độ hỗ trợ: cơ bản, kỹ thuật, cao cấp.
- Mỗi cấp có hàng đợi riêng, xử lý theo FIFO.
- Vé hỗ trợ có thể chuyển cấp (escalate).
- Theo dõi thời gian xử lý (SLA).
- Báo cáo trạng thái vé.

**Code giải**:

```javascript
class Ticket {
  constructor(id, customer, issue, level = 1) {
    this.id = id;
    this.customer = customer;
    this.issue = issue;
    this.level = level;
    this.status = 'open';
    this.createdAt = new Date();
  }

  escalate() {
    if (this.level < 3) this.level++;
    console.log(`⬆️ Chuyển vé #${this.id} lên cấp ${this.level}`);
  }

  toString() {
    return `Vé #${this.id} - ${this.customer} (Cấp ${this.level}) [${this.status}]`;
  }
}

class SupportAgent {
  constructor(name, level) {
    this.name = name;
    this.level = level;
    this.tickets = [];
  }

  assignTicket(ticket) {
    if (ticket.level === this.level) {
      this.tickets.push(ticket);
      ticket.status = 'assigned';
      console.log(`👤 ${this.name} nhận: ${ticket.toString()}`);
      return true;
    }
    return false;
  }

  resolveTicket(ticketId) {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = 'resolved';
      this.tickets = this.tickets.filter(t => t.id !== ticketId);
      console.log(`✅ ${this.name} giải quyết: ${ticket.toString()}`);
      return ticket;
    }
    return null;
  }
}

class SupportSystem {
  constructor() {
    this.queues = [null, new Queue(), new Queue(), new Queue()];
    this.agents = [];
    this.tickets = new Map();
    this.ticketId = 1;
    this.setupAgents();
  }

  setupAgents() {
    this.agents.push(new SupportAgent('Alice', 1));
    this.agents.push(new SupportAgent('Bob', 2));
    this.agents.push(new SupportAgent('Carol', 3));
  }

  createTicket(customer, issue, level = 1) {
    const ticket = new Ticket(this.ticketId++, customer, issue, level);
    this.tickets.set(ticket.id, ticket);
    this.queues[level].enqueue(ticket);
    console.log(`🎫 Tạo vé: ${ticket.toString()}`);
    this.assignTickets();
    return ticket;
  }

  assignTickets() {
    for (let level = 1; level <= 3; level++) {
      const queue = this.queues[level];
      const agents = this.agents.filter(a => a.level === level);
      while (!queue.isEmpty() && agents.length > 0) {
        const ticket = queue.dequeue();
        for (let agent of agents) {
          if (agent.assignTicket(ticket)) break;
        }
      }
    }
  }

  escalateTicket(ticketId) {
    const ticket = this.tickets.get(ticketId);
    if (ticket && ticket.level < 3) {
      ticket.escalate();
      this.queues[ticket.level].enqueue(ticket);
      this.assignTickets();
    }
  }

  resolveTicket(ticketId) {
    for (let agent of this.agents) {
      const ticket = agent.resolveTicket(ticketId);
      if (ticket) return ticket;
    }
    return null;
  }

  getStats() {
    console.log(`\n📊 BÁO CÁO HỖ TRỢ`);
    for (let level = 1; level <= 3; level++) {
      console.log(`- Cấp ${level}: ${this.queues[level].getSize()} vé`);
    }
    console.log(`- Tổng vé: ${this.tickets.size}`);
  }

  runDemo() {
    console.log('📞 DEMO HỖ TRỢ KHÁCH HÀNG\n');
    this.createTicket('An', 'Không đăng nhập được', 1);
    this.createTicket('Bình', 'Lỗi thanh toán', 2);
    this.createTicket('Cường', 'Yêu cầu nâng cấp', 1);
    setTimeout(() => this.escalateTicket(1), 1000);
    setTimeout(() => {
      this.resolveTicket(2);
      this.getStats();
    }, 2000);
  }
}

const support = new SupportSystem();
support.runDemo();
```

**Giải thích**:
- **Ticket**: Lưu thông tin vé hỗ trợ và cấp độ.
- **SupportAgent**: Quản lý vé của từng nhân viên.
- **SupportSystem**: Dùng Queue riêng cho mỗi cấp, hỗ trợ chuyển cấp.

## 🔑 Những Điểm Quan Trọng

### Khái Niệm Cốt Lõi
1. **FIFO**: Vào trước, ra trước.
2. **Thao tác chính**: `enqueue` (thêm cuối), `dequeue` (lấy đầu).
3. **Công bằng**: Xử lý theo thứ tự đến.

### Ưu Điểm
- **Dễ hiểu**: Giống xếp hàng thực tế.
- **Hiệu quả**: Linked List và Circular Queue đạt O(1).
- **Tiết kiệm bộ nhớ**: Chỉ dùng khi cần.

### Lỗi Thường Gặp
1. **Dùng Array.shift()**: Chậm (O(n)).
2. **Không kiểm tra rỗng**: Gây lỗi khi lấy từ queue rỗng.
3. **Nhầm peek và dequeue**: `peek` chỉ xem, không lấy.

### So Sánh Cài Đặt

| Cách Cài Đặt | Enqueue | Dequeue | Bộ Nhớ | Độ Phức Tạp |
|--------------|---------|---------|--------|-------------|
| Linked List  | O(1)    | O(1)    | Linh hoạt | Trung bình |
| Array        | O(1)    | O(n)    | Linh hoạt | Thấp |
| Circular Queue | O(1)   | O(1)    | Cố định  | Cao |

### Khi Nào Dùng
- **Linked List**: Khi cần tốc độ cao, không biết kích thước.
- **Array**: Khi cần đơn giản, ít thao tác dequeue.
- **Circular Queue**: Khi biết kích thước, cần tiết kiệm bộ nhớ.

### Biến Thể
1. **Priority Queue**: Xử lý theo ưu tiên.
2. **Deque**: Thêm/lấy từ cả hai đầu.
3. **Circular Queue**: Kích thước cố định, xoay vòng.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Hệ Thống Giới Hạn Tốc Độ
Xây dựng hệ thống giới hạn số yêu cầu (requests) của người dùng:
- Dùng Queue để theo dõi thời gian yêu cầu.
- Mỗi người dùng có giới hạn riêng (ví dụ: 100 yêu cầu/phút).
- Báo cáo số yêu cầu và trạng thái giới hạn.
- Chặn yêu cầu nếu vượt giới hạn.

**Gợi ý**: Dùng Queue để lưu dấu thời gian của yêu cầu trong khoảng thời gian nhất định.

### Bài Tập 2: Lên Lịch Công Việc Có Phụ Thuộc
Xây dựng hệ thống lên lịch công việc:
- Công việc có thể phụ thuộc (A phải xong trước B).
- Có mức ưu tiên (cao, thường, thấp).
- Hỗ trợ thử lại nếu thất bại.
- Theo dõi thời gian thực hiện và trạng thái.

**Gợi ý**: Dùng Queue để quản lý công việc sẵn sàng, kết hợp với biểu đồ phụ thuộc.

\---


---

*Post ID: jtf8804y8kvt8ub*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
