---
title: "Bài 18: Testing"
postId: "xv3b20s7qujy3we"
category: "NextJS"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 18: Testing


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:
- Hiểu được tầm quan trọng của Testing trong phát triển ứng dụng Next.js
- Nắm vững các loại Testing: Unit, Integration, E2E Testing
- Thiết lập và cấu hình testing environment cho Next.js
- Viết Unit tests cho components và utils functions
- Thực hiện Integration testing cho API Routes và Server Components
- Triển khai E2E testing cho user flows
- Sử dụng Testing Library và các tools phổ biến
- Áp dụng testing best practices và TDD approach

## 📝 Nội dung chi tiết

### 1. Testing là gì và tại sao cần thiết?

**Testing (kiểm thử)** là quá trình xác minh và kiểm tra xem ứng dụng có hoạt động đúng như mong đợi hay không. Testing giúp:

- **Phát hiện bugs sớm**: Tìm ra lỗi trước khi ứng dụng được triển khai
- **Đảm bảo quality**: Duy trì chất lượng code và tính ổn định
- **Confidence in refactoring**: An tâm khi refactor code
- **Documentation**: Tests như documentation về cách code hoạt động
- **Regression prevention**: Ngăn chặn bugs cũ xuất hiện lại

### 2. Các loại Testing

#### Unit Testing
**Unit Testing** là kiểm thử các đơn vị nhỏ nhất của code (functions, components):

```typescript
// utils/math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export function divide(a: number, b: number): number {
  if (b === 0) throw new Error('Cannot divide by zero');
  return a / b;
}
```

```typescript
// __tests__/utils/math.test.ts
import { add, divide } from '@/utils/math';

describe('Math utils', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-2, -3)).toBe(-5);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should throw error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });
  });
});
```

#### Integration Testing
**Integration Testing** là kiểm thử sự tương tác giữa các modules/components:

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (!body.email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: body,
  });

  return NextResponse.json(user, { status: 201 });
}
```

```typescript
// __tests__/api/users.test.ts
import { GET, POST } from '@/app/api/users/route';
import { NextRequest } from 'next/server';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('/api/users', () => {
  describe('GET', () => {
    it('should return users list', async () => {
      const mockUsers = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockUsers);
    });
  });

  describe('POST', () => {
    it('should create new user', async () => {
      const newUser = { name: 'New User', email: 'new@example.com' };
      const createdUser = { id: 3, ...newUser };

      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

      const request = new NextRequest('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(createdUser);
    });

    it('should return error when email is missing', async () => {
      const invalidUser = { name: 'No Email User' };

      const request = new NextRequest('http://localhost/api/users', {
        method: 'POST',
        body: JSON.stringify(invalidUser),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Email is required');
    });
  });
});
```

#### End-to-End (E2E) Testing
**E2E Testing** là kiểm thử toàn bộ user flow từ đầu đến cuối:

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    // Submit form
    await page.click('[data-testid="login-button"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Verify user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    
    await page.click('[data-testid="login-button"]');

    // Verify error message
    await expect(page.locator('[data-testid="error-message"]'))
      .toHaveText('Invalid credentials');
  });
});
```

### 3. Thiết lập Testing Environment

#### Cài đặt dependencies

```bash
# Jest và React Testing Library
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D jest-environment-jsdom @types/jest

# Playwright cho E2E testing
npm install -D @playwright/test

# MSW cho API mocking
npm install -D msw

# TypeScript types
npm install -D @types/testing-library__jest-dom
```

#### Cấu hình Jest

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/e2e/'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,ts}',
    'utils/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### 4. Testing React Components

#### Testing Client Components

```tsx
// components/Counter.tsx
'use client';

import { useState } from 'react';

interface CounterProps {
  initialCount?: number;
  step?: number;
}

export default function Counter({ initialCount = 0, step = 1 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount(count + step);
  const decrement = () => setCount(count - step);
  const reset = () => setCount(initialCount);

  return (
    <div data-testid="counter">
      <h2>Counter: <span data-testid="count-value">{count}</span></h2>
      <button 
        data-testid="increment-btn" 
        onClick={increment}
      >
        + {step}
      </button>
      <button 
        data-testid="decrement-btn" 
        onClick={decrement}
      >
        - {step}
      </button>
      <button 
        data-testid="reset-btn" 
        onClick={reset}
      >
        Reset
      </button>
    </div>
  );
}
```

```typescript
// __tests__/components/Counter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '@/components/Counter';

describe('Counter Component', () => {
  it('should render with initial count', () => {
    render(<Counter initialCount={5} />);
    
    expect(screen.getByTestId('count-value')).toHaveTextContent('5');
  });

  it('should increment count when increment button is clicked', () => {
    render(<Counter initialCount={0} step={2} />);
    
    const incrementBtn = screen.getByTestId('increment-btn');
    fireEvent.click(incrementBtn);
    
    expect(screen.getByTestId('count-value')).toHaveTextContent('2');
  });

  it('should decrement count when decrement button is clicked', () => {
    render(<Counter initialCount={10} step={3} />);
    
    const decrementBtn = screen.getByTestId('decrement-btn');
    fireEvent.click(decrementBtn);
    
    expect(screen.getByTestId('count-value')).toHaveTextContent('7');
  });

  it('should reset count to initial value', () => {
    render(<Counter initialCount={5} />);
    
    // Increment first
    fireEvent.click(screen.getByTestId('increment-btn'));
    expect(screen.getByTestId('count-value')).toHaveTextContent('6');
    
    // Then reset
    fireEvent.click(screen.getByTestId('reset-btn'));
    expect(screen.getByTestId('count-value')).toHaveTextContent('5');
  });

  it('should display correct step value in buttons', () => {
    render(<Counter step={5} />);
    
    expect(screen.getByTestId('increment-btn')).toHaveTextContent('+ 5');
    expect(screen.getByTestId('decrement-btn')).toHaveTextContent('- 5');
  });
});
```

#### Testing Server Components

```tsx
// components/UserProfile.tsx
import { prisma } from '@/lib/prisma';

interface UserProfileProps {
  userId: string;
}

async function UserProfile({ userId }: UserProfileProps) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { posts: true },
  });

  if (!user) {
    return <div data-testid="user-not-found">User not found</div>;
  }

  return (
    <div data-testid="user-profile">
      <h1 data-testid="user-name">{user.name}</h1>
      <p data-testid="user-email">{user.email}</p>
      <div data-testid="posts-count">
        Posts: {user.posts.length}
      </div>
    </div>
  );
}

export default UserProfile;
```

```typescript
// __tests__/components/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import UserProfile from '@/components/UserProfile';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('UserProfile Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render user profile when user exists', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      posts: [{ id: '1' }, { id: '2' }],
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    render(await UserProfile({ userId: '1' }));

    expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com');
    expect(screen.getByTestId('posts-count')).toHaveTextContent('Posts: 2');
  });

  it('should render not found message when user does not exist', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    render(await UserProfile({ userId: 'nonexistent' }));

    expect(screen.getByTestId('user-not-found')).toHaveTextContent('User not found');
  });
});
```

### 5. Testing Hooks

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

```typescript
// __tests__/hooks/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('should return value from localStorage when available', () => {
    window.localStorage.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value is set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(window.localStorage.getItem('test-key')).toBe('"new-value"');
  });

  it('should work with function updater', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(1);
  });
});
```

### 6. Testing với MSW (Mock Service Worker)

**MSW (Mock Service Worker)** là thư viện cho phép intercept network requests và trả về mock responses:

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock GET /api/users
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ]);
  }),

  // Mock POST /api/users
  http.post('/api/users', async ({ request }) => {
    const newUser = await request.json();
    return HttpResponse.json(
      { id: '3', ...newUser },
      { status: 201 }
    );
  }),

  // Mock error response
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    
    if (id === 'error') {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json({
      id,
      name: `User ${id}`,
      email: `user${id}@example.com`,
    });
  }),
];
```

```typescript
// mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```javascript
// jest.setup.js (thêm vào cuối file)
import { server } from './mocks/server';

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());
```

### 7. E2E Testing với Playwright

#### Cấu hình Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Page Object Model

```typescript
// e2e/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
```

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Authentication', () => {
  test('successful login flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('user@example.com', 'password123');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toHaveText('Welcome back!');
  });

  test('login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid credentials');
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page).toHaveURL('/login');
  });
});
```

### 8. Testing Best Practices

#### 1. AAA Pattern (Arrange, Act, Assert)

```typescript
describe('User service', () => {
  it('should create user with valid data', () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
    };
    const userService = new UserService();

    // Act
    const result = userService.createUser(userData);

    // Assert
    expect(result).toMatchObject({
      id: expect.any(String),
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: expect.any(Date),
    });
  });
});
```

#### 2. Test Isolation

```typescript
// ❌ BAD - Tests depend on each other
describe('User management', () => {
  let userId: string;

  it('should create user', () => {
    const user = createUser({ name: 'John' });
    userId = user.id; // State leaks to next test
    expect(user.name).toBe('John');
  });

  it('should update user', () => {
    const updatedUser = updateUser(userId, { name: 'Jane' }); // Depends on previous test
    expect(updatedUser.name).toBe('Jane');
  });
});

// ✅ GOOD - Each test is independent
describe('User management', () => {
  it('should create user', () => {
    const user = createUser({ name: 'John' });
    expect(user.name).toBe('John');
  });

  it('should update user', () => {
    const user = createUser({ name: 'John' }); // Fresh setup
    const updatedUser = updateUser(user.id, { name: 'Jane' });
    expect(updatedUser.name).toBe('Jane');
  });
});
```

#### 3. Descriptive Test Names

```typescript
// ❌ BAD
it('should work', () => {});
it('test user creation', () => {});

// ✅ GOOD
it('should create user with valid email and name', () => {});
it('should throw ValidationError when email is invalid', () => {});
it('should return empty array when no users exist', () => {});
```

#### 4. Testing Error Cases

```typescript
describe('Email validation', () => {
  it('should accept valid email formats', () => {
    const validEmails = [
      'user@example.com',
      'test.email+tag@domain.co.uk',
      'user123@sub.domain.com',
    ];

    validEmails.forEach(email => {
      expect(validateEmail(email)).toBe(true);
    });
  });

  it('should reject invalid email formats', () => {
    const invalidEmails = [
      'notanemail',
      '@domain.com',
      'user@',
      'user..name@domain.com',
    ];

    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBe(false);
    });
  });
});
```

### 9. Test Coverage và CI/CD Integration

#### Package.json scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

#### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
```

## 🏆 Bài tập thực hành

### Đề bài: Testing cho Todo App

Tạo một Todo App với đầy đủ testing coverage:

1. **Components**: TodoList, TodoItem, AddTodo
2. **API Routes**: GET, POST, PUT, DELETE /api/todos
3. **Custom Hooks**: useTodos, useLocalStorage
4. **E2E Tests**: Complete todo management flow

**Yêu cầu testing:**
- Unit tests cho tất cả components và hooks
- Integration tests cho API routes
- E2E tests cho user flows
- Minimum 90% test coverage

### Lời giải chi tiết:

**Bước 1**: Tạo Todo App structure

```tsx
// types/todo.ts
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}
```

```tsx
// components/TodoItem.tsx
'use client';

import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div 
      data-testid={`todo-item-${todo.id}`}
      className={`flex items-center gap-3 p-3 border rounded-lg ${
        todo.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
      }`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        data-testid={`todo-checkbox-${todo.id}`}
        className="w-5 h-5"
      />
      
      <span 
        data-testid={`todo-title-${todo.id}`}
        className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
      >
        {todo.title}
      </span>
      
      <button
        onClick={() => onDelete(todo.id)}
        data-testid={`todo-delete-${todo.id}`}
        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
      >
        Delete
      </button>
    </div>
  );
}
```

```tsx
// components/AddTodo.tsx
'use client';

import { useState } from 'react';

interface AddTodoProps {
  onAdd: (title: string) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="add-todo-form">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          data-testid="todo-input"
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          data-testid="add-todo-button"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
    </form>
  );
}
```

**Bước 2**: API Routes

```typescript
// app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Todo } from '@/types/todo';

// In-memory storage (trong thực tế sẽ dùng database)
let todos: Todo[] = [];

export async function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };

    todos.push(newTodo);
    
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
```

**Bước 3**: Unit Tests

```typescript
// __tests__/components/TodoItem.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '@/components/TodoItem';
import { Todo } from '@/types/todo';

const mockTodo: Todo = {
  id: '1',
  title: 'Test Todo',
  completed: false,
  createdAt: new Date(),
};

describe('TodoItem Component', () => {
  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo item correctly', () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByTestId('todo-title-1')).toHaveTextContent('Test Todo');
    expect(screen.getByTestId('todo-checkbox-1')).not.toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    fireEvent.click(screen.getByTestId('todo-checkbox-1'));
    
    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });

  it('should call onDelete when delete button is clicked', () => {
    render(
      <TodoItem 
        todo={mockTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    fireEvent.click(screen.getByTestId('todo-delete-1'));
    
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should show completed styling when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    
    render(
      <TodoItem 
        todo={completedTodo} 
        onToggle={mockOnToggle} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByTestId('todo-checkbox-1')).toBeChecked();
    expect(screen.getByTestId('todo-title-1')).toHaveClass('line-through');
  });
});
```

```typescript
// __tests__/components/AddTodo.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AddTodo from '@/components/AddTodo';

describe('AddTodo Component', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render add todo form', () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    expect(screen.getByTestId('todo-input')).toBeInTheDocument();
    expect(screen.getByTestId('add-todo-button')).toBeInTheDocument();
  });

  it('should call onAdd with correct title when form is submitted', () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByTestId('todo-input');
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(screen.getByTestId('add-todo-button'));

    expect(mockOnAdd).toHaveBeenCalledWith('New Todo');
  });

  it('should clear input after adding todo', () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByTestId('todo-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(screen.getByTestId('add-todo-button'));

    expect(input.value).toBe('');
  });

  it('should not call onAdd when title is empty', () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    fireEvent.click(screen.getByTestId('add-todo-button'));

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should trim whitespace from title', () => {
    render(<AddTodo onAdd={mockOnAdd} />);

    const input = screen.getByTestId('todo-input');
    fireEvent.change(input, { target: { value: '  Trimmed Todo  ' } });
    fireEvent.click(screen.getByTestId('add-todo-button'));

    expect(mockOnAdd).toHaveBeenCalledWith('Trimmed Todo');
  });
});
```

**Bước 4**: API Tests

```typescript
// __tests__/api/todos.test.ts
import { GET, POST } from '@/app/api/todos/route';
import { NextRequest } from 'next/server';

describe('/api/todos', () => {
  describe('GET', () => {
    it('should return empty array initially', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe('POST', () => {
    it('should create new todo', async () => {
      const todoData = { title: 'Test Todo' };
      
      const request = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        body: JSON.stringify(todoData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toMatchObject({
        id: expect.any(String),
        title: 'Test Todo',
        completed: false,
        createdAt: expect.any(String),
      });
    });

    it('should return error when title is missing', async () => {
      const request = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Title is required');
    });

    it('should trim whitespace from title', async () => {
      const todoData = { title: '  Test Todo  ' };
      
      const request = new NextRequest('http://localhost/api/todos', {
        method: 'POST',
        body: JSON.stringify(todoData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(data.title).toBe('Test Todo');
    });
  });
});
```

**Bước 5**: E2E Tests

```typescript
// e2e/todos.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Todo App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add new todo', async ({ page }) => {
    const todoTitle = 'Buy groceries';
    
    await page.fill('[data-testid="todo-input"]', todoTitle);
    await page.click('[data-testid="add-todo-button"]');

    await expect(page.locator('[data-testid^="todo-title-"]').first())
      .toHaveText(todoTitle);
  });

  test('should toggle todo completion', async ({ page }) => {
    // Add todo first
    await page.fill('[data-testid="todo-input"]', 'Test Todo');
    await page.click('[data-testid="add-todo-button"]');

    // Get the first todo checkbox
    const checkbox = page.locator('[data-testid^="todo-checkbox-"]').first();
    const title = page.locator('[data-testid^="todo-title-"]').first();

    // Toggle completion
    await checkbox.click();

    await expect(checkbox).toBeChecked();
    await expect(title).toHaveClass(/line-through/);
  });

  test('should delete todo', async ({ page }) => {
    // Add todo first
    await page.fill('[data-testid="todo-input"]', 'Todo to delete');
    await page.click('[data-testid="add-todo-button"]');

    // Delete the todo
    await page.click('[data-testid^="todo-delete-"]');

    // Verify todo is removed
    await expect(page.locator('[data-testid^="todo-item-"]')).toHaveCount(0);
  });

  test('should not add empty todo', async ({ page }) => {
    await page.click('[data-testid="add-todo-button"]');

    await expect(page.locator('[data-testid^="todo-item-"]')).toHaveCount(0);
  });

  test('should clear input after adding todo', async ({ page }) => {
    const input = page.locator('[data-testid="todo-input"]');
    
    await input.fill('New Todo');
    await page.click('[data-testid="add-todo-button"]');

    await expect(input).toHaveValue('');
  });
});
```

**Giải thích logic:**
1. **Test Structure**: Tổ chức tests theo từng module và chức năng
2. **Mocking**: Sử dụng Jest mocks cho external dependencies
3. **Test Data**: Tạo mock data consistent và dễ maintain
4. **User-Centric Testing**: E2E tests focus vào user behaviors
5. **Coverage**: Đảm bảo test coverage cho happy path và edge cases

## 🔑 Những điểm quan trọng cần lưu ý

1. **Test Pyramid**: 70% Unit tests, 20% Integration tests, 10% E2E tests
2. **Test-Driven Development**: Viết tests trước, code sau (TDD)
3. **Mocking Strategy**: Mock external dependencies, không mock code đang test
4. **Test Environment**: Riêng biệt với development và production
5. **Continuous Integration**: Chạy tests tự động trên CI/CD pipeline
6. **Performance**: E2E tests chậm hơn, chỉ test critical user flows
7. **Maintenance**: Tests cũng cần refactor và maintain như production code

## 📝 Bài tập về nhà

Tạo một Blog App với testing coverage hoàn chỉnh:

1. **Features cần test:**
   - User authentication (login/logout)
   - Post creation, editing, deletion
   - Comment system
   - Search và filtering
   - Pagination

2. **Testing requirements:**
   - Unit tests cho tất cả components và utilities
   - Integration tests cho API routes và database interactions
   - E2E tests cho complete user journeys
   - Snapshot testing cho UI components
   - Performance testing cho data loading

3. **Technical requirements:**
   - Next.js App Router với TypeScript
   - Database integration (SQLite cho testing)
   - Authentication với NextAuth.js
   - Form validation và error handling
   - Responsive design testing

**Bonus challenges:**
- Visual regression testing với Playwright
- API mocking với MSW
- Test coverage reporting
- Accessibility testing
- Performance monitoring trong tests

---

*Post ID: xv3b20s7qujy3we*  
*Category: NextJS*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
