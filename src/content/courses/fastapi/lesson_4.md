

# Bài 4: Request Body và kiểu dữ liệu cơ bản

---

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ có khả năng:

* Hiểu rõ khái niệm **Request Body** trong HTTP và cách nhận dữ liệu từ client gửi lên qua FastAPI.
* Biết cách khai báo và sử dụng **Pydantic BaseModel** để định nghĩa kiểu dữ liệu cho request body.
* Thực hành tạo các model dữ liệu cơ bản với các kiểu dữ liệu phổ biến như `str`, `int`, `float`, `Optional`.
* Viết API endpoint nhận dữ liệu dạng JSON, tự động validate và trả về kết quả tương ứng.
* Hiểu cách FastAPI tích hợp mạnh mẽ Pydantic để xử lý dữ liệu đầu vào một cách đơn giản và chính xác.

---

## 📝 Nội dung chi tiết

### 1. Khái niệm Request Body là gì?

* **Request Body** là phần dữ liệu mà client gửi lên server trong một HTTP request, thường dùng trong các method như POST, PUT, PATCH.
* Thông thường, dữ liệu được gửi theo định dạng JSON, XML hoặc các định dạng khác.
* Trong API hiện đại, JSON là định dạng phổ biến nhất để truyền dữ liệu từ client lên server.

> **Ví dụ:** Khi bạn gửi thông tin đăng ký tài khoản (tên, email, mật khẩu), các dữ liệu đó sẽ nằm trong phần Request Body.

---

### 2. Tại sao phải định nghĩa kiểu dữ liệu cho Request Body?

* Để server hiểu đúng cấu trúc dữ liệu client gửi lên, tránh lỗi và giúp validate dữ liệu.
* Giúp tự động kiểm tra các trường dữ liệu có hợp lệ không (ví dụ: giá phải là số dương, trường bắt buộc phải có).
* Giúp FastAPI tự động tạo tài liệu API (OpenAPI/Swagger) rõ ràng, dễ sử dụng.

---

### 3. Giới thiệu Pydantic và BaseModel

* **Pydantic** là thư viện giúp định nghĩa các model dữ liệu bằng cách kế thừa `BaseModel`.
* Mỗi model tương ứng với một cấu trúc dữ liệu (ví dụ: `Item`, `User`, `Order`).
* Pydantic hỗ trợ các kiểu dữ liệu Python chuẩn như `str`, `int`, `float`, `bool`, và cả `Optional`.
* Khi model được sử dụng làm kiểu dữ liệu cho request body, FastAPI tự động parse và validate dữ liệu client gửi lên.

---

### 4. Cách định nghĩa một model với BaseModel

```python
from pydantic import BaseModel
from typing import Optional

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
```

* `name`: trường bắt buộc, kiểu `str`
* `description`: trường không bắt buộc (`Optional`), mặc định `None`
* `price`: trường bắt buộc, kiểu `float`

---

### 5. Viết API POST nhận dữ liệu JSON từ client

* Dùng decorator `@app.post("/items/")` để tạo route nhận POST request.
* Trong hàm xử lý route, khai báo tham số có kiểu `Item` (model) để FastAPI tự động lấy dữ liệu từ Request Body và convert thành object.

```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/items/")
async def create_item(item: Item):
    return {"item_name": item.name, "item_price": item.price}
```

* Khi client gửi JSON như:

```json
{
  "name": "Bút bi",
  "description": "Bút viết êm tay",
  "price": 15000.5
}
```

* FastAPI sẽ tự động parse và trả về:

```json
{
  "item_name": "Bút bi",
  "item_price": 15000.5
}
```

---

### 6. Giải thích quy trình xử lý Request Body trong FastAPI

* FastAPI tự động:

  * Đọc dữ liệu JSON từ request body.
  * Dùng Pydantic để parse dữ liệu vào model `Item`.
  * Kiểm tra tính hợp lệ các trường dữ liệu.
  * Nếu dữ liệu không hợp lệ, trả về lỗi HTTP 422 với chi tiết.
  * Nếu hợp lệ, truyền object `item` vào hàm xử lý.

---

### 7. Một số kiểu dữ liệu cơ bản trong Pydantic bạn nên biết

| Kiểu dữ liệu Python | Ý nghĩa                             |
| ------------------- | ----------------------------------- |
| `str`               | Chuỗi ký tự                         |
| `int`               | Số nguyên                           |
| `float`             | Số thực                             |
| `bool`              | Giá trị đúng/sai                    |
| `Optional[type]`    | Trường không bắt buộc (có thể None) |
| `List[type]`        | Danh sách các phần tử cùng kiểu     |

---

## 🏆 Bài tập thực hành (có lời giải)

### Đề bài

Tạo API POST `/products/` nhận thông tin sản phẩm với các trường:

* `title`: tên sản phẩm (bắt buộc, kiểu string)
* `description`: mô tả sản phẩm (không bắt buộc)
* `price`: giá sản phẩm (bắt buộc, kiểu float)
* `tax`: thuế sản phẩm (không bắt buộc, float, mặc định 0.0)

API trả về JSON gồm:

* `title`
* `price_with_tax`: tổng giá = `price + tax`

### Lời giải

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

class Product(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = 0.0

@app.post("/products/")
async def create_product(product: Product):
    total_price = product.price + (product.tax or 0)
    return {"title": product.title, "price_with_tax": total_price}
```

### Phân tích

* Dùng `Optional` để cho phép trường mô tả và thuế có thể không gửi lên.
* Khai báo mặc định cho `tax = 0.0` để nếu client không truyền sẽ tính thuế bằng 0.
* Tính toán `price_with_tax` bên trong hàm xử lý và trả về kết quả.
* Kiểm tra dữ liệu sẽ tự động được thực hiện khi request đến.

---

## 🔑 Những điểm quan trọng cần lưu ý

* **Request Body chỉ áp dụng cho các method như POST, PUT, PATCH, không dùng cho GET.**
* Dữ liệu JSON gửi lên phải đúng định dạng, nếu sai FastAPI trả lỗi 422.
* Khi dùng Pydantic, kiểu dữ liệu được kiểm tra rất nghiêm ngặt (ví dụ `price` không được là string).
* `Optional` giúp bạn khai báo trường không bắt buộc, nếu không có trường này trong JSON, giá trị sẽ là `None` hoặc giá trị mặc định.
* Tên tham số trong hàm xử lý route trùng với tên model để FastAPI hiểu là lấy dữ liệu từ Request Body.
* Luôn khai báo kiểu dữ liệu rõ ràng để tránh lỗi không mong muốn và giúp tài liệu API tự động chính xác.

---

## 📝 Bài tập về nhà

### Đề bài

Xây dựng API POST `/users/` nhận dữ liệu người dùng với các trường:

* `username` (bắt buộc, chuỗi)
* `email` (bắt buộc, chuỗi)
* `full_name` (không bắt buộc, chuỗi)
* `age` (không bắt buộc, số nguyên, mặc định là 18)

API trả về JSON gồm:

* `username`
* `email`
* `age`

> **Yêu cầu:**
>
> * Viết model Pydantic phù hợp.
> * Viết route nhận dữ liệu và trả về kết quả như trên.
> * Đảm bảo dữ liệu được validate đúng kiểu.
> * Nếu thiếu trường bắt buộc, API trả lỗi hợp lý.

