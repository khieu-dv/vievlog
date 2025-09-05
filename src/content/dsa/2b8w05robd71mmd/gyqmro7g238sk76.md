---
title: "Thuật toán sắp xếp theo cơ số (Radix Sort)"
postId: "gyqmro7g238sk76"
category: "Sorting Algorithms"
created: "21/8/2025"
updated: "29/8/2025"
---

# Thuật toán sắp xếp theo cơ số (Radix Sort)


Trong khoa học máy tính, **Radix Sort** là một thuật toán sắp xếp số nguyên không dựa trên so sánh, sắp xếp dữ liệu có khóa số nguyên bằng cách nhóm các khóa theo từng chữ số riêng lẻ có cùng vị trí và giá trị quan trọng. Mặc dù yêu cầu ký hiệu vị trí, nhưng vì số nguyên có thể biểu diễn chuỗi ký tự (như tên hoặc ngày tháng) và số thực được định dạng đặc biệt, nên Radix Sort không chỉ giới hạn ở số nguyên.

## Nguồn gốc tên gọi

Trong hệ thống số học, *radix* hoặc cơ số là số lượng chữ số duy nhất, bao gồm chữ số không, được sử dụng để biểu diễn số trong hệ thống số vị trí. Ví dụ:
- Hệ nhị phân (sử dụng số 0 và 1) có radix = 2
- Hệ thập phân (sử dụng số 0 đến 9) có radix = 10
- Hệ thập lục phân (sử dụng 0-9, A-F) có radix = 16

## Nguyên lý hoạt động

Radix Sort hoạt động bằng cách sắp xếp các phần tử theo từng chữ số, bắt đầu từ chữ số ít quan trọng nhất (Least Significant Digit - LSD) hoặc quan trọng nhất (Most Significant Digit - MSD). Thuật toán thường sử dụng Counting Sort như một subroutine ổn định để sắp xếp theo từng chữ số.

![Radix Sort](https://www.vievlog.com/dsa/images/radix-sort.png)

### Các bước thực hiện (LSD Radix Sort):

1. **Xác định số lượng chữ số**: Tìm số có nhiều chữ số nhất
2. **Sắp xếp theo chữ số hàng đơn vị**: Sử dụng thuật toán ổn định
3. **Sắp xếp theo chữ số hàng chục**: Sử dụng kết quả bước trước
4. **Lặp lại**: Tiếp tục cho đến chữ số cao nhất

## Ưu điểm và nhược điểm

### Ưu điểm:
- **Hiệu suất tuyến tính**: O(d × (n + k)) với d là số chữ số
- **Ổn định**: Bảo toàn thứ tự tương đối của các phần tử bằng nhau
- **Không so sánh**: Không bị giới hạn bởi O(n log n)
- **Dự đoán được**: Hiệu suất ổn định cho mọi trường hợp
- **Linh hoạt**: Có thể sắp xếp số, chuỗi, ngày tháng

### Nhược điểm:
- **Hạn chế kiểu dữ liệu**: Chỉ cho dữ liệu có thể biểu diễn theo chữ số
- **Bộ nhớ lớn**: Cần O(n + k) bộ nhớ bổ sung
- **Phụ thuộc độ dài**: Hiệu suất phụ thuộc vào độ dài số lớn nhất
- **Không tối ưu cho số lớn**: Khi d lớn có thể chậm hơn O(n log n)

## Triển khai trong JavaScript

### Triển khai cơ bản cho số nguyên

```javascript
class RadixSort extends Sort {
  sort(originalArray) {
    // Kiểm tra loại dữ liệu
    const isArrayOfNumbers = this.isArrayOfNumbers(originalArray);
    
    let sortedArray = [...originalArray];
    const numPasses = this.determineNumPasses(sortedArray);

    for (let currentIndex = 0; currentIndex < numPasses; currentIndex += 1) {
      const buckets = isArrayOfNumbers
        ? this.placeElementsInNumberBuckets(sortedArray, currentIndex)
        : this.placeElementsInCharacterBuckets(sortedArray, currentIndex, numPasses);

      // Kết hợp các bucket thành mảng đã sắp xếp
      sortedArray = buckets.reduce((acc, val) => {
        return [...acc, ...val];
      }, []);
    }

    return sortedArray;
  }

  placeElementsInNumberBuckets(array, index) {
    const modded = 10 ** (index + 1);
    const divided = 10 ** index;
    const buckets = this.createBuckets(10); // 0-9

    array.forEach((element) => {
      if (element < divided) {
        buckets[0].push(element);
      } else {
        // Lấy chữ số tại vị trí index
        const currentDigit = Math.floor((element % modded) / divided);
        buckets[currentDigit].push(element);
      }
    });

    return buckets;
  }

  determineNumPasses(array) {
    return this.getLengthOfLongestElement(array);
  }

  getLengthOfLongestElement(array) {
    if (this.isArrayOfNumbers(array)) {
      return Math.floor(Math.log10(Math.max(...array))) + 1;
    }
    
    return array.reduce((acc, val) => {
      return val.length > acc ? val.length : acc;
    }, -Infinity);
  }

  createBuckets(numBuckets) {
    return new Array(numBuckets).fill(null).map(() => []);
  }

  isArrayOfNumbers(array) {
    return Number.isInteger(array[0]);
  }
}
```

### Triển khai đơn giản hóa

```javascript
function radixSort(arr) {
  // Hàm hỗ trợ
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
    // Tạo 10 buckets (0-9)
    let digitBuckets = Array.from({ length: 10 }, () => []);

    // Phân phối vào buckets theo chữ số thứ k
    for (let i = 0; i < arr.length; i++) {
      let digit = getDigit(arr[i], k);
      digitBuckets[digit].push(arr[i]);
    }

    // Kết hợp buckets thành mảng mới
    arr = [].concat(...digitBuckets);
  }

  return arr;
}
```

### Triển khai cho chuỗi

```javascript
class RadixSortString extends Sort {
  placeElementsInCharacterBuckets(array, index, numPasses) {
    const BASE_CHAR_CODE = 97; // 'a'
    const ENGLISH_ALPHABET_LENGTH = 26;
    const buckets = this.createBuckets(ENGLISH_ALPHABET_LENGTH);

    array.forEach((element) => {
      const currentBucket = this.getCharCodeOfElementAtIndex(element, index, numPasses);
      buckets[currentBucket].push(element);
    });

    return buckets;
  }

  getCharCodeOfElementAtIndex(element, index, numPasses) {
    const ENGLISH_ALPHABET_LENGTH = 26;
    const BASE_CHAR_CODE = 97;

    // Đặt vào bucket cuối nếu chưa sẵn sàng
    if ((numPasses - index) > element.length) {
      return ENGLISH_ALPHABET_LENGTH - 1;
    }

    // Xác định vị trí ký tự
    const charPos = index > element.length - 1 ? 0 : element.length - index - 1;
    
    return element.toLowerCase().charCodeAt(charPos) - BASE_CHAR_CODE;
  }

  sortStrings(stringArray) {
    let sortedArray = [...stringArray];
    const maxLength = Math.max(...stringArray.map(s => s.length));

    for (let currentIndex = 0; currentIndex < maxLength; currentIndex += 1) {
      const buckets = this.placeElementsInCharacterBuckets(sortedArray, currentIndex, maxLength);
      sortedArray = buckets.reduce((acc, val) => [...acc, ...val], []);
    }

    return sortedArray;
  }
}
```

## Ví dụ thực tế

### Ví dụ 1: Sắp xếp mảng số nguyên

```javascript
const numbers = [170, 45, 75, 90, 2, 802, 24, 66];
console.log('Mảng ban đầu:', numbers);

// Minh họa từng bước với radix sort
console.log('\nQuá trình sắp xếp theo từng chữ số:');

// Bước 1: Sắp xếp theo chữ số hàng đơn vị (index 0)
// 170, 90, 2, 802 → bucket 0
// 24 → bucket 4  
// 45, 75 → bucket 5
// 66 → bucket 6
console.log('Sau bước 1 (hàng đơn vị): [170, 90, 2, 802, 24, 45, 75, 66]');

// Bước 2: Sắp xếp theo chữ số hàng chục (index 1)  
// 2, 802 → bucket 0
// 24 → bucket 2
// 45 → bucket 4
// 66 → bucket 6
// 170, 75 → bucket 7
// 90 → bucket 9
console.log('Sau bước 2 (hàng chục): [2, 802, 24, 45, 66, 170, 75, 90]');

// Bước 3: Sắp xếp theo chữ số hàng trăm (index 2)
// 2, 24, 45, 66, 75, 90 → bucket 0
// 170 → bucket 1
// 802 → bucket 8
console.log('Sau bước 3 (hàng trăm): [2, 24, 45, 66, 75, 90, 170, 802]');

const radixSort = new RadixSort();
const sortedNumbers = radixSort.sort(numbers);
console.log('\nKết quả cuối cùng:', sortedNumbers);
// [2, 24, 45, 66, 75, 90, 170, 802]
```

### Ví dụ 2: Sắp xếp chuỗi

```javascript
const words = ['banana', 'apple', 'cherry', 'date', 'elderberry'];
console.log('Mảng chuỗi ban đầu:', words);

const radixSortString = new RadixSortString();
const sortedWords = radixSortString.sortStrings(words);
console.log('Mảng chuỗi đã sắp xếp:', sortedWords);
// ['apple', 'banana', 'cherry', 'date', 'elderberry']

// Minh họa quá trình cho chuỗi có độ dài khác nhau
const mixedLength = ['cat', 'to', 'tea', 'ted', 'ten', 'i', 'in', 'inn'];
const sortedMixed = radixSortString.sortStrings(mixedLength);
console.log('Chuỗi độ dài khác nhau:', sortedMixed);
// ['cat', 'i', 'in', 'inn', 'tea', 'ted', 'ten', 'to']
```

### Ví dụ 3: Sắp xếp ngày tháng (định dạng YYYYMMDD)

```javascript
const dates = [20231215, 20240101, 20230301, 20240315, 20231101];
console.log('Ngày tháng ban đầu:', dates);

// Chuyển đổi thành định dạng readable
const formatDate = (dateNum) => {
  const str = dateNum.toString();
  return `${str.slice(6,8)}/${str.slice(4,6)}/${str.slice(0,4)}`;
};

console.log('Định dạng readable:', dates.map(formatDate));

const sortedDates = radixSort(dates);
console.log('Ngày tháng đã sắp xếp:', sortedDates);
console.log('Định dạng readable:', sortedDates.map(formatDate));
// Kết quả: 01/03/2023, 01/11/2023, 15/12/2023, 01/01/2024, 15/03/2024
```

## Các biến thể của Radix Sort

### 1. LSD (Least Significant Digit) Radix Sort

```javascript
function lsdRadixSort(arr) {
  const maxNum = Math.max(...arr);
  const maxDigits = Math.floor(Math.log10(maxNum)) + 1;

  for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
    // Sử dụng counting sort cho mỗi digit
    arr = countingSortByDigit(arr, digitPlace);
  }

  return arr;
}

function countingSortByDigit(arr, digitPlace) {
  const output = new Array(arr.length);
  const count = new Array(10).fill(0);
  const divider = Math.pow(10, digitPlace);

  // Đếm tần suất của từng digit
  for (let i = 0; i < arr.length; i++) {
    const digit = Math.floor(arr[i] / divider) % 10;
    count[digit]++;
  }

  // Tính vị trí tích lũy
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Xây dựng mảng kết quả
  for (let i = arr.length - 1; i >= 0; i--) {
    const digit = Math.floor(arr[i] / divider) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }

  return output;
}
```

### 2. MSD (Most Significant Digit) Radix Sort

```javascript
function msdRadixSort(arr, digitPlace = null) {
  if (arr.length <= 1) return arr;

  if (digitPlace === null) {
    const maxNum = Math.max(...arr);
    digitPlace = Math.floor(Math.log10(maxNum));
  }

  if (digitPlace < 0) return arr;

  const buckets = Array.from({ length: 10 }, () => []);
  const divider = Math.pow(10, digitPlace);

  // Phân phối vào buckets
  for (const num of arr) {
    const digit = Math.floor(num / divider) % 10;
    buckets[digit].push(num);
  }

  // Đệ quy sắp xếp từng bucket
  const result = [];
  for (const bucket of buckets) {
    const sortedBucket = msdRadixSort(bucket, digitPlace - 1);
    result.push(...sortedBucket);
  }

  return result;
}
```

### 3. Radix Sort cho số âm

```javascript
function radixSortWithNegatives(arr) {
  if (arr.length === 0) return arr;

  // Tách số dương và số âm
  const positives = arr.filter(num => num >= 0);
  const negatives = arr.filter(num => num < 0).map(num => -num);

  // Sắp xếp từng nhóm
  const sortedPositives = radixSort(positives);
  const sortedNegatives = radixSort(negatives).map(num => -num).reverse();

  // Kết hợp kết quả
  return [...sortedNegatives, ...sortedPositives];
}

// Ví dụ
const mixedNumbers = [-170, 45, -75, 90, -2, 802, -24, 66];
const sortedMixed = radixSortWithNegatives(mixedNumbers);
console.log(sortedMixed); // [-170, -75, -24, -2, 45, 66, 90, 802]
```

## Tối ưu hóa

### 1. Tối ưu cho các cơ số khác nhau

```javascript
class RadixSortOptimized {
  constructor(radix = 10) {
    this.radix = radix;
  }

  sort(arr) {
    if (arr.length === 0) return arr;

    const maxNum = Math.max(...arr);
    const maxDigits = Math.floor(Math.log(maxNum) / Math.log(this.radix)) + 1;

    for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
      arr = this.countingSortByDigit(arr, digitPlace);
    }

    return arr;
  }

  countingSortByDigit(arr, digitPlace) {
    const output = new Array(arr.length);
    const count = new Array(this.radix).fill(0);
    const divider = Math.pow(this.radix, digitPlace);

    // Đếm tần suất
    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / divider) % this.radix;
      count[digit]++;
    }

    // Tính vị trí tích lũy
    for (let i = 1; i < this.radix; i++) {
      count[i] += count[i - 1];
    }

    // Xây dựng kết quả
    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / divider) % this.radix;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    return output;
  }
}

// So sánh hiệu suất với các cơ số khác nhau
const testArray = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 100000));

console.time('Radix 10');
new RadixSortOptimized(10).sort([...testArray]);
console.timeEnd('Radix 10');

console.time('Radix 16'); 
new RadixSortOptimized(16).sort([...testArray]);
console.timeEnd('Radix 16');

console.time('Radix 256');
new RadixSortOptimized(256).sort([...testArray]);
console.timeEnd('Radix 256');
```

### 2. In-place Radix Sort (tiết kiệm bộ nhớ)

```javascript
function inPlaceRadixSort(arr) {
  const maxNum = Math.max(...arr);
  const maxDigits = Math.floor(Math.log10(maxNum)) + 1;

  for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
    // Sử dụng cycle sort concept để sắp xếp in-place
    for (let i = 0; i < arr.length; i++) {
      let currentElement = arr[i];
      let currentPos = i;

      // Tìm vị trí đúng cho element
      while (true) {
        const digit = Math.floor(currentElement / Math.pow(10, digitPlace)) % 10;
        const correctPos = this.findCorrectPosition(arr, digit, digitPlace, i);
        
        if (correctPos === currentPos) break;

        // Swap
        [arr[correctPos], currentElement] = [currentElement, arr[correctPos]];
        currentPos = correctPos;
      }
    }
  }

  return arr;
}
```

## Ứng dụng thực tế

### 1. Sắp xếp dữ liệu khách hàng theo ID

```javascript
class CustomerProcessor {
  sortCustomersByID(customers) {
    // Giả sử ID khách hàng là số 6 chữ số
    const customerIDs = customers.map((customer, index) => ({
      id: customer.id,
      originalIndex: index
    }));

    // Sắp xếp ID bằng radix sort
    const sortedIDs = this.radixSortObjects(customerIDs, 'id');

    // Tái tạo mảng khách hàng theo thứ tự mới
    return sortedIDs.map(item => customers[item.originalIndex]);
  }

  radixSortObjects(objects, keyField) {
    const maxDigits = Math.max(...objects.map(obj => 
      Math.floor(Math.log10(obj[keyField])) + 1
    ));

    for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
      objects = this.countingSortObjects(objects, keyField, digitPlace);
    }

    return objects;
  }

  countingSortObjects(objects, keyField, digitPlace) {
    const output = new Array(objects.length);
    const count = new Array(10).fill(0);
    const divider = Math.pow(10, digitPlace);

    // Đếm tần suất
    for (let i = 0; i < objects.length; i++) {
      const digit = Math.floor(objects[i][keyField] / divider) % 10;
      count[digit]++;
    }

    // Tính vị trí tích lũy
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Xây dựng kết quả
    for (let i = objects.length - 1; i >= 0; i--) {
      const digit = Math.floor(objects[i][keyField] / divider) % 10;
      output[count[digit] - 1] = objects[i];
      count[digit]--;
    }

    return output;
  }
}
```

### 2. Sắp xếp địa chỉ IP

```javascript
class IPAddressSorter {
  sortIPAddresses(ipAddresses) {
    // Chuyển IP thành số nguyên 32-bit
    const ipNumbers = ipAddresses.map(ip => ({
      original: ip,
      numeric: this.ipToNumber(ip)
    }));

    // Sắp xếp bằng radix sort
    const sortedNumbers = this.radixSortObjects(ipNumbers, 'numeric');

    // Chuyển về định dạng IP
    return sortedNumbers.map(item => item.original);
  }

  ipToNumber(ip) {
    const parts = ip.split('.').map(Number);
    return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
  }

  radixSortObjects(objects, keyField) {
    // Sắp xếp 32-bit number cần 10 chữ số thập phân
    const maxDigits = 10;

    for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
      objects = this.countingSortObjects(objects, keyField, digitPlace);
    }

    return objects;
  }
}

// Ví dụ sử dụng
const ipSorter = new IPAddressSorter();
const ips = ['192.168.1.10', '10.0.0.1', '192.168.1.2', '172.16.0.5'];
const sortedIPs = ipSorter.sortIPAddresses(ips);
console.log(sortedIPs);
// ['10.0.0.1', '172.16.0.5', '192.168.1.2', '192.168.1.10']
```

### 3. Sắp xếp dữ liệu thời gian

```javascript
class TimeDataSorter {
  sortTimestamps(timestamps) {
    // Chuyển timestamp thành mili giây
    const numericTimestamps = timestamps.map(ts => ({
      original: ts,
      numeric: new Date(ts).getTime()
    }));

    // Sắp xếp bằng radix sort cho số lớn
    const sorted = this.radixSortLargeNumbers(numericTimestamps, 'numeric');

    return sorted.map(item => item.original);
  }

  radixSortLargeNumbers(objects, keyField) {
    // Timestamp có thể có 13 chữ số
    const maxDigits = 13;

    for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
      objects = this.countingSortObjects(objects, keyField, digitPlace);
    }

    return objects;
  }

  // Sắp xếp thời gian trong ngày (HH:MM:SS)
  sortTimeStrings(timeStrings) {
    const timeNumbers = timeStrings.map(time => ({
      original: time,
      numeric: this.timeToSeconds(time)
    }));

    const sorted = this.radixSortObjects(timeNumbers, 'numeric');
    return sorted.map(item => item.original);
  }

  timeToSeconds(timeStr) {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }
}

// Ví dụ
const timeSorter = new TimeDataSorter();

const times = ['14:30:45', '09:15:30', '23:59:59', '00:00:01', '12:00:00'];
const sortedTimes = timeSorter.sortTimeStrings(times);
console.log(sortedTimes);
// ['00:00:01', '09:15:30', '12:00:00', '14:30:45', '23:59:59']

const dates = ['2023-12-15', '2024-01-01', '2023-03-01', '2024-03-15'];
const sortedDates = timeSorter.sortTimestamps(dates);
console.log(sortedDates);
// ['2023-03-01', '2023-12-15', '2024-01-01', '2024-03-15']
```

## So sánh hiệu suất

### Phân tích độ phức tạp vs. các thuật toán khác

| Thuật toán | Tốt nhất | Trung bình | Xấu nhất | Bộ nhớ | Ổn định | Ghi chú |
|------------|----------|------------|----------|---------|---------|---------|
| **Radix Sort** | d(n + k) | d(n + k) | d(n + k) | n + k | Có | d = số chữ số, k = cơ số |
| **Counting Sort** | n + k | n + k | n + k | n + k | Có | k = khoảng giá trị |
| **Quick Sort** | n log(n) | n log(n) | n² | log(n) | Không | Mục đích chung |
| **Merge Sort** | n log(n) | n log(n) | n log(n) | n | Có | Luôn ổn định |
| **Heap Sort** | n log(n) | n log(n) | n log(n) | 1 | Không | Tại chỗ |

### Benchmark thực tế

```javascript
function benchmarkSortingAlgorithms() {
  const sizes = [1000, 10000, 100000];
  
  sizes.forEach(size => {
    console.log(`\n=== Benchmark cho ${size} phần tử ===`);
    
    // Tạo dữ liệu test
    const data = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 1000000)
    );

    // Radix Sort
    console.time('Radix Sort');
    radixSort([...data]);
    console.timeEnd('Radix Sort');

    // JavaScript built-in sort (Tim Sort)
    console.time('Built-in Sort');
    [...data].sort((a, b) => a - b);
    console.timeEnd('Built-in Sort');

    // Quick Sort (để so sánh)
    console.time('Quick Sort');
    quickSort([...data]);
    console.timeEnd('Quick Sort');
  });
}

// benchmarkSortingAlgorithms();
```

## Phân tích độ phức tạp chi tiết

### Độ phức tạp thời gian:
- **Luôn luôn**: O(d × (n + k))
  - d: số chữ số của số lớn nhất
  - n: số phần tử trong mảng  
  - k: cơ số (thường là 10)

### Độ phức tạp không gian:
- **Luôn luôn**: O(n + k)
  - O(n) cho mảng output
  - O(k) cho counting array

### So sánh với thuật toán comparison-based:
```
Radix Sort: O(d × n) khi k = O(1)
Quick Sort: O(n log n) trung bình

Khi d = O(log n): Radix Sort ≈ Quick Sort
Khi d << log n: Radix Sort tốt hơn
Khi d >> log n: Quick Sort tốt hơn
```

## Khi nào nên sử dụng Radix Sort

### Nên sử dụng khi:
- **Sắp xếp số nguyên** trong khoảng hạn chế
- **Độ dài số nhỏ** (d << log n)
- **Cần tính ổn định** (stable sort)
- **Dữ liệu có pattern** (IP, ID, timestamp)
- **Có đủ bộ nhớ** cho buckets

### Không nên sử dụng khi:
- **Số có nhiều chữ số** (d >> log n)
- **Số thực không có pattern**
- **Dữ liệu mixed types**
- **Bộ nhớ hạn chế** (embedded systems)
- **Dữ liệu có cơ số lớn** và sparse

## Mở rộng và biến thể nâng cao

### 1. Parallel Radix Sort

```javascript
class ParallelRadixSort {
  async sort(arr, numWorkers = 4) {
    const maxDigits = Math.floor(Math.log10(Math.max(...arr))) + 1;
    
    for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
      arr = await this.parallelCountingSort(arr, digitPlace, numWorkers);
    }
    
    return arr;
  }

  async parallelCountingSort(arr, digitPlace, numWorkers) {
    const chunkSize = Math.ceil(arr.length / numWorkers);
    const chunks = [];
    
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }

    // Đếm song song
    const countPromises = chunks.map(chunk => 
      this.countDigitsInChunk(chunk, digitPlace)
    );
    
    const counts = await Promise.all(countPromises);
    
    // Merge counts và tạo kết quả
    const totalCount = new Array(10).fill(0);
    for (const count of counts) {
      for (let i = 0; i < 10; i++) {
        totalCount[i] += count[i];
      }
    }
    
    return this.buildResultFromCounts(arr, totalCount, digitPlace);
  }
}
```

### 2. External Radix Sort (cho dữ liệu lớn)

```javascript
class ExternalRadixSort {
  async sortLargeFile(inputFile, outputFile, memoryLimit) {
    const maxDigits = await this.findMaxDigits(inputFile);
    
    for (let digitPlace = 0; digitPlace < maxDigits; digitPlace++) {
      await this.externalCountingSort(inputFile, outputFile, digitPlace, memoryLimit);
      [inputFile, outputFile] = [outputFile, inputFile]; // Swap files
    }
  }

  async externalCountingSort(inputFile, outputFile, digitPlace, memoryLimit) {
    // Phase 1: Count digits by reading file in chunks
    const digitCounts = await this.countDigitsInFile(inputFile, digitPlace, memoryLimit);
    
    // Phase 2: Calculate positions
    const positions = this.calculatePositions(digitCounts);
    
    // Phase 3: Redistribute data
    await this.redistributeData(inputFile, outputFile, digitPlace, positions, memoryLimit);
  }
}
```

## Tài liệu tham khảo

- [Wikipedia - Radix Sort](https://en.wikipedia.org/wiki/Radix_sort)
- [YouTube - Radix Sort Algorithm](https://www.youtube.com/watch?v=XiuSW_mEn7g)
- [ResearchGate - Radix Sort Analysis](https://www.researchgate.net/figure/Simplistic-illustration-of-the-steps-performed-in-a-radix-sort-In-this-example-the_fig1_291086231)
- [GeeksforGeeks - Radix Sort](https://www.geeksforgeeks.org/radix-sort/)
- [Khan Academy - Radix Sort](https://www.khanacademy.org/computing/computer-science/algorithms/radix-sort/a/radix-sort)
- [MIT OpenCourseWare - Integer Sorting](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/lecture-videos/lecture-7-counting-sort-radix-sort-lower-bounds-for-sorting/)

---

*Post ID: gyqmro7g238sk76*  
*Category: Sorting Algorithms*  
*Created: 21/8/2025*  
*Updated: 29/8/2025*
