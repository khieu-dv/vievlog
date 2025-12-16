

# 🔧 # Bài 2: HƯỚNG DẪN CÀI ĐẶT VÀ ĐIỀU KHIỂN RASPBERRY PI TỪ Desktop QUA VNC

## 🧾 Yêu cầu chuẩn bị:

* 1 Raspberry Pi đã cài hệ điều hành (Raspberry Pi OS)
* Raspberry Pi được kết nối mạng (Wi-Fi hoặc LAN)
* 1 máy tính Desktop (laptop hoặc PC)
* Chuột, bàn phím và màn hình cho lần cấu hình đầu tiên (hoặc SSH nếu bạn đã bật sẵn)

## 🥇 BƯỚC 1: Cài đặt và bật VNC trên Raspberry Pi

### Cách 1: Bật VNC bằng giao diện đồ họa


1. Kích hoạt VNC Server: sudo raspi-config → Interfacing Options → VNC → Enable
2. Hoặc cài đặt RealVNC: sudo apt update && sudo apt install realvnc-vnc-server
3. Khởi động VNC: sudo systemctl enable vncserver-x11-serviced


## 🥉 BƯỚC 2: Kết nối từ Desktop đến Raspberry Pi

1. Mở **VNC Viewer** trên Desktop

2. Nhập địa chỉ IP của Raspberry Pi (ví dụ: `192.168.1.100`) vào ô kết nối

   > Bạn có thể tìm IP trên Raspberry Pi bằng lệnh:

   ```bash
   hostname -I
   ```

3. Nhấn **Enter**

4. Khi được yêu cầu, nhập:

   * **Username**: thường là `pi`
   * **Password**: mật khẩu đăng nhập Raspberry Pi (mặc định là `raspberry` nếu bạn chưa đổi)

5. Nhấn **OK** để kết nối và bạn sẽ thấy màn hình Raspberry Pi hiển thị trên máy tính Desktop.

## 💡 GHI CHÚ:

* Đảm bảo Raspberry Pi và máy tính cùng mạng (Wi-Fi/LAN)
* Có thể thiết lập địa chỉ IP tĩnh cho Raspberry Pi để tiện kết nối lần sau
* Đổi mật khẩu mặc định của Pi để tăng tính bảo mật
* Nếu không thấy hình ảnh sau khi kết nối VNC, hãy gắn tạm màn hình vào Raspberry Pi để nó nhận độ phân giải


