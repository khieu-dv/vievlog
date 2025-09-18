export interface MDXTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  content: string;
  category: 'course' | 'tutorial' | 'documentation' | 'blog' | 'presentation';
}

export const mdxTemplates: MDXTemplate[] = [
  {
    id: 'course-intro',
    name: 'Giới thiệu khóa học',
    description: 'Template cho bài giới thiệu khóa học với sơ đồ Mermaid',
    icon: '🎓',
    category: 'course',
    content: `# Bài 0: Giới thiệu khóa học

<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-8">
  <h2 className="text-3xl font-bold mb-4">🚀 Chào mừng đến với khóa học!</h2>
  <p className="text-lg">Hành trình khám phá kiến thức mới bắt đầu từ đây</p>
</div>

## 1. 🗺️ Sơ đồ tổng quan khóa học

\`\`\`mermaid
flowchart TD
    Start([🎯 Bắt đầu khóa học]) --> Foundation{📚 Phần 1<br/>Kiến thức nền tảng<br/>2-3 tuần}

    Foundation --> B1[Bài 1: Giới thiệu cơ bản<br/>📝 Concepts & Setup →]
    Foundation --> B2[Bài 2: Thực hành đầu tiên<br/>💻 Hands-on practice →]
    Foundation --> B3[Bài 3: Kiến thức nâng cao<br/>🔧 Advanced topics →]

    B1 --> Advanced{🚀 Phần 2<br/>Nâng cao<br/>2-3 tuần}
    B2 --> Advanced
    B3 --> Advanced

    Advanced --> B4[Bài 4: Chuyên sâu<br/>🎯 Deep dive →]
    Advanced --> B5[Bài 5: Thực hành nâng cao<br/>💼 Real projects →]

    B4 --> Complete([🎉 Hoàn thành])
    B5 --> Complete

    %% Styling
    classDef phaseBox fill:#e1f5fe,stroke:#01579b,stroke-width:3px,color:#000
    classDef lessonBox fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef startEnd fill:#c8e6c9,stroke:#1b5e20,stroke-width:3px,color:#000

    class Foundation,Advanced phaseBox
    class B1,B2,B3,B4,B5 lessonBox
    class Start,Complete startEnd
\`\`\`

## 2. Mục tiêu khóa học

### 🎯 Sau khóa học bạn sẽ có thể:

- ✅ Nắm vững các khái niệm cơ bản
- ✅ Áp dụng kiến thức vào thực tế
- ✅ Tự tin giải quyết các vấn đề phức tạp
- ✅ Tiếp tục phát triển kỹ năng

## 3. Yêu cầu tiên quyết

<div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-6">
  <h3 className="text-lg font-semibold text-amber-800 mb-4">📋 Cần chuẩn bị</h3>
  <ul className="list-disc list-inside text-amber-700 space-y-2">
    <li>Kiến thức cơ bản về lập trình</li>
    <li>Máy tính có kết nối Internet</li>
    <li>Tinh thần học hỏi và khám phá</li>
  </ul>
</div>

## 4. Lộ trình học tập

| Tuần | Nội dung | Mục tiêu |
|------|----------|----------|
| **1-2** | Kiến thức nền tảng | Hiểu concepts cơ bản |
| **3-4** | Thực hành và ứng dụng | Áp dụng vào project |
| **5-6** | Nâng cao và chuyên sâu | Giải quyết vấn đề phức tạp |

---

<div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg text-center">
  <h3 className="text-2xl font-bold mb-2">🎉 Sẵn sàng bắt đầu!</h3>
  <p className="text-lg">Hãy cùng khám phá và học hỏi những điều mới mẻ!</p>
</div>`
  },

  {
    id: 'tutorial-basic',
    name: 'Tutorial cơ bản',
    description: 'Template cho bài hướng dẫn từng bước',
    icon: '📖',
    category: 'tutorial',
    content: `# Tutorial: [Tên Tutorial]

## Giới thiệu

Trong tutorial này, bạn sẽ học cách...

<div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
  <h4 className="font-semibold text-blue-800 mb-2">🎯 Mục tiêu</h4>
  <ul className="text-blue-700 space-y-1">
    <li>• Mục tiêu 1</li>
    <li>• Mục tiêu 2</li>
    <li>• Mục tiêu 3</li>
  </ul>
</div>

## Yêu cầu tiên quyết

- [ ] Kiến thức cơ bản về...
- [ ] Đã cài đặt...
- [ ] Hiểu biết về...

## Bước 1: Chuẩn bị

Trước tiên, chúng ta cần...

\`\`\`bash
# Cài đặt dependencies
npm install package-name
\`\`\`

## Bước 2: Thực hiện

Tiếp theo, chúng ta sẽ...

\`\`\`javascript
// Code example
function example() {
  console.log("Hello World!");
}
\`\`\`

## Bước 3: Kiểm tra kết quả

Để kiểm tra xem mọi thứ đã hoạt động đúng...

<div className="bg-green-50 p-4 rounded-lg border border-green-200">
  <h4 className="font-semibold text-green-800 mb-2">✅ Kết quả mong đợi</h4>
  <p className="text-green-700">Mô tả kết quả bạn sẽ thấy...</p>
</div>

## Khắc phục sự cố

<div className="bg-red-50 p-4 rounded-lg border border-red-200">
  <h4 className="font-semibold text-red-800 mb-2">⚠️ Lỗi thường gặp</h4>
  <p className="text-red-700">Nếu gặp lỗi... thì cách khắc phục là...</p>
</div>

## Kết luận

Chúc mừng! Bạn đã hoàn thành...

### Bước tiếp theo

- Thử experiment với...
- Tìm hiểu thêm về...
- Áp dụng vào project của bạn`
  },

  {
    id: 'documentation',
    name: 'Tài liệu kỹ thuật',
    description: 'Template cho documentation API hoặc thư viện',
    icon: '📚',
    category: 'documentation',
    content: `# [Tên API/Library] Documentation

## Tổng quan

Mô tả ngắn gọn về API/library...

## Cài đặt

\`\`\`bash
# NPM
npm install library-name

# Yarn
yarn add library-name
\`\`\`

## Quick Start

\`\`\`javascript
import { LibraryName } from 'library-name';

const instance = new LibraryName({
  // configuration
});
\`\`\`

## API Reference

### Methods

#### \`methodName(params)\`

Mô tả method...

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| param1 | \`string\` | ✅ | Mô tả param1 |
| param2 | \`number\` | ❌ | Mô tả param2 |

**Returns:** \`Promise<ResponseType>\`

**Example:**

\`\`\`javascript
const result = await instance.methodName('value', 123);
console.log(result);
\`\`\`

### Events

#### \`onEvent\`

Được trigger khi...

\`\`\`javascript
instance.on('event', (data) => {
  console.log('Event received:', data);
});
\`\`\`

## Ví dụ thực tế

### Use case 1: [Tên use case]

\`\`\`javascript
// Example implementation
\`\`\`

### Use case 2: [Tên use case]

\`\`\`javascript
// Example implementation
\`\`\`

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| option1 | \`boolean\` | \`true\` | Mô tả option1 |
| option2 | \`string\` | \`'default'\` | Mô tả option2 |

## Troubleshooting

### Lỗi thường gặp

**Error: "Something went wrong"**

Nguyên nhân và cách khắc phục...

## Changelog

### v1.0.0
- Initial release
- Feature A
- Feature B`
  },

  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Template cho bài viết blog/bài báo',
    icon: '✍️',
    category: 'blog',
    content: `# [Tiêu đề bài viết]

<div className="bg-gray-50 p-6 rounded-lg mb-8">
  <p className="text-gray-600 mb-2">Xuất bản: [Ngày tháng năm]</p>
  <p className="text-lg text-gray-800">Tóm tắt ngắn gọn về nội dung bài viết...</p>
</div>

## Giới thiệu

Mở đầu bài viết với một câu chuyện hoặc vấn đề thú vị...

## Nội dung chính

### Phần 1: [Tiêu đề phần]

Nội dung chi tiết của phần 1...

<div className="bg-blue-50 p-4 rounded-lg border border-blue-200 my-6">
  <h4 className="font-semibold text-blue-800 mb-2">💡 Tip</h4>
  <p className="text-blue-700">Một tip hữu ích liên quan đến nội dung...</p>
</div>

### Phần 2: [Tiêu đề phần]

Nội dung chi tiết của phần 2...

#### Code example

\`\`\`javascript
// Ví dụ code minh họa
function example() {
  return "Hello World!";
}
\`\`\`

### Phần 3: [Tiêu đề phần]

Nội dung chi tiết của phần 3...

## Kết luận

Tổng kết lại những điểm chính...

### Key Takeaways

- ✅ Điểm chính 1
- ✅ Điểm chính 2
- ✅ Điểm chính 3

## Tài liệu tham khảo

1. [Link 1](https://example.com)
2. [Link 2](https://example.com)
3. [Link 3](https://example.com)

---

<div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg text-center">
  <h3 className="text-xl font-bold mb-2">🤔 Bạn nghĩ sao về bài viết này?</h3>
  <p>Hãy để lại comment chia sẻ ý kiến của bạn!</p>
</div>`
  },

  {
    id: 'presentation',
    name: 'Bài thuyết trình',
    description: 'Template cho slide presentation',
    icon: '📊',
    category: 'presentation',
    content: `# [Tiêu đề Presentation]

<div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-8 rounded-lg text-center mb-8">
  <h1 className="text-4xl font-bold mb-4">[Tiêu đề chính]</h1>
  <p className="text-xl">[Phụ đề hoặc mô tả ngắn]</p>
  <p className="mt-4 text-lg opacity-90">Trình bày bởi: [Tên người thuyết trình]</p>
</div>

---

## 📋 Agenda

1. **Giới thiệu** - Tổng quan về chủ đề
2. **Vấn đề** - Xác định thách thức
3. **Giải pháp** - Đề xuất approach
4. **Demo/Ví dụ** - Minh họa thực tế
5. **Kết luận** - Tổng kết và Q&A

---

## 🎯 Mục tiêu

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
  <div className="text-center p-4 bg-green-50 rounded-lg">
    <div className="text-4xl mb-2">📚</div>
    <h4 className="font-semibold">Hiểu biết</h4>
    <p className="text-sm">Nắm được concepts cơ bản</p>
  </div>
  <div className="text-center p-4 bg-blue-50 rounded-lg">
    <div className="text-4xl mb-2">🛠️</div>
    <h4 className="font-semibold">Kỹ năng</h4>
    <p className="text-sm">Áp dụng vào thực tế</p>
  </div>
  <div className="text-center p-4 bg-purple-50 rounded-lg">
    <div className="text-4xl mb-2">💡</div>
    <h4 className="font-semibold">Ý tưởng</h4>
    <p className="text-sm">Tạo ra solutions mới</p>
  </div>
</div>

---

## 🔍 Vấn đề hiện tại

### Thách thức chính:

- ❌ **Vấn đề 1:** Mô tả chi tiết vấn đề
- ❌ **Vấn đề 2:** Impact và hậu quả
- ❌ **Vấn đề 3:** Tại sao cần giải quyết ngay

\`\`\`mermaid
flowchart TD
    A[Current State] --> B{Problems}
    B --> C[Problem 1]
    B --> D[Problem 2]
    B --> E[Problem 3]
    C --> F[Impact 1]
    D --> F[Impact 2]
    E --> F[Impact 3]
    F --> G[Need Solution]
\`\`\`

---

## 💡 Giải pháp đề xuất

### Approach chính:

1. **Bước 1:** [Mô tả bước đầu tiên]
2. **Bước 2:** [Mô tả bước thứ hai]
3. **Bước 3:** [Mô tả bước cuối]

### Lợi ích:

<div className="bg-green-50 p-6 rounded-lg border border-green-200">
  <h4 className="font-semibold text-green-800 mb-4">✅ Benefits</h4>
  <ul className="text-green-700 space-y-2">
    <li>• Lợi ích 1: Cải thiện performance 50%</li>
    <li>• Lợi ích 2: Giảm complexity</li>
    <li>• Lợi ích 3: Tăng maintainability</li>
  </ul>
</div>

---

## 🔬 Demo/Ví dụ

### Case Study: [Tên case study]

\`\`\`javascript
// Code demonstration
const solution = new Solution({
  config: 'optimized'
});

const result = await solution.execute();
console.log('Result:', result);
\`\`\`

### Metrics:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Performance | 100ms | 50ms | **50% faster** |
| Memory Usage | 200MB | 150MB | **25% less** |
| Error Rate | 5% | 1% | **80% reduction** |

---

## 📈 Roadmap

\`\`\`mermaid
timeline
    title Implementation Roadmap

    section Phase 1
        Week 1-2    : Research & Planning
                    : Architecture design

    section Phase 2
        Week 3-4    : Core development
                    : Testing & validation

    section Phase 3
        Week 5-6    : Integration
                    : Performance optimization

    section Phase 4
        Week 7-8    : Deployment
                    : Monitoring & maintenance
\`\`\`

---

## 🎯 Kết luận

### Key Takeaways:

1. **Insight 1:** Điều quan trọng nhất học được
2. **Insight 2:** Approach hiệu quả nhất
3. **Insight 3:** Next steps để implement

### Next Actions:

- [ ] Action item 1
- [ ] Action item 2
- [ ] Action item 3

---

<div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-lg text-center">
  <h2 className="text-3xl font-bold mb-4">🤝 Q&A Time</h2>
  <p className="text-xl">Câu hỏi và thảo luận</p>
</div>

**Thank you for your attention!** 👏`
  }
];

export function getTemplatesByCategory(category: MDXTemplate['category']) {
  return mdxTemplates.filter(template => template.category === category);
}

export function getTemplateById(id: string) {
  return mdxTemplates.find(template => template.id === id);
}