---
title: "Red-Black Tree (Cây Đỏ-Đen)"
postId: "7y7t9t998fim1cq"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Red-Black Tree (Cây Đỏ-Đen)

## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Cây Đỏ-Đen** là gì và tại sao nó đảm bảo cân bằng.
- Nắm được **5 quy tắc màu sắc** và cách chúng giữ cây ổn định.
- Biết cách thêm node và cân bằng cây bằng **recoloring** và **rotation**.
- So sánh Cây Đỏ-Đen với AVL Tree.
- Áp dụng vào bài toán như quản lý tín dụng hoặc sự kiện thời gian thực.

## 📝 Nội Dung Chi Tiết

### Giới Thiệu Cây Đỏ-Đen

**Cây Đỏ-Đen** là một cây tìm kiếm nhị phân tự cân bằng. Mỗi node có màu (đỏ hoặc đen), và màu sắc được dùng để giữ cây cân bằng khi thêm hoặc xóa node. Nó giống như một sân chơi với các quy tắc nghiêm ngặt để đảm bảo mọi thứ công bằng.

![Red-Black Tree](https://upload.wikimedia.org/wikipedia/commons/6/66/Red-black_tree_example.svg)

### Năm Quy Tắc Của Cây Đỏ-Đen

Cây Đỏ-Đen phải tuân theo 5 quy tắc:
1. Mỗi node là **đỏ** hoặc **đen**.
2. Node gốc (**root**) luôn **đen**.
3. Tất cả lá (**NIL**) là **đen**.
4. Node đỏ không được có con đỏ (không có hai node đỏ liền kề).
5. Mọi đường từ gốc đến lá có cùng số node đen.

```javascript
function isValidRedBlackTree(node, blackHeight = 0) {
  if (!node) return blackHeight + 1; // Lá (NIL) có black-height 1

  // Kiểm tra quy tắc 4: Không có hai node đỏ liền kề
  if (node.color === 'red' && (node.left?.color === 'red' || node.right?.color === 'red')) {
    return -1; // Vi phạm
  }

  // Kiểm tra black-height bên trái và phải
  const leftHeight = isValidRedBlackTree(node.left, blackHeight);
  const rightHeight = isValidRedBlackTree(node.right, blackHeight);

  // Quy tắc 5: Black-height phải bằng nhau
  if (leftHeight !== rightHeight || leftHeight === -1) return -1;

  return leftHeight + (node.color === 'black' ? 1 : 0);
}
```

### Hệ Quả Từ Quy Tắc
- Cây **gần như cân bằng**, đảm bảo tìm kiếm/thêm/xóa trong O(log n).
- Đường dài nhất không quá gấp đôi đường ngắn nhất.

### Cách Cân Bằng Cây Đỏ-Đen

Khi thêm node mới (luôn đỏ), có thể vi phạm quy tắc 4. Có hai cách sửa:
1. **Recoloring**: Đổi màu của node cha, ông, và chú (uncle) nếu chú là đỏ.
2. **Rotation**: Xoay cây nếu chú là đen hoặc null, gồm 4 trường hợp: LL, LR, RR, RL.

![Red-Black Tree Balancing - Uncle Red](https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase2.png)

**Recoloring (Chú đỏ)**:
```javascript
if (node.uncle?.color === 'red') {
  node.parent.color = 'black';
  node.uncle.color = 'black';
  if (node.grandparent !== root) node.grandparent.color = 'red';
  balance(node.grandparent);
}
```

**Rotation (Chú đen/null)**:
- **Left-Left**: Xoay phải ông.
- **Left-Right**: Xoay trái cha, rồi xoay phải ông.
- **Right-Right**: Xoay trái ông.
- **Right-Left**: Xoay phải cha, rồi xoay trái ông.

![Left-Left Case](https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3a1.png)
![Left-Right Case](https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3b.png)
![Right-Right Case](https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3c.png)
![Right-Left Case](https://www.geeksforgeeks.org/wp-content/uploads/redBlackCase3d.png)

### Cài Đặt Cây Đỏ-Đen

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = 'red';
  }
}

class RedBlackTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const node = new Node(value);
    if (!this.root) {
      this.root = node;
      node.color = 'black';
    } else {
      this._insertBST(node);
      this.balance(node);
    }
  }

  _insertBST(node) {
    let current = this.root;
    while (current) {
      if (node.value < current.value) {
        if (!current.left) {
          current.left = node;
          node.parent = current;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          node.parent = current;
          break;
        }
        current = current.right;
      }
    }
  }

  balance(node) {
    if (node === this.root) {
      node.color = 'black';
      return;
    }

    if (node.parent.color === 'black') return;

    const grandparent = node.parent.parent;
    const uncle = node.parent === grandparent?.left ? grandparent.right : grandparent.left;

    if (uncle?.color === 'red') {
      node.parent.color = 'black';
      uncle.color = 'black';
      if (grandparent !== this.root) grandparent.color = 'red';
      this.balance(grandparent);
    } else {
      if (grandparent) {
        if (node.parent === grandparent.left) {
          if (node === node.parent.left) {
            this._leftLeftRotation(grandparent);
          } else {
            this._leftRightRotation(grandparent);
          }
        } else {
          if (node === node.parent.right) {
            this._rightRightRotation(grandparent);
          } else {
            this._rightLeftRotation(grandparent);
          }
        }
      }
    }
  }

  _leftLeftRotation(grandparent) {
    const parent = grandparent.left;
    grandparent.left = parent.right;
    if (parent.right) parent.right.parent = grandparent;
    parent.right = grandparent;
    this._updateParent(grandparent, parent);
    [parent.color, grandparent.color] = [grandparent.color, parent.color];
  }

  _leftRightRotation(grandparent) {
    const parent = grandparent.left;
    const node = parent.right;
    parent.right = node.left;
    if (node.left) node.left.parent = parent;
    node.left = parent;
    parent.parent = node;
    grandparent.left = node;
    node.parent = grandparent;
    this._leftLeftRotation(grandparent);
  }

  _rightRightRotation(grandparent) {
    const parent = grandparent.right;
    grandparent.right = parent.left;
    if (parent.left) parent.left.parent = grandparent;
    parent.left = grandparent;
    this._updateParent(grandparent, parent);
    [parent.color, grandparent.color] = [grandparent.color, parent.color];
  }

  _rightLeftRotation(grandparent) {
    const parent = grandparent.right;
    const node = parent.left;
    parent.left = node.right;
    if (node.right) node.right.parent = parent;
    node.right = parent;
    parent.parent = node;
    grandparent.right = node;
    node.parent = grandparent;
    this._rightRightRotation(grandparent);
  }

  _updateParent(oldNode, newNode) {
    newNode.parent = oldNode.parent;
    if (oldNode.parent) {
      if (oldNode === oldNode.parent.left) oldNode.parent.left = newNode;
      else oldNode.parent.right = newNode;
    } else {
      this.root = newNode;
    }
    oldNode.parent = newNode;
  }
}
```

### So Sánh Với AVL Tree

| Tiêu chí         | Cây Đỏ-Đen       | AVL Tree         |
|------------------|------------------|------------------|
| Cân bằng         | Gần như cân bằng | Rất cân bằng     |
| Tìm kiếm         | O(log n)         | Nhanh hơn chút   |
| Thêm/Xóa         | Nhanh hơn        | Chậm hơn         |
| Bộ nhớ           | 1 bit màu/node   | Không cần màu    |
| Khi dùng         | Nhiều thêm/xóa   | Nhiều tìm kiếm   |

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Quản Lý Điểm Tín Dụng Ngân Hàng

**Đề bài**: Xây dựng hệ thống quản lý điểm tín dụng:
- Thêm khách hàng với điểm tín dụng (300-850).
- Cập nhật điểm tín dụng khi có giao dịch.
- Tìm khách hàng theo ID hoặc điểm.
- Báo cáo top 5 khách hàng tín dụng cao.

```javascript
class Customer {
  constructor(id, name, score) {
    this.id = id;
    this.name = name;
    this.score = score;
  }

  updateScore(newScore, reason) {
    const oldScore = this.score;
    this.score = Math.max(300, Math.min(850, newScore));
    console.log(`📊 ${this.name}: ${oldScore} → ${this.score} (${reason})`);
  }

  toString() {
    return `[${this.id}] ${this.name} - Điểm: ${this.score}`;
  }
}

class CreditSystem {
  constructor() {
    this.treeByScore = new RedBlackTree();
    this.treeById = new RedBlackTree();
    this.customers = new Map();
  }

  addCustomer(id, name, score) {
    if (this.customers.has(id)) {
      console.log(`❌ Khách hàng ID ${id} đã tồn tại`);
      return false;
    }
    const customer = new Customer(id, name, score);
    this.treeByScore.insert(customer);
    this.treeById.insert(customer);
    this.customers.set(id, customer);
    console.log(`✅ Thêm: ${customer.toString()}`);
    return true;
  }

  updateScore(id, newScore, reason) {
    const customer = this.customers.get(id);
    if (!customer) {
      console.log(`❌ Không tìm thấy khách hàng ID ${id}`);
      return false;
    }
    this.treeByScore = new RedBlackTree(); // Tạo lại cây
    this.customers.forEach(c => this.treeByScore.insert(c));
    customer.updateScore(newScore, reason);
    this.treeByScore.insert(customer);
    return true;
  }

  getTopCustomers(limit = 5) {
    const all = [];
    this._inOrder(this.treeByScore.root, all);
    console.log(`\n🏆 Top ${limit} khách hàng:`);
    all.slice(-limit).reverse().forEach((c, i) => console.log(`${i + 1}. ${c.toString()}`));
  }

  _inOrder(node, result) {
    if (node) {
      this._inOrder(node.left, result);
      result.push(node.value);
      this._inOrder(node.right, result);
    }
  }
}

// Demo
const system = new CreditSystem();
system.addCustomer(1, 'An', 650);
system.addCustomer(2, 'Bình', 720);
system.addCustomer(3, 'Cường', 580);
system.updateScore(1, 700, 'Thanh toán đúng hạn');
system.getTopCustomers();
```

**Giải thích**:
- **Customer**: Lưu thông tin khách hàng (ID, tên, điểm).
- **CreditSystem**: Dùng hai cây Đỏ-Đen theo ID và điểm.
- **Top khách hàng**: Duyệt cây theo thứ tự để lấy danh sách đã sắp xếp.

### Bài Tập 2: Quản Lý Sự Kiện Thời Gian Thực

**Đề bài**: Xây dựng hệ thống quản lý sự kiện:
- Thêm sự kiện với độ ưu tiên (1-10, 1 là cao nhất).
- Xử lý sự kiện theo ưu tiên.
- Cập nhật ưu tiên động.
- Báo cáo hiệu suất (số sự kiện xử lý, trạng thái).

```javascript
class Event {
  constructor(id, name, priority) {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.status = 'PENDING';
  }

  toString() {
    return `[${this.id}] ${this.name} (P${this.priority}) - ${this.status}`;
  }

  process() {
    this.status = Math.random() > 0.1 ? 'COMPLETED' : 'FAILED';
  }
}

class EventSystem {
  constructor() {
    this.tree = new RedBlackTree();
    this.events = new Map();
  }

  addEvent(id, name, priority) {
    if (this.events.has(id)) {
      console.log(`❌ Sự kiện ID ${id} đã tồn tại`);
      return false;
    }
    const event = new Event(id, name, priority);
    this.tree.insert(event);
    this.events.set(id, event);
    console.log(`📅 Thêm: ${event.toString()}`);
    return true;
  }

  processNextEvent() {
    const all = [];
    this._inOrder(this.tree.root, all);
    const pending = all.find(e => e.status === 'PENDING');
    if (!pending) {
      console.log('📭 Không còn sự kiện để xử lý');
      return null;
    }
    this.tree = new RedBlackTree();
    this.events.forEach(e => this.tree.insert(e));
    pending.process();
    console.log(`${pending.status === 'COMPLETED' ? '✅' : '❌'} Xử lý: ${pending.toString()}`);
    return pending;
  }

  _inOrder(node, result) {
    if (node) {
      this._inOrder(node.left, result);
      result.push(node.value);
      this._inOrder(node.right, result);
    }
  }
}

// Demo
const eventSystem = new EventSystem();
eventSystem.addEvent('E1', 'Thanh toán', 2);
eventSystem.addEvent('E2', 'Gửi email', 5);
eventSystem.addEvent('E3', 'Cập nhật', 3);
eventSystem.processNextEvent();
```

**Giải thích**:
- **Event**: Lưu thông tin sự kiện (ID, tên, ưu tiên, trạng thái).
- **EventSystem**: Dùng cây Đỏ-Đen để sắp xếp theo ưu tiên.
- **Xử lý sự kiện**: Lấy sự kiện ưu tiên cao nhất (nhỏ nhất).

## 🔑 Những Điểm Quan Trọng

### Khái Niệm Cốt Lõi
1. **Quy tắc màu sắc**: Đảm bảo cây cân bằng qua 5 quy tắc.
2. **Recoloring và Rotation**: Sửa vi phạm bằng đổi màu hoặc xoay cây.
3. **Hiệu quả**: Tất cả thao tác (tìm kiếm, thêm, xóa) trong O(log n).

### Lỗi Thường Gặp
1. **Vi phạm quy tắc 4**:
   ```javascript
   // Sai: Node đỏ có con đỏ
   node.color = 'red';
   node.left.color = 'red';
   ```
2. **Quên cập nhật root**:
   ```javascript
   // Đúng: Root phải đen
   if (node === this.root) node.color = 'black';
   ```
3. **Sai rotation**:
   - Kiểm tra kỹ trường hợp LL, LR, RR, RL.

### So Sánh Với AVL Tree
- **Cây Đỏ-Đen**: Nhanh hơn khi thêm/xóa, phù hợp với hệ thống động.
- **AVL Tree**: Nhanh hơn khi tìm kiếm, phù hợp với dữ liệu tĩnh.

### Ứng Dụng Thực Tế
1. **Ngân hàng**: Quản lý điểm tín dụng, xếp hạng khách hàng.
2. **Sự kiện**: Xử lý công việc theo ưu tiên.
3. **Hệ thống**: Quản lý tài nguyên, lịch trình.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Xếp Hạng Học Sinh
Xây dựng hệ thống quản lý điểm học sinh:
- Thêm học sinh với điểm trung bình (0-10).
- Cập nhật điểm khi có bài kiểm tra mới.
- Hiển thị top 5 học sinh có điểm cao.
- Tìm học sinh trong khoảng điểm.

**Gợi ý**: Dùng cây Đỏ-Đen để sắp xếp theo điểm.

### Bài Tập 2: Quản Lý Tác Vụ
Xây dựng task manager:
- Thêm tác vụ với độ ưu tiên (1-10).
- Xử lý tác vụ ưu tiên cao nhất.
- Cập nhật ưu tiên khi cần.
- Báo cáo số tác vụ đã hoàn thành.

**Gợi ý**: Dùng cây Đỏ-Đen theo ưu tiên, thêm thời gian tạo để xử lý trường hợp bằng nhau.


---

*Post ID: 7y7t9t998fim1cq*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
