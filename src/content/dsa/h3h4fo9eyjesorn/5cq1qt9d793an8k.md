---
title: "Thuật toán tìm kiếm nhảy (Jump Search)"
postId: "5cq1qt9d793an8k"
category: "Searches Algorithms"
created: "22/8/2025"
updated: "29/8/2025"
---

# Thuật toán tìm kiếm nhảy (Jump Search)


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có khả năng:

- **Hiểu rõ bản chất** của thuật toán Jump Search và cách kết hợp giữa nhảy và tìm kiếm tuyến tính
- **Tính toán kích thước nhảy tối ưu** và hiểu được lý do tại sao √n là kích thước tối ưu
- **Triển khai thành thạo** thuật toán bằng JavaScript trong các trường hợp khác nhau
- **So sánh và đánh giá** hiệu suất của Jump Search với các thuật toán tìm kiếm khác
- **Áp dụng linh hoạt** thuật toán vào các bài toán thực tế với dữ liệu đã sắp xếp

## 📝 Nội dung chi tiết

### Khái niệm cơ bản

**Thuật toán tìm kiếm nhảy (Jump Search)** là một thuật toán tìm kiếm được thiết kế cho mảng đã sắp xếp. Thuật toán này hoạt động theo nguyên lý "nhảy và tìm kiếm" - thay vì kiểm tra từng phần tử một cách tuần tự, nó nhảy qua một số phần tử với bước nhảy cố định, sau đó thực hiện tìm kiếm tuyến tính trong khoảng được xác định.

**Tại sao gọi là "nhảy"?** Vì thuật toán không kiểm tra tất cả các phần tử mà chỉ "nhảy" đến những vị trí cách đều nhau để tìm ra khoảng chứa phần tử cần tìm.

### Nguyên lý hoạt động

Jump Search kết hợp hai giai đoạn riêng biệt:

#### **Giai đoạn 1: Nhảy để tìm khoảng (Jumping Phase)**
1. **Tính kích thước nhảy**: Xác định độ dài bước nhảy m (thường là √n)
2. **Nhảy qua các khối**: Kiểm tra các vị trí 0, m, 2m, 3m, ... cho đến khi tìm được khoảng chứa phần tử
3. **Xác định biên**: Dừng lại khi arr[k×m] ≤ target < arr[(k+1)×m]

#### **Giai đoạn 2: Tìm kiếm tuyến tính (Linear Search Phase)**
1. **Tìm kiếm tuần tự**: Trong khoảng [k×m, (k+1)×m-1], thực hiện linear search
2. **So sánh từng phần tử**: Kiểm tra từng phần tử trong khoảng cho đến khi tìm thấy
3. **Trả về kết quả**: Vị trí của phần tử hoặc -1 nếu không tìm thấy

### Tính toán kích thước nhảy tối ưu

**Câu hỏi quan trọng**: Kích thước bước nhảy nào là tối ưu nhất?

**Phân tích toán học:**
- Trong trường hợp xấu nhất, cần thực hiện `n/m` lần nhảy  
- Sau đó cần thực hiện `m-1` phép so sánh trong linear search
- Tổng số phép so sánh: `(n/m) + (m-1)`

Để tìm giá trị m tối ưu, ta cần tìm minimum của hàm số f(m) = n/m + m - 1:
```
f'(m) = -n/m² + 1 = 0
=> m² = n
=> m = √n
```

**Kết luận**: Kích thước bước nhảy tối ưu là **√n**, cho độ phức tạp thời gian O(√n).

### Đặc điểm then chốt

**Ưu điểm:**
- **Hiệu quả với dữ liệu lớn**: O(√n) tốt hơn Linear Search O(n)
- **Đơn giản hơn Binary Search**: Dễ hiểu và triển khai
- **Tiết kiệm bộ nhớ**: Chỉ cần O(1) không gian bổ sung
- **Thích hợp sequential access**: Hiệu quả khi không thể truy cập ngẫu nhiên
- **Tính ổn định**: Luôn tìm thấy phần tử xuất hiện đầu tiên

**Nhược điểm:**
- **Yêu cầu dữ liệu sắp xếp**: Chỉ hoạt động với mảng đã được sắp xếp
- **Chậm hơn Binary Search**: O(√n) vs O(log n)
- **Không linh hoạt**: Kích thước nhảy cố định không thích ứng với dữ liệu
- **Không hiệu quả với mảng nhỏ**: Linear Search có thể nhanh hơn

### Cài đặt thuật toán

#### Cài đặt cơ bản (dễ hiểu nhất)

Đây là cách triển khai đơn giản và dễ hiểu nhất của thuật toán Jump Search:

```javascript
function jumpSearch(arr, target) {
  const n = arr.length;
  if (n === 0) return -1;
  
  // Tính kích thước bước nhảy tối ưu
  const jumpSize = Math.floor(Math.sqrt(n));
  let start = 0;
  
  // Giai đoạn 1: Nhảy để tìm khoảng chứa target
  while (start < n && arr[Math.min(start + jumpSize - 1, n - 1)] < target) {
    start += jumpSize; // Nhảy đến khối tiếp theo
  }
  
  // Giai đoạn 2: Tìm kiếm tuyến tính trong khối
  for (let i = start; i < Math.min(start + jumpSize, n); i++) {
    if (arr[i] === target) {
      return i; // Tìm thấy, trả về vị trí
    }
    if (arr[i] > target) {
      break; // Dừng sớm nếu phần tử lớn hơn target
    }
  }
  
  return -1; // Không tìm thấy
}
```

#### Cài đặt với thông tin chi tiết

Phiên bản này cung cấp thêm thông tin về quá trình tìm kiếm:

```javascript
function jumpSearchDetailed(arr, target) {
  const n = arr.length;
  if (n === 0) {
    return { found: false, index: -1, jumps: 0, comparisons: 0 };
  }
  
  const jumpSize = Math.floor(Math.sqrt(n));
  let start = 0;
  let jumps = 0;
  let comparisons = 0;
  
  console.log(`Mảng có ${n} phần tử, kích thước nhảy tối ưu: ${jumpSize}`);
  
  // Giai đoạn nhảy
  while (start < n) {
    const checkIndex = Math.min(start + jumpSize - 1, n - 1);
    comparisons++;
    console.log(`Nhảy ${jumps + 1}: Kiểm tra vị trí ${checkIndex}, giá trị ${arr[checkIndex]}`);
    
    if (arr[checkIndex] < target) {
      start += jumpSize;
      jumps++;
    } else {
      break;
    }
  }
  
  console.log(`Tìm kiếm tuyến tính từ vị trí ${start} đến ${Math.min(start + jumpSize - 1, n - 1)}`);
  
  // Giai đoạn tìm kiếm tuyến tính
  for (let i = start; i < Math.min(start + jumpSize, n); i++) {
    comparisons++;
    if (arr[i] === target) {
      return {
        found: true,
        index: i,
        jumps: jumps,
        comparisons: comparisons,
        jumpSize: jumpSize,
        efficiency: (comparisons / n * 100).toFixed(2) + '%'
      };
    }
    if (arr[i] > target) break;
  }
  
  return {
    found: false,
    index: -1,
    jumps: jumps,
    comparisons: comparisons,
    jumpSize: jumpSize,
    efficiency: (comparisons / n * 100).toFixed(2) + '%'
  };
}
```

#### Cài đặt an toàn với kiểm tra lỗi

Phiên bản này xử lý tốt các trường hợp biên và lỗi:

```javascript
function safeJumpSearch(arr, target) {
  // Kiểm tra đầu vào
  if (!Array.isArray(arr)) {
    throw new Error('Tham số đầu tiên phải là một mảng');
  }
  
  if (arr.length === 0) {
    return { found: false, index: -1, message: 'Mảng rỗng' };
  }
  
  // Kiểm tra mảng đã sắp xếp
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      throw new Error('Mảng phải được sắp xếp tăng dần');
    }
  }
  
  const n = arr.length;
  const jumpSize = Math.floor(Math.sqrt(n));
  
  // Xử lý trường hợp đặc biệt
  if (target < arr[0] || target > arr[n - 1]) {
    return { found: false, index: -1, message: 'Target nằm ngoài phạm vi mảng' };
  }
  
  let start = 0;
  
  // Giai đoạn nhảy
  while (start < n && arr[Math.min(start + jumpSize - 1, n - 1)] < target) {
    start += jumpSize;
  }
  
  // Giai đoạn tìm kiếm tuyến tính
  for (let i = start; i < Math.min(start + jumpSize, n); i++) {
    if (arr[i] === target) {
      return { found: true, index: i, message: 'Tìm thấy thành công' };
    }
    if (arr[i] > target) break;
  }
  
  return { found: false, index: -1, message: 'Không tìm thấy phần tử' };
}
```

### Phân tích độ phức tạp

**Độ phức tạp thời gian:**
- **Trường hợp tốt nhất**: O(1) - phần tử cần tìm ở vị trí đầu tiên
- **Trường hợp trung bình**: O(√n) - nhảy √n bước và tìm kiếm tuyến tính √n phần tử
- **Trường hợp xấu nhất**: O(√n) - nhảy hết các khối và tìm kiếm trong khối cuối

**Độ phức tạp không gian:**
- **Luôn luôn**: O(1) - chỉ sử dụng một số biến cục bộ

**Phân tích toán học chi tiết:**
```
Số lần nhảy tối đa: n/√n = √n
Số phép so sánh trong linear search: √n - 1  
Tổng số phép so sánh: √n + (√n - 1) = 2√n - 1 = O(√n)
```

### Ví dụ minh họa

#### Ví dụ 1: Tìm kiếm số trong mảng đã sắp xếp

```javascript
// Mảng số đã sắp xếp
const numbers = [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78];
const target = 23;

console.log('Mảng:', numbers);
console.log(`Tìm kiếm số: ${target}`);
console.log(`Kích thước mảng: ${numbers.length}`);
console.log(`Kích thước nhảy tối ưu: ${Math.floor(Math.sqrt(numbers.length))}`);
console.log('\n--- Quá trình tìm kiếm ---');

// Sử dụng phiên bản chi tiết để xem quá trình
const result = jumpSearchDetailed(numbers, target);

if (result.found) {
  console.log(`\n✅ Tìm thấy số ${target} tại vị trí ${result.index}`);
  console.log(`Số lần nhảy: ${result.jumps}`);
  console.log(`Số phép so sánh: ${result.comparisons}`);
  console.log(`Hiệu suất: ${result.efficiency} của mảng được kiểm tra`);
} else {
  console.log(`\n❌ Không tìm thấy số ${target}`);
}

// So sánh với tìm kiếm tuyến tính
console.log('\n--- So sánh với Linear Search ---');
let linearComparisons = 0;
for (let i = 0; i < numbers.length; i++) {
  linearComparisons++;
  if (numbers[i] === target) break;
}
console.log(`Linear Search: ${linearComparisons} phép so sánh`);
console.log(`Jump Search: ${result.comparisons} phép so sánh`);
console.log(`Cải thiện: ${((linearComparisons - result.comparisons) / linearComparisons * 100).toFixed(1)}%`);
```

#### Ví dụ 2: Tìm kiếm sinh viên theo điểm

```javascript
// Danh sách sinh viên đã sắp xếp theo điểm
const students = [
  { id: 1, name: 'Minh An', score: 6.5 },
  { id: 2, name: 'Thu Hương', score: 7.2 },
  { id: 3, name: 'Văn Long', score: 7.8 },
  { id: 4, name: 'Thị Lan', score: 8.2 },
  { id: 5, name: 'Hoàng Nam', score: 8.5 },
  { id: 6, name: 'Thú Linh', score: 8.8 },
  { id: 7, name: 'Quang Minh', score: 9.1 },
  { id: 8, name: 'Hải Yen', score: 9.4 }
];

// Hàm tìm kiếm sinh viên theo điểm
function findStudentByScore(students, targetScore) {
  const n = students.length;
  const jumpSize = Math.floor(Math.sqrt(n));
  let start = 0;
  
  console.log(`Tìm sinh viên có điểm ${targetScore}`);
  console.log(`Kích thước nhảy: ${jumpSize}`);
  
  // Giai đoạn nhảy
  while (start < n && students[Math.min(start + jumpSize - 1, n - 1)].score < targetScore) {
    console.log(`Nhảy tới vị trí ${start + jumpSize}`);
    start += jumpSize;
  }
  
  // Giai đoản tìm kiếm tuyến tính
  console.log(`Tìm kiếm tuyến tính từ vị trí ${start}`);
  for (let i = start; i < Math.min(start + jumpSize, n); i++) {
    if (students[i].score === targetScore) {
      return { found: true, student: students[i], position: i };
    }
    if (students[i].score > targetScore) break;
  }
  
  return { found: false, student: null, position: -1 };
}

// Tìm sinh viên có điểm 8.5
const result = findStudentByScore(students, 8.5);
if (result.found) {
  console.log(`\n✅ Tìm thấy: ${result.student.name} - Điểm: ${result.student.score}`);
} else {
  console.log('\n❌ Không tìm thấy sinh viên');
}
```

## 🏆 Bài tập thực hành

### Bài tập 1: Tìm kiếm sản phẩm theo giá

**Đề bài:** Cửa hàng có danh sách sản phẩm đã được sắp xếp theo giá từ thấp đến cao. Hãy viết hàm sử dụng Jump Search để tìm sản phẩm có giá cụ thể và trả về thông tin chi tiết về quá trình tìm kiếm.

**Lời giải chi tiết:**

```javascript
function findProductByPrice(products, targetPrice) {
  const n = products.length;
  if (n === 0) {
    return { found: false, message: 'Danh sách sản phẩm rỗng' };
  }
  
  const jumpSize = Math.floor(Math.sqrt(n));
  let start = 0;
  let jumps = 0;
  let comparisons = 0;
  
  console.log(`Bắt đầu tìm sản phẩm có giá ${targetPrice.toLocaleString('vi-VN')} VNĐ`);
  console.log(`Kích thước nhảy tối ưu: ${jumpSize}`);
  
  // Giai đoạn nhảy
  while (start < n) {
    const checkIndex = Math.min(start + jumpSize - 1, n - 1);
    const checkPrice = products[checkIndex].price;
    comparisons++;
    
    console.log(`Bước ${jumps + 1}: Kiểm tra vị trí ${checkIndex}, giá ${checkPrice.toLocaleString('vi-VN')} VNĐ`);
    
    if (checkPrice < targetPrice) {
      start += jumpSize;
      jumps++;
      console.log(`  -> Giá nhỏ hơn, nhảy tiếp`);
    } else {
      console.log(`  -> Giá lớn hơn hoặc bằng, chuyển sang tìm kiếm tuyến tính`);
      break;
    }
  }
  
  // Giai đoạn tìm kiếm tuyến tính
  console.log(`Tìm kiếm tuyến tính từ vị trí ${start} đến ${Math.min(start + jumpSize - 1, n - 1)}`);
  
  for (let i = start; i < Math.min(start + jumpSize, n); i++) {
    comparisons++;
    console.log(`  Kiểm tra: ${products[i].name} - ${products[i].price.toLocaleString('vi-VN')} VNĐ`);
    
    if (products[i].price === targetPrice) {
      return {
        found: true,
        product: products[i],
        position: i,
        jumps: jumps,
        comparisons: comparisons,
        efficiency: `Đã kiểm tra ${comparisons}/${n} sản phẩm (${(comparisons/n*100).toFixed(1)}%)`
      };
    }
    
    if (products[i].price > targetPrice) {
      console.log(`  Giá lớn hơn target, dừng tìm kiếm`);
      break;
    }
  }
  
  return {
    found: false,
    product: null,
    position: -1,
    jumps: jumps,
    comparisons: comparisons,
    message: 'Không tìm thấy sản phẩm với giá này'
  };
}

// Dữ liệu mẫu
const products = [
  { name: 'Bút chì', price: 15000 },
  { name: 'Vở ghi chú', price: 25000 },
  { name: 'Bút mực', price: 35000 },
  { name: 'Thước kẻ', price: 45000 },
  { name: 'Cặp sách', price: 75000 },
  { name: 'Bình nước', price: 120000 },
  { name: 'Áo phông', price: 180000 },
  { name: 'Giày thể thao', price: 850000 }
];

// Tìm sản phẩm có giá 75,000 VNĐ
const result = findProductByPrice(products, 75000);
if (result.found) {
  console.log(`\n✅ Kết quả: Tìm thấy ${result.product.name}`);
  console.log(`Vị trí: ${result.position}`);
  console.log(`Hiệu suất: ${result.efficiency}`);
}
```

**Giải thích logic:**
1. Tính kích thước nhảy tối ưu dựa trên số lượng sản phẩm
2. Thực hiện các bước nhảy, kiểm tra giá sản phẩm ở cuối mỗi khối
3. Khi tìm thấy khoảng chứa giá cần tìm, chuyển sang tìm kiếm tuyến tính
4. Theo dõi và báo cáo số liệu thống kê về hiệu suất tìm kiếm

### Bài tập 2: Phân tích hiệu suất tìm kiếm

**Đề bài:** So sánh hiệu suất của Jump Search với Linear Search và Binary Search trên các mảng có kích thước khác nhau. Tạo báo cáo chi tiết về số phép so sánh và thời gian thực thi.

**Lời giải chi tiết:**

```javascript
function performanceComparison(arraySize, searchValue) {
  // Tạo mảng đã sắp xếp
  const arr = Array.from({length: arraySize}, (_, i) => (i + 1) * 2);
  const results = {};
  
  console.log(`\n=== So sánh hiệu suất trên mảng ${arraySize} phần tử ===`);
  console.log(`Tìm kiếm giá trị: ${searchValue}`);
  
  // 1. Linear Search
  let linearComparisons = 0;
  const linearStart = performance.now();
  
  for (let i = 0; i < arr.length; i++) {
    linearComparisons++;
    if (arr[i] === searchValue) break;
  }
  
  const linearEnd = performance.now();
  results.linear = {
    comparisons: linearComparisons,
    time: (linearEnd - linearStart).toFixed(4),
    found: arr.includes(searchValue)
  };
  
  // 2. Jump Search  
  let jumpComparisons = 0;
  const jumpStart = performance.now();
  
  const n = arr.length;
  const jumpSize = Math.floor(Math.sqrt(n));
  let start = 0;
  
  // Giai đoạn nhảy
  while (start < n && arr[Math.min(start + jumpSize - 1, n - 1)] < searchValue) {
    start += jumpSize;
    jumpComparisons++;
  }
  
  // Giai đoạn tìm kiếm tuyến tính
  let jumpFound = false;
  for (let i = start; i < Math.min(start + jumpSize, n); i++) {
    jumpComparisons++;
    if (arr[i] === searchValue) {
      jumpFound = true;
      break;
    }
    if (arr[i] > searchValue) break;
  }
  
  const jumpEnd = performance.now();
  results.jump = {
    comparisons: jumpComparisons,
    time: (jumpEnd - jumpStart).toFixed(4),
    jumpSize: jumpSize,
    found: jumpFound
  };
  
  // 3. Binary Search (tham khảo)
  let binaryComparisons = 0;
  const binaryStart = performance.now();
  
  let left = 0, right = arr.length - 1;
  let binaryFound = false;
  
  while (left <= right) {
    binaryComparisons++;
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === searchValue) {
      binaryFound = true;
      break;
    } else if (arr[mid] < searchValue) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  const binaryEnd = performance.now();
  results.binary = {
    comparisons: binaryComparisons,
    time: (binaryEnd - binaryStart).toFixed(4),
    found: binaryFound
  };
  
  // In báo cáo
  console.log('\n--- Kết quả ---');
  console.log(`Linear Search:  ${results.linear.comparisons} phép so sánh, ${results.linear.time}ms`);
  console.log(`Jump Search:    ${results.jump.comparisons} phép so sánh, ${results.jump.time}ms (jump size: ${results.jump.jumpSize})`);
  console.log(`Binary Search:  ${results.binary.comparisons} phép so sánh, ${results.binary.time}ms`);
  
  // Tính toán cải thiện
  const jumpImprovement = ((results.linear.comparisons - results.jump.comparisons) / results.linear.comparisons * 100).toFixed(1);
  const binaryImprovement = ((results.linear.comparisons - results.binary.comparisons) / results.linear.comparisons * 100).toFixed(1);
  
  console.log('\n--- Cải thiện so với Linear Search ---');
  console.log(`Jump Search: giảm ${jumpImprovement}% số phép so sánh`);
  console.log(`Binary Search: giảm ${binaryImprovement}% số phép so sánh`);
  
  return results;
}

// Chạy thử nghiệm với các kích thước khác nhau
const testSizes = [100, 500, 1000, 2500];
const allResults = [];

for (const size of testSizes) {
  const targetValue = size * 1.5; // Tìm giá trị ở khoảng giữa mảng
  const result = performanceComparison(size, targetValue);
  allResults.push({ size, ...result });
}

// Tổng kết
console.log('\n=== Tổng kết ===');
console.log('Kích thước | Linear | Jump | Binary | Jump/Linear | Binary/Linear');
console.log('---------|-------|------|--------|-------------|---------------');

for (const result of allResults) {
  const jumpRatio = (result.jump.comparisons / result.linear.comparisons).toFixed(2);
  const binaryRatio = (result.binary.comparisons / result.linear.comparisons).toFixed(2);
  
  console.log(`${result.size.toString().padStart(8)} | ${result.linear.comparisons.toString().padStart(5)} | ${result.jump.comparisons.toString().padStart(4)} | ${result.binary.comparisons.toString().padStart(6)} | ${jumpRatio.padStart(11)} | ${binaryRatio.padStart(13)}`);
}
```

**Giải thích logic:**
1. Tạo các mảng test với kích thước khác nhau
2. Triển khai 3 thuật toán tìm kiếm và đếm số phép so sánh
3. Đo thời gian thực thi bằng `performance.now()`
4. So sánh hiệu suất và tạo báo cáo chi tiết
5. Thể hiện ưu điểm của Jump Search so với Linear Search

## 🔑 Những điểm quan trọng cần lưu ý

### Khái niệm trọng tâm

1. **Thuật toán kết hợp**: Jump Search kết hợp ưu điểm của nhảy (giảm số phép so sánh) và tìm kiếm tuyến tính (đơn giản)
2. **Kích thước nhảy tối ưu**: √n là kích thước tối ưu, cho độ phức tạp O(√n)
3. **Yêu cầu dữ liệu sắp xếp**: Chỉ hoạt động với mảng đã được sắp xếp
4. **Hai giai đoạn rõ rèt**: Jumping phase (tìm khoảng) và Linear search phase (tìm chính xác)

### Lỗi thường gặp cần tránh

❌ **Lỗi 1: Quên kiểm tra mảng sắp xếp**
```javascript
// SAI: Không kiểm tra mảng đã sắp xếp
function jumpSearch(arr, target) {
  // Bắt đầu tìm kiếm mà không kiểm tra
  const jumpSize = Math.floor(Math.sqrt(arr.length));
  // ... 
}

// ĐÚNG: Kiểm tra mảng sắp xếp trước
function jumpSearch(arr, target) {
  // Kiểm tra mảng đã sắp xếp
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      throw new Error('Mảng phải được sắp xếp');
    }
  }
  const jumpSize = Math.floor(Math.sqrt(arr.length));
  // ...
}
```

❌ **Lỗi 2: Tính toán sai kích thước nhảy**
```javascript
// SAI: Dùng kích thước nhảy cố định
const jumpSize = 10; // Không tối ưu

// ĐÚNG: Tính toán dựa trên kích thước mảng
const jumpSize = Math.floor(Math.sqrt(arr.length)); // Tối ưu
```

❌ **Lỗi 3: Xử lý sai chỉ số biên**
```javascript
// SAI: Không xử lý biên mảng
while (arr[start + jumpSize - 1] < target) { // Có thể vượt biên
  start += jumpSize;
}

// ĐÚNG: Xử lý biên an toàn
while (start < n && arr[Math.min(start + jumpSize - 1, n - 1)] < target) {
  start += jumpSize;
}
```

### Điểm dễ nhầm lẫn

1. **Jump Search vs Binary Search**:
   - Jump Search: O(√n), không cần random access hiệu quả
   - Binary Search: O(log n), cần random access nhanh

2. **Kích thước nhảy**: Luôn dùng √n, không phải số cố định

3. **Thứ tự gầi đoạn**: Luôn là jumping phase trước, linear search phase sau

## 📝 Bài tập về nhà

### Bài tập về nhà 1: Hệ thống quản lý thư viện

**Đề bài:** Một thư viện có danh sách sách đã được sắp xếp theo mã ISBN. Hãy viết chương trình quản lý thư viện sử dụng Jump Search với các chức năng:

**Yêu cầu:**
- Tìm sách theo mã ISBN chính xác
- Tìm tất cả sách trong một khoảng mã ISBN
- Đếm số sách có sẵn trong khoảng nhất định
- Hiển thị thống kê về hiệu suất tìm kiếm
- Xử lý các trường hợp lỗi (mảng rỗng, mã không hợp lệ)

**Dữ liệu mẫu:**
```javascript
const books = [
  { isbn: '978-0-123456-78-9', title: 'Lập trình JavaScript', author: 'Nguyễn Văn A', available: true },
  { isbn: '978-0-234567-89-0', title: 'Thuật toán và cấu trúc dữ liệu', author: 'Trần Thị B', available: false },
  { isbn: '978-0-345678-90-1', title: 'Cơ sở dữ liệu', author: 'Lê Văn C', available: true },
  { isbn: '978-0-456789-01-2', title: 'Mạng máy tính', author: 'Phạm Thị D', available: true },
  { isbn: '978-0-567890-12-3', title: 'Trí tuệ nhân tạo', author: 'Hoàng Văn E', available: false }
];
```

### Bài tập về nhà 2: Tối ưu hóa tìm kiếm cho dữ liệu lớn

**Đề bài:** Tạo một hệ thống tìm kiếm thông minh cho dữ liệu lớn với các tính năng nâng cao:

**Yêu cầu:**
- Tạo bộ dữ liệu test lớn (10,000 - 100,000 phần tử)
- Triển khai Adaptive Jump Search (tự động điều chỉnh kích thước nhảy)
- So sánh với Jump Search thông thường và các thuật toán khác
- Đo lường hiệu suất với các mẫu dữ liệu khác nhau
- Tạo biểu đồ so sánh kết quả
- Viết báo cáo phân tích và kết luận

**Gợi ý cài đặt:**
- Sử dụng `Math.random()` để tạo dữ liệu ngẫu nhiên
- Đo thời gian bằng `performance.now()` cho độ chính xác cao
- Thử nghiệm với các loại phân bố dữ liệu khác nhau
- Cân nhắc sử dụng thư viện biểu đồ để trực quan hóa kết quả

\---

*Lưu ý: Hãy thực hành kỹ lưỡng các bài tập để hiểu rõ hơn về thuật toán. Jump Search là một thuật toán quan trọng trong việc tìm kiếm hiệu quả trên dữ liệu đã sắp xếp.*


---

*Post ID: 5cq1qt9d793an8k*  
*Category: Searches Algorithms*  
*Created: 22/8/2025*  
*Updated: 29/8/2025*
