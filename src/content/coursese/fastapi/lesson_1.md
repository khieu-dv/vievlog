

# Bài 1: Giới thiệu FastAPI và môi trường làm việc

## 🎯 Mục tiêu bài học


* Hiểu được **FastAPI là gì**
* Nắm được cách **cài đặt Python và uv**
* Biết cách cài đặt và sử dụng công cụ **`uv`** 
* Tạo thành công ứng dụng FastAPI đầu tiên

## 📝 Nội dung chi tiết

### 1. FastAPI là gì?

* **FastAPI** là một framework web hiện đại, nhanh và mạnh mẽ viết bằng Python, giúp xây dựng API dễ dàng và hiệu quả.
* Đặc điểm nổi bật:
  * **Hiệu suất cao**:
  * **Dễ dàng sử dụng**: 
  * **Tự động sinh tài liệu API**: 
  * **Hỗ trợ validation dữ liệu mạnh mẽ**: 

### 2. Cài đặt Python và UV

### 2.1 Cài đặt Python

* **Python**: Ngôn ngữ lập trình dùng để chạy FastAPI. Phiên bản nên dùng từ 3.7 trở lên vì FastAPI tận dụng async/await.

*Hướng dẫn cài đặt*:

* Trên Windows/Mac/Linux, tải Python từ trang chính thức: [https://www.python.org/downloads/](https://www.python.org/downloads/)

```bash
python --version
```

### 2.2 Cài đặt  UV

`uv` là một công cụ mới do Astral phát triển, giúp:

✅ Quản lý **môi trường ảo**
✅ Cài đặt & chạy **thư viện** cực nhanh (gấp 10–100 lần `pip`)
✅ Tạo và khóa dependencies (`lockfile`) giống `poetry`
✅ Chạy **scripts và tools** như `pipx`, `pyenv`, `twine`, `virtualenv`
✅ Quản lý nhiều phiên bản Python

#### 🎯 Mục tiêu: Dùng `uv` để thay thế toàn bộ quy trình cài FastAPI như sau:

| Truyền thống (`pip`)          | Với `uv` (đơn giản hơn và nhanh hơn) |
| ----------------------------- | ------------------------------------ |
| `python3 -m venv env`         | `uv venv`                            |
| `source env/bin/activate`     | Không cần - `uv run` dùng đúng env   |
| `pip install fastapi uvicorn` | `uv add fastapi uvicorn`             |
| `python main.py`              | `uv run main.py`                     |

> ✅ Không cần `source env/bin/activate`
> ✅ Tự dùng đúng môi trường
> ✅ Nhanh hơn nhiều lần so với `pip` + `uvicorn`

### 🧰 Cài đặt `uv` (chạy 1 lần duy nhất)

#### Trên macOS hoặc Linux:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

> Sau đó thêm dòng sau vào `.bashrc`, `.zshrc` nếu chưa tự động:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### Kiểm tra:

```bash
uv --version
```

### 🛠️ Một số lệnh hữu ích với `uv`

| Tác vụ                        | Lệnh `uv`             |
| ----------------------------- | --------------------- |
| Khởi tạo project mới          | `uv init .`           |
| Thêm thư viện                 | `uv add <package>`    |
| Chạy lệnh trong môi trường ảo | `uv run <lệnh>`       |
| Tạo môi trường ảo             | `uv venv`             |
| Khóa phiên bản (lockfile)     | `uv lock`             |
| Đồng bộ các dependencies      | `uv sync`             |
| Gỡ thư viện                   | `uv remove <package>` |



## 🏆 Bài tập thực hành

### Đề bài:

Tạo một ứng dụng FastAPI đơn giản có route `/welcome` trả về JSON chứa thông điệp `"welcome to FastAPI course!"`.

**Yêu cầu:**

* Tạo môi trường ảo
* Cài đặt FastAPI và uv
* Tạo file `main.py` với route `/welcome`
* Chạy ứng dụng và kiểm tra kết quả trên trình duyệt

## 📝 Bài tập về nhà

* Tự tạo ứng dụng FastAPI mới với các route sau:

  1. `/hello` trả về `{"msg": "Hello World!"}`
  2. `/goodbye` trả về `{"msg": "Goodbye from FastAPI!"}`

## Gợi ý

####  Khởi tạo project mới

```bash
mkdir fastapi-example
cd fastapi-example
uv init .
```

####  Thêm thư viện FastAPI và Uvicorn

```bash
uv add fastapi uvicorn
```
#### Chạy ứng dụng FastAPI

```bash
uv run -- uvicorn main:app --reload
```



