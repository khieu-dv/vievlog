---
title: "Danh Sách Liên Kết (Linked List)"
postId: "wvtzpqlowxpb531"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Danh Sách Liên Kết (Linked List)


## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Danh Sách Liên Kết** là gì và cách hoạt động.
- Biết cách viết code cho Linked List bằng JavaScript.
- So sánh Linked List với Mảng.
- Áp dụng Linked List vào bài toán thực tế.
- Hiểu tốc độ và bộ nhớ của các thao tác.

## 📝 Nội Dung Chi Tiết

### Danh Sách Liên Kết Là Gì?

**Danh Sách Liên Kết** là một cấu trúc dữ liệu mà các phần tử (gọi là **node**) được nối với nhau qua **con trỏ**. Mỗi node chứa dữ liệu và chỉ đường đến node tiếp theo, không nằm liền nhau trong bộ nhớ.

**Ví dụ dễ hiểu**: Tưởng tượng một chuỗi hạt, mỗi hạt là node chứa dữ liệu, dây nối là con trỏ. Muốn đến hạt thứ 5, bạn phải đi từ đầu qua từng hạt.

### Cấu Trúc Cơ Bản

1. **Node**: Mỗi node có:
   - **Dữ liệu**: Thông tin cần lưu.
   - **Con trỏ**: Chỉ đến node tiếp theo (null nếu là cuối).
2. **Head**: Trỏ đến node đầu tiên.
3. **Tail**: Trỏ đến node cuối cùng (giúp thao tác nhanh hơn).

### Ưu Điểm Và Nhược Điểm

**Ưu điểm**:
- Kích thước linh hoạt: Thêm/xóa dễ dàng.
- Thêm/xóa ở đầu rất nhanh: O(1).
- Tiết kiệm bộ nhớ: Chỉ dùng khi cần.

**Nhược điểm**:
- Không nhảy ngay đến vị trí bất kỳ (chậm hơn mảng).
- Tốn bộ nhớ cho con trỏ.
- Không tận dụng bộ nhớ cache tốt.

![Linked List](https://www.vievlog.com/dsa/images/linked-list.jpeg)

### Triển Khai Trong JavaScript

#### Bước 1: Tạo Lớp Node

Node là đơn vị cơ bản, chứa dữ liệu và con trỏ.

```javascript
class LinkedListNode {
  constructor(value, next = null) {
    this.value = value; // Dữ liệu
    this.next = next;   // Con trỏ đến node tiếp theo
  }

  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
```

**Giải thích**:
- `value`: Lưu dữ liệu.
- `next`: Trỏ đến node tiếp theo (null nếu cuối).
- `toString()`: Hiển thị dữ liệu dạng chuỗi.

#### Bước 2: Tạo Lớp LinkedList

Quản lý toàn bộ danh sách liên kết.

```javascript
class LinkedList {
  constructor() {
    this.head = null; // Node đầu
    this.tail = null; // Node cuối
  }

  prepend(value) {
    const newNode = new LinkedListNode(value, this.head);
    this.head = newNode;
    if (!this.tail) {
      this.tail = newNode;
    }
    return this;
  }

  append(value) {
    const newNode = new LinkedListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return this;
    }
    this.tail.next = newNode;
    this.tail = newNode;
    return this;
  }

  find(value) {
    if (!this.head) return null;
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.value === value) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }
    return null;
  }

  delete(value) {
    if (!this.head) return null;
    let deletedNode = null;
    while (this.head && this.head.value === value) {
      deletedNode = this.head;
      this.head = this.head.next;
    }
    let currentNode = this.head;
    if (currentNode !== null) {
      while (currentNode.next) {
        if (currentNode.next.value === value) {
          deletedNode = currentNode.next;
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }
    if (this.tail && this.tail.value === value) {
      this.tail = currentNode;
    }
    return deletedNode;
  }

  toArray() {
    const nodes = [];
    let currentNode = this.head;
    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }
    return nodes;
  }

  toString() {
    return this.toArray().map(node => node.toString()).join(', ');
  }

  reverse() {
    let currNode = this.head;
    let prevNode = null;
    let nextNode = null;
    while (currNode) {
      nextNode = currNode.next;
      currNode.next = prevNode;
      prevNode = currNode;
      currNode = nextNode;
    }
    this.tail = this.head;
    this.head = prevNode;
    return this;
  }
}
```

**Các phương thức chính**:
1. **prepend(value)**: Thêm vào đầu, O(1).
2. **append(value)**: Thêm vào cuối, O(1) với tail.
3. **find(value)**: Tìm node, O(n).
4. **delete(value)**: Xóa node, O(n).
5. **toArray()**: Chuyển thành mảng, O(n).
6. **toString()**: Hiển thị dạng chuỗi, O(n).
7. **reverse()**: Đảo ngược danh sách, O(n).

### Ví Dụ Minh Họa

#### Ví dụ 1: Quản Lý Danh Sách Sinh Viên

```javascript
const students = new LinkedList();
students.append({ id: 1, name: 'Nguyễn Văn An', grade: 8.5 });
students.append({ id: 2, name: 'Trần Thị Bình', grade: 9.2 });
students.append({ id: 3, name: 'Lê Văn Cường', grade: 7.8 });
console.log('Danh sách sinh viên:', students.toString(
  student => `${student.name} (${student.grade})`
));
const excellentStudent = students.find({ id: 2 });
console.log('Sinh viên xuất sắc:', excellentStudent ? excellentStudent.value.name : 'Không tìm thấy');
```

**Kết quả**:
- Danh sách: Nguyễn Văn An (8.5), Trần Thị Bình (9.2), Lê Văn Cường (7.8)
- Sinh viên xuất sắc: Trần Thị Bình

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Quản Lý Playlist Nhạc

**Mô tả**: Xây dựng playlist nhạc:
- Thêm bài hát vào cuối.
- Thêm bài hát vào đầu (phát tiếp theo).
- Xóa bài hát theo tên.
- Tìm bài hát theo ca sĩ.
- Hiển thị playlist.

```javascript
class Song {
  constructor(title, artist, duration) {
    this.title = title;
    this.artist = artist;
    this.duration = duration;
  }

  toString() {
    return `${this.title} - ${this.artist} (${this.duration})`;
  }
}

class MusicPlaylist {
  constructor() {
    this.songs = new LinkedList();
  }

  addSong(title, artist, duration) {
    const song = new Song(title, artist, duration);
    this.songs.append(song);
    console.log(`Đã thêm: ${song.toString()}`);
  }

  addNext(title, artist, duration) {
    const song = new Song(title, artist, duration);
    this.songs.prepend(song);
    console.log(`Đã thêm vào đầu: ${song.toString()}`);
  }

  removeSong(title) {
    const song = this.songs.find(song => song.title === title);
    if (song) {
      this.songs.delete(song.value);
      console.log(`Đã xóa: ${song.toString()}`);
    } else {
      console.log(`Không tìm thấy bài hát: ${title}`);
    }
  }

  findByArtist(artist) {
    const song = this.songs.find(song => song.artist === artist);
    return song ? song.value : null;
  }

  showPlaylist() {
    console.log('\n=== PLAYLIST ===');
    if (!this.songs.head) {
      console.log('Playlist trống');
      return;
    }
    const songList = this.songs.toArray();
    songList.forEach((node, index) => {
      console.log(`${index + 1}. ${node.value.toString()}`);
    });
  }
}

const myPlaylist = new MusicPlaylist();
myPlaylist.addSong('Shape of You', 'Ed Sheeran', '3:53');
myPlaylist.addSong('Blinding Lights', 'The Weeknd', '3:20');
myPlaylist.addNext('Perfect', 'Ed Sheeran', '4:23');
myPlaylist.showPlaylist();
const edSong = myPlaylist.findByArtist('Ed Sheeran');
console.log('\nBài hát đầu tiên của Ed Sheeran:', edSong ? edSong.toString() : 'Không tìm thấy');
```

**Giải thích**:
- **Song**: Lưu thông tin bài hát.
- **MusicPlaylist**: Dùng LinkedList để thêm/xóa nhanh.
- **addNext**: Thêm vào đầu để ưu tiên phát.
- **findByArtist**: Tìm theo ca sĩ.

### Bài Tập 2: Quản Lý Task Với Ưu Tiên

**Mô tả**: Xây dựng Todo List:
- Thêm task với ưu tiên (cao, trung bình, thấp).
- Task ưu tiên cao thêm vào đầu.
- Xóa task khi hoàn thành.
- Hiển thị theo ưu tiên.
- Đếm số task theo ưu tiên.

```javascript
class Task {
  constructor(title, priority = 'medium', description = '') {
    this.title = title;
    this.priority = priority;
    this.description = description;
    this.createdAt = new Date();
    this.completed = false;
  }

  toString() {
    const priorityEmoji = {
      'high': '🔥',
      'medium': '⚡',
      'low': '📝'
    };
    return `${priorityEmoji[this.priority]} ${this.title} - ${this.description}`;
  }
}

class PriorityTodoList {
  constructor() {
    this.tasks = new LinkedList();
  }

  addTask(title, priority = 'medium', description = '') {
    const task = new Task(title, priority, description);
    if (priority === 'high') {
      this.tasks.prepend(task);
    } else if (priority === 'medium') {
      this.insertByPriority(task);
    } else {
      this.tasks.append(task);
    }
    console.log(`Đã thêm task: ${task.toString()}`);
  }

  insertByPriority(task) {
    if (!this.tasks.head) {
      this.tasks.append(task);
      return;
    }
    let currentNode = this.tasks.head;
    let prevNode = null;
    while (currentNode && currentNode.value.priority !== 'low') {
      prevNode = currentNode;
      currentNode = currentNode.next;
    }
    if (!prevNode) {
      this.tasks.prepend(task);
    } else if (!currentNode) {
      this.tasks.append(task);
    } else {
      const newNode = new LinkedListNode(task, currentNode);
      prevNode.next = newNode;
    }
  }

  completeTask(title) {
    const taskNode = this.tasks.find(task => task.title === title && !task.completed);
    if (taskNode) {
      taskNode.value.completed = true;
      this.tasks.delete(taskNode.value);
      console.log(`✅ Đã hoàn thành: ${title}`);
    } else {
      console.log(`❌ Không tìm thấy task: ${title}`);
    }
  }

  countByPriority() {
    const count = { high: 0, medium: 0, low: 0 };
    let currentNode = this.tasks.head;
    while (currentNode) {
      count[currentNode.value.priority]++;
      currentNode = currentNode.next;
    }
    return count;
  }

  showTasks() {
    console.log('\n=== TODO LIST ===');
    if (!this.tasks.head) {
      console.log('Không có task nào');
      return;
    }
    const taskArray = this.tasks.toArray();
    taskArray.forEach((node, index) => {
      console.log(`${index + 1}. ${node.value.toString()}`);
    });
    const stats = this.countByPriority();
    console.log(`\n📊 Thống kê: High(${stats.high}) | Medium(${stats.medium}) | Low(${stats.low})`);
  }
}

const todoList = new PriorityTodoList();
todoList.addTask('Nộp báo cáo cuối kỳ', 'high', 'Deadline: 25/12');
todoList.addTask('Đi mua sắm', 'low', 'Mua đồ ăn cho tuần');
todoList.addTask('Họp team', 'medium', 'Thảo luận dự án mới');
todoList.addTask('Gọi điện cho mẹ', 'high', 'Báo về nhà');
todoList.showTasks();
todoList.completeTask('Gọi điện cho mẹ');
todoList.showTasks();
```

**Giải thích**:
- **Task**: Lưu thông tin công việc.
- **PriorityTodoList**: Sắp xếp task theo ưu tiên.
- **insertByPriority**: Chèn task trung bình đúng vị trí.
- **countByPriority**: Đếm số task theo ưu tiên.

## 🔑 Những Điểm Quan Trọng

### Khái Niệm Cốt Lõi
1. **Node**: Chứa dữ liệu và con trỏ.
2. **Head/Tail**: Trỏ đầu/cuối danh sách.
3. **Truy cập tuần tự**: Phải đi từ đầu.

### Ưu Điểm
- Kích thước linh hoạt.
- Thêm/xóa đầu nhanh (O(1)).
- Tiết kiệm bộ nhớ khi cần.

### Lỗi Thường Gặp
1. **Null Pointer**: Không kiểm tra null trước khi truy cập.
   ```javascript
   // Đúng
   if (node.next) { /* xử lý */ }
   ```
2. **Memory Leak**: Không xóa con trỏ khi xóa node.
   ```javascript
   // Đúng
   const nodeToDelete = currentNode.next;
   currentNode.next = nodeToDelete.next;
   nodeToDelete.next = null;
   ```
3. **Tail sai**: Quên cập nhật tail khi xóa cuối.
   ```javascript
   if (!currentNode.next) {
     this.tail = currentNode;
   }
   ```

### So Sánh Với Mảng

| Tiêu chí | Linked List | Mảng |
|----------|-------------|------|
| **Truy cập vị trí** | Chậm (O(n)) | Nhanh (O(1)) |
| **Thêm đầu** | Nhanh (O(1)) | Chậm (O(n)) |
| **Bộ nhớ** | Tốn con trỏ | Ít hơn |
| **Cache** | Kém | Tốt |
| **Kích thước** | Linh hoạt | Cố định |

### Tốc Độ (Big O)

| Thao tác | Linked List | Mảng |
|----------|-------------|------|
| Truy cập | O(n) | O(1) |
| Tìm kiếm | O(n) | O(n) |
| Thêm đầu | O(1) | O(n) |
| Thêm cuối | O(1)* | O(1) |
| Xóa đầu | O(1) | O(n) |
| Xóa cuối | O(n) | O(1) |

*Với tail pointer

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Quản Lý Lịch Sử Trình Duyệt
Xây dựng hệ thống lịch sử trình duyệt:
- Thêm URL mới vào đầu.
- Giới hạn 50 trang.
- Xóa URL theo tên miền.
- Tìm URL có từ khóa.
- Hiển thị 10 trang gần nhất.

**Gợi ý**: Dùng `prepend()` để thêm mới, kiểm tra giới hạn kích thước.

### Bài Tập 2: Trình Soạn Thảo Hợp Tác
Xây dựng hệ thống lưu thao tác chỉnh sửa:
- Lưu thao tác (timestamp, user, nội dung).
- Giới hạn 100 thao tác gần nhất.
- Undo: Xóa thao tác cuối.
- Tìm thao tác của user.
- Hiển thị timeline thao tác.

**Gợi ý**: Quản lý thứ tự thời gian, dùng `find()` để lọc theo user.

**Yêu cầu**:
- Dùng class ES6.
- Xử lý lỗi (edge cases).
- Code dễ tái sử dụng, có comment.



---

*Post ID: wvtzpqlowxpb531*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
