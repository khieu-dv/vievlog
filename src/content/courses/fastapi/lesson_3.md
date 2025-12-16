

# Bài 3: Sử dụng Path Parameters và Query Parameters

---

## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ:

* Hiểu rõ khái niệm **Path Parameters** và **Query Parameters** trong HTTP API.
* Biết cách khai báo, nhận và xử lý **path parameters** trong FastAPI.
* Biết cách khai báo, nhận và xử lý **query parameters** trong FastAPI.
* Phân biệt được sự khác nhau giữa path parameters và query parameters.
* Thực hành viết các route cơ bản sử dụng path và query parameters trong FastAPI.
* Tăng cường kỹ năng đọc hiểu và viết API có tham số đầu vào trong URL.

---

## 📝 Nội dung chi tiết

### 1. Tổng quan về Parameters trong URL

Trước khi đi vào FastAPI, ta cần hiểu về **Parameters trong URL**:

* **Path Parameters** (Tham số đường dẫn): Là phần của URL được định nghĩa trong đường dẫn, dùng để xác định tài nguyên cụ thể. Ví dụ: `/items/5` — ở đây `5` là path parameter, đại diện cho item có ID = 5.

* **Query Parameters** (Tham số truy vấn): Là phần thêm vào sau dấu `?` trong URL, dùng để lọc, tìm kiếm hoặc truyền các tham số tùy chọn. Ví dụ: `/search?query=apple&limit=10` — có 2 query parameters: `query` và `limit`.

---

### 2. Path Parameters trong FastAPI

* **Khái niệm:** Path parameters là những biến được gắn trực tiếp vào trong đường dẫn URL, được định nghĩa trong route dưới dạng `{tên biến}`.

* **Cách khai báo:** Trong FastAPI, bạn khai báo path parameter bằng cách viết dấu ngoặc nhọn trong decorator route:

```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}
```

* **Giải thích:**

  * `item_id` là path parameter.
  * FastAPI tự động trích xuất giá trị từ URL và ép kiểu sang `int` (hoặc kiểu bạn khai báo).
  * Nếu truyền giá trị không đúng kiểu (ví dụ truyền chuỗi `"abc"` mà mong đợi `int`), FastAPI sẽ trả lỗi 422.

* **Lưu ý:**

  * Path parameters luôn bắt buộc.
  * Bạn có thể dùng nhiều path parameters trong một URL, ví dụ: `/users/{user_id}/items/{item_id}`.

---

### 3. Query Parameters trong FastAPI

* **Khái niệm:** Query parameters là những tham số được truyền dưới dạng cặp key=value sau dấu `?` trong URL.

* **Cách khai báo:** Khác với path parameters, query parameters không được khai báo trong đường dẫn mà xuất hiện trong phần function bằng cách đặt tham số có giá trị mặc định.

```python
@app.get("/search")
def search_items(query: str = None, limit: int = 10):
    return {"query": query, "limit": limit}
```

* **Giải thích:**

  * `query` và `limit` là query parameters.
  * Nếu không truyền `query`, giá trị mặc định `None` sẽ được dùng.
  * Nếu không truyền `limit`, giá trị mặc định `10` được dùng.
  * Nếu bạn muốn tham số bắt buộc, không gán giá trị mặc định (ví dụ `query: str`), FastAPI sẽ yêu cầu client phải truyền tham số này.

* **URL mẫu:**

  * `/search?query=apple&limit=5`
  * `/search?query=banana`
  * `/search` (với `query=None`, `limit=10`)

---

### 4. Phân biệt Path Parameters và Query Parameters

| Đặc điểm               | Path Parameters             | Query Parameters                                   |
| ---------------------- | --------------------------- | -------------------------------------------------- |
| Vị trí trong URL       | Trong phần đường dẫn (path) | Sau dấu `?` trong query string                     |
| Ví dụ URL              | `/items/5`                  | `/items/?skip=10&limit=5`                          |
| Có bắt buộc không?     | Bắt buộc                    | Thường không bắt buộc, tùy khai báo                |
| Dùng để                | Xác định tài nguyên cụ thể  | Lọc, phân trang, truyền tùy chọn                   |
| Khai báo trong FastAPI | Trong đường dẫn decorator   | Tham số function có giá trị mặc định hoặc Optional |

---

### 5. Ví dụ minh họa thực tế

```python
from fastapi import FastAPI
from typing import Optional

app = FastAPI()

# Path parameter: lấy item theo id
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id, "message": f"Đây là item số {item_id}"}

# Query parameter: tìm kiếm items
@app.get("/search")
def search_items(query: Optional[str] = None, limit: int = 10):
    results = [f"item_{i}" for i in range(1, limit+1)]
    return {"query": query, "limit": limit, "results": results}
```

* Bạn có thể truy cập:

  * `http://localhost:8000/items/3` sẽ trả về item 3.
  * `http://localhost:8000/search?query=apple&limit=5` trả về 5 item giả lập với từ khóa "apple".
  * `http://localhost:8000/search` trả về 10 item mặc định.

---

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài

Viết API cho cửa hàng online có các yêu cầu sau:

1. Tạo route `/products/{product_id}` để lấy thông tin chi tiết sản phẩm theo `product_id` (số nguyên).
2. Tạo route `/products/` có thể nhận các query parameters:

   * `category` (chuỗi, không bắt buộc)
   * `max_price` (số thực, không bắt buộc, mặc định là 1000.0)
   * Trả về danh sách sản phẩm giả lập thỏa mãn các điều kiện lọc trên.

### Lời giải chi tiết

```python
from fastapi import FastAPI
from typing import Optional

app = FastAPI()

# Giả lập dữ liệu sản phẩm
products_db = [
    {"product_id": 1, "name": "Áo thun", "category": "quần áo", "price": 200},
    {"product_id": 2, "name": "Điện thoại", "category": "điện tử", "price": 1500},
    {"product_id": 3, "name": "Máy tính bảng", "category": "điện tử", "price": 800},
    {"product_id": 4, "name": "Quần jeans", "category": "quần áo", "price": 300},
]

# Route lấy chi tiết sản phẩm theo product_id (path param)
@app.get("/products/{product_id}")
def get_product(product_id: int):
    for product in products_db:
        if product["product_id"] == product_id:
            return product
    return {"error": "Product not found"}

# Route lấy danh sách sản phẩm với filter query param
@app.get("/products/")
def list_products(category: Optional[str] = None, max_price: float = 1000.0):
    filtered = []
    for product in products_db:
        if category and product["category"] != category:
            continue
        if product["price"] > max_price:
            continue
        filtered.append(product)
    return {"products": filtered}
```

### Phân tích từng bước:

* **`/products/{product_id}`**:

  * Nhận `product_id` từ URL (path parameter).
  * Tìm sản phẩm tương ứng trong `products_db`.
  * Nếu không tìm thấy trả về lỗi đơn giản.

* **`/products/`**:

  * Nhận query parameters `category` và `max_price`.
  * Lọc danh sách sản phẩm theo điều kiện:

    * Nếu có `category`, chỉ lấy sản phẩm cùng category.
    * Chỉ lấy sản phẩm có giá nhỏ hơn hoặc bằng `max_price`.
  * Trả về danh sách sản phẩm phù hợp.

---

## 🔑 Những điểm quan trọng cần lưu ý

* **Path parameters là bắt buộc**, luôn phải có trong URL khi gọi API.
* **Query parameters thường không bắt buộc**, bạn nên khai báo giá trị mặc định hoặc dùng Optional để tránh lỗi.
* FastAPI tự động kiểm tra kiểu dữ liệu của parameters, nếu không hợp lệ sẽ trả lỗi 422.
* Khi khai báo path parameters, đặt tên biến trong decorator và function phải trùng nhau.
* Không được có query parameter cùng tên với path parameter trong cùng route.
* Sử dụng `Optional[type]` hoặc gán giá trị mặc định để query parameter trở nên không bắt buộc.
* Bạn có thể dùng nhiều path parameters và query parameters trong một route.
* Query parameters rất phù hợp cho các trường hợp lọc, phân trang, tìm kiếm,... trong API.

---

## 📝 Bài tập về nhà

### Đề bài

1. Viết API với route `/users/{user_id}/orders/` để lấy danh sách đơn hàng của user theo `user_id` (path param).

2. API này có thêm query parameters:

   * `status` (chuỗi, không bắt buộc) để lọc đơn hàng theo trạng thái (ví dụ: "pending", "completed").
   * `limit` (int, mặc định 5) để giới hạn số đơn hàng trả về.

3. Giả lập dữ liệu đơn hàng trong code với ít nhất 5 đơn hàng thuộc nhiều user khác nhau và các trạng thái khác nhau.

4. Trả về kết quả JSON gồm danh sách đơn hàng thỏa điều kiện lọc.

### Yêu cầu:

* Code rõ ràng, có chú thích từng phần.
* Đảm bảo xử lý trường hợp không tìm thấy đơn hàng.
* Kiểm tra kiểu dữ liệu đầu vào đúng.

