---
title: "AVL Tree (Cây AVL)"
postId: "0o0rr3ss3gr4alx"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# AVL Tree (Cây AVL)



## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **AVL Tree** là gì và tại sao cần tự cân bằng.
- Biết cách tính **Balance Factor** và nhận biết mất cân bằng.
- Hiểu 4 phép xoay để cân bằng cây.
- Áp dụng AVL Tree vào bài toán như xếp hạng game, quản lý nhân viên.
- So sánh AVL Tree với các cấu trúc dữ liệu khác.

## 📝 Nội Dung Chi Tiết

### AVL Tree Là Gì?

**AVL Tree** là một cây nhị phân tìm kiếm (BST) tự cân bằng, đảm bảo độ cao cây luôn thấp để thao tác nhanh (O(log n)). Nó giống như một người đi dây, tự điều chỉnh để không bị ngã khi thêm hoặc xóa phần tử.

**Ví dụ thực tế**:
- Xếp hạng game: Người chơi được sắp xếp theo điểm, dễ tìm top cao nhất.
- Quản lý nhân viên: Lưu thông tin lương, tìm kiếm nhanh theo tiêu chí.

### Tính Chất Quan Trọng

**Balance Factor (Hệ số cân bằng)**: Độ cao cây con trái trừ độ cao cây con phải, phải nằm trong {-1, 0, 1}.

```javascript
function getBalanceFactor(node) {
  if (!node) return 0;
  const leftHeight = node.left ? node.left.height : 0;
  const rightHeight = node.right ? node.right.height : 0;
  return leftHeight - rightHeight;
}
```

**Đặc điểm chính**:
- **Tự cân bằng**: Tự động điều chỉnh sau khi thêm/xóa.
- **Hiệu quả**: Mọi thao tác (tìm, thêm, xóa) là O(log n).
- **Cân bằng độ cao**: Giữ cây thấp, không bị lệch.

![AVL Tree](https://upload.wikimedia.org/wikipedia/commons/f/fd/AVL_Tree_Example.gif)

*Animation thể hiện việc chèn phần tử vào AVL Tree với các phép xoay*

![AVL Tree with Balance Factors](https://upload.wikimedia.org/wikipedia/commons/a/ad/AVL-tree-wBalance_K.svg)

*AVL Tree với balance factors (màu xanh)*

### Các Phép Xoay AVL

AVL Tree dùng 4 phép xoay để giữ cân bằng:

#### 1. Left-Left Rotation (Xoay Trái-Trái)
Khi cây lệch trái (BF > 1) và cây con trái cũng lệch trái hoặc cân bằng.

![Left-Left Rotation](https://www.vievlog.com/data_structures/ds_images/LL%20Rotation.png)

```javascript
rotateLeftLeft(node) {
  const left = node.left;
  node.left = left.right;
  left.right = node;
  return left; // Trả về node mới làm gốc
}
```

#### 2. Right-Right Rotation (Xoay Phải-Phải)
Khi cây lệch phải (BF < -1) và cây con phải cũng lệch phải hoặc cân bằng.

![Right-Right Rotation](https://www.vievlog.com/data_structures/ds_images/RR%20Rotation.png)

#### 3. Left-Right Rotation (Xoay Trái-Phải)
Khi cây lệch trái (BF > 1) nhưng cây con trái lệch phải.

![Left-Right Rotation](https://www.vievlog.com/data_structures/ds_images/LR%20Rotation.png)

#### 4. Right-Left Rotation (Xoay Phải-Trái)
Khi cây lệch phải (BF < -1) nhưng cây con phải lệch trái.

![Right-Left Rotation](https://www.vievlog.com/data_structures/ds_images/RL%20Rotation.png)

### Cài Đặt AVL Tree

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  // Lấy chiều cao node
  getHeight(node) {
    return node ? node.height : 0;
  }

  // Cập nhật chiều cao node
  updateHeight(node) {
    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  // Tính hệ số cân bằng
  getBalanceFactor(node) {
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  // Xoay trái-trái
  rotateLeftLeft(node) {
    const left = node.left;
    node.left = left.right;
    left.right = node;
    this.updateHeight(node);
    this.updateHeight(left);
    return left;
  }

  // Xoay phải-phải
  rotateRightRight(node) {
    const right = node.right;
    node.right = right.left;
    right.left = node;
    this.updateHeight(node);
    this.updateHeight(right);
    return right;
  }

  // Thêm node
  insert(value) {
    this.root = this._insert(this.root, value);
  }

  _insert(node, value) {
    if (!node) return new Node(value);

    if (value < node.value) {
      node.left = this._insert(node.left, value);
    } else if (value > node.value) {
      node.right = this._insert(node.right, value);
    } else {
      return node; // Không cho phép giá trị trùng
    }

    this.updateHeight(node);
    return this.balance(node);
  }

  // Cân bằng cây
  balance(node) {
    const bf = this.getBalanceFactor(node);

    if (bf > 1) { // Lệch trái
      if (this.getBalanceFactor(node.left) < 0) { // Left-Right
        node.left = this.rotateRightRight(node.left);
      }
      return this.rotateLeftLeft(node); // Left-Left
    } else if (bf < -1) { // Lệch phải
      if (this.getBalanceFactor(node.right) > 0) { // Right-Left
        node.right = this.rotateLeftLeft(node.right);
      }
      return this.rotateRightRight(node); // Right-Right
    }

    return node;
  }
}
```

### So Sánh Hiệu Suất

| Thao tác     | AVL Tree    | BST (Tốt) | BST (Xấu) | Array | Hash Table |
|--------------|-------------|-----------|-----------|-------|------------|
| Tìm kiếm     | O(log n)    | O(log n)  | O(n)      | O(n)  | O(1) trung bình |
| Thêm         | O(log n)    | O(log n)  | O(n)      | O(n)  | O(1) trung bình |
| Xóa          | O(log n)    | O(log n)  | O(n)      | O(n)  | O(1) trung bình |

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Hệ Thống Xếp Hạng Game

**Đề bài**: Xây dựng hệ thống xếp hạng người chơi:
- Quản lý điểm số (ELO).
- Tìm kiếm người chơi theo tên hoặc điểm.
- Cập nhật điểm sau mỗi trận.
- Hiển thị top 5 người chơi.

```javascript
class Player {
  constructor(name, score) {
    this.name = name;
    this.score = score;
    this.wins = 0;
    this.losses = 0;
  }

  updateScore(won, points) {
    if (won) {
      this.score += points;
      this.wins++;
    } else {
      this.score = Math.max(0, this.score - points);
      this.losses++;
    }
  }

  toString() {
    return `${this.name}: ${this.score} điểm (${this.wins}W/${this.losses}L)`;
  }
}

class RankingSystem {
  constructor() {
    this.tree = new AVLTree();
    this.players = new Map();
  }

  addPlayer(name, score = 500) {
    if (this.players.has(name)) {
      console.log(`❌ Người chơi ${name} đã tồn tại`);
      return false;
    }
    const player = new Player(name, score);
    this.tree.insert({ score, player });
    this.players.set(name, player);
    console.log(`✅ Thêm: ${player.toString()}`);
    return true;
  }

  updateMatch(name, won, points = 50) {
    const player = this.players.get(name);
    if (!player) {
      console.log(`❌ Không tìm thấy ${name}`);
      return false;
    }
    this.tree = new AVLTree(); // Xóa và tạo lại cây để cập nhật
    this.players.forEach(p => this.tree.insert({ score: p.score, player: p }));
    player.updateScore(won, points);
    this.tree.insert({ score: player.score, player });
    console.log(`🎮 ${name} ${won ? 'THẮNG' : 'THUA'}: ${player.score} điểm`);
    return true;
  }

  getTopPlayers(limit = 5) {
    const all = [];
    const traverse = node => {
      if (!node) return;
      traverse(node.right);
      all.push(node.value.player);
      traverse(node.left);
    };
    traverse(this.tree.root);
    return all.slice(0, limit);
  }

  showLeaderboard() {
    console.log('\n🏆 BẢNG XẾP HẠNG');
    this.getTopPlayers().forEach((player, i) => {
      console.log(`${i + 1}. ${player.toString()}`);
    });
  }
}

// Demo
const ranking = new RankingSystem();
['An', 'Bình', 'Cường'].forEach(name => ranking.addPlayer(name));
ranking.updateMatch('An', true, 50);
ranking.updateMatch('Bình', false, 20);
ranking.updateMatch('Cường', true, 30);
ranking.showLeaderboard();
```

**Giải thích**:
- **Player**: Lưu thông tin người chơi (tên, điểm, thắng/thua).
- **RankingSystem**: Dùng AVL Tree để sắp xếp theo điểm, tự cân bằng khi cập nhật.
- **Leaderboard**: Lấy top người chơi bằng cách duyệt cây.

### Bài Tập 2: Hệ Thống Quản Lý Nhân Viên

**Đề bài**: Xây dựng hệ thống quản lý nhân viên:
- Quản lý thông tin: ID, tên, lương, phòng ban.
- Tìm kiếm theo lương hoặc phòng ban.
- Báo cáo thống kê lương trung bình.
- Hiển thị top 5 nhân viên lương cao.

```javascript
class Employee {
  constructor(id, name, salary, department) {
    this.id = id;
    this.name = name;
    this.salary = salary;
    this.department = department;
  }

  toString() {
    return `[${this.id}] ${this.name} - ${this.department} (${this.salary.toLocaleString()}đ)`;
  }
}

class HRSystem {
  constructor() {
    this.tree = new AVLTree();
    this.employees = new Map();
  }

  addEmployee(id, name, salary, department) {
    if (this.employees.has(id)) {
      console.log(`❌ Nhân viên ID ${id} đã tồn tại`);
      return false;
    }
    const employee = new Employee(id, name, salary, department);
    this.tree.insert({ salary, employee });
    this.employees.set(id, employee);
    console.log(`✅ Thêm: ${employee.toString()}`);
    return true;
  }

  findBySalaryRange(min, max) {
    const result = [];
    const traverse = node => {
      if (!node) return;
      if (node.value.salary >= min && node.value.salary <= max) {
        result.push(node.value.employee);
      }
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.tree.root);
    return result;
  }

  showTopEmployees(limit = 5) {
    const all = [];
    const traverse = node => {
      if (!node) return;
      traverse(node.right);
      all.push(node.value.employee);
      traverse(node.left);
    };
    traverse(this.tree.root);
    console.log('\n🌟 TOP NHÂN VIÊN LƯƠNG CAO');
    all.slice(0, limit).forEach((emp, i) => {
      console.log(`${i + 1}. ${emp.toString()}`);
    });
  }
}

// Demo
const hr = new HRSystem();
hr.addEmployee(1, 'An', 15000000, 'IT');
hr.addEmployee(2, 'Bình', 20000000, 'HR');
hr.addEmployee(3, 'Cường', 18000000, 'IT');
const results = hr.findBySalaryRange(15000000, 20000000);
console.log('\n🔍 Nhân viên lương 15-20 triệu:');
results.forEach(emp => console.log(`- ${emp.toString()}`));
hr.showTopEmployees();
```

**Giải thích**:
- **Employee**: Lưu thông tin nhân viên.
- **HRSystem**: Dùng AVL Tree để sắp xếp theo lương, hỗ trợ tìm kiếm nhanh.
- **Tìm kiếm theo lương**: Duyệt cây để lọc nhân viên trong khoảng lương.

## 🔑 Những Điểm Quan Trọng

### Khái Niệm Cốt Lõi
1. **Balance Factor**: Phải nằm trong {-1, 0, 1} để cây cân bằng.
2. **Tự cân bằng**: Dùng 4 phép xoay để giữ độ cao thấp.
3. **Hiệu quả**: O(log n) cho tìm kiếm, thêm, xóa.

### Ưu Điểm
- **Nhanh**: Luôn đảm bảo O(log n), không bị lệch như BST.
- **Ứng dụng**: Phù hợp với hệ thống cần sắp xếp và tìm kiếm nhanh.
- **Tự động**: Tự cân bằng, giảm công sức lập trình.

### Lỗi Thường Gặp
1. **Không cập nhật chiều cao**:
   ```javascript
   // Sai
   node.height = 1; // Cứng
   // Đúng
   node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
   ```
2. **Chọn sai phép xoay**:
   - Kiểm tra BF của node và node con để chọn đúng Left-Left, Right-Right, v.v.
3. **Quên cân bằng sau xóa**:
   - Phải kiểm tra và cân bằng từ node xóa lên tới gốc.

### So Sánh Với Cấu Trúc Khác
- **AVL vs BST**: AVL nhanh hơn trong trường hợp xấu (O(log n) so với O(n)).
- **AVL vs Array**: AVL nhanh hơn khi tìm kiếm hoặc thêm/xóa (O(log n) so với O(n)).
- **AVL vs Hash Table**: Hash Table nhanh hơn cho tìm kiếm (O(1)), nhưng không hỗ trợ thứ tự.

### Ứng Dụng Thực Tế
1. **Xếp hạng game**: Sắp xếp người chơi theo điểm.
2. **Quản lý nhân viên**: Tìm kiếm theo lương, phòng ban.
3. **Quản lý thư viện**: Tìm sách theo năm xuất bản hoặc thể loại.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Quản Lý Thư Viện
Xây dựng hệ thống quản lý sách:
- Quản lý theo ISBN, tác giả, năm xuất bản.
- Tìm kiếm sách trong khoảng năm xuất bản.
- Theo dõi lượt mượn sách.
- Báo cáo sách phổ biến.

**Gợi ý**: Dùng AVL Tree để sắp xếp theo năm xuất bản, hỗ trợ tìm kiếm nhanh.

### Bài Tập 2: Hệ Thống Đặt Hàng
Xây dựng hệ thống ghép đơn hàng mua/bán:
- Quản lý đơn hàng theo giá và thời gian.
- Tự động ghép đơn mua và bán.
- Báo cáo số lượng giao dịch thành công.
- Tối ưu tìm kiếm đơn hàng theo giá.

**Gợi ý**: Dùng hai AVL Tree: một cho đơn mua (giá cao nhất trước), một cho đơn bán (giá thấp nhất trước).



---

*Post ID: 0o0rr3ss3gr4alx*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
