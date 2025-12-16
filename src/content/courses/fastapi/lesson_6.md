

# Bài 6: Quản lý dữ liệu tạm (Storage tạm thời)

---

## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ:

* Hiểu rõ khái niệm **lưu trữ dữ liệu tạm thời trong bộ nhớ (in-memory storage)** trong ứng dụng web.
* Biết cách tạo và sử dụng biến lưu trữ tạm thời (dạng `dict` hoặc `list`) để quản lý dữ liệu trong FastAPI.
* Thành thạo các thao tác CRUD (Create, Read, Update, Delete) trên dữ liệu lưu trữ tạm thời.
* Nắm được ưu, nhược điểm của việc lưu dữ liệu tạm thời so với lưu vào cơ sở dữ liệu.
* Biết cách xử lý dữ liệu tạm thời trong nhiều endpoint khác nhau và hiểu sự giới hạn của nó trong ứng dụng thực tế.

---

## 📝 Nội dung chi tiết

### 1. **Khái niệm lưu trữ dữ liệu tạm thời (In-memory storage)**

* **In-memory storage** là cách lưu trữ dữ liệu trực tiếp trong bộ nhớ RAM của ứng dụng khi chương trình đang chạy.
* Dữ liệu sẽ **biến mất khi server khởi động lại hoặc tắt**.
* Thường dùng trong các trường hợp demo, phát triển nhanh, hoặc lưu dữ liệu tạm thời, không yêu cầu lưu lâu dài.
* Ưu điểm: thao tác nhanh, đơn giản, không cần kết nối DB.
* Nhược điểm: mất dữ liệu khi server tắt, không thích hợp cho dữ liệu quan trọng.

---

### 2. **Cách tạo biến lưu trữ tạm trong FastAPI**

* Ta thường dùng biến toàn cục (global variable) dạng:

```python
items = {}  # Dictionary lưu item theo key là id hoặc tên
# hoặc
items_list = []  # List lưu dữ liệu không có key cố định
```

* Biến này sẽ được truy cập và thay đổi trong các route API.

---

### 3. **Thao tác CRUD trên biến tạm**

* **Create (Thêm dữ liệu)**: thêm phần tử mới vào dict hoặc list.
* **Read (Đọc dữ liệu)**: truy xuất dữ liệu theo key hoặc duyệt toàn bộ list.
* **Update (Sửa dữ liệu)**: cập nhật giá trị theo key hoặc index.
* **Delete (Xóa dữ liệu)**: loại bỏ phần tử khỏi dict hoặc list.

---

### 4. **Ví dụ minh họa**

#### 4.1. Định nghĩa model `Item` với Pydantic:

```python
from pydantic import BaseModel

class Item(BaseModel):
    id: int
    name: str
    description: str = None
    price: float
```

> Mô tả: `Item` đại diện cho một sản phẩm, có các trường id, name, description và price.

#### 4.2. Tạo biến lưu trữ tạm:

```python
items = {}
```

#### 4.3. Tạo CRUD API với FastAPI sử dụng biến `items`

```python
from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.post("/items/")
def create_item(item: Item):
    if item.id in items:
        raise HTTPException(status_code=400, detail="Item ID đã tồn tại")
    items[item.id] = item
    return item

@app.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Không tìm thấy item")
    return items[item_id]

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Không tìm thấy item")
    items[item_id] = item
    return item

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Không tìm thấy item")
    del items[item_id]
    return {"detail": "Xóa thành công"}

@app.get("/items/")
def list_items():
    return list(items.values())
```

> Giải thích từng route:
>
> * `POST /items/`: Thêm mới item vào `items`.
> * `GET /items/{item_id}`: Lấy item theo id.
> * `PUT /items/{item_id}`: Cập nhật item theo id.
> * `DELETE /items/{item_id}`: Xóa item theo id.
> * `GET /items/`: Lấy danh sách tất cả item.

---

### 5. **Lưu ý quan trọng khi dùng lưu trữ tạm**

* Dữ liệu lưu trong biến `items` sẽ bị mất nếu server khởi động lại.
* Không sử dụng lưu trữ tạm để quản lý dữ liệu quan trọng hoặc lâu dài.
* Dữ liệu chỉ tồn tại trong một instance server. Khi có nhiều instance (ví dụ trong môi trường production có load balancing), dữ liệu không được chia sẻ.
* Thường chỉ dùng cho mục đích thử nghiệm, học tập, hoặc dữ liệu session tạm thời.

---

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài:

Xây dựng API quản lý danh sách công việc (ToDo List) sử dụng lưu trữ tạm trong bộ nhớ RAM với các yêu cầu:

* Mỗi công việc có `id` (int), `title` (str), `completed` (bool).
* Hỗ trợ các API:

  * Thêm công việc mới.
  * Lấy danh sách tất cả công việc.
  * Cập nhật trạng thái hoàn thành của công việc theo `id`.
  * Xóa công việc theo `id`.
* Nếu công việc không tồn tại khi cập nhật hoặc xóa, trả về lỗi 404.

---

### Lời giải chi tiết:

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class TodoItem(BaseModel):
    id: int
    title: str
    completed: bool = False

todos = {}

@app.post("/todos/")
def create_todo(todo: TodoItem):
    if todo.id in todos:
        raise HTTPException(status_code=400, detail="Todo ID đã tồn tại")
    todos[todo.id] = todo
    return todo

@app.get("/todos/")
def get_todos():
    return list(todos.values())

@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, completed: bool):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo không tồn tại")
    todos[todo_id].completed = completed
    return todos[todo_id]

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    if todo_id not in todos:
        raise HTTPException(status_code=404, detail="Todo không tồn tại")
    del todos[todo_id]
    return {"detail": "Xóa công việc thành công"}
```

---

### Phân tích từng bước:

* **Tạo model `TodoItem`** dùng Pydantic để định nghĩa cấu trúc dữ liệu.
* **Sử dụng dict `todos` để lưu trữ tạm dữ liệu**.
* **Route POST** thêm công việc mới, kiểm tra ID trùng.
* **Route GET** trả về danh sách toàn bộ công việc.
* **Route PUT** cập nhật trường `completed` của công việc.
* **Route DELETE** xóa công việc theo ID.
* **Xử lý lỗi bằng `HTTPException`** trả về status code phù hợp.

---

## 🔑 Những điểm quan trọng cần lưu ý

* **Biến lưu trữ tạm là biến toàn cục**, nên tránh dùng cho dữ liệu lớn, hoặc dữ liệu cần bền vững.
* Dữ liệu **không được chia sẻ tự động giữa nhiều instance server**.
* **Khi server khởi động lại, dữ liệu mất hết**, do đó không dùng để lưu trữ dữ liệu quan trọng.
* Đảm bảo **xử lý lỗi khi thao tác với dữ liệu không tồn tại** để API ổn định.
* Cần hiểu rõ **sự khác biệt giữa lưu trữ tạm và lưu trữ bền vững (DB)** để thiết kế API phù hợp.

---

## 📝 Bài tập về nhà

**Đề bài:**
Xây dựng một API lưu trữ tạm quản lý danh sách sinh viên với các trường:

* `student_id` (int)
* `name` (str)
* `grade` (float)

Yêu cầu:

* API thêm, sửa, xóa, lấy danh sách sinh viên.
* Khi sửa điểm (`grade`), kiểm tra điểm phải nằm trong khoảng từ 0 đến 10, nếu không trả về lỗi 400.
* Thực hiện xử lý lỗi khi `student_id` không tồn tại.

