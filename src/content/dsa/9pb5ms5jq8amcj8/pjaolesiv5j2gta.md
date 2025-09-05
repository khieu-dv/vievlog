---
title: "Danh Sách Liên Kết Đôi (Doubly Linked List)"
postId: "pjaolesiv5j2gta"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Danh Sách Liên Kết Đôi (Doubly Linked List)



## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Danh Sách Liên Kết Đôi** là gì và cách nó hoạt động.
- So sánh được với Danh Sách Liên Kết Đơn (Singly Linked List).
- Biết cách viết code cho Doubly Linked List bằng JavaScript.
- Áp dụng vào các bài toán thực tế như trình duyệt web hay trình phát nhạc.
- Hiểu tốc độ của các thao tác chính.

## 📝 Nội Dung Chi Tiết

### Khái Niệm Cơ Bản

**Danh Sách Liên Kết Đôi (Doubly Linked List)** giống như một chuỗi các hộp (node), mỗi hộp chứa dữ liệu và có hai dây nối:
- Một dây nối đến hộp **tiếp theo** (như Singly Linked List).
- Một dây nối đến hộp **trước đó** (điểm đặc biệt!).

**Ví dụ dễ hiểu**: Hãy tưởng tượng một đoàn tàu, mỗi toa tàu (node) có cửa sổ nhìn được cả phía trước và phía sau. Bạn có thể đi tiến hoặc lùi dễ dàng, không như xe buýt chỉ đi một chiều.

### So Sánh Với Singly Linked List

| Đặc Điểm | Singly Linked List | Doubly Linked List |
|----------|-------------------|-------------------|
| **Cấu trúc** | A → B → C | null ← A ⇄ B ⇄ C → null |
| **Hướng đi** | Chỉ tiến (→) | Cả tiến và lùi (⇄) |
| **Bộ nhớ** | Ít hơn (1 dây nối) | Nhiều hơn (2 dây nối) |
| **Xóa cuối** | Chậm (O(n)) | Nhanh (O(1)) |

### Thành Phần Cấu Trúc

1. **Node**: Mỗi hộp chứa:
   - **Dữ liệu**: Thông tin cần lưu.
   - **Next**: Dây nối đến node tiếp theo.
   - **Previous**: Dây nối đến node trước đó.

2. **Head**: Node đầu tiên (không có node trước).
3. **Tail**: Node cuối cùng (không có node sau).

### Ưu Điểm

- **Di chuyển hai chiều**: Dễ dàng đi tiến hoặc lùi.
- **Xóa cuối nhanh**: Chỉ cần nhìn vào tail, không cần tìm lâu.
- **Dễ dùng**: Hữu ích cho các ứng dụng cần chuyển qua lại (như nút Next/Previous).

### Nhược Điểm

- **Tốn bộ nhớ**: Mỗi node cần thêm một dây nối (previous).
- **Code phức tạp hơn**: Phải quản lý cả hai dây nối.

![Doubly Linked List](https://www.vievlog.com/dsa/images/doubly-linked-list.jpeg)

### Triển Khai Trong JavaScript

#### Bước 1: Tạo Lớp Node

Mỗi node có dữ liệu, dây nối tới node tiếp theo và node trước đó:

```javascript
class DoublyLinkedListNode {
  constructor(value, next = null, previous = null) {
    this.value = value;       // Dữ liệu
    this.next = next;         // Node tiếp theo
    this.previous = previous; // Node trước đó
  }

  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
```

#### Bước 2: Tạo Lớp DoublyLinkedList

Lớp này quản lý toàn bộ danh sách:

```javascript
class DoublyLinkedList {
  constructor(comparatorFunction) {
    this.head = null; // Node đầu
    this.tail = null; // Node cuối
    this.compare = new Comparator(comparatorFunction);
  }

  prepend(value) {
    const newNode = new DoublyLinkedListNode(value, this.head);
    if (this.head) {
      this.head.previous = newNode;
    }
    this.head = newNode;
    if (!this.tail) {
      this.tail = newNode;
    }
    return this;
  }

  append(value) {
    const newNode = new DoublyLinkedListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return this;
    }
    this.tail.next = newNode;
    newNode.previous = this.tail;
    this.tail = newNode;
    return this;
  }

  delete(value) {
    if (!this.head) return null;
    let deletedNode = null;
    let currentNode = this.head;
    while (currentNode) {
      if (this.compare.equal(currentNode.value, value)) {
        deletedNode = currentNode;
        if (deletedNode === this.head) {
          this.head = deletedNode.next;
          if (this.head) {
            this.head.previous = null;
          }
          if (deletedNode === this.tail) {
            this.tail = null;
          }
        } else if (deletedNode === this.tail) {
          this.tail = deletedNode.previous;
          this.tail.next = null;
        } else {
          const prevNode = deletedNode.previous;
          const nextNode = deletedNode.next;
          prevNode.next = nextNode;
          nextNode.previous = prevNode;
        }
      }
      currentNode = currentNode.next;
    }
    return deletedNode;
  }

  find({ value = undefined, callback = undefined }) {
    if (!this.head) return null;
    let currentNode = this.head;
    while (currentNode) {
      if (callback && callback(currentNode.value)) {
        return currentNode;
      }
      if (value !== undefined && this.compare.equal(currentNode.value, value)) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }
    return null;
  }

  deleteTail() {
    if (!this.tail) return null;
    if (this.head === this.tail) {
      const deletedTail = this.tail;
      this.head = null;
      this.tail = null;
      return deletedTail;
    }
    const deletedTail = this.tail;
    this.tail = this.tail.previous;
    this.tail.next = null;
    return deletedTail;
  }

  deleteHead() {
    if (!this.head) return null;
    const deletedHead = this.head;
    if (this.head.next) {
      this.head = this.head.next;
      this.head.previous = null;
    } else {
      this.head = null;
      this.tail = null;
    }
    return deletedHead;
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

  traverseReverse() {
    const values = [];
    let currentNode = this.tail;
    while (currentNode) {
      values.push(currentNode.value);
      currentNode = currentNode.previous;
    }
    return values;
  }

  reverse() {
    let currentNode = this.head;
    let tempNode = null;
    while (currentNode) {
      tempNode = currentNode.previous;
      currentNode.previous = currentNode.next;
      currentNode.next = tempNode;
      currentNode = currentNode.previous;
    }
    tempNode = this.head;
    this.head = this.tail;
    this.tail = tempNode;
    return this;
  }
}
```

**Các thao tác chính**:
1. **prepend(value)**: Thêm vào đầu danh sách (O(1)).
2. **append(value)**: Thêm vào cuối danh sách (O(1)).
3. **delete(value)**: Xóa node có giá trị cho trước (O(n) để tìm, O(1) để xóa).
4. **deleteTail()**: Xóa node cuối, rất nhanh (O(1)).
5. **traverseReverse()**: Duyệt ngược từ cuối lên đầu, chỉ Doubly làm được.

### Ví Dụ Minh Họa

#### Ví dụ 1: Hệ thống điều hướng trình duyệt

```javascript
const browserHistory = new DoublyLinkedList();
browserHistory.append('google.com');
browserHistory.append('stackoverflow.com');
browserHistory.append('github.com');
console.log('Trang hiện tại:', browserHistory.tail.value); // github.com
if (browserHistory.tail.previous) {
  console.log('Trang trước:', browserHistory.tail.previous.value); // stackoverflow.com
}
console.log('Lịch sử duyệt:', browserHistory.traverseReverse());
// ['github.com', 'stackoverflow.com', 'google.com']
```

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Hệ Thống Media Player

**Mô tả**: Xây dựng trình phát nhạc với playlist có thể:
- Thêm bài hát.
- Phát bài hiện tại.
- Chuyển bài tiếp theo/lùi lại bài trước.
- Xóa bài hiện tại.
- Đảo thứ tự playlist.

```javascript
class Song {
  constructor(title, artist, duration) {
    this.title = title;
    this.artist = artist;
    this.duration = duration;
    this.isPlaying = false;
  }

  toString() {
    const status = this.isPlaying ? '▶️' : '⏸️';
    return `${status} ${this.title} - ${this.artist} (${this.duration})`;
  }
}

class MediaPlayer {
  constructor() {
    this.playlist = new DoublyLinkedList();
    this.currentSong = null;
  }

  addSong(title, artist, duration) {
    const song = new Song(title, artist, duration);
    this.playlist.append(song);
    if (!this.currentSong) {
      this.currentSong = this.playlist.head;
    }
    console.log(`Thêm: ${song.toString()}`);
  }

  play() {
    if (!this.currentSong) {
      console.log('Không có bài hát');
      return;
    }
    this.stopAll();
    this.currentSong.value.isPlaying = true;
    console.log(`Đang phát: ${this.currentSong.value.toString()}`);
  }

  stopAll() {
    let node = this.playlist.head;
    while (node) {
      node.value.isPlaying = false;
      node = node.next;
    }
  }

  next() {
    if (!this.currentSong || !this.currentSong.next) {
      console.log('Không có bài tiếp theo');
      return;
    }
    this.stopAll();
    this.currentSong = this.currentSong.next;
    this.play();
  }

  previous() {
    if (!this.currentSong || !this.currentSong.previous) {
      console.log('Không có bài trước');
      return;
    }
    this.stopAll();
    this.currentSong = this.currentSong.previous;
    this.play();
  }

  removeCurrent() {
    if (!this.currentSong) {
      console.log('Không có bài hiện tại');
      return;
    }
    const songToRemove = this.currentSong.value;
    console.log(`Xóa: ${songToRemove.title}`);
    let newCurrent = this.currentSong.next || this.currentSong.previous;
    this.playlist.delete(songToRemove);
    this.currentSong = newCurrent;
    if (this.currentSong) {
      this.play();
    } else {
      console.log('Playlist rỗng');
    }
  }

  shuffle() {
    console.log('Đảo playlist...');
    this.playlist.reverse();
    if (this.currentSong) {
      this.currentSong = this.playlist.find({
        callback: song => song.title === this.currentSong.value.title
      });
    }
  }

  showPlaylist() {
    console.log('\n=== PLAYLIST ===');
    if (!this.playlist.head) {
      console.log('Playlist rỗng');
      return;
    }
    const songs = this.playlist.toArray();
    songs.forEach((node, index) => {
      const marker = node === this.currentSong ? '👉' : '  ';
      console.log(`${marker} ${index + 1}. ${node.value.toString()}`);
    });
    console.log(`Tổng số bài: ${songs.length}`);
  }
}

const player = new MediaPlayer();
player.addSong('Blinding Lights', 'The Weeknd', '3:20');
player.addSong('Shape of You', 'Ed Sheeran', '3:53');
player.addSong('Bohemian Rhapsody', 'Queen', '5:55');
player.showPlaylist();
player.play();
player.next();
player.previous();
player.removeCurrent();
player.shuffle();
player.showPlaylist();
```

### Bài Tập 2: Text Editor Với Undo/Redo

**Mô tả**: Xây dựng trình soạn thảo văn bản có thể:
- Lưu lịch sử chỉnh sửa.
- Undo (quay lại) và Redo (tiến tới).
- Giới hạn lịch sử tối đa 10 trạng thái.
- Xóa lịch sử.

```javascript
class TextState {
  constructor(content, action = '') {
    this.content = content;
    this.action = action;
  }

  toString() {
    return `${this.action}: "${this.content}"`;
  }
}

class TextEditor {
  constructor(maxHistorySize = 10) {
    this.history = new DoublyLinkedList();
    this.currentState = null;
    this.maxHistorySize = maxHistorySize;
    this.setState('', 'Tạo tài liệu');
  }

  setState(content, action) {
    const newState = new TextState(content, action);
    if (this.currentState && this.currentState.next) {
      this.clearRedoHistory();
    }
    this.history.append(newState);
    this.currentState = this.history.tail;
    this.limitHistorySize();
    console.log(`Lưu trạng thái: ${action}`);
    this.showCurrentState();
  }

  clearRedoHistory() {
    let nodeToDelete = this.currentState.next;
    while (nodeToDelete) {
      const nextNode = nodeToDelete.next;
      this.history.delete(nodeToDelete.value);
      nodeToDelete = nextNode;
    }
  }

  limitHistorySize() {
    const historyArray = this.history.toArray();
    while (historyArray.length > this.maxHistorySize) {
      this.history.deleteHead();
      historyArray.shift();
      if (!this.currentState.previous) {
        this.currentState = this.history.head;
      }
    }
  }

  undo() {
    if (!this.currentState || !this.currentState.previous) {
      console.log('❌ Không thể Undo');
      return false;
    }
    this.currentState = this.currentState.previous;
    console.log('↩️ Đã Undo');
    this.showCurrentState();
    return true;
  }

  redo() {
    if (!this.currentState || !this.currentState.next) {
      console.log('❌ Không thể Redo');
      return false;
    }
    this.currentState = this.currentState.next;
    console.log('↪️ Đã Redo');
    this.showCurrentState();
    return true;
  }

  type(text) {
    const newContent = this.currentState.value.content + text;
    this.setState(newContent, `Gõ "${text}"`);
  }

  delete(numChars) {
    const currentContent = this.currentState.value.content;
    const newContent = currentContent.slice(0, -numChars);
    this.setState(newContent, `Xóa ${numChars} ký tự`);
  }

  showCurrentState() {
    if (!this.currentState) {
      console.log('Không có trạng thái');
      return;
    }
    console.log('\n=== VĂN BẢN HIỆN TẠI ===');
    console.log(`Nội dung: "${this.currentState.value.content}"`);
    console.log(`Hành động: ${this.currentState.value.action}`);
  }

  showHistory() {
    console.log('\n=== LỊCH SỬ CHỈNH SỬA ===');
    if (!this.history.head) {
      console.log('Không có lịch sử');
      return;
    }
    const states = this.history.toArray();
    states.forEach((node, index) => {
      const marker = node === this.currentState ? '👉' : '  ';
      console.log(`${marker} ${index + 1}. ${node.value.toString()}`);
    });
  }

  clearHistory() {
    this.history = new DoublyLinkedList();
    this.currentState = null;
    this.setState('', 'Xóa lịch sử');
  }
}

const editor = new TextEditor(5);
editor.type('Hello');
editor.type(' World');
editor.showHistory();
editor.undo();
editor.redo();
editor.showHistory();
```

## 🔑 Những Điểm Quan Trọng

### Khái Niệm Chính

1. **Hai dây nối**: Mỗi node có cả `next` và `previous`.
2. **Xóa cuối nhanh**: Chỉ mất O(1), không như Singly (O(n)).
3. **Duyệt ngược**: Chỉ Doubly làm được, từ tail về head.
4. **Tốn bộ nhớ hơn**: Do có thêm dây nối `previous`.

### Ưu Điểm So Với Singly

- **Xóa cuối nhanh**: Không cần tìm node trước.
- **Di chuyển hai chiều**: Hỗ trợ nút Next/Previous.
- **Xóa giữa dễ hơn**: Không cần tìm node trước.

### Lỗi Thường Gặp

1. **Quên cập nhật dây nối**:
   - Phải cập nhật cả `next` và `previous` khi thêm/xóa node.
   - **Sửa**: Kiểm tra và gán cả hai dây nối.

2. **Không xử lý trường hợp đặc biệt**:
   - Kiểm tra danh sách rỗng, chỉ có một node, v.v.
   - **Sửa**: Thêm điều kiện kiểm tra `null`.

### So Sánh Hiệu Suất

| Thao tác | Doubly | Singly | Array |
|----------|--------|--------|-------|
| Truy cập ngẫu nhiên | Chậm (O(n)) | Chậm (O(n)) | Nhanh (O(1)) |
| Thêm vào đầu | Nhanh (O(1)) | Nhanh (O(1)) | Chậm (O(n)) |
| Xóa cuối | Nhanh (O(1)) | Chậm (O(n)) | Nhanh (O(1)) |
| Duyệt ngược | Có (O(n)) | Không | Có (O(n)) |

### Khi Nào Dùng Doubly Linked List?

**Nên dùng khi**:
- Cần di chuyển qua lại (Next/Previous).
- Thường xuyên xóa node cuối.
- Làm hệ thống Undo/Redo.
- Cần duyệt ngược danh sách.

**Không nên dùng khi**:
- Cần tiết kiệm bộ nhớ.
- Chỉ đi một chiều.
- Cần truy cập ngẫu nhiên nhanh.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: LRU Cache

Xây dựng bộ nhớ đệm LRU (Least Recently Used):
- `get(key)`: Lấy giá trị và đưa lên đầu (mới dùng gần đây).
- `put(key, value)`: Thêm/cập nhật và đưa lên đầu.
- Xóa item ít dùng nhất khi cache đầy.
- Giới hạn kích thước cache.

**Gợi ý**: Kết hợp HashMap để tìm nhanh và Doubly Linked List để theo dõi thứ tự sử dụng.

### Bài Tập 2: Text Editor Với Nhiều Con Trỏ

Xây dựng trình soạn thảo văn bản nâng cao:
- Hỗ trợ nhiều con trỏ chỉnh sửa.
- Mỗi con trỏ có lịch sử Undo/Redo riêng.
- Chuyển đổi giữa các con trỏ.
- Đồng bộ hoặc chỉnh sửa riêng từng con trỏ.

**Gợi ý**: Mỗi con trỏ dùng một Doubly Linked List để lưu lịch sử chỉnh sửa.

\---



---

*Post ID: pjaolesiv5j2gta*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
