---
title: "Priority Queue (Hàng Đợi Ưu Tiên)"
postId: "bpmho1k7xx1rg1p"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Priority Queue (Hàng Đợi Ưu Tiên)


## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Priority Queue** là gì và khác gì với hàng đợi thông thường.
- Biết cách Priority Queue hoạt động dựa trên độ ưu tiên.
- Cài đặt Priority Queue bằng **Min Heap** trong JavaScript.
- Áp dụng Priority Queue vào bài toán thực tế như quản lý công việc.
- So sánh Priority Queue với các cấu trúc dữ liệu khác.

## 📝 Nội Dung Chi Tiết

### Priority Queue Là Gì?

**Priority Queue** là một cấu trúc dữ liệu mà mỗi phần tử có một **độ ưu tiên**. Phần tử có ưu tiên cao nhất được xử lý trước, không phụ thuộc vào thứ tự thêm vào.

**Ví dụ thực tế**:
- 🏥 **Bệnh viện**: Bệnh nhân nguy kịch được khám trước.
- 🛫 **Sân bay**: Hành khách hạng thương gia lên máy bay trước.
- 📋 **Công việc**: Việc khẩn cấp được làm trước việc thường.

![Priority Queue](https://www.vievlog.com/dsa/images/priority-queue.jpg)

*Minh họa Priority Queue với Min Heap*

### Đặc Điểm Chính

1. **Sắp xếp theo ưu tiên**: Phần tử có ưu tiên cao (số nhỏ) được xử lý trước.
   ```
   Hàng đợi thường: [A] -> [B] -> [C] (xếp hàng kiểu FIFO)
   Priority Queue: [Ưu tiên 1] -> [Ưu tiên 2] -> [Ưu tiên 3]
   ```
2. **Thay đổi ưu tiên**: Có thể cập nhật độ ưu tiên, hệ thống tự sắp xếp lại.
3. **Dùng Min Heap**: Thường dùng Min Heap để xử lý nhanh, số nhỏ = ưu tiên cao.

### Cài Đặt Priority Queue bằng JavaScript

Dùng **Min Heap** để xây dựng Priority Queue, với Map để lưu độ ưu tiên.

```javascript
class PriorityQueue {
  constructor() {
    this.heap = []; // Mảng lưu phần tử
    this.priorities = new Map(); // Lưu độ ưu tiên
  }

  // Thêm phần tử với độ ưu tiên
  add(item, priority = 0) {
    this.priorities.set(item, priority);
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
    return this;
  }

  // Lấy phần tử ưu tiên cao nhất
  poll() {
    if (this.isEmpty()) return null;
    const item = this.heap[0];
    this.priorities.delete(item);
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return item;
  }

  // Xem phần tử ưu tiên cao nhất
  peek() {
    return this.isEmpty() ? null : this.heap[0];
  }

  // Thay đổi độ ưu tiên
  changePriority(item, priority) {
    if (this.priorities.has(item)) {
      this.priorities.set(item, priority);
      this.heapify();
    }
    return this;
  }

  // Kiểm tra rỗng
  isEmpty() {
    return this.heap.length === 0;
  }

  // So sánh ưu tiên
  comparePriority(a, b) {
    const priorityA = this.priorities.get(a);
    const priorityB = this.priorities.get(b);
    return priorityA - priorityB; // Số nhỏ hơn = ưu tiên cao hơn
  }

  // Đẩy phần tử lên đúng vị trí
  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparePriority(this.heap[index], this.heap[parent]) < 0) {
        [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
        index = parent;
      } else {
        break;
      }
    }
  }

  // Đẩy phần tử xuống đúng vị trí
  bubbleDown(index) {
    while (index < this.heap.length) {
      let smallest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < this.heap.length && this.comparePriority(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < this.heap.length && this.comparePriority(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }

  // Sắp xếp lại toàn bộ heap
  heapify() {
    for (let i = Math.floor(this.heap.length / 2); i >= 0; i--) {
      this.bubbleDown(i);
    }
  }

  // Lấy tất cả phần tử và ưu tiên
  getAllPriorities() {
    return this.heap.map(item => ({
      item,
      priority: this.priorities.get(item)
    })).sort((a, b) => a.priority - b.priority);
  }
}
```

### Các Phương Thức Chính

1. **add(item, priority)**: Thêm phần tử với độ ưu tiên, tự sắp xếp (O(log n)).
2. **poll()**: Lấy và xóa phần tử ưu tiên cao nhất (O(log n)).
3. **peek()**: Xem phần tử ưu tiên cao nhất (O(1)).
4. **changePriority(item, priority)**: Cập nhật ưu tiên, sắp xếp lại (O(n)).

### Hiệu Suất

| Thao Tác | Priority Queue (Heap) | Mảng Thường | Mảng Sắp Xếp |
|----------|----------------------|-------------|--------------|
| Thêm     | O(log n) ⚡          | O(1) ⚡     | O(n) 🐌      |
| Lấy Min  | O(log n) ⚡          | O(n) 🐌     | O(1) ⚡       |
| Xem Min  | O(1) ⚡              | O(n) 🐌     | O(1) ⚡       |
| Đổi ưu tiên | O(n) ⚡            | O(n) 🐌     | O(n) 🐌      |

**Ưu điểm**:
- Nhanh khi thêm/lấy phần tử ưu tiên cao.
- Hỗ trợ thay đổi ưu tiên.
- Tiết kiệm bộ nhớ với Min Heap.

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Quản Lý Công Việc Dự Án

**Đề bài**: Xây dựng hệ thống quản lý công việc:
- Thêm công việc với độ ưu tiên (1=khẩn cấp, 5=thấp).
- Thay đổi ưu tiên khi cần.
- Gán công việc cho thành viên theo năng lực.
- Theo dõi tiến độ và báo cáo.

**Code giải**:

```javascript
class Task {
  constructor(id, name, priority, hours, deadline) {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.hours = hours;
    this.deadline = new Date(deadline);
    this.assignee = null;
    this.status = 'pending';
  }

  toString() {
    return `[${this.id}] ${this.name} (P${this.priority}) - ${this.hours}h`;
  }
}

class TeamMember {
  constructor(name, maxHours) {
    this.name = name;
    this.maxHours = maxHours;
    this.currentHours = 0;
    this.tasks = [];
  }

  canTakeTask(hours) {
    return this.currentHours + hours <= this.maxHours;
  }

  assignTask(task) {
    if (this.canTakeTask(task.hours)) {
      this.tasks.push(task);
      this.currentHours += task.hours;
      task.assignee = this.name;
      return true;
    }
    return false;
  }

  completeTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
      this.currentHours -= task.hours;
      return task;
    }
    return null;
  }
}

class ProjectTaskManager {
  constructor() {
    this.taskQueue = new PriorityQueue();
    this.teamMembers = new Map();
    this.completedTasks = [];
    this.taskIdCounter = 1;
  }

  addTeamMember(name, maxHours) {
    this.teamMembers.set(name, new TeamMember(name, maxHours));
    console.log(`✅ Thêm thành viên: ${name} (${maxHours}h/tuần)`);
  }

  addTask(name, priority, hours, deadline) {
    const task = new Task(this.taskIdCounter++, name, priority, hours, deadline);
    this.taskQueue.add(task, priority);
    console.log(`📝 Thêm công việc: ${task.toString()}`);
    return task;
  }

  assignNextTask() {
    if (this.taskQueue.isEmpty()) {
      console.log('📋 Không có công việc nào');
      return null;
    }

    const task = this.taskQueue.poll();
    let assignedMember = null;
    this.teamMembers.forEach(member => {
      if (!assignedMember && member.canTakeTask(task.hours)) {
        if (member.assignTask(task)) {
          assignedMember = member;
        }
      }
    });

    if (assignedMember) {
      console.log(`👤 Gán: ${task.name} cho ${assignedMember.name}`);
      return task;
    } else {
      this.taskQueue.add(task, task.priority);
      console.log(`⚠️ Không tìm được người phù hợp cho: ${task.name}`);
      return null;
    }
  }

  completeTask(taskId) {
    let completedTask = null;
    this.teamMembers.forEach(member => {
      const task = member.completeTask(taskId);
      if (task) {
        completedTask = task;
        this.completedTasks.push(task);
        console.log(`✅ Hoàn thành: ${task.name}`);
      }
    });
    return completedTask;
  }

  generateReport() {
    console.log(`\n📊 BÁO CÁO DỰ ÁN`);
    console.log(`- Tổng công việc: ${this.taskQueue.size() + this.completedTasks.length}`);
    console.log(`- Đã hoàn thành: ${this.completedTasks.length}`);
    console.log(`- Đang chờ: ${this.taskQueue.size()}`);
  }

  runDemo() {
    console.log('🚀 DEMO QUẢN LÝ DỰ ÁN\n');
    this.addTeamMember('Alice', 40);
    this.addTeamMember('Bob', 40);
    this.addTask('Login system', 2, 8, '2025-10-15');
    this.addTask('UI design', 3, 12, '2025-10-20');
    this.addTask('Fix bug', 1, 4, '2025-10-08');
    this.assignNextTask();
    this.assignNextTask();
    this.completeTask(1);
    this.generateReport();
  }
}

const manager = new ProjectTaskManager();
manager.runDemo();
```

**Giải thích**:
- **Task**: Lưu thông tin công việc (tên, ưu tiên, thời gian).
- **TeamMember**: Quản lý công việc của từng người.
- **ProjectTaskManager**: Dùng Priority Queue để sắp xếp công việc theo ưu tiên.

### Bài Tập 2: Quản Lý Sự Kiện Realtime

**Đề bài**: Xây dựng hệ thống xử lý sự kiện cho ứng dụng chat:
- Thêm sự kiện với độ ưu tiên (ví dụ: tin nhắn, thông báo).
- Xử lý sự kiện theo ưu tiên.
- Hỗ trợ sự kiện trễ (scheduled events).
- Theo dõi và báo cáo hiệu suất.

**Code giải**:

```javascript
class Event {
  constructor(id, type, data, priority, scheduledTime = null) {
    this.id = id;
    this.type = type;
    this.data = data;
    this.priority = priority;
    this.scheduledTime = scheduledTime ? new Date(scheduledTime) : null;
  }

  toString() {
    return `[${this.id}] ${this.type} (P${this.priority})`;
  }
}

class RealtimeEventManager {
  constructor() {
    this.eventQueue = new PriorityQueue();
    this.scheduledEvents = new PriorityQueue();
    this.eventIdCounter = 1;
    this.stats = { total: 0, processed: 0 };
  }

  addEvent(type, data, priority, scheduledTime = null) {
    const event = new Event(this.eventIdCounter++, type, data, priority, scheduledTime);
    if (event.scheduledTime && event.scheduledTime > new Date()) {
      this.scheduledEvents.add(event, event.scheduledTime.getTime());
      console.log(`⏰ Lên lịch: ${event.toString()}`);
    } else {
      this.eventQueue.add(event, priority);
      console.log(`📨 Thêm sự kiện: ${event.toString()}`);
    }
    this.stats.total++;
    return event;
  }

  processEvents() {
    if (!this.eventQueue.isEmpty()) {
      const event = this.eventQueue.poll();
      console.log(`🔄 Xử lý: ${event.toString()}`);
      this.stats.processed++;
    }
    this.checkScheduledEvents();
  }

  checkScheduledEvents() {
    const now = Date.now();
    while (!this.scheduledEvents.isEmpty() && this.scheduledEvents.peek().scheduledTime.getTime() <= now) {
      const event = this.scheduledEvents.poll();
      this.eventQueue.add(event, event.priority);
      console.log(`⏰ Kích hoạt: ${event.toString()}`);
    }
  }

  getStats() {
    console.log(`\n📊 THỐNG KÊ`);
    console.log(`- Tổng sự kiện: ${this.stats.total}`);
    console.log(`- Đã xử lý: ${this.stats.processed}`);
  }

  runDemo() {
    console.log('📡 DEMO QUẢN LÝ SỰ KIỆN\n');
    this.addEvent('user_message', { content: 'Hello' }, 2);
    this.addEvent('notification', { message: 'Update' }, 3);
    this.addEvent('user_message', { content: 'Hi' }, 1, new Date(Date.now() + 2000));
    this.processEvents();
    setTimeout(() => {
      this.processEvents();
      this.getStats();
    }, 3000);
  }
}

const eventManager = new RealtimeEventManager();
eventManager.runDemo();
```

**Giải thích**:
- **Event**: Lưu thông tin sự kiện (loại, dữ liệu, ưu tiên).
- **RealtimeEventManager**: Dùng Priority Queue để xử lý sự kiện theo ưu tiên, hỗ trợ sự kiện trễ.
- **processEvents**: Xử lý sự kiện ưu tiên cao nhất và kiểm tra sự kiện trễ.

## 🔑 Những Điểm Quan Trọng

### Hiệu Suất
- **Min Heap**: Nhanh cho thêm/lấy (O(log n)).
- **Bộ nhớ**: Tiết kiệm nhờ dùng mảng.
- **Cập nhật ưu tiên**: Cần sắp xếp lại heap (O(n)).

### Lỗi Thường Gặp
1. **Nhầm ưu tiên**: Số nhỏ là cao hay thấp.
2. **Quên xóa Map**: Gây rò rỉ bộ nhớ.
3. **Không kiểm tra rỗng**: Lỗi khi lấy từ queue rỗng.

### So Sánh

| Tình Huống | Priority Queue | Hàng Đợi Thường | Mảng |
|------------|----------------|-----------------|------|
| Thêm ưu tiên | ✅ O(log n)    | ❌ Không hỗ trợ | ❌ O(n) |
| Lấy ưu tiên cao | ✅ O(log n) | ❌ O(n)         | ❌ O(n) |
| Đổi ưu tiên | ✅ O(n)        | ❌ Không hỗ trợ | ❌ O(n) |

### Khi Nào Dùng
✅ **Nên dùng**:
- Xử lý công việc theo ưu tiên.
- Thuật toán đồ thị (Dijkstra, Prim).
- Quản lý sự kiện hoặc công việc thời gian thực.

❌ **Không nên dùng**:
- Chỉ cần xếp hàng kiểu FIFO.
- Dữ liệu nhỏ, không cần ưu tiên.
- Cần truy cập ngẫu nhiên.

### Mẹo Sử Dụng
1. **Xác định ưu tiên rõ ràng**: Dùng số nhỏ cho ưu tiên cao.
2. **Kiểm tra dữ liệu**: Đảm bảo ưu tiên hợp lệ.
3. **Theo dõi hiệu suất**: Ghi lại số lượng công việc/sự kiện.
4. **Dùng mảng nếu nhỏ**: Với ít dữ liệu, mảng có thể đủ.

### Ứng Dụng Thực Tế
1. **Hệ điều hành**: Lên lịch tiến trình.
2. **Mạng**: Định tuyến gói tin.
3. **Game**: Xử lý hành động AI.
4. **Web**: Quản lý công việc, thông báo.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Quản Lý Bệnh Viện
Xây dựng hệ thống quản lý bệnh nhân:
- Thêm bệnh nhân với triệu chứng và ưu tiên.
- Tự động xếp ưu tiên dựa trên tình trạng.
- Gán bác sĩ theo chuyên môn.
- Báo cáo tình trạng hàng đợi.

**Yêu cầu**:
- Dùng Priority Queue cho mỗi khoa.
- Tính ưu tiên dựa trên triệu chứng.
- Hiển thị trạng thái (số bệnh nhân, thời gian chờ).

### Bài Tập 2: Hệ Thống Ghép Đội Game
Xây dựng hệ thống ghép đội chơi game:
- Thêm người chơi với kỹ năng và ưu tiên.
- Ghép đội dựa trên kỹ năng và thời gian chờ.
- Điều chỉnh ưu tiên cho người chờ lâu.
- Hỗ trợ nhiều chế độ chơi.

**Yêu cầu**:
- Dùng Priority Queue cho mỗi chế độ.
- Ghép đội trong < 30 giây.
- Theo dõi số người chơi và thời gian ghép.


---

*Post ID: bpmho1k7xx1rg1p*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
