# Bài 1: Giới thiệu và cài đặt Raspberry Pi


## 🎯 Mục tiêu bài học

- Hiểu được lịch sử phát triển và triết lý đằng sau Raspberry Pi
- Phân biệt được các mẫu Raspberry Pi và đặc điểm kỹ thuật của từng mẫu
- Nắm vững các thành phần cơ bản trong hệ sinh thái Raspberry Pi
- Biết cách thiết lập Raspberry Pi lần đầu tiên
- Hiểu và thực hành được các ứng dụng cơ bản của Raspberry Pi

## 📝 Nội dung chi tiết

### 1. Lịch sử và triết lý phát triển của Raspberry Pi

#### 1.1 Nguồn gốc và tầm nhìn
Raspberry Pi ra đời vào năm 2012, được phát triển bởi Quỹ Raspberry Pi tại Vương quốc Anh.

##### Tầm nhìn chính của dự án là:
- Tạo ra máy tính có giá thành thấp, dễ tiếp cận
- Khuyến khích học tập lập trình và phần cứng máy tính

#### 1.2 Sự phát triển qua các thời kỳ
- **2012**: Ra mắt Raspberry Pi Model B đầu tiên 
- **2014**: Ra mắt Raspberry Pi 1 Model B+ 
- **2015**: Ra mắt Raspberry Pi 2
- **2016**: Ra mắt Raspberry Pi 3 
- **2019**: Ra mắt Raspberry Pi 4 
- **2021**: Ra mắt Raspberry Pi Pico
- **2023**: Ra mắt Raspberry Pi 5 

### 2. Các mẫu Raspberry Pi hiện có và so sánh đặc điểm kỹ thuật

#### 2.1 Dòng Raspberry Pi chính
| Mẫu | CPU | RAM | USB | HDMI | Ethernet | Wi-Fi/BT | GPIO | Giá tham khảo |
|-----|-----|-----|-----|------|----------|----------|------|--------------|
| Pi 5 | Quad-core Cortex-A76 2.4GHz | 4GB/8GB | 2× USB 3.0, 2× USB 2.0 | 2× micro HDMI | Gigabit | Wi-Fi 5, BT 5.0 | 40 pin | 60-80$ |
| Pi 4 | Quad-core Cortex-A72 1.5GHz | 2GB/4GB/8GB | 2× USB 3.0, 2× USB 2.0 | 2× micro HDMI | Gigabit | Wi-Fi 5, BT 5.0 | 40 pin | 35-75$ |
| Pi 3B+ | Quad-core Cortex-A53 1.4GHz | 1GB | 4× USB 2.0 | 1× HDMI | 300Mbps | Wi-Fi 4, BT 4.2 | 40 pin | 35$ |
| Pi Zero 2 W | Quad-core Cortex-A53 1GHz | 512MB | 1× micro USB | 1× mini HDMI | Không | Wi-Fi 4, BT 4.2 | 40 pin | 15$ |
| Pi Pico | Dual-core RP2040 133MHz | 264KB | 1× micro USB | Không | Không | Không | 26 pin | 4$ |

#### 2.2 Phân tích so sánh
- **Pi 5**: Mạnh mẽ nhất
- **Pi 4**: Cân bằng giữa hiệu năng và giá thành
- **Pi 3B+**: Vẫn đủ khả năng cho nhiều dự án
- **Pi Zero 2 W**: Siêu nhỏ gọn
- **Pi Pico**: Dành cho các dự án vi điều khiển đơn giản

### 3. Tổng quan về hệ sinh thái phần cứng và phần mềm

#### 3.1 Hệ sinh thái phần cứng
- **Bộ phận chính**: Bo mạch Raspberry Pi
- **Phụ kiện thiết yếu**:
  - Nguồn điện (5V với dòng phù hợp từng mẫu)
  - Thẻ microSD (tối thiểu 8GB, Class 10 trở lên)
  - Vỏ bảo vệ
  - Cáp HDMI hoặc micro HDMI
  - Bàn phím và chuột USB


#### 3.2 Hệ sinh thái phần mềm
- **Hệ điều hành**:
  - Raspberry Pi OS (trước đây là Raspbian)

- **Ngôn ngữ lập trình được hỗ trợ**:
  - Python
  - C/C++
  - JavaScript/Node.js
  - Scratch (lập trình trực quan)
  - Rust, Go, Java và nhiều ngôn ngữ khác
- **Công cụ phát triển**:
  - Thonny IDE (mặc định cho Python)

### 4. Các ứng dụng phổ biến của Raspberry Pi trong thực tế

#### 4.1 Giáo dục và học tập


#### 4.2 Trung tâm giải trí

#### 4.3 Dự án IoT (Internet of Things)

#### 4.4 Máy chủ và mạng

#### 4.5 Tự động hóa và công nghiệp


### 5. Thiết lập Raspberry Pi lần đầu tiên

#### 5.1 Chuẩn bị thiết bị
- Raspberry Pi (chúng ta sẽ sử dụng Pi 4 làm ví dụ)
- Nguồn điện chính hãng (5V/3A)
- Thẻ microSD (16GB hoặc lớn hơn)
- Cáp micro HDMI
- Bàn phím và chuột USB
- Màn hình với cổng HDMI

#### 5.2 Cài đặt hệ điều hành
1. Tải Raspberry Pi Imager từ trang web chính thức
2. Cài đặt và chạy phần mềm
3. Chọn OS: Raspberry Pi OS (32-bit) với desktop
4. Chọn thẻ SD (cẩn thận không chọn nhầm ổ)
5. Cấu hình các tùy chọn nâng cao (tên người dùng, mật khẩu, Wi-Fi)
6. Ghi hệ điều hành vào thẻ

#### 5.3 Kết nối và khởi động
1. Lắp thẻ microSD vào Raspberry Pi
2. Kết nối các thiết bị ngoại vi (màn hình, bàn phím, chuột)
3. Kết nối nguồn điện và khởi động
4. Trải qua quá trình cài đặt ban đầu
5. Khám phá desktop Raspberry Pi OS

## 🏆 Bài tập thực hành 

### Bài tập 1: Cài đặt Raspberry Pi OS và thiết lập Wi-Fi từ đầu


### Bài tập 2: Khám phá GPIO và điều khiển đèn LED

**Yêu cầu**: Kết nối đèn LED với Raspberry Pi và viết script Python đơn giản để điều khiển LED nhấp nháy.


## 🔑 Những điểm quan trọng cần lưu ý

1. **Về nguồn điện**:
   - Luôn sử dụng nguồn có công suất phù hợp. Raspberry Pi 4 cần nguồn 5V/3A, Pi 3 cần 5V/2.5A

2. **Về thẻ microSD**:
   - Chọn thẻ microSD chất lượng cao (SanDisk, Samsung) để đảm bảo hiệu suất và độ bền

