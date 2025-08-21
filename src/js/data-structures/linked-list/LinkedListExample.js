// =====================
// Comparator giúp so sánh giá trị
// =====================
class Comparator {
  constructor(compareFunction) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }

  static defaultCompareFunction(a, b) {
    if (a === b) return 0;
    return a < b ? -1 : 1;
  }

  equal(a, b) {
    return this.compare(a, b) === 0;
  }

  lessThan(a, b) {
    return this.compare(a, b) < 0;
  }

  greaterThan(a, b) {
    return this.compare(a, b) > 0;
  }
}

// =====================
// Node (Nút) của danh sách
// =====================
class LinkedListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }

  toString(callback) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}

// =====================
// LinkedList (Danh sách liên kết)
// =====================
class LinkedList {
  constructor(comparatorFunction) {
    this.head = null;
    this.tail = null;
    this.compare = new Comparator(comparatorFunction);
  }

  prepend(value) {
    const newNode = new LinkedListNode(value, this.head);
    this.head = newNode;
    if (!this.tail) this.tail = newNode;
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

  insert(value, rawIndex) {
    const index = rawIndex < 0 ? 0 : rawIndex;
    if (index === 0) return this.prepend(value);

    let count = 1;
    let currentNode = this.head;
    const newNode = new LinkedListNode(value);

    while (currentNode) {
      if (count === index) break;
      currentNode = currentNode.next;
      count += 1;
    }

    if (currentNode) {
      newNode.next = currentNode.next;
      currentNode.next = newNode;
      if (!newNode.next) this.tail = newNode; // Cập nhật tail nếu cần
    } else {
      if (this.tail) {
        this.tail.next = newNode;
        this.tail = newNode;
      } else {
        this.head = newNode;
        this.tail = newNode;
      }
    }
    return this;
  }

  delete(value) {
    if (!this.head) return null;

    let deletedNode = null;
    while (this.head && this.compare.equal(this.head.value, value)) {
      deletedNode = this.head;
      this.head = this.head.next;
    }

    let currentNode = this.head;
    if (currentNode !== null) {
      while (currentNode.next) {
        if (this.compare.equal(currentNode.next.value, value)) {
          deletedNode = currentNode.next;
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    if (this.tail && this.compare.equal(this.tail.value, value)) {
      this.tail = currentNode;
    }

    return deletedNode;
  }

  find({ value = undefined, callback = undefined }) {
    if (!this.head) return null;
    let currentNode = this.head;
    while (currentNode) {
      if (callback && callback(currentNode.value)) return currentNode;
      if (value !== undefined && this.compare.equal(currentNode.value, value)) return currentNode;
      currentNode = currentNode.next;
    }
    return null;
  }

  deleteTail() {
    const deletedTail = this.tail;
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      return deletedTail;
    }

    let currentNode = this.head;
    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = null;
      } else {
        currentNode = currentNode.next;
      }
    }
    this.tail = currentNode;
    return deletedTail;
  }

  deleteHead() {
    if (!this.head) return null;
    const deletedHead = this.head;
    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }
    return deletedHead;
  }

  fromArray(values) {
    values.forEach(value => this.append(value));
    return this;
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

  toString(callback) {
    return this.toArray().map(node => node.toString(callback)).toString();
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

// =====================
// Ví dụ sử dụng
// =====================

// Ví dụ 1: Danh sách số
const danhSach = new LinkedList();
danhSach.append(1).append(2).append(3);
danhSach.prepend(0);
danhSach.insert(1.5, 2);
console.log("Danh sách số:", danhSach.toString());

const timThay = danhSach.find({ value: 2 });
console.log("Tìm thấy:", timThay.value);

const soChan = danhSach.find({ callback: n => n % 2 === 0 });
console.log("Số chẵn đầu tiên:", soChan.value);

danhSach.delete(1.5);
danhSach.deleteHead();
danhSach.deleteTail();
console.log("Danh sách sau khi xóa:", danhSach.toString());

danhSach.reverse();
console.log("Danh sách đảo ngược:", danhSach.toString());

// Ví dụ 2: Danh sách học sinh
const danhSachHocSinh = new LinkedList();
danhSachHocSinh.append({ ten: 'Nguyễn Văn An', tuoi: 20, diemTB: 8.5 });
danhSachHocSinh.append({ ten: 'Trần Thị Bình', tuoi: 19, diemTB: 9.0 });
danhSachHocSinh.append({ ten: 'Lê Văn Cường', tuoi: 21, diemTB: 7.5 });

const timAn = danhSachHocSinh.find({ callback: hs => hs.ten === 'Nguyễn Văn An' });
console.log('Tìm thấy học sinh:', timAn.value);

const hocSinhGioi = danhSachHocSinh.find({ callback: hs => hs.diemTB >= 9.0 });
console.log('Học sinh giỏi:', hocSinhGioi.value.ten);

console.log('Danh sách hs trong lớp:');
console.log(danhSachHocSinh.toString(hs => `${hs.ten} (${hs.tuoi} tuổi, ĐTB: ${hs.diemTB})`));

// Ví dụ 3: Tạo từ mảng
const cacDiemSo = [7, 8, 6, 9, 10, 5];
const danhSachDiem = new LinkedList().fromArray(cacDiemSo);
console.log('Danh sách điểm:', danhSachDiem.toString());

danhSachDiem.reverse();
console.log('Danh sách điểm đảo ngược:', danhSachDiem.toString());

const mangDiem = danhSachDiem.toArray().map(nut => nut.value);
console.log('Mảng điểm:', mangDiem);
