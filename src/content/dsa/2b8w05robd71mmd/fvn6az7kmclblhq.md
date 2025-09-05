---
title: "Thuật toán sắp xếp thùng (Bucket Sort)"
postId: "fvn6az7kmclblhq"
category: "Sorting Algorithms"
created: "21/8/2025"
updated: "29/8/2025"
---

# Thuật toán sắp xếp thùng (Bucket Sort)


**Bucket Sort**, còn được gọi là **Bin Sort**, là một thuật toán sắp xếp hoạt động bằng cách phân phối các phần tử của mảng vào một số thùng (buckets). Mỗi thùng sau đó được sắp xếp riêng lẻ, có thể sử dụng thuật toán sắp xếp khác hoặc áp dụng đệ quy thuật toán bucket sort.

## Nguyên lý hoạt động

Bucket Sort hoạt động theo các bước sau:

1. **Khởi tạo**: Tạo một mảng các thùng ban đầu rỗng
2. **Phân tán (Scatter)**: Duyệt mảng gốc, đặt mỗi phần tử vào thùng tương ứng
3. **Sắp xếp**: Sắp xếp từng thùng không rỗng
4. **Thu thập (Gather)**: Duyệt các thùng theo thứ tự và đặt tất cả phần tử trở lại mảng gốc

## Minh họa thuật toán

### Bước 1: Phân phối phần tử vào các thùng
![Phân phối vào thùng](https://www.vievlog.com/dsa/images/bucket_sort_1.png)

### Bước 2: Sắp xếp từng thùng
![Sắp xếp trong thùng](https://www.vievlog.com/dsa/images/bucket_sort_2.png)

## Ưu điểm và nhược điểm

### Ưu điểm:
- **Hiệu suất cao**: O(n + k) trung bình khi dữ liệu phân bố đều
- **Ổn định**: Có thể duy trì tính ổn định tùy thuộc vào thuật toán sắp xếp trong thùng
- **Phân tán tải**: Có thể song song hóa việc sắp xếp các thùng
- **Linh hoạt**: Có thể chọn thuật toán sắp xếp phù hợp cho từng thùng
- **Thích ứng**: Hiệu suất tốt với dữ liệu phân bố đều

### Nhược điểm:
- **Phụ thuộc phân bố**: Hiệu suất kém khi dữ liệu phân bố không đều
- **Bộ nhớ lớn**: Cần O(n + k) bộ nhớ cho các thùng
- **Khó dự đoán**: Hiệu suất phụ thuộc vào cách phân bố dữ liệu
- **Trường hợp xấu**: O(n²) khi tất cả phần tử vào một thùng

## Triển khai trong JavaScript

### Triển khai cơ bản

```javascript
function bucketSort(arr, bucketsNum = 1) {
  if (arr.length === 0) return arr;

  // Tạo các thùng rỗng
  const buckets = new Array(bucketsNum).fill(null).map(() => []);

  // Tìm giá trị min và max
  const minValue = Math.min(...arr);
  const maxValue = Math.max(...arr);

  // Tính kích thước mỗi thùng
  const bucketSize = Math.ceil(Math.max(1, (maxValue - minValue) / bucketsNum));

  // Phân phối phần tử vào các thùng
  for (let i = 0; i < arr.length; i += 1) {
    const currValue = arr[i];
    const bucketIndex = Math.floor((currValue - minValue) / bucketSize);

    // Xử lý trường hợp đặc biệt cho giá trị max
    if (bucketIndex === bucketsNum) {
      buckets[bucketsNum - 1].push(currValue);
    } else {
      buckets[bucketIndex].push(currValue);
    }
  }

  // Sắp xếp từng thùng riêng lẻ
  for (let i = 0; i < buckets.length; i += 1) {
    // Sử dụng insertion sort cho thùng nhỏ
    buckets[i] = insertionSort(buckets[i]);
  }

  // Kết hợp các thùng đã sắp xếp
  const sortedArr = [];
  for (let i = 0; i < buckets.length; i += 1) {
    sortedArr.push(...buckets[i]);
  }

  return sortedArr;
}

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}
```

### Triển khai nâng cao với class

```javascript
class BucketSort {
  constructor(bucketSortAlgorithm = 'insertion') {
    this.bucketSortAlgorithm = bucketSortAlgorithm;
  }

  sort(arr, bucketsNum = null) {
    if (arr.length <= 1) return [...arr];

    // Tự động tính số thùng nếu không được cung cấp
    if (bucketsNum === null) {
      bucketsNum = Math.ceil(Math.sqrt(arr.length));
    }

    const buckets = this.createBuckets(bucketsNum);
    const { minValue, maxValue, bucketSize } = this.calculateBucketParameters(arr, bucketsNum);

    // Phân phối vào thùng
    this.distributeToBuckets(arr, buckets, minValue, bucketSize, bucketsNum);

    // Sắp xếp từng thùng
    this.sortBuckets(buckets);

    // Kết hợp kết quả
    return this.gatherFromBuckets(buckets);
  }

  createBuckets(bucketsNum) {
    return new Array(bucketsNum).fill(null).map(() => []);
  }

  calculateBucketParameters(arr, bucketsNum) {
    const minValue = Math.min(...arr);
    const maxValue = Math.max(...arr);
    const range = maxValue - minValue;
    const bucketSize = Math.max(1, Math.ceil(range / bucketsNum));

    return { minValue, maxValue, bucketSize };
  }

  distributeToBuckets(arr, buckets, minValue, bucketSize, bucketsNum) {
    for (const value of arr) {
      let bucketIndex = Math.floor((value - minValue) / bucketSize);
      
      // Đảm bảo giá trị max vào thùng cuối
      if (bucketIndex >= bucketsNum) {
        bucketIndex = bucketsNum - 1;
      }
      
      buckets[bucketIndex].push(value);
    }
  }

  sortBuckets(buckets) {
    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i].length > 0) {
        buckets[i] = this.sortBucket(buckets[i]);
      }
    }
  }

  sortBucket(bucket) {
    switch (this.bucketSortAlgorithm) {
      case 'insertion':
        return this.insertionSort(bucket);
      case 'quick':
        return this.quickSort(bucket);
      case 'merge':
        return this.mergeSort(bucket);
      default:
        return bucket.sort((a, b) => a - b);
    }
  }

  gatherFromBuckets(buckets) {
    const result = [];
    for (const bucket of buckets) {
      result.push(...bucket);
    }
    return result;
  }

  insertionSort(arr) {
    const sorted = [...arr];
    for (let i = 1; i < sorted.length; i++) {
      let current = sorted[i];
      let j = i - 1;
      
      while (j >= 0 && sorted[j] > current) {
        sorted[j + 1] = sorted[j];
        j--;
      }
      sorted[j + 1] = current;
    }
    return sorted;
  }

  quickSort(arr) {
    if (arr.length <= 1) return arr;
    
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const right = [];
    const equal = [];

    for (const element of arr) {
      if (element < pivot) left.push(element);
      else if (element > pivot) right.push(element);
      else equal.push(element);
    }

    return [...this.quickSort(left), ...equal, ...this.quickSort(right)];
  }
}
```

### Triển khai cho số thực (0.0 - 1.0)

```javascript
function bucketSortFloat(arr, bucketsNum = 10) {
  if (arr.length === 0) return arr;

  // Tạo buckets cho khoảng [0, 1)
  const buckets = new Array(bucketsNum).fill(null).map(() => []);

  // Phân phối vào buckets
  for (const num of arr) {
    let bucketIndex = Math.floor(num * bucketsNum);
    
    // Xử lý trường hợp num = 1.0
    if (bucketIndex === bucketsNum) {
      bucketIndex = bucketsNum - 1;
    }
    
    buckets[bucketIndex].push(num);
  }

  // Sắp xếp từng bucket bằng insertion sort
  for (let i = 0; i < bucketsNum; i++) {
    buckets[i].sort((a, b) => a - b);
  }

  // Kết hợp kết quả
  const result = [];
  for (const bucket of buckets) {
    result.push(...bucket);
  }

  return result;
}

// Ví dụ sử dụng
const floats = [0.897, 0.565, 0.656, 0.1234, 0.665, 0.3434];
const sortedFloats = bucketSortFloat(floats);
console.log(sortedFloats);
// [0.1234, 0.3434, 0.565, 0.656, 0.665, 0.897]
```

## Ví dụ thực tế

### Ví dụ 1: Sắp xếp điểm số sinh viên (0-100)

```javascript
function sortStudentScores(students) {
  const bucketSort = new BucketSort('insertion');
  
  // Trích xuất điểm số
  const scores = students.map(student => student.score);
  
  // Sử dụng 10 buckets cho điểm từ 0-100
  const sortedScores = bucketSort.sort(scores, 10);
  
  // Tạo lại danh sách sinh viên đã sắp xếp
  const result = [];
  const studentMap = new Map();
  
  // Tạo map để tra cứu nhanh
  students.forEach(student => {
    if (!studentMap.has(student.score)) {
      studentMap.set(student.score, []);
    }
    studentMap.get(student.score).push(student);
  });
  
  // Xây dựng kết quả theo thứ tự điểm đã sắp xếp
  for (const score of sortedScores) {
    const studentsWithScore = studentMap.get(score);
    if (studentsWithScore && studentsWithScore.length > 0) {
      result.push(studentsWithScore.shift());
    }
  }
  
  return result;
}

// Ví dụ sử dụng
const students = [
  { name: 'An', score: 85 },
  { name: 'Bình', score: 92 },
  { name: 'Chi', score: 78 },
  { name: 'Dũng', score: 95 },
  { name: 'Hoa', score: 88 }
];

console.log('Sinh viên ban đầu:', students);
const sortedStudents = sortStudentScores(students);
console.log('Sinh viên theo điểm tăng dần:', sortedStudents);
```

### Ví dụ 2: Sắp xếp thời gian trong ngày

```javascript
class TimeScheduleSort {
  sortTimeSlots(timeSlots) {
    // Chuyển thời gian thành phút từ 00:00
    const timeInMinutes = timeSlots.map(time => ({
      original: time,
      minutes: this.timeToMinutes(time)
    }));

    // Sắp xếp bằng bucket sort (24 buckets cho 24 giờ)
    const sortedMinutes = this.bucketSortByHour(timeInMinutes);

    return sortedMinutes.map(item => item.original);
  }

  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  bucketSortByHour(timeItems) {
    const buckets = new Array(24).fill(null).map(() => []);

    // Phân phối vào buckets theo giờ
    for (const item of timeItems) {
      const hour = Math.floor(item.minutes / 60);
      buckets[hour].push(item);
    }

    // Sắp xếp từng bucket theo phút
    for (let i = 0; i < 24; i++) {
      buckets[i].sort((a, b) => a.minutes - b.minutes);
    }

    // Kết hợp kết quả
    const result = [];
    for (const bucket of buckets) {
      result.push(...bucket);
    }

    return result;
  }
}

// Ví dụ sử dụng
const scheduler = new TimeScheduleSort();
const meetings = ['14:30', '09:15', '23:45', '09:30', '14:15', '08:00'];
const sortedMeetings = scheduler.sortTimeSlots(meetings);
console.log('Lịch họp đã sắp xếp:', sortedMeetings);
// ['08:00', '09:15', '09:30', '14:15', '14:30', '23:45']
```

### Ví dụ 3: Sắp xếp dữ liệu cảm biến nhiệt độ

```javascript
class TemperatureDataSort {
  sortTemperatureReadings(readings) {
    // Giả sử nhiệt độ trong khoảng -50°C đến 50°C
    const minTemp = -50;
    const maxTemp = 50;
    const bucketsNum = 20; // 5°C mỗi bucket

    const buckets = new Array(bucketsNum).fill(null).map(() => []);
    const bucketRange = (maxTemp - minTemp) / bucketsNum;

    // Phân phối vào buckets
    for (const reading of readings) {
      let bucketIndex = Math.floor((reading.temperature - minTemp) / bucketRange);
      
      // Đảm bảo trong phạm vi
      bucketIndex = Math.max(0, Math.min(bucketsNum - 1, bucketIndex));
      
      buckets[bucketIndex].push(reading);
    }

    // Sắp xếp từng bucket theo nhiệt độ
    for (let i = 0; i < bucketsNum; i++) {
      buckets[i].sort((a, b) => a.temperature - b.temperature);
    }

    // Kết hợp kết quả
    const result = [];
    for (const bucket of buckets) {
      result.push(...bucket);
    }

    return result;
  }
}

// Ví dụ sử dụng
const tempSorter = new TemperatureDataSort();
const sensorData = [
  { sensor: 'A1', temperature: 23.5, timestamp: '10:00' },
  { sensor: 'B2', temperature: -5.2, timestamp: '10:01' },
  { sensor: 'C3', temperature: 31.8, timestamp: '10:02' },
  { sensor: 'D4', temperature: 18.7, timestamp: '10:03' },
  { sensor: 'E5', temperature: -12.3, timestamp: '10:04' }
];

const sortedData = tempSorter.sortTemperatureReadings(sensorData);
console.log('Dữ liệu nhiệt độ đã sắp xếp:');
sortedData.forEach(data => {
  console.log(`${data.sensor}: ${data.temperature}°C tại ${data.timestamp}`);
});
```

## Tối ưu hóa và biến thể

### 1. Adaptive Bucket Sort

```javascript
class AdaptiveBucketSort {
  sort(arr) {
    if (arr.length <= 1) return [...arr];

    // Phân tích phân bố dữ liệu
    const distribution = this.analyzeDistribution(arr);
    
    // Chọn số buckets tối ưu
    const optimalBuckets = this.calculateOptimalBuckets(arr.length, distribution);
    
    // Chọn thuật toán sắp xếp cho từng bucket
    const sortAlgorithm = this.chooseBucketSortAlgorithm(arr.length);

    return this.bucketSort(arr, optimalBuckets, sortAlgorithm);
  }

  analyzeDistribution(arr) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min;
    
    // Tính coefficient of variation
    const mean = arr.reduce((sum, val) => sum + val, 0) / arr.length;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / mean;

    return { min, max, range, mean, stdDev, cv };
  }

  calculateOptimalBuckets(n, distribution) {
    // Sử dụng công thức tối ưu dựa trên phân tích
    const baseBuckets = Math.ceil(Math.sqrt(n));
    
    // Điều chỉnh dựa trên coefficient of variation
    if (distribution.cv < 0.5) {
      return Math.min(baseBuckets * 2, n); // Phân bố đều
    } else if (distribution.cv > 2) {
      return Math.max(baseBuckets / 2, 1); // Phân bố không đều
    }
    
    return baseBuckets;
  }

  chooseBucketSortAlgorithm(bucketSize) {
    if (bucketSize <= 10) return 'insertion';
    if (bucketSize <= 50) return 'quick';
    return 'merge';
  }
}
```

### 2. Parallel Bucket Sort

```javascript
class ParallelBucketSort {
  async sort(arr, bucketsNum = null, maxWorkers = 4) {
    if (arr.length <= 1) return [...arr];

    bucketsNum = bucketsNum || Math.ceil(Math.sqrt(arr.length));
    const buckets = this.distributeToBuckets(arr, bucketsNum);

    // Sắp xếp buckets song song
    const sortPromises = buckets.map((bucket, index) => 
      this.sortBucketAsync(bucket, index)
    );

    const sortedBuckets = await Promise.all(sortPromises);

    // Kết hợp kết quả
    const result = [];
    for (const bucket of sortedBuckets) {
      result.push(...bucket);
    }

    return result;
  }

  distributeToBuckets(arr, bucketsNum) {
    const buckets = new Array(bucketsNum).fill(null).map(() => []);
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const bucketSize = Math.ceil((max - min + 1) / bucketsNum);

    for (const value of arr) {
      let bucketIndex = Math.floor((value - min) / bucketSize);
      bucketIndex = Math.min(bucketIndex, bucketsNum - 1);
      buckets[bucketIndex].push(value);
    }

    return buckets;
  }

  async sortBucketAsync(bucket, bucketIndex) {
    return new Promise(resolve => {
      // Mô phỏng work trong worker thread
      setTimeout(() => {
        const sorted = bucket.sort((a, b) => a - b);
        resolve(sorted);
      }, 0);
    });
  }
}
```

### 3. Multi-dimensional Bucket Sort

```javascript
class MultiDimensionalBucketSort {
  sort2D(points, bucketsPerDimension = 10) {
    // Sắp xếp theo tọa độ x trước, sau đó y
    return this.sortByDimensions(points, ['x', 'y'], bucketsPerDimension);
  }

  sortByDimensions(objects, dimensions, bucketsPerDimension) {
    let result = [...objects];

    // Sắp xếp theo từng dimension (từ ít quan trọng nhất)
    for (let i = dimensions.length - 1; i >= 0; i--) {
      result = this.bucketSortByDimension(result, dimensions[i], bucketsPerDimension);
    }

    return result;
  }

  bucketSortByDimension(objects, dimension, bucketsNum) {
    if (objects.length <= 1) return objects;

    const values = objects.map(obj => obj[dimension]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const bucketSize = Math.ceil((max - min + 1) / bucketsNum);

    const buckets = new Array(bucketsNum).fill(null).map(() => []);

    // Phân phối vào buckets
    for (const obj of objects) {
      let bucketIndex = Math.floor((obj[dimension] - min) / bucketSize);
      bucketIndex = Math.min(bucketIndex, bucketsNum - 1);
      buckets[bucketIndex].push(obj);
    }

    // Sắp xếp từng bucket và kết hợp
    const result = [];
    for (const bucket of buckets) {
      // Sắp xếp stable trong bucket
      bucket.sort((a, b) => a[dimension] - b[dimension]);
      result.push(...bucket);
    }

    return result;
  }
}

// Ví dụ sử dụng
const multiSort = new MultiDimensionalBucketSort();
const points = [
  { x: 3, y: 7 }, { x: 1, y: 2 }, { x: 3, y: 1 },
  { x: 2, y: 4 }, { x: 1, y: 8 }
];

const sortedPoints = multiSort.sort2D(points);
console.log('Điểm đã sắp xếp theo x, sau đó y:', sortedPoints);
```

## Ứng dụng thực tế

### 1. Sắp xếp log files theo timestamp

```javascript
class LogFileSorter {
  sortLogEntries(logEntries) {
    // Sắp xếp log theo giờ trong ngày
    const buckets = new Array(24).fill(null).map(() => []);

    // Phân phối log vào buckets theo giờ
    for (const entry of logEntries) {
      const hour = this.extractHour(entry.timestamp);
      buckets[hour].push(entry);
    }

    // Sắp xếp từng bucket theo timestamp chính xác
    for (let i = 0; i < 24; i++) {
      buckets[i].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
    }

    // Kết hợp kết quả
    const result = [];
    for (const bucket of buckets) {
      result.push(...bucket);
    }

    return result;
  }

  extractHour(timestamp) {
    return new Date(timestamp).getHours();
  }
}

// Ví dụ
const logSorter = new LogFileSorter();
const logs = [
  { timestamp: '2024-01-01T14:30:15Z', message: 'User login', level: 'INFO' },
  { timestamp: '2024-01-01T09:15:22Z', message: 'System start', level: 'INFO' },
  { timestamp: '2024-01-01T14:25:33Z', message: 'Error occurred', level: 'ERROR' },
  { timestamp: '2024-01-01T09:20:44Z', message: 'Config loaded', level: 'DEBUG' }
];

const sortedLogs = logSorter.sortLogEntries(logs);
console.log('Log entries sorted by time:');
sortedLogs.forEach(log => console.log(`${log.timestamp}: ${log.message}`));
```

### 2. Sắp xếp dữ liệu bán hàng theo giá

```javascript
class SalesDataSorter {
  sortProductsByPrice(products, priceRanges = null) {
    if (!priceRanges) {
      // Tự động xác định price ranges
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      priceRanges = this.generatePriceRanges(minPrice, maxPrice);
    }

    const buckets = new Array(priceRanges.length).fill(null).map(() => []);

    // Phân phối sản phẩm vào buckets theo khoảng giá
    for (const product of products) {
      const bucketIndex = this.findPriceBucket(product.price, priceRanges);
      buckets[bucketIndex].push(product);
    }

    // Sắp xếp từng bucket theo giá chính xác
    for (let i = 0; i < buckets.length; i++) {
      buckets[i].sort((a, b) => a.price - b.price);
    }

    // Kết hợp kết quả
    const result = [];
    for (const bucket of buckets) {
      result.push(...bucket);
    }

    return result;
  }

  generatePriceRanges(minPrice, maxPrice) {
    const ranges = [];
    const numRanges = 10;
    const rangeSize = (maxPrice - minPrice) / numRanges;

    for (let i = 0; i < numRanges; i++) {
      ranges.push({
        min: minPrice + i * rangeSize,
        max: minPrice + (i + 1) * rangeSize
      });
    }

    return ranges;
  }

  findPriceBucket(price, priceRanges) {
    for (let i = 0; i < priceRanges.length; i++) {
      if (price >= priceRanges[i].min && 
          (price < priceRanges[i].max || i === priceRanges.length - 1)) {
        return i;
      }
    }
    return priceRanges.length - 1; // fallback
  }
}

// Ví dụ
const salesSorter = new SalesDataSorter();
const products = [
  { name: 'Laptop', price: 15000000, category: 'Electronics' },
  { name: 'Mouse', price: 500000, category: 'Electronics' },
  { name: 'Book', price: 150000, category: 'Education' },
  { name: 'Phone', price: 8000000, category: 'Electronics' },
  { name: 'Pen', price: 25000, category: 'Stationery' }
];

const sortedProducts = salesSorter.sortProductsByPrice(products);
console.log('Sản phẩm sắp xếp theo giá:');
sortedProducts.forEach(p => console.log(`${p.name}: ${p.price.toLocaleString('vi-VN')} VND`));
```

### 3. Sắp xếp dữ liệu địa lý

```javascript
class GeographicDataSorter {
  sortLocationsByDistance(locations, centerPoint) {
    // Tính khoảng cách và phân chia vào buckets theo khoảng cách
    const locationsWithDistance = locations.map(location => ({
      ...location,
      distance: this.calculateDistance(location, centerPoint)
    }));

    // Tạo buckets theo khoảng cách (km)
    const maxDistance = Math.max(...locationsWithDistance.map(l => l.distance));
    const bucketsNum = Math.ceil(maxDistance / 10); // 10km per bucket
    const buckets = new Array(bucketsNum).fill(null).map(() => []);

    // Phân phối vào buckets
    for (const location of locationsWithDistance) {
      const bucketIndex = Math.min(
        Math.floor(location.distance / 10),
        bucketsNum - 1
      );
      buckets[bucketIndex].push(location);
    }

    // Sắp xếp từng bucket theo khoảng cách chính xác
    for (let i = 0; i < bucketsNum; i++) {
      buckets[i].sort((a, b) => a.distance - b.distance);
    }

    // Kết hợp kết quả
    const result = [];
    for (const bucket of buckets) {
      result.push(...bucket);
    }

    return result;
  }

  calculateDistance(point1, point2) {
    // Công thức Haversine đơn giản
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLon = this.toRadians(point2.lon - point1.lon);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

// Ví dụ
const geoSorter = new GeographicDataSorter();
const center = { lat: 21.0285, lon: 105.8542 }; // Hà Nội

const locations = [
  { name: 'Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { name: 'Đà Nẵng', lat: 16.0471, lon: 108.2068 },
  { name: 'Hải Phòng', lat: 20.8449, lon: 106.6881 },
  { name: 'Cần Thơ', lat: 10.0452, lon: 105.7469 }
];

const sortedByDistance = geoSorter.sortLocationsByDistance(locations, center);
console.log('Thành phố sắp xếp theo khoảng cách từ Hà Nội:');
sortedByDistance.forEach(loc => 
  console.log(`${loc.name}: ${loc.distance.toFixed(2)} km`)
);
```

## So sánh với các thuật toán khác

| Thuật toán | Tốt nhất | Trung bình | Xấu nhất | Bộ nhớ | Ổn định | Phù hợp |
|------------|----------|------------|----------|---------|---------|---------|
| **Bucket Sort** | n + k | n + k | n² | n + k | Có* | Phân bố đều |
| **Radix Sort** | d(n + k) | d(n + k) | d(n + k) | n + k | Có | Số nguyên |
| **Counting Sort** | n + k | n + k | n + k | n + k | Có | Khoảng nhỏ |
| **Quick Sort** | n log(n) | n log(n) | n² | log(n) | Không | Mục đích chung |
| **Merge Sort** | n log(n) | n log(n) | n log(n) | n | Có | Luôn ổn định |
| **Heap Sort** | n log(n) | n log(n) | n log(n) | 1 | Không | Tại chỗ |

*Tính ổn định phụ thuộc vào thuật toán sắp xếp trong bucket

## Phân tích độ phức tạp

### Độ phức tạp thời gian:
- **Tốt nhất**: O(n + k) - phân bố đều, k buckets
- **Trung bình**: O(n + k) - với assumption phân bố đều
- **Xấu nhất**: O(n²) - tất cả phần tử vào một bucket

### Độ phức tạp không gian:
- **Luôn luôn**: O(n + k)
  - O(k) cho buckets
  - O(n) cho dữ liệu trong buckets

### Phân tích chi tiết:
```
Phân phối vào buckets: O(n)
Sắp xếp k buckets: O(∑ ni²) trong worst case
                   O(∑ ni) trong average case (ni nhỏ)
Kết hợp kết quả: O(n)

Tổng: O(n + k) average, O(n²) worst case
```

## Khi nào nên sử dụng Bucket Sort

### Nên sử dụng khi:
- **Dữ liệu phân bố đều** trong khoảng xác định
- **Biết trước khoảng giá trị** của dữ liệu
- **Cần hiệu suất cao** O(n + k)
- **Có đủ bộ nhớ** cho buckets
- **Dữ liệu có thể map vào buckets** dễ dàng

### Không nên sử dụng khi:
- **Dữ liệu phân bố không đều** (skewed)
- **Khoảng giá trị quá lớn** so với số phần tử
- **Bộ nhớ hạn chế** không đủ cho buckets
- **Không biết trước phân bố** dữ liệu
- **Dữ liệu không thể map** vào buckets

## Tối ưu hóa nâng cao

### 1. Dynamic Bucket Sizing

```javascript
class DynamicBucketSort {
  sort(arr) {
    const analysis = this.analyzeDataDistribution(arr);
    const bucketConfig = this.calculateOptimalBucketConfig(analysis);
    
    return this.adaptiveBucketSort(arr, bucketConfig);
  }

  analyzeDataDistribution(arr) {
    // Phân tích histogram để tìm patterns
    const histogram = this.createHistogram(arr, 100);
    
    return {
      uniformity: this.calculateUniformity(histogram),
      density: this.calculateDensity(histogram),
      peaks: this.findPeaks(histogram)
    };
  }

  calculateOptimalBucketConfig(analysis) {
    if (analysis.uniformity > 0.8) {
      return { strategy: 'uniform', buckets: Math.sqrt(n) };
    } else if (analysis.peaks.length > 1) {
      return { strategy: 'adaptive', peaks: analysis.peaks };
    } else {
      return { strategy: 'exponential', base: 2 };
    }
  }
}
```

### 2. Cache-Aware Bucket Sort

```javascript
class CacheAwareBucketSort {
  constructor(cacheLineSize = 64) {
    this.cacheLineSize = cacheLineSize;
    this.elementsPerCacheLine = Math.floor(cacheLineSize / 8); // 8 bytes per number
  }

  sort(arr) {
    // Tối ưu số buckets để fit cache
    const optimalBuckets = this.calculateCacheOptimalBuckets(arr.length);
    
    return this.cacheAwareBucketSort(arr, optimalBuckets);
  }

  calculateCacheOptimalBuckets(n) {
    // Đảm bảo mỗi bucket có kích thước phù hợp với cache
    return Math.min(
      Math.ceil(Math.sqrt(n)),
      Math.floor(n / this.elementsPerCacheLine)
    );
  }
}
```

## Tài liệu tham khảo

- [Wikipedia - Bucket Sort](https://en.wikipedia.org/wiki/Bucket_sort)
- [GeeksforGeeks - Bucket Sort](https://www.geeksforgeeks.org/bucket-sort-2/)
- [Khan Academy - Bucket Sort](https://www.khanacademy.org/computing/computer-science/algorithms/sorting-algorithms/a/bucket-sort)
- [MIT OpenCourseWare - Sorting](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/)
- [Algorithm Visualizer - Bucket Sort](https://algorithm-visualizer.org/brute-force/bucket-sort)
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)

---

*Post ID: fvn6az7kmclblhq*  
*Category: Sorting Algorithms*  
*Created: 21/8/2025*  
*Updated: 29/8/2025*
