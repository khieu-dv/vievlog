

# Bài 2: Tạo route cơ bản trong FastAPI

---

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ có khả năng:

* Hiểu rõ **khái niệm route (endpoint)** trong ứng dụng web API.
* Biết cách **tạo route GET đơn giản** trong FastAPI để trả về dữ liệu.
* Hiểu cách FastAPI **tự động trả về response dưới dạng JSON**.
* Thực hành viết nhiều route GET khác nhau để làm quen với cấu trúc ứng dụng FastAPI.
* Nắm được cách chạy ứng dụng FastAPI và kiểm thử các route bằng trình duyệt hoặc công cụ Postman.

---

## 📝 Nội dung chi tiết

### 1. Khái niệm Route (Endpoint)

* **Route (hay Endpoint)** là một địa chỉ URL trên server mà client có thể gửi yêu cầu HTTP đến để nhận dữ liệu hoặc thực hiện hành động nào đó.
* Ví dụ: Khi bạn truy cập `https://api.example.com/users`, thì `/users` chính là một route.
* Mỗi route sẽ được định nghĩa để xử lý một phương thức HTTP cụ thể như GET, POST, PUT, DELETE.
* Trong FastAPI, bạn sẽ dùng decorator như `@app.get()`, `@app.post()` để tạo các route tương ứng.

> **Mục tiêu:** Học viên hiểu route là gì, chức năng và vai trò của route trong API.

---

### 2. Tạo GET Route đầu tiên trong FastAPI

* FastAPI cho phép bạn khai báo route bằng cách sử dụng các decorator rất trực quan.
* Ví dụ đơn giản nhất là tạo một route trả về chuỗi “Hello, FastAPI!” khi người dùng truy cập `/hello`.

**Giải thích:**

* `@app.get("/hello")` nghĩa là tạo một route với phương thức GET tại đường dẫn `/hello`.
* Hàm bên dưới decorator sẽ trả về dữ liệu, FastAPI tự động chuyển đổi thành JSON response.

**Ví dụ code:**

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
def read_hello():
    return {"message": "Hello, FastAPI!"}
```

* Khi chạy ứng dụng và truy cập `http://localhost:8000/hello`, bạn sẽ nhận được JSON:

```json
{"message": "Hello, FastAPI!"}
```

---

### 3. Tự động trả về JSON response

* FastAPI tự động serialize (chuyển đổi) dictionary Python thành JSON response chuẩn.
* Bạn không cần phải gọi `jsonify` hay thao tác thủ công.
* Điều này giúp việc phát triển API trở nên nhanh chóng và dễ dàng.

---

### 4. Tạo nhiều route GET khác nhau

* Bạn có thể tạo nhiều route khác nhau với các đường dẫn khác nhau.
* Mỗi route sẽ có một hàm xử lý riêng biệt.
* Ví dụ tạo thêm các route:

```python
@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI!"}

@app.get("/items")
def read_items():
    return [{"item_id": 1, "name": "Item One"}, {"item_id": 2, "name": "Item Two"}]

@app.get("/about")
def about():
    return {"info": "This is a sample FastAPI application."}
```

* Giải thích thêm:

  * Route `/` trả về thông báo chào mừng.
  * Route `/items` trả về danh sách items dưới dạng JSON.
  * Route `/about` trả về thông tin giới thiệu.

* Học viên có thể truy cập trực tiếp trên trình duyệt hoặc dùng công cụ API client như Postman, Insomnia.

---

### 5. Chạy ứng dụng FastAPI và kiểm thử route

* Dùng lệnh chạy server:

```bash
uvicorn main:app --reload
```

* `--reload` giúp tự động tải lại khi bạn sửa code.
* Truy cập đường dẫn route trong trình duyệt hoặc API client để kiểm thử.
* FastAPI cũng cung cấp trang tài liệu API tự động tại `http://localhost:8000/docs` rất hữu ích cho việc kiểm thử và hiểu API.

---

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài:

> Viết một ứng dụng FastAPI có các route sau:
>
> 1. Route `/` trả về JSON với message: "Chào mừng bạn đến với khóa học FastAPI!"
> 2. Route `/hello` trả về JSON với message: "Xin chào FastAPI!"
> 3. Route `/items` trả về một danh sách các item gồm:
>
>    * {"id": 1, "name": "Bút"},
>    * {"id": 2, "name": "Sổ tay"},
>    * {"id": 3, "name": "Túi xách"}

### Lời giải chi tiết:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    # Trả về thông điệp chào mừng
    return {"message": "Chào mừng bạn đến với khóa học FastAPI!"}

@app.get("/hello")
def read_hello():
    # Trả về lời chào đơn giản
    return {"message": "Xin chào FastAPI!"}

@app.get("/items")
def read_items():
    # Trả về danh sách item dạng JSON
    items = [
        {"id": 1, "name": "Bút"},
        {"id": 2, "name": "Sổ tay"},
        {"id": 3, "name": "Túi xách"}
    ]
    return items
```

**Phân tích từng bước:**

* Khởi tạo ứng dụng FastAPI bằng `app = FastAPI()`.
* Tạo route `/` dùng `@app.get("/")` trả về dictionary với key `message`.
* Tạo route `/hello` trả về thông điệp khác.
* Tạo route `/items` trả về danh sách Python, FastAPI tự động chuyển thành JSON array.
* Chạy server bằng uvicorn và kiểm tra từng route bằng trình duyệt.

---

## 🔑 Những điểm quan trọng cần lưu ý

* **Route trong FastAPI được định nghĩa qua các decorator như `@app.get()`, `@app.post()`.**
* **Phương thức HTTP (GET, POST, PUT, DELETE) là cách xác định hành động của route. Ở bài này chỉ dùng GET.**
* **FastAPI tự động trả về dữ liệu dưới dạng JSON, nên bạn chỉ cần trả về dictionary hoặc list Python.**
* **Tên hàm định nghĩa route có thể tùy ý, nhưng nên đặt rõ ràng để dễ quản lý.**
* **Mỗi route cần có đường dẫn (`path`) duy nhất để tránh xung đột.**
* **Sử dụng `uvicorn` để chạy ứng dụng và thêm `--reload` giúp tự động tải lại khi sửa code.**

---

## 📝 Bài tập về nhà

> Viết một ứng dụng FastAPI với các route GET sau:
>
> 1. Route `/welcome` trả về JSON với message: "Chào mừng bạn đến với FastAPI!"
> 2. Route `/users` trả về danh sách user gồm 3 user, mỗi user có `id` và `username`.
> 3. Route `/status` trả về JSON với key `status` và giá trị `"OK"`.
>
> *Yêu cầu:* Chạy ứng dụng và kiểm thử các route bằng trình duyệt hoặc Postman. Chuẩn bị sẵn code để thảo luận trong buổi học tiếp theo.


