# 🎓 **Bài 1: Cài đặt và thiết lập Docker trên Windows**

## 🎯 **Mục tiêu bài học**

Sau bài học này, học viên sẽ:

- Hiểu được **Docker là gì**, lý do tại sao nên dùng Docker trong phát triển phần mềm, đặc biệt là khi làm việc với Redis.
- Biết cách **cài đặt Docker Desktop trên Windows** và kiểm tra môi trường Docker hoạt động đúng.
- Nắm rõ các **khái niệm cốt lõi của Docker**: Image, Container, Dockerfile, Volume, Port Mapping.
- Tự tay xây dựng và chạy một ứng dụng **Next.js** trong Docker, từ bước khởi tạo cho đến tạo và chạy Docker Image.
- Làm nền tảng để triển khai Redis bằng Docker trong các bài học sau.

## 📝 **Nội dung chi tiết**

### 1. 📦 Docker là gì?

- Docker là **nền tảng mã nguồn mở** giúp đóng gói ứng dụng và các thành phần phụ thuộc vào **container** – một đơn vị nhẹ, di động và độc lập.
- Giúp đảm bảo ứng dụng **"chạy được ở mọi nơi"**: từ máy tính cá nhân đến server thật hoặc cloud.
- Docker giải quyết vấn đề **"máy em chạy được, mà máy anh không chạy"** do môi trường khác nhau.

### 2. 💻 Cài đặt Docker Desktop trên Windows

#### Bước 1: Kiểm tra yêu cầu hệ thống

- Windows 10/11 Pro, Enterprise hoặc Education (Hỗ trợ WSL2 hoặc Hyper-V).
- Nếu dùng Windows Home: cần bật **WSL2 (Windows Subsystem for Linux v2)**.

#### Bước 2: Tải Docker Desktop

- Truy cập: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- Chọn bản dành cho Windows và tải xuống.

#### Bước 3: Cài đặt Docker Desktop

- Mở file `.exe` và cài đặt theo hướng dẫn.
- Khởi động Docker Desktop, đợi nó báo “Docker is running”.

#### Bước 4: Kiểm tra cài đặt

Mở **Command Prompt** hoặc **PowerShell**:

```bash
docker --version
docker info
```

Nếu có thông tin hiện ra tức là Docker đã cài thành công.

### 3. 🔍 Các khái niệm cơ bản trong Docker

| Khái niệm        | Giải thích đơn giản                                                                       |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Image**        | Mẫu chứa hệ điều hành + mã nguồn + môi trường chạy ứng dụng                               |
| **Container**    | Một phiên bản đang chạy của Image (giống như "chạy chương trình")                         |
| **Dockerfile**   | Tập tin hướng dẫn để tạo ra một Image                                                     |
| **Volume**       | Vùng lưu trữ dữ liệu bên ngoài container (giúp dữ liệu không bị mất khi container bị xóa) |
| **Port mapping** | Liên kết cổng trong container với cổng trên máy chủ (host)                                |

### 4. 🚀 Ví dụ thực tế: Khởi tạo và chạy dự án Next.js với Docker

#### Bước 1: Tạo ứng dụng Next.js

```bash
npx create-next-app@latest nextjs-docker-demo
cd nextjs-docker-demo
```

#### Bước 2: Viết Dockerfile

Tạo file `Dockerfile` trong thư mục gốc:

```Dockerfile
# Base image
FROM node:20.10-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build project
RUN npm run build

# Expose cổng ứng dụng
EXPOSE 3000

# Lệnh chạy khi container khởi động
CMD ["npm", "start"]
```

#### Bước 3: Viết file `.dockerignore`

```txt
node_modules
npm-debug.log
.next
```

#### Bước 4: Build Docker Image

```bash
docker build -t nextjs-docker-demo .
```

#### Bước 5: Chạy Container

```bash
docker run -d -p 3000:3000 nextjs-docker-demo
```

- Truy cập trình duyệt: `http://localhost:3000` để kiểm tra.

## 🔑 **Những điểm quan trọng cần lưu ý**

1. **Docker Image vs Container**:
   - Image là “khuôn mẫu”, Container là “bản chạy thật”.
   - Nhiều container có thể dùng chung một image.

2. **Không nên chạy Docker bằng quyền Admin trừ khi cần thiết** để tránh rủi ro bảo mật.

3. **Cẩn thận khi dùng volume**: nếu không khai báo đúng, dữ liệu có thể bị mất khi xóa container.

4. **Dockerfile phải đặt đúng tại thư mục gốc dự án**, nơi chứa `package.json`.

5. **Khi chạy Docker lần đầu**, Docker Desktop sẽ yêu cầu bạn bật WSL2 hoặc Hyper-V – hãy làm theo hướng dẫn.
