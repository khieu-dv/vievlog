---
title: "Binary Search Tree (Cây Tìm Kiếm Nhị Phân)"
postId: "kypssyr8ox7dzca"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Binary Search Tree (Cây Tìm Kiếm Nhị Phân)



## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Binary Search Tree (BST)** là gì và tại sao nó hữu ích.
- Biết cách thêm, tìm kiếm và xóa phần tử trong BST.
- Hiểu hiệu suất của BST và khi nào nó hoạt động tốt hoặc kém.
- Áp dụng BST vào bài toán như quản lý sách, xếp hạng game.
- Nhận biết lỗi thường gặp và cách tránh.

## 📝 Nội Dung Chi Tiết

### Binary Search Tree Là Gì?

**Binary Search Tree (BST)** là một cây nhị phân giúp tìm kiếm nhanh. Mỗi node có giá trị, và cây được sắp xếp theo quy tắc:
- **Node bên trái** có giá trị nhỏ hơn node cha.
- **Node bên phải** có giá trị lớn hơn node cha.

**Ví dụ thực tế**:
- Tìm sách trong thư viện theo mã ISBN.
- Xếp hạng người chơi game theo điểm số.

![Binary Search Tree](https://www.vievlog.com/dsa/images/binary-search-tree.jpg)

**Đặc điểm chính**:
- **Tìm kiếm nhanh**: Trung bình O(log n) nếu cây cân bằng.
- **Sắp xếp tự động**: Duyệt cây theo thứ tự (in-order) cho danh sách đã sắp xếp.
- **Linh hoạt**: Dễ thêm/xóa phần tử.

### Cài Đặt BST

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // Thêm giá trị
  insert(value) {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    this._insertNode(this.root, newNode);
  }

  _insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (!node.left) {
        node.left = newNode;
      } else {
        this._insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  // Tìm kiếm giá trị
  find(value) {
    return this._findNode(this.root, value);
  }

  _findNode(node, value) {
    if (!node || node.value === value) return node;
    if (value < node.value) return this._findNode(node.left, value);
    return this._findNode(node.right, value);
  }

  // Xóa giá trị
  remove(value) {
    this.root = this._removeNode(this.root, value);
  }

  _removeNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this._removeNode(node.right, value);
      return node;
    } else {
      // Node lá
      if (!node.left && !node.right) return null;
      // Node có 1 con
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      // Node có 2 con
      const minNode = this._findMin(node.right);
      node.value = minNode.value;
      node.right = this._removeNode(node.right, minNode.value);
      return node;
    }
  }

  _findMin(node) {
    while (node.left) node = node.left;
    return node;
  }

  // Lấy danh sách đã sắp xếp
  toArray() {
    const result = [];
    this._inOrder(this.root, result);
    return result;
  }

  _inOrder(node, result) {
    if (node) {
      this._inOrder(node.left, result);
      result.push(node.value);
      this._inOrder(node.right, result);
    }
  }
}
```

### Phân Tích Hiệu Suất

| Thao tác       | Trung bình | Xấu nhất | Tốt nhất |
|----------------|------------|----------|----------|
| Tìm kiếm       | O(log n)   | O(n)     | O(1)     |
| Thêm           | O(log n)   | O(n)     | O(1)     |
| Xóa            | O(log n)   | O(n)     | O(1)     |
| Duyệt In-Order | O(n)       | O(n)     | O(n)     |

**Lưu ý**: Hiệu suất xấu nhất (O(n)) xảy ra khi cây lệch (giống linked list), ví dụ khi thêm số theo thứ tự tăng dần.

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Quản Lý Thư Viện Sách

**Đề bài**: Xây dựng hệ thống quản lý sách:
- Quản lý sách theo mã ISBN và tên.
- Tìm kiếm sách theo ISBN hoặc tên.
- Theo dõi số lượng sách và trạng thái mượn.
- Hiển thị sách mới nhất.

```javascript
class Book {
  constructor(isbn, title, year) {
    this.isbn = isbn;
    this.title = title;
    this.year = year;
    this.available = 1;
    this.borrowed = 0;
  }

  borrow() {
    if (this.available > 0) {
      this.available--;
      this.borrowed++;
      return true;
    }
    return false;
  }

  returnBook() {
    if (this.borrowed > 0) {
      this.borrowed--;
      this.available++;
      return true;
    }
    return false;
  }

  toString() {
    return `[${this.isbn}] ${this.title} (${this.year}) - ${this.available}/${this.available + this.borrowed}`;
  }
}

class LibrarySystem {
  constructor() {
    this.isbnTree = new BinarySearchTree();
    this.yearTree = new BinarySearchTree();
  }

  addBook(isbn, title, year) {
    const book = new Book(isbn, title, year);
    this.isbnTree.insert({ key: isbn, book });
    this.yearTree.insert({ key: year, book });
    console.log(`✅ Thêm: ${book.toString()}`);
  }

  findByISBN(isbn) {
    const node = this.isbnTree.find({ key: isbn });
    return node ? node.value.book : null;
  }

  findByYearRange(start, end) {
    const result = [];
    this._findYearRange(this.yearTree.root, start, end, result);
    return result.map(node => node.book);
  }

  _findYearRange(node, start, end, result) {
    if (!node) return;
    if (node.value.key >= start && node.value.key <= end) {
      result.push(node.value);
    }
    if (node.value.key > start) this._findYearRange(node.left, start, end, result);
    if (node.value.key < end) this._findYearRange(node.right, start, end, result);
  }

  borrowBook(isbn) {
    const book = this.findByISBN(isbn);
    if (!book) {
      console.log(`❌ Không tìm thấy sách ${isbn}`);
      return false;
    }
    if (book.borrow()) {
      console.log(`📖 Mượn: ${book.toString()}`);
      return true;
    }
    console.log(`❌ Hết sách: ${book.toString()}`);
    return false;
  }
}

// Demo
const library = new LibrarySystem();
library.addBook('123', 'Clean Code', 2008);
library.addBook('456', 'JavaScript Basics', 2010);
library.addBook('789', 'Algorithms', 2020);
library.borrowBook('123');
console.log('\n📚 Sách từ 2008-2015:');
library.findByYearRange(2008, 2015).forEach(book => console.log(`- ${book.toString()}`));
```

**Giải thích**:
- **Book**: Lưu thông tin sách (ISBN, tên, năm, số lượng).
- **LibrarySystem**: Dùng hai BST để sắp xếp theo ISBN và năm.
- **Tìm kiếm theo năm**: Duyệt cây để lấy sách trong khoảng năm.

### Bài Tập 2: Xếp Hạng Game Online

**Đề bài**: Xây dựng hệ thống xếp hạng người chơi:
- Quản lý điểm số và tên người chơi.
- Tìm kiếm người chơi theo tên.
- Hiển thị top 5 người chơi cao điểm.
- Cập nhật điểm sau mỗi trận.

```javascript
class Player {
  constructor(name, score = 1000) {
    this.name = name;
    this.score = score;
  }

  updateScore(points, won) {
    this.score += won ? points : -points;
    this.score = Math.max(0, this.score);
  }

  toString() {
    return `${this.name}: ${this.score} điểm`;
  }
}

class RankingSystem {
  constructor() {
    this.tree = new BinarySearchTree();
    this.players = new Map();
  }

  addPlayer(name, score = 1000) {
    if (this.players.has(name)) {
      console.log(`❌ Người chơi ${name} đã tồn tại`);
      return false;
    }
    const player = new Player(name, score);
    this.tree.insert({ key: score, player });
    this.players.set(name, player);
    console.log(`✅ Thêm: ${player.toString()}`);
    return true;
  }

  updateMatch(name, points, won) {
    const player = this.players.get(name);
    if (!player) {
      console.log(`❌ Không tìm thấy ${name}`);
      return false;
    }
    this.tree = new BinarySearchTree(); // Tạo lại cây
    this.players.forEach(p => this.tree.insert({ key: p.score, player: p }));
    player.updateScore(points, won);
    this.tree.insert({ key: player.score, player });
    console.log(`🎮 ${name} ${won ? 'THẮNG' : 'THUA'}: ${player.score} điểm`);
    return true;
  }

  getTopPlayers(limit = 5) {
    const all = [];
    this._inOrder(this.tree.root, all);
    return all.slice(-limit).reverse().map(node => node.player);
  }

  _inOrder(node, result) {
    if (node) {
      this._inOrder(node.right, result);
      result.push(node.value);
      this._inOrder(node.left, result);
    }
  }
}

// Demo
const ranking = new RankingSystem();
['An', 'Bình', 'Cường'].forEach(name => ranking.addPlayer(name));
ranking.updateMatch('An', 50, true);
ranking.updateMatch('Bình', 20, false);
console.log('\n🏆 Top 5 người chơi:');
ranking.getTopPlayers().forEach((p, i) => console.log(`${i + 1}. ${p.toString()}`));
```

**Giải thích**:
- **Player**: Lưu thông tin người chơi (tên, điểm).
- **RankingSystem**: Dùng BST để sắp xếp theo điểm.
- **Top 5**: Duyệt cây in-order để lấy danh sách đã sắp xếp.

## 🔑 Những Điểm Quan Trọng

### Khái Niệm Cốt Lõi
1. **Quy tắc BST**: Node trái < cha < node phải.
2. **Hiệu quả**: Tìm kiếm/thêm/xóa là O(log n) nếu cây cân bằng.
3. **Duyệt In-Order**: Cho danh sách đã sắp xếp.

### Ưu Điểm
- **Nhanh**: Tìm kiếm/thêm/xóa nhanh khi cây cân bằng.
- **Sắp xếp tự động**: Không cần sort lại dữ liệu.
- **Ứng dụng**: Quản lý dữ liệu có thứ tự như điểm số, danh sách.

### Lỗi Thường Gặp
1. **Cây lệch**:
   ```javascript
   // Sai: Thêm số theo thứ tự tăng
   bst.insert(1); bst.insert(2); bst.insert(3); // Thành linked list
   // Đúng: Dùng AVL Tree hoặc shuffle dữ liệu trước
   ```
2. **Xóa sai**:
   - Quên xử lý node có 2 con, cần tìm node nhỏ nhất bên phải.
3. **Null check**:
   ```javascript
   // Sai
   node.left.find(value); // Lỗi nếu node.left là null
   // Đúng
   if (node.left) node.left.find(value);
   ```

### So Sánh Với Cấu Trúc Khác
- **BST vs Array**: BST nhanh hơn khi tìm kiếm/thêm/xóa (O(log n) so với O(n)).
- **BST vs Hash Table**: Hash Table nhanh hơn cho tìm kiếm (O(1)), nhưng không giữ thứ tự.
- **BST vs AVL Tree**: AVL Tree luôn đảm bảo O(log n), BST có thể tệ hơn nếu lệch.

### Ứng Dụng Thực Tế
1. **Quản lý thư viện**: Tìm sách theo ISBN hoặc năm.
2. **Xếp hạng game**: Sắp xếp người chơi theo điểm.
3. **Từ điển**: Tìm từ theo thứ tự bảng chữ cái.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Quản Lý Nhân Viên
Xây dựng hệ thống quản lý nhân viên:
- Quản lý theo ID, tên, lương.
- Tìm kiếm theo ID hoặc khoảng lương.
- Hiển thị top 5 nhân viên lương cao.
- Thống kê số nhân viên theo phòng ban.

**Gợi ý**: Dùng hai BST: một theo ID, một theo lương.

### Bài Tập 2: Quản Lý Chi Tiêu
Xây dựng ứng dụng theo dõi chi tiêu:
- Ghi lại giao dịch (ngày, số tiền, danh mục).
- Tìm giao dịch theo ngày hoặc số tiền.
- Hiển thị giao dịch lớn nhất/nhỏ nhất.
- Báo cáo chi tiêu theo danh mục.

**Gợi ý**: Dùng BST theo ngày và số tiền để tìm kiếm nhanh.



---

*Post ID: kypssyr8ox7dzca*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
