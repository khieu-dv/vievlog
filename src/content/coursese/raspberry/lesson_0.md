# Khóa Học Lập Trình Raspberry Pi với FastAPI, Next.js và Flutter


## Phần 1: Nền Tảng Raspberry Pi

### Bài 1: Giới thiệu về Raspberry Pi
**Lý thuyết:**
- Lịch sử và triết lý phát triển của Raspberry Pi
- Các mẫu Raspberry Pi hiện có và so sánh đặc điểm kỹ thuật
- Tổng quan về hệ sinh thái phần cứng và phần mềm Raspberry Pi
- Các ứng dụng phổ biến của Raspberry Pi trong thực tế

**Thực hành:**
- Mở hộp và làm quen với các thành phần của Raspberry Pi
- Chuẩn bị thẻ microSD với Raspberry Pi OS
- Kết nối và khởi động Raspberry Pi lần đầu tiên
- Khám phá giao diện Raspberry Pi OS

### Bài 2: Thiết lập Môi trường Phát triển
**Lý thuyết:**
- Giới thiệu về hệ điều hành Raspberry Pi OS
- Các tùy chọn kết nối và điều khiển Raspberry Pi (SSH, VNC, trực tiếp)
- Tổng quan về các công cụ phát triển cần thiết

**Thực hành:**
- Cấu hình mạng và bảo mật cơ bản
- Cài đặt các phần mềm và thư viện phát triển thiết yếu
- Thiết lập môi trường Python và pip
- Thiết lập kết nối SSH và VNC cho phát triển từ xa

### Bài 3: Lập trình Python cơ bản trên Raspberry Pi
**Lý thuyết:**
- Ôn tập nhanh về cú pháp Python và các tính năng chính
- Điểm khác biệt khi lập trình Python trên Raspberry Pi
- Giới thiệu thư viện GPIO và giao diện phần cứng

**Thực hành:**
- Viết chương trình Python đầu tiên trên Raspberry Pi
- Sử dụng IDLE và VS Code để phát triển
- Thực hiện các thao tác file I/O trên Raspberry Pi
- Tạo và chạy script Python tự động khi khởi động

## Phần 2: Phát triển Backend với FastAPI

### Bài 4: Giới thiệu về FastAPI cho Raspberry Pi
**Lý thuyết:**
- Tổng quan về FastAPI và ưu điểm khi sử dụng trên Raspberry Pi
- Kiến trúc REST API và nguyên tắc cơ bản
- So sánh FastAPI với các framework Python khác
- Hiểu về bất đồng bộ trong FastAPI

**Thực hành:**
- Cài đặt FastAPI và Uvicorn trên Raspberry Pi
- Tạo API "Hello World" đầu tiên
- Chạy và kiểm tra API thông qua trình duyệt web
- Sử dụng công cụ tài liệu tự động của FastAPI

### Bài 5: Xây dựng API CRUD cơ bản
**Lý thuyết:**
- Thiết kế các endpoint API theo nguyên tắc REST
- Cách xử lý các yêu cầu HTTP khác nhau (GET, POST, PUT, DELETE)
- Validate dữ liệu đầu vào với Pydantic

**Thực hành:**
- Xây dựng API quản lý danh sách công việc đơn giản
- Triển khai các endpoint CRUD hoàn chỉnh
- Thử nghiệm API bằng Swagger UI
- Xử lý lỗi và trả về phản hồi phù hợp

### Bài 6: Tích hợp Cơ sở dữ liệu
**Lý thuyết:**
- Các lựa chọn cơ sở dữ liệu cho Raspberry Pi (SQLite, PostgreSQL)
- Giới thiệu về ORM (SQLAlchemy) và cách sử dụng với FastAPI
- Thiết kế schema cơ sở dữ liệu hiệu quả cho thiết bị nhúng

**Thực hành:**
- Cài đặt và cấu hình SQLite trên Raspberry Pi
- Tạo models và thiết lập kết nối cơ sở dữ liệu
- Mở rộng API để làm việc với dữ liệu từ cơ sở dữ liệu
- Thực hiện các truy vấn cơ bản và nâng cao

### Bài 7: Xác thực và Phân quyền
**Lý thuyết:**
- Các phương pháp xác thực cho API (JWT, OAuth)
- Bảo mật API trên thiết bị IoT
- Quản lý phiên và tokens

**Thực hành:**
- Triển khai xác thực JWT trong FastAPI
- Tạo các endpoint đăng ký và đăng nhập
- Bảo vệ các endpoint API với middleware xác thực
- Triển khai hệ thống phân quyền đơn giản

### Bài 8: Tương tác với GPIO qua API
**Lý thuyết:**
- Cơ chế điều khiển GPIO từ Python
- Thiết kế API cho phép điều khiển phần cứng từ xa
- Xử lý đồng thời và bất đồng bộ trong FastAPI với GPIO

**Thực hành:**
- Kết nối LED và nút bấm với Raspberry Pi
- Xây dựng API để điều khiển LED và đọc trạng thái nút bấm
- Triển khai các endpoint để điều khiển thiết bị ngoại vi
- Xử lý sự kiện GPIO trong thời gian thực

## Phần 3: Frontend với Next.js

### Bài 9: Thiết lập Môi trường Next.js
**Lý thuyết:**
- Giới thiệu về Next.js và React
- Ưu điểm của framework Next.js cho ứng dụng web IoT
- Kiến trúc ứng dụng Next.js và cách hoạt động

**Thực hành:**
- Cài đặt Node.js trên máy phát triển
- Khởi tạo dự án Next.js mới
- Cấu hình dự án để làm việc với API từ Raspberry Pi
- Chạy và kiểm tra ứng dụng Next.js cơ bản

### Bài 10: Thiết kế Giao diện Người dùng
**Lý thuyết:**
- Các nguyên tắc thiết kế UI/UX cho ứng dụng IoT
- Sử dụng các thư viện UI như Tailwind CSS hoặc Material-UI
- Thiết kế responsive cho nhiều thiết bị

**Thực hành:**
- Thiết kế layout cơ bản cho ứng dụng
- Tạo các component chính (header, sidebar, content)
- Triển khai giao diện người dùng responsive
- Thêm các hiệu ứng và animations cơ bản

### Bài 11: Kết nối Frontend với API FastAPI
**Lý thuyết:**
- Giao tiếp client-server trong ứng dụng web
- Xử lý yêu cầu HTTP trong Next.js
- Quản lý state trong ứng dụng React

**Thực hành:**
- Sử dụng fetch API hoặc Axios để gọi API
- Triển khai các hook tùy chỉnh để tương tác với API
- Xử lý phản hồi và hiển thị dữ liệu trên giao diện
- Xử lý trạng thái loading và lỗi

### Bài 12: Real-time Dashboard với WebSockets
**Lý thuyết:**
- Giao tiếp real-time với WebSockets
- So sánh HTTP vs WebSockets cho ứng dụng IoT
- Thiết kế giao diện cập nhật theo thời gian thực

**Thực hành:**
- Triển khai WebSockets trong FastAPI trên Raspberry Pi
- Kết nối WebSocket từ ứng dụng Next.js
- Tạo dashboard hiển thị dữ liệu GPIO theo thời gian thực
- Xây dựng biểu đồ trực quan để theo dõi dữ liệu cảm biến

### Bài 13: Xác thực và Quản lý Phiên Người dùng
**Lý thuyết:**
- Quản lý xác thực người dùng trong Next.js
- Bảo vệ routes và components
- Lưu trữ và quản lý tokens

**Thực hành:**
- Tạo trang đăng nhập và đăng ký
- Triển khai context API để quản lý trạng thái xác thực
- Bảo vệ các trang yêu cầu đăng nhập
- Xử lý hết hạn token và làm mới token

## Phần 4: Phát triển Ứng dụng Di động với Flutter

### Bài 14: Giới thiệu Flutter cho IoT
**Lý thuyết:**
- Tổng quan về Flutter và Dart
- Ưu điểm của Flutter cho ứng dụng IoT đa nền tảng
- Kiến trúc ứng dụng Flutter và widget tree

**Thực hành:**
- Cài đặt Flutter SDK và thiết lập môi trường phát triển
- Khởi tạo dự án Flutter mới
- Tạo giao diện người dùng đầu tiên với Flutter
- Chạy ứng dụng trên thiết bị Android/iOS hoặc emulator

### Bài 15: Thiết kế UI cho Ứng dụng Di động
**Lý thuyết:**
- Thiết kế UI/UX cho ứng dụng di động IoT
- Các widget cơ bản và nâng cao trong Flutter
- Thiết kế responsive và adaptive

**Thực hành:**
- Xây dựng layout chính cho ứng dụng
- Tạo các màn hình cơ bản (dashboard, thiết bị, cài đặt)
- Triển khai theme và styling nhất quán
- Thêm animations và transitions

### Bài 16: Kết nối API với Flutter
**Lý thuyết:**
- HTTP client trong Flutter (Dio, http package)
- Quản lý state trong Flutter (Provider, Riverpod, Bloc)
- Xử lý bất đồng bộ trong Dart

**Thực hành:**
- Thiết lập các service để gọi API FastAPI
- Xây dựng models và serializers
- Triển khai quản lý state cho ứng dụng
- Tạo repository pattern để tương tác với API

### Bài 17: Real-time Communication và Notifications
**Lý thuyết:**
- WebSockets trong Flutter
- Push notifications cho ứng dụng IoT
- Background services trong Flutter

**Thực hành:**
- Kết nối WebSocket từ Flutter đến Raspberry Pi
- Hiển thị dữ liệu real-time trên giao diện
- Cấu hình push notifications
- Triển khai background services để theo dõi thiết bị

## Phần 5: Dự án và Ứng dụng Nâng cao

### Bài 18: Hệ thống Giám sát và Điều khiển Thông minh
**Lý thuyết:**
- Kiến trúc hệ thống IoT hoàn chỉnh
- Các mô hình triển khai cho hệ thống giám sát
- Xử lý dữ liệu cảm biến và cơ chế cảnh báo

**Thực hành:**
- Kết nối các cảm biến (nhiệt độ, độ ẩm, ánh sáng) với Raspberry Pi
- Xây dựng API endpoints để thu thập và lưu trữ dữ liệu cảm biến
- Tạo dashboard trên Next.js để hiển thị dữ liệu
- Triển khai tính năng cảnh báo trên ứng dụng Flutter

### Bài 19: Xử lý Hình ảnh và Camera
**Lý thuyết:**
- Kết nối và điều khiển camera với Raspberry Pi
- Xử lý hình ảnh cơ bản trên Raspberry Pi
- Streaming video qua web và ứng dụng di động

**Thực hành:**
- Kết nối camera với Raspberry Pi
- Triển khai API để chụp ảnh và stream video
- Tạo giao diện xem camera trên Next.js
- Tích hợp camera stream vào ứng dụng Flutter

### Bài 20: Machine Learning cơ bản trên Raspberry Pi
**Lý thuyết:**
- Giới thiệu về machine learning trên thiết bị edge
- Các mô hình ML nhẹ cho Raspberry Pi
- Tích hợp ML với API và ứng dụng

**Thực hành:**
- Cài đặt TensorFlow Lite trên Raspberry Pi
- Triển khai mô hình nhận diện đối tượng đơn giản
- Tích hợp ML pipeline với FastAPI
- Hiển thị kết quả ML trên frontend và ứng dụng di động

### Bài 21: Triển khai hệ thống với Docker
**Lý thuyết:**
- Giới thiệu về containerization với Docker
- Lợi ích của Docker trên Raspberry Pi
- Microservices architecture cho IoT

**Thực hành:**
- Cài đặt Docker trên Raspberry Pi
- Tạo Dockerfile cho ứng dụng FastAPI
- Triển khai stack hoàn chỉnh với Docker Compose
- Cấu hình CI/CD đơn giản

### Bài 22: Bảo mật và Tối ưu hóa Hệ thống
**Lý thuyết:**
- Các nguyên tắc bảo mật cho IoT
- Tối ưu hóa hiệu suất trên Raspberry Pi
- Quản lý và giám sát hệ thống từ xa

**Thực hành:**
- Triển khai HTTPS và mã hóa dữ liệu
- Cấu hình firewall và bảo mật mạng
- Tối ưu hóa sử dụng tài nguyên cho Raspberry Pi
- Xây dựng hệ thống giám sát và cảnh báo

