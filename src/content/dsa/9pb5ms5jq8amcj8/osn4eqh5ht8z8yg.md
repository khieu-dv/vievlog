---
title: "Cây Fenwick (Fenwick Tree / Binary Indexed Tree)"
postId: "osn4eqh5ht8z8yg"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Cây Fenwick (Fenwick Tree / Binary Indexed Tree)




## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Fenwick Tree** là gì và cách nó hoạt động.
- Biết cách tính **tổng prefix** và **cập nhật giá trị** nhanh chóng.
- Hiểu vai trò của **LSB (Least Significant Bit)**.
- Áp dụng Fenwick Tree vào bài toán thực tế như thống kê tần suất, lượng mưa.
- So sánh Fenwick Tree với các cấu trúc dữ liệu khác.

## 📚 Khái Niệm Cơ Bản

### Fenwick Tree Là Gì?

**Fenwick Tree** (hay **Binary Indexed Tree - BIT**) là một cấu trúc dữ liệu giúp:
- Tính **tổng prefix** (tổng từ đầu đến vị trí i) nhanh chóng.
- Cập nhật giá trị tại một vị trí cụ thể.

Nó giống như một máy tính bỏ túi, giúp bạn cộng dồn và cập nhật số liệu hiệu quả.

![Binary Indexed Tree](https://www.geeksforgeeks.org/wp-content/uploads/BITSum.png)

![Fenwick Tree Animation](https://upload.wikimedia.org/wikipedia/commons/d/dc/BITDemo.gif)

### Nguyên Lý Hoạt Động

Fenwick Tree sử dụng **LSB (Least Significant Bit)** để quản lý dữ liệu:
- **LSB(i)**: Bit 1 cuối cùng trong biểu diễn nhị phân của i.
- Mỗi vị trí i trong cây chịu trách nhiệm cho một số phần tử dựa trên LSB(i).

**Ví dụ**:
```
Số 12 = 1100₂
LSB(12) = 12 & (-12) = 4
→ Vị trí 12 quản lý 4 phần tử: [9, 10, 11, 12]
```

**Cấu trúc dữ liệu**:
```
Mảng gốc:    [1, 2, 3, 4, 5, 6, 7, 8]
Chỉ số:       1  2  3  4  5  6  7  8
Fenwick Tree: [_, 1, 3, 3, 10, 5, 11, 7, 36]
Quản lý:      -  [1] [1-2] [3] [1-4] [5] [5-6] [7] [1-8]
```

### Tính Chất Quan Trọng
1. **Hiệu quả**: Tính tổng và cập nhật trong O(log n).
2. **Tiết kiệm bộ nhớ**: Chỉ cần mảng n+1 phần tử.
3. **Dùng 1-indexed**: Bắt đầu từ chỉ số 1 để dễ tính toán bit.
4. **Phép toán**: Phải có tính chất giao hoán (commutative) và kết hợp (associative).

## 📝 Cài Đặt Chi Tiết

### Phân Tích Độ Phức Tạp

| Thao tác        | Thời gian | Không gian |
|-----------------|-----------|------------|
| Khởi tạo        | O(n log n)| O(n)       |
| Cập nhật điểm   | O(log n)  | O(1)       |
| Tính tổng prefix| O(log n)  | O(1)       |
| Tính tổng range | O(log n)  | O(1)       |

### Cài Đặt FenwickTree

```javascript
class FenwickTree {
  constructor(size) {
    this.size = size;
    this.tree = Array(size + 1).fill(0); // 1-indexed
  }

  // Cộng thêm value vào vị trí pos
  increase(pos, value) {
    for (let i = pos; i <= this.size; i += i & -i) {
      this.tree[i] += value;
    }
  }

  // Tính tổng từ 1 đến pos
  query(pos) {
    let sum = 0;
    for (let i = pos; i > 0; i -= i & -i) {
      sum += this.tree[i];
    }
    return sum;
  }

  // Tính tổng từ left đến right
  queryRange(left, right) {
    return this.query(right) - this.query(left - 1);
  }

  // Cập nhật giá trị tại pos thành newValue
  update(pos, newValue) {
    const current = this.queryRange(pos, pos);
    this.increase(pos, newValue - current);
  }

  // Khởi tạo từ mảng
  static fromArray(array) {
    const tree = new FenwickTree(array.length);
    for (let i = 0; i < array.length; i++) {
      tree.increase(i + 1, array[i]);
    }
    return tree;
  }
}
```

### Minh Họa Thuật Toán

**Cập nhật (increase)**:
```
Cập nhật pos = 5, value = +3
- i = 5 (101₂), LSB = 1 → tree[5] += 3
- i = 6 (110₂), LSB = 2 → tree[6] += 3
- i = 8 (1000₂), LSB = 8 → tree[8] += 3
```

**Truy vấn (query)**:
```
Tính tổng đến pos = 7
- i = 7 (111₂), LSB = 1 → sum += tree[7]
- i = 6 (110₂), LSB = 2 → sum += tree[6]
- i = 4 (100₂), LSB = 4 → sum += tree[4]
```

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Quản Lý Tần Suất Từ Khóa

**Đề bài**: Xây dựng hệ thống theo dõi tần suất từ khóa:
- Thêm từ khóa và số lần xuất hiện.
- Tính tổng tần suất trong khoảng từ i đến j.
- Tìm vị trí đầu tiên có tổng tần suất đạt ngưỡng.
- Hiển thị top 3 từ khóa phổ biến.

```javascript
class KeywordTracker {
  constructor(size) {
    this.size = size;
    this.tree = new FenwickTree(size);
    this.keywords = Array(size + 1).fill('');
  }

  addKeyword(pos, keyword, freq = 1) {
    this.keywords[pos] = keyword;
    this.tree.increase(pos, freq);
    console.log(`➕ Thêm "${keyword}" tại vị trí ${pos}: ${freq} lần`);
  }

  increaseFreq(pos, freq) {
    this.tree.increase(pos, freq);
    console.log(`📈 "${this.keywords[pos]}" +${freq} → tổng ${this.tree.queryRange(pos, pos)}`);
  }

  getTotalFreq(start, end) {
    const total = this.tree.queryRange(start, end);
    console.log(`📊 Tổng tần suất từ ${start} đến ${end}: ${total}`);
    return total;
  }

  findFirstThreshold(threshold) {
    for (let i = 1; i <= this.size; i++) {
      if (this.tree.query(i) >= threshold) {
        console.log(`🎯 Đạt ngưỡng ${threshold} tại vị trí ${i}`);
        return i;
      }
    }
    console.log(`❌ Không đạt ngưỡng ${threshold}`);
    return -1;
  }

  getTopKeywords(limit = 3) {
    const list = [];
    for (let i = 1; i <= this.size; i++) {
      const freq = this.tree.queryRange(i, i);
      if (freq > 0) list.push({ keyword: this.keywords[i], freq, pos: i });
    }
    list.sort((a, b) => b.freq - a.freq);
    console.log(`\n🏆 Top ${limit} từ khóa:`);
    list.slice(0, limit).forEach((item, i) => {
      console.log(`${i + 1}. "${item.keyword}" (vị trí ${item.pos}): ${item.freq} lần`);
    });
  }
}

// Demo
const tracker = new KeywordTracker(5);
tracker.addKeyword(1, 'JavaScript', 5);
tracker.addKeyword(2, 'Python', 3);
tracker.addKeyword(3, 'Java', 2);
tracker.increaseFreq(1, 2);
tracker.getTotalFreq(1, 3);
tracker.findFirstThreshold(7);
tracker.getTopKeywords();
```

**Giải thích**:
- **KeywordTracker**: Dùng Fenwick Tree để theo dõi tần suất.
- **Tính tổng**: Dùng queryRange để tính tổng trong khoảng.
- **Top từ khóa**: Lấy tần suất từng vị trí và sắp xếp.

### Bài Tập 2: Theo Dõi Lượng Mưa

**Đề bài**: Xây dựng hệ thống giám sát lượng mưa tại 10 trạm:
- Cập nhật lượng mưa tại trạm i.
- Tính tổng lượng mưa từ trạm i đến j.
- Tìm trạm đầu tiên có tổng lượng mưa đạt ngưỡng.
- Báo cáo lượng mưa theo khu vực.

```javascript
class RainfallMonitor {
  constructor(numStations) {
    this.numStations = numStations;
    this.tree = new FenwickTree(numStations);
    this.stations = Array(numStations + 1).fill(null).map((_, i) => i === 0 ? null : {
      id: i,
      name: `Trạm ${i}`,
      area: `Khu vực ${Math.ceil(i / 3)}`,
      rainfall: 0
    });
  }

  updateRainfall(id, amount) {
    const station = this.stations[id];
    const diff = amount - station.rainfall;
    this.tree.increase(id, diff);
    station.rainfall = amount;
    console.log(`🌧️ ${station.name}: ${amount}mm`);
  }

  getTotalRainfall(start, end) {
    const total = this.tree.queryRange(start, end);
    console.log(`☔ Tổng lượng mưa từ trạm ${start} đến ${end}: ${total}mm`);
    return total;
  }

  findThresholdStation(threshold) {
    for (let i = 1; i <= this.numStations; i++) {
      if (this.tree.query(i) >= threshold) {
        console.log(`⚠️ Trạm ${i} đạt ngưỡng ${threshold}mm`);
        return i;
      }
    }
    console.log(`✅ Chưa đạt ngưỡng ${threshold}mm`);
    return -1;
  }

  reportByArea() {
    const areas = {};
    for (let i = 1; i <= this.numStations; i++) {
      const station = this.stations[i];
      const area = station.area;
      if (!areas[area]) {
        areas[area] = { total: 0, count: 0 };
      }
      areas[area].total += station.rainfall;
      areas[area].count++;
    }
    console.log('\n📊 Báo cáo theo khu vực:');
    for (const [area, data] of Object.entries(areas)) {
      console.log(`${area}: ${data.total}mm (trung bình ${data.total / data.count}mm/trạm)`);
    }
  }
}

// Demo
const monitor = new RainfallMonitor(10);
for (let i = 1; i <= 10; i++) {
  monitor.updateRainfall(i, Math.round(Math.random() * 50));
}
monitor.getTotalRainfall(1, 5);
monitor.findThresholdStation(100);
monitor.reportByArea();
```

**Giải thích**:
- **RainfallMonitor**: Dùng Fenwick Tree để theo dõi lượng mưa.
- **Báo cáo khu vực**: Nhóm trạm theo khu vực để tính tổng và trung bình.
- **Ngưỡng**: Duyệt tuần tự để tìm trạm đạt ngưỡng.

## 🔑 Những Điểm Quan Trọng

### Khái Niệm Cốt Lõi
1. **LSB (i & -i)**: Quyết định phạm vi trách nhiệm của mỗi vị trí.
2. **Hiệu quả**: O(log n) cho cả cập nhật và truy vấn.
3. **1-indexed**: Luôn bắt đầu từ chỉ số 1.

### Ưu Điểm
- **Nhanh**: Cập nhật và truy vấn trong O(log n).
- **Tiết kiệm bộ nhớ**: Chỉ cần mảng n+1 phần tử.
- **Đơn giản**: Dễ cài đặt hơn Segment Tree.

### Lỗi Thường Gặp
1. **Sai index**:
   ```javascript
   // Sai
   tree.increase(0, 5); // Lỗi vì index bắt đầu từ 1
   // Đúng
   tree.increase(1, 5);
   ```
2. **Quên kiểm tra biên**:
   ```javascript
   // Sai
   tree.query(10); // Có thể vượt kích thước
   // Đúng
   if (pos <= tree.size) tree.query(pos);
   ```
3. **Nhầm update/increase**:
   - `increase`: Cộng thêm giá trị.
   - `update`: Thay thế giá trị.

### So Sánh Với Cấu Trúc Khác
| Đặc điểm         | Fenwick Tree | Segment Tree | Prefix Sum | Array |
|------------------|--------------|--------------|------------|-------|
| Tính tổng prefix | O(log n)     | O(log n)     | O(1)       | O(n)  |
| Cập nhật điểm    | O(log n)     | O(log n)     | O(n)       | O(1)  |
| Bộ nhớ           | O(n)         | O(4n)        | O(n)       | O(n)  |

**Khi dùng Fenwick Tree**:
- Tốt cho tổng prefix và cập nhật điểm.
- Không phù hợp với min/max hoặc cập nhật khoảng.

### Ứng Dụng Thực Tế
1. **SEO**: Theo dõi tần suất từ khóa.
2. **Khí tượng**: Giám sát lượng mưa, nhiệt độ.
3. **Game**: Cập nhật điểm số người chơi.
4. **Tài chính**: Theo dõi tổng giao dịch.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Điểm Danh Học Viên
Xây dựng hệ thống điểm danh:
- Ghi nhận số buổi học viên tham gia.
- Tính tổng số buổi từ học viên i đến j.
- Tìm học viên đầu tiên đạt 10 buổi.
- Hiển thị top 3 học viên chăm chỉ.

**Gợi ý**: Dùng Fenwick Tree để lưu số buổi, duyệt để tìm top.

### Bài Tập 2: Theo Dõi Tiêu Thụ Điện
Xây dựng hệ thống giám sát điện năng:
- Cập nhật lượng điện tiêu thụ tại khu vực i.
- Tính tổng điện từ khu vực i đến j.
- Tìm khu vực đầu tiên vượt ngưỡng 1000 kWh.
- Báo cáo tiêu thụ theo quận.

**Gợi ý**: Dùng Fenwick Tree cho tổng prefix, nhóm khu vực để báo cáo.



---

*Post ID: osn4eqh5ht8z8yg*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
