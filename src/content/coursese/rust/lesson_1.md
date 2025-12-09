# Bài 1: Giới thiệu Rust 

## 🎯 Mục tiêu bài học

1. Hiểu được nguồn gốc và triết lý của ngôn ngữ lập trình Rust
2. Nắm được các ưu điểm chính của Rust so với các ngôn ngữ khác
3. Xác định được các lĩnh vực phù hợp để áp dụng Rust

## 📝 Nội dung chi tiết

### 1. Lịch sử và triết lý của Rust

- **Nguồn gốc**
  - Được phát triển bởi Graydon Hoare tại Mozilla Research từ năm 2006
  - Phiên bản 1.0 chính thức ra mắt vào tháng 5/2015
  - Hiện nay được quản lý bởi Rust Foundation (thành lập năm 2021)

- **Triết lý cốt lõi**
  - Tập trung vào ba giá trị cốt lõi: Performance, Reliability và Productivity

### 2. Ưu điểm của Rust

- **An toàn về bộ nhớ**
  - Hệ thống ownership và borrowing ngăn chặn lỗi bộ nhớ tại thời điểm biên dịch
  - Không sử dụng garbage collector nhưng vẫn đảm bảo an toàn bộ nhớ

- **Hiệu suất cao**
  - Tốc độ thực thi tương đương C/C++
  - Không có runtime overhead

- **Xử lý đồng thời an toàn**
  - Mô hình ownership giúp tránh data races tại thời điểm biên dịch

- **Hệ sinh thái phát triển hiện đại**
  - Cargo: công cụ quản lý gói và build hệ thống

### 3. So sánh với các ngôn ngữ khác

- **So với C/C++**
  - An toàn hơn về bộ nhớ và thread
  - Biên dịch hiện đại hơn (cargo vs make/cmake)

- **So với Python/JavaScript**
  - Hiệu suất cao hơn nhiều lần
  - Kiểu tĩnh thay vì kiểu động

- **So với Go**
  - Kiểm soát bộ nhớ chi tiết hơn, không có garbage collector
  - Tính năng generic mạnh mẽ hơn

### 4. Các lĩnh vực ứng dụng của Rust

- **Phát triển hệ thống**

- **Web Development**

- **Network Programming**

- **Cloud và Distributed Systems**

- **Game development**

### 5. Cài đặt môi trường Rust

- **Cài đặt Rustup (trình quản lý phiên bản Rust)**
  - Windows: Tải xuống và chạy rustup-init.exe từ rustup.rs
  - macOS/Linux: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
  - Kiểm tra cài đặt: `rustc --version` và `cargo --version`

- **Các công cụ cơ bản**
  - rustc: Trình biên dịch Rust
  - cargo: Trình quản lý gói và dự án
  - rustup: Trình quản lý phiên bản Rust

- **IDE và Text Editor**
  - Visual Studio Code

### 6. Demo: Chương trình Rust đầu tiên

- **Tạo dự án mới**
  ```
  cargo new hello_rust
  cd hello_rust
  ```

- **Cấu trúc dự án**
  - Cargo.toml: File cấu hình dự án
  - src/main.rs: File mã nguồn chính


## 🏆 Bài tập thực hành 

### Bài tập 1: Cài đặt môi trường Rust và xác nhận phiên bản

**Yêu cầu:** Cài đặt Rust trên máy tính của bạn và xác minh phiên bản đã cài đặt.

### Bài tập 2: Tạo và chạy chương trình Rust đầu tiên

**Yêu cầu:** Tạo một chương trình Rust đơn giản hiển thị "Xin chào từ [tên của bạn]!"


## 🔑 Những điểm quan trọng cần lưu ý

1. **Ownership là khái niệm cốt lõi**: Rust khác biệt với các ngôn ngữ khác ở hệ thống ownership. 
2. **Đường cong học tập dốc**: Rust có đường cong học tập dốc hơn so với nhiều ngôn ngữ khác. 
3. **Sử dụng tài liệu chính thức**: Rust có tài liệu chính thức xuất sắc. "The Rust Book" (doc.rust-lang.org/book) là điểm khởi đầu tuyệt vời.


## 📝 Bài tập về nhà

1. **Thực hành**: Tạo một chương trình Rust đơn giản nhận tên người dùng từ input và hiển thị lời chào kèm theo thời gian hiện tại.

2. **Tìm hiểu**: Đọc chapter 1 và 2 của "The Rust Book" và tóm tắt các khái niệm quan trọng bạn học được.
