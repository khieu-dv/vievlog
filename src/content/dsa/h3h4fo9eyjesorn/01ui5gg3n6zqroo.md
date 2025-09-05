---
title: "Thuật toán tìm kiếm nhị phân (Binary Search)"
postId: "01ui5gg3n6zqroo"
category: "Searches Algorithms"
created: "22/8/2025"
updated: "29/8/2025"
---

# Thuật toán tìm kiếm nhị phân (Binary Search)


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có khả năng:

- **Hiểu rõ nguyên lý "chia để trị"** và cách Binary Search áp dụng chiến lược này
- **Nắm vững độ phức tạp O(log n)** và hiểu tại sao Binary Search là thuật toán tối ưu
- **Triển khai thành thạo** cả phiên bản iterative và recursive của thuật toán
- **Phân biệt các biến thể** như lower bound, upper bound và range search
- **Áp dụng linh hoạt** vào các bài toán thực tế với dữ liệu đã sắp xếp

## 📝 Nội dung chi tiết

### Khái niệm cơ bản

**Thuật toán tìm kiếm nhị phân (Binary Search)** là thuật toán tìm kiếm hiệu quả nhất cho dữ liệu đã sắp xếp. Thuật toán hoạt động theo nguyên lý "chia để trị" - liên tục chia đôi không gian tìm kiếm bằng cách so sánh phần tử cần tìm với phần tử ở giữa mảng, từ đó quyết định loại bỏ nửa không cần thiết.

**Tại sao gọi là "nhị phân"?** Vì thuật toán luôn chia không gian tìm kiếm thành 2 phần bằng nhau (binary = nhị phân), chỉ giữ lại phần có thể chứa phần tử cần tìm.

![Binary Search](https://upload.wikimedia.org/wikipedia/commons/8/83/Binary_Search_Depiction.svg)

### Nguyên lý hoạt động

Binary Search tuân theo quy trình logic rất rõ ràng:

#### **Bước 1: Xác định không gian tìm kiếm**
- Thiết lập biến `left = 0` (đầu mảng) và `right = n-1` (cuối mảng)
- Không gian tìm kiếm ban đầu là toàn bộ mảng [left, right]

#### **Bước 2: Tính chỉ số giữa**
- Tính `mid = left + (right - left) / 2` (tránh integer overflow)
- So sánh `arr[mid]` với `target`

#### **Bước 3: Quyết định hướng tìm kiếm**
- Nếu `arr[mid] == target` → Tìm thấy, trả về `mid`
- Nếu `arr[mid] < target` → Target ở nửa phải, `left = mid + 1`
- Nếu `arr[mid] > target` → Target ở nửa trái, `right = mid - 1`

#### **Bước 4: Lặp lại hoặc kết thúc**
- Nếu `left <= right` → Tiếp tục từ Bước 2
- Nếu `left > right` → Không tìm thấy, trả về -1

### Phân tích độ phức tạp toán học

**Tại sao Binary Search có độ phức tạp O(log n)?**

Trong mỗi bước, thuật toán chia đôi không gian tìm kiếm:
- Bước 1: n phần tử
- Bước 2: n/2 phần tử  
- Bước 3: n/4 phần tử
- ...
- Bước k: n/2^k = 1 phần tử

Giải phương trình: n/2^k = 1 → 2^k = n → k = log₂(n)

**Kết luận**: Cần tối đa ⌊log₂(n)⌋ + 1 phép so sánh để tìm thấy hoặc kết luận không tồn tại.

### Đặc điểm then chốt

**Ưu điểm:**
- **Hiệu suất vượt trội**: O(log n) - nhanh nhất cho dữ liệu sắp xếp
- **Tính dự đoán cao**: Hiệu suất ổn định trong mọi trường hợp
- **Tiết kiệm bộ nhớ**: Chỉ cần O(1) không gian bổ sung (iterative)
- **Thuật toán tối ưu**: Không thể cải thiện thêm về mặt lý thuyết
- **Dễ cài đặt**: Logic đơn giản và rõ ràng

**Nhược điểm:**
- **Yêu cầu sắp xếp**: Chỉ hoạt động với dữ liệu đã được sắp xếp
- **Cần random access**: Không hiệu quả với linked list
- **Overhead với mảng nhỏ**: Linear search có thể nhanh hơn với n < 10
- **Không linh hoạt**: Khó mở rộng cho các điều kiện tìm kiếm phức tạp

### Cài đặt thuật toán

#### Cài đặt cơ bản (Iterative)

Đây là phiên bản lặp (iterative) - được khuyến nghị sử dụng vì tiết kiệm bộ nhớ:

```javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    // Tính chỉ số giữa (tránh integer overflow)
    const mid = left + Math.floor((right - left) / 2);
    
    // Kiểm tra phần tử giữa
    if (arr[mid] === target) {
      return mid; // Tìm thấy, trả về vị trí
    }
    
    // Quyết định hướng tìm kiếm
    if (arr[mid] < target) {
      left = mid + 1;  // Tìm ở nửa phải
    } else {
      right = mid - 1; // Tìm ở nửa trái
    }
  }
  
  return -1; // Không tìm thấy
}
```

#### Cài đặt đệ quy (Recursive)

Phiên bản đệ quy trực quan hơn nhưng sử dụng thêm O(log n) bộ nhớ stack:

```javascript
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  // Điều kiện dừng: không gian tìm kiếm rỗng
  if (left > right) {
    return -1;
  }
  
  // Tính chỉ số giữa
  const mid = left + Math.floor((right - left) / 2);
  
  // Tìm thấy target
  if (arr[mid] === target) {
    return mid;
  }
  
  // Đệ quy ở nửa trái hoặc phải
  if (arr[mid] > target) {
    return binarySearchRecursive(arr, target, left, mid - 1);
  } else {
    return binarySearchRecursive(arr, target, mid + 1, right);
  }
}
```

#### Cài đặt với thống kê chi tiết

Phiên bản này cung cấp thông tin chi tiết về quá trình tìm kiếm:

```javascript
function binarySearchWithDetails(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let comparisons = 0;
  let iterations = 0;
  const searchPath = [];
  
  console.log(`Tìm kiếm ${target} trong mảng [${arr.join(', ')}]`);
  console.log(`Kích thước mảng: ${arr.length}, tối đa cần ${Math.ceil(Math.log2(arr.length))} phép so sánh`);
  
  while (left <= right) {
    iterations++;
    const mid = left + Math.floor((right - left) / 2);
    comparisons++;
    
    const step = {
      iteration: iterations,
      left: left,
      right: right, 
      mid: mid,
      value: arr[mid],
      comparison: arr[mid] === target ? 'FOUND' : 
                  arr[mid] < target ? 'GO_RIGHT' : 'GO_LEFT'
    };
    
    searchPath.push(step);
    console.log(`Bước ${iterations}: [${left}..${right}] mid=${mid} arr[${mid}]=${arr[mid]} -> ${step.comparison}`);
    
    if (arr[mid] === target) {
      return {
        found: true,
        index: mid,
        comparisons: comparisons,
        iterations: iterations,
        searchPath: searchPath,
        efficiency: `${comparisons}/${Math.ceil(Math.log2(arr.length))} (${(comparisons/Math.ceil(Math.log2(arr.length))*100).toFixed(1)}%)`
      };
    }
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return {
    found: false,
    index: -1,
    comparisons: comparisons,
    iterations: iterations,
    searchPath: searchPath,
    message: 'Không tìm thấy phần tử'
  };
}
```

### Các biến thể quan trọng

#### Lower Bound (Tìm vị trí đầu tiên)

Tìm vị trí đầu tiên mà `arr[i] >= target`:

```javascript
function lowerBound(arr, target) {
  let left = 0;
  let right = arr.length;
  
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return left; // Vị trí để chèn target vào mảng
}
```

#### Upper Bound (Tìm vị trí sau cuối)

Tìm vị trí đầu tiên mà `arr[i] > target`:

```javascript
function upperBound(arr, target) {
  let left = 0;
  let right = arr.length;
  
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (arr[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return left;
}
```

### Phân tích hiệu suất

**Độ phức tạp thời gian:**
- **Mọi trường hợp**: O(log n) - chia đôi không gian tìm kiếm mỗi lần
- **Số phép so sánh**: Tối đa ⌊log₂(n)⌋ + 1

**Độ phức tạp không gian:**
- **Iterative**: O(1) - chỉ sử dụng vài biến
- **Recursive**: O(log n) - do call stack

**So sánh với Linear Search:**
```
Kích thước mảng    | Linear Search | Binary Search | Tăng tốc
1,000             | 1,000         | 10            | 100x
1,000,000         | 1,000,000     | 20            | 50,000x
1,000,000,000     | 1,000,000,000 | 30            | 33,000,000x
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
console.log(`Số phép so sánh tối đa: ${Math.ceil(Math.log2(numbers.length))}`);
console.log('\n--- Quá trình tìm kiếm ---');

// Sử dụng phiên bản chi tiết để xem quá trình
const result = binarySearchWithDetails(numbers, target);

if (result.found) {
  console.log(`\n✅ Tìm thấy số ${target} tại vị trí ${result.index}`);
  console.log(`Số phép so sánh: ${result.comparisons}`);
  console.log(`Hiệu suất: ${result.efficiency}`);
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
console.log(`Binary Search: ${result.comparisons} phép so sánh`);
console.log(`Tăng tốc: ${(linearComparisons / result.comparisons).toFixed(1)}x`);

// Sử dụng Lower Bound để tìm vị trí chèn
const insertPosition = lowerBound(numbers, 25);
console.log(`\nVị trí chèn cho số 25: ${insertPosition}`);
```

#### Ví dụ 2: Tìm kiếm sinh viên theo điểm

```javascript
const students = [
  { id: 1, name: 'Nguyễn An', score: 65, grade: 'D' },
  { id: 2, name: 'Trần Bình', score: 72, grade: 'C' },
  { id: 3, name: 'Lê Chi', score: 78, grade: 'C+' },
  { id: 4, name: 'Phạm Dũng', score: 82, grade: 'B' },
  { id: 5, name: 'Hoàng Hoa', score: 85, grade: 'B+' },
  { id: 6, name: 'Võ Linh', score: 88, grade: 'A-' },
  { id: 7, name: 'Đặng Nam', score: 91, grade: 'A' },
  { id: 8, name: 'Mai Oanh', score: 94, grade: 'A' },
  { id: 9, name: 'Lý Phong', score: 96, grade: 'A+' },
  { id: 10, name: 'Trương Quân', score: 98, grade: 'A+' }
];

// Tìm sinh viên có điểm cụ thể
const targetScore = 85;
const studentResult = binarySearchObject(students, targetScore, 'score');

if (studentResult.found) {
  console.log(`Sinh viên có điểm ${targetScore}:`, studentResult.object);
} else {
  console.log(`Không tìm thấy sinh viên có điểm ${targetScore}`);
}

// Tìm khoảng điểm số
function findScoreRange(students, minScore, maxScore) {
  // Tìm vị trí bắt đầu
  const startPos = binarySearchInsertPosition(
    students.map(s => s.score), 
    minScore
  );
  
  // Tìm vị trí kết thúc
  const endPos = binarySearchInsertPosition(
    students.map(s => s.score), 
    maxScore + 1
  );
  
  return students.slice(startPos, endPos);
}

const midRangeStudents = findScoreRange(students, 80, 90);
console.log('\nSinh viên có điểm từ 80-90:');
midRangeStudents.forEach(student => {
  console.log(`${student.name}: ${student.score} (${student.grade})`);
});

// Thống kê phân bố điểm
function analyzeScoreDistribution(students) {
  const scores = students.map(s => s.score);
  const analysis = {
    total: students.length,
    min: scores[0],
    max: scores[scores.length - 1],
    median: scores[Math.floor(scores.length / 2)],
    ranges: {
      excellent: findScoreRange(students, 90, 100).length,
      good: findScoreRange(students, 80, 89).length,
      average: findScoreRange(students, 70, 79).length,
      poor: findScoreRange(students, 0, 69).length
    }
  };
  
  return analysis;
}

const distribution = analyzeScoreDistribution(students);
console.log('\nPhân tích phân bố điểm:', distribution);
```

### Ví dụ 3: Tìm kiếm trong dữ liệu thời gian

```javascript
const events = [
  { time: '08:00', event: 'Bắt đầu làm việc', type: 'work' },
  { time: '09:30', event: 'Họp team', type: 'meeting' },
  { time: '11:00', event: 'Coffee break', type: 'break' },
  { time: '12:00', event: 'Lunch', type: 'break' },
  { time: '13:30', event: 'Training', type: 'learning' },
  { time: '15:00', event: 'Code review', type: 'work' },
  { time: '16:30', event: 'Planning', type: 'meeting' },
  { time: '17:30', event: 'Kết thúc', type: 'work' }
];

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Tìm sự kiện theo thời gian
function findEventByTime(events, targetTime) {
  const targetMinutes = timeToMinutes(targetTime);
  let left = 0;
  let right = events.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const midMinutes = timeToMinutes(events[mid].time);

    if (midMinutes === targetMinutes) {
      return { found: true, event: events[mid], index: mid };
    }

    if (midMinutes < targetMinutes) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return { found: false, event: null, index: -1 };
}

// Tìm sự kiện gần nhất
function findNearestEvent(events, targetTime) {
  const targetMinutes = timeToMinutes(targetTime);
  let left = 0;
  let right = events.length - 1;
  let nearest = null;
  let minDiff = Infinity;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const midMinutes = timeToMinutes(events[mid].time);
    const diff = Math.abs(midMinutes - targetMinutes);

    if (diff < minDiff) {
      minDiff = diff;
      nearest = events[mid];
    }

    if (midMinutes === targetMinutes) {
      return { event: nearest, timeDifference: 0, exact: true };
    }

    if (midMinutes < targetMinutes) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return { 
    event: nearest, 
    timeDifference: minDiff, 
    exact: false,
    differenceText: `${Math.floor(minDiff / 60)}h${minDiff % 60}m`
  };
}

// Tìm các sự kiện trong khoảng thời gian
function findEventsInTimeRange(events, startTime, endTime) {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  
  // Tìm vị trí bắt đầu
  const startPos = binarySearchInsertPosition(
    events.map(e => timeToMinutes(e.time)), 
    startMinutes
  );
  
  // Tìm vị trí kết thúc
  const endPos = binarySearchInsertPosition(
    events.map(e => timeToMinutes(e.time)), 
    endMinutes + 1
  );
  
  return events.slice(startPos, endPos);
}

// Ví dụ sử dụng
console.log('=== Tìm kiếm sự kiện ===');

const exactEvent = findEventByTime(events, '12:00');
console.log('Sự kiện lúc 12:00:', exactEvent);

const nearestToLunch = findNearestEvent(events, '12:15');
console.log('Sự kiện gần 12:15 nhất:', nearestToLunch);

const morningEvents = findEventsInTimeRange(events, '09:00', '12:00');
console.log('\nSự kiện buổi sáng (9:00-12:00):');
morningEvents.forEach(event => {
  console.log(`${event.time}: ${event.event} (${event.type})`);
});
```

## Biến thể của Binary Search

### 1. Lower Bound (First Occurrence)

```javascript
function lowerBound(arr, target) {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left; // Vị trí đầu tiên >= target
}

function findFirstOccurrence(arr, target) {
  const pos = lowerBound(arr, target);
  return (pos < arr.length && arr[pos] === target) ? pos : -1;
}
```

### 2. Upper Bound (Last Occurrence)

```javascript
function upperBound(arr, target) {
  let left = 0;
  let right = arr.length;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (arr[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  return left; // Vị trí đầu tiên > target
}

function findLastOccurrence(arr, target) {
  const pos = upperBound(arr, target) - 1;
  return (pos >= 0 && arr[pos] === target) ? pos : -1;
}
```

### 3. Range Search

```javascript
function findRange(arr, target) {
  const first = findFirstOccurrence(arr, target);
  if (first === -1) {
    return [-1, -1];
  }
  
  const last = findLastOccurrence(arr, target);
  return [first, last];
}

function countOccurrences(arr, target) {
  const [first, last] = findRange(arr, target);
  return first === -1 ? 0 : last - first + 1;
}

// Ví dụ với mảng có phần tử trùng lặp
const duplicateArray = [1, 2, 2, 2, 3, 4, 4, 5, 5, 5, 5, 6];
console.log('Mảng:', duplicateArray);
console.log('Range của số 2:', findRange(duplicateArray, 2));
console.log('Range của số 5:', findRange(duplicateArray, 5));
console.log('Số lần xuất hiện của 4:', countOccurrences(duplicateArray, 4));
```

### 4. Rotated Array Search

```javascript
function searchInRotatedArray(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) {
      return mid;
    }

    // Kiểm tra nửa nào được sắp xếp
    if (nums[left] <= nums[mid]) {
      // Nửa trái được sắp xếp
      if (nums[left] <= target && target < nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      // Nửa phải được sắp xếp
      if (nums[mid] < target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
}

// Ví dụ: mảng [4,5,6,7,0,1,2] là mảng [0,1,2,4,5,6,7] bị xoay
const rotatedArray = [4, 5, 6, 7, 0, 1, 2];
console.log('Mảng xoay:', rotatedArray);
console.log('Tìm 0 trong mảng xoay:', searchInRotatedArray(rotatedArray, 0));
console.log('Tìm 3 trong mảng xoay:', searchInRotatedArray(rotatedArray, 3));
```

### 5. Peak Element Search

```javascript
function findPeakElement(nums) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] > nums[mid + 1]) {
      // Peak ở bên trái (hoặc tại mid)
      right = mid;
    } else {
      // Peak ở bên phải
      left = mid + 1;
    }
  }

  return left;
}

// Ví dụ: tìm peak trong mảng [1,2,3,1]
const peakArray = [1, 2, 3, 1];
console.log('Mảng:', peakArray);
console.log('Peak element tại vị trí:', findPeakElement(peakArray));
console.log('Giá trị peak:', peakArray[findPeakElement(peakArray)]);
```

## Ứng dụng thực tế

### 1. Hệ thống quản lý thư viện

```javascript
class LibrarySystem {
  constructor() {
    this.books = [];
    this.borrowHistory = [];
  }

  addBook(book) {
    // Thêm sách và duy trì thứ tự sắp xếp theo ISBN
    const insertPos = binarySearchInsertPosition(
      this.books.map(b => b.isbn), 
      book.isbn
    );
    this.books.splice(insertPos, 0, book);
  }

  findBookByISBN(isbn) {
    const result = binarySearchObject(this.books, isbn, 'isbn');
    return result.found ? result.object : null;
  }

  findBooksByAuthor(author) {
    // Tạo index tạm thời cho tác giả
    const authorSorted = [...this.books].sort((a, b) => a.author.localeCompare(b.author));
    
    // Tìm range của tác giả
    const first = lowerBound(authorSorted.map(b => b.author), author);
    const last = upperBound(authorSorted.map(b => b.author), author);
    
    return authorSorted.slice(first, last);
  }

  findAvailableBooks() {
    // Tìm sách có sẵn (không được mượn)
    return this.books.filter(book => book.available);
  }

  searchBooksByYear(year) {
    // Sắp xếp theo năm xuất bản
    const yearSorted = [...this.books].sort((a, b) => a.publishYear - b.publishYear);
    
    const result = binarySearchObject(yearSorted, year, 'publishYear');
    if (!result.found) return [];
    
    // Tìm tất cả sách cùng năm
    const [first, last] = findRange(yearSorted.map(b => b.publishYear), year);
    return yearSorted.slice(first, last + 1);
  }

  getStatistics() {
    if (this.books.length === 0) return null;

    const years = this.books.map(b => b.publishYear).sort((a, b) => a - b);
    const pages = this.books.map(b => b.pages).sort((a, b) => a - b);

    return {
      totalBooks: this.books.length,
      oldestBook: years[0],
      newestBook: years[years.length - 1],
      averagePages: pages[Math.floor(pages.length / 2)],
      availableBooks: this.books.filter(b => b.available).length
    };
  }
}

// Ví dụ sử dụng
const library = new LibrarySystem();

// Thêm sách
library.addBook({ isbn: '978-3-16-148410-0', title: 'Algorithms', author: 'Sedgewick', publishYear: 2011, pages: 955, available: true });
library.addBook({ isbn: '978-0-262-03384-8', title: 'Introduction to Algorithms', author: 'Cormen', publishYear: 2009, pages: 1312, available: true });
library.addBook({ isbn: '978-0-201-89685-5', title: 'Design Patterns', author: 'Gang of Four', publishYear: 1994, pages: 395, available: false });
library.addBook({ isbn: '978-0-134-49201-6', title: 'Clean Code', author: 'Martin', publishYear: 2008, pages: 464, available: true });

console.log('=== Hệ thống thư viện ===');
console.log('Tìm sách ISBN 978-0-262-03384-8:', library.findBookByISBN('978-0-262-03384-8'));
console.log('Sách xuất bản năm 2008:', library.searchBooksByYear(2008));
console.log('Thống kê thư viện:', library.getStatistics());
```

### 2. Hệ thống trading và tài chính

```javascript
class TradingSystem {
  constructor() {
    this.priceHistory = []; // Sorted by timestamp
    this.orders = []; // Sorted by price
  }

  addPriceData(timestamp, price, volume) {
    const insertPos = binarySearchInsertPosition(
      this.priceHistory.map(p => p.timestamp), 
      timestamp
    );
    this.priceHistory.splice(insertPos, 0, { timestamp, price, volume });
  }

  findPriceAtTime(timestamp) {
    const result = binarySearchObject(this.priceHistory, timestamp, 'timestamp');
    return result.found ? result.object : null;
  }

  findPriceRange(startTime, endTime) {
    const startPos = binarySearchInsertPosition(
      this.priceHistory.map(p => p.timestamp), 
      startTime
    );
    const endPos = binarySearchInsertPosition(
      this.priceHistory.map(p => p.timestamp), 
      endTime + 1
    );
    
    return this.priceHistory.slice(startPos, endPos);
  }

  findNearestPrice(targetPrice) {
    // Sắp xếp theo giá
    const priceSorted = [...this.priceHistory].sort((a, b) => a.price - b.price);
    
    let left = 0;
    let right = priceSorted.length - 1;
    let nearest = null;
    let minDiff = Infinity;

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const diff = Math.abs(priceSorted[mid].price - targetPrice);

      if (diff < minDiff) {
        minDiff = diff;
        nearest = priceSorted[mid];
      }

      if (priceSorted[mid].price === targetPrice) {
        return nearest;
      }

      if (priceSorted[mid].price < targetPrice) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return nearest;
  }

  calculateMovingAverage(period = 20) {
    if (this.priceHistory.length < period) return null;

    const recentPrices = this.priceHistory
      .slice(-period)
      .map(p => p.price);
    
    return recentPrices.reduce((sum, price) => sum + price, 0) / period;
  }

  findResistanceSupport() {
    // Tìm mức resistance và support dựa trên price clusters
    const prices = this.priceHistory.map(p => p.price).sort((a, b) => a - b);
    const priceGroups = new Map();

    // Nhóm giá theo khoảng 1%
    prices.forEach(price => {
      const group = Math.floor(price / 100) * 100;
      priceGroups.set(group, (priceGroups.get(group) || 0) + 1);
    });

    const significantLevels = Array.from(priceGroups.entries())
      .filter(([price, count]) => count >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      resistance: significantLevels.filter(([price]) => price > this.getCurrentPrice()),
      support: significantLevels.filter(([price]) => price < this.getCurrentPrice())
    };
  }

  getCurrentPrice() {
    return this.priceHistory.length > 0 
      ? this.priceHistory[this.priceHistory.length - 1].price 
      : 0;
  }

  analyzeVolatility(period = 20) {
    if (this.priceHistory.length < period) return null;

    const recentData = this.priceHistory.slice(-period);
    const prices = recentData.map(p => p.price);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance);

    return {
      period,
      mean: mean.toFixed(2),
      volatility: volatility.toFixed(2),
      volatilityPercent: ((volatility / mean) * 100).toFixed(2)
    };
  }
}

// Ví dụ sử dụng
const trading = new TradingSystem();

// Thêm dữ liệu giá (giả lập)
const baseTime = Date.now();
const basePrice = 100000; // 100k VND

for (let i = 0; i < 100; i++) {
  const timestamp = baseTime + i * 60000; // Mỗi phút
  const price = basePrice + Math.sin(i * 0.1) * 5000 + (Math.random() - 0.5) * 2000;
  const volume = Math.floor(Math.random() * 1000) + 100;
  trading.addPriceData(timestamp, price, volume);
}

console.log('=== Hệ thống Trading ===');
console.log('Giá hiện tại:', trading.getCurrentPrice().toFixed(0));
console.log('Moving Average (20):', trading.calculateMovingAverage(20).toFixed(0));
console.log('Volatility Analysis:', trading.analyzeVolatility(20));

const nearestTo105k = trading.findNearestPrice(105000);
console.log('Giá gần 105k nhất:', nearestTo105k);
```

### 3. Hệ thống e-commerce và inventory

```javascript
class ECommerceSystem {
  constructor() {
    this.products = []; // Sorted by various fields
    this.sales = []; // Sorted by timestamp
    this.customers = []; // Sorted by ID
  }

  addProduct(product) {
    // Maintain sorted order by product ID
    const insertPos = binarySearchInsertPosition(
      this.products.map(p => p.id), 
      product.id
    );
    this.products.splice(insertPos, 0, product);
  }

  findProductById(productId) {
    const result = binarySearchObject(this.products, productId, 'id');
    return result.found ? result.object : null;
  }

  searchProductsByPrice(minPrice, maxPrice) {
    // Sort by price temporarily
    const priceSorted = [...this.products].sort((a, b) => a.price - b.price);
    
    const startPos = binarySearchInsertPosition(
      priceSorted.map(p => p.price), 
      minPrice
    );
    const endPos = binarySearchInsertPosition(
      priceSorted.map(p => p.price), 
      maxPrice + 0.01
    );
    
    return priceSorted.slice(startPos, endPos);
  }

  findProductsByCategory(category) {
    // Binary search after sorting by category
    const categorySorted = [...this.products].sort((a, b) => a.category.localeCompare(b.category));
    
    const first = lowerBound(categorySorted.map(p => p.category), category);
    const last = upperBound(categorySorted.map(p => p.category), category);
    
    return categorySorted.slice(first, last);
  }

  findLowStockProducts(threshold = 10) {
    // Find products with stock below threshold
    const stockSorted = [...this.products].sort((a, b) => a.stock - b.stock);
    
    const pos = upperBound(stockSorted.map(p => p.stock), threshold);
    return stockSorted.slice(0, pos);
  }

  addSale(sale) {
    const insertPos = binarySearchInsertPosition(
      this.sales.map(s => s.timestamp), 
      sale.timestamp
    );
    this.sales.splice(insertPos, 0, sale);
  }

  getSalesInPeriod(startTime, endTime) {
    const startPos = binarySearchInsertPosition(
      this.sales.map(s => s.timestamp), 
      startTime
    );
    const endPos = binarySearchInsertPosition(
      this.sales.map(s => s.timestamp), 
      endTime + 1
    );
    
    return this.sales.slice(startPos, endPos);
  }

  getTopSellingProducts(period = 30 * 24 * 60 * 60 * 1000) { // 30 days
    const cutoffTime = Date.now() - period;
    const recentSales = this.getSalesInPeriod(cutoffTime, Date.now());
    
    const productSales = new Map();
    recentSales.forEach(sale => {
      sale.items.forEach(item => {
        const current = productSales.get(item.productId) || 0;
        productSales.set(item.productId, current + item.quantity);
      });
    });

    return Array.from(productSales.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([productId, quantity]) => ({
        product: this.findProductById(productId),
        soldQuantity: quantity
      }));
  }

  getInventoryValue() {
    return this.products.reduce((total, product) => {
      return total + (product.price * product.stock);
    }, 0);
  }

  findSimilarPriceProducts(targetPrice, tolerance = 0.1) {
    const toleranceAmount = targetPrice * tolerance;
    return this.searchProductsByPrice(
      targetPrice - toleranceAmount, 
      targetPrice + toleranceAmount
    );
  }

  analyzeCustomerPurchasePattern(customerId) {
    const customerSales = this.sales.filter(sale => 
      sale.customerId === customerId
    );

    if (customerSales.length === 0) return null;

    const totalSpent = customerSales.reduce((sum, sale) => sum + sale.total, 0);
    const avgOrderValue = totalSpent / customerSales.length;
    
    const productFrequency = new Map();
    customerSales.forEach(sale => {
      sale.items.forEach(item => {
        const current = productFrequency.get(item.productId) || 0;
        productFrequency.set(item.productId, current + item.quantity);
      });
    });

    const favoriteProducts = Array.from(productFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([productId, quantity]) => ({
        product: this.findProductById(productId),
        purchaseCount: quantity
      }));

    return {
      totalOrders: customerSales.length,
      totalSpent: totalSpent.toFixed(2),
      avgOrderValue: avgOrderValue.toFixed(2),
      favoriteProducts,
      firstPurchase: new Date(customerSales[0].timestamp).toLocaleDateString(),
      lastPurchase: new Date(customerSales[customerSales.length - 1].timestamp).toLocaleDateString()
    };
  }
}

// Ví dụ sử dụng
const ecommerce = new ECommerceSystem();

// Thêm sản phẩm
ecommerce.addProduct({ id: 1001, name: 'Laptop Gaming', category: 'Electronics', price: 25000000, stock: 15 });
ecommerce.addProduct({ id: 1002, name: 'Mouse Gaming', category: 'Electronics', price: 1500000, stock: 50 });
ecommerce.addProduct({ id: 1003, name: 'Áo Polo', category: 'Fashion', price: 500000, stock: 5 });
ecommerce.addProduct({ id: 1004, name: 'Giày Sneaker', category: 'Fashion', price: 2000000, stock: 20 });
ecommerce.addProduct({ id: 1005, name: 'Sách Lập Trình', category: 'Books', price: 300000, stock: 30 });

// Thêm dữ liệu bán hàng
const sampleSales = [
  {
    id: 'S001',
    customerId: 'C001',
    timestamp: Date.now() - 86400000, // 1 day ago
    items: [{ productId: 1001, quantity: 1 }, { productId: 1002, quantity: 2 }],
    total: 28000000
  },
  {
    id: 'S002',
    customerId: 'C002',
    timestamp: Date.now() - 172800000, // 2 days ago
    items: [{ productId: 1003, quantity: 3 }, { productId: 1004, quantity: 1 }],
    total: 3500000
  }
];

sampleSales.forEach(sale => ecommerce.addSale(sale));

console.log('=== Hệ thống E-commerce ===');
console.log('Sản phẩm có giá 1-3 triệu:', ecommerce.searchProductsByPrice(1000000, 3000000));
console.log('Sản phẩm Electronics:', ecommerce.findProductsByCategory('Electronics'));
console.log('Sản phẩm sắp hết hàng:', ecommerce.findLowStockProducts(10));
console.log('Tổng giá trị kho:', ecommerce.getInventoryValue().toLocaleString('vi-VN'));
console.log('Top sản phẩm bán chạy:', ecommerce.getTopSellingProducts());
```

## So sánh với các thuật toán tìm kiếm khác

| Thuật toán | Tốt nhất | Trung bình | Xấu nhất | Bộ nhớ | Yêu cầu | Phù hợp |
|------------|----------|------------|----------|---------|---------|---------|
| **Binary Search** | O(1) | O(log n) | O(log n) | O(1) | Sắp xếp, Random access | Tìm kiếm nhanh, dữ liệu lớn |
| **Linear Search** | O(1) | O(n) | O(n) | O(1) | Không | Mảng nhỏ, chưa sắp xếp |
| **Jump Search** | O(1) | O(√n) | O(√n) | O(1) | Sắp xếp | Sequential access tốt |
| **Interpolation Search** | O(1) | O(log log n) | O(n) | O(1) | Sắp xếp, phân bố đều | Dữ liệu số phân bố đều |
| **Exponential Search** | O(1) | O(log n) | O(log n) | O(1) | Sắp xếp | Không biết kích thước |
| **Hash Table** | O(1) | O(1) | O(n) | O(n) | Hash function | Tìm kiếm nhiều lần |

## Phân tích độ phức tạp

### Độ phức tạp thời gian:
- **Tốt nhất**: O(1) - phần tử ở giữa mảng
- **Trung bình**: O(log n) - chia đôi không gian tìm kiếm
- **Xấu nhất**: O(log n) - vẫn chỉ cần log n phép so sánh

### Độ phức tạp không gian:
- **Iterative**: O(1) - chỉ dùng vài biến
- **Recursive**: O(log n) - stack depth

### Phân tích toán học chi tiết:
```
Số phép so sánh tối đa: ⌊log₂(n)⌋ + 1

Ví dụ với n = 1000:
log₂(1000) ≈ 9.97
Tối đa 10 phép so sánh

So sánh với Linear Search:
- Binary: 10 phép so sánh
- Linear: 1000 phép so sánh (worst case)
- Tăng tốc: 100x

Với n = 1,000,000:
- Binary: 20 phép so sánh
- Linear: 1,000,000 phép so sánh
- Tăng tốc: 50,000x
```

## Khi nào nên sử dụng Binary Search

### Nên sử dụng khi:
- **Dữ liệu đã sắp xếp** hoặc có thể sắp xếp hiệu quả
- **Tìm kiếm thường xuyên** trong cùng dataset
- **Dữ liệu lớn** (> 100 phần tử)
- **Random access** hiệu quả (arrays, not linked lists)
- **Cần hiệu suất cao** và predictable

### Không nên sử dụng khi:
- **Dữ liệu chưa sắp xếp** và cost sắp xếp > benefit
- **Dữ liệu thay đổi thường xuyên** (insert/delete nhiều)
- **Tìm kiếm ít** (< 10 lần) trên dataset
- **Mảng rất nhỏ** (< 10 phần tử)
- **Chỉ có sequential access** (linked lists)

## Tối ưu hóa và cải tiến

### 1. Ternary Search

```javascript
function ternarySearch(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  // Chia thành 3 phần
  const mid1 = left + Math.floor((right - left) / 3);
  const mid2 = right - Math.floor((right - left) / 3);

  if (arr[mid1] === target) return mid1;
  if (arr[mid2] === target) return mid2;

  if (target < arr[mid1]) {
    return ternarySearch(arr, target, left, mid1 - 1);
  } else if (target > arr[mid2]) {
    return ternarySearch(arr, target, mid2 + 1, right);
  } else {
    return ternarySearch(arr, target, mid1 + 1, mid2 - 1);
  }
}
```

### 2. Fibonacci Search

```javascript
function fibonacciSearch(arr, target) {
  const n = arr.length;
  
  // Tìm số Fibonacci >= n
  let fib2 = 0; // (m-2)th Fibonacci number
  let fib1 = 1; // (m-1)th Fibonacci number  
  let fib = fib2 + fib1; // mth Fibonacci number

  while (fib < n) {
    fib2 = fib1;
    fib1 = fib;
    fib = fib2 + fib1;
  }

  let offset = -1;

  while (fib > 1) {
    const i = Math.min(offset + fib2, n - 1);

    if (arr[i] < target) {
      fib = fib1;
      fib1 = fib2;
      fib2 = fib - fib1;
      offset = i;
    } else if (arr[i] > target) {
      fib = fib2;
      fib1 = fib1 - fib2;
      fib2 = fib - fib1;
    } else {
      return i;
    }
  }

  if (fib1 && offset + 1 < n && arr[offset + 1] === target) {
    return offset + 1;
  }

  return -1;
}
```

### 3. Adaptive Binary Search

```javascript
class AdaptiveBinarySearch {
  constructor() {
    this.searchHistory = [];
    this.patterns = new Map();
  }

  search(arr, target) {
    // Phân tích pattern từ lịch sử
    const pattern = this.analyzeSearchPattern(target);
    
    let left = 0;
    let right = arr.length - 1;
    
    // Điều chỉnh starting point dựa trên pattern
    if (pattern) {
      const predictedIndex = Math.floor(pattern.avgPosition * arr.length);
      if (arr[predictedIndex] === target) {
        this.recordSearch(target, predictedIndex, 1);
        return predictedIndex;
      }
      
      // Adjust search space based on prediction
      if (arr[predictedIndex] < target) {
        left = predictedIndex + 1;
      } else {
        right = predictedIndex - 1;
      }
    }

    let comparisons = pattern ? 1 : 0;
    
    // Standard binary search
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      comparisons++;

      if (arr[mid] === target) {
        this.recordSearch(target, mid, comparisons);
        return mid;
      }

      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    this.recordSearch(target, -1, comparisons);
    return -1;
  }

  analyzeSearchPattern(target) {
    const relatedSearches = this.searchHistory.filter(search => 
      Math.abs(search.target - target) <= target * 0.1 // 10% similarity
    );

    if (relatedSearches.length < 3) return null;

    const avgPosition = relatedSearches
      .filter(s => s.found)
      .reduce((sum, s) => sum + s.normalizedPosition, 0) / relatedSearches.length;

    return { avgPosition, confidence: relatedSearches.length / 10 };
  }

  recordSearch(target, index, comparisons) {
    this.searchHistory.push({
      target,
      index,
      found: index !== -1,
      comparisons,
      normalizedPosition: index !== -1 ? index / this.lastArrayLength : 0,
      timestamp: Date.now()
    });

    // Keep only recent 1000 searches
    if (this.searchHistory.length > 1000) {
      this.searchHistory.shift();
    }
  }

  getEfficiencyStats() {
    if (this.searchHistory.length === 0) return null;

    const avgComparisons = this.searchHistory.reduce(
      (sum, search) => sum + search.comparisons, 0
    ) / this.searchHistory.length;

    const successRate = this.searchHistory.filter(s => s.found).length / this.searchHistory.length;

    return {
      totalSearches: this.searchHistory.length,
      avgComparisons: avgComparisons.toFixed(2),
      successRate: (successRate * 100).toFixed(1) + '%',
      theoreticalOptimal: Math.log2(this.lastArrayLength || 1000).toFixed(2)
    };
  }
}
```

## 🏆 Bài tập thực hành

### Bài tập 1: Tìm kiếm vị trí chèn số
**Đề bài**: Cho một mảng số nguyên đã sắp xếp tăng dần và một số target. Viết hàm tìm vị trí mà target nên được chèn vào để duy trì thứ tự sắp xếp. Nếu target đã tồn tại, trả về vị trí đầu tiên của nó.

**Input**: 
- `arr = [1, 3, 5, 6, 8, 10]`
- `target = 5` → Output: `2`
- `target = 2` → Output: `1` 
- `target = 7` → Output: `4`

**Phân tích**:
- Đây là bài toán Lower Bound - tìm vị trí đầu tiên mà `arr[i] >= target`
- Sử dụng Binary Search với điều kiện khác thường: `left < right` thay vì `left <= right`
- Khi `arr[mid] < target`, ta cần tìm bên phải: `left = mid + 1`
- Khi `arr[mid] >= target`, vị trí có thể là mid hoặc bên trái: `right = mid`

**Giải pháp**:
```javascript
function searchInsertPosition(arr, target) {
  let left = 0;
  let right = arr.length;
  
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    
    if (arr[mid] < target) {
      left = mid + 1; // Target lớn hơn, tìm bên phải
    } else {
      right = mid; // Target <= arr[mid], mid có thể là đáp án
    }
  }
  
  return left; // Vị trí chèn
}

// Test với các ví dụ
console.log('=== Bài tập 1: Tìm vị trí chèn ===');
const sortedArray = [1, 3, 5, 6, 8, 10];
console.log('Mảng:', sortedArray);

console.log('Chèn 5 tại vị trí:', searchInsertPosition(sortedArray, 5)); // 2
console.log('Chèn 2 tại vị trí:', searchInsertPosition(sortedArray, 2)); // 1
console.log('Chèn 7 tại vị trí:', searchInsertPosition(sortedArray, 7)); // 4
console.log('Chèn 0 tại vị trí:', searchInsertPosition(sortedArray, 0)); // 0
console.log('Chèn 11 tại vị trí:', searchInsertPosition(sortedArray, 11)); // 6

// Kiểm tra tính đúng đắn
function verifyInsertPosition(arr, target) {
  const pos = searchInsertPosition(arr, target);
  const newArr = [...arr];
  newArr.splice(pos, 0, target);
  
  // Kiểm tra mảng còn sắp xếp không
  const isSorted = newArr.every((val, i) => i === 0 || newArr[i-1] <= val);
  
  console.log(`Chèn ${target} vào vị trí ${pos}: [${newArr.join(', ')}] - ${isSorted ? '✅' : '❌'}`);
}

verifyInsertPosition(sortedArray, 7);
verifyInsertPosition(sortedArray, 2);
```

**Độ phức tạp**:
- **Thời gian**: O(log n) - chia đôi không gian tìm kiếm mỗi lần
- **Không gian**: O(1) - chỉ sử dụng vài biến

\---

### Bài tập 2: Tìm phần tử đầu tiên và cuối cùng
**Đề bài**: Cho một mảng số nguyên đã sắp xếp có thể chứa phần tử trùng lặp và một số target. Tìm vị trí đầu tiên và cuối cùng của target trong mảng. Nếu target không tồn tại, trả về `[-1, -1]`.

**Input**: 
- `arr = [5, 7, 7, 8, 8, 8, 10]`, `target = 8` → Output: `[3, 5]`
- `arr = [5, 7, 7, 8, 8, 8, 10]`, `target = 6` → Output: `[-1, -1]`
- `arr = [1]`, `target = 1` → Output: `[0, 0]`

**Phân tích**:
- Cần tìm 2 vị trí: đầu tiên (Lower Bound) và cuối cùng (Upper Bound - 1)
- Sử dụng 2 Binary Search riêng biệt cho hiệu quả tối ưu
- Lower Bound: vị trí đầu tiên mà `arr[i] >= target`
- Upper Bound: vị trí đầu tiên mà `arr[i] > target`

**Giải pháp**:
```javascript
function findFirstAndLastPosition(arr, target) {
  // Tìm vị trí đầu tiên (Lower Bound)
  function findFirst(arr, target) {
    let left = 0;
    let right = arr.length;
    
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      
      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    return left;
  }
  
  // Tìm vị trí sau cuối cùng (Upper Bound)  
  function findLast(arr, target) {
    let left = 0;
    let right = arr.length;
    
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      
      if (arr[mid] <= target) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    return left - 1; // Vị trí cuối cùng của target
  }
  
  const first = findFirst(arr, target);
  
  // Kiểm tra target có tồn tại không
  if (first >= arr.length || arr[first] !== target) {
    return [-1, -1];
  }
  
  const last = findLast(arr, target);
  return [first, last];
}

// Hàm đếm số lần xuất hiện
function countOccurrences(arr, target) {
  const [first, last] = findFirstAndLastPosition(arr, target);
  return first === -1 ? 0 : last - first + 1;
}

// Test với các ví dụ
console.log('\n=== Bài tập 2: Tìm vị trí đầu-cuối ===');
const duplicateArray = [5, 7, 7, 8, 8, 8, 10];
console.log('Mảng:', duplicateArray);

console.log('Range của 8:', findFirstAndLastPosition(duplicateArray, 8)); // [3, 5]
console.log('Range của 7:', findFirstAndLastPosition(duplicateArray, 7)); // [1, 2]  
console.log('Range của 6:', findFirstAndLastPosition(duplicateArray, 6)); // [-1, -1]
console.log('Range của 5:', findFirstAndLastPosition(duplicateArray, 5)); // [0, 0]
console.log('Range của 10:', findFirstAndLastPosition(duplicateArray, 10)); // [6, 6]

// Test đếm số lần xuất hiện
console.log('\n--- Đếm số lần xuất hiện ---');
console.log('Số 8 xuất hiện:', countOccurrences(duplicateArray, 8), 'lần'); // 3
console.log('Số 7 xuất hiện:', countOccurrences(duplicateArray, 7), 'lần'); // 2
console.log('Số 6 xuất hiện:', countOccurrences(duplicateArray, 6), 'lần'); // 0

// Phân tích hiệu suất so với Linear Search
function comparePerformance(arr, target) {
  console.log(`\n--- So sánh hiệu suất tìm range của ${target} ---`);
  
  // Binary Search approach
  const binaryStart = performance.now();
  const binaryResult = findFirstAndLastPosition(arr, target);
  const binaryTime = performance.now() - binaryStart;
  
  // Linear Search approach
  const linearStart = performance.now();
  let firstLinear = -1, lastLinear = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      if (firstLinear === -1) firstLinear = i;
      lastLinear = i;
    }
  }
  const linearResult = firstLinear === -1 ? [-1, -1] : [firstLinear, lastLinear];
  const linearTime = performance.now() - linearStart;
  
  console.log(`Binary Search: ${binaryResult} (${binaryTime.toFixed(4)}ms)`);
  console.log(`Linear Search: ${linearResult} (${linearTime.toFixed(4)}ms)`);
  console.log(`Tăng tốc: ${(linearTime / binaryTime).toFixed(1)}x`);
  console.log(`Độ phức tạp: O(log n) vs O(n)`);
}

comparePerformance(duplicateArray, 8);
```

**Độ phức tạp**:
- **Thời gian**: O(log n) - 2 lần Binary Search độc lập
- **Không gian**: O(1) - không sử dụng bộ nhớ bổ sung

**Ứng dụng thực tế**:
- Đếm số lần xuất hiện của phần tử trong mảng sắp xếp
- Tìm khoảng giá trị trong database đã index
- Phân tích dữ liệu thống kê với time series

\---

## 🔑 Điểm quan trọng cần nhớ

### Khái niệm cốt lõi
1. **Nguyên lý chia để trị**: Liên tục chia đôi không gian tìm kiếm cho đến khi tìm thấy hoặc không còn gì để tìm
2. **Độ phức tạp O(log n)**: Hiệu suất vượt trội so với tìm kiếm tuyến tính, đặc biệt với dữ liệu lớn
3. **Điều kiện tiên quyết**: Dữ liệu phải được sắp xếp trước khi áp dụng Binary Search
4. **Tính deterministic**: Luôn cho kết quả nhất quán và dự đoán được

### Lỗi thường gặp và cách tránh
1. **Integer Overflow**: 
   - ❌ `mid = (left + right) / 2` 
   - ✅ `mid = left + (right - left) / 2`

2. **Điều kiện dừng sai**:
   - ❌ Sử dụng `left < right` khi cần `left <= right`
   - ✅ Hiểu rõ khi nào dùng từng loại

3. **Cập nhật biên sai**:
   - ❌ `left = mid` hoặc `right = mid` trong trường hợp không phù hợp
   - ✅ `left = mid + 1` khi loại bỏ mid, `right = mid` khi mid có thể là đáp án

4. **Quên xử lý trường hợp đặc biệt**:
   - ❌ Không kiểm tra mảng rỗng
   - ✅ Luôn validate input trước khi tìm kiếm

### Các biến thể quan trọng
- **Lower Bound**: Tìm vị trí đầu tiên `>= target`
- **Upper Bound**: Tìm vị trí đầu tiên `> target`  
- **Range Search**: Kết hợp Lower và Upper Bound
- **Rotated Array**: Xử lý mảng bị xoay vòng
- **Peak Finding**: Tìm local maximum

### Khi nào nên sử dụng
- ✅ Dữ liệu đã sắp xếp hoặc có thể sắp xếp hiệu quả
- ✅ Cần tìm kiếm nhiều lần trên cùng dataset  
- ✅ Dữ liệu lớn (> 100 phần tử)
- ✅ Cần hiệu suất cao và predictable
- ❌ Dữ liệu nhỏ (< 10 phần tử) - Linear Search đơn giản hơn
- ❌ Dữ liệu thay đổi liên tục - chi phí maintain sort cao

\---

## 📝 Bài tập về nhà

### Bài tập 1: Hệ thống quản lý điểm thi (Khó: ⭐⭐⭐)
**Yêu cầu**: Xây dựng hệ thống quản lý điểm thi cho trường học với các chức năng:
1. Thêm điểm mới và tự động duy trì thứ tự sắp xếp
2. Tìm học sinh có điểm cụ thể  
3. Đếm số học sinh trong khoảng điểm (ví dụ: 8.0-9.0)
4. Tìm thứ hạng của một điểm số
5. Thống kê phân bố điểm theo từng loại (Giỏi, Khá, Trung bình, Yếu)

**Cấu trúc dữ liệu**:
```javascript
const students = [
  { id: 'SV001', name: 'Nguyễn An', score: 8.5 },
  { id: 'SV002', name: 'Trần Bình', score: 7.2 },
  // ... more students
];
```

**Gợi ý**: 
- Sử dụng Lower Bound và Upper Bound để tìm khoảng điểm
- Kết hợp Binary Search với các phép insert để maintain sorted order
- Implement ranking system dựa trên vị trí trong mảng đã sắp xếp

### Bài tập 2: Thuật toán tối ưu tìm kiếm thông minh (Khó: ⭐⭐⭐⭐)
**Yêu cầu**: Phát triển một thuật toán Binary Search "thông minh" có khả năng học từ pattern tìm kiếm trước đó để tối ưu hiệu suất:
1. Ghi nhận lịch sử tìm kiếm (target values và vị trí tìm thấy)
2. Phân tích pattern và dự đoán vị trí khởi đầu tối ưu cho lần tìm kiếm mới
3. So sánh hiệu suất với Binary Search chuẩn
4. Implement adaptive strategy điều chỉnh dự đoán theo thời gian

**Thách thức bổ sung**:
- Xử lý multiple data distributions (uniform, normal, skewed)
- Implement cache cho frequently searched values
- Tối ưu cho các pattern tìm kiếm sequential (1, 2, 3,... hoặc 100, 99, 98,...)

**Gợi ý**:
- Sử dụng moving averages để track search patterns
- Implement confidence scoring cho predictions
- Test với different datasets để validate effectiveness

\---

## Tài liệu tham khảo

- [Wikipedia - Binary Search Algorithm](https://en.wikipedia.org/wiki/Binary_search_algorithm)
- [Khan Academy - Binary Search](https://www.khanacademy.org/computing/computer-science/algorithms/binary-search/a/binary-search)
- [GeeksforGeeks - Binary Search](https://www.geeksforgeeks.org/binary-search/)
- [MIT OpenCourseWare - Binary Search](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/)
- [YouTube - Binary Search Algorithm](https://www.youtube.com/watch?v=P3YID7liBug)
- [LeetCode - Binary Search Problems](https://leetcode.com/tag/binary-search/)
- [Algorithm Visualizer - Binary Search](https://algorithm-visualizer.org/divide-and-conquer/binary-search)
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)

---

*Post ID: 01ui5gg3n6zqroo*  
*Category: Searches Algorithms*  
*Created: 22/8/2025*  
*Updated: 29/8/2025*
