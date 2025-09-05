---
title: "Thuật toán sắp xếp đếm (Counting Sort)"
postId: "fur79e7oakxb0j1"
category: "Sorting Algorithms"
created: "21/8/2025"
updated: "29/8/2025"
---

# Thuật toán sắp xếp đếm (Counting Sort)


Trong khoa học máy tính, **Counting Sort** là một thuật toán sắp xếp các đối tượng theo khóa là các số nguyên nhỏ. Đây là một thuật toán sắp xếp số nguyên hoạt động bằng cách đếm số lượng đối tượng có từng giá trị khóa riêng biệt, sau đó sử dụng các phép tính số học trên những số đếm đó để xác định vị trí của từng giá trị khóa trong dãy đầu ra.

## Đặc điểm chính

- **Không phải thuật toán so sánh**: Không so sánh các phần tử với nhau
- **Độ phức tạp tuyến tính**: O(n + k) với k là khoảng giá trị
- **Ổn định**: Bảo toàn thứ tự tương đối của các phần tử bằng nhau
- **Phù hợp cho số nguyên**: Hoạt động tốt nhất khi khoảng giá trị nhỏ

## Nguyên lý hoạt động

Counting Sort hoạt động dựa trên nguyên tắc sử dụng giá trị khóa làm chỉ số trong mảng. Thay vì so sánh các phần tử, nó đếm số lần xuất hiện của từng giá trị và tính toán vị trí cuối cùng của chúng.

### Các bước thực hiện:

1. **Đếm tần suất**: Đếm số lần xuất hiện của từng giá trị
2. **Tính toán vị trí**: Tính số phần tử nhỏ hơn hoặc bằng từng giá trị
3. **Xây dựng mảng kết quả**: Đặt từng phần tử vào vị trí đúng

## Minh họa thuật toán

### Bước 1: Đếm tần suất
![Counting Sort Step 1](https://3.bp.blogspot.com/-jJchly1BkTc/WLGqCFDdvCI/AAAAAAAAAHA/luljAlz2ptMndIZNH0KLTTuQMNsfzDeFQCLcB/s1600/CSortUpdatedStepI.gif)

### Bước 2: Tính toán vị trí tích lũy
![Counting Sort Step 2](https://1.bp.blogspot.com/-1vFu-VIRa9Y/WLHGuZkdF3I/AAAAAAAAAHs/8jKu2dbQee4ap9xlVcNsILrclqw0UxAVACLcB/s1600/Step-II.png)

### Bước 3: Xây dựng mảng kết quả
![Counting Sort Step 3](https://1.bp.blogspot.com/-xPqylngqASY/WLGq3p9n9vI/AAAAAAAAAHM/JHdtXAkJY8wYzDMBXxqarjmhpPhM0u8MACLcB/s1600/ResultArrayCS.gif)

## Ưu điểm và nhược điểm

### Ưu điểm:
- **Hiệu suất tuyến tính**: O(n + k) - rất nhanh khi k nhỏ
- **Ổn định**: Bảo toàn thứ tự ban đầu của các phần tử bằng nhau
- **Đơn giản**: Dễ hiểu và triển khai
- **Không so sánh**: Không bị giới hạn bởi O(n log n)
- **Dự đoán được**: Hiệu suất ổn định trong mọi trường hợp

### Nhược điểm:
- **Hạn chế về khoảng giá trị**: Chỉ hiệu quả khi k << n²
- **Chỉ cho số nguyên**: Không thể sắp xếp số thực, chuỗi
- **Bộ nhớ lớn**: Cần O(k) bộ nhớ bổ sung
- **Không phù hợp số âm**: Cần xử lý đặc biệt cho số âm

## Triển khai trong JavaScript

### Triển khai cơ bản

```javascript
class CountingSort extends Sort {
  sort(originalArray, smallestElement = undefined, biggestElement = undefined) {
    // Tìm phần tử nhỏ nhất và lớn nhất
    let detectedSmallestElement = smallestElement || 0;
    let detectedBiggestElement = biggestElement || 0;

    if (smallestElement === undefined || biggestElement === undefined) {
      originalArray.forEach((element) => {
        // Tìm phần tử lớn nhất
        if (this.comparator.greaterThan(element, detectedBiggestElement)) {
          detectedBiggestElement = element;
        }

        // Tìm phần tử nhỏ nhất
        if (this.comparator.lessThan(element, detectedSmallestElement)) {
          detectedSmallestElement = element;
        }
      });
    }

    // Khởi tạo mảng đếm
    const buckets = Array(detectedBiggestElement - detectedSmallestElement + 1).fill(0);

    // Đếm tần suất của từng phần tử
    originalArray.forEach((element) => {
      buckets[element - detectedSmallestElement] += 1;
    });

    // Tính toán vị trí tích lũy
    for (let bucketIndex = 1; bucketIndex < buckets.length; bucketIndex += 1) {
      buckets[bucketIndex] += buckets[bucketIndex - 1];
    }

    // Dịch chuyển để có vị trí đúng
    buckets.pop();
    buckets.unshift(0);

    // Xây dựng mảng kết quả
    const sortedArray = Array(originalArray.length).fill(null);
    for (let elementIndex = 0; elementIndex < originalArray.length; elementIndex += 1) {
      const element = originalArray[elementIndex];
      
      // Tìm vị trí đúng trong mảng đã sắp xếp
      const elementSortedPosition = buckets[element - detectedSmallestElement];
      
      // Đặt phần tử vào vị trí đúng
      sortedArray[elementSortedPosition] = element;
      
      // Tăng vị trí cho lần đặt tiếp theo
      buckets[element - detectedSmallestElement] += 1;
    }

    return sortedArray;
  }
}
```

### Triển khai đơn giản hóa

```javascript
function countingSort(arr) {
  if (arr.length === 0) return arr;

  // Tìm min và max
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min + 1;

  // Mảng đếm
  const count = new Array(range).fill(0);
  
  // Đếm tần suất
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }

  // Xây dựng kết quả
  const result = [];
  for (let i = 0; i < range; i++) {
    while (count[i] > 0) {
      result.push(i + min);
      count[i]--;
    }
  }

  return result;
}
```

### Triển khai cho đối tượng

```javascript
class CountingSortAdvanced extends Sort {
  sortObjects(originalArray, keyExtractor, minKey = null, maxKey = null) {
    if (originalArray.length === 0) return [];

    // Tìm min và max key
    let min = minKey !== null ? minKey : keyExtractor(originalArray[0]);
    let max = maxKey !== null ? maxKey : keyExtractor(originalArray[0]);

    if (minKey === null || maxKey === null) {
      for (const item of originalArray) {
        const key = keyExtractor(item);
        min = Math.min(min, key);
        max = Math.max(max, key);
      }
    }

    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const buckets = new Array(range).fill(null).map(() => []);

    // Đếm và phân loại vào buckets
    for (const item of originalArray) {
      const key = keyExtractor(item);
      const index = key - min;
      count[index]++;
      buckets[index].push(item);
    }

    // Xây dựng kết quả
    const result = [];
    for (let i = 0; i < range; i++) {
      result.push(...buckets[i]);
    }

    return result;
  }
}
```

## Ví dụ thực tế

### Ví dụ 1: Sắp xếp mảng số nguyên dương

```javascript
const numbers = [4, 2, 2, 8, 3, 3, 1];
console.log('Mảng ban đầu:', numbers);

const countingSort = new CountingSort();
const sortedNumbers = countingSort.sort(numbers);
console.log('Mảng đã sắp xếp:', sortedNumbers);
// Kết quả: [1, 2, 2, 3, 3, 4, 8]

// Minh họa từng bước:
// 1. Tìm min=1, max=8, range=8
// 2. Mảng đếm: [1, 2, 2, 1, 0, 0, 0, 1] (cho 1,2,3,4,5,6,7,8)
// 3. Tích lũy: [0, 1, 3, 5, 6, 6, 6, 6]
// 4. Đặt phần tử: 4→vị trí 5, 2→vị trí 1, v.v.
```

### Ví dụ 2: Sắp xếp điểm số sinh viên

```javascript
const students = [
  { name: 'An', score: 85 },
  { name: 'Bình', score: 92 },
  { name: 'Chi', score: 85 },
  { name: 'Dũng', score: 78 },
  { name: 'Hoa', score: 92 }
];

const countingSortAdvanced = new CountingSortAdvanced();
const sortedStudents = countingSortAdvanced.sortObjects(
  students,
  student => student.score,
  0,   // điểm thấp nhất có thể
  100  // điểm cao nhất có thể
);

console.log('Sinh viên theo điểm số:');
sortedStudents.forEach(student => {
  console.log(`${student.name}: ${student.score}`);
});
// Kết quả: Dũng: 78, An: 85, Chi: 85, Bình: 92, Hoa: 92
```

### Ví dụ 3: Sắp xếp theo độ tuổi

```javascript
const ages = [25, 30, 25, 35, 30, 40, 35, 25];
console.log('Độ tuổi ban đầu:', ages);

// Sử dụng hàm đơn giản
const sortedAges = countingSort(ages);
console.log('Độ tuổi đã sắp xếp:', sortedAges);
// Kết quả: [25, 25, 25, 30, 30, 35, 35, 40]

// Thống kê tần suất
const ageCount = {};
for (const age of ages) {
  ageCount[age] = (ageCount[age] || 0) + 1;
}
console.log('Thống kê độ tuổi:', ageCount);
// { 25: 3, 30: 2, 35: 2, 40: 1 }
```

## Xử lý số âm

### Phương pháp offset

```javascript
function countingSortWithNegatives(arr) {
  if (arr.length === 0) return arr;

  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const offset = -min; // Để chuyển số âm thành dương
  const range = max - min + 1;

  const count = new Array(range).fill(0);

  // Đếm với offset
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] + offset]++;
  }

  // Xây dựng kết quả
  const result = [];
  for (let i = 0; i < range; i++) {
    while (count[i] > 0) {
      result.push(i - offset); // Trừ offset để có giá trị gốc
      count[i]--;
    }
  }

  return result;
}

// Ví dụ
const numbersWithNegatives = [-5, -2, 0, 3, -2, 7, 0];
const sorted = countingSortWithNegatives(numbersWithNegatives);
console.log(sorted); // [-5, -2, -2, 0, 0, 3, 7]
```

## Biến thể và ứng dụng

### 1. Radix Sort - Sử dụng Counting Sort làm subroutine

```javascript
function radixSort(arr) {
  const getDigit = (num, place) => Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
  const digitCount = num => Math.floor(Math.log10(Math.abs(num))) + 1;
  const mostDigits = nums => {
    let maxDigits = 0;
    for (let num of nums) {
      maxDigits = Math.max(maxDigits, digitCount(num));
    }
    return maxDigits;
  };

  let maxDigitCount = mostDigits(arr);

  for (let k = 0; k < maxDigitCount; k++) {
    // Sử dụng Counting Sort cho từng digit
    let digitBuckets = Array.from({ length: 10 }, () => []);

    for (let i = 0; i < arr.length; i++) {
      let digit = getDigit(arr[i], k);
      digitBuckets[digit].push(arr[i]);
    }

    arr = [].concat(...digitBuckets);
  }

  return arr;
}
```

### 2. Bucket Sort - Kết hợp với Counting Sort

```javascript
function bucketSort(arr, bucketSize = 5) {
  if (arr.length === 0) return arr;

  // Tìm min và max
  let min = Math.min(...arr);
  let max = Math.max(...arr);

  // Tính số bucket cần thiết
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = new Array(bucketCount).fill(null).map(() => []);

  // Phân phối vào buckets
  for (let i = 0; i < arr.length; i++) {
    const bucketIndex = Math.floor((arr[i] - min) / bucketSize);
    buckets[bucketIndex].push(arr[i]);
  }

  // Sắp xếp từng bucket và kết hợp
  const result = [];
  for (let i = 0; i < buckets.length; i++) {
    if (buckets[i].length > 0) {
      // Sử dụng Counting Sort cho bucket nhỏ
      if (buckets[i].length <= 10) {
        result.push(...countingSort(buckets[i]));
      } else {
        result.push(...buckets[i].sort((a, b) => a - b));
      }
    }
  }

  return result;
}
```

### 3. Counting Sort cho chuỗi (theo độ dài)

```javascript
function countingSortByLength(strings) {
  if (strings.length === 0) return strings;

  // Tìm độ dài max
  const maxLength = Math.max(...strings.map(s => s.length));
  
  // Tạo buckets theo độ dài
  const buckets = new Array(maxLength + 1).fill(null).map(() => []);

  // Phân loại theo độ dài
  for (const str of strings) {
    buckets[str.length].push(str);
  }

  // Kết hợp kết quả
  const result = [];
  for (let i = 0; i <= maxLength; i++) {
    result.push(...buckets[i]);
  }

  return result;
}

// Ví dụ
const words = ['xin', 'chào', 'a', 'hello', 'hi', 'world'];
const sortedByLength = countingSortByLength(words);
console.log(sortedByLength); // ['a', 'xin', 'chào', 'hello', 'world']
```

## Tối ưu hóa

### 1. Tối ưu bộ nhớ khi biết trước khoảng giá trị

```javascript
function optimizedCountingSort(arr, min, max) {
  const range = max - min + 1;
  const count = new Array(range).fill(0);

  // Đếm
  for (const num of arr) {
    count[num - min]++;
  }

  // Xây dựng kết quả in-place nếu có thể
  let index = 0;
  for (let i = 0; i < range; i++) {
    while (count[i] > 0) {
      arr[index++] = i + min;
      count[i]--;
    }
  }

  return arr;
}
```

### 2. Parallel Counting Sort

```javascript
async function parallelCountingSort(arr) {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min + 1;
  
  // Chia mảng thành chunks
  const chunkSize = Math.ceil(arr.length / 4);
  const chunks = [];
  
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }

  // Đếm song song
  const countPromises = chunks.map(chunk => 
    new Promise(resolve => {
      const localCount = new Array(range).fill(0);
      for (const num of chunk) {
        localCount[num - min]++;
      }
      resolve(localCount);
    })
  );

  const counts = await Promise.all(countPromises);

  // Merge counts
  const totalCount = new Array(range).fill(0);
  for (const count of counts) {
    for (let i = 0; i < range; i++) {
      totalCount[i] += count[i];
    }
  }

  // Xây dựng kết quả
  const result = [];
  for (let i = 0; i < range; i++) {
    while (totalCount[i] > 0) {
      result.push(i + min);
      totalCount[i]--;
    }
  }

  return result;
}
```

## Ứng dụng thực tế

### 1. Thống kê và phân tích dữ liệu

```javascript
class DataAnalyzer {
  analyzeAgeDistribution(people) {
    const ages = people.map(person => person.age);
    const sortedAges = countingSort(ages);
    
    // Phân tích phân bố
    const distribution = {};
    for (const age of sortedAges) {
      distribution[age] = (distribution[age] || 0) + 1;
    }

    return {
      sorted: sortedAges,
      distribution,
      median: this.findMedian(sortedAges),
      mode: this.findMode(distribution)
    };
  }

  findMedian(sortedArray) {
    const mid = Math.floor(sortedArray.length / 2);
    return sortedArray.length % 2 === 0
      ? (sortedArray[mid - 1] + sortedArray[mid]) / 2
      : sortedArray[mid];
  }

  findMode(distribution) {
    let maxCount = 0;
    let mode = null;
    for (const [value, count] of Object.entries(distribution)) {
      if (count > maxCount) {
        maxCount = count;
        mode = parseInt(value);
      }
    }
    return { value: mode, count: maxCount };
  }
}
```

### 2. Xếp hạng và điểm số

```javascript
class GradeProcessor {
  processExamResults(students) {
    // Sắp xếp theo điểm (0-100)
    const sortedByScore = new CountingSortAdvanced().sortObjects(
      students,
      student => student.score,
      0, 100
    );

    // Tính xếp hạng
    const ranked = [];
    let currentRank = 1;
    let previousScore = null;
    let studentsWithSameScore = 0;

    for (const student of sortedByScore.reverse()) { // Từ cao xuống thấp
      if (previousScore !== null && student.score !== previousScore) {
        currentRank += studentsWithSameScore;
        studentsWithSameScore = 1;
      } else {
        studentsWithSameScore++;
      }

      ranked.push({
        ...student,
        rank: currentRank,
        grade: this.calculateGrade(student.score)
      });

      previousScore = student.score;
    }

    return ranked;
  }

  calculateGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}
```

### 3. Xử lý histogram

```javascript
class HistogramProcessor {
  createHistogram(data, binSize = 10) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    
    // Tạo bins
    const binCount = Math.ceil((max - min) / binSize);
    const bins = new Array(binCount).fill(0);
    const binLabels = [];

    for (let i = 0; i < binCount; i++) {
      const binStart = min + i * binSize;
      const binEnd = binStart + binSize;
      binLabels.push(`${binStart}-${binEnd}`);
    }

    // Đếm dữ liệu vào bins
    for (const value of data) {
      const binIndex = Math.min(
        Math.floor((value - min) / binSize),
        binCount - 1
      );
      bins[binIndex]++;
    }

    return {
      bins,
      labels: binLabels,
      statistics: {
        min,
        max,
        count: data.length,
        binSize
      }
    };
  }

  visualizeHistogram(histogram) {
    console.log('Histogram:');
    for (let i = 0; i < histogram.bins.length; i++) {
      const bar = '█'.repeat(histogram.bins[i]);
      console.log(`${histogram.labels[i]}: ${bar} (${histogram.bins[i]})`);
    }
  }
}
```

## So sánh với các thuật toán khác

| Thuật toán | Tốt nhất | Trung bình | Xấu nhất | Bộ nhớ | Ổn định | Phù hợp |
|------------|----------|------------|----------|---------|---------|---------|
| **Counting Sort** | n + k | n + k | n + k | n + k | Có | Số nguyên, k nhỏ |
| **Radix Sort** | d(n + k) | d(n + k) | d(n + k) | n + k | Có | Số nguyên lớn |
| **Bucket Sort** | n + k | n + k | n² | n | Có | Phân bố đều |
| **Quick Sort** | n log(n) | n log(n) | n² | log(n) | Không | Mục đích chung |
| **Merge Sort** | n log(n) | n log(n) | n log(n) | n | Có | Cần ổn định |
| **Heap Sort** | n log(n) | n log(n) | n log(n) | 1 | Không | Đảm bảo hiệu suất |

## Phân tích độ phức tạp

### Độ phức tạp thời gian:
- **Tất cả trường hợp**: O(n + k)
  - n: số phần tử trong mảng
  - k: khoảng giá trị (max - min + 1)

### Độ phức tạp không gian:
- **Luôn luôn**: O(n + k)
  - O(k) cho mảng đếm
  - O(n) cho mảng kết quả

### Phân tích chi tiết:
```
Bước 1 - Tìm min/max: O(n)
Bước 2 - Đếm tần suất: O(n)
Bước 3 - Tính tích lũy: O(k)
Bước 4 - Xây dựng kết quả: O(n)
Tổng cộng: O(n + k)
```

## Khi nào nên sử dụng Counting Sort

### Nên sử dụng khi:
- **Sắp xếp số nguyên** trong khoảng nhỏ
- **k << n²** (khoảng giá trị nhỏ hơn nhiều so với n²)
- **Cần tính ổn định** (stable sort)
- **Hiệu suất quan trọng** hơn bộ nhớ
- **Dữ liệu có nhiều giá trị trùng lặp**

### Không nên sử dụng khi:
- **Khoảng giá trị quá lớn** (k >> n)
- **Sắp xếp số thực** hoặc chuỗi
- **Bộ nhớ hạn chế** và k lớn
- **Dữ liệu sparse** (ít giá trị khác nhau)
- **Không biết trước khoảng giá trị**

## Mở rộng và cải tiến

### 1. Sparse Counting Sort
Cho dữ liệu có nhiều khoảng trống:

```javascript
function sparseCountingSort(arr) {
  const countMap = new Map();
  
  // Đếm chỉ các giá trị có trong mảng
  for (const num of arr) {
    countMap.set(num, (countMap.get(num) || 0) + 1);
  }

  // Sắp xếp keys và xây dựng kết quả
  const sortedKeys = Array.from(countMap.keys()).sort((a, b) => a - b);
  const result = [];
  
  for (const key of sortedKeys) {
    const count = countMap.get(key);
    for (let i = 0; i < count; i++) {
      result.push(key);
    }
  }

  return result;
}
```

### 2. Multi-key Counting Sort
Sắp xếp theo nhiều tiêu chí:

```javascript
function multiKeyCountingSort(objects, keyExtractors) {
  let result = [...objects];
  
  // Sắp xếp từ key ít quan trọng nhất đến quan trọng nhất
  for (let i = keyExtractors.length - 1; i >= 0; i--) {
    result = new CountingSortAdvanced().sortObjects(
      result,
      keyExtractors[i]
    );
  }
  
  return result;
}
```

## Tài liệu tham khảo

- [Wikipedia - Counting Sort](https://en.wikipedia.org/wiki/Counting_sort)
- [YouTube - Counting Sort](https://www.youtube.com/watch?v=OKd534EWcdk)
- [GeeksforGeeks - Counting Sort](https://www.geeksforgeeks.org/counting-sort/)
- [EfficientAlgorithms - Linear Sorting](https://efficientalgorithms.blogspot.com/2016/09/lenear-sorting-counting-sort.html)
- [Khan Academy - Counting Sort](https://www.khanacademy.org/computing/computer-science/algorithms/sorting-algorithms/a/counting-sort)

---

*Post ID: fur79e7oakxb0j1*  
*Category: Sorting Algorithms*  
*Created: 21/8/2025*  
*Updated: 29/8/2025*
