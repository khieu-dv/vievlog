

## ✅ Cách sửa lỗi `npx tauri init`:

### 🔧 **Cách 1: Dùng `cargo` để khởi tạo Tauri**

```bash
cargo install tauri-cli
cargo tauri init
```

Bạn dùng lệnh cho Android:

```bash
cargo tauri android init
```



Để **chạy dự án Tauri với Next.js** (dev mode), bạn làm theo các bước **chuẩn sau đây**:

---

## ✅ 1. Khởi động dev server của Next.js

Tauri sẽ load frontend từ địa chỉ `http://localhost:3000`, nên trước tiên bạn cần chạy:

```bash
npm run dev
# hoặc
yarn dev
```

---

## ✅ 2. Chạy Tauri ở chế độ dev

Ở một **terminal khác**, chạy:

```bash
cargo tauri dev
```

> ⚠️ Lệnh này sẽ:
>
> * Mở một cửa sổ native Tauri
> * Và load nội dung từ `http://localhost:3000`

---

## ✅ Cấu trúc thư mục sau khi init (ví dụ)

```bash
my-next-app/
├── node_modules/
├── pages/
├── public/
├── src/
├── out/                    # Dùng khi build production
├── src-tauri/              # Tauri files
│   ├── icons/
│   ├── tauri.conf.json
│   └── ...
├── package.json
├── tauri.conf.json
├── tsconfig.json
└── ...
```



## ✅ (Tuỳ chọn) Build production Tauri

Khi bạn đã sẵn sàng để build:

### 1. Export Next.js ra static site:

```bash
npm run build && npm run export
```

> Thư mục `out/` sẽ được tạo.

### 2. Kiểm tra lại trong `src-tauri/tauri.conf.json`:

```json
"build": {
  "distDir": "../out",
  "devPath": "http://localhost:3000"
}
```

### 3. Build app:

```bash
cargo tauri build
```


## Setup Android SDK

### ✅ Bước 1: Kiểm tra xem bạn đã cài Android SDK chưa

* Nếu bạn đã cài **Android Studio**, SDK sẽ thường nằm ở thư mục:

  ```
  C:\Users\<tên-user>\AppData\Local\Android\Sdk
  ```

* Nếu chưa cài, hãy tải và cài Android Studio từ: [https://developer.android.com/studio](https://developer.android.com/studio)

---

### ✅ Bước 2: Thiết lập biến môi trường `ANDROID_HOME`

1. **Mở cửa sổ Environment Variables:**

   * Bấm `Win + S` → tìm **Environment Variables** → chọn “Edit the system environment variables”
   * Trong cửa sổ System Properties → bấm nút **Environment Variables...**

2. **Tạo biến `ANDROID_HOME`:**

   * Trong phần **User variables** hoặc **System variables** → bấm **New**
   * **Name**: `ANDROID_HOME`
   * **Value**: Đường dẫn tới SDK, ví dụ:

     ```
     C:\Users\<tên-user>\AppData\Local\Android\Sdk
     ```

3. **Cập nhật biến `Path`:**
   Trong phần **User variables** → chọn dòng `Path` → bấm **Edit** → bấm **New** và thêm các dòng sau:

   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   ```

---


### Cài đặt Android NDK

### ✅ Bước 1: Cài đặt Android NDK

1. **Mở Android Studio** → **More Actions** → **SDK Manager**
2. Trong tab **SDK Tools**, tick vào:

   * ✅ **NDK (Side by side)**
   * ✅ **CMake** (khuyến khích)
3. Bấm **Apply** để cài đặt.

---

### ✅ Bước 2: Tìm đường dẫn đến NDK

Sau khi cài xong, NDK thường nằm tại thư mục:

```
C:\Users\<your-username>\AppData\Local\Android\Sdk\ndk\<version>
```

Ví dụ:

```
C:\Users\jpeople\AppData\Local\Android\Sdk\ndk\25.2.9519653
```

---

### ✅ Bước 3: Thiết lập biến môi trường `NDK_HOME`

1. Mở **Environment Variables** như ở bước trước.

2. Bấm **New** (ở mục User variables):

   * **Variable name**: `NDK_HOME`
   * **Variable value**: Dán đường dẫn tới thư mục NDK ở trên, ví dụ:

     ```
     C:\Users\jpeople\AppData\Local\Android\Sdk\ndk\25.2.9519653
     ```

3. Nếu bạn dùng `Path`, có thể thêm:

   ```
   %NDK_HOME%
   ```



Nếu bạn gặp lỗi khác như thiếu toolchain, mình cũng có thể hướng dẫn tiếp phần đó. Sau khi init thành công, bạn sẽ có thể chạy:

```bash
cargo tauri android dev
```

Để build ứng dụng Tauri trên Android.

---

Bạn cần mình hướng dẫn cài thêm toolchain nào nữa không (ví dụ `cargo-ndk` hay `rustup target`)?



Tuyệt vời! Bạn đã hoàn tất `cargo tauri android init` và Android project đã được tạo thành công.

### ✅ Tiếp theo: Chạy ứng dụng Tauri trên Android

---

### 🔧 Cách 1: Dùng `cargo tauri android dev` để build và chạy

Đây là cách nhanh nhất để build và chạy ứng dụng Android Tauri từ CLI.

1. **Kết nối thiết bị Android thật (hoặc emulator)**

   * Gõ `adb devices` để kiểm tra thiết bị đã kết nối.
   * Nếu chưa có emulator, bạn có thể tạo trong Android Studio → **Device Manager**.

2. **Build & run app:**
   Trong thư mục gốc dự án (chứa `src-tauri`), chạy:

   ```bash
   cargo tauri android dev
   ```

   Lệnh này sẽ:

   * Build phần Rust (backend)
   * Build phần Android (frontend)
   * Cài ứng dụng lên thiết bị
   * Mở ứng dụng tự động

---

### 🛠 Cách 2: Mở bằng Android Studio

Nếu bạn muốn debug UI hoặc chỉnh Gradle:

1. Mở thư mục Android Studio project đã được tạo ở:

   ```
   your_project/src-tauri/gen/android/
   ```

2. Android Studio sẽ nhận diện và sync Gradle.

3. Chạy từ Android Studio:

   * Chọn thiết bị → Nhấn nút ▶️ (Run)

---

### 🔄 Ghi nhớ:

Sau mỗi thay đổi trong phần Rust (`src-tauri`), bạn nên chạy lại:

```bash
cargo tauri android dev
```

Hoặc rebuild từ Android Studio để build lại thư viện Rust.

---

### ❗ Nếu bạn gặp lỗi liên quan tới target Rust chưa cài:

Hãy chạy:

```bash
rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi
rustup target add i686-linux-android
rustup target add x86_64-linux-android
```

---

Bạn muốn deploy file `.apk` để chia sẻ hay chỉ cần build & run local? Mình có thể hướng dẫn tiếp tùy mục tiêu.



Lỗi bạn đang gặp là do hệ thống **không tìm thấy Java** khi Tauri cố gắng build APK cho Android:

```
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
```

---

## ✅ Cách sửa lỗi JAVA\_HOME trên Windows

### 🔹 Bước 1: Cài đặt Java Development Kit (JDK)

* Truy cập: [https://www.oracle.com/java/technologies/javase-downloads.html](https://www.oracle.com/java/technologies/javase-downloads.html)
  hoặc: [https://adoptium.net/temurin/releases/](https://adoptium.net/temurin/releases/) (gọn nhẹ hơn)
* Tải bản phù hợp với Windows (JDK 17 là ổn định nhất hiện tại cho Android build)
* Cài đặt xong, ghi nhớ **đường dẫn cài đặt**, ví dụ:

  ```
  C:\Program Files\Java\jdk-17
  ```

---

### 🔹 Bước 2: Thiết lập biến môi trường JAVA\_HOME

1. Mở **Start Menu** → tìm `Environment Variables` → Chọn **"Edit the system environment variables"**
2. Bấm **Environment Variables...**
3. Trong phần **System variables**, bấm **New\...**

   * `Variable name`: `JAVA_HOME`
   * `Variable value`: `C:\Program Files\Java\jdk-17` (hoặc nơi bạn cài)
4. Tìm biến tên **Path**, chọn **Edit...**
5. Thêm dòng mới:

   ```
   %JAVA_HOME%\bin
   ```
6. Bấm OK → OK → OK để lưu lại

---

### 🔹 Bước 3: Kiểm tra

Mở một terminal mới (CMD/Powershell/VS Code), gõ:

```bash
java -version
```

Bạn nên thấy đầu ra như:

```bash
java version "17.x.x" ...
```

---

### 🔹 Bước 4: Build lại APK

Sau khi cấu hình xong, chạy lại:

```bash
cargo tauri android dev
```

---

## ✅ Nếu vẫn lỗi `symlink`, hãy xác nhận:

* Bạn **đã bật Developer Mode** (như mình hướng dẫn trước)
* Hoặc chạy terminal bằng **Administrator**
* Hoặc thay vì tạo symlink, bạn có thể thủ công **copy file**:

  ```bash
  copy target\x86_64-linux-android\debug\libapp_lib.so gen\android\app\src\main\jniLibs\x86_64\libapp_lib.so
  ```

---

Nếu sau khi làm vẫn gặp lỗi khác, bạn gửi lại lỗi mới, mình sẽ giúp bạn xử lý tiếp.




## ❗ LỖI CHÍNH:

```
Uncaught Error: Image Optimization using the default loader is not compatible with `{ output: 'export' }`.
```

### 💡 Nguyên nhân:

Bạn đang dùng Next.js với `output: 'export'` trong `next.config.js`, nghĩa là **chế độ static export**. Trong chế độ này, **Next.js không thể xử lý hình ảnh bằng Image Optimization API**.



#### ➤ **Cách 1 (Khuyến nghị nhất):** Tắt tính năng image optimization

Trong file `next.config.js`, thêm dòng:

```js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true, // <== thêm dòng này
  },
};
```






Để **build ra file APK và AAB** từ dự án `Tauri + Next.js` sử dụng `cargo-tauri android`, bạn cần thực hiện một số bước cấu hình và build cụ thể.

---

## ✅ Yêu cầu cơ bản

Trước tiên, đảm bảo bạn đã:

1. **Cài Android NDK + SDK + build tools**
2. **Cấu hình đúng `cargo-tauri` cho Android**
3. **Chạy lệnh `cargo tauri android init` nếu chưa làm**
4. **Cấu hình `next.config.js` với `output: 'export'` và `images.unoptimized: true`**

---

## 🛠 Build APK và AAB

### ✳️ Build APK (debug hoặc release):

#### ◾ Debug APK (dùng để test nhanh):

```bash
cargo tauri android dev
```

Sau đó file APK sẽ được tạo ở:

```
src-tauri/gen/android/app/build/outputs/apk/debug/app-debug.apk
```

---

#### ◾ Release APK:

```bash
cargo tauri android build
```

Sau khi hoàn tất, file APK release nằm ở:

```
src-tauri/gen/android/app/build/outputs/apk/release/app-release.apk
```

> Lưu ý: Nếu bạn muốn ký APK để phát hành, xem hướng dẫn ký bên dưới.

---

### ✳️ Build AAB (Android App Bundle – dùng để upload lên Google Play):

1. Chuyển thư mục vào thư mục Android được Tauri tạo:

```bash
cd src-tauri/gen/android
```

2. Build file AAB:

```bash
./gradlew bundleRelease
```

```bash
gradlew.bat assembleRelease
```

gradlew.bat assembleRelease


3. Sau khi build thành công, AAB sẽ nằm tại:

```
src-tauri/gen/android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🔐 (Tuỳ chọn) Ký file APK/AAB để upload lên Google Play

Google Play yêu cầu **file đã được ký (signed)**.

### Tạo keystore:

```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

Sau đó cấu hình signing trong file:

```
src-tauri/gen/android/app/build.gradle
```

Thêm vào cuối `android` block:

```gradle
signingConfigs {
    release {
        storeFile file("my-release-key.jks")
        storePassword "your-store-password"
        keyAlias "my-key-alias"
        keyPassword "your-key-password"
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
    }
}
```

Rồi build lại APK/AAB như ở trên để có file đã được ký.

---

## ✅ Tổng kết

| Mục tiêu               | Lệnh                                      | Output            |
| ---------------------- | ----------------------------------------- | ----------------- |
| Build APK Debug        | `cargo tauri android dev`                 | `app-debug.apk`   |
| Build APK Release      | `cargo tauri android build`               | `app-release.apk` |
| Build AAB (App Bundle) | `./gradlew bundleRelease`                 | `app-release.aab` |
| Ký APK/AAB             | Sử dụng `keytool` và chỉnh `build.gradle` | Signed APK/AAB    |

---

Nếu bạn cần mình **tạo file cấu hình `build.gradle` hoặc hướng dẫn tạo `keystore`**, cứ gửi yêu cầu — mình sẽ hỗ trợ chi tiết.
