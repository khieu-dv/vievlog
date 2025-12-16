

# 🎓 **Bài 1: Giới thiệu về Supabase và Backend-as-a-Service**


## 🎯 Mục tiêu bài học


* Hiểu rõ khái niệm **Backend-as-a-Service (BaaS)** 
* Nắm được **Supabase là gì**
* Biết cách **cài đặt Supabase trên máy tính cá nhân bằng Docker**.



## 📝 Nội dung chi tiết

### 🔹 1. Backend-as-a-Service (BaaS) là gì?

**BaaS** là mô hình cung cấp dịch vụ backend sẵn sàng qua Internet.

💡 Ví dụ:
Thay vì tự cài đặt database, viết API đăng ký user, bạn chỉ cần:

* Cấu hình bảng `users` trong Supabase
* Gọi API có sẵn qua Postman hoặc frontend

### 🔹 2. Supabase là gì?

Supabase là một **nền tảng BaaS mã nguồn mở** được xây dựng trên cơ sở **PostgreSQL**, cung cấp:

* Cơ sở dữ liệu quan hệ (PostgreSQL)
* API tự động sinh ra (RESTful)
* Authentication
* Storage (quản lý file)
* Realtime updates


### 🔹 3. So sánh Supabase với Firebase và các nền tảng BaaS khác

| Tiêu chí       | Supabase            | Firebase      | AWS Amplify    |
| -------------- | ------------------- | ------------- | -------------- |
| Mã nguồn       | ✅ Open-source       | ❌ Proprietary | ❌ Proprietary  |
| Database       | PostgreSQL          | Firestore     | DynamoDB       |
| Realtime       | ✅ Có                | ✅ Có          | ✅ Có           |
| Hosting riêng  | ✅ Tự host được      | ❌ Không thể   | ✅ Có thể       |
| Học dễ cho dev | ✅ PostgreSQL dễ học | ❌ Query riêng | ❌ Khá phức tạp |

### 🔹 4. Kiến trúc tổng quan của Supabase

```
┌────────────┐        ┌───────────────┐        ┌──────────────┐
│ Client App │──────▶│ Supabase API  │──────▶│ PostgreSQL DB │
└────────────┘        └───────────────┘        └──────────────┘

```

### 🔹 5. Supabase có gì nổi bật?

* **API tự sinh**: 
* **Realtime**: 
* **PostgreSQL gốc**: 

## 💻 Thực hành: Tạo bảng `users` và test API với Postman

### 🔧 Bước 1: Cài đặt Supabase bằng Docker


```bash
git clone https://github.com/supabase/supabase.git
cd supabase/docker
docker compose up
```

Đợi vài phút và truy cập:
👉 [http://localhost:8000](http://localhost:8000)
(Supabase Studio UI)



### 🔧 Bước 2: Tạo bảng `users`

Vào **Supabase Studio > Table Editor > New Table**
Thông tin bảng:

| Column      | Type      | Options               |
| ----------- | --------- | --------------------- |
| id          | uuid      | Primary key, auto-gen |
| email       | text      | Unique, not null      |
| name        | text      |                       |
| created\_at | timestamp | Default: now()        |

### 🔧 Bước 3: Test API `users` bằng Postman

🔑 API URL:

```
http://localhost:8000/rest/v1/users
```


✅ **Cách tạo policy:**


```sql
-- Cho phép SELECT tất cả dữ liệu cho mọi người
create policy "Allow all select"
on users
for select
using (true);
```

## 🔑 Những điểm quan trọng cần lưu ý

| Mục tiêu              | Lưu ý                                      |
| --------------------- | ------------------------------------------ |
| Supabase là gì        | Là BaaS mã nguồn mở, dùng PostgreSQL       |
| API hoạt động thế nào | Mỗi bảng tự sinh RESTful API               |
| Không quên API Key    | Mỗi request cần `apikey` + `Authorization` |
| Lưu ý UUID            | Trường `id` thường dùng UUID auto-gen      |
| Docker                | Supabase có thể cài cục bộ hoặc dùng cloud |



## 📝 Bài tập về nhà

### 🧠 Đề bài:

**Tạo bảng `products`** với các cột sau:

| Column      | Type      | Ghi chú                |
| ----------- | --------- | ---------------------- |
| id          | uuid      | Primary key, auto-gen  |
| name        | text      | Tên sản phẩm, not null |
| price       | numeric   | Giá, not null          |
| created\_at | timestamp | Default: now()         |

**Yêu cầu:**

1. Dùng Table Editor để tạo bảng `products`.
2. Sử dụng Postman để:

   * Lấy danh sách sản phẩm

**Gợi ý:**

* Header API như phần thực hành
* Kiểm tra JSON trả về trong Postman


