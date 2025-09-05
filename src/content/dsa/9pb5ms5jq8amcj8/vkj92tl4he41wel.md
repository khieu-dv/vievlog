---
title: "Segment Tree (Cây Phân Đoạn)"
postId: "vkj92tl4he41wel"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Segment Tree (Cây Phân Đoạn)



## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Cây Phân Đoạn** là gì và cách nó hoạt động.
- Biết cách tính **tổng**, **min**, **max** trong một khoảng nhanh chóng.
- Cài đặt Cây Phân Đoạn để xử lý truy vấn và cập nhật.
- Áp dụng vào bài toán thực tế như quản lý điểm số hoặc chất lượng không khí.
- So sánh Cây Phân Đoạn với các cấu trúc dữ liệu khác.

## 📚 Khái Niệm Cơ Bản

### Cây Phân Đoạn Là Gì?

**Cây Phân Đoạn** là một cây nhị phân giúp xử lý nhanh các **truy vấn khoảng** (ví dụ: tổng, min, max trong một đoạn của mảng). Nó giống như một bảng tính thông minh, lưu kết quả của các đoạn để truy vấn nhanh.

![Min Segment Tree](https://www.geeksforgeeks.org/wp-content/uploads/RangeMinimumQuery.png)

![Sum Segment Tree](https://www.geeksforgeeks.org/wp-content/uploads/segment-tree1.png)

### Nguyên Lý Hoạt Động

Cây Phân Đoạn chia mảng thành các đoạn nhỏ:
- Mỗi node trong cây quản lý một khoảng [left, right].
- Node cha kết hợp thông tin từ hai node con (ví dụ: tổng = tổng con trái + tổng con phải).
- Dùng phương pháp **chia để trị** để tính toán nhanh.

**Ví dụ**:
```
Mảng gốc: [1, 3, 5, 7, 9, 11]
Cây Phân Đoạn (Tổng):
         36 [0-5]
       /          \
   9 [0-2]      27 [3-5]
  /    \        /    \
4 [0-1] 5 [2] 16 [3-4] 11 [5]
 /   \
1 [0] 3 [1]
```

### Tính Chất Quan Trọng
1. **Phép toán kết hợp**: Phải có tính chất như `sum(a, b, c) = sum(sum(a, b), c)`.
2. **Hiệu quả**: Truy vấn và cập nhật trong O(log n).
3. **Bộ nhớ**: Cần khoảng 4n node cho mảng n phần tử.

## 📝 Cài Đặt Chi Tiết

### Phân Tích Độ Phức Tạp

| Thao tác         | Thời gian | Không gian |
|------------------|-----------|------------|
| Khởi tạo         | O(n)      | O(4n)      |
| Truy vấn khoảng  | O(log n)  | O(log n)   |
| Cập nhật điểm    | O(log n)  | O(log n)   |

### Cài Đặt Cây Phân Đoạn

```javascript
class SegmentTree {
  constructor(array, operation, fallback) {
    this.array = array;
    this.operation = operation; // Hàm kết hợp (sum, min, max)
    this.fallback = fallback; // Giá trị mặc định (0 cho sum, Infinity cho min)
    this.tree = this.initTree(array.length);
    this.buildTree(0, array.length - 1, 0);
  }

  initTree(n) {
    const size = 4 * n; // Tối đa 4n node
    return new Array(size).fill(null);
  }

  buildTree(left, right, pos) {
    if (left === right) {
      this.tree[pos] = this.array[left];
      return;
    }
    const mid = Math.floor((left + right) / 2);
    const leftChild = 2 * pos + 1;
    const rightChild = 2 * pos + 2;
    this.buildTree(left, mid, leftChild);
    this.buildTree(mid + 1, right, rightChild);
    this.tree[pos] = this.operation(this.tree[leftChild], this.tree[rightChild]);
  }

  rangeQuery(queryLeft, queryRight) {
    return this.queryRecursive(queryLeft, queryRight, 0, this.array.length - 1, 0);
  }

  queryRecursive(queryLeft, queryRight, left, right, pos) {
    if (queryLeft <= left && queryRight >= right) return this.tree[pos];
    if (queryLeft > right || queryRight < left) return this.fallback;
    const mid = Math.floor((left + right) / 2);
    const leftResult = this.queryRecursive(queryLeft, queryRight, left, mid, 2 * pos + 1);
    const rightResult = this.queryRecursive(queryLeft, queryRight, mid + 1, right, 2 * pos + 2);
    return this.operation(leftResult, rightResult);
  }

  update(index, value) {
    this.array[index] = value;
    this.updateRecursive(0, this.array.length - 1, 0, index, value);
  }

  updateRecursive(left, right, pos, index, value) {
    if (left === right) {
      this.tree[pos] = value;
      return;
    }
    const mid = Math.floor((left + right) / 2);
    if (index <= mid) {
      this.updateRecursive(left, mid, 2 * pos + 1, index, value);
    } else {
      this.updateRecursive(mid + 1, right, 2 * pos + 2, index, value);
    }
    this.tree[pos] = this.operation(this.tree[2 * pos + 1], this.tree[2 * pos + 2]);
  }
}

const Operations = {
  sum: { operation: (a, b) => a + b, fallback: 0 },
  min: { operation: (a, b) => Math.min(a, b), fallback: Infinity },
  max: { operation: (a, b) => Math.max(a, b), fallback: -Infinity }
};
```

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Quản Lý Điểm Số Lớp Học

**Đề bài**: Xây dựng hệ thống quản lý điểm số học sinh:
- Tính tổng điểm của một nhóm học sinh.
- Tìm điểm cao nhất/thấp nhất trong nhóm.
- Cập nhật điểm của một học sinh.
- Tính điểm trung bình nhóm.

```javascript
class GradeManager {
  constructor(grades) {
    this.grades = [...grades];
    this.sumTree = new SegmentTree(grades, Operations.sum.operation, Operations.sum.fallback);
    this.minTree = new SegmentTree(grades, Operations.min.operation, Operations.min.fallback);
    this.maxTree = new SegmentTree(grades, Operations.max.operation, Operations.max.fallback);
  }

  getTotal(left, right) {
    const total = this.sumTree.rangeQuery(left, right);
    console.log(`📊 Tổng điểm từ HS ${left + 1} đến ${right + 1}: ${total}`);
    return total;
  }

  getAverage(left, right) {
    const total = this.getTotal(left, right);
    const count = right - left + 1;
    const avg = (total / count).toFixed(2);
    console.log(`📈 Điểm TB từ HS ${left + 1} đến ${right + 1}: ${avg}`);
    return avg;
  }

  getExtremes(left, right) {
    const min = this.minTree.rangeQuery(left, right);
    const max = this.maxTree.rangeQuery(left, right);
    console.log(`🔍 Điểm thấp nhất: ${min}, cao nhất: ${max}`);
    return { min, max };
  }

  updateGrade(index, newGrade) {
    this.grades[index] = newGrade;
    this.sumTree.update(index, newGrade);
    this.minTree.update(index, newGrade);
    this.maxTree.update(index, newGrade);
    console.log(`✏️ Cập nhật điểm HS ${index + 1}: ${newGrade}`);
  }
}

// Demo
const grades = [8.5, 7.2, 9.0, 6.8, 8.8];
const manager = new GradeManager(grades);
manager.getTotal(0, 4);
manager.getAverage(0, 4);
manager.getExtremes(0, 4);
manager.updateGrade(3, 9.5);
manager.getAverage(0, 4);
```

**Giải thích**:
- **GradeManager**: Dùng ba cây phân đoạn để tính tổng, min, max.
- **Truy vấn**: O(log n) cho tổng, trung bình, cực trị.
- **Cập nhật**: O(log n) để đồng bộ tất cả cây.

### Bài Tập 2: Giám Sát Chất Lượng Không Khí

**Đề bài**: Xây dựng hệ thống giám sát chỉ số AQI:
- Tính AQI trung bình trong khoảng giờ.
- Tìm giờ có AQI tốt nhất/tệ nhất.
- Đếm số giờ AQI xấu (>100).
- Cập nhật AQI thời gian thực.

```javascript
class AirQualityMonitor {
  constructor(aqiData) {
    this.aqiData = [...aqiData];
    this.sumTree = new SegmentTree(aqiData, Operations.sum.operation, Operations.sum.fallback);
    this.minTree = new SegmentTree(aqiData, Operations.min.operation, Operations.min.fallback);
    this.maxTree = new SegmentTree(aqiData, Operations.max.operation, Operations.max.fallback);
  }

  getAverageAQI(start, end) {
    const total = this.sumTree.rangeQuery(start, end);
    const hours = end - start + 1;
    const avg = Math.round(total / hours);
    console.log(`🌬️ AQI TB từ ${start}h đến ${end}h: ${avg}`);
    return avg;
  }

  getExtremeAQI(start, end) {
    const minAQI = this.minTree.rangeQuery(start, end);
    const maxAQI = this.maxTree.rangeQuery(start, end);
    let bestHour = -1, worstHour = -1;
    for (let i = start; i <= end; i++) {
      if (this.aqiData[i] === minAQI && bestHour === -1) bestHour = i;
      if (this.aqiData[i] === maxAQI && worstHour === -1) worstHour = i;
    }
    console.log(`✅ Giờ tốt nhất: ${bestHour}h (AQI: ${minAQI})`);
    console.log(`❌ Giờ tệ nhất: ${worstHour}h (AQI: ${maxAQI})`);
    return { best: { hour: bestHour, aqi: minAQI }, worst: { hour: worstHour, aqi: maxAQI } };
  }

  countBadHours(start, end, threshold = 100) {
    let count = 0;
    for (let i = start; i <= end; i++) {
      if (this.aqiData[i] > threshold) count++;
    }
    console.log(`⚠️ Số giờ AQI > ${threshold}: ${count}`);
    return count;
  }

  updateAQI(hour, newAQI) {
    this.aqiData[hour] = newAQI;
    this.sumTree.update(hour, newAQI);
    this.minTree.update(hour, newAQI);
    this.maxTree.update(hour, newAQI);
    console.log(`🔄 Cập nhật ${hour}h: AQI ${newAQI}`);
  }

  report(start, end) {
    console.log(`\n📊 Báo cáo AQI (${start}h - ${end}h)`);
    this.getAverageAQI(start, end);
    this.getExtremeAQI(start, end);
    this.countBadHours(start, end);
  }
}

// Demo
const aqiData = [45, 52, 48, 43, 38, 42, 68, 89, 156, 134];
const monitor = new AirQualityMonitor(aqiData);
monitor.report(0, 9);
monitor.updateAQI(8, 180);
monitor.report(0, 9);
```

**Giải thích**:
- **AirQualityMonitor**: Dùng ba cây phân đoạn để xử lý AQI.
- **Báo cáo**: Tóm tắt AQI trung bình, cực trị, và số giờ xấu.
- **Cập nhật**: Đồng bộ dữ liệu mới trong O(log n).

## 🔑 Những Điểm Quan Trọng

### Khái Niệm Cốt Lõi
1. **Chia để trị**: Chia mảng thành các đoạn nhỏ để xử lý.
2. **Hiệu quả**: O(log n) cho truy vấn và cập nhật.
3. **Phép toán kết hợp**: Chỉ hỗ trợ các phép như cộng, min, max.

### Lỗi Thường Gặp
1. **Sai kích thước cây**:
   ```javascript
   // Sai
   tree = new Array(n).fill(null); // Thiếu bộ nhớ
   // Đúng
   tree = new Array(4 * n).fill(null);
   ```
2. **Quên giá trị mặc định**:
   ```javascript
   // Sai
   minTree = new SegmentTree(array, Math.min, 0); // 0 không phù hợp
   // Đúng
   minTree = new SegmentTree(array, Math.min, Infinity);
   ```
3. **Sai chỉ số**:
   - Kiểm tra kỹ queryLeft, queryRight trong rangeQuery.

### So Sánh Với Cấu Trúc Khác
| Thao tác         | Cây Phân Đoạn | Mảng Thường | Prefix Sum |
|------------------|---------------|-------------|------------|
| Truy vấn khoảng  | O(log n)      | O(n)        | O(1)*      |
| Cập nhật điểm    | O(log n)      | O(1)        | O(n)       |
| Bộ nhớ           | O(4n)         | O(n)        | O(n)       |

*Chỉ cho tổng.

### Ứng Dụng Thực Tế
1. **Giáo dục**: Quản lý điểm số, xếp hạng học sinh.
2. **Môi trường**: Giám sát AQI, nhiệt độ, độ ẩm.
3. **Tài chính**: Tính tổng giao dịch, tìm giá trị cực đại.
4. **Game**: Xử lý va chạm, tối ưu hiển thị.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Quản Lý Nhiệt Độ Nhà Kính
Xây dựng hệ thống giám sát nhiệt độ:
- Tính nhiệt độ trung bình của một nhóm cảm biến.
- Tìm cảm biến nóng nhất/lạnh nhất.
- Cập nhật nhiệt độ khi có dữ liệu mới.
- Đếm số cảm biến vượt ngưỡng 35°C.

**Gợi ý**: Dùng Cây Phân Đoạn cho tổng, min, max.

### Bài Tập 2: Phân Tích Hiệu Suất Website
Xây dựng công cụ phân tích thời gian tải trang:
- Tính thời gian trung bình trong khoảng thời gian.
- Tìm thời điểm tải chậm nhất/nhanh nhất.
- Cập nhật dữ liệu thời gian thực.
- Báo cáo theo khung giờ (0-6h, 6-12h, v.v.).

**Gợi ý**: Dùng Cây Phân Đoạn, thêm kiểm tra dữ liệu hợp lệ.



---

*Post ID: vkj92tl4he41wel*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
