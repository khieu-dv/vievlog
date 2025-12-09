# Khóa học FastAPI Python (33 bài) – Cơ bản đến Trung cấp

---

## Bài 1: Giới thiệu FastAPI và môi trường làm việc

- Nội dung cơ bản:
  - FastAPI là gì? Ưu điểm của FastAPI
  - Cài đặt Python, pip, và FastAPI
  - Cài đặt và cấu hình môi trường ảo (virtualenv)
  - Giới thiệu `uv` là một công cụ mới do Astral (tác giả của `ruff`) phát triển

- Hoạt động:
  - Cài đặt môi trường ảo
  - Cài đặt FastAPI và uv
  - Tạo file `main.py` đơn giản và chạy ứng dụng FastAPI

---

## Bài 2: Tạo route cơ bản trong FastAPI

- Nội dung cơ bản:
  - Khái niệm về route (endpoint)
  - Tạo GET route đầu tiên
  - Trả về JSON response đơn giản

- Hoạt động:
  - Viết route `/hello` trả về “Hello, FastAPI!”
  - Tạo nhiều route GET khác nhau

---

## Bài 3: Sử dụng Path Parameters và Query Parameters

- Nội dung cơ bản:
  - Path parameters: lấy dữ liệu từ URL
  - Query parameters: lấy dữ liệu từ query string

- Hoạt động:
  - Tạo route có path param (ví dụ: `/items/{item_id}`)
  - Tạo route có query param (ví dụ: `/search?query=abc`)

---

## Bài 4: Request Body và kiểu dữ liệu cơ bản

- Nội dung cơ bản:
  - Khai báo kiểu dữ liệu Pydantic (BaseModel)
  - Nhận dữ liệu JSON từ client qua POST request

- Hoạt động:
  - Tạo model Item với các trường name, description, price
  - Viết route POST nhận dữ liệu item và trả về

---

## Bài 5: Sử dụng các method HTTP khác (PUT, DELETE)

- Nội dung cơ bản:
  - Khai thác PUT và DELETE method trong FastAPI
  - Sự khác biệt giữa POST, PUT và PATCH

- Hoạt động:
  - Viết route PUT cập nhật dữ liệu item
  - Viết route DELETE xóa item theo ID

---

## Bài 6: Quản lý dữ liệu tạm (Storage tạm thời)

- Nội dung cơ bản:
  - Tạo biến dictionary hoặc list lưu dữ liệu tạm trong bộ nhớ
  - Các thao tác thêm, sửa, xóa dữ liệu trong bộ nhớ

- Hoạt động:
  - Xây dựng CRUD cơ bản sử dụng biến tạm lưu item

---

## Bài 7: Validation nâng cao với Pydantic

- Nội dung cơ bản:
  - Các kiểu dữ liệu nâng cao: constr, conint,...
  - Validation dữ liệu đầu vào
  - Sử dụng Field để thêm mô tả, default, limit

- Hoạt động:
  - Tạo model với validation (vd: giá phải lớn hơn 0)
  - Thử gửi dữ liệu không hợp lệ để kiểm tra lỗi

---

## Bài 8: Response Model và Custom Response

- Nội dung cơ bản:
  - Response Model: giới hạn dữ liệu trả về cho client
  - Trả về HTTP status code tùy chỉnh
  - Trả về JSON response với cấu trúc riêng

- Hoạt động:
  - Sử dụng `response_model` trong route
  - Trả về status code 201 cho POST

---

## Bài 9: Xử lý lỗi và Exception trong FastAPI

- Nội dung cơ bản:
  - Xử lý lỗi 404, 400, 422 với HTTPException
  - Tạo custom exception handler

- Hoạt động:
  - Tạo lỗi 404 khi item không tồn tại
  - Tạo lỗi custom với message riêng

---

## Bài 10: Dependency Injection cơ bản

- Nội dung cơ bản:
  - Khái niệm dependency trong FastAPI
  - Tạo function dependency cơ bản

- Hoạt động:
  - Tạo dependency dùng chung cho route (ví dụ: lấy user hiện tại)
  - Tích hợp dependency vào route

---

## Bài 11: Sử dụng Header và Cookie

- Nội dung cơ bản:
  - Đọc dữ liệu header và cookie trong request

- Hoạt động:
  - Viết route đọc header `User-Agent`
  - Viết route đọc cookie tên `session_id`

---

## Bài 12: Tạo và sử dụng Middleware

- Nội dung cơ bản:
  - Middleware là gì? Cách tạo middleware đơn giản

- Hoạt động:
  - Viết middleware log thời gian request
  - Middleware kiểm tra header custom

---

## Bài 13: CORS trong FastAPI

- Nội dung cơ bản:
  - Giới thiệu Cross-Origin Resource Sharing (CORS)
  - Cấu hình CORS middleware trong FastAPI

- Hoạt động:
  - Cho phép các domain cụ thể gọi API

---

## Bài 14: Sử dụng Background Tasks

- Nội dung cơ bản:
  - Khái niệm background task
  - Thực thi task bất đồng bộ sau khi trả response

- Hoạt động:
  - Viết background task gửi email giả lập

---

## Bài 15: Upload và download file đơn giản

- Nội dung cơ bản:
  - Nhận file upload trong request
  - Trả về file cho client download

- Hoạt động:
  - Viết API upload file hình ảnh
  - Viết API trả file PDF mẫu cho client

---

## Bài 16: Template rendering với Jinja2

- Nội dung cơ bản:
  - Tích hợp Jinja2 để render HTML template

- Hoạt động:
  - Viết route render trang HTML động với dữ liệu

---

## Bài 17: Xử lý Form data

- Nội dung cơ bản:
  - Nhận dữ liệu từ form HTML (form-urlencoded)

- Hoạt động:
  - Viết route nhận dữ liệu đăng ký người dùng qua form

---

## Bài 18: Làm việc với Query Parameters nâng cao

- Nội dung cơ bản:
  - Các kiểu query param nâng cao: list, enum

- Hoạt động:
  - Viết route nhận danh sách tag (list) từ query param
  - Viết route sử dụng enum trong query param

---

## Bài 19: Pagination (Phân trang đơn giản)

- Nội dung cơ bản:
  - Ý tưởng phân trang trong API
  - Tạo query param `skip` và `limit`

- Hoạt động:
  - Viết API trả danh sách item phân trang

---

## Bài 20: Sử dụng Enum trong FastAPI

- Nội dung cơ bản:
  - Định nghĩa Enum và sử dụng làm kiểu dữ liệu

- Hoạt động:
  - Tạo Enum cho trạng thái item (ví dụ: active, inactive)

---

## Bài 21: Tạo API với đường dẫn động phức tạp

- Nội dung cơ bản:
  - Đường dẫn có nhiều phần và kiểu phức tạp

- Hoạt động:
  - Viết route có nhiều path params (ví dụ: `/users/{user_id}/items/{item_id}`)

---

## Bài 22: Sử dụng OAuth2 Password (Cơ bản)

- Nội dung cơ bản:
  - Giới thiệu OAuth2 Password Flow (không đi sâu bảo mật)
  - Tạo token giả cho user đăng nhập

- Hoạt động:
  - Viết route đăng nhập trả token giả (dummy token)

---

## Bài 23: Xác thực user với token (Basic)

- Nội dung cơ bản:
  - Kiểm tra token trong Header Authorization

- Hoạt động:
  - Viết dependency kiểm tra token hợp lệ trước khi truy cập API

---

## Bài 24: Giới thiệu SQLAlchemy và kết nối DB SQLite

- Nội dung cơ bản:
  - Tạo kết nối DB SQLite với SQLAlchemy
  - Tạo model ORM đơn giản

- Hoạt động:
  - Tạo bảng `items` trong SQLite
  - Thực hiện thêm, sửa, xóa dữ liệu DB qua ORM

---

## Bài 25: CRUD hoàn chỉnh với DB

- Nội dung cơ bản:
  - Viết CRUD API kết nối DB SQLite

- Hoạt động:
  - Viết các route CRUD thực tế thao tác DB

---

## Bài 26: Migrations đơn giản với Alembic (cơ bản)

- Nội dung cơ bản:
  - Giới thiệu Alembic và migration DB

- Hoạt động:
  - Khởi tạo Alembic và tạo migration đầu tiên

---

## Bài 27: Cấu hình logging trong FastAPI

- Nội dung cơ bản:
  - Thiết lập logging chuẩn Python cho ứng dụng

- Hoạt động:
  - Tạo file log ghi lại các request lỗi và thông tin

---

## Bài 28: Sử dụng WebSocket cơ bản

- Nội dung cơ bản:
  - Giới thiệu WebSocket
  - Tạo route WebSocket đơn giản

- Hoạt động:
  - Viết chat server WebSocket cơ bản

---

## Bài 29: Pagination với DB và SQLAlchemy

- Nội dung cơ bản:
  - Phân trang truy vấn DB thực tế

- Hoạt động:
  - Viết API phân trang dữ liệu lấy từ DB

---

## Bài 30: Upload file lưu vào thư mục server

- Nội dung cơ bản:
  - Lưu file upload lên server

- Hoạt động:
  - Viết route upload file và lưu vào folder

---

## Bài 31: Quản lý CORS nâng cao

- Nội dung cơ bản:
  - Cấu hình CORS chi tiết theo domain, method

- Hoạt động:
  - Thiết lập CORS cho domain cụ thể với các method giới hạn

---

## Bài 32: Đóng gói và triển khai ứng dụng FastAPI

- Nội dung cơ bản:
  - Đóng gói ứng dụng (requirements.txt, Dockerfile đơn giản)
  - Chạy ứng dụng với Uvicorn hoặc Gunicorn

- Hoạt động:
  - Viết Dockerfile cho FastAPI
  - Chạy container Docker ứng dụng FastAPI

---

## Bài 33: Tổng kết và bài tập thực hành toàn khóa

- Nội dung cơ bản:
  - Ôn lại kiến thức đã học
  - Hướng dẫn tự làm project nhỏ (ví dụ: API quản lý sản phẩm)

- Hoạt động:
  - Làm project CRUD hoàn chỉnh kết hợp validation, DB, auth đơn giản
  - Kiểm tra và tự sửa lỗi
