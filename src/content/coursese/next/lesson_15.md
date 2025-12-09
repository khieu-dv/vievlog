

# Bài 15: Internationalization (i18n) trong NextJS App Router

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ khái niệm **Internationalization (i18n)** và **Localization (l10n)** trong phát triển web.
* Biết cách cấu hình i18n trong NextJS App Router, hiểu về routing đa ngôn ngữ.
* Biết cách tạo và quản lý file **translation** (dịch thuật) cho nhiều ngôn ngữ.
* Hiểu cách **định dạng số, ngày tháng, tiền tệ** theo ngôn ngữ/địa phương.
* Thực hiện **language detection** và tạo **language switcher** cho người dùng dễ dàng chuyển đổi ngôn ngữ.
* Triển khai hỗ trợ ngôn ngữ RTL (Right-To-Left) cơ bản.
* Biết sử dụng thư viện phổ biến như **next-intl** hoặc **react-i18next** để xử lý i18n trong NextJS App Router.

## 📝 Nội dung chi tiết

### 1. Khái niệm cơ bản: Internationalization (i18n) & Localization (l10n)

* **Internationalization (i18n)**: Là quá trình chuẩn bị một ứng dụng để hỗ trợ nhiều ngôn ngữ và định dạng vùng miền khác nhau mà không cần phải viết lại mã nguồn. i18n là bước chuẩn bị nền tảng cho việc đa ngôn ngữ.

* **Localization (l10n)**: Là quá trình thực hiện dịch nội dung, định dạng ngày tháng, số, tiền tệ, và các yếu tố văn hóa phù hợp với từng vùng, dựa trên nền tảng đã i18n.

> Ví dụ: Bạn làm một trang web bằng tiếng Việt, muốn mở rộng sang tiếng Anh, tiếng Hàn thì phải i18n để cấu trúc dữ liệu, giao diện, routing cho nhiều ngôn ngữ, sau đó l10n chính là dịch các câu chữ, đổi định dạng ngày tháng...

### 2. i18n trong NextJS App Router: Tại sao và như thế nào?

* NextJS hỗ trợ i18n routing, nghĩa là URL có thể chứa ngôn ngữ như `/en`, `/vi`, `/ko`...
* Việc cấu hình i18n giúp tự động xử lý routing đa ngôn ngữ, SEO tốt hơn, và tối ưu UX.
* Có nhiều chiến lược i18n:

  * **Translation-based**: Tất cả text được dịch, UI chuyển đổi ngôn ngữ.
  * **Localization-based**: Cả định dạng số, ngày, tiền tệ cũng thay đổi theo ngôn ngữ.

### 3. Các bước cấu hình i18n trong NextJS App Router

#### a) Cấu hình `next.config.js`

```ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'vi', 'ko'], // danh sách ngôn ngữ hỗ trợ
    defaultLocale: 'en',         // ngôn ngữ mặc định
    localeDetection: true,       // bật tắt tự động phát hiện ngôn ngữ trình duyệt
  }
}

module.exports = nextConfig;
```

* `locales`: Mỗi ngôn ngữ tương ứng một mã (ISO như 'en', 'vi', 'ko')
* `defaultLocale`: Ngôn ngữ mặc định nếu không xác định được
* `localeDetection`: Nếu bật, NextJS tự phát hiện ngôn ngữ trình duyệt để chuyển trang

### 4. Quản lý file dịch thuật (Translation files)

* Thông thường sẽ có folder như `locales/` chứa các file JSON:

```
/locales
  /en
    common.json
  /vi
    common.json
  /ko
    common.json
```

* Ví dụ `locales/en/common.json`:

```json
{
  "welcome": "Welcome to our website!",
  "login": "Login",
  "logout": "Logout"
}
```

* Ví dụ `locales/vi/common.json`:

```json
{
  "welcome": "Chào mừng đến với trang web của chúng tôi!",
  "login": "Đăng nhập",
  "logout": "Đăng xuất"
}
```

> **Giải thích**: Mỗi file JSON tương ứng một ngôn ngữ, chứa cặp khóa-giá trị dùng để dịch UI. Khi app load trang, tuỳ vào ngôn ngữ, app sẽ lấy text tương ứng.

### 5. Sử dụng thư viện hỗ trợ i18n: `next-intl` hoặc `react-i18next`

* **next-intl**: Thư viện được tối ưu cho NextJS App Router, hỗ trợ server và client components.
* **react-i18next**: Thư viện i18n phổ biến, dễ dùng, phù hợp cả React nói chung.

> Ở bài này mình dùng `next-intl` làm ví dụ:

#### Cài đặt:

```bash
npm install next-intl
```

#### Tạo file `i18n.ts` để tải file dịch:

```ts
import { NextIntlClientProvider } from 'next-intl'

export async function loadLocale(locale: string) {
  try {
    return (await import(`../locales/${locale}/common.json`)).default;
  } catch {
    return (await import(`../locales/en/common.json`)).default; // fallback
  }
}
```

#### Sử dụng trong layout:

```tsx
// app/[locale]/layout.tsx

import { NextIntlClientProvider } from 'next-intl'
import { loadLocale } from '@/lib/i18n'

export default async function LocaleLayout({ children, params }: { children: React.ReactNode, params: { locale: string } }) {
  const messages = await loadLocale(params.locale);

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### 6. Language routing với App Router

* NextJS App Router hỗ trợ dynamic segment routing nên ta có thể tạo cấu trúc:

```
app/
  [locale]/
    page.tsx  // trang chính theo ngôn ngữ
    layout.tsx
```

* Như vậy URL sẽ có dạng:
  `/en`, `/vi`, `/ko`...

* `params.locale` lấy được từ URL.

### 7. Tạo component **LanguageSwitcher**

* Cho phép người dùng chọn và chuyển đổi ngôn ngữ thủ công.

* Ví dụ:

```tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';

const locales = ['en', 'vi', 'ko'];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const locale = e.target.value;
    // Chuyển trang sang ngôn ngữ mới, giữ nguyên pathname
    router.push(`/${locale}${pathname.replace(/^\/(en|vi|ko)/, '')}`);
  }

  return (
    <select onChange={onChange} defaultValue={pathname.split('/')[1]}>
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
```

### 8. Định dạng số, ngày tháng, tiền tệ theo ngôn ngữ

* JavaScript có API chuẩn: `Intl` (Internationalization API)

* Ví dụ:

```ts
const date = new Date();

const formattedDate = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full' }).format(date);
console.log(formattedDate); // ví dụ: "thứ hai, ngày 4 tháng 8 năm 2025"

const formattedNumber = new Intl.NumberFormat('en-US').format(1234567.89);
console.log(formattedNumber); // "1,234,567.89"

const formattedCurrency = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(1000000);
console.log(formattedCurrency); // "₩1,000,000"
```

* Ta có thể sử dụng trong component React:

```tsx
import { useLocale } from 'next-intl';

export function DateComponent() {
  const locale = useLocale();
  const now = new Date();

  return <div>{new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(now)}</div>;
}
```

### 9. Hỗ trợ ngôn ngữ RTL (Right-to-Left)

* Các ngôn ngữ như tiếng Ả Rập, tiếng Hebrew cần bố cục từ phải sang trái.

* Trong NextJS, ta có thể thay đổi `dir` attribute trên thẻ `<html>` hoặc `<body>`:

```tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
  ...
</html>
```

* CSS Tailwind có hỗ trợ `dir="rtl"` để áp dụng style thích hợp.

### 10. Tóm tắt quy trình i18n trong NextJS App Router

* Cấu hình i18n trong `next.config.js`
* Tạo folder và file translation (`locales/[locale]/common.json`)
* Tạo route đa ngôn ngữ với folder dynamic `[locale]`
* Tải và cung cấp translation trong layout (server component)
* Tạo component client `LanguageSwitcher`
* Sử dụng `next-intl` hoặc `react-i18next` để tra cứu và hiển thị text dịch
* Định dạng ngày tháng, số, tiền tệ với Intl API
* Xử lý RTL nếu cần

## 🏆 Bài tập thực hành

### Đề bài

Xây dựng một trang chủ đa ngôn ngữ (ít nhất 2 ngôn ngữ: tiếng Anh và tiếng Việt) có các yêu cầu:

1. Cấu hình NextJS App Router hỗ trợ i18n với hai ngôn ngữ `en` và `vi`.
2. Tạo file dịch `common.json` cho mỗi ngôn ngữ với ít nhất 3 câu text:

   * "welcome"
   * "login"
   * "logout"
3. Tạo trang chủ (`app/[locale]/page.tsx`) sử dụng `next-intl` để hiển thị các câu dịch trên.
4. Tạo component **LanguageSwitcher** để người dùng có thể chọn và chuyển đổi giữa hai ngôn ngữ.
5. Hiển thị ngày hiện tại theo định dạng ngôn ngữ tương ứng (dùng `Intl.DateTimeFormat`).
6. Đảm bảo khi đổi ngôn ngữ, URL cũng thay đổi tương ứng (`/en` hoặc `/vi`).

### Lời giải chi tiết

#### 1. Cấu hình `next.config.js`:

```ts
module.exports = {
  i18n: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    localeDetection: true,
  },
};
```

#### 2. Tạo folder `locales`:

```
/locales/en/common.json
{
  "welcome": "Welcome to our website!",
  "login": "Login",
  "logout": "Logout"
}

/locales/vi/common.json
{
  "welcome": "Chào mừng đến với trang web của chúng tôi!",
  "login": "Đăng nhập",
  "logout": "Đăng xuất"
}
```

#### 3. Tạo file `lib/i18n.ts`:

```ts
export async function loadLocale(locale: string) {
  try {
    return (await import(`../locales/${locale}/common.json`)).default;
  } catch {
    return (await import(`../locales/en/common.json`)).default;
  }
}
```

#### 4. Tạo folder route `app/[locale]/page.tsx`:

```tsx
import { useLocale, useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('common');
  const locale = useLocale();
  const now = new Date();

  const formattedDate = new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(now);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{t('welcome')}</h1>
      <p>{formattedDate}</p>
      <nav className="mt-4 space-x-4">
        <button>{t('login')}</button>
        <button>{t('logout')}</button>
      </nav>
    </main>
  );
}
```

#### 5. Tạo file `app/[locale]/layout.tsx` để load message:

```tsx
import { NextIntlClientProvider } from 'next-intl';
import { loadLocale } from '@/lib/i18n';

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const messages = await loadLocale(params.locale);

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

#### 6. Tạo component client **LanguageSwitcher.tsx**:

```tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';

const locales = ['en', 'vi'];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const locale = e.target.value;
    router.push(`/${locale}${pathname.replace(/^\/(en|vi)/, '')}`);
  }

  return (
    <select onChange={onChange} defaultValue={pathname.split('/')[1]} className="border p-1 rounded">
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
```

#### 7. Sử dụng `LanguageSwitcher` trong layout hoặc trang:

```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function LocaleLayout({ children, params }) {
  // ... load messages

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <header className="p-4 border-b flex justify-end">
            <LanguageSwitcher />
          </header>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Phân tích bài tập

* Học viên thực hành từng bước từ cấu hình NextJS, tạo file dịch, dynamic routing đa ngôn ngữ, tới triển khai UI đa ngôn ngữ và định dạng ngày tháng.
* Qua bài tập, học viên hiểu rõ cách làm việc với i18n trong môi trường server và client components.
* Tạo LanguageSwitcher giúp học viên thực hành xử lý client-side navigation và URL management trong App Router.

## 🔑 Những điểm quan trọng cần lưu ý

* **Khái niệm rõ ràng**: i18n là bước chuẩn bị, l10n là bước dịch và cá nhân hóa theo vùng miền.
* **Cấu trúc URL đa ngôn ngữ**: Sử dụng dynamic route `[locale]` trong App Router để quản lý.
* **File dịch thuật JSON**: Cần tổ chức rõ ràng, dễ quản lý và phải đồng bộ khóa.
* **Sử dụng thư viện hỗ trợ**: `next-intl` phù hợp với NextJS App Router, giúp load message và cung cấp context translation.
* **Phân biệt Server và Client Component trong i18n**: Load message trên server, dùng hook translation trong client.
* **Định dạng theo locale**: Luôn dùng `Intl` API để đảm bảo chuẩn xác.
* **Xử lý fallback**: Nếu ngôn ngữ không tồn tại file dịch thì phải fallback về default.
* **Language detection**: Có thể bật tự động phát hiện ngôn ngữ trình duyệt trong NextJS config.
* **RTL support**: Phải set attribute `dir` trên thẻ HTML để hỗ trợ giao diện cho ngôn ngữ viết từ phải sang trái.
* **LanguageSwitcher** phải đổi URL chuẩn, không làm mất trạng thái trang.

## 📝 Bài tập về nhà

### Đề bài

* Mở rộng bài tập thực hành:

  1. Thêm ngôn ngữ Hàn Quốc (`ko`) vào hệ thống, tạo file dịch riêng.
  2. Triển khai định dạng tiền tệ theo ngôn ngữ (ví dụ: USD cho `en`, VND cho `vi`, KRW cho `ko`). Hiển thị số tiền mẫu 1000000 với định dạng phù hợp.
  3. Thêm hỗ trợ ngôn ngữ RTL giả định (`ar`), và thử set `dir="rtl"` cho trang `app/ar/page.tsx`.
  4. Tạo menu dropdown chuyển ngôn ngữ có cờ biểu tượng (bạn có thể dùng icon đơn giản hoặc emoji quốc kỳ).
  5. Tìm hiểu và ghi chép thêm về cách thư viện `react-i18next` có thể làm i18n trong NextJS App Router, so sánh điểm mạnh/yếu với `next-intl`.

> Bài tập này nhằm giúp học viên làm quen với mở rộng i18n, xử lý nhiều loại dữ liệu đa ngôn ngữ và bố cục đặc thù.

