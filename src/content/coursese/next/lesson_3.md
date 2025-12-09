

# Bài 3: Cài Đặt Và Cấu Hình TypeScript Trong NextJS App Router



## 🎯 Mục tiêu bài học


* Hiểu được **TypeScript là gì**
* Biết cách **cài đặt TypeScript** 
* Nắm rõ cấu trúc và các mục chính trong file cấu hình `tsconfig.json`.
* Hiểu các **type definitions cơ bản**
* Áp dụng TypeScript để viết **các component React/NextJS có kiểu dữ liệu rõ ràng**

## 📝 Nội dung chi tiết

### 1. TypeScript là gì? Tại sao nên dùng?

**TypeScript** là một ngôn ngữ lập trình dựa trên JavaScript, mở rộng thêm tính năng **gõ kiểu tĩnh (static typing)**.

**Ví dụ đơn giản:**

```typescript
let age: number = 30; 
age = "30"; // Lỗi!
```


### 2. Cách cài đặt TypeScript trong NextJS


### ✅ Cách 1: Bắt đầu dự án Next.js mới với TypeScript

```bash
npx create-next-app@latest my-app
cd my-app
```


### ✅ Cách 2: Thêm TypeScript vào dự án Next.js hiện tại

Nếu bạn đã có một dự án Next.js sử dụng JavaScript và muốn chuyển sang TypeScript, làm theo các bước sau:

##### 2.1. Cài đặt các package cần thiết:

```bash
npm install --save-dev typescript @types/react @types/node
# hoặc với yarn
yarn add --dev typescript @types/react @types/node
```

##### 2.2. Tạo file `tsconfig.json`

Chạy lệnh sau để Next.js tự động tạo `tsconfig.json`:

```bash
npx next dev
```

Next.js sẽ phát hiện TypeScript và tạo file `tsconfig.json` mặc định.


### 3. Hiểu về file `tsconfig.json`

Đây là file cấu hình quan trọng quyết định cách TypeScript hoạt động trong dự án của bạn.


```json
{
  "compilerOptions": {
    "target": "esnext",             
    "module": "esnext",              
    "lib": ["dom", "dom.iterable", "esnext"], 
    "allowJs": true,                
    "skipLibCheck": true,           
    "strict": true,                 
    "forceConsistentCasingInFileNames": true,  
    "noEmit": true,                
    "esModuleInterop": true,       
    "moduleResolution": "node",    
    "resolveJsonModule": true,     
    "isolatedModules": true,       
    "jsx": "preserve"              
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],  
  "exclude": ["node_modules"]                          
}
```


### 4. Type definitions cơ bản trong TypeScript

Giờ ta cùng tìm hiểu cách khai báo các kiểu dữ liệu quan trọng nhất bạn sẽ dùng nhiều trong NextJS:


#### 4.1 Kiểu dữ liệu cơ bản

* `string`: chuỗi ký tự
* `number`: số (cả nguyên và thực)
* `boolean`: đúng hoặc sai
* `any`: kiểu bất kỳ (dùng hạn chế, dễ gây mất an toàn)
* `void`: không trả về gì (dùng cho hàm)
* `null` và `undefined`

**Ví dụ:**

```typescript
let name: string = "Nguyen Van A";
let age: number = 25;
let isStudent: boolean = true;
```



#### 4.2 Interface 

Khi làm việc với React Props hay các cấu trúc dữ liệu phức tạp, bạn dùng `interface` hoặc `type` để định nghĩa kiểu cho đối tượng.

**Interface** là một cách mô tả “hình dạng” của đối tượng.

```typescript
interface User {
  id: number;
  name: string;
  email?: string; 
}

const user: User = {
  id: 1,
  name: "Nguyen Van A"
};
```




### 5. Áp dụng TypeScript trong NextJS Components

Chúng ta sẽ viết một component đơn giản sử dụng props có kiểu.

```tsx
// app/components/UserCard.tsx

interface UserCardProps {
  name: string;
  age: number;
  isOnline?: boolean;
}

export default function UserCard({ name, age, isOnline = false }: UserCardProps) {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold">{name}</h2>
      <p>Age: {age}</p>
      <p>Status: {isOnline ? "Online" : "Offline"}</p>
    </div>
  );
}
```

## 🏆 Bài tập thực hành

### Đề bài

**Tạo một component `ProfileCard` nhận các props sau:**

* `username`: chuỗi (bắt buộc)
* `email`: chuỗi (không bắt buộc)
* `age`: số (bắt buộc)

**Yêu cầu:**

* Viết interface hoặc type cho props.
* Component hiển thị thông tin người dùng theo dạng thẻ (card) có style đơn giản bằng TailwindCSS.
* Nếu `email` không có, hiển thị dòng "Email chưa cập nhật".




## 🔑 Những điểm quan trọng cần lưu ý

* **TypeScript giúp phát hiện lỗi sớm, viết code an toàn và dễ bảo trì.**
* Luôn khai báo kiểu cho props trong component để tránh lỗi khi truyền sai dữ liệu.
* `interface` và `type` là 2 cách định nghĩa kiểu dữ liệu, nên dùng `interface` cho object, `type` cho các kiểu phức tạp.
* Cấu hình `tsconfig.json` chuẩn giúp dự án chạy ổn định, bật chế độ `strict` để kiểm tra lỗi chặt chẽ hơn.
* Mặc dù có thể dùng `any` nhưng nên tránh vì mất hết lợi ích của TypeScript.
* Đặt giá trị mặc định cho props không bắt buộc để tránh lỗi khi sử dụng.



## 📝 Bài tập về nhà

### Đề bài:

Tạo một component **`TodoItem`** nhận props:

* `title`: string (bắt buộc)
* `completed`: boolean (mặc định false)
* `dueDate`: string (định dạng ngày tháng, không bắt buộc)

**Yêu cầu:**

* Viết interface/type cho props.
* Component hiển thị:

  * Tiêu đề của todo
  * Trạng thái completed (ví dụ: gạch chân nếu completed)
  * Ngày hết hạn nếu có, định dạng đẹp (có thể dùng thư viện date hoặc JS thuần)
* Sử dụng TypeScript để đảm bảo an toàn kiểu dữ liệu.

