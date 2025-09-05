---
title: "Disjoint Set / Union-Find (Tập Rời Rạc / Hợp Tìm)"
postId: "zcq01olxyd89jkp"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Disjoint Set / Union-Find (Tập Rời Rạc / Hợp Tìm)


## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Disjoint Set** là gì và cách nó quản lý các nhóm riêng biệt.
- Biết cách dùng các thao tác chính: **tạo nhóm**, **tìm nhóm**, **hợp nhóm**, **kiểm tra kết nối**.
- Áp dụng Disjoint Set vào các bài toán thực tế như kiểm tra kết nối mạng hay tìm cách xây đường rẻ nhất.
- Hiểu cách tối ưu để Disjoint Set chạy nhanh hơn.

## 📚 Giới Thiệu

**Disjoint Set (Union-Find)** là một cách tổ chức và quản lý các **nhóm riêng biệt** (không chồng chéo nhau). Nó giúp kiểm tra nhanh xem hai phần tử có thuộc cùng một nhóm hay không, hoặc hợp hai nhóm lại thành một.

### Ví dụ dễ hiểu
Hãy nghĩ Disjoint Set như **các nhóm bạn trong lớp học**:
- **Ban đầu**: Mỗi học sinh là một nhóm riêng.
- **Kết bạn**: Hai nhóm bạn hợp lại thành một nhóm lớn hơn.
- **Hỏi nhanh**: "Hai bạn A và B có chung nhóm không?" Disjoint Set trả lời ngay!

### Các thao tác chính
- **MakeSet(x)**: Tạo một nhóm mới chỉ có x.
- **Find(x)**: Tìm "đại diện" của nhóm chứa x.
- **Union(x, y)**: Hợp hai nhóm chứa x và y thành một.
- **Connected(x, y)**: Kiểm tra x và y có chung nhóm không.

Disjoint Set được dùng trong nhiều lĩnh vực: mạng xã hội, kết nối máy tính, xử lý ảnh, hoặc bài toán về đồ thị.

![Disjoint Set](https://upload.wikimedia.org/wikipedia/commons/6/67/Dsu_disjoint_sets_init.svg)

*Hình ảnh: MakeSet tạo 8 nhóm riêng biệt, mỗi nhóm chỉ có một phần tử.*

![Disjoint Set After Union](https://upload.wikimedia.org/wikipedia/commons/a/ac/Dsu_disjoint_sets_final.svg)

*Hình ảnh: Sau các thao tác Union, một số nhóm được gộp lại với nhau.*

## 🔧 Khái Niệm Cơ Bản

### 1. **Tập Hợp Rời Rạc (Disjoint Sets)**

**Disjoint Sets** là các nhóm không có phần tử chung. Ví dụ:
- Ban đầu: Mỗi học sinh là một nhóm riêng {A}, {B}, {C}.
- Sau khi hợp nhóm: Có thể thành {A, B}, {C}.

**Đặc điểm**:
- Các nhóm không giao nhau.
- Có thể gộp các nhóm lại qua thời gian.

### 2. **Cấu Trúc Cây**

Disjoint Set biểu diễn các nhóm bằng **cây**:
- Mỗi nhóm là một cây, **gốc cây** là đại diện của nhóm.
- Mỗi phần tử trỏ về "cha" của nó, gốc cây trỏ về chính nó.
- Hai phần tử cùng nhóm nếu chúng có cùng gốc.

**Ví dụ**:
```
Nhóm {A, B, C} được biểu diễn:
    A (gốc)
   / \
  B   C
```

### 3. **Các Thao Tác Cơ Bản**

#### **MakeSet(x)**: Tạo nhóm mới
- Tạo nhóm chỉ chứa x.
- Ví dụ: `MakeSet(A)` tạo nhóm {A}.
- Nhanh, chỉ cần gán x là gốc của chính nó.

#### **Find(x)**: Tìm đại diện
- Tìm gốc của nhóm chứa x bằng cách đi từ x lên đến gốc.
- Ví dụ: Nếu B trỏ đến A, thì gốc của B là A.

#### **Union(x, y)**: Hợp nhóm
- Gộp hai nhóm chứa x và y.
- Ví dụ: Gộp nhóm {A, B} và {C} thành {A, B, C}.

#### **Connected(x, y)**: Kiểm tra kết nối
- Kiểm tra xem x và y có cùng nhóm không bằng cách so sánh gốc của chúng.

### 4. **Tối Ưu Hóa**

#### **Union by Rank**
- **Vấn đề**: Nếu gộp nhóm không cẩn thận, cây có thể trở nên rất cao, làm chậm thao tác.
- **Cách làm**: Luôn gắn cây thấp vào cây cao để giữ cây cân bằng.
- **Lợi ích**: Làm cho thao tác nhanh hơn.

#### **Path Compression**
- **Vấn đề**: Tìm gốc có thể chậm nếu cây cao.
- **Cách làm**: Khi tìm gốc, làm cho mọi phần tử trên đường đi trỏ trực tiếp đến gốc.
- **Lợi ích**: Giảm thời gian cho các lần tìm sau.

**Ví dụ Path Compression**:
```
Trước:     Sau:
    A          A
   /         /|\
  B         B C D
 /
C
/
D
```

### 5. **Hiệu Suất**

| Tối ưu hóa | Tốc độ tìm | Tốc độ gộp |
|------------|------------|------------|
| Không tối ưu | Chậm (O(n)) | Chậm (O(n)) |
| Union by Rank | Nhanh hơn (O(log n)) | Nhanh hơn (O(log n)) |
| Cả hai tối ưu | Rất nhanh (gần O(1)) | Rất nhanh (gần O(1)) |

## 💻 Cài Đặt Disjoint Set Trong JavaScript

### **Cài đặt cơ bản (Array-based)**

```javascript
class DisjointSet {
  constructor(size) {
    this.parent = new Array(size).fill(0).map((_, i) => i); // Mỗi phần tử là cha của chính nó
    this.rank = new Array(size).fill(1); // Theo dõi độ cao cây
    this.size = size;
    this.componentCount = size; // Số nhóm
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path Compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    this.componentCount--;
  }

  connected(x, y) {
    return this.find(x) === this.find(y);
  }

  getComponentCount() {
    return this.componentCount;
  }
}
```

### **Cài đặt nâng cao (Object-based)**

```javascript
class FlexibleDisjointSet {
  constructor() {
    this.parent = new Map();
    this.rank = new Map();
    this.componentCount = 0;
  }

  makeSet(x) {
    if (this.parent.has(x)) return;
    this.parent.set(x, x);
    this.rank.set(x, 1);
    this.componentCount++;
  }

  find(x) {
    if (!this.parent.has(x)) {
      throw new Error(`Element ${x} not found in any set`);
    }
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x)));
    }
    return this.parent.get(x);
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    const rankX = this.rank.get(rootX);
    const rankY = this.rank.get(rootY);

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }

    this.componentCount--;
    return true;
  }

  connected(x, y) {
    try {
      return this.find(x) === this.find(y);
    } catch {
      return false;
    }
  }

  getSet(x) {
    const root = this.find(x);
    const result = [];
    for (let [element, _] of this.parent) {
      if (this.find(element) === root) {
        result.push(element);
      }
    }
    return result;
  }

  getAllSets() {
    const sets = new Map();
    for (let [element, _] of this.parent) {
      const root = this.find(element);
      if (!sets.has(root)) {
        sets.set(root, []);
      }
      sets.get(root).push(element);
    }
    return Array.from(sets.values());
  }

  getStats() {
    const allSets = this.getAllSets();
    const sizes = allSets.map(set => set.length);
    return {
      totalElements: this.parent.size,
      componentCount: this.componentCount,
      largestSetSize: Math.max(...sizes),
      smallestSetSize: Math.min(...sizes),
      averageSetSize: sizes.reduce((a, b) => a + b, 0) / sizes.length
    };
  }
}
```

### **Ví dụ sử dụng cơ bản**

```javascript
const ds = new DisjointSet(6); // Các phần tử 0, 1, 2, 3, 4, 5
console.log("Số nhóm ban đầu:", ds.getComponentCount()); // 6
ds.union(0, 1); // Gộp {0} và {1}
ds.union(2, 3); // Gộp {2} và {3}
ds.union(0, 2); // Gộp {0, 1} và {2, 3}
console.log("Số nhóm sau gộp:", ds.getComponentCount()); // 3
console.log("0 và 3 có cùng nhóm?", ds.connected(0, 3)); // true
console.log("0 và 4 có cùng nhóm?", ds.connected(0, 4)); // false

const flexDS = new FlexibleDisjointSet();
['Alice', 'Bob', 'Charlie', 'David', 'Eve'].forEach(name => {
  flexDS.makeSet(name);
});
flexDS.union('Alice', 'Bob');
flexDS.union('Charlie', 'David');
console.log("Nhóm của Alice:", flexDS.getSet('Alice')); // ['Alice', 'Bob']
console.log("Tất cả nhóm:", flexDS.getAllSets());
console.log("Thống kê:", flexDS.getStats());
```

## 🏆 Bài Tập Thực Hành

### **Bài tập 1: Hệ thống phát hiện lỗi mạng**

**Mô tả**: Xây dựng hệ thống giám sát mạng máy tính để kiểm tra kết nối giữa các máy và phát hiện khi mạng bị chia cắt.

```javascript
class NetworkMonitor {
  constructor() {
    this.network = new FlexibleDisjointSet();
    this.computers = new Map();
  }

  addComputer(id, info = {}) {
    if (this.computers.has(id)) {
      console.log(`⚠️ Máy ${id} đã tồn tại`);
      return false;
    }
    this.network.makeSet(id);
    this.computers.set(id, {
      id,
      name: info.name || `Máy-${id}`,
      status: 'online'
    });
    console.log(`➕ Thêm máy ${id} (${this.computers.get(id).name})`);
    return true;
  }

  connect(computerA, computerB) {
    try {
      if (this.network.connected(computerA, computerB)) {
        console.log(`🔗 ${computerA} và ${computerB} đã kết nối`);
        return false;
      }
      this.network.union(computerA, computerB);
      console.log(`✅ Kết nối ${computerA} ↔ ${computerB}`);
      console.log(`📊 Mạng có ${this.network.getComponentCount()} nhóm`);
      return true;
    } catch (error) {
      console.log(`❌ Kết nối thất bại: ${error.message}`);
      return false;
    }
  }

  canCommunicate(computerA, computerB) {
    try {
      const connected = this.network.connected(computerA, computerB);
      const statusA = this.computers.get(computerA)?.status;
      const statusB = this.computers.get(computerB)?.status;
      const canTalk = connected && statusA === 'online' && statusB === 'online';
      console.log(`🔍 Kiểm tra ${computerA} → ${computerB}: ${canTalk ? '✅ KẾT NỐI ĐƯỢC' : '❌ KHÔNG KẾT NỐI'}`);
      return canTalk;
    } catch (error) {
      console.log(`❌ ${error.message}`);
      return false;
    }
  }

  getNetworkGroup(computerId) {
    try {
      const group = this.network.getSet(computerId);
      console.log(`🌐 Nhóm của ${computerId}:`, group);
      return group;
    } catch (error) {
      console.log(`❌ ${error.message}`);
      return [];
    }
  }

  setComputerStatus(computerId, status) {
    if (!this.computers.has(computerId)) {
      console.log(`❌ Máy ${computerId} không tồn tại`);
      return false;
    }
    this.computers.get(computerId).status = status;
    console.log(`🔄 ${computerId}: ${status}`);
    return true;
  }

  checkNetworkFragmentation() {
    const componentCount = this.network.getComponentCount();
    console.log(`\n🔍 === KIỂM TRA MẠNG ===`);
    console.log(`💻 Tổng máy: ${this.computers.size}`);
    console.log(`🌐 Số nhóm: ${componentCount}`);
    console.log(componentCount === 1 ? `✅ Mạng ổn` : `⚠️ Mạng bị chia cắt`);
    return { networkGroups: componentCount };
  }
}

const monitor = new NetworkMonitor();
console.log('🏗️ === THIẾT LẬP MẠNG ===');
const computers = [
  { id: 'PC001', info: { name: 'Server' }},
  { id: 'PC002', info: { name: 'Laptop' }},
  { id: 'PC003', info: { name: 'Desktop' }}
];
computers.forEach(({ id, info }) => monitor.addComputer(id, info));
monitor.connect('PC001', 'PC002');
monitor.canCommunicate('PC001', 'PC002'); // true
monitor.canCommunicate('PC001', 'PC003'); // false
monitor.checkNetworkFragmentation();
monitor.connect('PC002', 'PC003');
monitor.checkNetworkFragmentation();
```

### **Bài tập 2: Thuật toán Kruskal tìm cây khung tối thiểu**

**Mô tả**: Tìm cách kết nối các thành phố với chi phí thấp nhất bằng thuật toán Kruskal.

```javascript
class NetworkBuilder {
  constructor() {
    this.cities = new Set();
    this.routes = [];
    this.disjointSet = null;
  }

  addCity(cityName) {
    if (this.cities.has(cityName)) {
      console.log(`⚠️ Thành phố ${cityName} đã tồn tại`);
      return false;
    }
    this.cities.add(cityName);
    console.log(`🏙️ Thêm thành phố: ${cityName}`);
    return true;
  }

  addRoute(cityA, cityB, cost) {
    if (!this.cities.has(cityA) || !this.cities.has(cityB)) {
      console.log(`❌ Thành phố không tồn tại`);
      return false;
    }
    this.routes.push({ from: cityA, to: cityB, cost });
    console.log(`🛣️ Thêm tuyến: ${cityA} ↔ ${cityB} ($${cost}M)`);
    return true;
  }

  findMinimumSpanningTree() {
    if (this.cities.size === 0) {
      console.log('❌ Không có thành phố');
      return null;
    }
    console.log('\n🌲 === TÌM CÂY KHUNG TỐI THIỂU ===');
    const sortedRoutes = [...this.routes].sort((a, b) => a.cost - b.cost);
    this.disjointSet = new FlexibleDisjointSet();
    Array.from(this.cities).forEach(city => this.disjointSet.makeSet(city));

    const mst = [];
    let totalCost = 0;

    for (const route of sortedRoutes) {
      if (!this.disjointSet.connected(route.from, route.to)) {
        mst.push(route);
        totalCost += route.cost;
        this.disjointSet.union(route.from, route.to);
        console.log(`✅ Thêm tuyến: ${route.from} ↔ ${route.to} ($${route.cost}M)`);
        if (mst.length === this.cities.size - 1) break;
      }
    }

    console.log(`\n🎯 === KẾT QUẢ ===`);
    console.log(`💰 Tổng chi phí: $${totalCost}M`);
    console.log(`🛣️ Các tuyến:`, mst.map(r => `${r.from} ↔ ${r.to}`));
    return { mst, totalCost };
  }
}

const builder = new NetworkBuilder();
console.log('🏗️ === XÂY DỰNG MẠNG LƯỚI ===');
const cities = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng'];
cities.forEach(city => builder.addCity(city));
const routes = [
  ['Hà Nội', 'Hải Phòng', 120],
  ['Hà Nội', 'Đà Nẵng', 350],
  ['Hà Nội', 'TP.HCM', 450],
  ['TP.HCM', 'Đà Nẵng', 300]
];
routes.forEach(([from, to, cost]) => builder.addRoute(from, to, cost));
builder.findMinimumSpanningTree();
```

## 🔑 Điểm Quan Trọng và Lỗi Thường Gặp

### **Những điểm quan trọng**
1. **Hiểu cách hoạt động**:
   - Disjoint Set quản lý các nhóm tách biệt.
   - Union gộp nhóm, Find tìm đại diện nhóm.

2. **Tối ưu là cần thiết**:
   - **Path Compression** giúp tìm nhanh hơn.
   - **Union by Rank** giữ cây cân bằng.

3. **Kiểm tra cẩn thận**:
   - Đảm bảo phần tử tồn tại trước khi thao tác.

### **Lỗi thường gặp**
1. **Quên Path Compression**:
   - Làm chậm thao tác Find.
   - **Sửa**: Gán trực tiếp tất cả phần tử về gốc khi tìm.

2. **Union không đúng**:
   - Gộp ngẫu nhiên có thể làm cây mất cân bằng.
   - **Sửa**: Dùng Union by Rank.

3. **Khởi tạo sai**:
   - Không gán mỗi phần tử là cha của chính nó.
   - **Sửa**: Khởi tạo `parent[i] = i`.

### **Mẹo tránh lỗi**
- Vẽ sơ đồ cây trước khi code.
- Kiểm tra với dữ liệu nhỏ.
- Dùng đúng phiên bản (Array-based cho số nguyên, Object-based cho dữ liệu linh hoạt).

## 📝 Bài Tập Về Nhà

### **Bài tập 1: Hệ thống quản lý nhóm học tập**

**Mô tả**: Quản lý các nhóm học tập, cho phép sinh viên tham gia, rời nhóm, hoặc hợp nhóm.

**Yêu cầu**:
- Thêm sinh viên và nhóm học.
- Cho phép sinh viên tham gia/lời nhóm.
- Hợp nhóm cùng môn học.
- Xem thông tin nhóm.

**Ví dụ**:
```javascript
const manager = new StudyGroupManager();
manager.addStudent('SV001', 'Nguyễn Văn An', 'CNTT', 2);
manager.createGroup('DataStruct_01', 'Cấu trúc dữ liệu', 5);
manager.joinGroup('SV001', 'DataStruct_01');
console.log(manager.findStudentGroup('SV001')); // 'DataStruct_01'
manager.leaveGroup('SV001', 'DataStruct_01');
console.log(manager.findStudentGroup('SV001')); // null
```

### **Bài tập 2: Phát hiện gian lận mạng xã hội**

**Mô tả**: Phát hiện các nhóm tài khoản giả dựa trên tương tác giống nhau.

**Yêu cầu**:
- Thêm người dùng và tương tác.
- Đánh dấu tài khoản đáng ngờ.
- Phát hiện nhóm tài khoản giả.
- Báo cáo kết quả.

**Ví dụ**:
```javascript
const detector = new BotNetworkDetector();
detector.addUser('bot_001', { createdAt: '2023-01-15' });
detector.addInteraction('bot_001', 'bot_002', 'like', '2023-01-16');
detector.flagSuspiciousUser('bot_001', 'rapid_follower_growth');
detector.detectBotClusters(0.7);
```

\---

**🎉 Chúc mừng bạn đã học xong Disjoint Set!**

Disjoint Set là công cụ mạnh mẽ để quản lý các nhóm và kết nối. Hãy thực hành các bài tập để hiểu rõ hơn và khám phá các ứng dụng thú vị!



---

*Post ID: zcq01olxyd89jkp*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
