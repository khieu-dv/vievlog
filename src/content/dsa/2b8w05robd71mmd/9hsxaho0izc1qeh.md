---
title: "Thuật toán sắp xếp Shell (Shell Sort)"
postId: "9hsxaho0izc1qeh"
category: "Sorting Algorithms"
created: "21/8/2025"
updated: "29/8/2025"
---

# Thuật toán sắp xếp Shell (Shell Sort)



Shell Sort, còn được gọi là Shell's method, là một thuật toán sắp xếp so sánh tại chỗ được phát triển bởi Donald Shell vào năm 1959. Đây có thể được xem như một cải tiến của Insertion Sort bằng cách cho phép trao đổi các phần tử ở xa nhau, sau đó dần dần giảm khoảng cách (gap) giữa các phần tử được so sánh.

## Nguyên lý hoạt động

Shell Sort hoạt động bằng cách chia mảng thành các nhóm con dựa trên một khoảng cách (gap) cụ thể, sau đó áp dụng Insertion Sort cho từng nhóm. Khoảng cách này được giảm dần cho đến khi bằng 1, và cuối cùng thực hiện một lần Insertion Sort hoàn chỉnh.

![Shell Sort Animation](https://upload.wikimedia.org/wikipedia/commons/d/d8/Sorting_shellsort_anim.gif)

### Các bước thực hiện:

1. **Chọn khoảng cách ban đầu**: Thường là n/2 (n là kích thước mảng)
2. **Tạo các nhóm con**: Chia mảng thành các nhóm con dựa trên khoảng cách
3. **Sắp xếp từng nhóm**: Áp dụng Insertion Sort cho từng nhóm con
4. **Giảm khoảng cách**: Chia đôi khoảng cách hiện tại
5. **Lặp lại**: Tiếp tục cho đến khi khoảng cách = 1

## Ưu điểm và nhược điểm

### Ưu điểm:
- **Hiệu quả hơn Insertion Sort**: Đặc biệt với mảng lớn
- **Sắp xếp tại chỗ**: Chỉ cần O(1) bộ nhớ bổ sung
- **Đơn giản triển khai**: Code ngắn gọn và dễ hiểu
- **Hiệu suất thực tế tốt**: Thường nhanh hơn các thuật toán O(n²) khác
- **Thích ứng**: Hiệu suất tốt với dữ liệu gần như đã sắp xếp

### Nhược điểm:
- **Không ổn định**: Không bảo toàn thứ tự tương đối của các phần tử bằng nhau
- **Phụ thuộc gap sequence**: Hiệu suất phụ thuộc nhiều vào cách chọn khoảng cách
- **Phân tích phức tạp**: Khó phân tích độ phức tạp chính xác
- **Không tối ưu**: Vẫn chậm hơn các thuật toán O(n log n)

## Triển khai trong JavaScript

### Triển khai cơ bản

```javascript
class ShellSort extends Sort {
  sort(originalArray) {
    // Sao chép mảng gốc để tránh thay đổi
    const array = [...originalArray];

    // Xác định khoảng cách ban đầu
    let gap = Math.floor(array.length / 2);

    // Tiếp tục cho đến khi gap > 0
    while (gap > 0) {
      // So sánh và hoán đổi các cặp phần tử cách xa
      for (let i = 0; i < (array.length - gap); i += 1) {
        let currentIndex = i;
        let gapShiftedIndex = i + gap;

        while (currentIndex >= 0) {
          // So sánh và hoán đổi nếu cần
          if (this.comparator.lessThan(array[gapShiftedIndex], array[currentIndex])) {
            const tmp = array[currentIndex];
            array[currentIndex] = array[gapShiftedIndex];
            array[gapShiftedIndex] = tmp;
          }

          gapShiftedIndex = currentIndex;
          currentIndex -= gap;
        }
      }

      // Giảm khoảng cách
      gap = Math.floor(gap / 2);
    }

    return array;
  }
}
```

### Triển khai với gap sequence tùy chỉnh

```javascript
class ShellSortAdvanced extends Sort {
  // Shell's original sequence: n/2, n/4, n/8, ..., 1
  generateShellSequence(n) {
    const sequence = [];
    let gap = Math.floor(n / 2);
    while (gap > 0) {
      sequence.push(gap);
      gap = Math.floor(gap / 2);
    }
    return sequence;
  }

  // Knuth's sequence: 1, 4, 13, 40, 121, ...
  generateKnuthSequence(n) {
    const sequence = [];
    let gap = 1;
    while (gap < n) {
      sequence.push(gap);
      gap = gap * 3 + 1;
    }
    return sequence.reverse();
  }

  // Sedgewick's sequence
  generateSedgewickSequence(n) {
    const sequence = [];
    let i = 0;
    while (true) {
      let gap;
      if (i % 2 === 0) {
        gap = 9 * Math.pow(2, i) - 9 * Math.pow(2, i / 2) + 1;
      } else {
        gap = 8 * Math.pow(2, i) - 6 * Math.pow(2, (i + 1) / 2) + 1;
      }
      if (gap >= n) break;
      sequence.push(gap);
      i++;
    }
    return sequence.reverse();
  }

  sort(originalArray, sequenceType = 'shell') {
    const array = [...originalArray];
    let gapSequence;

    switch (sequenceType) {
      case 'knuth':
        gapSequence = this.generateKnuthSequence(array.length);
        break;
      case 'sedgewick':
        gapSequence = this.generateSedgewickSequence(array.length);
        break;
      default:
        gapSequence = this.generateShellSequence(array.length);
    }

    for (const gap of gapSequence) {
      for (let i = gap; i < array.length; i++) {
        const temp = array[i];
        let j = i;

        while (j >= gap && this.comparator.greaterThan(array[j - gap], temp)) {
          array[j] = array[j - gap];
          j -= gap;
        }
        array[j] = temp;
      }
    }

    return array;
  }
}
```

## Ví dụ thực tế

### Ví dụ 1: Sắp xếp mảng số với gap = 4, 2, 1

```javascript
const numbers = [35, 33, 42, 10, 14, 19, 27, 44];
console.log('Mảng ban đầu:', numbers);
// [35, 33, 42, 10, 14, 19, 27, 44]

// Bước 1: gap = 4
// Các nhóm: [35,14], [33,19], [42,27], [10,44]
// Sau sắp xếp: [14, 19, 27, 10, 35, 33, 42, 44]

// Bước 2: gap = 2  
// Các nhóm: [14,27,35,42], [19,10,33,44]
// Sau sắp xếp: [14, 10, 27, 19, 35, 33, 42, 44]

// Bước 3: gap = 1
// Insertion sort cuối cùng: [10, 14, 19, 27, 33, 35, 42, 44]

const shellSort = new ShellSort();
const sortedNumbers = shellSort.sort(numbers);
console.log('Mảng đã sắp xếp:', sortedNumbers);
// [10, 14, 19, 27, 33, 35, 42, 44]
```

### Ví dụ 2: So sánh các gap sequence

```javascript
const testArray = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42];
const shellSort = new ShellSortAdvanced();

console.log('Shell sequence:', shellSort.sort([...testArray], 'shell'));
console.log('Knuth sequence:', shellSort.sort([...testArray], 'knuth'));
console.log('Sedgewick sequence:', shellSort.sort([...testArray], 'sedgewick'));
```

### Ví dụ 3: Sắp xếp đối tượng sinh viên

```javascript
const students = [
  { name: 'Hoa', score: 85, id: 3 },
  { name: 'An', score: 92, id: 1 },
  { name: 'Bình', score: 78, id: 4 },
  { name: 'Chi', score: 91, id: 2 },
  { name: 'Dũng', score: 88, id: 5 }
];

const shellSort = new ShellSort({
  compareFunction: (a, b) => {
    if (a.score < b.score) return -1;
    if (a.score > b.score) return 1;
    return 0;
  }
});

const sortedStudents = shellSort.sort(students);
console.log('Sinh viên sắp xếp theo điểm:', sortedStudents);
```

## Các dãy khoảng cách (Gap Sequences)

### 1. Shell's Original (n/2^k)
```javascript
const gaps = [8, 4, 2, 1]; // cho mảng 16 phần tử
```
- **Đơn giản**: Dễ tính toán
- **Hiệu suất**: Trung bình, độ phức tạp O(n²)

### 2. Knuth's Sequence (3k+1)/2
```javascript
const gaps = [13, 4, 1]; // 1, 4, 13, 40, 121, ...
```
- **Hiệu suất tốt hơn**: O(n^1.5)
- **Phổ biến**: Được sử dụng rộng rãi

### 3. Sedgewick's Sequence
```javascript
const gaps = [15, 5, 1]; // 1, 5, 19, 41, 109, ...
```
- **Tối ưu hơn**: Hiệu suất lý thuyết tốt
- **Phức tạp**: Khó tính toán

### 4. Ciura's Sequence
```javascript
const gaps = [23, 10, 4, 1]; // 1, 4, 10, 23, 57, 132, ...
```
- **Thực nghiệm**: Dựa trên thử nghiệm thực tế
- **Hiệu suất cao**: Cho mảng cỡ vừa

## Minh họa từng bước

### Ví dụ chi tiết với mảng [35, 33, 42, 10, 14, 19, 27, 44]

#### Bước 1: Gap = 4
```
Chỉ số:  0   1   2   3   4   5   6   7
Mảng:   35  33  42  10  14  19  27  44
Gap=4:  |---|---|---|---|
Nhóm 1: 35 ↔ 14  →  14 ↔ 35
Nhóm 2: 33 ↔ 19  →  19 ↔ 33  
Nhóm 3: 42 ↔ 27  →  27 ↔ 42
Nhóm 4: 10 ↔ 44  →  10 ↔ 44
Kết quả: [14, 19, 27, 10, 35, 33, 42, 44]
```

#### Bước 2: Gap = 2
```
Chỉ số:  0   1   2   3   4   5   6   7
Mảng:   14  19  27  10  35  33  42  44
Gap=2:  |---|   |---|   |---|   |---|
Nhóm 1: 14, 27, 35, 42  →  [14, 27, 35, 42]
Nhóm 2: 19, 10, 33, 44  →  [10, 19, 33, 44]
Kết quả: [14, 10, 27, 19, 35, 33, 42, 44]
```

#### Bước 3: Gap = 1 (Insertion Sort)
```
[14, 10, 27, 19, 35, 33, 42, 44]
→ [10, 14, 27, 19, 35, 33, 42, 44]
→ [10, 14, 19, 27, 35, 33, 42, 44]
→ [10, 14, 19, 27, 33, 35, 42, 44]
→ [10, 14, 19, 27, 33, 35, 42, 44] (đã sắp xếp)
```

## Tối ưu hóa

### 1. Chọn gap sequence tối ưu
```javascript
// Động: chọn sequence dựa trên kích thước mảng
function chooseOptimalSequence(n) {
  if (n < 100) return 'shell';
  if (n < 1000) return 'knuth';
  return 'sedgewick';
}
```

### 2. Kết hợp với Insertion Sort
```javascript
// Chuyển sang Insertion Sort khi gap = 1
if (gap === 1) {
  return this.insertionSort(array);
}
```

### 3. Early termination
```javascript
// Dừng sớm nếu không có hoán đổi nào
let hasSwapped = false;
// ... logic hoán đổi ...
if (!hasSwapped) break;
```

## Ứng dụng thực tế

### 1. Sắp xếp dữ liệu trung bình
```javascript
// Xử lý danh sách sản phẩm (1000-10000 items)
const products = loadProductCatalog();
const sortedByPrice = shellSort.sort(products, (a, b) => a.price - b.price);
```

### 2. Tiền xử lý cho thuật toán khác
```javascript
// Làm dữ liệu "gần như sắp xếp" trước khi dùng Quick Sort
const preProcessed = shellSort.sort(largeDataset);
const finalSorted = quickSort.sort(preProcessed);
```

### 3. Hệ thống real-time
```javascript
// Sắp xếp nhanh cho dữ liệu đến liên tục
class RealTimeProcessor {
  process(newData) {
    this.buffer.push(...newData);
    if (this.buffer.length > 1000) {
      this.buffer = shellSort.sort(this.buffer);
      this.processBuffer();
    }
  }
}
```

## So sánh với các thuật toán khác

| Thuật toán | Tốt nhất | Trung bình | Xấu nhất | Bộ nhớ | Ổn định | Phù hợp |
|------------|----------|------------|----------|---------|---------|---------|
| **Shell Sort** | n log(n) | n^1.3 | n^2 | 1 | Không | Mảng trung bình |
| **Insertion Sort** | n | n² | n² | 1 | Có | Mảng nhỏ |
| **Quick Sort** | n log(n) | n log(n) | n² | log(n) | Không | Mảng lớn |
| **Merge Sort** | n log(n) | n log(n) | n log(n) | n | Có | Cần ổn định |
| **Heap Sort** | n log(n) | n log(n) | n log(n) | 1 | Không | Đảm bảo hiệu suất |

## Phân tích độ phức tạp

### Độ phức tạp thời gian:
- **Tốt nhất**: O(n log n) với gap sequence tối ưu
- **Trung bình**: Phụ thuộc gap sequence (O(n^1.3) với Knuth)
- **Xấu nhất**: O(n²) với Shell's original sequence

### Độ phức tạp không gian:
- **Luôn luôn**: O(1) - sắp xếp tại chỗ

### Phân tích theo gap sequence:
```
Shell's: O(n²)
Knuth's: O(n^1.5)
Sedgewick's: O(n^1.33)
Ciura's: Thực nghiệm tốt cho n < 4000
```

## Khi nào nên sử dụng Shell Sort

### Nên sử dụng khi:
- **Mảng cỡ trung bình** (100-10,000 phần tử)
- **Bộ nhớ hạn chế** (cần sắp xếp tại chỗ)
- **Code đơn giản** hơn Quick Sort/Merge Sort
- **Hiệu suất ổn định** hơn Quick Sort
- **Dữ liệu gần như đã sắp xếp**

### Không nên sử dụng khi:
- **Mảng rất lớn** (> 100,000 phần tử)
- **Cần tính ổn định** (stable sort)
- **Yêu cầu hiệu suất tối ưu** O(n log n)
- **Mảng rất nhỏ** (< 50 phần tử - dùng Insertion Sort)

## Biến thể và cải tiến

### 1. Parallel Shell Sort
```javascript
class ParallelShellSort {
  async sort(array) {
    const workers = [];
    for (let gap = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
      workers.push(this.sortWithGap(array, gap));
    }
    await Promise.all(workers);
    return array;
  }
}
```

### 2. Adaptive Shell Sort
```javascript
// Thay đổi gap sequence dựa trên độ "disorder" của dữ liệu
function adaptiveGapSequence(array) {
  const disorder = calculateDisorder(array);
  return disorder > 0.7 ? knuthSequence : shellSequence;
}
```

## Tài liệu tham khảo

- [Wikipedia - Shell Sort](https://en.wikipedia.org/wiki/Shellsort)
- [Tutorials Point - Shell Sort](https://www.tutorialspoint.com/data_structures_algorithms/shell_sort_algorithm.htm)
- [YouTube - Shell Sort by Rob Edwards](https://www.youtube.com/watch?v=ddeLSDsYVp8)
- [GeeksforGeeks - Shell Sort](https://www.geeksforgeeks.org/shellsort/)
- [Research on Gap Sequences](https://oeis.org/A000670)

---

*Post ID: 9hsxaho0izc1qeh*  
*Category: Sorting Algorithms*  
*Created: 21/8/2025*  
*Updated: 29/8/2025*
