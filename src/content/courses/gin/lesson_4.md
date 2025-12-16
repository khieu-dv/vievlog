# 🎓 **BÀI 4: Request Binding và Validation**

## 🎯 **Mục tiêu bài học**


* Hiểu rõ **request binding** là gì 
* Biết cách sử dụng `c.ShouldBindJSON()`, `c.ShouldBindQuery()`, `c.ShouldBind()`
* Áp dụng được **struct tags** để thực hiện **validation** tự động.
* Tạo được **custom validation rules** đơn giản.
* Xử lý và trả về lỗi validation một cách chuyên nghiệp.

## 📝 **Nội dung chi tiết**

### 📌 **1. Request Binding là gì?**

**Request Binding** là quá trình ánh xạ dữ liệu từ HTTP request (body, form, query, path) vào một struct trong Go.


### 📌 **2. Các phương thức binding phổ biến trong Gin**

| Binding Type                  | Phương thức               | 
| ----------------------------- | ------------------------- | 
| JSON                          | `c.ShouldBindJSON(&obj)`  | 
| Form (x-[www](http://www)...) | `c.ShouldBind(&obj)`      | 
| Query                         | `c.ShouldBindQuery(&obj)` | 
| URI Params                    | `c.ShouldBindUri(&obj)`   | 

#### 🔹 **Ví dụ binding JSON**

```go
type RegisterRequest struct {
    Name  string `json:"name"`
    Email string `json:"email"`
}
```

### 📌 **3. Validation là gì và tại sao cần?**

**Validation** là quá trình kiểm tra dữ liệu đầu vào để đảm bảo chúng đúng định dạng và đáp ứng yêu cầu hệ thống.


#### 🔹 **Các tag phổ biến:**

* `required` – bắt buộc có
* `email` – định dạng email
* `min`, `max`, `len` – độ dài
* `gte`, `lte` – so sánh số
* `binding:"required,email"` – tag tổng hợp

## 🏆 **Bài tập thực hành**

### 📌 Đề bài:

Tạo API `POST /contact` cho người dùng gửi phản hồi với các thông tin:

* `name`: bắt buộc, ít nhất 2 ký tự
* `email`: bắt buộc, đúng định dạng
* `message`: bắt buộc, tối thiểu 10 ký tự

Sau khi người dùng gửi phản hồi, lưu trữ thông tin và cung cấp API `GET /contacts` để lấy danh sách phản hồi.


## 🔑 **Những điểm quan trọng cần lưu ý**

| Lưu ý                                          | Giải thích                                                              |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| `binding:"required"` không bind được `""`      | Chuỗi rỗng vẫn bị coi là thiếu dữ liệu                                  |
| `ShouldBindJSON()` yêu cầu đúng định dạng JSON | Nếu request sai format sẽ lỗi ngay                                      |
| Validation lỗi sẽ trả toàn bộ lỗi              | Có thể dùng `validator.ValidationErrors` để xử lý chi tiết từng lỗi     |
| Struct tag không hỗ trợ tự động trim           | Cần xử lý thủ công nếu muốn loại bỏ khoảng trắng đầu/cuối trong chuỗi   |
| Đặt tag đúng JSON + Binding                    | `json:"email" binding:"required,email"` => tránh lỗi mapping không đúng |

## 📝 **Bài tập về nhà**

### 📌 Đề bài:

Xây dựng API `POST /feedback` để người dùng gửi nhận xét sản phẩm với các yêu cầu:

* `username`: bắt buộc, từ 3-20 ký tự
* `product_id`: bắt buộc, kiểu số nguyên dương
* `comment`: bắt buộc, ít nhất 15 ký tự

Sau khi người dùng gửi nhận xét, lưu trữ thông tin và cung cấp API `GET /feedbacks` để lấy danh sách nhận xét.

**Gợi ý:**

* Tạo file `models/feedback.go`
* Xử lý binding và validation lỗi trong `handlers/feedback_handler.go`
* Tích hợp route trong `cmd/main.go`


