---
title: "Thuật toán tìm kiếm nội suy (Interpolation Search)"
postId: "lba838hd27cdlrq"
category: "Searches Algorithms"
created: "22/8/2025"
updated: "29/8/2025"
---

# Thuật toán tìm kiếm nội suy (Interpolation Search)


**Interpolation Search** là một thuật toán tìm kiếm một khóa trong mảng đã được sắp xếp theo các giá trị số được gán cho các khóa (key values). Đây là cải tiến của Binary Search cho các trường hợp mảng đã sắp xếp có các giá trị được phân bố đồng đều.

Ví dụ, chúng ta có một mảng sắp xếp gồm `n` giá trị phân bố đồng đều `arr[]`, và chúng ta cần viết một hàm để tìm kiếm một phần tử cụ thể `x` trong mảng.

**Linear Search** tìm phần tử trong thời gian `O(n)`, **Jump Search** mất `O(√n)` thời gian và **Binary Search** mất `O(log n)` thời gian.

**Interpolation Search** là một cải tiến so với Binary Search cho các trường hợp mà các giá trị trong mảng đã sắp xếp được phân bố _đồng đều_.

## Nguyên lý hoạt động

Binary Search luôn đi đến phần tử giữa để kiểm tra. Mặt khác, Interpolation Search có thể đi đến các vị trí khác nhau tùy theo giá trị của khóa đang được tìm kiếm. Ví dụ, nếu giá trị của khóa gần với phần tử cuối cùng hơn, Interpolation Search có khả năng bắt đầu tìm kiếm về phía cuối.

Để tìm vị trí cần tìm kiếm, nó sử dụng công thức sau:

```javascript
// Ý tưởng của công thức là trả về giá trị pos cao hơn
// khi phần tử cần tìm gần với arr[hi] hơn. Và
// giá trị nhỏ hơn khi gần với arr[lo] hơn
pos = lo + ((x - arr[lo]) * (hi - lo) / (arr[hi] - arr[lo]))

arr[] - Mảng nơi các phần tử cần được tìm kiếm
x - Phần tử cần tìm kiếm  
lo - Chỉ số bắt đầu trong arr[]
hi - Chỉ số kết thúc trong arr[]
```

## Đặc điểm chính

- **Thích ứng**: Điều chỉnh vị trí tìm kiếm dựa trên giá trị target
- **Hiệu quả với dữ liệu đồng đều**: O(log log n) cho dữ liệu phân bố đều  
- **Yêu cầu phân bố đồng đều**: Hiệu suất kém với dữ liệu không đồng đều
- **Cải tiến của Binary Search**: Sử dụng thông tin về phân bố dữ liệu

## Ưu điểm và nhược điểm

### Ưu điểm:
- **Hiệu suất cao**: O(log log n) với dữ liệu phân bố đều
- **Thông minh**: Dự đoán vị trí dựa trên giá trị
- **Tối ưu cho số**: Rất hiệu quả với dữ liệu số phân bố đều
- **Adaptive**: Thích ứng với pattern của dữ liệu
- **Ít so sánh hơn Binary Search**: Trong trường hợp tốt

### Nhược điểm:
- **Yêu cầu phân bố đều**: Hiệu suất kém với dữ liệu skewed
- **Trường hợp xấu**: O(n) khi dữ liệu không đồng đều
- **Phức tạp hơn**: Khó triển khai so với Binary Search
- **Overflow risk**: Có thể tràn số với dữ liệu lớn
- **Chỉ cho số**: Không áp dụng được cho dữ liệu không số

## Triển khai trong JavaScript

### Triển khai cơ bản

```javascript
function interpolationSearch(sortedArray, seekElement) {
  let leftIndex = 0;
  let rightIndex = sortedArray.length - 1;

  while (leftIndex <= rightIndex) {
    const rangeDelta = sortedArray[rightIndex] - sortedArray[leftIndex];
    const indexDelta = rightIndex - leftIndex;
    const valueDelta = seekElement - sortedArray[leftIndex];

    // Nếu valueDelta < 0 có nghĩa là không có phần tử cần tìm
    // trong mảng vì phần tử nhỏ nhất đã lớn hơn phần tử cần tìm
    if (valueDelta < 0) {
      return -1;
    }

    // Nếu rangeDelta = 0 thì mảng con chứa tất cả số giống nhau
    // và do đó không có gì để tìm kiếm trừ khi range này toàn bộ
    // bao gồm số cần tìm
    if (!rangeDelta) {
      // Bằng cách này chúng ta cũng tránh chia cho 0 khi
      // tính middleIndex sau này
      return sortedArray[leftIndex] === seekElement ? leftIndex : -1;
    }

    // Thực hiện nội suy chỉ số giữa
    const middleIndex = leftIndex + Math.floor((valueDelta * indexDelta) / rangeDelta);

    // Nếu tìm thấy phần tử, trả về vị trí của nó
    if (sortedArray[middleIndex] === seekElement) {
      return middleIndex;
    }

    // Quyết định chọn nửa nào để tìm kiếm tiếp: trái hay phải
    if (sortedArray[middleIndex] < seekElement) {
      // Đi tới nửa phải của mảng
      leftIndex = middleIndex + 1;
    } else {
      // Đi tới nửa trái của mảng
      rightIndex = middleIndex - 1;
    }
  }

  return -1;
}
```

### Triển khai với thống kê

```javascript
function interpolationSearchWithStats(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let comparisons = 0;
  let iterations = 0;
  const searchPath = [];

  while (left <= right) {
    iterations++;
    
    const rangeDelta = arr[right] - arr[left];
    const indexDelta = right - left;
    const valueDelta = target - arr[left];

    // Early termination checks
    if (valueDelta < 0) {
      return {
        index: -1,
        found: false,
        comparisons,
        iterations,
        searchPath,
        reason: 'Target smaller than range'
      };
    }

    if (rangeDelta === 0) {
      comparisons++;
      const found = arr[left] === target;
      return {
        index: found ? left : -1,
        found,
        comparisons,
        iterations,
        searchPath,
        reason: found ? 'Found in uniform range' : 'Not in uniform range'
      };
    }

    // Interpolation formula
    const interpolatedIndex = left + Math.floor((valueDelta * indexDelta) / rangeDelta);
    
    // Ensure index is within bounds
    const safeIndex = Math.max(left, Math.min(right, interpolatedIndex));
    
    searchPath.push({
      iteration: iterations,
      left,
      right,
      target,
      interpolatedIndex: safeIndex,
      value: arr[safeIndex],
      rangeDelta,
      valueDelta
    });

    comparisons++;
    if (arr[safeIndex] === target) {
      return {
        index: safeIndex,
        found: true,
        comparisons,
        iterations,
        searchPath,
        efficiency: comparisons / Math.log2(arr.length)
      };
    }

    comparisons++;
    if (arr[safeIndex] < target) {
      left = safeIndex + 1;
    } else {
      right = safeIndex - 1;
    }
  }

  return {
    index: -1,
    found: false,
    comparisons,
    iterations,
    searchPath,
    reason: 'Search space exhausted'
  };
}
```

### Triển khai an toàn (tránh overflow)

```javascript
function safeInterpolationSearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // Kiểm tra biên
    if (target < arr[left] || target > arr[right]) {
      return -1;
    }

    // Trường hợp đặc biệt
    if (left === right) {
      return arr[left] === target ? left : -1;
    }

    // Tính toán an toàn để tránh overflow
    const leftValue = arr[left];
    const rightValue = arr[right];
    
    if (leftValue === rightValue) {
      return leftValue === target ? left : -1;
    }

    // Sử dụng floating point để tránh integer overflow
    const ratio = (target - leftValue) / (rightValue - leftValue);
    const interpolatedIndex = Math.floor(left + ratio * (right - left));
    
    // Đảm bảo index trong phạm vi hợp lệ
    const safeIndex = Math.max(left, Math.min(right, interpolatedIndex));

    if (arr[safeIndex] === target) {
      return safeIndex;
    }

    if (arr[safeIndex] < target) {
      left = safeIndex + 1;
    } else {
      right = safeIndex - 1;
    }
  }

  return -1;
}
```

### Triển khai cho đối tượng

```javascript
function interpolationSearchObject(sortedArray, target, keyField) {
  let left = 0;
  let right = sortedArray.length - 1;

  while (left <= right) {
    const leftValue = sortedArray[left][keyField];
    const rightValue = sortedArray[right][keyField];
    
    if (target < leftValue || target > rightValue) {
      return { found: false, index: -1, object: null };
    }

    if (left === right) {
      const found = leftValue === target;
      return {
        found,
        index: found ? left : -1,
        object: found ? sortedArray[left] : null
      };
    }

    if (leftValue === rightValue) {
      const found = leftValue === target;
      return {
        found,
        index: found ? left : -1,
        object: found ? sortedArray[left] : null
      };
    }

    // Interpolation
    const ratio = (target - leftValue) / (rightValue - leftValue);
    const interpolatedIndex = Math.floor(left + ratio * (right - left));
    const safeIndex = Math.max(left, Math.min(right, interpolatedIndex));

    const midValue = sortedArray[safeIndex][keyField];

    if (midValue === target) {
      return {
        found: true,
        index: safeIndex,
        object: sortedArray[safeIndex]
      };
    }

    if (midValue < target) {
      left = safeIndex + 1;
    } else {
      right = safeIndex - 1;
    }
  }

  return { found: false, index: -1, object: null };
}
```

## Ví dụ thực tế

### Ví dụ 1: Tìm kiếm trong dữ liệu nhiệt độ

```javascript
// Dữ liệu nhiệt độ theo giờ (phân bố tương đối đều)
const temperatureData = [
  { hour: 0, temp: 15.2 },   { hour: 1, temp: 14.8 },   { hour: 2, temp: 14.5 },
  { hour: 3, temp: 14.1 },   { hour: 4, temp: 13.9 },   { hour: 5, temp: 14.2 },
  { hour: 6, temp: 15.1 },   { hour: 7, temp: 16.8 },   { hour: 8, temp: 18.9 },
  { hour: 9, temp: 21.3 },   { hour: 10, temp: 23.7 },  { hour: 11, temp: 25.8 },
  { hour: 12, temp: 27.2 },  { hour: 13, temp: 28.1 },  { hour: 14, temp: 28.9 },
  { hour: 15, temp: 28.7 },  { hour: 16, temp: 27.8 },  { hour: 17, temp: 26.4 },
  { hour: 18, temp: 24.6 },  { hour: 19, temp: 22.1 },  { hour: 20, temp: 19.8 },
  { hour: 21, temp: 18.2 },  { hour: 22, temp: 16.9 },  { hour: 23, temp: 15.8 }
];

// Sắp xếp theo nhiệt độ
const tempSorted = [...temperatureData].sort((a, b) => a.temp - b.temp);

function findTemperatureTime(data, targetTemp) {
  const result = interpolationSearchObject(data, targetTemp, 'temp');
  return result.found ? result.object : null;
}

// So sánh với Binary Search
function binarySearchTemp(data, targetTemp) {
  let left = 0;
  let right = data.length - 1;
  let comparisons = 0;

  while (left <= right) {
    comparisons++;
    const mid = Math.floor((left + right) / 2);
    
    if (Math.abs(data[mid].temp - targetTemp) < 0.1) {
      return { result: data[mid], comparisons };
    }
    
    if (data[mid].temp < targetTemp) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return { result: null, comparisons };
}

console.log('=== Tìm kiếm nhiệt độ ===');
const targetTemp = 25.8;

// Interpolation Search
const interpResult = interpolationSearchWithStats(
  tempSorted.map(d => d.temp), 
  targetTemp
);
console.log(`Interpolation Search - Tìm ${targetTemp}°C:`);
console.log(`- Tìm thấy: ${interpResult.found}`);
console.log(`- Vị trí: ${interpResult.index}`);
console.log(`- Số phép so sánh: ${interpResult.comparisons}`);
console.log(`- Số vòng lặp: ${interpResult.iterations}`);

// Binary Search để so sánh
const binaryResult = binarySearchTemp(tempSorted, targetTemp);
console.log(`Binary Search - So sánh:`);
console.log(`- Số phép so sánh: ${binaryResult.comparisons}`);

// Hiển thị quá trình tìm kiếm
console.log('\nQuá trình Interpolation Search:');
interpResult.searchPath.forEach(step => {
  console.log(`Vòng ${step.iteration}: [${step.left}..${step.right}] → pos=${step.interpolatedIndex} value=${step.value}°C`);
});
```

### Ví dụ 2: Tìm kiếm trong dữ liệu tài chính

```javascript
// Dữ liệu giá cổ phiếu theo ngày (tăng đều)
const stockPrices = Array.from({ length: 365 }, (_, i) => ({
  day: i + 1,
  price: 50000 + i * 100 + Math.sin(i * 0.02) * 1000, // Tăng đều với biến động nhỏ
  volume: 1000 + Math.random() * 500
}));

class StockAnalyzer {
  constructor(data) {
    this.data = data.sort((a, b) => a.price - b.price);
  }

  findDayByPrice(targetPrice, tolerance = 500) {
    // Sử dụng Interpolation Search để tìm giá gần nhất
    const result = this.findNearestPrice(targetPrice);
    
    if (result && Math.abs(result.price - targetPrice) <= tolerance) {
      return result;
    }
    
    return null;
  }

  findNearestPrice(targetPrice) {
    let left = 0;
    let right = this.data.length - 1;
    let nearest = null;
    let minDiff = Infinity;

    while (left <= right) {
      const leftPrice = this.data[left].price;
      const rightPrice = this.data[right].price;

      // Kiểm tra các phần tử hiện tại
      [this.data[left], this.data[right]].forEach(item => {
        const diff = Math.abs(item.price - targetPrice);
        if (diff < minDiff) {
          minDiff = diff;
          nearest = item;
        }
      });

      if (leftPrice === rightPrice || left === right) {
        break;
      }

      // Interpolation
      const ratio = (targetPrice - leftPrice) / (rightPrice - leftPrice);
      const interpolatedIndex = Math.floor(left + ratio * (right - left));
      const safeIndex = Math.max(left, Math.min(right, interpolatedIndex));

      const interpolatedItem = this.data[safeIndex];
      const diff = Math.abs(interpolatedItem.price - targetPrice);
      
      if (diff < minDiff) {
        minDiff = diff;
        nearest = interpolatedItem;
      }

      if (interpolatedItem.price === targetPrice) {
        return interpolatedItem;
      }

      if (interpolatedItem.price < targetPrice) {
        left = safeIndex + 1;
      } else {
        right = safeIndex - 1;
      }
    }

    return nearest;
  }

  findPriceRange(minPrice, maxPrice) {
    const startResult = interpolationSearchObject(this.data, minPrice, 'price');
    const endResult = interpolationSearchObject(this.data, maxPrice, 'price');

    let startIndex = startResult.found ? startResult.index : 0;
    let endIndex = endResult.found ? endResult.index : this.data.length - 1;

    // Điều chỉnh để bao gồm tất cả giá trong range
    while (startIndex > 0 && this.data[startIndex - 1].price >= minPrice) {
      startIndex--;
    }
    
    while (endIndex < this.data.length - 1 && this.data[endIndex + 1].price <= maxPrice) {
      endIndex++;
    }

    return this.data.slice(startIndex, endIndex + 1);
  }

  analyzeVolatility(days = 30) {
    const recent = this.data.slice(-days);
    const prices = recent.map(d => d.price);
    
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);

    return {
      period: days,
      meanPrice: mean.toFixed(0),
      volatility: stdDev.toFixed(0),
      volatilityPercent: ((stdDev / mean) * 100).toFixed(2),
      priceRange: {
        min: Math.min(...prices).toFixed(0),
        max: Math.max(...prices).toFixed(0)
      }
    };
  }
}

// Ví dụ sử dụng
const analyzer = new StockAnalyzer(stockPrices);

console.log('\n=== Phân tích cổ phiếu ===');

// Tìm ngày có giá gần 75,000
const targetPrice = 75000;
const nearestDay = analyzer.findNearestPrice(targetPrice);
console.log(`Ngày có giá gần ${targetPrice.toLocaleString()} nhất:`, nearestDay);

// Tìm các ngày trong khoảng giá 70,000 - 80,000
const priceRange = analyzer.findPriceRange(70000, 80000);
console.log(`\nSố ngày có giá từ 70k-80k: ${priceRange.length}`);
console.log('Vài ví dụ:', priceRange.slice(0, 3));

// Phân tích volatility
const volatility = analyzer.analyzeVolatility(30);
console.log('\nPhân tích volatility 30 ngày:', volatility);
```

### Ví dụ 3: Tìm kiếm trong cơ sở dữ liệu khách hàng

```javascript
// Giả lập database khách hàng với ID liên tục
const customerDatabase = Array.from({ length: 10000 }, (_, i) => ({
  id: 1000000 + i, // ID từ 1,000,000 đến 1,009,999
  name: `Customer ${i + 1}`,
  registrationDate: new Date(2020, 0, 1 + i).getTime(),
  creditScore: 300 + Math.floor(i * 0.05) + Math.random() * 50,
  lastPurchaseAmount: Math.floor(Math.random() * 10000) + 100
}));

class CustomerSearchEngine {
  constructor(database) {
    this.customers = database;
    this.byId = [...database].sort((a, b) => a.id - b.id);
    this.byScore = [...database].sort((a, b) => a.creditScore - b.creditScore);
    this.byDate = [...database].sort((a, b) => a.registrationDate - b.registrationDate);
  }

  findCustomerById(customerId) {
    // Vì ID liên tục, Interpolation Search rất hiệu quả
    const result = interpolationSearchObject(this.byId, customerId, 'id');
    return result.found ? result.object : null;
  }

  findCustomersByCreditScore(minScore, maxScore) {
    // Tìm range trong mảng đã sắp xếp theo credit score
    let startIndex = -1;
    let endIndex = -1;

    // Tìm start index
    let left = 0;
    let right = this.byScore.length - 1;
    
    while (left <= right) {
      const leftScore = this.byScore[left].creditScore;
      const rightScore = this.byScore[right].creditScore;
      
      if (minScore < leftScore) break;
      if (minScore > rightScore) break;
      
      if (leftScore === rightScore) {
        startIndex = leftScore >= minScore ? left : -1;
        break;
      }

      const ratio = (minScore - leftScore) / (rightScore - leftScore);
      const interpolatedIndex = Math.floor(left + ratio * (right - left));
      const safeIndex = Math.max(left, Math.min(right, interpolatedIndex));

      if (this.byScore[safeIndex].creditScore >= minScore) {
        startIndex = safeIndex;
        right = safeIndex - 1;
      } else {
        left = safeIndex + 1;
      }
    }

    // Điều chỉnh startIndex
    while (startIndex > 0 && this.byScore[startIndex - 1].creditScore >= minScore) {
      startIndex--;
    }

    // Tìm end index
    left = startIndex >= 0 ? startIndex : 0;
    right = this.byScore.length - 1;
    endIndex = -1;

    while (left <= right) {
      const leftScore = this.byScore[left].creditScore;
      const rightScore = this.byScore[right].creditScore;
      
      if (maxScore < leftScore) break;
      if (maxScore > rightScore) {
        endIndex = right;
        break;
      }
      
      if (leftScore === rightScore) {
        endIndex = leftScore <= maxScore ? right : -1;
        break;
      }

      const ratio = (maxScore - leftScore) / (rightScore - leftScore);
      const interpolatedIndex = Math.floor(left + ratio * (right - left));
      const safeIndex = Math.max(left, Math.min(right, interpolatedIndex));

      if (this.byScore[safeIndex].creditScore <= maxScore) {
        endIndex = safeIndex;
        left = safeIndex + 1;
      } else {
        right = safeIndex - 1;
      }
    }

    // Điều chỉnh endIndex
    while (endIndex < this.byScore.length - 1 && this.byScore[endIndex + 1].creditScore <= maxScore) {
      endIndex++;
    }

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return [];
    }

    return this.byScore.slice(startIndex, endIndex + 1);
  }

  findCustomersRegisteredBetween(startDate, endDate) {
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    // Sử dụng interpolation search trên mảng sắp xếp theo ngày
    const startResult = interpolationSearchObject(this.byDate, startTime, 'registrationDate');
    const endResult = interpolationSearchObject(this.byDate, endTime, 'registrationDate');

    let startIndex = 0;
    let endIndex = this.byDate.length - 1;

    // Tìm vị trí bắt đầu
    if (startResult.found) {
      startIndex = startResult.index;
    } else {
      // Tìm vị trí chèn
      for (let i = 0; i < this.byDate.length; i++) {
        if (this.byDate[i].registrationDate >= startTime) {
          startIndex = i;
          break;
        }
      }
    }

    // Tìm vị trí kết thúc
    if (endResult.found) {
      endIndex = endResult.index;
    } else {
      // Tìm vị trí chèn
      for (let i = this.byDate.length - 1; i >= 0; i--) {
        if (this.byDate[i].registrationDate <= endTime) {
          endIndex = i;
          break;
        }
      }
    }

    return this.byDate.slice(startIndex, endIndex + 1);
  }

  getCustomerStatistics() {
    const totalCustomers = this.customers.length;
    const avgCreditScore = this.customers.reduce((sum, c) => sum + c.creditScore, 0) / totalCustomers;
    
    const scoreRanges = {
      excellent: this.findCustomersByCreditScore(750, 850).length,
      good: this.findCustomersByCreditScore(650, 749).length,
      fair: this.findCustomersByCreditScore(550, 649).length,
      poor: this.findCustomersByCreditScore(300, 549).length
    };

    return {
      totalCustomers,
      avgCreditScore: avgCreditScore.toFixed(1),
      scoreDistribution: scoreRanges,
      idRange: {
        min: this.byId[0].id,
        max: this.byId[this.byId.length - 1].id
      }
    };
  }
}

// Ví dụ sử dụng
const searchEngine = new CustomerSearchEngine(customerDatabase);

console.log('\n=== Hệ thống tìm kiếm khách hàng ===');

// Tìm khách hàng theo ID
const customerId = 1005000;
const customer = searchEngine.findCustomerById(customerId);
console.log(`Khách hàng ID ${customerId}:`, customer ? customer.name : 'Không tìm thấy');

// Tìm khách hàng theo credit score
const goodCreditCustomers = searchEngine.findCustomersByCreditScore(700, 750);
console.log(`\nKhách hàng có credit score 700-750: ${goodCreditCustomers.length} người`);
console.log('Ví dụ:', goodCreditCustomers.slice(0, 3).map(c => ({ name: c.name, score: c.creditScore.toFixed(1) })));

// Tìm khách hàng đăng ký trong năm 2020
const year2020Customers = searchEngine.findCustomersRegisteredBetween('2020-01-01', '2020-12-31');
console.log(`\nKhách hàng đăng ký năm 2020: ${year2020Customers.length} người`);

// Thống kê tổng quát
const stats = searchEngine.getCustomerStatistics();
console.log('\nThống kê khách hàng:', stats);

// So sánh hiệu suất với Binary Search
function compareSearchMethods(searchEngine, targetId) {
  const data = searchEngine.byId;
  
  // Interpolation Search
  console.time('Interpolation Search');
  const interpResult = interpolationSearchObject(data, targetId, 'id');
  console.timeEnd('Interpolation Search');
  
  // Binary Search
  console.time('Binary Search');
  let left = 0;
  let right = data.length - 1;
  let binaryResult = { found: false };
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (data[mid].id === targetId) {
      binaryResult = { found: true, index: mid };
      break;
    }
    if (data[mid].id < targetId) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  console.timeEnd('Binary Search');
  
  return { interpResult, binaryResult };
}

console.log('\n=== So sánh hiệu suất ===');
const comparison = compareSearchMethods(searchEngine, 1005000);
console.log('Interpolation found:', comparison.interpResult.found);
console.log('Binary found:', comparison.binaryResult.found);
```

## Biến thể và tối ưu hóa

### 1. Quadratic Interpolation Search

```javascript
function quadraticInterpolationSearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right && target >= arr[left] && target <= arr[right]) {
    if (left === right) {
      return arr[left] === target ? left : -1;
    }

    // Sử dụng 3 điểm để interpolation bậc 2
    const mid = Math.floor((left + right) / 2);
    
    const x0 = left, y0 = arr[left];
    const x1 = mid, y1 = arr[mid];
    const x2 = right, y2 = arr[right];

    // Kiểm tra nếu dữ liệu không phù hợp cho quadratic interpolation
    if (y0 === y1 || y1 === y2 || y0 === y2) {
      // Fallback to linear interpolation
      const ratio = (target - y0) / (y2 - y0);
      const pos = Math.floor(left + ratio * (right - left));
      const safePos = Math.max(left, Math.min(right, pos));
      
      if (arr[safePos] === target) return safePos;
      
      if (arr[safePos] < target) {
        left = safePos + 1;
      } else {
        right = safePos - 1;
      }
      continue;
    }

    // Quadratic interpolation formula
    // f(x) = a*x^2 + b*x + c
    // Giải hệ phương trình để tìm a, b, c
    const denom = (x0 - x1) * (x0 - x2) * (x1 - x2);
    const a = (x2 * (y1 - y0) + x1 * (y0 - y2) + x0 * (y2 - y1)) / denom;
    const b = (x2 * x2 * (y0 - y1) + x1 * x1 * (y2 - y0) + x0 * x0 * (y1 - y2)) / denom;
    
    // Tìm x sao cho f(x) = target
    // a*x^2 + b*x + (c - target) = 0
    const c = y0 - a * x0 * x0 - b * x0;
    const discriminant = b * b - 4 * a * (c - target);
    
    let pos;
    if (discriminant < 0 || a === 0) {
      // Fallback to linear interpolation
      const ratio = (target - y0) / (y2 - y0);
      pos = Math.floor(left + ratio * (right - left));
    } else {
      const x_candidate1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x_candidate2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      
      // Chọn candidate trong range [left, right]
      if (x_candidate1 >= left && x_candidate1 <= right) {
        pos = Math.floor(x_candidate1);
      } else if (x_candidate2 >= left && x_candidate2 <= right) {
        pos = Math.floor(x_candidate2);
      } else {
        // Fallback to linear interpolation
        const ratio = (target - y0) / (y2 - y0);
        pos = Math.floor(left + ratio * (right - left));
      }
    }

    pos = Math.max(left, Math.min(right, pos));

    if (arr[pos] === target) {
      return pos;
    }

    if (arr[pos] < target) {
      left = pos + 1;
    } else {
      right = pos - 1;
    }
  }

  return -1;
}
```

### 2. Adaptive Interpolation Search

```javascript
class AdaptiveInterpolationSearch {
  constructor() {
    this.uniformityThreshold = 0.8;
    this.fallbackThreshold = 3;
  }

  search(arr, target) {
    // Kiểm tra tính đồng đều của dữ liệu
    const uniformity = this.calculateUniformity(arr);
    
    if (uniformity < this.uniformityThreshold) {
      // Dữ liệu không đồng đều, sử dụng Binary Search
      return this.binarySearch(arr, target);
    }

    return this.interpolationSearchWithFallback(arr, target);
  }

  calculateUniformity(arr) {
    if (arr.length < 3) return 1;

    const diffs = [];
    for (let i = 1; i < arr.length; i++) {
      diffs.push(arr[i] - arr[i - 1]);
    }

    const mean = diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
    const variance = diffs.reduce((sum, diff) => sum + Math.pow(diff - mean, 2), 0) / diffs.length;
    const stdDev = Math.sqrt(variance);

    // Coefficient of variation
    const cv = mean !== 0 ? stdDev / Math.abs(mean) : 0;
    
    // Uniformity score (0 = không đồng đều, 1 = hoàn toàn đồng đều)
    return Math.max(0, 1 - cv);
  }

  interpolationSearchWithFallback(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let iterations = 0;
    let badPredictions = 0;

    while (left <= right) {
      iterations++;

      if (target < arr[left] || target > arr[right]) {
        return -1;
      }

      if (left === right) {
        return arr[left] === target ? left : -1;
      }

      // Fallback to binary search if too many bad predictions
      if (badPredictions >= this.fallbackThreshold) {
        return this.binarySearchRange(arr, target, left, right);
      }

      const leftValue = arr[left];
      const rightValue = arr[right];

      if (leftValue === rightValue) {
        return leftValue === target ? left : -1;
      }

      // Interpolation
      const ratio = (target - leftValue) / (rightValue - leftValue);
      const predictedIndex = Math.floor(left + ratio * (right - left));
      const safeIndex = Math.max(left, Math.min(right, predictedIndex));

      // Kiểm tra chất lượng prediction
      const expectedRatio = (safeIndex - left) / (right - left);
      const predictionError = Math.abs(ratio - expectedRatio);
      
      if (predictionError > 0.3) { // Prediction không tốt
        badPredictions++;
      }

      if (arr[safeIndex] === target) {
        return safeIndex;
      }

      if (arr[safeIndex] < target) {
        left = safeIndex + 1;
      } else {
        right = safeIndex - 1;
      }
    }

    return -1;
  }

  binarySearch(arr, target) {
    return this.binarySearchRange(arr, target, 0, arr.length - 1);
  }

  binarySearchRange(arr, target, left, right) {
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (arr[mid] === target) {
        return mid;
      }

      if (arr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  }
}
```

### 3. Multi-Point Interpolation Search

```javascript
function multiPointInterpolationSearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    if (target < arr[left] || target > arr[right]) {
      return -1;
    }

    if (left === right) {
      return arr[left] === target ? left : -1;
    }

    // Sử dụng nhiều điểm để interpolation tốt hơn
    const points = [];
    const numPoints = Math.min(5, right - left + 1);
    
    for (let i = 0; i < numPoints; i++) {
      const index = left + Math.floor(i * (right - left) / (numPoints - 1));
      points.push({ x: index, y: arr[index] });
    }

    // Lagrange interpolation
    let predictedIndex = left;
    let bestDistance = Infinity;

    for (let i = left; i <= right; i++) {
      const interpolatedValue = lagrangeInterpolation(points, i);
      const distance = Math.abs(interpolatedValue - target);
      
      if (distance < bestDistance) {
        bestDistance = distance;
        predictedIndex = i;
      }
    }

    if (arr[predictedIndex] === target) {
      return predictedIndex;
    }

    if (arr[predictedIndex] < target) {
      left = predictedIndex + 1;
    } else {
      right = predictedIndex - 1;
    }
  }

  return -1;
}

function lagrangeInterpolation(points, x) {
  let result = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    let term = points[i].y;
    
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        term *= (x - points[j].x) / (points[i].x - points[j].x);
      }
    }
    
    result += term;
  }

  return result;
}
```

## So sánh với các thuật toán tìm kiếm khác

| Thuật toán | Tốt nhất | Trung bình | Xấu nhất | Bộ nhớ | Yêu cầu | Phù hợp |
|------------|----------|------------|----------|---------|---------|---------|
| **Interpolation Search** | O(1) | O(log log n) | O(n) | O(1) | Sắp xếp, phân bố đều | Dữ liệu số phân bố đều |
| **Binary Search** | O(1) | O(log n) | O(log n) | O(1) | Sắp xếp | Mục đích chung |
| **Jump Search** | O(1) | O(√n) | O(√n) | O(1) | Sắp xếp | Sequential access |
| **Linear Search** | O(1) | O(n) | O(n) | O(1) | Không | Dữ liệu nhỏ, chưa sắp xếp |
| **Exponential Search** | O(1) | O(log n) | O(log n) | O(1) | Sắp xếp | Không biết kích thước |

## Phân tích độ phức tạp

### Độ phức tạp thời gian:
- **Tốt nhất**: O(1) - tìm ngay lần đầu
- **Trung bình**: O(log log n) - với dữ liệu phân bố đều
- **Xấu nhất**: O(n) - với dữ liệu phân bố không đều

### Độ phức tạp không gian:
- **Luôn luôn**: O(1) - chỉ dùng vài biến

### Phân tích toán học chi tiết:
```
Với dữ liệu phân bố đều:
- Mỗi lần chia, kích thước tìm kiếm giảm exponentially
- log log n iterations trung bình

Ví dụ với n = 1,000,000:
- Binary Search: log₂(1,000,000) ≈ 20 comparisons
- Interpolation Search: log₂(log₂(1,000,000)) ≈ log₂(20) ≈ 4 comparisons
- Tăng tốc: 5x

Với dữ liệu không đều:
- Có thể degradate thành O(n) - như Linear Search
- Quan trọng phải detect và fallback
```

## Khi nào nên sử dụng Interpolation Search

### Nên sử dụng khi:
- **Dữ liệu số** phân bố tương đối đều
- **Mảng lớn** (> 1000 phần tử) để thấy benefit
- **Tìm kiếm thường xuyên** trong cùng dataset
- **Biết trước tính chất** của dữ liệu
- **Cần hiệu suất cao** hơn Binary Search

### Không nên sử dụng khi:
- **Dữ liệu phân bố không đều** (skewed, clustered)
- **Dữ liệu không phải số** hoặc không có metric distance
- **Mảng nhỏ** (< 100 phần tử)
- **Dữ liệu thay đổi thường xuyên**
- **Không chắc chắn về phân bố** dữ liệu

## Tối ưu hóa thực tế

### 1. Hybrid Search Strategy

```javascript
class HybridSearchEngine {
  constructor(data, field) {
    this.data = data.sort((a, b) => a[field] - b[field]);
    this.field = field;
    this.uniformityScore = this.calculateUniformity();
    this.sampleSize = Math.min(100, Math.floor(data.length * 0.1));
  }

  search(target) {
    // Chọn thuật toán dựa trên đặc tính dữ liệu
    if (this.uniformityScore > 0.8 && this.data.length > 1000) {
      return this.interpolationSearch(target);
    } else if (this.data.length > 100) {
      return this.binarySearch(target);
    } else {
      return this.linearSearch(target);
    }
  }

  calculateUniformity() {
    const sample = this.data.slice(0, this.sampleSize);
    if (sample.length < 3) return 0;

    const diffs = [];
    for (let i = 1; i < sample.length; i++) {
      diffs.push(sample[i][this.field] - sample[i-1][this.field]);
    }

    const mean = diffs.reduce((sum, d) => sum + d, 0) / diffs.length;
    const variance = diffs.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / diffs.length;
    
    return mean !== 0 ? Math.max(0, 1 - Math.sqrt(variance) / Math.abs(mean)) : 0;
  }

  interpolationSearch(target) {
    // Implementation với error handling và fallback
    return safeInterpolationSearch(this.data.map(item => item[this.field]), target);
  }

  binarySearch(target) {
    // Standard binary search implementation
    let left = 0;
    let right = this.data.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midValue = this.data[mid][this.field];

      if (midValue === target) return mid;
      
      if (midValue < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  }

  linearSearch(target) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i][this.field] === target) {
        return i;
      }
    }
    return -1;
  }
}
```

### 2. Performance Monitoring

```javascript
class PerformanceOptimizedSearch {
  constructor() {
    this.searchHistory = [];
    this.adaptationEnabled = true;
  }

  search(arr, target, algorithm = 'auto') {
    const startTime = performance.now();
    let result;
    let actualAlgorithm = algorithm;

    if (algorithm === 'auto') {
      actualAlgorithm = this.selectOptimalAlgorithm(arr, target);
    }

    switch (actualAlgorithm) {
      case 'interpolation':
        result = this.interpolationSearch(arr, target);
        break;
      case 'binary':
        result = this.binarySearch(arr, target);
        break;
      default:
        result = this.binarySearch(arr, target);
    }

    const endTime = performance.now();
    const searchTime = endTime - startTime;

    this.recordPerformance({
      algorithm: actualAlgorithm,
      arraySize: arr.length,
      found: result !== -1,
      searchTime,
      target
    });

    return result;
  }

  selectOptimalAlgorithm(arr, target) {
    // Phân tích lịch sử để chọn thuật toán tối ưu
    if (this.searchHistory.length < 10) {
      return 'binary'; // Default safe choice
    }

    const recentPerformance = this.searchHistory.slice(-50);
    const interpolationAvg = this.getAverageTime(recentPerformance, 'interpolation');
    const binaryAvg = this.getAverageTime(recentPerformance, 'binary');

    if (interpolationAvg > 0 && binaryAvg > 0) {
      return interpolationAvg < binaryAvg ? 'interpolation' : 'binary';
    }

    // Kiểm tra uniformity nếu chưa có data
    const uniformity = this.quickUniformityCheck(arr);
    return uniformity > 0.7 ? 'interpolation' : 'binary';
  }

  getAverageTime(history, algorithm) {
    const records = history.filter(h => h.algorithm === algorithm);
    if (records.length === 0) return 0;
    return records.reduce((sum, r) => sum + r.searchTime, 0) / records.length;
  }

  quickUniformityCheck(arr) {
    if (arr.length < 10) return 0;
    
    const step = Math.floor(arr.length / 10);
    const samples = [];
    
    for (let i = 0; i < arr.length; i += step) {
      samples.push(arr[i]);
    }

    const diffs = [];
    for (let i = 1; i < samples.length; i++) {
      diffs.push(samples[i] - samples[i-1]);
    }

    const mean = diffs.reduce((sum, d) => sum + d, 0) / diffs.length;
    const variance = diffs.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / diffs.length;
    
    return mean !== 0 ? Math.max(0, 1 - Math.sqrt(variance) / Math.abs(mean)) : 0;
  }

  recordPerformance(record) {
    this.searchHistory.push(record);
    
    // Keep only recent 1000 records
    if (this.searchHistory.length > 1000) {
      this.searchHistory.shift();
    }
  }

  getPerformanceReport() {
    if (this.searchHistory.length === 0) return null;

    const byAlgorithm = {};
    this.searchHistory.forEach(record => {
      if (!byAlgorithm[record.algorithm]) {
        byAlgorithm[record.algorithm] = {
          count: 0,
          totalTime: 0,
          successRate: 0,
          successCount: 0
        };
      }
      
      const stats = byAlgorithm[record.algorithm];
      stats.count++;
      stats.totalTime += record.searchTime;
      if (record.found) stats.successCount++;
    });

    Object.keys(byAlgorithm).forEach(alg => {
      const stats = byAlgorithm[alg];
      stats.averageTime = stats.totalTime / stats.count;
      stats.successRate = stats.successCount / stats.count;
    });

    return {
      totalSearches: this.searchHistory.length,
      algorithms: byAlgorithm,
      recommendation: this.getRecommendation(byAlgorithm)
    };
  }

  getRecommendation(stats) {
    const algorithms = Object.keys(stats);
    if (algorithms.length === 0) return 'binary';

    let best = algorithms[0];
    let bestScore = this.calculateScore(stats[best]);

    for (let i = 1; i < algorithms.length; i++) {
      const score = this.calculateScore(stats[algorithms[i]]);
      if (score > bestScore) {
        best = algorithms[i];
        bestScore = score;
      }
    }

    return best;
  }

  calculateScore(stats) {
    // Score dựa trên thời gian và tỷ lệ thành công
    const timeScore = 1 / (stats.averageTime + 0.001); // Avoid division by zero
    const successScore = stats.successRate;
    return timeScore * successScore;
  }
}
```

## Tài liệu tham khảo

- [Wikipedia - Interpolation Search](https://en.wikipedia.org/wiki/Interpolation_search)
- [GeeksforGeeks - Interpolation Search](https://www.geeksforgeeks.org/interpolation-search/)
- [Khan Academy - Search Algorithms](https://www.khanacademy.org/computing/computer-science/algorithms)
- [MIT OpenCourseWare - Advanced Data Structures](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-851-advanced-data-structures-spring-2012/)
- [Algorithm Analysis - Interpolation Search](https://www.cs.usfca.edu/~galles/visualization/Search.html)
- [ResearchGate - Interpolation Search Variants](https://www.researchgate.net/publication/220617430_Interpolation_search)
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)

---

*Post ID: lba838hd27cdlrq*  
*Category: Searches Algorithms*  
*Created: 22/8/2025*  
*Updated: 29/8/2025*
