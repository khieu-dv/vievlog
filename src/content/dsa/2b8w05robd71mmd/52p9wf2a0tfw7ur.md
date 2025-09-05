---
title: "Thuật toán sắp xếp nhanh (Quick Sort)"
postId: "52p9wf2a0tfw7ur"
category: "Sorting Algorithms"
created: "21/8/2025"
updated: "29/8/2025"
---

# Thuật toán sắp xếp nhanh (Quick Sort)


Thuật toán sắp xếp nhanh (Quick Sort) là một thuật toán "chia để trị" (divide and conquer) hiệu quả được phát triển bởi Tony Hoare vào năm 1960. Quick Sort hoạt động bằng cách chọn một phần tử "pivot" từ mảng và phân chia các phần tử khác thành hai mảng con: một mảng chứa các phần tử nhỏ hơn pivot và một mảng chứa các phần tử lớn hơn pivot.

## Nguyên lý hoạt động

Các bước thực hiện Quick Sort:

1. **Chọn pivot**: Chọn một phần tử từ mảng làm pivot (có thể là phần tử đầu, cuối, giữa, hoặc ngẫu nhiên)
2. **Phân hoạch (Partitioning)**: Sắp xếp lại mảng sao cho:
   - Tất cả phần tử nhỏ hơn pivot được đặt trước pivot
   - Tất cả phần tử lớn hơn pivot được đặt sau pivot
   - Pivot đã ở vị trí cuối cùng của nó
3. **Đệ quy**: Áp dụng Quick Sort cho hai mảng con một cách độc lập

![Quick Sort Animation](https://upload.wikimedia.org/wikipedia/commons/6/6a/Sorting_quicksort_anim.gif)

## Ưu điểm và nhược điểm

### Ưu điểm:
- **Hiệu quả cao**: Độ phức tạp trung bình O(n log n)
- **Sắp xếp tại chỗ**: Chỉ cần O(log n) bộ nhớ bổ sung cho stack đệ quy
- **Hiệu suất thực tế tốt**: Thường nhanh hơn các thuật toán O(n log n) khác
- **Linh hoạt**: Có thể tối ưu cho nhiều trường hợp khác nhau

### Nhược điểm:
- **Trường hợp xấu nhất**: O(n²) khi pivot luôn là phần tử nhỏ nhất hoặc lớn nhất
- **Không ổn định**: Không bảo toàn thứ tự tương đối của các phần tử bằng nhau
- **Nhạy cảm với lựa chọn pivot**: Hiệu suất phụ thuộc nhiều vào cách chọn pivot

## Triển khai trong JavaScript

### 1. Quick Sort cơ bản (sử dụng mảng phụ)

```javascript
class QuickSort extends Sort {
  sort(originalArray) {
    // Sao chép mảng gốc để tránh thay đổi
    const array = [...originalArray];

    // Mảng có 1 phần tử hoặc ít hơn đã được sắp xếp
    if (array.length <= 1) {
      return array;
    }

    // Khởi tạo mảng trái và phải
    const leftArray = [];
    const rightArray = [];

    // Lấy phần tử đầu tiên làm pivot
    const pivotElement = array.shift();
    const centerArray = [pivotElement];

    // Phân chia các phần tử vào mảng trái, giữa và phải
    while (array.length) {
      const currentElement = array.shift();

      if (this.comparator.equal(currentElement, pivotElement)) {
        centerArray.push(currentElement);
      } else if (this.comparator.lessThan(currentElement, pivotElement)) {
        leftArray.push(currentElement);
      } else {
        rightArray.push(currentElement);
      }
    }

    // Sắp xếp đệ quy mảng trái và phải
    const leftArraySorted = this.sort(leftArray);
    const rightArraySorted = this.sort(rightArray);

    // Kết hợp các mảng đã sắp xếp
    return leftArraySorted.concat(centerArray, rightArraySorted);
  }
}
```

### 2. Quick Sort tại chỗ (In-place)

```javascript
class QuickSortInPlace extends Sort {
  sort(originalArray, inputLowIndex = 0, inputHighIndex = originalArray.length - 1, recursiveCall = false) {
    // Sao chép mảng ở lần gọi đầu tiên, sau đó sắp xếp tại chỗ
    const array = recursiveCall ? originalArray : [...originalArray];

    const partitionArray = (lowIndex, highIndex) => {
      const swap = (leftIndex, rightIndex) => {
        const temp = array[leftIndex];
        array[leftIndex] = array[rightIndex];
        array[rightIndex] = temp;
      };

      const pivot = array[highIndex];
      let partitionIndex = lowIndex;
      
      for (let currentIndex = lowIndex; currentIndex < highIndex; currentIndex += 1) {
        if (this.comparator.lessThan(array[currentIndex], pivot)) {
          swap(partitionIndex, currentIndex);
          partitionIndex += 1;
        }
      }

      // Đặt pivot vào vị trí cuối cùng của nó
      swap(partitionIndex, highIndex);
      return partitionIndex;
    };

    // Điều kiện dừng khi low và high hội tụ
    if (inputLowIndex < inputHighIndex) {
      const partitionIndex = partitionArray(inputLowIndex, inputHighIndex);
      const RECURSIVE_CALL = true;
      this.sort(array, inputLowIndex, partitionIndex - 1, RECURSIVE_CALL);
      this.sort(array, partitionIndex + 1, inputHighIndex, RECURSIVE_CALL);
    }

    return array;
  }
}
```

## Ví dụ thực tế

### Ví dụ 1: Sắp xếp mảng số
```javascript
const numbers = [64, 34, 25, 12, 22, 11, 90];
const quickSort = new QuickSort();
const sortedNumbers = quickSort.sort(numbers);
console.log(sortedNumbers); // [11, 12, 22, 25, 34, 64, 90]
```

### Ví dụ 2: Sắp xếp chuỗi
```javascript
const names = ['Hoa', 'An', 'Bình', 'Chi', 'Dũng'];
const quickSort = new QuickSort();
const sortedNames = quickSort.sort(names);
console.log(sortedNames); // ['An', 'Bình', 'Chi', 'Dũng', 'Hoa']
```

### Ví dụ 3: Sắp xếp đối tượng
```javascript
const students = [
  { name: 'Hoa', score: 85 },
  { name: 'An', score: 92 },
  { name: 'Bình', score: 78 }
];

const quickSort = new QuickSort({
  compareFunction: (a, b) => {
    if (a.score < b.score) return -1;
    if (a.score > b.score) return 1;
    return 0;
  }
});

const sortedStudents = quickSort.sort(students);
// Kết quả: sắp xếp theo điểm số tăng dần
```

## Các chiến lược chọn pivot

### 1. Pivot đầu tiên
```javascript
const pivot = array[0];
```

### 2. Pivot cuối cùng
```javascript
const pivot = array[array.length - 1];
```

### 3. Pivot giữa
```javascript
const pivot = array[Math.floor(array.length / 2)];
```

### 4. Pivot ngẫu nhiên
```javascript
const randomIndex = Math.floor(Math.random() * array.length);
const pivot = array[randomIndex];
```

### 5. Median-of-three
```javascript
function medianOfThree(array, low, high) {
  const mid = Math.floor((low + high) / 2);
  if (array[mid] < array[low]) swap(array, low, mid);
  if (array[high] < array[low]) swap(array, low, high);
  if (array[high] < array[mid]) swap(array, mid, high);
  return mid;
}
```

## Tối ưu hóa

### 1. Hybrid Quick Sort
Kết hợp với Insertion Sort cho mảng nhỏ:

```javascript
const INSERTION_SORT_THRESHOLD = 10;

if (array.length <= INSERTION_SORT_THRESHOLD) {
  return insertionSort(array);
}
// Tiếp tục với Quick Sort
```

### 2. Tail Recursion Optimization
```javascript
while (inputLowIndex < inputHighIndex) {
  const partitionIndex = partitionArray(inputLowIndex, inputHighIndex);
  
  // Đệ quy cho phần nhỏ hơn, lặp cho phần lớn hơn
  if (partitionIndex - inputLowIndex < inputHighIndex - partitionIndex) {
    this.sort(array, inputLowIndex, partitionIndex - 1, true);
    inputLowIndex = partitionIndex + 1;
  } else {
    this.sort(array, partitionIndex + 1, inputHighIndex, true);
    inputHighIndex = partitionIndex - 1;
  }
}
```

## Ứng dụng thực tế

### 1. Hệ thống quản lý dữ liệu lớn
```javascript
// Sắp xếp hàng triệu bản ghi khách hàng theo ID
const customerRecords = loadMillionCustomers();
const sortedRecords = quickSort.sort(customerRecords);
```

### 2. Xử lý dữ liệu tài chính
```javascript
// Sắp xếp giao dịch theo thời gian
const transactions = getTransactions();
const sortedByTime = quickSort.sort(transactions, (a, b) => a.timestamp - b.timestamp);
```

### 3. Game và đồ họa
```javascript
// Sắp xếp đối tượng theo độ sâu (z-order)
const gameObjects = getVisibleObjects();
const sortedByDepth = quickSort.sort(gameObjects, (a, b) => a.z - b.z);
```

## So sánh với các thuật toán khác

| Thuật toán | Tốt nhất | Trung bình | Xấu nhất | Bộ nhớ | Ổn định |
|------------|----------|------------|----------|---------|---------|
| **Quick Sort** | n log(n) | n log(n) | n² | log(n) | Không |
| **Merge Sort** | n log(n) | n log(n) | n log(n) | n | Có |
| **Heap Sort** | n log(n) | n log(n) | n log(n) | 1 | Không |
| **Bubble Sort** | n | n² | n² | 1 | Có |

## Biến thể của Quick Sort

### 1. 3-Way Quick Sort (Dutch National Flag)
Xử lý hiệu quả mảng có nhiều phần tử trùng lặp:

```javascript
function quickSort3Way(array, low, high) {
  if (low >= high) return;
  
  const [lt, gt] = partition3Way(array, low, high);
  quickSort3Way(array, low, lt - 1);
  quickSort3Way(array, gt + 1, high);
}
```

### 2. Iterative Quick Sort
Sử dụng stack thay vì đệ quy:

```javascript
function quickSortIterative(array) {
  const stack = [[0, array.length - 1]];
  
  while (stack.length > 0) {
    const [low, high] = stack.pop();
    if (low < high) {
      const pivot = partition(array, low, high);
      stack.push([low, pivot - 1]);
      stack.push([pivot + 1, high]);
    }
  }
}
```

## Phân tích độ phức tạp

### Độ phức tạp thời gian:
- **Tốt nhất**: O(n log n) - pivot luôn chia mảng thành hai phần bằng nhau
- **Trung bình**: O(n log n) - pivot chia mảng một cách cân bằng hợp lý
- **Xấu nhất**: O(n²) - pivot luôn là phần tử nhỏ nhất hoặc lớn nhất

### Độ phức tạp không gian:
- **Trung bình**: O(log n) - cho stack đệ quy
- **Xấu nhất**: O(n) - khi đệ quy sâu nhất

### Phân tích toán học:
```
T(n) = T(k) + T(n-k-1) + O(n)
```
Trong đó k là số phần tử nhỏ hơn pivot.

## Khi nào nên sử dụng Quick Sort

### Nên sử dụng khi:
- Cần hiệu suất cao cho dữ liệu ngẫu nhiên
- Bộ nhớ hạn chế (sắp xếp tại chỗ)
- Dữ liệu không có nhiều phần tử trùng lặp
- Không yêu cầu tính ổn định

### Không nên sử dụng khi:
- Cần đảm bảo hiệu suất xấu nhất O(n log n)
- Yêu cầu tính ổn định
- Dữ liệu đã gần như được sắp xếp
- Dữ liệu có quá nhiều phần tử trùng lặp

## Tài liệu tham khảo

- [Wikipedia - Quick Sort](https://en.wikipedia.org/wiki/Quicksort)
- [Visualization of Quick Sort](https://www.hackerearth.com/practice/algorithms/sorting/quick-sort/visualize/)
- [YouTube - Quick Sort Algorithm](https://www.youtube.com/watch?v=SLauY6PpjW4)
- [GeeksforGeeks - Quick Sort](https://www.geeksforgeeks.org/quick-sort/)
- [Khan Academy - Quick Sort](https://www.khanacademy.org/computing/computer-science/algorithms/quick-sort/a/overview-of-quicksort)

---

*Post ID: 52p9wf2a0tfw7ur*  
*Category: Sorting Algorithms*  
*Created: 21/8/2025*  
*Updated: 29/8/2025*
