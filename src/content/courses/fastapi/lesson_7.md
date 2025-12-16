
# Bài 7: Validation nâng cao với Pydantic

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ có khả năng:

* Hiểu rõ các kiểu dữ liệu nâng cao trong Pydantic như `constr`, `conint`, `confloat`,... để tùy chỉnh validation.
* Biết cách sử dụng `Field` để bổ sung mô tả, giá trị mặc định, giới hạn chiều dài, giới hạn giá trị, regex,...
* Tự định nghĩa validation tùy chỉnh đơn giản với decorator `@validator`.
* Thực hành xử lý lỗi validation khi nhận dữ liệu đầu vào trong FastAPI.
* Áp dụng validation nâng cao vào các mô hình dữ liệu thực tế để tăng tính an toàn và chính xác cho API.

---

## 📝 Nội dung chi tiết

### 1. Giới thiệu về Validation nâng cao trong Pydantic

Trong các bài trước, chúng ta đã biết cách tạo model với kiểu dữ liệu cơ bản như `str`, `int`, `float`, `bool`. Tuy nhiên, trong thực tế, dữ liệu đầu vào cần được kiểm soát chặt chẽ hơn: ví dụ tên phải có độ dài tối thiểu và tối đa, số tuổi phải nằm trong khoảng cho phép, email phải đúng định dạng, giá tiền phải là số dương,...

Pydantic cung cấp các kiểu dữ liệu mở rộng giúp bạn dễ dàng khai báo những ràng buộc này một cách trực quan và hiệu quả.

---

### 2. Các kiểu dữ liệu nâng cao: `constr`, `conint`, `confloat`, `conlist`...

* `constr`: chuỗi có thể giới hạn độ dài, regex, strip space,...
* `conint`: số nguyên có thể giới hạn min, max, gt, lt,...
* `confloat`: số thực với các giới hạn tương tự
* `conlist`: danh sách với số phần tử tối thiểu, tối đa,...

**Ví dụ:**

```python
from pydantic import BaseModel, constr, conint

class User(BaseModel):
    username: constr(min_length=3, max_length=20)  # Chuỗi từ 3-20 ký tự
    age: conint(ge=18, le=100)  # Số nguyên từ 18 đến 100 (inclusive)
```

Giải thích:

* `min_length=3, max_length=20`: username phải có ít nhất 3 ký tự, không quá 20 ký tự.
* `ge=18, le=100`: age phải lớn hơn hoặc bằng 18, nhỏ hơn hoặc bằng 100.

---

### 3. Sử dụng `Field` để tùy chỉnh thêm cho các trường dữ liệu

`Field` giúp bạn khai báo:

* Giá trị mặc định
* Mô tả (description) cho tài liệu OpenAPI
* Giới hạn giá trị (ví dụ: gt, lt)
* Ví dụ mẫu (example)
* Và nhiều tuỳ chỉnh khác

**Ví dụ:**

```python
from pydantic import BaseModel, Field

class Product(BaseModel):
    name: str = Field(..., min_length=2, max_length=50, description="Tên sản phẩm")
    price: float = Field(..., gt=0, description="Giá sản phẩm phải lớn hơn 0")
    description: str = Field(None, max_length=300, description="Mô tả sản phẩm (tùy chọn)")
```

Giải thích:

* `...` trong `Field(...)` nghĩa là bắt buộc phải có trường này.
* `gt=0` là giới hạn `greater than 0` (lớn hơn 0).
* `description` giúp sinh tài liệu API đẹp hơn, hỗ trợ auto docs của FastAPI.

---

### 4. Tạo Validation tùy chỉnh với `@validator`

Ngoài những ràng buộc sẵn có, bạn có thể tự viết hàm kiểm tra phức tạp hơn.

**Ví dụ:** Kiểm tra tên không chứa ký tự số

```python
from pydantic import BaseModel, validator

class User(BaseModel):
    username: str

    @validator('username')
    def username_no_digits(cls, v):
        if any(char.isdigit() for char in v):
            raise ValueError('Username không được chứa số')
        return v
```

Giải thích:

* Hàm `username_no_digits` chạy tự động khi `username` được khởi tạo.
* Nếu có số trong tên, sẽ báo lỗi validation.

---

### 5. Thực hành validation trong FastAPI

FastAPI tự động sử dụng model Pydantic để validate dữ liệu đầu vào.

**Ví dụ:**

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field, conint

app = FastAPI()

class Item(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    price: float = Field(..., gt=0)
    quantity: conint(ge=1)  # Số nguyên >= 1

@app.post("/items/")
async def create_item(item: Item):
    return {"message": "Item hợp lệ", "item": item}
```

Nếu client gửi dữ liệu không hợp lệ, FastAPI sẽ trả về lỗi 422 cùng thông tin chi tiết về lỗi.

---

### 6. Xử lý lỗi validation và trải nghiệm người dùng

Bạn có thể thử gửi:

* `name` quá ngắn: `"a"`
* `price` bằng 0 hoặc âm
* `quantity` là 0 hoặc số âm

Kết quả trả về sẽ cho biết trường nào sai và lý do rõ ràng. Đây là điểm mạnh giúp API của bạn an toàn và dễ debug.

---

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài

Tạo một API nhận thông tin đăng ký tài khoản người dùng với các yêu cầu:

* `username`: chuỗi từ 4 đến 20 ký tự, không chứa số.
* `email`: phải đúng định dạng email.
* `age`: số nguyên từ 18 đến 80.
* `password`: chuỗi tối thiểu 8 ký tự, chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số.

Yêu cầu:

* Sử dụng Pydantic để validate đầu vào.
* Trả về thông báo hợp lệ hoặc lỗi cụ thể.

---

### Lời giải chi tiết

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field, EmailStr, validator, conint
import re

app = FastAPI()

class UserRegister(BaseModel):
    username: str = Field(..., min_length=4, max_length=20)
    email: EmailStr
    age: conint(ge=18, le=80)
    password: str = Field(..., min_length=8)

    @validator('username')
    def username_no_digits(cls, v):
        if any(char.isdigit() for char in v):
            raise ValueError('Username không được chứa số')
        return v

    @validator('password')
    def password_strength(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password phải có ít nhất 1 chữ hoa')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password phải có ít nhất 1 chữ thường')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password phải có ít nhất 1 số')
        return v

@app.post("/register/")
async def register_user(user: UserRegister):
    return {"message": "Đăng ký thành công", "user": user}
```

**Phân tích:**

* `EmailStr`: kiểu dữ liệu Pydantic chuyên dùng để validate email.
* `conint(ge=18, le=80)`: tuổi từ 18 đến 80.
* Validator kiểm tra `username` không chứa số.
* Validator kiểm tra `password` có đủ yêu cầu về ký tự.
* Khi gửi dữ liệu không hợp lệ, FastAPI trả về lỗi chi tiết.

---

## 🔑 Những điểm quan trọng cần lưu ý

* Pydantic có sẵn các kiểu dữ liệu nâng cao rất tiện lợi để validate nhanh mà không cần viết nhiều code.
* `Field` giúp khai báo mô tả, giá trị mặc định và giới hạn rất hữu ích, đặc biệt khi dùng FastAPI auto tạo docs.
* `@validator` giúp kiểm tra các điều kiện phức tạp hơn mà kiểu dữ liệu không thể xử lý.
* Validation không chỉ giúp an toàn dữ liệu mà còn tạo trải nghiệm API rõ ràng, thân thiện cho người dùng.
* Khi validation lỗi, FastAPI trả về lỗi 422 và thông tin chi tiết, bạn có thể tận dụng để debug hoặc hướng dẫn người dùng sửa.
* Luôn kiểm tra kỹ dữ liệu đầu vào để tránh lỗi hoặc dữ liệu sai ảnh hưởng hệ thống.

---

## 📝 Bài tập về nhà

**Đề bài:**

Xây dựng một model `BlogPost` với các trường:

* `title`: chuỗi tối thiểu 10 ký tự.
* `content`: chuỗi tối thiểu 50 ký tự.
* `tags`: danh sách chuỗi, mỗi tag tối đa 15 ký tự, danh sách tối đa 5 tags.
* `published`: kiểu boolean, mặc định False.
* `rating`: số thực từ 0.0 đến 5.0, có thể là null (None).

Yêu cầu:

* Sử dụng các kiểu dữ liệu nâng cao và `Field` để khai báo.
* Tạo API POST nhận dữ liệu BlogPost và trả về dữ liệu đã nhận.
* Kiểm tra lỗi khi gửi dữ liệu không hợp lệ.


