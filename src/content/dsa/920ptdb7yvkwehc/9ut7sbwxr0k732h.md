---
title: "Thuật toán tìm kiếm theo chiều rộng trên cây (Tree Breadth-First Search)"
postId: "9ut7sbwxr0k732h"
category: "Tree Algorithms"
created: "22/8/2025"
updated: "29/8/2025"
---

# Thuật toán tìm kiếm theo chiều rộng trên cây (Tree Breadth-First Search)


**Breadth-First Search (BFS)** là một thuật toán duyệt hoặc tìm kiếm trong cấu trúc dữ liệu cây hoặc đồ thị. Thuật toán bắt đầu từ nút gốc của cây (hoặc một nút tùy ý của đồ thị, đôi khi được gọi là 'search key') và khám phá các nút láng giềng trước, sau đó mới chuyển đến các nút láng giềng ở level tiếp theo.

![Algorithm Visualization](https://upload.wikimedia.org/wikipedia/commons/5/5d/Breadth-First-Search-Algorithm.gif)

## Đặc điểm chính

- **Chiến lược "đi rộng trước"**: Khám phá tất cả nodes ở level hiện tại trước khi xuống level tiếp theo
- **Sử dụng queue**: Triển khai bằng cấu trúc dữ liệu queue (FIFO)
- **Level-order traversal**: Duyệt cây theo từng level từ trên xuống dưới
- **Đường đi ngắn nhất**: Đảm bảo tìm được đường đi ngắn nhất trong unweighted tree

## Pseudocode

```text
BFS(root)
  Pre: root is the node of the tree
  Post: the nodes in the tree have been visited in breadth first order
  q ← queue
  q.enqueue(root)
  while !q.isEmpty()
    node ← q.dequeue()
    yield node.value
    if node.left ≠ ø
      q.enqueue(node.left)
    end if
    if node.right ≠ ø
      q.enqueue(node.right)
    end if
  end while
end BFS
```

## Ưu điểm và nhược điểm

### Ưu điểm:
- **Đường đi ngắn nhất**: Đảm bảo tìm được đường đi ngắn nhất (unweighted)
- **Complete**: Luôn tìm thấy solution nếu tồn tại
- **Level traversal**: Xử lý theo level rất hữu ích
- **Optimal**: Cho bài toán tìm đường đi ngắn nhất
- **Systematic**: Duyệt có hệ thống theo level

### Nhược điểm:
- **Bộ nhớ lớn**: O(w) với w là độ rộng tối đa
- **Chậm với cây sâu**: Phải duyệt hết level trước khi xuống level sau
- **Không phù hợp backtracking**: Không tự nhiên cho các bài toán cần quay lui
- **Exponential memory**: Với cây nhị phân hoàn chỉnh

## Triển khai trong JavaScript

### Triển khai cơ bản với callbacks

```javascript
import Queue from '../../../data-structures/queue/Queue';

/**
 * @typedef {Object} Callbacks
 * @property {function(node: BinaryTreeNode, child: BinaryTreeNode): boolean} allowTraversal
 * @property {function(node: BinaryTreeNode)} enterNode
 * @property {function(node: BinaryTreeNode)} leaveNode
 */

function initCallbacks(callbacks = {}) {
  const initiatedCallback = callbacks;
  
  const stubCallback = () => {};
  const defaultAllowTraversal = () => true;

  initiatedCallback.allowTraversal = callbacks.allowTraversal || defaultAllowTraversal;
  initiatedCallback.enterNode = callbacks.enterNode || stubCallback;
  initiatedCallback.leaveNode = callbacks.leaveNode || stubCallback;

  return initiatedCallback;
}

export default function breadthFirstSearch(rootNode, originalCallbacks) {
  const callbacks = initCallbacks(originalCallbacks);
  const nodeQueue = new Queue();

  // Khởi tạo queue với root node
  nodeQueue.enqueue(rootNode);

  while (!nodeQueue.isEmpty()) {
    const currentNode = nodeQueue.dequeue();

    callbacks.enterNode(currentNode);

    // Thêm tất cả children vào queue để duyệt sau

    // Duyệt nhánh trái
    if (currentNode.left && callbacks.allowTraversal(currentNode, currentNode.left)) {
      nodeQueue.enqueue(currentNode.left);
    }

    // Duyệt nhánh phải
    if (currentNode.right && callbacks.allowTraversal(currentNode, currentNode.right)) {
      nodeQueue.enqueue(currentNode.right);
    }

    callbacks.leaveNode(currentNode);
  }
}
```

### Triển khai Level-order Traversal

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// BFS cơ bản trả về mảng values
function levelOrderTraversal(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift(); // Dequeue
    result.push(node.value);
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return result;
}

// BFS trả về mảng theo từng level
function levelOrderByLevels(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.value);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}

// BFS từ phải sang trái
function levelOrderRightToLeft(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.value);
      
      // Thêm phải trước, trái sau
      if (node.right) queue.push(node.right);
      if (node.left) queue.push(node.left);
    }
    
    result.push(currentLevel);
  }
  
  return result;
}
```

### Triển khai tìm kiếm với điều kiện

```javascript
// Tìm node đầu tiên thỏa mãn điều kiện
function bfsFind(root, condition) {
  if (!root) return null;
  
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    
    if (condition(node)) {
      return node;
    }
    
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  
  return null;
}

// Tìm tất cả nodes thỏa mãn điều kiện theo level
function bfsFindAll(root, condition) {
  if (!root) return [];
  
  const result = [];
  const queue = [{ node: root, level: 0 }];
  
  while (queue.length > 0) {
    const { node, level } = queue.shift();
    
    if (condition(node)) {
      result.push({ node, level });
    }
    
    if (node.left) queue.push({ node: node.left, level: level + 1 });
    if (node.right) queue.push({ node: node.right, level: level + 1 });
  }
  
  return result;
}

// Tìm đường đi từ root đến target
function bfsFindPath(root, target) {
  if (!root) return [];
  
  const queue = [{ node: root, path: [root.value] }];
  
  while (queue.length > 0) {
    const { node, path } = queue.shift();
    
    if (node.value === target) {
      return path;
    }
    
    if (node.left) {
      queue.push({ 
        node: node.left, 
        path: [...path, node.left.value] 
      });
    }
    
    if (node.right) {
      queue.push({ 
        node: node.right, 
        path: [...path, node.right.value] 
      });
    }
  }
  
  return []; // Không tìm thấy
}
```

### Triển khai cho cây n-ary

```javascript
class NaryTreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  
  addChild(child) {
    this.children.push(child);
  }
}

function bfsNaryTree(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node.value);
    
    // Thêm tất cả children vào queue
    for (const child of node.children) {
      queue.push(child);
    }
  }
  
  return result;
}

function bfsNaryByLevels(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.value);
      
      for (const child of node.children) {
        queue.push(child);
      }
    }
    
    result.push(currentLevel);
  }
  
  return result;
}
```

## Ví dụ thực tế

### Ví dụ 1: Hệ thống tổ chức công ty

```javascript
class Employee {
  constructor(name, position, level) {
    this.name = name;
    this.position = position;
    this.level = level;
    this.subordinates = [];
    this.manager = null;
  }
  
  addSubordinate(employee) {
    employee.manager = this;
    this.subordinates.push(employee);
  }
}

class OrganizationChart {
  constructor(ceo) {
    this.ceo = ceo;
  }
  
  // Hiển thị tổ chức theo level (BFS)
  displayByLevel() {
    if (!this.ceo) return [];
    
    const levels = [];
    const queue = [{ employee: this.ceo, level: 0 }];
    
    while (queue.length > 0) {
      const { employee, level } = queue.shift();
      
      // Khởi tạo level nếu chưa có
      if (!levels[level]) {
        levels[level] = [];
      }
      
      levels[level].push({
        name: employee.name,
        position: employee.position
      });
      
      // Thêm subordinates vào queue
      for (const subordinate of employee.subordinates) {
        queue.push({ employee: subordinate, level: level + 1 });
      }
    }
    
    return levels;
  }
  
  // Tìm tất cả nhân viên ở level cụ thể
  getEmployeesAtLevel(targetLevel) {
    if (!this.ceo) return [];
    
    const result = [];
    const queue = [{ employee: this.ceo, level: 0 }];
    
    while (queue.length > 0) {
      const { employee, level } = queue.shift();
      
      if (level === targetLevel) {
        result.push(employee);
      }
      
      // Chỉ tiếp tục nếu chưa đạt target level
      if (level < targetLevel) {
        for (const subordinate of employee.subordinates) {
          queue.push({ employee: subordinate, level: level + 1 });
        }
      }
    }
    
    return result;
  }
  
  // Tìm đường dẫn từ CEO đến một nhân viên
  findReportingPath(targetName) {
    if (!this.ceo) return [];
    
    const queue = [{ employee: this.ceo, path: [this.ceo.name] }];
    
    while (queue.length > 0) {
      const { employee, path } = queue.shift();
      
      if (employee.name === targetName) {
        return path;
      }
      
      for (const subordinate of employee.subordinates) {
        queue.push({
          employee: subordinate,
          path: [...path, subordinate.name]
        });
      }
    }
    
    return [];
  }
  
  // Tính số lượng nhân viên theo từng level
  getEmployeeCountByLevel() {
    const levels = this.displayByLevel();
    const counts = {};
    
    levels.forEach((levelEmployees, index) => {
      counts[`Level ${index}`] = levelEmployees.length;
    });
    
    return counts;
  }
  
  // Tìm tất cả managers (có subordinates)
  findAllManagers() {
    if (!this.ceo) return [];
    
    const managers = [];
    const queue = [this.ceo];
    
    while (queue.length > 0) {
      const employee = queue.shift();
      
      if (employee.subordinates.length > 0) {
        managers.push({
          name: employee.name,
          position: employee.position,
          subordinateCount: employee.subordinates.length
        });
      }
      
      for (const subordinate of employee.subordinates) {
        queue.push(subordinate);
      }
    }
    
    return managers;
  }
  
  // Tìm nhân viên theo vị trí
  findByPosition(targetPosition) {
    if (!this.ceo) return [];
    
    const result = [];
    const queue = [{ employee: this.ceo, level: 0 }];
    
    while (queue.length > 0) {
      const { employee, level } = queue.shift();
      
      if (employee.position.toLowerCase().includes(targetPosition.toLowerCase())) {
        result.push({
          ...employee,
          level,
          reportingPath: this.findReportingPath(employee.name)
        });
      }
      
      for (const subordinate of employee.subordinates) {
        queue.push({ employee: subordinate, level: level + 1 });
      }
    }
    
    return result;
  }
}

// Ví dụ sử dụng
const ceo = new Employee('John Smith', 'CEO', 0);
const cto = new Employee('Alice Johnson', 'CTO', 1);
const cfo = new Employee('Bob Wilson', 'CFO', 1);
const vp1 = new Employee('Carol Brown', 'VP Engineering', 2);
const vp2 = new Employee('David Lee', 'VP Finance', 2);

ceo.addSubordinate(cto);
ceo.addSubordinate(cfo);
cto.addSubordinate(vp1);
cfo.addSubordinate(vp2);

// Thêm developers
const dev1 = new Employee('Eve Garcia', 'Senior Developer', 3);
const dev2 = new Employee('Frank Miller', 'Junior Developer', 3);
vp1.addSubordinate(dev1);
vp1.addSubordinate(dev2);

// Thêm accountants
const acc1 = new Employee('Grace Davis', 'Senior Accountant', 3);
const acc2 = new Employee('Henry Wilson', 'Junior Accountant', 3);
vp2.addSubordinate(acc1);
vp2.addSubordinate(acc2);

const orgChart = new OrganizationChart(ceo);

console.log('=== Sơ đồ tổ chức ===');
const levels = orgChart.displayByLevel();
levels.forEach((level, index) => {
  console.log(`Level ${index}:`, level.map(emp => `${emp.name} (${emp.position})`).join(', '));
});

console.log('\nSố lượng nhân viên theo level:');
console.log(orgChart.getEmployeeCountByLevel());

console.log('\nNhân viên ở Level 2:');
const level2Employees = orgChart.getEmployeesAtLevel(2);
level2Employees.forEach(emp => {
  console.log(`${emp.name} - ${emp.position}`);
});

console.log('\nĐường dẫn báo cáo đến Eve Garcia:');
console.log(orgChart.findReportingPath('Eve Garcia'));

console.log('\nTất cả managers:');
console.log(orgChart.findAllManagers());

console.log('\nTìm nhân viên có chức vụ "Developer":');
console.log(orgChart.findByPosition('Developer'));
```

### Ví dụ 2: Hệ thống menu website

```javascript
class MenuNode {
  constructor(title, url = '#', icon = null) {
    this.title = title;
    this.url = url;
    this.icon = icon;
    this.children = [];
    this.parent = null;
    this.active = false;
    this.visible = true;
  }
  
  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }
  
  hasChildren() {
    return this.children.length > 0;
  }
}

class WebsiteMenu {
  constructor() {
    this.root = new MenuNode('Root Menu');
  }
  
  // Render menu HTML theo BFS (level by level)
  renderMenuHTML() {
    if (!this.root || this.root.children.length === 0) return '';
    
    const queue = this.root.children.map(child => ({ node: child, level: 0 }));
    const levels = [];
    
    while (queue.length > 0) {
      const { node, level } = queue.shift();
      
      if (!node.visible) continue;
      
      if (!levels[level]) {
        levels[level] = [];
      }
      
      levels[level].push(node);
      
      // Thêm children vào queue
      for (const child of node.children) {
        queue.push({ node: child, level: level + 1 });
      }
    }
    
    return this.buildHTMLFromLevels(levels);
  }
  
  buildHTMLFromLevels(levels) {
    let html = '<nav class="main-menu">\n';
    
    if (levels.length > 0) {
      html += this.buildLevelHTML(levels[0], 0);
    }
    
    html += '</nav>';
    return html;
  }
  
  buildLevelHTML(nodes, level) {
    const indent = '  '.repeat(level + 1);
    let html = `${indent}<ul class="menu-level-${level}">\n`;
    
    for (const node of nodes) {
      const activeClass = node.active ? ' active' : '';
      const iconHTML = node.icon ? `<i class="${node.icon}"></i> ` : '';
      
      html += `${indent}  <li class="menu-item${activeClass}">\n`;
      html += `${indent}    <a href="${node.url}">${iconHTML}${node.title}</a>\n`;
      
      // Render children nếu có
      if (node.hasChildren()) {
        const childrenHTML = this.buildLevelHTML(node.children, level + 1);
        html += childrenHTML;
      }
      
      html += `${indent}  </li>\n`;
    }
    
    html += `${indent}</ul>\n`;
    return html;
  }
  
  // Tìm breadcrumb path
  findBreadcrumb(targetTitle) {
    const queue = [{ node: this.root, path: [] }];
    
    while (queue.length > 0) {
      const { node, path } = queue.shift();
      
      if (node.title === targetTitle) {
        return path.length > 0 ? path : [node.title];
      }
      
      for (const child of node.children) {
        const newPath = node === this.root ? [child.title] : [...path, child.title];
        queue.push({ node: child, path: newPath });
      }
    }
    
    return [];
  }
  
  // Tìm tất cả menu items theo level
  getMenusByLevel(targetLevel) {
    if (targetLevel === 0) return this.root.children;
    
    const result = [];
    const queue = this.root.children.map(child => ({ node: child, level: 1 }));
    
    while (queue.length > 0) {
      const { node, level } = queue.shift();
      
      if (level === targetLevel) {
        result.push(node);
      } else if (level < targetLevel) {
        for (const child of node.children) {
          queue.push({ node: child, level: level + 1 });
        }
      }
    }
    
    return result;
  }
  
  // Tìm kiếm menu theo title
  searchMenu(searchTerm) {
    const results = [];
    const queue = [{ node: this.root, path: [] }];
    
    while (queue.length > 0) {
      const { node, path } = queue.shift();
      
      if (node.title.toLowerCase().includes(searchTerm.toLowerCase()) && node !== this.root) {
        results.push({
          title: node.title,
          url: node.url,
          path: path.length > 0 ? path : [node.title],
          level: path.length
        });
      }
      
      for (const child of node.children) {
        const newPath = node === this.root ? [child.title] : [...path, child.title];
        queue.push({ node: child, path: newPath });
      }
    }
    
    return results;
  }
  
  // Generate sitemap
  generateSitemap() {
    const sitemap = [];
    const queue = [{ node: this.root, level: -1 }];
    
    while (queue.length > 0) {
      const { node, level } = queue.shift();
      
      if (node !== this.root && node.visible) {
        sitemap.push({
          title: node.title,
          url: node.url,
          level: level,
          indent: '  '.repeat(level)
        });
      }
      
      for (const child of node.children) {
        queue.push({ node: child, level: level + 1 });
      }
    }
    
    return sitemap;
  }
  
  // Đếm tổng số menu items
  getTotalMenuCount() {
    let count = 0;
    const queue = [this.root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      
      if (node !== this.root) count++;
      
      for (const child of node.children) {
        queue.push(child);
      }
    }
    
    return count;
  }
  
  // Set active menu và update parent chain
  setActiveMenu(targetTitle) {
    // Reset tất cả active states
    this.resetActiveStates();
    
    // Tìm và set active
    const queue = [this.root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      
      if (node.title === targetTitle) {
        // Set active cho node và tất cả parents
        let current = node;
        while (current && current !== this.root) {
          current.active = true;
          current = current.parent;
        }
        return true;
      }
      
      for (const child of node.children) {
        queue.push(child);
      }
    }
    
    return false;
  }
  
  resetActiveStates() {
    const queue = [this.root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      node.active = false;
      
      for (const child of node.children) {
        queue.push(child);
      }
    }
  }
}

// Ví dụ sử dụng
const menu = new WebsiteMenu();

// Tạo menu structure
const home = new MenuNode('Trang chủ', '/', 'fas fa-home');
const products = new MenuNode('Sản phẩm', '/products', 'fas fa-shopping-cart');
const services = new MenuNode('Dịch vụ', '/services', 'fas fa-concierge-bell');
const about = new MenuNode('Giới thiệu', '/about', 'fas fa-info-circle');
const contact = new MenuNode('Liên hệ', '/contact', 'fas fa-envelope');

menu.root.addChild(home);
menu.root.addChild(products);
menu.root.addChild(services);
menu.root.addChild(about);
menu.root.addChild(contact);

// Thêm sub-menu cho Products
const laptops = new MenuNode('Laptop', '/products/laptops');
const phones = new MenuNode('Điện thoại', '/products/phones');
const accessories = new MenuNode('Phụ kiện', '/products/accessories');

products.addChild(laptops);
products.addChild(phones);
products.addChild(accessories);

// Thêm sub-menu cho Services
const consulting = new MenuNode('Tư vấn', '/services/consulting');
const support = new MenuNode('Hỗ trợ', '/services/support');
const training = new MenuNode('Đào tạo', '/services/training');

services.addChild(consulting);
services.addChild(support);
services.addChild(training);

// Thêm sub-sub-menu
const gamingLaptops = new MenuNode('Gaming Laptops', '/products/laptops/gaming');
const businessLaptops = new MenuNode('Business Laptops', '/products/laptops/business');

laptops.addChild(gamingLaptops);
laptops.addChild(businessLaptops);

console.log('=== Website Menu System ===');

console.log('Tổng số menu items:', menu.getTotalMenuCount());

console.log('\nMenu Level 0 (Main Menu):');
const level0 = menu.getMenusByLevel(0);
level0.forEach(item => console.log(`- ${item.title}`));

console.log('\nMenu Level 1 (Sub Menu):');
const level1 = menu.getMenusByLevel(1);
level1.forEach(item => console.log(`- ${item.title}`));

console.log('\nMenu Level 2:');
const level2 = menu.getMenusByLevel(2);
level2.forEach(item => console.log(`- ${item.title}`));

console.log('\nBreadcrumb path đến "Gaming Laptops":');
console.log(menu.findBreadcrumb('Gaming Laptops'));

console.log('\nTìm kiếm menu với từ khóa "Laptop":');
const searchResults = menu.searchMenu('Laptop');
searchResults.forEach(result => {
  console.log(`- ${result.title} (${result.path.join(' > ')})`);
});

console.log('\nSitemap:');
const sitemap = menu.generateSitemap();
sitemap.forEach(item => {
  console.log(`${item.indent}- ${item.title} (${item.url})`);
});

// Set active menu
menu.setActiveMenu('Gaming Laptops');
console.log('\nActive menu đã được set cho "Gaming Laptops"');

// Generate HTML (một phần)
console.log('\nHTML Menu Structure:');
console.log(menu.renderMenuHTML());
```

### Ví dụ 3: Hệ thống chat và messaging

```javascript
class ChatMessage {
  constructor(id, content, sender, timestamp, parentId = null) {
    this.id = id;
    this.content = content;
    this.sender = sender;
    this.timestamp = timestamp;
    this.parentId = parentId;
    this.replies = [];
    this.reactions = [];
    this.edited = false;
    this.deleted = false;
  }
  
  addReply(reply) {
    reply.parentId = this.id;
    this.replies.push(reply);
  }
  
  addReaction(userId, emoji) {
    this.reactions.push({ userId, emoji, timestamp: Date.now() });
  }
}

class ChatThread {
  constructor(threadId, title = '') {
    this.threadId = threadId;
    this.title = title;
    this.messages = new Map(); // messageId -> ChatMessage
    this.rootMessages = []; // Messages without parent
  }
  
  addMessage(message) {
    this.messages.set(message.id, message);
    
    if (message.parentId) {
      const parent = this.messages.get(message.parentId);
      if (parent) {
        parent.addReply(message);
      }
    } else {
      this.rootMessages.push(message);
    }
  }
  
  // Hiển thị thread theo BFS (level by level)
  displayThreadByLevels() {
    const levels = [];
    const queue = this.rootMessages.map(msg => ({ message: msg, level: 0 }));
    
    while (queue.length > 0) {
      const { message, level } = queue.shift();
      
      if (message.deleted) continue;
      
      if (!levels[level]) {
        levels[level] = [];
      }
      
      levels[level].push({
        id: message.id,
        content: message.content,
        sender: message.sender,
        timestamp: new Date(message.timestamp).toLocaleTimeString(),
        replyCount: message.replies.length,
        reactionCount: message.reactions.length
      });
      
      // Thêm replies vào queue
      for (const reply of message.replies) {
        queue.push({ message: reply, level: level + 1 });
      }
    }
    
    return levels;
  }
  
  // Tìm tất cả replies của một message
  getAllReplies(messageId) {
    const message = this.messages.get(messageId);
    if (!message) return [];
    
    const allReplies = [];
    const queue = [...message.replies];
    
    while (queue.length > 0) {
      const reply = queue.shift();
      if (!reply.deleted) {
        allReplies.push(reply);
      }
      
      // Thêm replies của reply vào queue
      for (const subReply of reply.replies) {
        queue.push(subReply);
      }
    }
    
    return allReplies;
  }
  
  // Tìm conversation path từ root đến message cụ thể
  findConversationPath(targetMessageId) {
    for (const rootMessage of this.rootMessages) {
      const path = this.findPathToMessage(rootMessage, targetMessageId, []);
      if (path.length > 0) {
        return path;
      }
    }
    return [];
  }
  
  findPathToMessage(currentMessage, targetId, currentPath) {
    const newPath = [...currentPath, {
      id: currentMessage.id,
      content: currentMessage.content.substring(0, 50) + '...',
      sender: currentMessage.sender
    }];
    
    if (currentMessage.id === targetId) {
      return newPath;
    }
    
    for (const reply of currentMessage.replies) {
      const foundPath = this.findPathToMessage(reply, targetId, newPath);
      if (foundPath.length > 0) {
        return foundPath;
      }
    }
    
    return [];
  }
  
  // Tìm messages từ user cụ thể
  findMessagesByUser(userId) {
    const userMessages = [];
    const queue = [...this.rootMessages];
    
    while (queue.length > 0) {
      const message = queue.shift();
      
      if (message.sender === userId && !message.deleted) {
        userMessages.push({
          ...message,
          level: this.getMessageLevel(message.id)
        });
      }
      
      for (const reply of message.replies) {
        queue.push(reply);
      }
    }
    
    return userMessages.sort((a, b) => a.timestamp - b.timestamp);
  }
  
  getMessageLevel(messageId) {
    const message = this.messages.get(messageId);
    if (!message) return -1;
    
    let level = 0;
    let currentMessage = message;
    
    while (currentMessage.parentId) {
      level++;
      currentMessage = this.messages.get(currentMessage.parentId);
      if (!currentMessage) break;
    }
    
    return level;
  }
  
  // Thống kê thread
  getThreadStatistics() {
    const stats = {
      totalMessages: 0,
      messagesByLevel: {},
      messagesByUser: {},
      totalReactions: 0,
      conversationDepth: 0
    };
    
    const queue = this.rootMessages.map(msg => ({ message: msg, level: 0 }));
    
    while (queue.length > 0) {
      const { message, level } = queue.shift();
      
      if (message.deleted) continue;
      
      stats.totalMessages++;
      stats.conversationDepth = Math.max(stats.conversationDepth, level);
      
      // Count by level
      if (!stats.messagesByLevel[level]) {
        stats.messagesByLevel[level] = 0;
      }
      stats.messagesByLevel[level]++;
      
      // Count by user
      if (!stats.messagesByUser[message.sender]) {
        stats.messagesByUser[message.sender] = 0;
      }
      stats.messagesByUser[message.sender]++;
      
      // Count reactions
      stats.totalReactions += message.reactions.length;
      
      // Add replies to queue
      for (const reply of message.replies) {
        queue.push({ message: reply, level: level + 1 });
      }
    }
    
    return stats;
  }
  
  // Tìm messages hot (nhiều replies và reactions)
  findHotMessages(minEngagement = 3) {
    const hotMessages = [];
    const queue = [...this.rootMessages];
    
    while (queue.length > 0) {
      const message = queue.shift();
      
      if (message.deleted) continue;
      
      const engagement = message.replies.length + message.reactions.length;
      
      if (engagement >= minEngagement) {
        hotMessages.push({
          id: message.id,
          content: message.content,
          sender: message.sender,
          engagement,
          replies: message.replies.length,
          reactions: message.reactions.length,
          level: this.getMessageLevel(message.id)
        });
      }
      
      for (const reply of message.replies) {
        queue.push(reply);
      }
    }
    
    return hotMessages.sort((a, b) => b.engagement - a.engagement);
  }
  
  // Export thread cho backup
  exportThread() {
    const exportData = {
      threadId: this.threadId,
      title: this.title,
      exportTime: new Date().toISOString(),
      messages: []
    };
    
    const queue = this.rootMessages.map(msg => ({ message: msg, level: 0 }));
    
    while (queue.length > 0) {
      const { message, level } = queue.shift();
      
      exportData.messages.push({
        id: message.id,
        content: message.content,
        sender: message.sender,
        timestamp: message.timestamp,
        level: level,
        parentId: message.parentId,
        replyCount: message.replies.length,
        reactions: message.reactions,
        deleted: message.deleted,
        edited: message.edited
      });
      
      for (const reply of message.replies) {
        queue.push({ message: reply, level: level + 1 });
      }
    }
    
    return exportData;
  }
}

// Ví dụ sử dụng
const thread = new ChatThread('thread-001', 'Thảo luận về dự án mới');

// Tạo messages
const msg1 = new ChatMessage('msg1', 'Chúng ta cần thảo luận về timeline dự án', 'alice', Date.now() - 3600000);
const msg2 = new ChatMessage('msg2', 'Tôi nghĩ chúng ta nên bắt đầu với research phase', 'bob', Date.now() - 3500000);
const msg3 = new ChatMessage('msg3', 'Đồng ý! Cần bao lâu cho phase này?', 'charlie', Date.now() - 3400000, 'msg2');
const msg4 = new ChatMessage('msg4', 'Khoảng 2 tuần là đủ', 'bob', Date.now() - 3300000, 'msg3');
const msg5 = new ChatMessage('msg5', 'Sau research sẽ là development phase', 'alice', Date.now() - 3200000, 'msg2');
const msg6 = new ChatMessage('msg6', 'Development sẽ mất khoảng 6 tuần', 'david', Date.now() - 3100000, 'msg5');
const msg7 = new ChatMessage('msg7', 'Có cần testing phase riêng không?', 'eve', Date.now() - 3000000);
const msg8 = new ChatMessage('msg8', 'Có, testing rất quan trọng', 'alice', Date.now() - 2900000, 'msg7');

// Thêm messages vào thread
[msg1, msg2, msg3, msg4, msg5, msg6, msg7, msg8].forEach(msg => thread.addMessage(msg));

// Thêm reactions
msg1.addReaction('bob', '👍');
msg1.addReaction('charlie', '👍');
msg2.addReaction('alice', '💡');
msg2.addReaction('charlie', '👍');
msg2.addReaction('david', '👍');

console.log('=== Chat Thread Analysis ===');

console.log('Thread hiển thị theo levels:');
const levels = thread.displayThreadByLevels();
levels.forEach((level, index) => {
  console.log(`\nLevel ${index}:`);
  level.forEach(msg => {
    console.log(`  ${msg.sender}: ${msg.content} (${msg.replyCount} replies, ${msg.reactionCount} reactions)`);
  });
});

console.log('\nThống kê thread:');
const stats = thread.getThreadStatistics();
console.log(`- Tổng messages: ${stats.totalMessages}`);
console.log(`- Độ sâu conversation: ${stats.conversationDepth}`);
console.log('- Messages theo level:', stats.messagesByLevel);
console.log('- Messages theo user:', stats.messagesByUser);
console.log(`- Tổng reactions: ${stats.totalReactions}`);

console.log('\nConversation path đến message "Development sẽ mất khoảng 6 tuần":');
const path = thread.findConversationPath('msg6');
path.forEach((step, index) => {
  console.log(`${index + 1}. ${step.sender}: ${step.content}`);
});

console.log('\nTất cả messages của Bob:');
const bobMessages = thread.findMessagesByUser('bob');
bobMessages.forEach(msg => {
  console.log(`Level ${msg.level}: ${msg.content}`);
});

console.log('\nHot messages (engagement >= 2):');
const hotMessages = thread.findHotMessages(2);
hotMessages.forEach(msg => {
  console.log(`${msg.sender}: ${msg.content.substring(0, 50)}... (${msg.engagement} engagement)`);
});

console.log('\nTất cả replies của message từ Bob về research:');
const allReplies = thread.getAllReplies('msg2');
allReplies.forEach(reply => {
  console.log(`- ${reply.sender}: ${reply.content}`);
});
```

## So sánh với Depth-First Search (DFS)

| Đặc điểm | BFS | DFS |
|----------|-----|-----|
| **Chiến lược** | Đi rộng trước (breadth-first) | Đi sâu trước (depth-first) |
| **Cấu trúc dữ liệu** | Queue (FIFO) | Stack (LIFO) hoặc đệ quy |
| **Bộ nhớ** | O(w) với w = độ rộng max | O(h) với h = chiều cao |
| **Đường đi ngắn nhất** | Đảm bảo (unweighted) | Không đảm bảo |
| **Level traversal** | Tự nhiên | Phức tạp |
| **Backtracking** | Không phù hợp | Rất phù hợp |
| **Phù hợp** | Cây nông rộng, shortest path | Cây sâu hẹp, game AI |

## Phân tích độ phức tạp

### Độ phức tạp thời gian:
- **Cây**: O(n) với n là số nodes
- **Đồ thị**: O(V + E) với V = vertices, E = edges

### Độ phức tạp không gian:
- **Worst case**: O(w) với w là độ rộng tối đa của cây
- **Binary tree**: O(2^h) với h là chiều cao

### Phân tích chi tiết:
```
Binary tree hoàn chỉnh với n nodes:
- Height h = log₂(n)
- Max width w = 2^h = n/2 (ở level cuối)
- Space complexity: O(n)

Ví dụ với binary tree 1,000,000 nodes:
- BFS: O(500,000) space cho queue
- DFS: O(20) space cho recursion stack

Skewed tree (như linked list):
- BFS: O(1) space 
- DFS: O(n) space
```

## Khi nào nên sử dụng BFS

### Nên sử dụng khi:
- **Tìm đường đi ngắn nhất** (unweighted)
- **Level-order processing** cần thiết
- **Tìm tất cả nodes** ở distance/level cụ thể
- **Cây nông và rộng** (width < height)
- **Cần đảm bảo optimal solution**

### Không nên sử dụng khi:
- **Cây rất sâu và rộng** (memory intensive)
- **Chỉ cần tìm bất kỳ solution nào** (DFS faster)
- **Backtracking problems** (DFS natural)
- **Memory constrained** environments
- **Path reconstruction** không quan trọng

## Tối ưu hóa và kỹ thuật nâng cao

### 1. Bidirectional BFS

```javascript
function bidirectionalBFS(start, target, getNeighbors) {
  if (start === target) return [start];
  
  const frontQueue = [start];
  const backQueue = [target];
  const frontVisited = new Map([[start, [start]]]);
  const backVisited = new Map([[target, [target]]]);
  
  while (frontQueue.length > 0 || backQueue.length > 0) {
    // Expand from front
    if (frontQueue.length > 0) {
      const frontNode = frontQueue.shift();
      const frontPath = frontVisited.get(frontNode);
      
      for (const neighbor of getNeighbors(frontNode)) {
        if (backVisited.has(neighbor)) {
          // Connection found!
          const backPath = backVisited.get(neighbor);
          return [...frontPath, ...backPath.slice().reverse()];
        }
        
        if (!frontVisited.has(neighbor)) {
          frontVisited.set(neighbor, [...frontPath, neighbor]);
          frontQueue.push(neighbor);
        }
      }
    }
    
    // Expand from back
    if (backQueue.length > 0) {
      const backNode = backQueue.shift();
      const backPath = backVisited.get(backNode);
      
      for (const neighbor of getNeighbors(backNode)) {
        if (frontVisited.has(neighbor)) {
          // Connection found!
          const frontPath = frontVisited.get(neighbor);
          return [...frontPath, ...backPath.slice().reverse()];
        }
        
        if (!backVisited.has(neighbor)) {
          backVisited.set(neighbor, [neighbor, ...backPath]);
          backQueue.push(neighbor);
        }
      }
    }
  }
  
  return []; // No path found
}
```

### 2. A* Search (heuristic-guided BFS)

```javascript
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  
  enqueue(item, priority) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  
  dequeue() {
    return this.items.shift()?.item;
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

function aStarSearch(start, goal, heuristic, getNeighbors, getCost) {
  const openSet = new PriorityQueue();
  const cameFrom = new Map();
  const gScore = new Map([[start, 0]]);
  const fScore = new Map([[start, heuristic(start, goal)]]);
  
  openSet.enqueue(start, fScore.get(start));
  
  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    
    if (current === goal) {
      // Reconstruct path
      const path = [current];
      let node = current;
      while (cameFrom.has(node)) {
        node = cameFrom.get(node);
        path.unshift(node);
      }
      return path;
    }
    
    for (const neighbor of getNeighbors(current)) {
      const tentativeGScore = gScore.get(current) + getCost(current, neighbor);
      
      if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighbor, goal));
        
        openSet.enqueue(neighbor, fScore.get(neighbor));
      }
    }
  }
  
  return []; // No path found
}
```

### 3. Parallel BFS

```javascript
async function parallelBFS(root, condition, maxWorkers = 4) {
  if (!root) return null;
  
  const workers = [];
  const sharedQueue = [root];
  const sharedVisited = new Set([root]);
  const result = { found: null };
  
  // Create worker functions
  for (let i = 0; i < maxWorkers; i++) {
    const worker = async () => {
      while (sharedQueue.length > 0 && !result.found) {
        const node = sharedQueue.shift();
        if (!node) continue;
        
        if (condition(node)) {
          result.found = node;
          return;
        }
        
        // Add children to shared queue
        if (node.children) {
          for (const child of node.children) {
            if (!sharedVisited.has(child)) {
              sharedVisited.add(child);
              sharedQueue.push(child);
            }
          }
        }
      }
    };
    
    workers.push(worker());
  }
  
  await Promise.race(workers);
  return result.found;
}
```

## Tài liệu tham khảo

- [Wikipedia - Breadth-First Search](https://en.wikipedia.org/wiki/Breadth-first_search)
- [GeeksforGeeks - Tree Traversals](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [GeeksforGeeks - BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
- [Khan Academy - Graph Representation](https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs)
- [MIT OpenCourseWare - Graph Algorithms](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/)
- [Visualgo - Graph Traversal](https://visualgo.net/en/dfsbfs)
- [Algorithm Visualizer - BFS](https://algorithm-visualizer.org/graph/breadth-first-search)

---

*Post ID: 9ut7sbwxr0k732h*  
*Category: Tree Algorithms*  
*Created: 22/8/2025*  
*Updated: 29/8/2025*
