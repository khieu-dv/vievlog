# 🎓 **BÀI 1: GIỚI THIỆU FLUTTER VÀ CÀI ĐẶT MÔI TRƯỜNG**


## 🎯 **Mục tiêu bài học**


* Hiểu **Flutter là gì**.
* Phân biệt cơ bản giữa **Flutter**, **React Native** và **Xamarin**.
* Hiểu được kiến trúc của Flutter: **Widget Tree**, **Rendering Engine**.
* Cài đặt thành công môi trường Flutter.
* Tạo và chạy được ứng dụng Flutter đầu tiên.


## 📝 **Nội dung chi tiết**

### 1. 🔍 **Flutter là gì?**

**Định nghĩa:**
Flutter là một **bộ công cụ phát triển UI (UI toolkit)** mã nguồn mở do Google phát triển, cho phép lập trình viên tạo ứng dụng **mobile, web và desktop** từ **cùng một mã nguồn (codebase)**.

**Ưu điểm nổi bật:**

* Viết 1 lần, chạy được nhiều nền tảng (Android, iOS, Web, Desktop)
* Giao diện mượt mà với hiệu suất gần như **native**
* Thư viện widget phong phú, tùy biến dễ dàng


### 2. ⚖️ **So sánh Flutter với React Native và Xamarin**

| Tiêu chí           | Flutter                    | React Native                  | Xamarin                |
| ------------------ | -------------------------- | ----------------------------- | ---------------------- |
| Ngôn ngữ           | Dart                       | JavaScript                    | C#                     |
| UI                 | Tùy biến 100% bằng widget  | Sử dụng native component      | Native + Xamarin Forms |
| Hiệu suất          | Gần như native             | Tốt nhưng phụ thuộc JS bridge | Tốt                    |
| Học dễ             | Trung bình                 | Dễ (với JS nền tảng)          | Cần biết C# và .NET    |
| Hỗ trợ đa nền tảng | Android, iOS, Web, Desktop | Android, iOS, Web             | Android, iOS, Windows  |



### 3. 🧱 **Kiến trúc Flutter: Widget Tree và Rendering Engine**

#### **Widget là gì?**

> Mọi thứ trong Flutter đều là widget – từ nút bấm, dòng chữ, khung màu, cho tới bố cục.

#### **Widget Tree:**

* Giống như **cây phân cấp**, nơi mỗi node là một widget.
* Mỗi widget con **nằm bên trong** một widget cha.

📌 Ví dụ:

```dart
MaterialApp(
  home: Scaffold(
    appBar: AppBar(title: Text("Hello")),
    body: Center(child: Text("Flutter")),
  ),
);
```

Sơ đồ widget tree của đoạn code trên:

```
MaterialApp
 └── Scaffold
     ├── AppBar
     │   └── Text("Hello")
     └── Center
         └── Text("Flutter")
```

#### **Rendering Engine:**

Flutter dùng **Skia**, một công cụ đồ họa mạnh mẽ, vẽ mọi pixel trực tiếp lên màn hình – không phụ thuộc vào native UI.


### 4. 🛠 **Cài đặt Flutter SDK trên Windows**

#### Bước 1: Tải SDK

* Truy cập: [https://flutter.dev/docs/get-started/install](https://flutter.dev/docs/get-started/install)
* Tải bản Flutter cho Windows

#### Bước 2: Giải nén và đặt PATH

* Giải nén vào thư mục không có dấu cách (ví dụ: `C:\flutter`)
* Thêm `C:\flutter\bin` vào **Environment Variables > PATH**

#### Bước 3: Mở CMD và gõ:

```bash
flutter doctor
```


### 5. 🧑‍💻 **Cài đặt IDE và Emulator**

#### Cài Android Studio:

* Dùng để:

  * Tạo và quản lý emulator
  * Cung cấp Android SDK
* Trong quá trình cài, nhớ **tick chọn Android SDK, SDK Command-line Tools**



### 6. 🚀 **Tạo và chạy ứng dụng Flutter đầu tiên**

#### Tạo project mới:

Mở terminal/cmd:

```bash
flutter create hello_flutter
cd hello_flutter
code .
```

#### Chạy ứng dụng:

```bash
flutter run
```

🎉 Ứng dụng "Hello World" đã chạy trên emulator!


## 🧪 **Bài tập thực hành**

### 🔖 Đề bài:

> Hãy cài đặt môi trường Flutter đầy đủ trên máy và tạo một ứng dụng Flutter có giao diện đơn giản hiển thị dòng chữ:
> `Chào mừng bạn đến với Flutter!`



## 🔑 **Những điểm quan trọng cần lưu ý**

| Chủ đề         | Ghi nhớ                          |
| -------------- | -------------------------------- |
| Flutter        | Dùng Dart, UI xây từ widget      |
| Widget Tree    | Mọi widget là một node trong cây |
| flutter doctor | Dùng kiểm tra cài đặt môi trường |
| Emulator       | Cần Android Studio để tạo        |
| `flutter run`  | Lệnh chạy ứng dụng               |

❗ **Lỗi hay gặp:**

* Quên thêm `flutter/bin` vào PATH
* Chạy emulator nhưng chưa bật
* VS Code thiếu extension Flutter/Dart


## 📝 **Bài tập về nhà**

### 📌 Đề bài:

> Tạo một ứng dụng Flutter mới tên là `my_profile`, hiển thị các thông tin sau:
>
> * Họ và tên
> * Email
> * Một câu giới thiệu ngắn

