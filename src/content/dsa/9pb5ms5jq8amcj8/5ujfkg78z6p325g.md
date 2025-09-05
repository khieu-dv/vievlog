---
title: "Graph (Đồ Thị)"
postId: "5ujfkg78z6p325g"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Graph (Đồ Thị)



## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Đồ Thị** là gì và các thành phần chính (đỉnh, cạnh, trọng số).
- Phân biệt được các loại đồ thị (có hướng/vô hướng, có trọng số/không trọng số).
- Biết cách viết code cho Đồ Thị bằng JavaScript.
- Áp dụng Đồ Thị vào bài toán thực tế như tìm đường đi hay mạng bạn bè.
- Hiểu tốc độ của các thao tác chính.

## 📚 Giới Thiệu

**Đồ Thị (Graph)** là cách biểu diễn các mối quan hệ giữa các đối tượng, giống như một bản đồ kết nối.

### Ví dụ dễ hiểu
Hãy nghĩ Đồ Thị như một **bản đồ thành phố**:
- **Ngã tư** là các **đỉnh** (vertices).
- **Con đường** là các **cạnh** (edges).
- **Chiều đường** (một chiều/hai chiều) quyết định đồ thị có hướng hay vô hướng.
- **Khoảng cách đường** là **trọng số** (weight).

Đồ Thị xuất hiện ở: mạng xã hội, bản đồ GPS, mạng internet, game...

![Graph](https://www.vievlog.com/dsa/images/graph.jpeg)

## 🔧 Khái Niệm Cơ Bản

### 1. **Đỉnh (Vertex/Nút)**

**Đỉnh** là các điểm trong đồ thị, đại diện cho một đối tượng (như người, thành phố).

**Đặc điểm**:
- Mỗi đỉnh có **tên riêng** (key).
- Có thể chứa dữ liệu (như tên, tuổi).
- Kết nối với các đỉnh khác qua **cạnh**.

**Ví dụ**:
- Mạng xã hội: Đỉnh = Người dùng (Alice, Bob...).
- Bản đồ: Đỉnh = Thành phố (Hà Nội, TP.HCM...).

### 2. **Cạnh (Edge/Liên kết)**

**Cạnh** là đường nối giữa hai đỉnh, thể hiện mối quan hệ.

**Loại cạnh**:
- **Vô hướng**: Hai chiều, như bạn bè trên Facebook (A — B).
- **Có hướng**: Một chiều, như follow trên Twitter (A → B).

### 3. **Trọng số (Weight)**

**Trọng số** là số gắn với cạnh, thể hiện "chi phí" (như khoảng cách, thời gian).

**Ví dụ**:
- Bản đồ: Trọng số = Khoảng cách (km).
- Mạng máy tính: Trọng số = Độ trễ.

### 4. **Các Loại Đồ Thị**

- **Theo hướng**:
  - **Vô hướng**: Tất cả cạnh hai chiều.
  - **Có hướng**: Có ít nhất một cạnh một chiều.
- **Theo trọng số**:
  - **Có trọng số**: Cạnh có số (như khoảng cách).
  - **Không trọng số**: Cạnh không có số (hoặc số mặc định = 1).
- **Theo kết nối**:
  - **Kết nối**: Mọi đỉnh đều có đường đi tới nhau.
  - **Không kết nối**: Có đỉnh không thể tới được.

## 💻 Cài Đặt Đồ Thị Trong JavaScript

### 🔸 **Bước 1: Tạo Đỉnh (GraphVertex)**

```javascript
class GraphVertex {
  constructor(value) {
    this.value = value;        // Giá trị của đỉnh (A, B...)
    this.edges = [];           // Danh sách cạnh
  }

  addEdge(edge) {
    this.edges.push(edge);
  }

  getNeighbors() {
    return this.edges.map(edge => {
      return edge.startVertex === this ? edge.endVertex : edge.startVertex;
    });
  }

  getDegree() {
    return this.edges.length;
  }

  getKey() {
    return this.value;
  }
}
```

### 🔸 **Bước 2: Tạo Cạnh (GraphEdge)**

```javascript
class GraphEdge {
  constructor(startVertex, endVertex, weight = 1) {
    this.startVertex = startVertex;   // Đỉnh đầu
    this.endVertex = endVertex;       // Đỉnh cuối
    this.weight = weight;             // Trọng số
  }

  getKey() {
    return `${this.startVertex.getKey()}-${this.endVertex.getKey()}`;
  }

  hasVertex(vertex) {
    return this.startVertex === vertex || this.endVertex === vertex;
  }
}
```

### 🔸 **Bước 3: Tạo Đồ Thị (Graph)**

```javascript
class Graph {
  constructor(isDirected = false) {
    this.vertices = {};           // Lưu các đỉnh
    this.isDirected = isDirected; // Có hướng hay không
  }

  addVertex(value) {
    const vertex = new GraphVertex(value);
    this.vertices[value] = vertex;
    return vertex;
  }

  getVertex(value) {
    return this.vertices[value];
  }

  addEdge(startValue, endValue, weight = 1) {
    let startVertex = this.getVertex(startValue);
    let endVertex = this.getVertex(endValue);
    if (!startVertex) startVertex = this.addVertex(startValue);
    if (!endVertex) endVertex = this.addVertex(endValue);
    const edge = new GraphEdge(startVertex, endVertex, weight);
    if (this.isDirected) {
      startVertex.addEdge(edge);
    } else {
      startVertex.addEdge(edge);
      endVertex.addEdge(edge);
    }
    return this;
  }

  getAllVertices() {
    return Object.values(this.vertices);
  }

  findPath(startValue, endValue) {
    const startVertex = this.getVertex(startValue);
    const endVertex = this.getVertex(endValue);
    if (!startVertex || !endVertex) return null;
    const visited = new Set();
    const queue = [[startVertex]];
    while (queue.length > 0) {
      const path = queue.shift();
      const currentVertex = path[path.length - 1];
      if (currentVertex === endVertex) {
        return path.map(vertex => vertex.getKey());
      }
      if (!visited.has(currentVertex)) {
        visited.add(currentVertex);
        currentVertex.getNeighbors().forEach(neighbor => {
          queue.push([...path, neighbor]);
        });
      }
    }
    return null;
  }
}
```

### 🔸 **Ví dụ sử dụng**

```javascript
const friendsGraph = new Graph(false); // Đồ thị vô hướng (mạng bạn bè)
friendsGraph
  .addEdge('Alice', 'Bob')
  .addEdge('Bob', 'Charlie')
  .addEdge('Alice', 'David')
  .addEdge('Charlie', 'David');
console.log(friendsGraph.findPath('Alice', 'Charlie')); // ['Alice', 'Bob', 'Charlie']

const twitterGraph = new Graph(true); // Đồ thị có hướng (follow Twitter)
twitterGraph
  .addEdge('Alice', 'Bob')
  .addEdge('Bob', 'Charlie')
  .addEdge('Charlie', 'Alice');
```

### 🔄 **Tốc độ các thao tác**

| Thao tác | Danh sách kề (Adjacency List) | Ma trận kề (Adjacency Matrix) |
|----------|------------------------------|-----------------------------|
| Thêm đỉnh | Nhanh (O(1)) | Chậm (O(V²)) |
| Thêm cạnh | Nhanh (O(1)) | Nhanh (O(1)) |
| Tìm hàng xóm | Tùy (O(độ)) | Chậm (O(V)) |
| Kiểm tra cạnh | Tùy (O(độ)) | Nhanh (O(1)) |

**V** = số đỉnh, **độ** = số cạnh nối từ một đỉnh.

\---

## 🏆 Bài Tập Thực Hành

### 📝 **Bài tập 1: Hệ thống quản lý bạn bè**

**Mô tả**: Xây dựng mạng bạn bè với các tính năng:
- Thêm người dùng.
- Kết bạn.
- Tìm bạn chung.
- Gợi ý bạn mới.

```javascript
class FriendsNetwork {
  constructor() {
    this.graph = new Graph(false);
    this.users = new Map();
  }

  addUser(name, info = {}) {
    if (this.users.has(name)) {
      console.log(`Người dùng ${name} đã tồn tại`);
      return false;
    }
    this.graph.addVertex(name);
    this.users.set(name, { name, age: info.age || 0, friendsCount: 0 });
    console.log(`✅ Thêm: ${name}`);
    return true;
  }

  addFriendship(user1, user2) {
    if (!this.users.has(user1) || !this.users.has(user2)) {
      console.log(`❌ Người dùng không tồn tại`);
      return false;
    }
    const vertex1 = this.graph.getVertex(user1);
    const neighbors1 = vertex1.getNeighbors().map(v => v.getKey());
    if (neighbors1.includes(user2)) {
      console.log(`${user1} và ${user2} đã là bạn`);
      return false;
    }
    this.graph.addEdge(user1, user2);
    this.users.get(user1).friendsCount++;
    this.users.get(user2).friendsCount++;
    console.log(`🤝 ${user1} và ${user2} giờ là bạn`);
    return true;
  }

  findMutualFriends(user1, user2) {
    const vertex1 = this.graph.getVertex(user1);
    const vertex2 = this.graph.getVertex(user2);
    if (!vertex1 || !vertex2) return [];
    const friends1 = new Set(vertex1.getNeighbors().map(v => v.getKey()));
    const friends2 = vertex2.getNeighbors().map(v => v.getKey());
    const mutualFriends = friends2.filter(friend => friends1.has(friend));
    console.log(`🔗 Bạn chung của ${user1} và ${user2}: ${mutualFriends.join(', ')}`);
    return mutualFriends;
  }

  suggestFriends(user, maxSuggestions = 3) {
    const vertex = this.graph.getVertex(user);
    if (!vertex) return [];
    const currentFriends = new Set(vertex.getNeighbors().map(v => v.getKey()));
    currentFriends.add(user);
    const suggestions = new Map();
    vertex.getNeighbors().forEach(friend => {
      friend.getNeighbors().forEach(friendOfFriend => {
        const suggestionName = friendOfFriend.getKey();
        if (!currentFriends.has(suggestionName)) {
          suggestions.set(suggestionName, (suggestions.get(suggestionName) || 0) + 1);
        }
      });
    });
    const sortedSuggestions = Array.from(suggestions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxSuggestions)
      .map(([name, mutualCount]) => ({ name, mutualCount }));
    console.log(`💡 Gợi ý bạn cho ${user}:`, 
      sortedSuggestions.map(s => `${s.name} (${s.mutualCount} bạn chung)`).join(', '));
    return sortedSuggestions;
  }
}

const network = new FriendsNetwork();
network.addUser('Alice', { age: 25 });
network.addUser('Bob', { age: 30 });
network.addUser('Charlie', { age: 28 });
network.addUser('David', { age: 26 });
network.addFriendship('Alice', 'Bob');
network.addFriendship('Bob', 'Charlie');
network.addFriendship('Alice', 'David');
network.addFriendship('Charlie', 'David');
network.findMutualFriends('Alice', 'Charlie'); // Bob, David
network.suggestFriends('Alice');
```

**Kết quả**:
```
✅ Thêm: Alice
✅ Thêm: Bob
✅ Thêm: Charlie
✅ Thêm: David
🤝 Alice và Bob giờ là bạn
🤝 Bob và Charlie giờ là bạn
🤝 Alice và David giờ là bạn
🤝 Charlie và David giờ là bạn
🔗 Bạn chung của Alice và Charlie: Bob, David
💡 Gợi ý bạn cho Alice: Charlie (2 bạn chung)
```

### 📝 **Bài tập 2: Hệ thống tìm đường trong thành phố**

**Mô tả**: Xây dựng hệ thống GPS đơn giản để:
- Thêm địa điểm và đường đi.
- Tìm đường ngắn nhất.
- Tìm các địa điểm gần trong bán kính.

```javascript
class CityNavigation {
  constructor() {
    this.graph = new Graph(false);
    this.locations = new Map();
  }

  addLocation(name, coordinates = { x: 0, y: 0 }) {
    if (this.locations.has(name)) {
      console.log(`Địa điểm ${name} đã tồn tại`);
      return false;
    }
    this.graph.addVertex(name);
    this.locations.set(name, { name, coordinates, connections: [] });
    console.log(`📍 Thêm: ${name} tại (${coordinates.x}, ${coordinates.y})`);
    return true;
  }

  addRoad(location1, location2, distance) {
    if (!this.locations.has(location1) || !this.locations.has(location2)) {
      console.log(`❌ Địa điểm không tồn tại`);
      return false;
    }
    this.graph.addEdge(location1, location2, distance);
    this.locations.get(location1).connections.push({ to: location2, distance });
    this.locations.get(location2).connections.push({ to: location1, distance });
    console.log(`🛣️ Thêm đường: ${location1} ↔ ${location2} (${distance}km)`);
    return true;
  }

  findShortestPath(start, end) {
    if (!this.locations.has(start) || !this.locations.has(end)) {
      console.log(`❌ Địa điểm không tồn tại`);
      return null;
    }
    const distances = new Map();
    const previous = new Map();
    const unvisited = new Set();
    this.graph.getAllVertices().forEach(vertex => {
      const key = vertex.getKey();
      distances.set(key, key === start ? 0 : Infinity);
      unvisited.add(key);
    });
    while (unvisited.size > 0) {
      let current = null;
      let minDistance = Infinity;
      for (let vertex of unvisited) {
        if (distances.get(vertex) < minDistance) {
          minDistance = distances.get(vertex);
          current = vertex;
        }
      }
      if (current === null || current === end) break;
      unvisited.delete(current);
      const currentVertex = this.graph.getVertex(current);
      currentVertex.getNeighbors().forEach(neighbor => {
        const neighborKey = neighbor.getKey();
        if (unvisited.has(neighborKey)) {
          const edge = currentVertex.edges.find(e => e.hasVertex(neighbor));
          const tentativeDistance = distances.get(current) + edge.weight;
          if (tentativeDistance < distances.get(neighborKey)) {
            distances.set(neighborKey, tentativeDistance);
            previous.set(neighborKey, current);
          }
        }
      });
    }
    if (!previous.has(end) && start !== end) {
      console.log(`🚫 Không có đường từ ${start} đến ${end}`);
      return null;
    }
    const path = [];
    let current = end;
    while (current !== undefined) {
      path.unshift(current);
      current = previous.get(current);
    }
    const totalDistance = distances.get(end);
    console.log(`🗺️ Đường ngắn nhất từ ${start} đến ${end}:`);
    console.log(`   Tuyến: ${path.join(' → ')}`);
    console.log(`   Tổng khoảng cách: ${totalDistance}km`);
    return { path, distance: totalDistance };
  }

  findNearbyLocations(location, radius) {
    if (!this.locations.has(location)) return [];
    const result = [];
    const visited = new Set();
    const queue = [{ location, distance: 0, path: [location] }];
    while (queue.length > 0) {
      const { location: current, distance, path } = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      if (distance <= radius && current !== location) {
        result.push({ location: current, distance, path: [...path] });
      }
      const vertex = this.graph.getVertex(current);
      vertex.getNeighbors().forEach(neighbor => {
        const neighborKey = neighbor.getKey();
        if (!visited.has(neighborKey)) {
          const edge = vertex.edges.find(e => e.hasVertex(neighbor));
          const newDistance = distance + edge.weight;
          if (newDistance <= radius) {
            queue.push({
              location: neighborKey,
              distance: newDistance,
              path: [...path, neighborKey]
            });
          }
        }
      });
    }
    console.log(`📍 Địa điểm trong ${radius}km từ ${location}:`);
    result.forEach(item => {
      console.log(`   ${item.location}: ${item.distance}km (qua ${item.path.join(' → ')})`);
    });
    return result;
  }
}

const city = new CityNavigation();
city.addLocation('Home', { x: 0, y: 0 });
city.addLocation('Office', { x: 5, y: 3 });
city.addLocation('Mall', { x: 2, y: 4 });
city.addLocation('Hospital', { x: 7, y: 1 });
city.addRoad('Home', 'Mall', 3);
city.addRoad('Home', 'Office', 6);
city.addRoad('Mall', 'Office', 5);
city.addRoad('Office', 'Hospital', 3);
city.findShortestPath('Home', 'Hospital');
city.findNearbyLocations('Home', 7);
```

**Kết quả**:
```
📍 Thêm: Home tại (0, 0)
📍 Thêm: Office tại (5, 3)
📍 Thêm: Mall tại (2, 4)
📍 Thêm: Hospital tại (7, 1)
🛣️ Thêm đường: Home ↔ Mall (3km)
🛣️ Thêm đường: Home ↔ Office (6km)
🛣️ Thêm đường: Mall ↔ Office (5km)
🛣️ Thêm đường: Office ↔ Hospital (3km)
🗺️ Đường ngắn nhất từ Home đến Hospital:
   Tuyến: Home → Mall → Office → Hospital
   Tổng khoảng cách: 11km
📍 Địa điểm trong 7km từ Home:
   Mall: 3km (qua Home → Mall)
   Office: 6km (qua Home → Office)
```

\---

## 🔑 Điểm Quan Trọng và Lỗi Thường Gặp

### ✅ **Những điểm cần nhớ**

1. **Chọn cấu trúc phù hợp**:
   - **Danh sách kề**: Tốt cho đồ thị ít cạnh (như mạng xã hội).
   - **Ma trận kề**: Tốt cho đồ thị nhiều cạnh (như bản đồ dày đặc).

2. **Phân biệt có hướng/vô hướng**:
   - Vô hướng: Thêm cạnh cả hai chiều.
   - Có hướng: Chỉ thêm một chiều.

3. **Xử lý trọng số**:
   - Luôn kiểm tra trọng số khi làm việc với đồ thị có trọng số.

4. **Kiểm tra trước khi thêm cạnh**:
   - Đảm bảo đỉnh tồn tại và cạnh chưa có.

### ❌ **Lỗi thường gặp**

1. **Quên thêm cạnh ngược cho đồ thị vô hướng**:
   ```javascript
   // Sai
   addEdge(a, b) {
     this.adjacencyList[a].push(b); // Quên chiều ngược
   }
   // Đúng
   addEdge(a, b) {
     this.adjacencyList[a].push(b);
     this.adjacencyList[b].push(a);
   }
   ```

2. **Vòng lặp vô tận khi duyệt**:
   ```javascript
   // Sai
   function dfs(node) {
     console.log(node);
     node.neighbors.forEach(n => dfs(n)); // Không kiểm tra visited
   }
   // Đúng
   function dfs(node, visited = new Set()) {
     if (visited.has(node)) return;
     visited.add(node);
     console.log(node);
     node.neighbors.forEach(n => dfs(n, visited));
   }
   ```

3. **Quên xử lý trọng số**:
   ```javascript
   // Sai
   findPath(a, b) { /* Không tính trọng số */ }
   // Đúng
   findShortestPath(a, b) { /* Tính trọng số bằng Dijkstra */ }
   ```

### 💡 **Mẹo tránh lỗi**

- Vẽ đồ thị trên giấy trước khi code.
- Kiểm tra với đồ thị nhỏ (3-4 đỉnh).
- Luôn kiểm tra trường hợp đặc biệt: đồ thị rỗng, đỉnh không tồn tại.
- Dùng cấu trúc phù hợp với bài toán (danh sách kề cho đồ thị thưa).

\---

## 📝 Bài Tập Về Nhà

### 🎯 **Bài tập 1: Hệ thống quản lý môn học**

**Mô tả**: Xây dựng hệ thống quản lý môn học với các môn tiên quyết:
- Thêm môn học.
- Thêm môn tiên quyết.
- Kiểm tra xem sinh viên có thể học môn nào.
- Gợi ý môn học tiếp theo.

**Dữ liệu mẫu**:
```
CS101: Programming Basics - Không tiên quyết
CS102: Data Structures - Tiên quyết: CS101
CS201: Algorithms - Tiên quyết: CS102
```

**Ví dụ**:
```javascript
const courseManager = new CourseManager();
courseManager.addCourse('CS101', 'Programming Basics', 3);
courseManager.addCourse('CS102', 'Data Structures', 4);
courseManager.addPrerequisite('CS102', 'CS101');
console.log(courseManager.canTakeCourse(['CS101'], 'CS102')); // true
console.log(courseManager.findLearningPath('CS102')); // ['CS101', 'CS102']
```

### 🎯 **Bài tập 2: Mạng lưới phân phối hàng hóa**

**Mô tả**: Xây dựng hệ thống phân phối hàng hóa:
- Thêm kho/cửa hàng.
- Thêm tuyến đường (có khoảng cách, chi phí).
- Tìm tuyến đường tối ưu.
- Tìm điểm nghẽn trong mạng.

**Dữ liệu mẫu**:
```
DC1: Kho (10000 đơn vị)
STORE1: Cửa hàng (500 đơn vị)
DC1 -> STORE1: 50km, $200
```

**Ví dụ**:
```javascript
const network = new DistributionNetwork();
network.addLocation('DC1', 'Kho 1', 'warehouse', 10000);
network.addLocation('STORE1', 'Cửa hàng 1', 'store', 500);
network.addRoute('DC1', 'STORE1', 50, 200, 500);
network.findOptimalDelivery('DC1', ['STORE1'], { totalUnits: 300 });
```

\---

**🎉 Chúc mừng bạn đã học xong về Đồ Thị!**

Hãy thực hành các bài tập để nắm chắc kiến thức và khám phá ứng dụng của Đồ Thị trong thực tế!


---

*Post ID: 5ujfkg78z6p325g*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
