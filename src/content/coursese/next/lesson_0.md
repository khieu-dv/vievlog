# Khoa hoc NextJS



## Bài 1: Giới thiệu và Thiết lập Môi trường

### Nội dung cơ bản:
- Tổng quan về khóa học và những gì học viên sẽ học được
- Giới thiệu về ReactJS, NextJS, TypeScript, TailwindCSS và ShadcnUI
- So sánh giữa Pages Router và App Router trong NextJS
- Ưu điểm của TypeScript trong phát triển ReactJS
- Các yêu cầu tiên quyết và cài đặt môi trường làm việc

### Hoạt động:
- Cài đặt Node.js, npm/yarn, và VSCode
- Cài đặt các extension VSCode hữu ích cho phát triển NextJS
- Tạo dự án NextJS đầu tiên với App Router
- Tìm hiểu cấu trúc thư mục cơ bản của dự án NextJS với App Router
- Thiết lập linting và formatting với ESLint và Prettier

## Bài 2: Cấu trúc Dự án và Routing cơ bản trong App Router

### Nội dung cơ bản:
- Cấu trúc thư mục phân cấp trong App Router
- Hệ thống tệp và quy ước định tuyến
- Các tệp đặc biệt: page.tsx, layout.tsx, loading.tsx, error.tsx
- Routing động với các thông số và phân đoạn
- Server Components vs Client Components

### Hoạt động:
- Thiết lập cấu trúc dự án Vievlog theo sơ đồ
- Tạo các route cơ bản: trang chủ, trang đăng nhập, trang đăng ký
- Triển khai layout chung và layout con
- Thực hành với route động và tham số
- Tạo trang lỗi 404 và trang loading

## Bài 3: TypeScript cơ bản cho React và NextJS

### Nội dung cơ bản:
- Tổng quan về TypeScript và lợi ích khi sử dụng với React
- Các loại cơ bản trong TypeScript
- Interface và Type trong React
- Generic Types và khi nào sử dụng chúng
- Typing Props, State và Event Handlers

### Hoạt động:
- Thiết lập tsconfig.json cho dự án
- Tạo các interface/types cho mô hình dữ liệu
- Thực hành với Props và State typing
- Xử lý lỗi TypeScript phổ biến
- Refactor code JavaScript thành TypeScript

## Bài 4: TailwindCSS và Styling trong NextJS App Router

### Nội dung cơ bản:
- Cài đặt và cấu hình TailwindCSS trong NextJS
- Utility-first CSS và lợi ích của nó
- Responsive design với TailwindCSS
- Dark mode và theme switching
- CSS modules vs Tailwind trong NextJS

### Hoạt động:
- Cấu hình tailwind.config.js
- Tạo global.css với cài đặt Tailwind
- Xây dựng layout responsive
- Triển khai dark/light mode với Tailwind
- Tùy chỉnh theme và mở rộng cấu hình TailwindCSS

## Bài 5: ShadcnUI - Thư viện Component UI

### Nội dung cơ bản:
- Giới thiệu về ShadcnUI và lợi ích so với các thư viện UI khác
- Cài đặt và cấu hình ShadcnUI
- Các component phổ biến và cách sử dụng
- Tùy chỉnh theme và styling ShadcnUI components
- Kết hợp ShadcnUI với TailwindCSS

### Hoạt động:
- Cài đặt CLI ShadcnUI và thêm các component cơ bản
- Thiết lập theme provider
- Xây dựng một form đăng nhập với ShadcnUI
- Tùy chỉnh component ShadcnUI
- Tạo animation cho các component

## Bài 6: Xây dựng Layout và Navigation

### Nội dung cơ bản:
- Layout nesting trong App Router
- Template và Group Layouts
- Navigation giữa các trang với next/link
- Sử dụng useRouter và usePathname
- Metadata và SEO trong App Router

### Hoạt động:
- Xây dựng layout chung cho toàn bộ ứng dụng
- Tạo layout đặc biệt cho trang xác thực
- Thiết kế menu navigation đáp ứng
- Cài đặt metadata động cho các trang
- Triển khai breadcrumbs và navigation indicators

## Bài 7: Server Components vs Client Components

### Nội dung cơ bản:
- Sự khác biệt giữa Server Components và Client Components
- "use client" directive và khi nào cần sử dụng
- Data fetching trong Server Components
- Hydration và Streaming
- Interactivity và event handling trong Client Components

### Hoạt động:
- Phân biệt và tổ chức Server và Client Components
- Fetch data trong Server Components
- Xử lý sự kiện trong Client Components
- Streaming Server Components với Suspense
- Tối ưu hóa code splitting với dynamic imports

## Bài 8: State Management trong NextJS App Router

### Nội dung cơ bản:
- Local state với useState và useReducer
- Context API trong NextJS
- Server state và caching
- Global state management với Zustand hoặc Redux
- State persistence và hydration

### Hoạt động:
- Xây dựng theme context cho dark/light mode
- Tạo authentication context
- Quản lý form state với React Hook Form
- Triển khai store dữ liệu toàn cầu
- Xử lý cache và prefetching data

## Bài 9: Data Fetching và API Integration

### Nội dung cơ bản:
- Data fetching patterns trong App Router
- Sử dụng fetch trong Server Components
- Route Handlers (API Routes) trong App Router
- SWR và React Query cho client-side data fetching
- Error handling và loading states

### Hoạt động:
- Kết nối với Gin Golang API đã có sẵn
- Xây dựng API route handler
- Triển khai cache và revalidation
- Sử dụng SWR cho real-time data
- Xử lý loading và error states

## Bài 10: Xác thực và Ủy quyền (Auth)

### Nội dung cơ bản:
- Xác thực trong NextJS App Router
- Middleware trong NextJS
- JWT, Session và Cookie-based authentication
- OAuth và Social login
- Role-based access control

### Hoạt động:
- Thiết lập hệ thống auth kết nối với Golang API
- Xây dựng trang đăng nhập và đăng ký
- Triển khai middleware bảo vệ routes
- Tạo context và hooks cho authentication
- Kiểm soát truy cập dựa trên vai trò

## Bài 11: Xây dựng trang Profile

### Nội dung cơ bản:
- Trang profile và quản lý thông tin người dùng
- Form handling với React Hook Form
- File uploads và quản lý ảnh
- Validation dữ liệu client-side và server-side
- Optimistic updates

### Hoạt động:
- Thiết kế UI trang profile với ShadcnUI
- Xây dựng form chỉnh sửa profile với validation
- Triển khai upload avatar
- Xử lý cập nhật thông tin cá nhân
- Tích hợp với API Golang

## Bài 12: Chat Feature (Realtime)

### Nội dung cơ bản:
- Realtime communications trong NextJS
- WebSockets và Server-Sent Events
- Tích hợp với Pusher hoặc Socket.io
- Optimistic UI với Chat
- Message read receipts và typing indicators

### Hoạt động:
- Thiết kế UI chat với ShadcnUI
- Kết nối WebSocket với Golang backend
- Xây dựng chat interface
- Triển khai typing indicators và read receipts
- Xử lý thông báo tin nhắn mới

## Bài 13: Quản lý Bài Viết và Media

### Nội dung cơ bản:
- CRUD operations với Server Actions
- Media handling và optimization
- Dynamic routes cho bài viết
- Rich text editor integration
- Hệ thống comments và reactions

### Hoạt động:
- Xây dựng trang danh sách bài viết
- Thiết kế trang chi tiết bài viết
- Triển khai form tạo/chỉnh sửa bài viết
- Tích hợp rich text editor
- Xây dựng hệ thống comments

## Bài 14: Quản lý Video và Player

### Nội dung cơ bản:
- Video players trong NextJS
- Video streaming và optimization
- Video thumbnails và previews
- Video analytics
- Video categories và search

### Hoạt động:
- Tích hợp video player
- Xây dựng trang danh sách video
- Thiết kế trang chi tiết video
- Triển khai video upload và processing
- Xây dựng tính năng tìm kiếm video

## Bài 15: Internationalization (i18n)

### Nội dung cơ bản:
- Internationalization trong NextJS App Router
- Các chiến lược cho i18n: Translations và Localization
- Định dạng số, ngày và tiền tệ
- RTL language support
- Language detection và switching

### Hoạt động:
- Cấu hình i18n với next-intl hoặc react-i18next
- Thiết lập language routing
- Tạo language switcher
- Triển khai translations cho UI
- Xử lý nội dung động có i18n

## Bài 16: Performance Optimization

### Nội dung cơ bản:
- Core Web Vitals và metrics
- Code splitting và lazy loading
- Image optimization với next/image
- Caching strategies
- Bundle analysis và optimization

### Hoạt động:
- Kiểm tra và cải thiện Core Web Vitals
- Cấu hình caching và revalidation
- Tối ưu hóa hình ảnh và media
- Lazy loading components
- Bundle analysis và code splitting

## Bài 17: Testing trong NextJS

### Nội dung cơ bản:
- Unit testing với Jest và React Testing Library
- Integration testing trong NextJS App Router
- End-to-end testing với Cypress hoặc Playwright
- Testing Server Components và Client Components
- Test coverage và CI/CD integration

### Hoạt động:
- Thiết lập Jest và React Testing Library
- Viết unit tests cho utility functions
- Viết component tests
- Thiết lập e2e tests với Cypress
- Tích hợp tests vào CI/CD pipeline

## Bài 18: Triển khai và DevOps

### Nội dung cơ bản:
- Triển khai NextJS app lên Vercel và các nền tảng khác
- Environment variables và cấu hình
- CI/CD pipelines
- Monitoring và logging
- SEO và analytics

### Hoạt động:
- Cấu hình environment variables
- Thiết lập GitHub Actions CI/CD
- Triển khai staging và production environments
- Cấu hình monitoring và logging
- Triển khai Google Analytics và SEO optimization