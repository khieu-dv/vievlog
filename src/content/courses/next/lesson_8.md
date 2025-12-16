

# 🎓 **Bài 8: State Management trong NextJS App Router**

## 🎯 **Mục tiêu bài học**

Sau khi hoàn thành bài học này, học viên sẽ:

* Hiểu được **state** là gì và vai trò của nó trong React/NextJS App Router.
* Nắm được cách sử dụng `useState`, `useReducer` cho **local state**.
* Biết cách chia sẻ state giữa các component thông qua **Context API**.
* Biết cách tổ chức **global state** với Zustand.
* Biết cách **giữ trạng thái khi reload hoặc navigation** (state persistence).
* Có thể tạo một context (ví dụ: Theme, Auth) và triển khai nó trong App Router.
* Biết được khi nào nên dùng local state, context hay global store.

## 📝 **Nội dung chi tiết**

### 1. **Khái niệm State là gì?**

**State** là dữ liệu nội bộ được lưu trong component để phản ánh UI theo thời gian thực.
Ví dụ: khi người dùng nhập vào input, click button — ta cần state để lưu và phản ứng lại.

➡️ Trước khi code: hãy hình dung state là **bộ nhớ tạm** giúp giao diện tương tác với người dùng.

### 2. **Local State với `useState`**

📌 `useState` là hook đơn giản nhất để tạo state trong component.

```tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <p>Bạn đã nhấn {count} lần</p>
      <button onClick={() => setCount(count + 1)} className="btn">
        Tăng
      </button>
    </div>
  );
}
```

✅ Khi dùng:

* Dùng cho các UI component nhỏ, không cần chia sẻ với nhiều nơi.

### 3. **Local State nâng cao với `useReducer`**

📌 `useReducer` phù hợp với các logic phức tạp hơn (giống Redux nhẹ).

```tsx
'use client';

import { useReducer } from 'react';

function reducer(state: number, action: 'increment' | 'decrement') {
  switch (action) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
  }
}

export default function Counter() {
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <div className="p-4">
      <p>Số đếm: {count}</p>
      <button onClick={() => dispatch('increment')} className="btn">+</button>
      <button onClick={() => dispatch('decrement')} className="btn">-</button>
    </div>
  );
}
```

✅ Khi dùng:

* Khi state phức tạp (ví dụ: nhiều điều kiện chuyển đổi).
* Khi muốn tách reducer ra file riêng như Redux.

### 4. **Chia sẻ State với Context API**

📌 Context API dùng để chia sẻ state giữa các component **không liên quan trực tiếp**.

**Ví dụ: ThemeContext cho Dark/Light mode**

#### 1. `theme-context.tsx`

```tsx
'use client';

import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
};
```

#### 2. Dùng trong `layout.tsx`

```tsx
import { ThemeProvider } from './theme-context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

#### 3. Component switch theme

```tsx
'use client';
import { useTheme } from './theme-context';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Chuyển sang {theme === 'light' ? 'Dark' : 'Light'}
    </button>
  );
}
```

✅ Khi dùng:

* Với những state như `auth`, `theme`, `language`, v.v.
* Không dùng cho dữ liệu thay đổi quá nhanh (có thể gây render lại nhiều lần).

### 5. **Global State với Zustand (Hiện đại, gọn nhẹ)**

📌 Zustand giúp bạn tạo global state mà không cần dùng Context hoặc Redux.

#### 1. Cài đặt:

```bash
npm install zustand
```

#### 2. Tạo store

```tsx
import { create } from 'zustand';

type CounterStore = {
  count: number;
  increase: () => void;
  reset: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
```

#### 3. Dùng trong component:

```tsx
'use client';

import { useCounterStore } from './store';

export default function GlobalCounter() {
  const { count, increase, reset } = useCounterStore();

  return (
    <div className="p-4">
      <p>Global count: {count}</p>
      <button onClick={increase} className="btn">+</button>
      <button onClick={reset} className="btn">Reset</button>
    </div>
  );
}
```

✅ Khi dùng:

* Quản lý state toàn cục, dễ dùng hơn Redux.
* Không cần boilerplate như Redux.

### 6. **State Persistence và Hydration**

📌 Bạn có thể **lưu state vào localStorage** và khôi phục lại sau reload.

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeStore = {
  theme: 'light' | 'dark';
  toggle: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'light',
      toggle: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'theme-storage' }
  )
);
```

✅ Giữ trạng thái **người dùng đã chọn theme** ngay cả khi reload trang.

## 🏆 **Bài tập thực hành có lời giải chi tiết**

### 🎯 Đề bài:

> Tạo một `AuthContext` sử dụng `Context API`, chứa:
>
> * Trạng thái đăng nhập (isLoggedIn)
> * Hàm `login()` và `logout()`
>
> Tạo một form đăng nhập giả lập (không kết nối API), khi ấn "Login" thì hiển thị "Xin chào, bạn đã đăng nhập!", và có nút "Logout".

### ✅ Lời giải chi tiết:

#### 1. Tạo `auth-context.tsx`

```tsx
'use client';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext<{
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be inside AuthProvider');
  return context;
};
```

#### 2. Dùng trong `layout.tsx`

```tsx
import { AuthProvider } from './auth-context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

#### 3. Tạo form đăng nhập

```tsx
'use client';
import { useAuth } from './auth-context';

export default function LoginForm() {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <div className="p-4">
      {isLoggedIn ? (
        <>
          <p>✅ Xin chào, bạn đã đăng nhập!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <p>🔐 Vui lòng đăng nhập</p>
          <button onClick={login}>Login</button>
        </>
      )}
    </div>
  );
}
```

## 🔑 **Những điểm quan trọng cần lưu ý**

* `useState` và `useReducer` chỉ hoạt động trong **Client Component** (`'use client'`).
* Context API nên dùng cho **dữ liệu nhẹ và chia sẻ ít**, không phù hợp với state lớn.
* Zustand là lựa chọn tuyệt vời thay Redux, **ít boilerplate**, dễ mở rộng.
* Luôn đặt `Provider` vào đúng `layout.tsx` hoặc `template.tsx` để tránh lỗi context null.
* Tránh lưu `password`, `token` vào state – nên dùng `cookie` hoặc `httpOnly`.

## 📝 **Bài tập về nhà**

### 🎯 Đề bài:

> Tạo một `CounterStore` bằng Zustand để quản lý số lượt truy cập của người dùng trong ứng dụng.
> Mỗi lần người dùng load lại trang, số lượt truy cập sẽ **tăng 1 và vẫn giữ nguyên sau reload**.

Yêu cầu:

* Sử dụng Zustand + `persist` middleware.
* Hiển thị số lượt truy cập ở góc trên bên phải màn hình.


