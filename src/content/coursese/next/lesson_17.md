

# Bài 17: Testing trong NextJS

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu được vai trò và các loại testing phổ biến trong ứng dụng NextJS.
* Biết cách cài đặt và cấu hình môi trường test với Jest và React Testing Library.
* Viết được các unit test cho hàm và component đơn giản trong NextJS App Router.
* Hiểu được cách thực hiện integration test cơ bản trong NextJS.
* Nắm được nguyên tắc viết end-to-end (E2E) test với Cypress và cách thiết lập môi trường.
* Biết cách phân biệt test cho Server Components và Client Components.
* Biết cách đo test coverage và tích hợp test vào quy trình CI/CD đơn giản.

## 📝 Nội dung chi tiết

### 1. Tại sao cần Testing?

**Khái niệm:**
Testing là quá trình kiểm tra phần mềm để đảm bảo ứng dụng chạy đúng như kỳ vọng, giảm thiểu lỗi và nâng cao chất lượng sản phẩm. Việc viết test giúp phát hiện sớm lỗi, giảm chi phí sửa chữa, và tạo sự tin tưởng khi phát triển ứng dụng.

### 2. Các loại Testing phổ biến trong NextJS

* **Unit Testing:** Kiểm tra các đơn vị nhỏ nhất của code (hàm, component) hoạt động đúng.
* **Integration Testing:** Kiểm tra sự phối hợp giữa các module hoặc component.
* **End-to-End Testing (E2E):** Kiểm tra toàn bộ flow của ứng dụng từ góc nhìn người dùng.

### 3. Thiết lập môi trường test với Jest và React Testing Library

**Jest:** Là framework test JavaScript phổ biến, hỗ trợ mock, snapshot, assertion.
**React Testing Library (RTL):** Thư viện hỗ trợ test UI React theo hướng người dùng (không test implementation details).

**Cài đặt:**

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event babel-jest
```

**Cấu hình cơ bản:**
Tạo file `jest.config.js` đơn giản:

```js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

File `jest.setup.js`:

```js
import '@testing-library/jest-dom';
```

Giải thích:

* `testEnvironment: 'jsdom'` giả lập môi trường trình duyệt để test React.
* `setupFilesAfterEnv` để load các hàm mở rộng như `toBeInTheDocument`.

### 4. Viết Unit Test cho Utility Function

**Khái niệm:** Unit test là kiểm tra một hàm hay module nhỏ, không phụ thuộc vào UI.

Ví dụ:

```ts
// utils/formatDate.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN');
}
```

Test:

```ts
import { formatDate } from '@/utils/formatDate';

test('formatDate formats date in Vietnamese locale', () => {
  const date = new Date('2025-08-04T00:00:00');
  expect(formatDate(date)).toBe('04/08/2025');
});
```

Giải thích: Đoạn test trên kiểm tra hàm `formatDate` trả về chuỗi định dạng đúng.

### 5. Viết Component Test với React Testing Library

**Khái niệm:** Test UI component tương tác và hiển thị ra sao.

Ví dụ component Button:

```tsx
// components/Button.tsx
import React from 'react';

type ButtonProps = {
  label: string;
  onClick: () => void;
};

export default function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

Test:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

test('Button displays label and handles click', () => {
  const handleClick = jest.fn();
  render(<Button label="Click me" onClick={handleClick} />);

  const btn = screen.getByText('Click me');
  expect(btn).toBeInTheDocument();

  fireEvent.click(btn);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

Giải thích:

* Render component
* Kiểm tra hiển thị text
* Mô phỏng click và kiểm tra callback được gọi

### 6. Testing Server Components và Client Components

* **Server Components** thường không có tương tác UI, chủ yếu test logic nếu có, hoặc test qua integration.
* **Client Components** cần test tương tác, event, state.

*Lưu ý:* Testing Server Components phức tạp hơn, trong bài học này tập trung vào Client Components.

### 7. Integration Testing trong NextJS

Kiểm tra sự phối hợp giữa component, API hoặc routing. Ví dụ, test một page kết hợp nhiều component và data fetching.

Ví dụ đơn giản: test trang có button khi click gọi API giả lập.

### 8. End-to-End (E2E) Testing với Cypress

**Khái niệm:** E2E test kiểm tra toàn bộ flow ứng dụng thực tế từ UI, mô phỏng hành động người dùng.

**Cài đặt:**

```bash
npm install --save-dev cypress
```

**Ví dụ test mở trang chủ và kiểm tra tiêu đề:**

```js
describe('Homepage', () => {
  it('should display welcome message', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Welcome to My NextJS App');
  });
});
```

Giải thích:

* `cy.visit()` để mở trang
* `cy.contains()` để kiểm tra nội dung hiển thị

### 9. Test Coverage và CI/CD

* Sử dụng Jest để đo độ phủ test (`coverage`) với lệnh:

```bash
jest --coverage
```

* Tích hợp test vào pipeline CI/CD (GitHub Actions, GitLab CI) để tự động chạy test khi có commit/pull request.

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài: Viết Unit Test và Component Test cho một nút Like đơn giản

**Mô tả:**
Xây dựng component `LikeButton` có:

* Hiển thị số lượt like.
* Khi click vào button, số lượt like tăng lên 1.
* Viết unit test cho hàm tăng like.
* Viết component test để kiểm tra UI và sự kiện click.

**Bước 1: Viết component LikeButton**

```tsx
import React, { useState } from 'react';

export function incrementLike(count: number): number {
  return count + 1;
}

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  const handleClick = () => {
    setLikes(incrementLike(likes));
  };

  return (
    <button onClick={handleClick} aria-label="like-button">
      Likes: {likes}
    </button>
  );
}
```

**Bước 2: Viết unit test cho hàm incrementLike**

```ts
import { incrementLike } from '@/components/LikeButton';

test('incrementLike tăng giá trị lên 1', () => {
  expect(incrementLike(0)).toBe(1);
  expect(incrementLike(5)).toBe(6);
});
```

**Bước 3: Viết component test cho LikeButton**

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import LikeButton from '@/components/LikeButton';

test('LikeButton hiển thị số lượt like và tăng khi click', () => {
  render(<LikeButton />);
  const btn = screen.getByRole('button', { name: /like-button/i });
  expect(btn).toHaveTextContent('Likes: 0');

  fireEvent.click(btn);
  expect(btn).toHaveTextContent('Likes: 1');

  fireEvent.click(btn);
  expect(btn).toHaveTextContent('Likes: 2');
});
```

**Phân tích:**

* Tách hàm logic `incrementLike` để dễ test.
* Sử dụng state để lưu số lượt like.
* Test UI đảm bảo số lượt like hiển thị chính xác và cập nhật khi click.
* Sử dụng `aria-label` để dễ dàng lấy element trong test.

## 🔑 Những điểm quan trọng cần lưu ý

* **Test nên tách biệt:** Viết test nhỏ, rõ ràng, không quá phức tạp.
* **Ưu tiên test hành vi:** Testing Library khuyến khích test UI theo cách người dùng tương tác, tránh test implementation details.
* **Mock API và side effects:** Trong integration và E2E test, nên mock dữ liệu hoặc dùng test environment để tránh phụ thuộc môi trường thật.
* **Phân biệt Server và Client Component:** Server Component khó test tương tác, Client Component cần test event và state.
* **Test coverage không phải là tất cả:** Chất lượng test quan trọng hơn số lượng.
* **Tích hợp test trong quy trình phát triển:** Để đảm bảo tính ổn định và nhanh chóng phát hiện lỗi.

## 📝 Bài tập về nhà

### Đề bài: Viết test cho một Form đăng nhập đơn giản

**Yêu cầu:**

* Xây dựng component `LoginForm` với 2 input: email và password, và 1 button submit.
* Khi click submit, gọi một hàm giả lập `onLogin(email, password)`.
* Viết test cho:

  * Hiển thị form đúng.
  * Nhập liệu vào các trường input.
  * Kiểm tra sự kiện submit được gọi với giá trị đúng.

**Gợi ý:** Sử dụng React Testing Library, mock hàm `onLogin` bằng jest.fn().

Nếu bạn cần tôi có thể hỗ trợ soạn chi tiết lời giải bài tập này hoặc demo live coding cho phần test.

