---
title: "Thuật toán tìm kiếm theo chiều sâu trên cây (Tree Depth-First Search)"
postId: "g0l4exnzov92ayu"
category: "Tree Algorithms"
created: "22/8/2025"
updated: "29/8/2025"
---

# Thuật toán tìm kiếm theo chiều sâu trên cây (Tree Depth-First Search)


**Depth-First Search (DFS)** là một thuật toán duyệt hoặc tìm kiếm trong cấu trúc dữ liệu cây hoặc đồ thị. Thuật toán bắt đầu từ nút gốc (hoặc chọn một nút tùy ý làm gốc trong trường hợp đồ thị) và khám phá càng xa càng tốt dọc theo mỗi nhánh trước khi quay lui (backtracking).

![Algorithm Visualization](https://upload.wikimedia.org/wikipedia/commons/7/7f/Depth-First-Search.gif)

## Đặc điểm chính

- **Chiến lược "đi sâu trước"**: Khám phá hết độ sâu của một nhánh trước khi chuyển sang nhánh khác
- **Sử dụng stack**: Có thể triển khai bằng đệ quy (implicit stack) hoặc stack tường minh
- **Backtracking**: Quay lui khi gặp dead-end hoặc hoàn thành một nhánh
- **Không tối ưu cho tìm đường đi ngắn nhất**: Không đảm bảo tìm được đường đi ngắn nhất

## Các cách duyệt cây

### 1. Pre-order Traversal (Tiền tự)
- **Thứ tự**: Gốc → Trái → Phải
- **Ứng dụng**: Sao chép cây, biểu thức prefix

### 2. In-order Traversal (Trung tự)  
- **Thứ tự**: Trái → Gốc → Phải
- **Ứng dụng**: BST (có thứ tự sắp xếp), biểu thức infix

### 3. Post-order Traversal (Hậu tự)
- **Thứ tự**: Trái → Phải → Gốc
- **Ứng dụng**: Xóa cây, tính toán biểu thức, tính kích thước cây

## Ưu điểm và nhược điểm

### Ưu điểm:
- **Bộ nhớ ít**: O(h) với h là chiều cao cây (cho recursive)
- **Đơn giản triển khai**: Đặc biệt với đệ quy
- **Phù hợp với backtracking**: Tự nhiên cho các bài toán cần quay lui
- **Linh hoạt**: Có thể dừng sớm khi tìm thấy target
- **Hiệu quả cho cây sâu hẹp**: Tốt hơn BFS

### Nhược điểm:
- **Có thể mắc kẹt**: Trong nhánh sâu vô hạn
- **Không tối ưu đường đi**: Không đảm bảo đường đi ngắn nhất
- **Stack overflow**: Với cây quá sâu
- **Không systematic**: Thứ tự duyệt phụ thuộc cấu trúc cây

## Triển khai trong JavaScript

### Triển khai cơ bản với callbacks

```javascript
/**
 * @typedef {Object} TraversalCallbacks
 * @property {function(node: BinaryTreeNode, child: BinaryTreeNode): boolean} allowTraversal
 * @property {function(node: BinaryTreeNode)} enterNode
 * @property {function(node: BinaryTreeNode)} leaveNode
 */

function initCallbacks(callbacks = {}) {
  const initiatedCallbacks = {};
  
  const stubCallback = () => {};
  const defaultAllowTraversalCallback = () => true;

  initiatedCallbacks.allowTraversal = callbacks.allowTraversal || defaultAllowTraversalCallback;
  initiatedCallbacks.enterNode = callbacks.enterNode || stubCallback;
  initiatedCallbacks.leaveNode = callbacks.leaveNode || stubCallback;

  return initiatedCallbacks;
}

function depthFirstSearchRecursive(node, callbacks) {
  // Gọi callback "enterNode" để thông báo node sắp được xử lý
  callbacks.enterNode(node);

  // Duyệt nhánh trái nếu được phép
  if (node.left && callbacks.allowTraversal(node, node.left)) {
    depthFirstSearchRecursive(node.left, callbacks);
  }

  // Duyệt nhánh phải nếu được phép
  if (node.right && callbacks.allowTraversal(node, node.right)) {
    depthFirstSearchRecursive(node.right, callbacks);
  }

  // Gọi callback "leaveNode" để thông báo hoàn thành xử lý node
  callbacks.leaveNode(node);
}

export default function depthFirstSearch(rootNode, callbacks) {
  const processedCallbacks = initCallbacks(callbacks);
  depthFirstSearchRecursive(rootNode, processedCallbacks);
}
```

### Triển khai Pre-order Traversal

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Recursive Pre-order
function preOrderRecursive(node, result = []) {
  if (node === null) return result;
  
  result.push(node.value);        // Xử lý gốc
  preOrderRecursive(node.left, result);   // Duyệt trái
  preOrderRecursive(node.right, result);  // Duyệt phải
  
  return result;
}

// Iterative Pre-order
function preOrderIterative(root) {
  if (!root) return [];
  
  const result = [];
  const stack = [root];
  
  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.value);
    
    // Đẩy phải trước, trái sau (vì stack LIFO)
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  
  return result;
}
```

### Triển khai In-order Traversal

```javascript
// Recursive In-order
function inOrderRecursive(node, result = []) {
  if (node === null) return result;
  
  inOrderRecursive(node.left, result);    // Duyệt trái
  result.push(node.value);               // Xử lý gốc
  inOrderRecursive(node.right, result);  // Duyệt phải
  
  return result;
}

// Iterative In-order
function inOrderIterative(root) {
  const result = [];
  const stack = [];
  let current = root;
  
  while (current !== null || stack.length > 0) {
    // Đi hết về bên trái
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }
    
    // Xử lý node hiện tại
    current = stack.pop();
    result.push(current.value);
    
    // Chuyển sang cây con phải
    current = current.right;
  }
  
  return result;
}
```

### Triển khai Post-order Traversal

```javascript
// Recursive Post-order
function postOrderRecursive(node, result = []) {
  if (node === null) return result;
  
  postOrderRecursive(node.left, result);   // Duyệt trái
  postOrderRecursive(node.right, result);  // Duyệt phải
  result.push(node.value);                // Xử lý gốc
  
  return result;
}

// Iterative Post-order (phức tạp hơn)
function postOrderIterative(root) {
  if (!root) return [];
  
  const result = [];
  const stack1 = [root];
  const stack2 = [];
  
  // Sử dụng 2 stack
  while (stack1.length > 0) {
    const node = stack1.pop();
    stack2.push(node);
    
    if (node.left) stack1.push(node.left);
    if (node.right) stack1.push(node.right);
  }
  
  // Pop từ stack2 để có thứ tự post-order
  while (stack2.length > 0) {
    result.push(stack2.pop().value);
  }
  
  return result;
}

// Post-order với 1 stack và visited flag
function postOrderIterativeOneStack(root) {
  if (!root) return [];
  
  const result = [];
  const stack = [];
  let lastVisited = null;
  let current = root;
  
  while (stack.length > 0 || current !== null) {
    if (current !== null) {
      stack.push(current);
      current = current.left;
    } else {
      const peekNode = stack[stack.length - 1];
      
      // Nếu nút phải tồn tại và chưa được visited
      if (peekNode.right && lastVisited !== peekNode.right) {
        current = peekNode.right;
      } else {
        result.push(peekNode.value);
        lastVisited = stack.pop();
      }
    }
  }
  
  return result;
}
```

## Ví dụ thực tế

### Ví dụ 1: Xây dựng và duyệt cây biểu thức

```javascript
// Cây biểu thức: (3 + 5) * (2 - 1)
//       *
//      / \
//     +   -
//    / \ / \
//   3  5 2  1

class ExpressionTree {
  constructor() {
    this.root = null;
  }

  // Xây dựng cây từ biểu thức postfix
  buildFromPostfix(expression) {
    const stack = [];
    const tokens = expression.split(' ');
    
    for (const token of tokens) {
      const node = new TreeNode(token);
      
      if (this.isOperator(token)) {
        node.right = stack.pop();
        node.left = stack.pop();
      }
      
      stack.push(node);
    }
    
    this.root = stack.pop();
    return this.root;
  }

  isOperator(token) {
    return ['+', '-', '*', '/', '^'].includes(token);
  }

  // Đánh giá biểu thức bằng post-order
  evaluate(node = this.root) {
    if (!node) return 0;
    
    // Nếu là số
    if (!this.isOperator(node.value)) {
      return parseFloat(node.value);
    }
    
    // Đánh giá đệ quy
    const leftValue = this.evaluate(node.left);
    const rightValue = this.evaluate(node.right);
    
    switch (node.value) {
      case '+': return leftValue + rightValue;
      case '-': return leftValue - rightValue;
      case '*': return leftValue * rightValue;
      case '/': return leftValue / rightValue;
      case '^': return Math.pow(leftValue, rightValue);
      default: return 0;
    }
  }

  // Chuyển về infix notation
  toInfix(node = this.root) {
    if (!node) return '';
    
    if (!this.isOperator(node.value)) {
      return node.value;
    }
    
    const left = this.toInfix(node.left);
    const right = this.toInfix(node.right);
    
    return `(${left} ${node.value} ${right})`;
  }

  // Chuyển về prefix notation  
  toPrefix(node = this.root) {
    if (!node) return '';
    
    if (!this.isOperator(node.value)) {
      return node.value;
    }
    
    const left = this.toPrefix(node.left);
    const right = this.toPrefix(node.right);
    
    return `${node.value} ${left} ${right}`;
  }

  // Chuyển về postfix notation
  toPostfix(node = this.root) {
    if (!node) return '';
    
    if (!this.isOperator(node.value)) {
      return node.value;
    }
    
    const left = this.toPostfix(node.left);
    const right = this.toPostfix(node.right);
    
    return `${left} ${right} ${node.value}`;
  }
}

// Ví dụ sử dụng
const expressionTree = new ExpressionTree();
expressionTree.buildFromPostfix('3 5 + 2 1 - *');

console.log('=== Cây biểu thức ===');
console.log('Infix:', expressionTree.toInfix());     // ((3 + 5) * (2 - 1))
console.log('Prefix:', expressionTree.toPrefix());   // * + 3 5 - 2 1
console.log('Postfix:', expressionTree.toPostfix()); // 3 5 + 2 1 - *
console.log('Kết quả:', expressionTree.evaluate());  // 8
```

### Ví dụ 2: Hệ thống file system

```javascript
class FileSystemNode {
  constructor(name, type = 'file', size = 0) {
    this.name = name;
    this.type = type; // 'file' hoặc 'directory'
    this.size = size;
    this.children = [];
    this.parent = null;
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  isDirectory() {
    return this.type === 'directory';
  }

  isFile() {
    return this.type === 'file';
  }
}

class FileSystem {
  constructor() {
    this.root = new FileSystemNode('/', 'directory');
  }

  // Tìm tất cả file có extension cụ thể
  findFilesByExtension(extension, node = this.root, result = []) {
    if (node.isFile() && node.name.endsWith(extension)) {
      result.push(this.getFullPath(node));
    }

    if (node.isDirectory()) {
      for (const child of node.children) {
        this.findFilesByExtension(extension, child, result);
      }
    }

    return result;
  }

  // Tính tổng kích thước directory (post-order)
  calculateDirectorySize(node = this.root) {
    if (node.isFile()) {
      return node.size;
    }

    let totalSize = 0;
    for (const child of node.children) {
      totalSize += this.calculateDirectorySize(child);
    }

    node.size = totalSize; // Cache kết quả
    return totalSize;
  }

  // Hiển thị cây thư mục (pre-order)
  displayTree(node = this.root, depth = 0, prefix = '') {
    const indent = '│  '.repeat(depth);
    const connector = depth === 0 ? '' : '├── ';
    const icon = node.isDirectory() ? '📁' : '📄';
    
    console.log(`${indent}${connector}${icon} ${node.name}${node.isFile() ? ` (${node.size} bytes)` : ''}`);

    if (node.isDirectory()) {
      for (let i = 0; i < node.children.length; i++) {
        const isLast = i === node.children.length - 1;
        this.displayTree(node.children[i], depth + 1, isLast ? '└── ' : '├── ');
      }
    }
  }

  // Tìm đường dẫn đầy đủ
  getFullPath(node) {
    const path = [];
    let current = node;
    
    while (current && current !== this.root) {
      path.unshift(current.name);
      current = current.parent;
    }
    
    return '/' + path.join('/');
  }

  // Tìm file/directory theo tên
  findByName(name, node = this.root, results = []) {
    if (node.name.includes(name)) {
      results.push({
        path: this.getFullPath(node),
        type: node.type,
        size: node.size
      });
    }

    if (node.isDirectory()) {
      for (const child of node.children) {
        this.findByName(name, child, results);
      }
    }

    return results;
  }

  // Tìm file lớn nhất
  findLargestFiles(limit = 10, node = this.root, files = []) {
    if (node.isFile()) {
      files.push({
        path: this.getFullPath(node),
        size: node.size
      });
    }

    if (node.isDirectory()) {
      for (const child of node.children) {
        this.findLargestFiles(limit, child, files);
      }
    }

    // Sort và return top files
    if (node === this.root) {
      return files
        .sort((a, b) => b.size - a.size)
        .slice(0, limit);
    }

    return files;
  }

  // Backup metadata (pre-order)
  exportMetadata(node = this.root, metadata = {}) {
    const path = this.getFullPath(node);
    
    metadata[path] = {
      name: node.name,
      type: node.type,
      size: node.size,
      children: node.children.length
    };

    if (node.isDirectory()) {
      for (const child of node.children) {
        this.exportMetadata(child, metadata);
      }
    }

    return metadata;
  }

  // Xóa file/directory (post-order để xóa children trước)
  deleteNode(targetPath) {
    const node = this.findNodeByPath(targetPath);
    if (!node || node === this.root) return false;

    // Xóa đệ quy tất cả children trước
    if (node.isDirectory()) {
      while (node.children.length > 0) {
        this.deleteNodeRecursive(node.children[0]);
      }
    }

    // Xóa node khỏi parent
    if (node.parent) {
      const index = node.parent.children.indexOf(node);
      if (index > -1) {
        node.parent.children.splice(index, 1);
      }
    }

    return true;
  }

  deleteNodeRecursive(node) {
    if (node.isDirectory()) {
      for (const child of [...node.children]) {
        this.deleteNodeRecursive(child);
      }
    }
    
    if (node.parent) {
      const index = node.parent.children.indexOf(node);
      if (index > -1) {
        node.parent.children.splice(index, 1);
      }
    }
  }

  findNodeByPath(path) {
    const parts = path.split('/').filter(part => part !== '');
    let current = this.root;

    for (const part of parts) {
      const child = current.children.find(c => c.name === part);
      if (!child) return null;
      current = child;
    }

    return current;
  }
}

// Ví dụ sử dụng
const fs = new FileSystem();

// Tạo cấu trúc thư mục
const documents = new FileSystemNode('Documents', 'directory');
const projects = new FileSystemNode('Projects', 'directory');
const photos = new FileSystemNode('Photos', 'directory');

fs.root.addChild(documents);
fs.root.addChild(projects);
fs.root.addChild(photos);

// Thêm files
documents.addChild(new FileSystemNode('resume.pdf', 'file', 1024));
documents.addChild(new FileSystemNode('report.docx', 'file', 2048));

const jsProject = new FileSystemNode('javascript-app', 'directory');
projects.addChild(jsProject);
jsProject.addChild(new FileSystemNode('index.js', 'file', 512));
jsProject.addChild(new FileSystemNode('package.json', 'file', 256));

photos.addChild(new FileSystemNode('vacation.jpg', 'file', 4096));
photos.addChild(new FileSystemNode('family.png', 'file', 3072));

console.log('=== Hệ thống File System ===');
fs.displayTree();

console.log('\nTất cả file .js:');
console.log(fs.findFilesByExtension('.js'));

console.log('\nFile .pdf:');
console.log(fs.findFilesByExtension('.pdf'));

console.log('\nTổng kích thước root:', fs.calculateDirectorySize(), 'bytes');

console.log('\nTop 5 file lớn nhất:');
console.log(fs.findLargestFiles(5));

console.log('\nTìm file chứa "index":');
console.log(fs.findByName('index'));
```

### Ví dụ 3: Decision Tree và AI

```javascript
class DecisionNode {
  constructor(question = null, trueBranch = null, falseBranch = null, result = null) {
    this.question = question;     // Câu hỏi để phân chia
    this.trueBranch = trueBranch; // Nhánh khi câu trả lời là true
    this.falseBranch = falseBranch; // Nhánh khi câu trả lời là false
    this.result = result;         // Kết quả cuối cùng (leaf node)
  }

  isLeaf() {
    return this.result !== null;
  }
}

class DecisionTree {
  constructor() {
    this.root = null;
  }

  // Dự đoán kết quả cho một mẫu dữ liệu
  predict(data, node = this.root) {
    if (!node) return null;

    // Nếu là leaf node, trả về kết quả
    if (node.isLeaf()) {
      return node.result;
    }

    // Đánh giá câu hỏi và đi theo nhánh phù hợp
    if (node.question(data)) {
      return this.predict(data, node.trueBranch);
    } else {
      return this.predict(data, node.falseBranch);
    }
  }

  // Hiển thị cây quyết định
  displayTree(node = this.root, depth = 0, branch = 'root') {
    if (!node) return;

    const indent = '  '.repeat(depth);
    
    if (node.isLeaf()) {
      console.log(`${indent}${branch}: ${node.result}`);
    } else {
      console.log(`${indent}${branch}: ${node.question.name || 'Question'}`);
      this.displayTree(node.trueBranch, depth + 1, 'True');
      this.displayTree(node.falseBranch, depth + 1, 'False');
    }
  }

  // Thu thập tất cả rules từ cây (root-to-leaf paths)
  extractRules(node = this.root, currentRule = [], allRules = []) {
    if (!node) return allRules;

    if (node.isLeaf()) {
      allRules.push({
        conditions: [...currentRule],
        result: node.result
      });
      return allRules;
    }

    // Nhánh True
    const trueCondition = {
      question: node.question.name || node.question.toString(),
      answer: true
    };
    this.extractRules(node.trueBranch, [...currentRule, trueCondition], allRules);

    // Nhánh False
    const falseCondition = {
      question: node.question.name || node.question.toString(),
      answer: false
    };
    this.extractRules(node.falseBranch, [...currentRule, falseCondition], allRules);

    return allRules;
  }

  // Đánh giá hiệu suất trên tập test
  evaluate(testData) {
    let correct = 0;
    const predictions = [];

    for (const sample of testData) {
      const predicted = this.predict(sample.features);
      const actual = sample.label;
      
      predictions.push({
        predicted,
        actual,
        correct: predicted === actual
      });

      if (predicted === actual) correct++;
    }

    return {
      accuracy: correct / testData.length,
      totalSamples: testData.length,
      correctPredictions: correct,
      predictions
    };
  }

  // Tìm tất cả đường dẫn đến một kết quả cụ thể
  findPathsToResult(targetResult, node = this.root, currentPath = [], allPaths = []) {
    if (!node) return allPaths;

    if (node.isLeaf()) {
      if (node.result === targetResult) {
        allPaths.push([...currentPath]);
      }
      return allPaths;
    }

    // Nhánh True
    this.findPathsToResult(
      targetResult, 
      node.trueBranch, 
      [...currentPath, { question: node.question.name, answer: true }], 
      allPaths
    );

    // Nhánh False
    this.findPathsToResult(
      targetResult, 
      node.falseBranch, 
      [...currentPath, { question: node.question.name, answer: false }], 
      allPaths
    );

    return allPaths;
  }
}

// Ví dụ: Hệ thống chẩn đoán y tế đơn giản
function buildMedicalDiagnosisTree() {
  const tree = new DecisionTree();

  // Định nghĩa các câu hỏi
  const hasFever = (data) => data.fever >= 38;
  hasFever.name = "Sốt >= 38°C?";

  const hasCough = (data) => data.cough === true;
  hasCough.name = "Có ho?";

  const hasHeadache = (data) => data.headache === true;
  hasHeadache.name = "Có đau đầu?";

  const hasRunnyNose = (data) => data.runnyNose === true;
  hasRunnyNose.name = "Có sổ mũi?";

  // Xây dựng cây quyết định
  tree.root = new DecisionNode(
    hasFever,
    // Nhánh có sốt
    new DecisionNode(
      hasCough,
      // Có sốt và ho
      new DecisionNode(
        hasHeadache,
        new DecisionNode(null, null, null, "Cúm"), // Có sốt, ho, đau đầu
        new DecisionNode(null, null, null, "Viêm phế quản") // Có sốt, ho, không đau đầu
      ),
      // Có sốt nhưng không ho
      new DecisionNode(null, null, null, "Nhiễm trúng")
    ),
    // Nhánh không sốt
    new DecisionNode(
      hasCough,
      // Không sốt nhưng có ho
      new DecisionNode(
        hasRunnyNose,
        new DecisionNode(null, null, null, "Cảm lạnh"), // Không sốt, ho, sổ mũi
        new DecisionNode(null, null, null, "Ho khan") // Không sốt, ho, không sổ mũi
      ),
      // Không sốt, không ho
      new DecisionNode(
        hasHeadache,
        new DecisionNode(null, null, null, "Căng thẳng"), // Không sốt, không ho, đau đầu
        new DecisionNode(null, null, null, "Khỏe mạnh") // Không sốt, không ho, không đau đầu
      )
    )
  );

  return tree;
}

// Ví dụ sử dụng
const medicalTree = buildMedicalDiagnosisTree();

console.log('\n=== Hệ thống chẩn đoán y tế ===');
medicalTree.displayTree();

// Test cases
const patients = [
  { fever: 39, cough: true, headache: true, runnyNose: false },
  { fever: 36.5, cough: true, headache: false, runnyNose: true },
  { fever: 37, cough: false, headache: true, runnyNose: false },
  { fever: 36.8, cough: false, headache: false, runnyNose: false }
];

console.log('\nChẩn đoán bệnh nhân:');
patients.forEach((patient, index) => {
  const diagnosis = medicalTree.predict(patient);
  console.log(`Bệnh nhân ${index + 1}: ${diagnosis}`);
  console.log(`- Sốt: ${patient.fever}°C, Ho: ${patient.cough}, Đau đầu: ${patient.headache}, Sổ mũi: ${patient.runnyNose}`);
});

// Trích xuất rules
console.log('\nTất cả rules trong cây:');
const rules = medicalTree.extractRules();
rules.forEach((rule, index) => {
  console.log(`Rule ${index + 1}: ${rule.result}`);
  rule.conditions.forEach(condition => {
    console.log(`  - ${condition.question}: ${condition.answer}`);
  });
});

// Tìm đường dẫn đến chẩn đoán "Cúm"
console.log('\nĐường dẫn đến chẩn đoán "Cúm":');
const fluPaths = medicalTree.findPathsToResult("Cúm");
fluPaths.forEach((path, index) => {
  console.log(`Đường dẫn ${index + 1}:`);
  path.forEach(step => {
    console.log(`  - ${step.question}: ${step.answer}`);
  });
});
```

## Ứng dụng thực tế

### 1. Trò chơi và AI

```javascript
class GameTree {
  constructor(gameState, player, depth = 0) {
    this.gameState = gameState;
    this.player = player; // 'X' hoặc 'O'
    this.depth = depth;
    this.children = [];
    this.score = null;
  }

  // Minimax algorithm với alpha-beta pruning
  minimax(isMaximizing, alpha = -Infinity, beta = Infinity, maxDepth = 6) {
    // Base case: terminal state hoặc đạt độ sâu tối đa
    if (this.depth >= maxDepth || this.isTerminal()) {
      return this.evaluatePosition();
    }

    let bestScore = isMaximizing ? -Infinity : Infinity;
    const possibleMoves = this.generateMoves();

    for (const move of possibleMoves) {
      const newGameState = this.makeMove(move);
      const childNode = new GameTree(newGameState, this.getOpponent(), this.depth + 1);
      
      const score = childNode.minimax(!isMaximizing, alpha, beta, maxDepth);

      if (isMaximizing) {
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, score);
      } else {
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);
      }

      // Alpha-beta pruning
      if (beta <= alpha) {
        break;
      }
    }

    this.score = bestScore;
    return bestScore;
  }

  // Tìm nước đi tốt nhất
  findBestMove(maxDepth = 6) {
    const possibleMoves = this.generateMoves();
    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of possibleMoves) {
      const newGameState = this.makeMove(move);
      const childNode = new GameTree(newGameState, this.getOpponent(), this.depth + 1);
      
      const score = childNode.minimax(false, -Infinity, Infinity, maxDepth);

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return { move: bestMove, score: bestScore };
  }

  isTerminal() {
    return this.checkWinner() !== null || this.isBoardFull();
  }

  generateMoves() {
    const moves = [];
    for (let i = 0; i < 9; i++) {
      if (this.gameState[i] === ' ') {
        moves.push(i);
      }
    }
    return moves;
  }

  makeMove(position) {
    const newState = [...this.gameState];
    newState[position] = this.player;
    return newState;
  }

  getOpponent() {
    return this.player === 'X' ? 'O' : 'X';
  }

  checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Hàng ngang
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Hàng dọc
      [0, 4, 8], [2, 4, 6]             // Đường chéo
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (this.gameState[a] !== ' ' && 
          this.gameState[a] === this.gameState[b] && 
          this.gameState[b] === this.gameState[c]) {
        return this.gameState[a];
      }
    }

    return null;
  }

  isBoardFull() {
    return this.gameState.every(cell => cell !== ' ');
  }

  evaluatePosition() {
    const winner = this.checkWinner();
    
    if (winner === 'X') return 10 - this.depth;
    if (winner === 'O') return this.depth - 10;
    if (this.isBoardFull()) return 0;
    
    // Heuristic cho position chưa kết thúc
    return this.calculateHeuristic();
  }

  calculateHeuristic() {
    let score = 0;
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      const values = [this.gameState[a], this.gameState[b], this.gameState[c]];
      
      const xCount = values.filter(v => v === 'X').length;
      const oCount = values.filter(v => v === 'O').length;
      const emptyCount = values.filter(v => v === ' ').length;

      if (oCount === 0) score += Math.pow(10, xCount);
      if (xCount === 0) score -= Math.pow(10, oCount);
    }

    return score;
  }

  printBoard() {
    console.log(`${this.gameState[0]} | ${this.gameState[1]} | ${this.gameState[2]}`);
    console.log('--+---+--');
    console.log(`${this.gameState[3]} | ${this.gameState[4]} | ${this.gameState[5]}`);
    console.log('--+---+--');
    console.log(`${this.gameState[6]} | ${this.gameState[7]} | ${this.gameState[8]}`);
  }
}

// Ví dụ sử dụng
const initialState = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
const game = new GameTree(initialState, 'X');

console.log('\n=== Trò chơi Tic-Tac-Toe AI ===');
console.log('Bàn cờ ban đầu:');
game.printBoard();

const bestMove = game.findBestMove(6);
console.log(`\nNước đi tốt nhất cho X: vị trí ${bestMove.move} (điểm: ${bestMove.score})`);

// Mô phỏng một game
let currentGame = new GameTree(initialState, 'X');
let moveCount = 0;

while (!currentGame.isTerminal() && moveCount < 9) {
  console.log(`\nLượt ${moveCount + 1} - Người chơi ${currentGame.player}:`);
  
  if (currentGame.player === 'X') {
    // AI chơi
    const aiMove = currentGame.findBestMove(6);
    currentGame.gameState[aiMove.move] = 'X';
    console.log(`AI chọn vị trí ${aiMove.move}`);
  } else {
    // Random move cho O (hoặc có thể là input từ người chơi)
    const availableMoves = currentGame.generateMoves();
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    currentGame.gameState[randomMove] = 'O';
    console.log(`O chọn vị trí ${randomMove}`);
  }

  currentGame.printBoard();
  currentGame.player = currentGame.getOpponent();
  moveCount++;
}

const finalWinner = currentGame.checkWinner();
console.log(`\nKết quả: ${finalWinner ? `${finalWinner} thắng!` : 'Hòa!'}`);
```

## So sánh với Breadth-First Search (BFS)

| Đặc điểm | DFS | BFS |
|----------|-----|-----|
| **Chiến lược** | Đi sâu trước | Đi rộng trước |
| **Cấu trúc dữ liệu** | Stack (đệ quy/explicit) | Queue |
| **Bộ nhớ** | O(h) với h = chiều cao | O(w) với w = độ rộng |
| **Đường đi ngắn nhất** | Không đảm bảo | Đảm bảo (unweighted) |
| **Phù hợp** | Cây sâu hẹp, backtracking | Cây nông rộng, đường đi ngắn |
| **Applications** | Topological sort, cycle detection | Shortest path, level traversal |

## Phân tích độ phức tạp

### Độ phức tạp thời gian:
- **Cây**: O(n) với n là số nodes
- **Đồ thị**: O(V + E) với V = vertices, E = edges

### Độ phức tạp không gian:
- **Recursive**: O(h) với h là chiều cao cây (worst case: O(n))
- **Iterative**: O(h) cho stack

### Phân tích chi tiết:
```
Best case: Cây cân bằng - O(log n) space
Average case: O(√n) space  
Worst case: Cây suy biến (linked list) - O(n) space

Ví dụ với Binary Tree có 1,000,000 nodes:
- Balanced tree: ~20 levels → O(20) space
- Skewed tree: 1,000,000 levels → O(1,000,000) space
```

## Khi nào nên sử dụng DFS

### Nên sử dụng khi:
- **Tìm kiếm đường đi** (không cần ngắn nhất)
- **Backtracking problems** (N-Queens, Sudoku)
- **Topological sorting**
- **Phát hiện cycle** trong đồ thị
- **Tree traversal** cho các operations cụ thể
- **Memory constrained** và cây không quá sâu

### Không nên sử dụng khi:
- **Cần đường đi ngắn nhất** (dùng BFS)
- **Cây có thể vô hạn sâu** (risk stack overflow)
- **Cần xử lý theo level** (dùng BFS)
- **Tìm tất cả nodes** ở distance cụ thể

## Tối ưu hóa và kỹ thuật nâng cao

### 1. Iterative DFS với Stack

```javascript
function dfsIterative(root, callback) {
  if (!root) return;
  
  const stack = [root];
  const visited = new Set();
  
  while (stack.length > 0) {
    const node = stack.pop();
    
    if (visited.has(node)) continue;
    visited.add(node);
    
    callback(node);
    
    // Đẩy children vào stack (reverse order để maintain left-to-right)
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        if (!visited.has(node.children[i])) {
          stack.push(node.children[i]);
        }
      }
    }
  }
}
```

### 2. DFS với path tracking

```javascript
function dfsWithPath(root, target, currentPath = [], allPaths = []) {
  if (!root) return allPaths;
  
  currentPath.push(root.value);
  
  // Nếu tìm thấy target
  if (root.value === target) {
    allPaths.push([...currentPath]); // Clone path
  }
  
  // Tiếp tục với children
  if (root.children) {
    for (const child of root.children) {
      dfsWithPath(child, target, currentPath, allPaths);
    }
  }
  
  currentPath.pop(); // Backtrack
  return allPaths;
}
```

### 3. DFS với early termination

```javascript
function dfsEarlyTermination(root, condition) {
  function dfsHelper(node) {
    if (!node) return null;
    
    // Kiểm tra condition
    if (condition(node)) {
      return node;
    }
    
    // Tìm trong children
    if (node.children) {
      for (const child of node.children) {
        const result = dfsHelper(child);
        if (result) return result; // Early termination
      }
    }
    
    return null;
  }
  
  return dfsHelper(root);
}
```

## Tài liệu tham khảo

- [Wikipedia - Depth-First Search](https://en.wikipedia.org/wiki/Depth-first_search)
- [GeeksforGeeks - Tree Traversals](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [GeeksforGeeks - BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
- [Khan Academy - Tree Traversal](https://www.khanacademy.org/computing/computer-science/algorithms/graph-representation/a/representing-graphs)
- [MIT OpenCourseWare - Graph Algorithms](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/)
- [Visualgo - Graph Traversal](https://visualgo.net/en/dfsbfs)
- [Algorithm Visualizer - DFS](https://algorithm-visualizer.org/graph/depth-first-search)

---

*Post ID: g0l4exnzov92ayu*  
*Category: Tree Algorithms*  
*Created: 22/8/2025*  
*Updated: 29/8/2025*
