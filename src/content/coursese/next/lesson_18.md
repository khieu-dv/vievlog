
# Bài 18: Triển khai và DevOps

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ có khả năng:

* Hiểu rõ các khái niệm cơ bản về **triển khai ứng dụng web** và **DevOps** trong bối cảnh NextJS.
* Biết cách cấu hình **environment variables** an toàn và đúng chuẩn cho NextJS.
* Thực hiện triển khai NextJS App Router lên **Vercel** và các nền tảng khác (như Netlify, AWS Amplify).
* Thiết lập một pipeline **CI/CD (Continuous Integration & Continuous Deployment)** cơ bản bằng GitHub Actions để tự động hóa quá trình build & deploy.
* Hiểu cách thiết lập **môi trường staging và production** cho dự án NextJS.
* Nắm được cơ bản về **monitoring**, **logging** và cách kết nối với công cụ như Google Analytics để theo dõi hiệu suất & người dùng.
* Nhận diện những lưu ý quan trọng khi deploy dự án NextJS trong thực tế.

## 📝 Nội dung chi tiết

### 1. Khái niệm triển khai (Deployment) và DevOps

* **Triển khai ứng dụng web**: Là quá trình chuyển ứng dụng từ môi trường phát triển (local) lên môi trường máy chủ hoặc nền tảng hosting để người dùng có thể truy cập.

  * Triển khai thường bao gồm: build code (biên dịch, đóng gói), cấu hình môi trường, upload mã nguồn, và chạy ứng dụng.
* **DevOps**: Là phương pháp kết hợp giữa phát triển (Dev) và vận hành (Ops), nhằm tự động hóa và tối ưu hóa quá trình phát triển phần mềm và triển khai, giúp ứng dụng chạy ổn định, nhanh chóng cập nhật, dễ bảo trì.

### 2. Các nền tảng phổ biến để triển khai NextJS

* **Vercel** (đơn vị phát triển NextJS) – miễn phí, dễ dàng, tối ưu đặc biệt cho NextJS.
* **Netlify** – cũng phổ biến cho frontend, hỗ trợ nhiều frameworks.
* **AWS Amplify, Firebase Hosting** – cho ứng dụng có backend phức tạp.
* **DigitalOcean, Heroku, Railway** – máy chủ hoặc platform-as-a-service.

### 3. Environment Variables (Biến môi trường)

* Giúp lưu trữ các thông tin nhạy cảm (API keys, secrets) hoặc cấu hình riêng cho từng môi trường (dev, staging, production).
* Trong NextJS với App Router, biến môi trường phải đặt trong file `.env.local` hoặc `.env.production` và bắt đầu bằng `NEXT_PUBLIC_` nếu muốn dùng ở client.

**Ví dụ:**

```env
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_PASSWORD=yourpassword
```

* Cách sử dụng trong code:

```ts
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

* Lưu ý: Tuyệt đối không commit file `.env.local` lên GitHub nếu chứa thông tin nhạy cảm.

### 4. Triển khai NextJS App Router lên Vercel

* Đăng ký tài khoản tại [vercel.com](https://vercel.com).
* Kết nối repository GitHub (hoặc GitLab, Bitbucket) với Vercel.
* Vercel tự động nhận diện dự án NextJS, cấu hình build và deploy.
* Cấu hình biến môi trường trong Dashboard Vercel (Settings > Environment Variables).
* Triển khai staging và production bằng cách tạo các branch tương ứng hoặc tạo preview deployments.
* Vercel hỗ trợ auto scaling, CDN, HTTPS miễn phí.

### 5. CI/CD với GitHub Actions cho NextJS

**CI (Continuous Integration)**: Tự động kiểm tra code, build khi có thay đổi trên repository.

**CD (Continuous Deployment)**: Tự động deploy code đã được kiểm tra lên môi trường hosting.

**Ví dụ Workflow cơ bản:**

```yaml
name: Deploy NextJS to Vercel

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build NextJS app
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: .
          prod: true
```

* Cách lấy các secret (token, org-id, project-id) trên Vercel Dashboard.
* Workflow sẽ tự động chạy khi có push lên `main`, build app và deploy lên Vercel.

### 6. Thiết lập môi trường Staging và Production

* Tạo các nhánh riêng biệt trên GitHub: `main` (production), `staging`.
* Cấu hình biến môi trường riêng trên Vercel cho từng nhánh.
* Sử dụng preview deployment trên Vercel để test trước khi merge code lên `main`.
* Giúp giảm thiểu lỗi khi deploy, kiểm thử kỹ trước khi ứng dụng chính thức ra mắt.

### 7. Monitoring và Logging cơ bản

* **Monitoring**: Theo dõi hiệu suất, uptime, lỗi xảy ra trên ứng dụng.
* **Logging**: Ghi lại các sự kiện, lỗi hoặc hoạt động để debug hoặc phân tích.
* Vercel cung cấp dashboard logs, bạn có thể xem log build và runtime.
* Kết nối với các dịch vụ bên ngoài như Sentry để tracking lỗi, hoặc Datadog cho monitoring nâng cao.

### 8. Triển khai Google Analytics và SEO Optimization

* Cài đặt Google Analytics để theo dõi lượng truy cập, hành vi người dùng.
* Trong NextJS, có thể thêm GA script trong `app/layout.tsx` hoặc dùng package như `nextjs-google-analytics`.
* SEO: Thiết lập metadata, sitemap, robots.txt cho website.
* Sử dụng `next/head` hoặc metadata API trong App Router để tối ưu SEO.

## 🏆 Bài tập thực hành có lời giải chi tiết

**Đề bài:**

Triển khai dự án NextJS App Router của bạn lên Vercel với hai môi trường: `staging` và `production`. Tạo pipeline CI/CD sử dụng GitHub Actions để tự động build và deploy ứng dụng khi có thay đổi trên các nhánh tương ứng (`staging` và `main`). Cấu hình biến môi trường cho từng môi trường và tích hợp Google Analytics để theo dõi lượt truy cập.

**Lời giải và phân tích:**

1. **Chuẩn bị dự án:**

   * Đảm bảo dự án NextJS hoàn chỉnh, có file `.env.local` chứa biến môi trường cho local (không commit file này).
   * Tạo biến môi trường cho Vercel:

     * Trên Dashboard Vercel, tạo biến môi trường cho Production (ứng với nhánh `main`).
     * Tạo biến môi trường cho Staging (ứng với nhánh `staging`).

2. **Kết nối GitHub với Vercel:**

   * Truy cập Vercel, liên kết repository.
   * Cấu hình Branches để preview và production deployment tương ứng.

3. **Tạo workflow GitHub Actions:**

   * Tạo file `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy NextJS

   on:
     push:
       branches:
         - main
         - staging

   jobs:
     build_and_deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Install dependencies
           run: npm install

         - name: Build NextJS app
           run: npm run build

         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v20
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
             working-directory: .
             prod: ${{ github.ref == 'refs/heads/main' }}
   ```

   * Giải thích: Khi push lên `main`, deploy production; push lên `staging`, deploy staging (preview).

4. **Cấu hình Google Analytics:**

   * Tạo tài khoản GA và lấy Tracking ID.
   * Thêm đoạn code GA vào file `app/layout.tsx`:

   ```tsx
   import Script from 'next/script';

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en">
         <head>
           <Script
             src={`https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID`}
             strategy="afterInteractive"
           />
           <Script id="google-analytics" strategy="afterInteractive">
             {`
               window.dataLayer = window.dataLayer || [];
               function gtag(){dataLayer.push(arguments);}
               gtag('js', new Date());
               gtag('config', 'GA_TRACKING_ID');
             `}
           </Script>
         </head>
         <body>{children}</body>
       </html>
     );
   }
   ```

   * Thay `GA_TRACKING_ID` bằng mã thực tế.

5. **Kiểm thử:**

   * Push code lên nhánh `staging` và `main`.
   * Kiểm tra tự động build và deploy trên Vercel.
   * Kiểm tra biến môi trường đã được áp dụng đúng.
   * Quan sát lượt truy cập trên Google Analytics.

## 🔑 Những điểm quan trọng cần lưu ý

* **Biến môi trường:** Luôn phân biệt rõ giữa biến dùng cho client (`NEXT_PUBLIC_`) và server, tránh lộ thông tin nhạy cảm.
* **Vercel** là nền tảng lý tưởng cho NextJS, tận dụng tính năng Preview Deployments giúp kiểm thử trước khi lên production.
* **GitHub Actions** cho phép tự động hóa deploy, tránh deploy thủ công lỗi thời gian.
* Khi triển khai, **đừng commit file `.env.local`** có chứa secret.
* Luôn kiểm tra kỹ trên môi trường staging trước khi đẩy lên production để tránh lỗi nghiêm trọng.
* Google Analytics phải được cấu hình đúng vị trí để thu thập dữ liệu chính xác, tránh ảnh hưởng performance.
* CI/CD pipeline nên tách biệt rõ build và deploy để dễ bảo trì và mở rộng.

## 📝 Bài tập về nhà

**Đề bài:**

1. Thiết lập một pipeline CI/CD trên GitHub Actions để tự động deploy dự án NextJS lên nền tảng Netlify hoặc AWS Amplify thay vì Vercel.

2. Cấu hình biến môi trường cho cả `development` và `production` trong dự án của bạn, đảm bảo không lộ thông tin nhạy cảm.

3. Tích hợp thêm một công cụ monitoring lỗi (như Sentry) vào ứng dụng NextJS và thử nghiệm việc gửi log khi có lỗi xảy ra.

4. Viết bài blog ngắn (khoảng 200-300 từ) tóm tắt những bước và kinh nghiệm của bạn khi triển khai ứng dụng NextJS, chia sẻ các lưu ý quan trọng với người mới.

