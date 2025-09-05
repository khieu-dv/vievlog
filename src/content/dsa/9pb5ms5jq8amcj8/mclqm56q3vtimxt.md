---
title: "Tree (Cây)"
postId: "mclqm56q3vtimxt"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Tree (Cây)


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, bạn sẽ:

- **Hiểu bản chất của Tree**: Nắm cấu trúc dữ liệu phân cấp, nút gốc, nút lá, chiều cao, độ sâu, và mối quan hệ cha-con.
- **Thành thạo các thao tác cơ bản**: Làm được việc thêm, xóa, tìm kiếm nút, và quản lý mối quan hệ giữa các nút trong cây nhị phân.
- **Làm chủ các phương pháp duyệt cây**: Hiểu và dùng 4 cách duyệt: In-Order, Pre-Order, Post-Order và Level-Order.
- **Ứng dụng thực tế**: Xây dựng cây gia phả, hệ thống file, hoặc máy tính biểu thức toán học.
- **Phân tích hiệu suất**: So sánh ưu nhược điểm của Tree với cấu trúc khác và biết khi nào dùng.

## 📝 Nội dung chi tiết

### Tree là gì?

Tree (Cây) là cấu trúc dữ liệu phân cấp, giống như cây gia đình. Mỗi nút có thể có nhiều con nhưng chỉ một cha (trừ nút gốc). Các nút nối bằng cạnh theo cấp bậc.

**Đặc điểm quan trọng:**
- **Hierarchical Structure**: Dữ liệu sắp xếp theo cấp từ trên xuống.
- **No Cycles**: Không có vòng lặp, chỉ một đường từ nút về gốc.
- **Connected**: Tất cả nút nối qua nút gốc.
- **Recursive Nature**: Mỗi phần con cũng là cây hoàn chỉnh.

## Các loại Tree trong bài học này

* [Binary Search Tree](https://www.vievlog.com/posts?category=rtsldf7tjuwe586&post=kypssyr8ox7dzca) - Cây tìm kiếm nhị phân
* [AVL Tree](https://www.vievlog.com/posts?category=rtsldf7tjuwe586&post=0o0rr3ss3gr4alx) - Cây AVL (tự cân bằng)
* [Red-Black Tree](https://www.vievlog.com/posts?category=rtsldf7tjuwe586&post=7y7t9t998fim1cq) - Cây đỏ-đen  
* [Segment Tree](https://www.vievlog.com/posts?category=rtsldf7tjuwe586&post=vkj92tl4he41wel) - Cây phân đoạn với min/max/sum
* [Fenwick Tree](https://www.vievlog.com/posts?category=rtsldf7tjuwe586&post=osn4eqh5ht8z8yg) - Cây Fenwick (Binary Indexed Tree)

## Khái niệm cơ bản

![Tree](https://www.vievlog.com/dsa/images/tree.jpeg)

### Thuật ngữ quan trọng

- **Root (Gốc)**: Nút trên cùng, không có cha.
- **Parent (Cha)**: Nút trên nối trực tiếp với nút hiện tại.
- **Child (Con)**: Nút dưới nối trực tiếp với nút hiện tại.
- **Leaf (Lá)**: Nút không có con.
- **Internal Node (Nút trong)**: Nút có ít nhất một con.
- **Sibling (Anh em)**: Nút chung cha.
- **Height (Chiều cao)**: Đường dài nhất từ nút đến lá.
- **Depth (Độ sâu)**: Đường từ gốc đến nút.
- **Level (Mức)**: Nút có cùng độ sâu.
- **Subtree (Cây con)**: Cây nhỏ từ một nút và con cháu.

### Triển khai BinaryTreeNode

```javascript
import Comparator from '../../utils/comparator/Comparator';
import HashTable from '../hash-table/HashTable';

export default class BinaryTreeNode {
  constructor(value = null) {
    this.left = null;           // Con trái
    this.right = null;          // Con phải
    this.parent = null;         // Nút cha
    this.value = value;         // Giá trị lưu trữ

    // Thông tin meta và comparator
    this.meta = new HashTable();
    this.nodeComparator = new Comparator();
  }

  // Getter để tính chiều cao cây con trái
  get leftHeight() {
    if (!this.left) return 0;
    return this.left.height + 1;
  }

  // Getter để tính chiều cao cây con phải
  get rightHeight() {
    if (!this.right) return 0;
    return this.right.height + 1;
  }

  // Chiều cao của nút = max(chiều cao con trái, chiều cao con phải)
  get height() {
    return Math.max(this.leftHeight, this.rightHeight);
  }

  // Hệ số cân bằng (quan trọng cho AVL Tree)
  get balanceFactor() {
    return this.leftHeight - this.rightHeight;
  }

  // Tìm nút bác/chú (uncle) - con của ông bà không phải cha
  get uncle() {
    if (!this.parent || !this.parent.parent) {
      return undefined;
    }

    // Kiểm tra ông bà có đủ 2 con không
    if (!this.parent.parent.left || !this.parent.parent.right) {
      return undefined;
    }

    // Tìm anh em của cha
    if (this.nodeComparator.equal(this.parent, this.parent.parent.left)) {
      return this.parent.parent.right;
    }
    return this.parent.parent.left;
  }

  // Thiết lập giá trị cho nút
  setValue(value) {
    this.value = value;
    return this;
  }

  // Thiết lập nút con trái và cập nhật quan hệ cha-con
  setLeft(node) {
    // Ngắt kết nối với con trái cũ
    if (this.left) {
      this.left.parent = null;
    }

    // Kết nối với con trái mới
    this.left = node;
    if (this.left) {
      this.left.parent = this;
    }

    return this;
  }

  // Thiết lập nút con phải và cập nhật quan hệ cha-con
  setRight(node) {
    // Ngắt kết nối với con phải cũ
    if (this.right) {
      this.right.parent = null;
    }

    // Kết nối với con phải mới
    this.right = node;
    if (this.right) {
      this.right.parent = this;
    }

    return this;
  }

  // Xóa nút con khỏi nút hiện tại
  removeChild(nodeToRemove) {
    if (this.left && this.nodeComparator.equal(this.left, nodeToRemove)) {
      this.left = null;
      return true;
    }

    if (this.right && this.nodeComparator.equal(this.right, nodeToRemove)) {
      this.right = null;
      return true;
    }

    return false;
  }

  // Thay thế một nút con bằng nút khác
  replaceChild(nodeToReplace, replacementNode) {
    if (!nodeToReplace || !replacementNode) {
      return false;
    }

    if (this.left && this.nodeComparator.equal(this.left, nodeToReplace)) {
      this.left = replacementNode;
      return true;
    }

    if (this.right && this.nodeComparator.equal(this.right, nodeToReplace)) {
      this.right = replacementNode;
      return true;
    }

    return false;
  }

  // Sao chép nút (static method)
  static copyNode(sourceNode, targetNode) {
    targetNode.setValue(sourceNode.value);
    targetNode.setLeft(sourceNode.left);
    targetNode.setRight(sourceNode.right);
  }

  // Duyệt cây theo thứ tự In-Order (Trái → Gốc → Phải)
  traverseInOrder() {
    let traverse = [];

    // Duyệt cây con trái trước
    if (this.left) {
      traverse = traverse.concat(this.left.traverseInOrder());
    }

    // Thêm nút hiện tại
    traverse.push(this.value);

    // Duyệt cây con phải sau
    if (this.right) {
      traverse = traverse.concat(this.right.traverseInOrder());
    }

    return traverse;
  }

  // Duyệt cây theo thứ tự Pre-Order (Gốc → Trái → Phải)
  traversePreOrder() {
    let traverse = [];

    // Thêm nút hiện tại trước
    traverse.push(this.value);

    // Duyệt cây con trái
    if (this.left) {
      traverse = traverse.concat(this.left.traversePreOrder());
    }

    // Duyệt cây con phải
    if (this.right) {
      traverse = traverse.concat(this.right.traversePreOrder());
    }

    return traverse;
  }

  // Duyệt cây theo thứ tự Post-Order (Trái → Phải → Gốc)
  traversePostOrder() {
    let traverse = [];

    // Duyệt cây con trái trước
    if (this.left) {
      traverse = traverse.concat(this.left.traversePostOrder());
    }

    // Duyệt cây con phải
    if (this.right) {
      traverse = traverse.concat(this.right.traversePostOrder());
    }

    // Thêm nút hiện tại cuối cùng
    traverse.push(this.value);

    return traverse;
  }

  toString() {
    return this.traverseInOrder().toString();
  }
}
```

### Các phương pháp duyệt cây

**1. In-Order Traversal (Trái → Gốc → Phải)**
- Duyệt trái trước, sau gốc, rồi phải.
- Dùng cho cây tìm kiếm để lấy dữ liệu sắp xếp.

**2. Pre-Order Traversal (Gốc → Trái → Phải)**
- Gốc trước, rồi trái, rồi phải.
- Dùng để sao chép cây hoặc tạo biểu thức prefix.

**3. Post-Order Traversal (Trái → Phải → Gốc)**
- Trái trước, rồi phải, sau gốc.
- Dùng để xóa cây hoặc tính từ dưới lên.

**4. Level-Order Traversal (Theo từng tầng)**
- Duyệt từng mức từ trên xuống, trái sang phải.
- Dùng hàng đợi (Queue).

### Ví dụ sử dụng cơ bản

```javascript
// Tạo cây đơn giản
const root = new BinaryTreeNode(1);
const left = new BinaryTreeNode(2);  
const right = new BinaryTreeNode(3);

root.setLeft(left);
root.setRight(right);

// Thêm nút con cho left
left.setLeft(new BinaryTreeNode(4));
left.setRight(new BinaryTreeNode(5));

// Duyệt cây
console.log('In-Order:', root.traverseInOrder());    // [4, 2, 5, 1, 3]
console.log('Pre-Order:', root.traversePreOrder());  // [1, 2, 4, 5, 3]
console.log('Post-Order:', root.traversePostOrder()); // [4, 5, 2, 3, 1]
```

## 🏆 Bài tập thực hành

### Bài tập 1: Hệ thống quản lý cây gia đình (Family Tree)

**Đề bài**: Xây dựng hệ thống quản lý gia phả. Hỗ trợ:
- Thêm thành viên mới.
- Tìm thành viên theo tên.
- Hiển thị theo thế hệ.
- Tìm quan hệ giữa hai người.
- Đếm con cháu của một người.

**Phân tích bài toán**:
- Dùng Binary Tree cho cấu trúc gia đình.
- Mỗi nút là người với thông tin.
- Quan hệ cha-con qua cây.
- Cần tìm kiếm và thống kê đơn giản.

**Lời giải chi tiết**:

```javascript
class ThanhVienGiaDinh {
  constructor(ten, namSinh, gioiTinh, ngheNghiep = '') {
    this.ten = ten;
    this.namSinh = namSinh;
    this.gioiTinh = gioiTinh;
    this.ngheNghiep = ngheNghiep;
    this.tuoi = new Date().getFullYear() - namSinh;
  }

  toString() {
    return `${this.ten} (${this.gioiTinh}, ${this.tuoi} tuổi, ${this.ngheNghiep})`;
  }
}

class HeThongGiaPhap {
  constructor(toTien) {
    this.root = new BinaryTreeNode(toTien);
    this.tongSoThanhVien = 1;
  }

  // Thêm con cho một thành viên
  themCon(tenCha, conMoi, laTrai = true) {
    const nutCha = this.timThanhVien(tenCha);
    if (!nutCha) {
      throw new Error(`Không tìm thấy ${tenCha} trong gia phả`);
    }

    const nutConMoi = new BinaryTreeNode(conMoi);
    
    if (laTrai) {
      if (nutCha.left) {
        console.log(`⚠️ ${tenCha} đã có con trai. Không thể thêm.`);
        return false;
      }
      nutCha.setLeft(nutConMoi);
      console.log(`✅ Đã thêm ${conMoi.ten} làm con trai của ${tenCha}`);
    } else {
      if (nutCha.right) {
        console.log(`⚠️ ${tenCha} đã có con gái. Không thể thêm.`);
        return false;
      }
      nutCha.setRight(nutConMoi);
      console.log(`✅ Đã thêm ${conMoi.ten} làm con gái của ${tenCha}`);
    }

    this.tongSoThanhVien++;
    return true;
  }

  // Tìm thành viên trong gia phả bằng đệ quy
  timThanhVien(ten, nut = this.root) {
    if (!nut) return null;

    if (nut.value.ten === ten) {
      return nut;
    }

    // Tìm trong nhánh con trai
    const timTrai = this.timThanhVien(ten, nut.left);
    if (timTrai) return timTrai;

    // Tìm trong nhánh con gái  
    return this.timThanhVien(ten, nut.right);
  }

  // Tìm quan hệ giữa hai người
  timQuanHe(nguoi1, nguoi2) {
    const nut1 = this.timThanhVien(nguoi1);
    const nut2 = this.timThanhVien(nguoi2);

    if (!nut1 || !nut2) {
      return 'Một trong hai người không tồn tại trong gia phả';
    }

    if (nut1 === nut2) {
      return 'Cùng một người';
    }

    // Kiểm tra quan hệ cha-con
    if (nut1.parent === nut2) {
      return `${nguoi1} là con của ${nguoi2}`;
    }
    
    if (nut2.parent === nut1) {
      return `${nguoi2} là con của ${nguoi1}`;
    }

    // Kiểm tra anh em ruột
    if (nut1.parent && nut1.parent === nut2.parent) {
      return `${nguoi1} và ${nguoi2} là anh em ruột`;
    }

    // Kiểm tra ông bà - cháu
    if (nut1.parent && nut1.parent.parent === nut2) {
      return `${nguoi1} là cháu của ${nguoi2}`;
    }
    
    if (nut2.parent && nut2.parent.parent === nut1) {
      return `${nguoi2} là cháu của ${nguoi1}`;
    }

    return 'Không xác định được quan hệ trực tiếp';
  }

  // Đếm số con cháu của một người
  demConChau(ten) {
    const nguoi = this.timThanhVien(ten);
    if (!nguoi) {
      return 0;
    }

    return this.demConChauDenQuy(nguoi) - 1; // Trừ chính người đó
  }

  demConChauDenQuy(nut) {
    if (!nut) return 0;

    let dem = 1; // Đếm chính nút này

    // Đếm con trai và con cháu của con trai
    if (nut.left) {
      dem += this.demConChauDenQuy(nut.left);
    }

    // Đếm con gái và con cháu của con gái
    if (nut.right) {
      dem += this.demConChauDenQuy(nut.right);
    }

    return dem;
  }

  // Hiển thị gia phả theo thế hệ
  hienThiGiaPhap() {
    console.log('\n🌳 === GIA PHẢ THEO THẾ HỆ ===');
    this.hienThiTheoMuc(this.root, 0);
    console.log(`\n📊 Tổng số thành viên: ${this.tongSoThanhVien} người`);
  }

  hienThiTheoMuc(nut, muc) {
    if (!nut) return;

    const khoangTrang = '  '.repeat(muc);
    const capBac = muc === 0 ? '👴 Tổ tiên' : 
                   muc === 1 ? '👨 Thế hệ 1' :
                   muc === 2 ? '👦 Thế hệ 2' : 
                   `👶 Thế hệ ${muc}`;
    
    console.log(`${khoangTrang}${capBac}: ${nut.value.toString()}`);

    // Hiển thị con trai
    if (nut.left) {
      console.log(`${khoangTrang}├─ 👦 Con trai:`);
      this.hienThiTheoMuc(nut.left, muc + 1);
    }

    // Hiển thị con gái
    if (nut.right) {
      console.log(`${khoangTrang}└─ 👧 Con gái:`);
      this.hienThiTheoMuc(nut.right, muc + 1);
    }
  }

  // Lấy danh sách thành viên theo thế hệ
  layThanhVienTheoTheHe(theHe) {
    const danhSach = [];
    this.collectTheoMuc(this.root, 0, theHe, danhSach);
    return danhSach;
  }

  collectTheoMuc(nut, mucHienTai, mucMucTieu, danhSach) {
    if (!nut) return;

    if (mucHienTai === mucMucTieu) {
      danhSach.push(nut.value);
      return;
    }

    this.collectTheoMuc(nut.left, mucHienTai + 1, mucMucTieu, danhSach);
    this.collectTheoMuc(nut.right, mucHienTai + 1, mucMucTieu, danhSach);
  }

  // Thống kê gia phả
  thongKeGiaPhap() {
    console.log('\n📈 === THỐNG KÊ GIA PHẢ ===');
    
    const thongKe = {
      tongSo: this.tongSoThanhVien,
      nam: 0,
      nu: 0,
      trungBinhTuoi: 0,
      soTheHe: this.tinhSoTheHe()
    };

    this.collectThongKe(this.root, thongKe);
    thongKe.trungBinhTuoi = Math.round(thongKe.trungBinhTuoi / thongKe.tongSo);

    console.log(`👥 Tổng số thành viên: ${thongKe.tongSo}`);
    console.log(`👨 Nam: ${thongKe.nam} (${Math.round(thongKe.nam/thongKe.tongSo*100)}%)`);
    console.log(`👩 Nữ: ${thongKe.nu} (${Math.round(thongKe.nu/thongKe.tongSo*100)}%)`);
    console.log(`📅 Tuổi trung bình: ${thongKe.trungBinhTuoi} tuổi`);
    console.log(`🏠 Số thế hệ: ${thongKe.soTheHe}`);

    return thongKe;
  }

  collectThongKe(nut, thongKe) {
    if (!nut) return;

    const nguoi = nut.value;
    if (nguoi.gioiTinh === 'Nam') {
      thongKe.nam++;
    } else {
      thongKe.nu++;
    }
    thongKe.trungBinhTuoi += nguoi.tuoi;

    this.collectThongKe(nut.left, thongKe);
    this.collectThongKe(nut.right, thongKe);
  }

  tinhSoTheHe() {
    return this.tinhChieuCao(this.root) + 1;
  }

  tinhChieuCao(nut) {
    if (!nut) return -1;
    return Math.max(this.tinhChieuCao(nut.left), this.tinhChieuCao(nut.right)) + 1;
  }
}

// Demo hệ thống gia phả
console.log('🌳 === DEMO HỆ THỐNG QUẢN LÝ GIA PHẢ ===');

// Tạo tổ tiên
const ongNoi = new ThanhVienGiaDinh('Nguyễn Văn Sơn', 1920, 'Nam', 'Nông dân');
const giaPhap = new HeThongGiaPhap(ongNoi);

// Thêm thế hệ 1
const cha = new ThanhVienGiaDinh('Nguyễn Văn Minh', 1950, 'Nam', 'Giáo viên');
const co = new ThanhVienGiaDinh('Nguyễn Thị Lan', 1955, 'Nữ', 'Y tá');

giaPhap.themCon('Nguyễn Văn Sơn', cha, true);
giaPhap.themCon('Nguyễn Văn Sơn', co, false);

// Thêm thế hệ 2 - con của cha
const toi = new ThanhVienGiaDinh('Nguyễn Văn An', 1980, 'Nam', 'Lập trình viên');
const em = new ThanhVienGiaDinh('Nguyễn Thị Hoa', 1985, 'Nữ', 'Kế toán');

giaPhap.themCon('Nguyễn Văn Minh', toi, true);
giaPhap.themCon('Nguyễn Văn Minh', em, false);

// Thêm thế hệ 2 - con của cô
const anhTrai = new ThanhVienGiaDinh('Nguyễn Văn Đức', 1978, 'Nam', 'Bác sĩ');
const chiBay = new ThanhVienGiaDinh('Nguyễn Thị Mai', 1982, 'Nữ', 'Luật sư');

giaPhap.themCon('Nguyễn Thị Lan', anhTrai, true);
giaPhap.themCon('Nguyễn Thị Lan', chiBay, false);

// Hiển thị gia phả
giaPhap.hienThiGiaPhap();

// Test các tính năng
console.log('\n🔍 === TEST TÌM KIẾM VÀ QUAN HỆ ===');

// Tìm quan hệ
console.log('Quan hệ An - Hoa:', giaPhap.timQuanHe('Nguyễn Văn An', 'Nguyễn Thị Hoa'));
console.log('Quan hệ An - Đức:', giaPhap.timQuanHe('Nguyễn Văn An', 'Nguyễn Văn Đức'));
console.log('Quan hệ An - Sơn:', giaPhap.timQuanHe('Nguyễn Văn An', 'Nguyễn Văn Sơn'));

// Đếm con cháu
console.log(`\nSố con cháu của ông Sơn: ${giaPhap.demConChau('Nguyễn Văn Sơn')} người`);
console.log(`Số con cháu của cha Minh: ${giaPhap.demConChau('Nguyễn Văn Minh')} người`);

// Lấy thành viên theo thế hệ
console.log('\n👥 Thế hệ 1:');
const theHe1 = giaPhap.layThanhVienTheoTheHe(1);
theHe1.forEach(nguoi => console.log(`  - ${nguoi.toString()}`));

console.log('\n👦 Thế hệ 2:');
const theHe2 = giaPhap.layThanhVienTheoTheHe(2);
theHe2.forEach(nguoi => console.log(`  - ${nguoi.toString()}`));

// Thống kê
giaPhap.thongKeGiaPhap();
```

## 🔑 Những điểm quan trọng cần lưu ý

### 1. **Hiểu rõ cấu trúc đệ quy**
- Tree là đệ quy: mỗi cây con là cây nhỏ.
- Hầu hết thuật toán dùng đệ quy.
- Tránh cây quá sâu để không lỗi bộ nhớ.

### 2. **Quản lý quan hệ cha-con đúng cách**
- Cập nhật parent khi thay đổi cây.
- Kiểm tra null trước khi dùng nút.
- Giữ quan hệ nhất quán.

### 3. **Chọn phương pháp duyệt phù hợp**
- In-Order: Lấy dữ liệu sắp xếp.
- Pre-Order: Sao chép cây.
- Post-Order: Xóa cây.
- Level-Order: Duyệt theo tầng.

### 4. **Tối ưu hóa hiệu suất**
- Tránh duyệt thừa.
- Dùng cache cho tính toán.
- Dùng vòng lặp thay đệ quy nếu cây lớn.
- Giới hạn độ sâu.

### 5. **Lỗi thường gặp**
- Quên cập nhật parent.
- Không kiểm tra null.
- Sai phương pháp duyệt.
- Không giải phóng bộ nhớ khi xóa.
- Tạo vòng lặp trong cây.

## 📝 Bài tập về nhà

### Bài tập 1: Hệ thống tổ chức sự kiện (Event Organizer)

**Yêu cầu**: Quản lý sự kiện phân cấp:
- Sự kiện chính chứa hoạt động con.
- Hoạt động có phiên riêng.
- Lập lịch không trùng.
- Tính thời gian và chi phí tổng.
- Tìm hoạt động theo chủ đề hoặc thời gian.

**Gợi ý kỹ thuật**:
- Dùng Tree cho cấu trúc.
- Nút chứa thời gian, địa điểm, chi phí.
- Kiểm tra xung đột thời gian.
- Tạo báo cáo thống kê.

### Bài tập 2: Trò chơi câu hỏi trắc nghiệm thông minh

**Yêu cầu**: Trò chơi câu hỏi phân nhánh:
- Câu hỏi khó dần.
- Sai dẫn dễ hơn, đúng dẫn khó hơn.
- Tính điểm theo độ khó và thời gian.
- Lưu tiến trình.
- Hiển thị cây quyết định.

**Gợi ý kỹ thuật**:
- Dùng Decision Tree cho phân nhánh.
- Tính điểm theo đường đi.
- Gợi ý thông minh.
- Hiển thị tiến trình cây.

---

*Post ID: mclqm56q3vtimxt*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
