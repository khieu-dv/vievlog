---
title: "Bài 12: CSS và Styling"
postId: "x6fbc1env3k3r5o"
category: "NextJS"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 12: CSS và Styling


## 🎯 Mục tiêu học tập

Sau khi hoàn thành bài học này, bạn sẽ có thể:
- Sử dụng Tailwind CSS hiệu quả trong NextJS
- Triển khai CSS Modules cho component-specific styling  
- Làm việc với CSS-in-JS solutions (styled-components, emotion)
- Sử dụng Sass/SCSS trong NextJS projects
- Tạo design systems và theme management
- Implement responsive design patterns
- Tối ưu hóa CSS performance và bundle size
- Sử dụng CSS custom properties và advanced features

## 📝 Nội dung chi tiết

### 1. Tailwind CSS Integration

**Tailwind CSS** là utility-first CSS framework cung cấp các class tiện ích để xây dựng giao diện nhanh chóng mà không cần viết CSS custom.

#### 1.1 Cài đặt và cấu hình Tailwind
```bash
# Cài đặt Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fdf4ff',
          500: '#a855f7',
          900: '#581c87',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  darkMode: 'class', // Enable dark mode
}
```

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
  }
  
  .btn-primary {
    @apply btn bg-primary-500 text-white hover:bg-primary-600;
  }
  
  .btn-secondary {
    @apply btn bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700;
  }
  
  .input {
    @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

#### 1.2 Advanced Tailwind Components
```typescript
// app/components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        ghost: 'hover:bg-gray-100 hover:text-gray-900',
        link: 'text-primary-500 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-lg px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

```typescript
// app/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

#### 1.3 Dark Mode Implementation
**Dark Mode** là tính năng cho phép người dùng chuyển đổi giữa giao diện sáng và tối để cải thiện trải nghiệm sử dụng.
```typescript
// app/components/ThemeProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage?.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
```

```typescript
// app/components/ThemeToggle.tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { Button } from './ui/Button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

### 2. CSS Modules

**CSS Modules** là cách tiếp cận để tạo ra CSS scoped cho từng component, tránh xung đột tên class giữa các component khác nhau.

#### 2.1 Cơ bản về CSS Modules
```css
/* app/components/Card.module.css */
.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.cardHeader {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.cardTitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.cardContent {
  color: #6b7280;
  line-height: 1.6;
}

.cardActions {
  margin-top: 1.5rem;
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Responsive styles */
@media (max-width: 640px) {
  .card {
    padding: 1rem;
  }
  
  .cardActions {
    flex-direction: column;
  }
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  .card {
    background: #1f2937;
    border-color: #374151;
  }
  
  .cardTitle {
    color: #f9fafb;
  }
  
  .cardContent {
    color: #d1d5db;
  }
  
  .cardHeader {
    border-color: #374151;
  }
}
```

```typescript
// app/components/Card.tsx
import styles from './Card.module.css'
import { ReactNode } from 'react'

interface CardProps {
  title?: string
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export default function Card({ title, children, actions, className }: CardProps) {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      {title && (
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>{title}</h3>
        </div>
      )}
      
      <div className={styles.cardContent}>
        {children}
      </div>
      
      {actions && (
        <div className={styles.cardActions}>
          {actions}
        </div>
      )}
    </div>
  )
}
```

#### 2.2 Advanced CSS Modules với composition
**CSS Composition** là kỹ thuật trong CSS Modules cho phép kế thừa styles từ các class khác bằng từ khóa `composes`.
```css
/* app/components/Button.module.css */
.base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.small {
  composes: base;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.medium {
  composes: base;
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.large {
  composes: base;
  padding: 1rem 1.5rem;
  font-size: 1.125rem;
}

.primary {
  background-color: #3b82f6;
  color: white;
}

.primary:hover {
  background-color: #2563eb;
}

.secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.secondary:hover {
  background-color: #d1d5db;
}

.outline {
  background-color: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;
}

.outline:hover {
  background-color: #3b82f6;
  color: white;
}

.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.disabled:hover {
  background-color: inherit;
}
```

```typescript
// app/components/Button.tsx
import styles from './Button.module.css'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  children: ReactNode
  disabled?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  children,
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles[size],
    styles[variant],
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
```

### 3. CSS-in-JS Solutions

**CSS-in-JS** là cách tiếp cận viết CSS bằng JavaScript, cho phép tạo ra styles động và component-scoped.

#### 3.1 Styled-components
**Styled-components** là thư viện CSS-in-JS phổ biến cho phép tạo ra React components với styles được định nghĩa bằng template literals.
```bash
npm install styled-components
npm install -D @types/styled-components
```

```typescript
// app/lib/styled-components.tsx
'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement()
    styledComponentsStyleSheet.instance.clearTag()
    return <>{styles}</>
  })

  if (typeof window !== 'undefined') return <>{children}</>

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
```

```typescript
// app/layout.tsx
import StyledComponentsRegistry from '@/lib/styled-components'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
```

```typescript
// app/components/styled/Button.tsx
'use client'

import styled, { css } from 'styled-components'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ size }) => {
    switch (size) {
      case 'small':
        return css`
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
        `
      case 'large':
        return css`
          padding: 1rem 1.5rem;
          font-size: 1.125rem;
        `
      default:
        return css`
          padding: 0.75rem 1rem;
          font-size: 1rem;
        `
    }
  }}
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.gray[200]};
          color: ${theme.colors.gray[900]};
          
          &:hover {
            background-color: ${theme.colors.gray[300]};
          }
        `
      case 'outline':
        return css`
          background-color: transparent;
          border: 2px solid ${theme.colors.primary[500]};
          color: ${theme.colors.primary[500]};
          
          &:hover {
            background-color: ${theme.colors.primary[500]};
            color: white;
          }
        `
      default:
        return css`
          background-color: ${theme.colors.primary[500]};
          color: white;
          
          &:hover {
            background-color: ${theme.colors.primary[600]};
          }
        `
    }
  }}
  
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      
      &:hover {
        background-color: inherit;
      }
    `}
`

export default Button
```

#### 3.2 Theme Provider với styled-components
```typescript
// app/lib/theme.ts
export const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      900: '#1e3a8a',
    },
    gray: {
      200: '#e5e7eb',
      300: '#d1d5db',
      900: '#1f2937',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
}

export type Theme = typeof theme
```

```typescript
// app/components/styled/Card.tsx
'use client'

import styled from 'styled-components'

export const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`

export const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`

export const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`

export const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.6;
`
```

### 4. Sass/SCSS Integration

**Sass/SCSS** là CSS preprocessor cho phép sử dụng các tính năng như variables, nesting, mixins, và functions để viết CSS mạnh mẽ hơn.

```bash
npm install -D sass
```

```scss
// app/styles/variables.scss
// Colors
$primary-50: #eff6ff;
$primary-500: #3b82f6;
$primary-600: #2563eb;
$primary-900: #1e3a8a;

$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-600: #4b5563;
$gray-900: #1f2937;

// Spacing
$spacing-xs: 0.25rem;
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;
$spacing-xl: 2rem;

// Breakpoints
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;

// Z-index scale
$z-dropdown: 1000;
$z-modal: 1050;
$z-tooltip: 1100;
```

```scss
// app/styles/mixins.scss
@use 'variables' as *;

// Responsive mixins
@mixin mobile {
  @media (max-width: #{$breakpoint-sm - 1px}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$breakpoint-sm}) and (max-width: #{$breakpoint-lg - 1px}) {
    @content;
  }
}

@mixin desktop {
  @media (min-width: #{$breakpoint-lg}) {
    @content;
  }
}

// Button mixin
@mixin button-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@mixin button-variant($bg-color, $text-color, $hover-bg-color) {
  background-color: $bg-color;
  color: $text-color;
  
  &:hover:not(:disabled) {
    background-color: $hover-bg-color;
  }
}

// Card mixin
@mixin card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid $gray-200;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
}

// Animation mixins
@mixin fade-in($duration: 0.3s) {
  animation: fadeIn $duration ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

```scss
// app/components/Button.module.scss
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.button {
  @include button-base;
  padding: $spacing-sm $spacing-md;
  font-size: 1rem;
}

.primary {
  @include button-variant($primary-500, white, $primary-600);
}

.secondary {
  @include button-variant($gray-200, $gray-900, $gray-300);
}

.outline {
  background-color: transparent;
  border: 2px solid $primary-500;
  color: $primary-500;
  
  &:hover:not(:disabled) {
    background-color: $primary-500;
    color: white;
  }
}

.small {
  padding: $spacing-xs $spacing-sm;
  font-size: 0.875rem;
}

.large {
  padding: $spacing-md $spacing-lg;
  font-size: 1.125rem;
}

// Responsive styles
@include mobile {
  .button {
    width: 100%;
  }
}
```

### 5. Design System Implementation

**Design System** là tập hợp các component, style guide, và quy tắc thiết kế nhất quán để xây dựng giao diện user-friendly và maintainable.

#### 5.1 Design Tokens
**Design Tokens** là các giá trị thiết kế được định nghĩa và đặt tên như colors, spacing, typography để đảm bảo tính nhất quán trong toàn bộ hệ thống.
```typescript
// app/lib/design-tokens.ts
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },
  typography: {
    fontFamilies: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'ui-monospace', 'monospace'],
      serif: ['ui-serif', 'Georgia', 'serif'],
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeights: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
    lineHeights: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    }
  },
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  borderRadius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  }
} as const

export type DesignTokens = typeof designTokens
```

#### 5.2 Component Library Structure
```typescript
// app/components/ui/index.ts
export { Button } from './Button'
export { Card, CardHeader, CardContent, CardFooter } from './Card'
export { Input } from './Input'
export { Badge } from './Badge'
export { Avatar } from './Avatar'
export { Modal } from './Modal'
export { Tooltip } from './Tooltip'
```

```typescript
// app/components/ui/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
        warning: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

### 6. Performance Optimization

#### 6.1 CSS Bundle Optimization
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
```

#### 6.2 Critical CSS Extraction
```typescript
// app/lib/critical-css.ts
export function getCriticalCSS() {
  if (typeof window === 'undefined') {
    return null
  }
  
  // Extract critical CSS for above-the-fold content
  const criticalElements = document.querySelectorAll('[data-critical]')
  const criticalStyles: string[] = []
  
  criticalElements.forEach(element => {
    const computedStyles = window.getComputedStyle(element)
    const criticalProps = [
      'display', 'position', 'width', 'height', 
      'margin', 'padding', 'border', 'background',
      'font-family', 'font-size', 'color'
    ]
    
    let elementStyles = ''
    criticalProps.forEach(prop => {
      const value = computedStyles.getPropertyValue(prop)
      if (value) {
        elementStyles += `${prop}: ${value}; `
      }
    })
    
    if (elementStyles) {
      criticalStyles.push(`.${element.className} { ${elementStyles} }`)
    }
  })
  
  return criticalStyles.join('\n')
}
```

#### 6.3 CSS-in-JS Performance
```typescript
// app/lib/style-cache.ts
import createCache from '@emotion/cache'

const isBrowser = typeof document !== 'undefined'

export default function createEmotionCache() {
  let insertionPoint

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector(
      'meta[name="emotion-insertion-point"]',
    )
    insertionPoint = emotionInsertionPoint ?? undefined
  }

  return createCache({
    key: 'mui-style',
    insertionPoint,
    speedy: process.env.NODE_ENV === 'production',
  })
}
```

## 🏆 Bài tập thực hành

### Bài tập 1: Xây dựng Component Library với Design System

Tạo một component library hoàn chỉnh với design system:

```typescript
// app/lib/design-system.ts
export const designSystem = {
  colors: {
    brand: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#06b6d4',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    semantic: {
      success: { light: '#dcfce7', main: '#22c55e', dark: '#15803d' },
      warning: { light: '#fef3c7', main: '#f59e0b', dark: '#d97706' },
      error: { light: '#fee2e2', main: '#ef4444', dark: '#dc2626' },
      info: { light: '#dbeafe', main: '#3b82f6', dark: '#1d4ed8' },
    }
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
      display: ['Poppins', 'system-ui', 'sans-serif'],
    },
    scale: {
      xs: { size: '12px', lineHeight: '16px' },
      sm: { size: '14px', lineHeight: '20px' },
      base: { size: '16px', lineHeight: '24px' },
      lg: { size: '18px', lineHeight: '28px' },
      xl: { size: '20px', lineHeight: '28px' },
      '2xl': { size: '24px', lineHeight: '32px' },
      '3xl': { size: '30px', lineHeight: '36px' },
      '4xl': { size: '36px', lineHeight: '40px' },
    }
  },
  spacing: {
    scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128],
  },
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }
} as const
```

```typescript
// app/components/design-system/Button.tsx
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center rounded-lg font-medium transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-95'
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand-primary text-white shadow-sm',
          'hover:bg-brand-primary/90',
          'focus-visible:ring-brand-primary',
        ],
        secondary: [
          'bg-neutral-100 text-neutral-900 shadow-sm',
          'hover:bg-neutral-200',
          'focus-visible:ring-neutral-500',
          'dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700',
        ],
        outline: [
          'border border-neutral-300 bg-transparent text-neutral-700',
          'hover:bg-neutral-50',
          'focus-visible:ring-neutral-500',
          'dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
        ],
        ghost: [
          'text-neutral-700 hover:bg-neutral-100',
          'focus-visible:ring-neutral-500',
          'dark:text-neutral-300 dark:hover:bg-neutral-800',
        ],
        destructive: [
          'bg-semantic-error-main text-white shadow-sm',
          'hover:bg-semantic-error-dark',
          'focus-visible:ring-semantic-error-main',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
```

### Bài tập 2: Advanced Styling with Animation System

```typescript
// app/components/animated/AnimatedCard.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface AnimatedCardProps {
  title: string
  children: React.ReactNode
  expandable?: boolean
  dismissible?: boolean
}

export default function AnimatedCard({ 
  title, 
  children, 
  expandable = false, 
  dismissible = false 
}: AnimatedCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  
  if (isDismissed) return null
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        whileHover={{ y: -4, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700"
          whileHover={expandable ? { backgroundColor: 'rgba(0, 0, 0, 0.02)' } : {}}
        >
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            {expandable && (
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>
            )}
          </div>
          
          {dismissible && (
            <motion.button
              onClick={() => setIsDismissed(true)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
        
        {/* Content */}
        <AnimatePresence initial={false}>
          {(!expandable || isExpanded) && (
            <motion.div
              initial={expandable ? { height: 0, opacity: 0 } : { opacity: 1 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
```

## 🔑 Điểm quan trọng cần nhớ

### Styling Approaches
1. **Tailwind CSS**: Utility-first approach, excellent for rapid development
2. **CSS Modules**: Scoped styling, good for component-specific styles
3. **CSS-in-JS**: Dynamic styling, good for theme-driven applications
4. **Sass/SCSS**: Enhanced CSS với variables và mixins

### Performance Considerations
1. **Critical CSS extraction** cho above-the-fold content
2. **CSS bundle optimization** và code splitting
3. **Avoid CSS-in-JS** cho static styles khi có thể
4. **Use CSS custom properties** cho theming

### Design System Best Practices
1. **Consistent design tokens** across all components
2. **Variant-based component APIs** với class-variance-authority
3. **Accessible color schemes** với proper contrast ratios
4. **Responsive design patterns** từ mobile-first

### Theming Strategy
1. **CSS custom properties** cho dynamic theming
2. **Context-based theme providers**
3. **System preference detection**
4. **Persistent theme storage**

## 📝 Bài tập về nhà

1. **Component Library**: Xây dựng complete component library với:
   - Design tokens system
   - Variant-based components
   - Dark mode support
   - Accessibility features

2. **Performance Optimization**: Tối ưu hóa CSS performance:
   - Critical CSS extraction
   - Bundle size analysis
   - Runtime performance monitoring
   - CSS loading strategies

3. **Advanced Animation**: Tạo advanced animation system:
   - Page transitions
   - Micro-interactions
   - Loading states
   - Gesture-based animations

4. **Responsive Design**: Implement comprehensive responsive system:
   - Fluid typography
   - Container queries
   - Adaptive layouts
   - Cross-device testing

---

*Post ID: x6fbc1env3k3r5o*  
*Category: NextJS*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
