
# Bài 5: Sử dụng các method HTTP khác (PUT, DELETE)

---

## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có khả năng:

* Hiểu được các phương thức HTTP phổ biến ngoài GET và POST, cụ thể là PUT và DELETE.
* Phân biệt được sự khác nhau giữa các method POST, PUT, PATCH trong REST API.
* Biết cách khai báo và sử dụng route FastAPI cho PUT và DELETE method.
* Thực hiện thao tác cập nhật và xóa dữ liệu qua API với FastAPI.
* Nắm được các best practices khi xử lý PUT và DELETE request.

---

## 📝 Nội dung chi tiết

### 1. Tổng quan về HTTP methods

Trong RESTful API, các phương thức HTTP biểu diễn các hành động khác nhau mà client muốn thực hiện trên tài nguyên (resource):

* **GET**: Lấy dữ liệu
* **POST**: Tạo mới tài nguyên
* **PUT**: Cập nhật tài nguyên (thay thế toàn bộ tài nguyên)
* **PATCH**: Cập nhật một phần tài nguyên
* **DELETE**: Xóa tài nguyên

> **Lưu ý:** Bài này tập trung vào PUT và DELETE, các method POST và GET đã được học ở bài trước.

---

### 2. Khái niệm về PUT và DELETE

#### PUT

* Dùng để **thay thế toàn bộ tài nguyên** tại một URL xác định.
* Nếu tài nguyên chưa tồn tại, một số API có thể tạo mới.
* PUT thường yêu cầu payload đầy đủ đại diện cho tài nguyên.
* Ví dụ: Cập nhật thông tin một sản phẩm (tên, giá, mô tả).

#### DELETE

* Dùng để **xóa tài nguyên** tại URL xác định.
* Sau khi xóa, tài nguyên không còn tồn tại.

---

### 3. So sánh POST, PUT và PATCH

| Phương thức | Mục đích                       | Payload          | Tác động                         |
| ----------- | ------------------------------ | ---------------- | -------------------------------- |
| POST        | Tạo mới tài nguyên             | Dữ liệu mới      | Thêm một tài nguyên mới          |
| PUT         | Thay thế hoặc cập nhật toàn bộ | Dữ liệu đầy đủ   | Thay thế tài nguyên hiện tại     |
| PATCH       | Cập nhật một phần tài nguyên   | Dữ liệu một phần | Chỉ cập nhật các trường được gửi |

---

### 4. Cách định nghĩa PUT và DELETE route trong FastAPI

FastAPI cung cấp các decorator riêng cho từng HTTP method:

* `@app.put("/items/{item_id}")`
* `@app.delete("/items/{item_id}")`

Chúng ta sẽ kết hợp với mô hình dữ liệu Pydantic để nhận dữ liệu JSON và xử lý.

---

### 5. Ví dụ minh họa cụ thể

Giả sử chúng ta có một danh sách lưu tạm các sản phẩm (items) dạng dictionary trong bộ nhớ.

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Model Pydantic cho item
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float

# Dữ liệu tạm (giả lập DB)
items = {
    1: {"name": "Apple", "description": "Fresh red apple", "price": 0.5},
    2: {"name": "Banana", "description": "Yellow banana", "price": 0.3},
}

# PUT: Cập nhật toàn bộ item theo ID
@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    items[item_id] = item.dict()
    return {"message": "Item updated", "item": items[item_id]}

# DELETE: Xóa item theo ID
@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    del items[item_id]
    return {"message": "Item deleted"}
```

---

### 6. Giải thích code

* **Model `Item`** dùng để validate dữ liệu khi client gửi lên.
* **PUT `/items/{item_id}`**:

  * Kiểm tra item có tồn tại không, nếu không trả về lỗi 404.
  * Cập nhật (thay thế) toàn bộ thông tin item bằng dữ liệu mới.
* **DELETE `/items/{item_id}`**:

  * Kiểm tra tồn tại.
  * Xóa item khỏi dictionary.

---

### 7. Một số lưu ý

* PUT nên được sử dụng khi client gửi dữ liệu đầy đủ tài nguyên để cập nhật.
* Nếu muốn cập nhật một phần nhỏ (ví dụ chỉ tên), nên dùng PATCH (bài sau sẽ đề cập).
* DELETE thường không cần body, chỉ cần xác định tài nguyên qua URL.
* Trả về mã trạng thái HTTP phù hợp: 200 hoặc 204 cho thành công, 404 khi không tìm thấy.

---

## 🏆 Bài tập thực hành có lời giải

### Đề bài

Tạo API quản lý danh sách người dùng với các thao tác:

* PUT `/users/{user_id}`: Cập nhật toàn bộ thông tin người dùng theo `user_id`.
* DELETE `/users/{user_id}`: Xóa người dùng theo `user_id`.

Thông tin người dùng gồm:

* `username` (string)
* `email` (string)
* `age` (int)

Sử dụng dictionary tạm lưu người dùng, trả lỗi 404 nếu user không tồn tại.

---

### Lời giải chi tiết

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr

app = FastAPI()

class User(BaseModel):
    username: str
    email: EmailStr
    age: int

# Dữ liệu tạm giả lập DB
users = {
    1: {"username": "john", "email": "john@example.com", "age": 30},
    2: {"username": "anna", "email": "anna@example.com", "age": 25},
}

@app.put("/users/{user_id}")
def update_user(user_id: int, user: User):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    users[user_id] = user.dict()
    return {"message": "User updated", "user": users[user_id]}

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    del users[user_id]
    return {"message": "User deleted"}
```

#### Phân tích bước làm

* Tạo model `User` với 3 trường, trong đó `email` được kiểm tra định dạng email chuẩn nhờ `EmailStr`.
* Khởi tạo dictionary `users` lưu dữ liệu tạm.
* Viết route PUT kiểm tra tồn tại user, cập nhật dữ liệu mới từ request body.
* Viết route DELETE xóa user khỏi dictionary.
* Xử lý lỗi 404 khi không tìm thấy user để API trả về phản hồi chuẩn.

---

## 🔑 Những điểm quan trọng cần lưu ý

* **PUT** thường dùng để thay thế toàn bộ tài nguyên, nên khi cập nhật cần gửi đủ các trường.
* **DELETE** chỉ cần URL chứa định danh tài nguyên để xóa, không cần body.
* Luôn kiểm tra tồn tại tài nguyên trước khi thao tác cập nhật hoặc xóa, tránh lỗi không mong muốn.
* Trả về mã trạng thái HTTP và thông báo lỗi rõ ràng, giúp client dễ xử lý.
* Tránh cập nhật bằng PUT với dữ liệu không đầy đủ, vì nó có thể ghi đè dữ liệu cũ.
* Để cập nhật một phần tài nguyên, phương thức **PATCH** là lựa chọn phù hợp hơn (khác với PUT).

---

## 📝 Bài tập về nhà

### Đề bài

Xây dựng API quản lý danh sách sản phẩm với các route:

* PUT `/products/{product_id}`: Cập nhật toàn bộ thông tin sản phẩm gồm `name` (string), `price` (float), `description` (string, optional).
* DELETE `/products/{product_id}`: Xóa sản phẩm theo `product_id`.

Sử dụng dictionary lưu dữ liệu tạm. Thêm kiểm tra trả về lỗi 404 khi không tìm thấy sản phẩm. Trả về phản hồi rõ ràng cho client.



