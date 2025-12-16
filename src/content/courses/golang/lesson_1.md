# Bài 1: Giới thiệu về Golang

## 🎯 Mục tiêu bài học
- Hiểu được lịch sử, triết lý và lý do ra đời của ngôn ngữ Go
- Nắm được các điểm mạnh và ứng dụng tiêu biểu của Go trong thực tế
- Cài đặt thành công Go và thiết lập môi trường phát triển
- Tạo và chạy được chương trình Go đầu tiên
- Làm quen với cú pháp cơ bản và cấu trúc của một chương trình Go

## 📝 Nội dung chi tiết

### 1. Lịch sử và triết lý của Golang

#### 1.1. Lịch sử phát triển
- **Năm ra đời**: 2007 (nội bộ Google), 2009 (phát hành công khai)

#### 1.2. Triết lý thiết kế
- **Đơn giản và rõ ràng**: Cú pháp gọn nhẹ, dễ đọc và dễ học
- **Hiệu năng cao**: Biên dịch nhanh và chạy nhanh

### 2. Điểm mạnh và các ứng dụng phổ biến

#### 2.1. Điểm mạnh của Go
- **Hiệu năng cao**: Tốc độ gần với C/C++ nhưng dễ phát triển hơn
- **Biên dịch nhanh**: Thời gian biên dịch ngắn, tăng hiệu quả phát triển

#### 2.2. Ứng dụng phổ biến
- **Hệ thống microservices**: Docker, Kubernetes, Istio
- **Cơ sở hạ tầng đám mây**: Các công cụ của Google Cloud, AWS, Dropbox


#### 2.3. Các công ty sử dụng Go
- Google, Uber, Twitch, Dropbox, Netflix, Cloudflare, PayPal, Meta, Shopify, DigitalOcean...

### 3. Cài đặt Go và thiết lập môi trường phát triển

#### 3.1. Cài đặt Go
- **Windows**:
  - Tải trình cài đặt từ [golang.org/dl](https://golang.org/dl/)
  - Chạy trình cài đặt và làm theo hướng dẫn
  - Kiểm tra biến môi trường `GOPATH` và `GOROOT`

- **macOS**:
  - Sử dụng Homebrew: `brew install go`
  - Hoặc tải trình cài đặt từ [golang.org/dl](https://golang.org/dl/)
  - Kiểm tra biến môi trường trong `~/.bash_profile` hoặc `~/.zshrc`

- **Linux**:
  - Ubuntu/Debian: `sudo apt-get update && sudo apt-get install golang-go`
  - CentOS/RHEL: `sudo yum install golang`
  - Hoặc tải và cài đặt từ [golang.org/dl](https://golang.org/dl/)

#### 3.2. Kiểm tra cài đặt
```bash
go version
```

#### 3.3. Cấu trúc thư mục Go tiêu chuẩn
- **GOPATH**: Đường dẫn đến workspace Go của bạn 
  - `/bin`: Chứa các tệp thực thi
  - `/pkg`: Chứa các gói đã biên dịch
  - `/src`: Chứa mã nguồn Go

#### 3.4. Công cụ phát triển (IDE/Editor)
- **Visual Studio Code + Go extension**: Phổ biến và đầy đủ tính năng
- **GoLand của JetBrains**: IDE chuyên dụng cho Go

### 4. Cấu trúc một chương trình Go đơn giản

#### 4.1. Chương trình Hello World
```go
// hello.go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World! Chào mừng đến với Golang!")
}
```


#### 4.2. Go Modules - Quản lý phụ thuộc hiện đại
```bash
# Khởi tạo một module mới
go mod init example.com/hello

# Tự động thêm phụ thuộc vào go.mod
go mod tidy
```

### 5. Go Playground - Công cụ thử nghiệm trực tuyến

- **Địa chỉ**: [play.golang.org](https://play.golang.org/)
- **Đặc điểm**:
  - Chạy mã Go trên server của Google
  - Chia sẻ code dễ dàng qua URL


## 🏆 Bài tập thực hành

### Bài tập 1: Cài đặt Go và kiểm tra phiên bản
**Yêu cầu**: Cài đặt Go và xác minh phiên bản đã cài đặt.



### Bài tập 2: Tạo và chạy chương trình Hello World
**Yêu cầu**: Tạo file `hello.go` và chạy chương trình in ra "Hello, World!".




4. Kết quả: Terminal hiển thị dòng chữ `Hello, World!`

### Bài tập 3: Mở rộng chương trình Hello World
**Yêu cầu**: Mở rộng chương trình để hiển thị thêm thông tin cá nhân.


### Bài tập 4: Khám phá Go Playground
**Yêu cầu**: Sử dụng Go Playground để chạy một chương trình đơn giản và chia sẻ URL.

## 🔑 Những điểm quan trọng cần lưu ý

1. **Go là ngôn ngữ biên dịch**: Chương trình Go được biên dịch thành mã máy, không phải thông dịch như Python hoặc JavaScript, nên tốc độ thực thi nhanh hơn.

2. **Triết lý đơn giản**: Go được thiết kế để đơn giản và dễ đọc, tránh những tính năng phức tạp, giúp người mới học dễ tiếp cận.

3. **Quy ước đặt tên và định dạng code**:
   - Go rất nghiêm ngặt về định dạng code, sử dụng `gofmt` để chuẩn hóa
   - Tên biến/hàm bắt đầu bằng chữ hoa sẽ được xuất (export) ra ngoài package



## 📝 Bài tập về nhà

1. **Tự học và tìm hiểu**:
   - Tìm hiểu thêm về lịch sử phát triển của Go và so sánh với các ngôn ngữ khác

2. **Cài đặt và thiết lập**:
   - Cài đặt Go trên máy tính cá nhânT

3. **Thực hành cơ bản**:
   - Viết chương trình in ra "Hello, [tên của bạn]!"

4. **Khám phá thư viện chuẩn**:
   - Tìm hiểu 3 package trong thư viện chuẩn: `fmt`, `time`, và `os`

5. **Tự thách thức**:
   - Viết chương trình yêu cầu người dùng nhập tên và tuổi, sau đó in ra năm sinh
