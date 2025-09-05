---
title: "Đống (Heap)"
postId: "r31x5fvl24p77jg"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Đống (Heap)


## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Heap** là gì và nguyên tắc chính (Heap Property).
- Biết cách hoạt động của Min Heap và Max Heap (heapify up/down).
- Biết cách viết code cho Heap bằng mảng trong JavaScript (thêm, lấy, xem).
- Áp dụng Heap vào Priority Queue, sắp xếp, và tối ưu hóa.
- So sánh Heap với Mảng và Cây Nhị Phân Tìm Kiếm (BST).

## 📝 Nội Dung Chi Tiết

### Heap (Đống) Là Gì?

**Heap** là một cây nhị phân hoàn chỉnh (cây đầy đủ, lấp từ trái sang phải), được thiết kế để giữ **tính chất Heap Property**: Phần tử cực trị (lớn nhất hoặc nhỏ nhất) luôn ở đỉnh (root).

**Đặc điểm chính**:
1. **Cây nhị phân hoàn chỉnh**: Mọi mức đầy đủ trừ mức cuối.
2. **Lưu bằng mảng**: Tiết kiệm bộ nhớ, dễ tính vị trí.
3. **Heap Property**: Quan hệ thứ tự giữa cha và con.

**Ví dụ dễ hiểu**:
- **Bảng xếp hạng**: Người dẫn đầu luôn ở vị trí đầu.
- **Hệ thống hỗ trợ**: Yêu cầu ưu tiên cao xử lý trước.
- **Bệnh viện**: Bệnh nhân nặng được ưu tiên.

### Hai Loại Heap Cơ Bản

**1. Min Heap (Đống nhỏ nhất)**:
- Cha luôn nhỏ hơn hoặc bằng con.
- Phần tử nhỏ nhất ở đỉnh.

```
Ví dụ Min Heap:
        3
      /   \
     8     7
    / \   / \
   15 12 25 10
```

- **Max Heap**: Phần tử **lớn nhất** ở đỉnh (cha lớn hơn con).

![MaxHeap](https://www.vievlog.com/dsa/images/max-heap.jpeg)

- **Min Heap**: Phần tử **nhỏ nhất** ở đỉnh (cha nhỏ hơn con).

![MinHeap](https://www.vievlog.com/dsa/images/min-heap.jpeg)

**2. Max Heap (Đống lớn nhất)**:
- Cha luôn lớn hơn hoặc bằng con.
- Phần tử lớn nhất ở đỉnh.

```
Ví dụ Max Heap:
        50
      /    \
    40      30
   / \     / \
  25  35  20 15
```

### Tại Sao Heap Lại Hiệu Quả?

**Ưu điểm tốc độ**:
- Lấy min/max nhanh mà không cần sắp xếp toàn bộ.

| Thao tác | Mảng | Mảng sắp xếp | BST | Heap |
|----------|------|--------------|-----|------|
| **Tìm min/max** | Chậm (O(n)) | Nhanh (O(1)) | Trung bình (O(log n)) | **Nhanh (O(1))** |
| **Thêm** | Nhanh (O(1)) | Chậm (O(n)) | Trung bình (O(log n)) | **Trung bình (O(log n))** |
| **Xóa min/max** | Chậm (O(n)) | Chậm (O(n)) | Trung bình (O(log n)) | **Trung bình (O(log n))** |

**Ví dụ**:
- Mảng: Tìm nhỏ nhất trong 10.000 số → phải xem hết.
- Heap: Min luôn ở đỉnh → lấy ngay.

### Biểu Diễn Heap Bằng Mảng

**Công thức vị trí**:
- Cha của i: Math.floor((i - 1) / 2)
- Con trái: 2 * i + 1
- Con phải: 2 * i + 2

**Ví dụ**:
```
Mảng: [3, 8, 7, 15, 12, 25, 10]
Vị trí: 0  1  2  3   4   5   6

Cây:
       3(0)
      /     \
    8(1)    7(2)
   /  \    /    \
 15(3) 12(4) 25(5) 10(6)
```

### Cài Đặt Min Heap Bằng JavaScript

```javascript
import Comparator from '../../utils/comparator/Comparator';

class MinHeap {
  constructor(compareFunction) {
    this.heapContainer = [];
    this.compare = new Comparator(compareFunction);
  }

  getLeftChildIndex(parentIndex) {
    return (2 * parentIndex) + 1;
  }

  getRightChildIndex(parentIndex) {
    return (2 * parentIndex) + 2;
  }

  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  hasParent(childIndex) {
    return this.getParentIndex(childIndex) >= 0;
  }

  hasLeftChild(parentIndex) {
    return this.getLeftChildIndex(parentIndex) < this.heapContainer.length;
  }

  hasRightChild(parentIndex) {
    return this.getRightChildIndex(parentIndex) < this.heapContainer.length;
  }

  leftChild(parentIndex) {
    return this.heapContainer[this.getLeftChildIndex(parentIndex)];
  }

  rightChild(parentIndex) {
    return this.heapContainer[this.getRightChildIndex(parentIndex)];
  }

  parent(childIndex) {
    return this.heapContainer[this.getParentIndex(childIndex)];
  }

  swap(indexOne, indexTwo) {
    const tmp = this.heapContainer[indexOne];
    this.heapContainer[indexOne] = this.heapContainer[indexTwo];
    this.heapContainer[indexTwo] = tmp;
  }

  peek() {
    if (this.heapContainer.length === 0) {
      return null;
    }
    return this.heapContainer[0];
  }

  poll() {
    if (this.heapContainer.length === 0) {
      return null;
    }
    if (this.heapContainer.length === 1) {
      return this.heapContainer.pop();
    }
    const minItem = this.heapContainer[0];
    this.heapContainer[0] = this.heapContainer.pop();
    this.heapifyDown();
    return minItem;
  }

  add(item) {
    this.heapContainer.push(item);
    this.heapifyUp();
    return this;
  }

  isEmpty() {
    return !this.heapContainer.length;
  }

  size() {
    return this.heapContainer.length;
  }

  heapifyUp(startIndex) {
    let currentIndex = startIndex || this.heapContainer.length - 1;
    while (
      this.hasParent(currentIndex)
      && !this.pairIsInCorrectOrder(this.parent(currentIndex), this.heapContainer[currentIndex])
    ) {
      this.swap(currentIndex, this.getParentIndex(currentIndex));
      currentIndex = this.getParentIndex(currentIndex);
    }
  }

  heapifyDown(startIndex) {
    let currentIndex = startIndex || 0;
    while (this.hasLeftChild(currentIndex)) {
      let nextIndex = this.getLeftChildIndex(currentIndex);
      if (
        this.hasRightChild(currentIndex)
        && this.pairIsInCorrectOrder(this.rightChild(currentIndex), this.leftChild(currentIndex))
      ) {
        nextIndex = this.getRightChildIndex(currentIndex);
      }
      if (this.pairIsInCorrectOrder(this.heapContainer[currentIndex], this.heapContainer[nextIndex])) {
        break;
      }
      this.swap(currentIndex, nextIndex);
      currentIndex = nextIndex;
    }
  }

  pairIsInCorrectOrder(firstElement, secondElement) {
    return this.compare.lessThanOrEqual(firstElement, secondElement);
  }
}
```

### Max Heap Implementation

```javascript
class MaxHeap extends MinHeap {
  pairIsInCorrectOrder(firstElement, secondElement) {
    return this.compare.greaterThanOrEqual(firstElement, secondElement);
  }
}
```

### Các Thao Tác Heapify

**Heapify Up (Dâng lên)**:
- Dùng sau khi thêm vào cuối: So sánh với cha, hoán đổi nếu sai, lặp lên trên.

**Heapify Down (Hạ xuống)**:
- Dùng sau khi xóa đỉnh: Đưa cuối lên đỉnh, so sánh với con, hoán đổi với con phù hợp, lặp xuống dưới.

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Hệ Thống Xử Lý Ticket Hỗ Trợ

**Mô tả**: Xây dựng hệ thống quản lý ticket:
- Tạo ticket với ưu tiên.
- Khách VIP ưu tiên cao hơn.
- Xử lý theo thứ tự ưu tiên.
- Xem trước ticket tiếp theo.
- Thống kê hệ thống.

```javascript
class TicketSystem {
  constructor() {
    this.tickets = new MaxHeap();
    this.ticketIdCounter = 1;
    this.processedTickets = [];
  }

  createTicket(description, priority, customerType = 'normal', urgentKeywords = []) {
    if (!description || priority < 1 || priority > 5) {
      throw new Error("Thông tin ticket không hợp lệ");
    }
    const ticket = {
      id: this.ticketIdCounter++,
      description: description,
      basePriority: priority,
      customerType: customerType,
      createdAt: new Date(),
      estimatedTime: this.estimateProcessingTime(priority, description),
      totalPriority: this.calculateTotalPriority(priority, customerType, description, urgentKeywords)
    };
    this.tickets.add(ticket);
    console.log(`🎫 Ticket #${ticket.id} đã được tạo`);
    console.log(`   Mô tả: ${ticket.description}`);
    console.log(`   Priority: ${ticket.basePriority} → ${ticket.totalPriority} (${customerType})`);
    console.log(`   Thời gian xử lý ước tính: ${ticket.estimatedTime} phút`);
    return ticket;
  }

  calculateTotalPriority(basePriority, customerType, description, urgentKeywords) {
    let total = basePriority;
    if (customerType === 'vip') {
      total += 2;
    } else if (customerType === 'premium') {
      total += 1;
    }
    const urgentWords = ['khẩn cấp', 'gấp', 'lỗi nghiêm trọng', 'không thể sử dụng', 'server down'];
    const descriptionLower = description.toLowerCase();
    for (let word of urgentWords) {
      if (descriptionLower.includes(word)) {
        total += 0.5;
        break;
      }
    }
    const ageBonus = Math.min(0.1 * Math.floor(Date.now() / (1000 * 60 * 10)), 0.5);
    total += ageBonus;
    return Math.round(total * 10) / 10;
  }

  estimateProcessingTime(priority, description) {
    const baseTime = {
      1: 15,
      2: 20,
      3: 25,
      4: 35,
      5: 45
    };
    let time = baseTime[priority] || 30;
    if (description.length > 100) {
      time += 10;
    }
    return time;
  }

  processNextTicket() {
    if (this.tickets.isEmpty()) {
      console.log('📋 Không có ticket nào đang chờ xử lý');
      return null;
    }
    const nextTicket = this.tickets.poll();
    const waitTime = Math.floor((Date.now() - nextTicket.createdAt.getTime()) / (1000 * 60));
    nextTicket.processedAt = new Date();
    nextTicket.waitTime = waitTime;
    this.processedTickets.push(nextTicket);
    console.log(`⚡ Đang xử lý Ticket #${nextTicket.id}:`);
    console.log(`   Mô tả: ${nextTicket.description}`);
    console.log(`   Priority: ${nextTicket.totalPriority}, Customer: ${nextTicket.customerType}`);
    console.log(`   Thời gian chờ: ${waitTime} phút`);
    console.log(`   Thời gian xử lý ước tính: ${nextTicket.estimatedTime} phút`);
    return nextTicket;
  }

  peekNextTicket() {
    const next = this.tickets.peek();
    if (next) {
      const waitTime = Math.floor((Date.now() - next.createdAt.getTime()) / (1000 * 60));
      console.log(`👀 Ticket tiếp theo: #${next.id} (Priority: ${next.totalPriority})`);
      console.log(`   Mô tả: ${next.description}`);
      console.log(`   Đã chờ: ${waitTime} phút`);
    }
    return next;
  }

  processBatch(count = 3) {
    console.log(`\n🔥 Xử lý hàng loạt ${count} tickets:`);
    for (let i = 0; i < count && !this.tickets.isEmpty(); i++) {
      this.processNextTicket();
      console.log('---');
    }
  }

  getStats() {
    const waiting = this.tickets.size();
    const processed = this.processedTickets.length;
    console.log(`\n📊 Thống kê hệ thống:`);
    console.log(`- Tickets đang chờ: ${waiting}`);
    console.log(`- Tickets đã xử lý: ${processed}`);
    return {
      totalWaiting: waiting,
      totalProcessed: processed
    };
  }

  simulateWorkday() {
    console.log('🌅 Mô phỏng một ngày làm việc tại call center...\n');
    this.createTicket('Website bị lỗi không thể đăng nhập', 3, 'normal');
    this.createTicket('Không thể thanh toán khẩn cấp', 5, 'vip');
    this.createTicket('Câu hỏi về sản phẩm', 1, 'normal');
    this.createTicket('Server down toàn bộ hệ thống', 5, 'premium');
    this.createTicket('Đổi thông tin tài khoản', 2, 'vip');
    this.createTicket('Lỗi nghiêm trọng trong ứng dụng mobile', 4, 'normal');
    this.createTicket('Yêu cầu hoàn tiền gấp', 3, 'premium');
    this.getStats();
    console.log('\n🏃‍♀️ Bắt đầu ca làm việc sáng:');
    this.processBatch(3);
    this.createTicket('Báo cáo lỗi bảo mật', 5, 'vip');
    this.createTicket('Không nhận được email xác nhận', 2, 'normal');
    console.log('\n🌆 Ca làm việc chiều:');
    this.processBatch(4);
    console.log('\n🌙 Thống kê cuối ngày:');
    this.getStats();
  }
}

const ticketSystem = new TicketSystem();
ticketSystem.simulateWorkday();
```

### Bài Tập 2: Tìm K Sinh Viên Có Điểm Cao Nhất

**Mô tả**: Xây dựng hệ thống tìm K sinh viên điểm cao nhất:
- Thêm sinh viên với điểm.
- Tìm K cao nhất hiệu quả.
- Tính trung vị điểm bằng 2 Heap.
- So sánh với sắp xếp thông thường.
- Xử lý dữ liệu lớn theo dòng.

```javascript
class TopStudentsFinder {
  constructor() {
    this.students = [];
    this.performanceStats = {
      heapTime: 0,
      sortTime: 0,
      comparisons: 0
    };
  }

  addStudent(name, score, subject = 'Tổng kết', semester = 'HK1') {
    if (!name || score < 0 || score > 10) {
      throw new Error("Thông tin sinh viên không hợp lệ");
    }
    const student = {
      name,
      score: Math.round(score * 10) / 10,
      subject,
      semester,
      addedAt: new Date()
    };
    this.students.push(student);
    console.log(`➕ Đã thêm sinh viên: ${name} - ${score} điểm (${subject})`);
    return student;
  }

  addBulkStudents(studentsData) {
    console.log(`📥 Đang thêm ${studentsData.length} sinh viên...`);
    studentsData.forEach(({name, score, subject, semester}) => {
      this.addStudent(name, score, subject, semester);
    });
    console.log(`✅ Đã thêm xong ${studentsData.length} sinh viên\n`);
  }

  getTopKStudentsWithHeap(k) {
    if (k <= 0 || this.students.length === 0) {
      return [];
    }
    const startTime = performance.now();
    let comparisons = 0;
    const minHeap = new MinHeap();
    console.log(`🧮 Sử dụng Min Heap để tìm top ${k} sinh viên...`);
    for (let student of this.students) {
      comparisons++;
      if (minHeap.size() < k) {
        minHeap.add(student);
      } else {
        const minStudent = minHeap.peek();
        if (student.score > minStudent.score) {
          minHeap.poll();
          minHeap.add(student);
          comparisons++;
        }
      }
    }
    const topStudents = [];
    while (!minHeap.isEmpty()) {
      topStudents.unshift(minHeap.poll());
    }
    const endTime = performance.now();
    this.performanceStats.heapTime = endTime - startTime;
    this.performanceStats.comparisons = comparisons;
    console.log(`⚡ Min Heap: ${this.performanceStats.heapTime.toFixed(2)}ms, ${comparisons} so sánh`);
    return topStudents;
  }

  getTopKStudentsWithSort(k) {
    if (k <= 0 || this.students.length === 0) {
      return [];
    }
    const startTime = performance.now();
    console.log(`📊 Sử dụng Sort để tìm top ${k} sinh viên...`);
    const sortedStudents = [...this.students].sort((a, b) => b.score - a.score);
    const topStudents = sortedStudents.slice(0, k);
    const endTime = performance.now();
    this.performanceStats.sortTime = endTime - startTime;
    console.log(`📈 Sort: ${this.performanceStats.sortTime.toFixed(2)}ms`);
    return topStudents;
  }

  comparePerformance(k = 10) {
    console.log(`\n🏁 So sánh hiệu suất tìm top ${k} sinh viên trong ${this.students.length} sinh viên:`);
    const heapResult = this.getTopKStudentsWithHeap(k);
    const sortResult = this.getTopKStudentsWithSort(k);
    const speedup = this.performanceStats.sortTime / this.performanceStats.heapTime;
    console.log(`- Min Heap nhanh hơn: ${speedup.toFixed(2)}x`);
    return { heapTime: this.performanceStats.heapTime, sortTime: this.performanceStats.sortTime };
  }

  findMedianScore() {
    if (this.students.length === 0) return null;
    console.log(`🎯 Tính median của ${this.students.length} sinh viên bằng 2 heaps...`);
    const maxHeap = new MaxHeap();
    const minHeap = new MinHeap();
    for (let student of this.students) {
      if (maxHeap.isEmpty() || student.score <= maxHeap.peek().score) {
        maxHeap.add(student);
      } else {
        minHeap.add(student);
      }
      if (maxHeap.size() > minHeap.size() + 1) {
        minHeap.add(maxHeap.poll());
      } else if (minHeap.size() > maxHeap.size() + 1) {
        maxHeap.add(minHeap.poll());
      }
    }
    let median;
    if (maxHeap.size() === minHeap.size()) {
      median = (maxHeap.peek().score + minHeap.peek().score) / 2;
    } else {
      median = maxHeap.size() > minHeap.size() ? maxHeap.peek().score : minHeap.peek().score;
    }
    console.log(`📊 Median điểm số: ${median}`);
    return median;
  }

  analyzeScoreDistribution() {
    const distribution = {
      'Xuất sắc (9-10)': [],
      'Giỏi (8-9)': [],
      'Khá (7-8)': [],
      'Trung bình (5-7)': [],
      'Yếu (<5)': []
    };
    this.students.forEach(student => {
      const score = student.score;
      if (score >= 9) distribution['Xuất sắc (9-10)'].push(student);
      else if (score >= 8) distribution['Giỏi (8-9)'].push(student);
      else if (score >= 7) distribution['Khá (7-8)'].push(student);
      else if (score >= 5) distribution['Trung bình (5-7)'].push(student);
      else distribution['Yếu (<5)'].push(student);
    });
    console.log(`\n📈 Phân bố điểm của ${this.students.length} sinh viên:`);
    Object.entries(distribution).forEach(([range, students]) => {
      const percentage = ((students.length / this.students.length) * 100).toFixed(1);
      console.log(`- ${range}: ${students.length} sinh viên (${percentage}%)`);
    });
    return distribution;
  }

  processStreamingData(newStudentsStream, k = 5) {
    console.log(`\n🌊 Xử lý streaming data: Top ${k} realtime`);
    const topKHeap = new MinHeap();
    for (let i = 0; i < Math.min(k, this.students.length); i++) {
      topKHeap.add(this.students[i]);
    }
    this.printCurrentTopK(topKHeap, 'Trạng thái ban đầu');
    newStudentsStream.forEach((studentData, index) => {
      const newStudent = {
        name: studentData.name,
        score: studentData.score
      };
      console.log(`\n📥 Sinh viên mới: ${newStudent.name} - ${newStudent.score}`);
      if (topKHeap.size() < k) {
        topKHeap.add(newStudent);
        console.log(`   → Thêm vào top K (chưa đầy)`);
      } else {
        const minInTopK = topKHeap.peek();
        if (newStudent.score > minInTopK.score) {
          topKHeap.poll();
          topKHeap.add(newStudent);
          console.log(`   → Thay thế ${minInTopK.name} (${minInTopK.score})`);
        } else {
          console.log(`   → Không đủ điểm vào top K`);
        }
      }
      if ((index + 1) % 3 === 0) {
        this.printCurrentTopK(topKHeap, `Sau ${index + 1} sinh viên mới`);
      }
    });
    return this.heapToSortedArray(topKHeap);
  }

  printCurrentTopK(heap, title) {
    const currentTop = this.heapToSortedArray(heap);
    console.log(`\n📊 ${title}:`);
    currentTop.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.name}: ${student.score}`);
    });
  }

  heapToSortedArray(heap) {
    const tempArray = heap.heapContainer ? [...heap.heapContainer] : [];
    return tempArray.sort((a, b) => b.score - a.score);
  }

  runComprehensiveDemo() {
    console.log('🎓 DEMO: Hệ thống tìm sinh viên xuất sắc\n');
    const sampleStudents = [
      {name: 'Nguyễn Văn A', score: 8.5, subject: 'Toán'},
      {name: 'Trần Thị B', score: 9.2, subject: 'Lý'},
      {name: 'Lê Văn C', score: 7.8, subject: 'Hóa'},
      {name: 'Phạm Thị D', score: 9.5, subject: 'Toán'},
      {name: 'Hoàng Văn E', score: 8.0, subject: 'Văn'},
      {name: 'Vũ Thị F', score: 9.0, subject: 'Anh'},
      {name: 'Đỗ Văn G', score: 8.7, subject: 'Sinh'},
      {name: 'Bùi Thị H', score: 7.5, subject: 'Sử'},
      {name: 'Dương Văn I', score: 9.8, subject: 'Toán'},
      {name: 'Cao Thị J', score: 8.3, subject: 'Địa'}
    ];
    this.addBulkStudents(sampleStudents);
    const k = 5;
    console.log(`🏆 Tìm top ${k} sinh viên điểm cao nhất:`);
    const topStudents = this.getTopKStudentsWithHeap(k);
    console.log(`\n🥇 Top ${k} sinh viên:`);
    topStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.name}: ${student.score} điểm (${student.subject})`);
    });
    this.comparePerformance(k);
    this.findMedianScore();
    this.analyzeScoreDistribution();
    const newStream = [
      {name: 'Nguyễn Thị K', score: 9.7, subject: 'Toán'},
      {name: 'Trần Văn L', score: 7.2, subject: 'Lý'},
      {name: 'Lê Thị M', score: 8.8, subject: 'Hóa'},
      {name: 'Phạm Văn N', score: 9.3, subject: 'Anh'},
      {name: 'Hoàng Thị O', score: 6.9, subject: 'Văn'}
    ];
    this.processStreamingData(newStream, 5);
  }
}

const finder = new TopStudentsFinder();
finder.runComprehensiveDemo();
```

## 🔑 Những Điểm Quan Trọng

### Hiệu Suất Và Tối Ưu

1. **Tính chất Heap**: Luôn giữ quan hệ cha-con sau mỗi thay đổi.
2. **Cây hoàn chỉnh**: Lưu bằng mảng, tiết kiệm bộ nhớ.
3. **Tốc độ**: Thêm/Xóa O(log n), Xem đỉnh O(1).
4. **Bộ nhớ**: O(n), không tốn con trỏ như BST.

### Các Lỗi Thường Gặp

1. **Heapify sai**: Nhầm up/down.
2. **Tính vị trí sai**: Sai index cha/con.
3. **Vi phạm tính chất**: Không giữ min/max đúng.
4. **Heap rỗng**: Không kiểm tra trước poll/peek.
5. **So sánh sai**: Sai hàm so sánh min/max.

### So Sánh Với Cấu Trúc Khác

| Tình huống | Heap | Mảng | Mảng sắp xếp | BST |
|------------|------|------|--------------|-----|
| **Tìm min/max** | O(1) | O(n) | O(1) | O(log n) |
| **Thêm** | O(log n) | O(1) | O(n) | O(log n) |
| **Xóa min/max** | O(log n) | O(n) | O(n) | O(log n) |
| **Tìm bất kỳ** | O(n) | O(n) | O(log n) | O(log n) |
| **Bộ nhớ** | Tốt | Tốt nhất | Tốt | Tốn con trỏ |

### Khi Nào Nên Sử Dụng Heap

**Nên dùng khi**:
- Cần Priority Queue.
- Tìm min/max thường xuyên.
- Sắp xếp Heap Sort.
- Thuật toán đồ thị (Dijkstra, Prim).
- Tìm top-K.
- Tính trung vị dòng dữ liệu.
- Lập lịch sự kiện.

**Không nên dùng khi**:
- Tìm phần tử bất kỳ nhiều.
- Duyệt thứ tự sắp xếp.
- Dữ liệu ít, không cần ưu tiên.
- Cập nhật key thường xuyên.
- Bộ nhớ hạn chế.

### Mẹo Sử Dụng

1. **Chọn loại phù hợp**: Min cho nhỏ nhất trước, Max cho lớn nhất trước.
2. **Kiểm tra đầu vào**: Đảm bảo dữ liệu hợp lệ.
3. **Xử lý đặc biệt**: Heap rỗng, một phần tử.
4. **So sánh đúng**: Định nghĩa so sánh cho đối tượng.
5. **Heap đặc biệt**: Fibonacci cho cập nhật key, d-ary cho thêm nhiều.

### Ứng Dụng Thực Tế

1. **Hệ thống OS**: Lập lịch CPU, quản lý bộ nhớ.
2. **Mạng**: Tìm đường ngắn (Dijkstra).
3. **Xử lý dữ liệu**: Truy vấn top-K.
4. **Game**: Tìm đường A*, lập lịch sự kiện.
5. **Cơ sở dữ liệu**: Xử lý ưu tiên.
6. **Hệ thống realtime**: Xử lý sự kiện theo ưu tiên.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Hệ Thống Lập Lịch Họp Thông Minh

**Mô tả**: Xây dựng hệ thống lập lịch họp:
- Thêm họp với thời gian, ưu tiên.
- Sắp xếp theo thời gian và ưu tiên.
- Phát hiện xung đột, đề xuất giải pháp.
- Tối ưu lịch để nhiều họp quan trọng nhất.
- Nhắc nhở trước họp.

**Yêu cầu**:
- Min Heap sắp theo thời gian.
- Phát hiện xung đột.
- Nhắc nhở 15 phút trước.
- Xử lý nhiều người, phòng họp.
- Xuất lịch calendar.

**Dữ liệu mẫu**: 20+ họp tuần, 5+ phòng, 10+ người, xử lý edge: họp dài, định kỳ, khẩn.

**Thêm**: Đề xuất thời gian tối ưu, tự sắp lại xung đột, báo cáo tuần/tháng, tích hợp lịch ngoài.

### Bài Tập 2: Bảng Xếp Hạng Game Realtime

**Mô tả**: Xây dựng bảng xếp hạng game:
- Cập nhật điểm realtime.
- Hiển thị top 100 theo tiêu chí.
- Theo dõi thay đổi hạng.
- Nhiều bảng (level, server, thời gian).
- Phát hiện thành tựu tự động.

**Yêu cầu**:
- Max Heap cho top players, Min cho cập nhật.
- Xử lý 1000+ cập nhật/giây.
- Tiết kiệm bộ nhớ cho triệu người.
- Lưu trữ lâu dài.
- API cho truy vấn.

**Hiệu suất**: Cập nhật <1ms, lấy top <5ms, 10.000+ người, uptime 99.9%, thiết kế mở rộng.

**Nâng cao**: Kiểm gian lận, hạng giảm theo thời gian, reset mùa, giải đấu liên server, thống kê xu hướng.



---

*Post ID: r31x5fvl24p77jg*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
