
# 🎓 BÀI 1: Redis CRUD với Node.js và Express.js

## 🎯 Mục tiêu bài học

✅ Hiểu được Redis là gì  
✅ Biết cách cài đặt và chạy Redis bằng Docker Compose  
✅ Biết cách kết nối Express.js với Redis  
✅ Tự xây dựng một RESTful API đơn giản dùng Redis làm data store  



## 📝 Nội dung chi tiết

### 1. Giới thiệu về Redis

**Redis là gì?**
Redis (REmote DIctionary Server) là một **in-memory key-value database**  

👉 Đặc điểm:
* Lưu trữ dữ liệu trong RAM → tốc độ cực nhanh
* Có thể lưu key-value dạng string, list, hash, set, v.v.



### 2. Setup môi trường phát triển

**Yêu cầu:**

* Node.js (>= v16)
* Docker + Docker Compose
* Visual Studio Code



### 3. Khởi tạo project Express.js

```bash
mkdir redis-crud-express && cd redis-crud-express
npm init -y
npm install express redis dotenv cors
npm install --save-dev nodemon
```

**Cấu trúc thư mục:**

```
redis-crud-express/
├── docker-compose.yml
├── .env
├── app.js
└── routes/
    └── users.js
```


### 4. Setup Redis với Docker Compose

**File `docker-compose.yml`:**

```yaml
version: '3.8'
services:
  redis:
    image: redis:7
    container_name: redis_server
    command: redis-server --requirepass mypass
    ports:
      - "6379:6379"
    volumes:
      - ./redis_data:/data
```

**Chạy Redis và Redis Insight:**

```bash
docker-compose up -d
```



## 🔑 Những điểm quan trọng cần lưu ý

| ⚠️ Vấn đề                                                      | 
| -------------------------------------------------------------- | 
| Redis chỉ lưu trữ dạng string                                  | 
| Redis không có schema                                          | 
| Redis không lưu vĩnh viễn nếu không cấu hình                   | 


## 📝 Bài tập về nhà

### Đề bài:

**Xây dựng REST API tạo danh sách sản phẩm bằng Redis, với các trường: `id`, `name`, `price`**

Thực hiện:

* POST /products
* GET /products/\:id
* PUT /products/\:id
* DELETE /products/\:id


