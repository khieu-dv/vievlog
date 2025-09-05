---
title: "Cơ Sở Dữ Liệu - Backend Interview Questions"
postId: "ftyc3cmoc2yhd5e"
category: "BackEnd Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Cơ Sở Dữ Liệu - Backend Interview Questions


## Câu 33: Chiến lược di chuyển cơ sở dữ liệu (Database Migration)?

**Di chuyển cơ sở dữ liệu là gì?** Là quá trình thay đổi cấu trúc cơ sở dữ liệu (schema) một cách an toàn.

**Các chiến lược chính:**
1. **Blue-green deployment:** Duy trì hai môi trường giống nhau, chuyển lưu lượng sau khi di chuyển thành công.
2. **Rolling updates:** Cập nhật từng node một để duy trì dịch vụ.
3. **Backward compatible schemas:** Thay đổi schema từng bước để tránh lỗi.
4. **Version control migrations:** Theo dõi thay đổi schema bằng file có phiên bản.
5. **Rollback plans:** Chuẩn bị kế hoạch khôi phục trạng thái trước nếu có lỗi.

**Thực tiễn tốt:**
- Thử nghiệm trên môi trường staging giống production.
- Sao lưu dữ liệu trước khi di chuyển.
- Theo dõi hiệu suất trong và sau di chuyển.
- Sử dụng giao dịch để đảm bảo tính nguyên tử.

\---

## Câu 34: Tại sao NULL đặc biệt trong SQL?

**NULL là gì?** Biểu thị giá trị "không biết" hoặc "thiếu".

**Đặc điểm:**
- **Không so sánh được:** `NULL = NULL` trả về FALSE, cần dùng `IS NULL`.
- **Logic ba giá trị:** Kết quả có thể là TRUE, FALSE hoặc UNKNOWN.
- **Hàm tổng hợp:** `COUNT`, `SUM`, `AVG` bỏ qua NULL.
- **Chỉ mục:** NULL có thể không được lập chỉ mục.

**Ví dụ:**
```sql
-- Sai
SELECT * FROM users WHERE email = NULL;

-- Đúng
SELECT * FROM users WHERE email IS NULL;

-- Xử lý NULL
SELECT COALESCE(name, 'Không biết') FROM users;
```

**Thực tiễn tốt:**
- Dùng `NOT NULL` khi có thể.
- Thay NULL bằng giá trị mặc định nếu phù hợp.
- Xử lý NULL rõ ràng trong mã ứng dụng.

\---

## Câu 35: Thuộc tính ACID là gì?

**ACID** là bốn thuộc tính đảm bảo giao dịch cơ sở dữ liệu đáng tin cậy:

1. **Atomicity (Nguyên tử):** Giao dịch hoặc hoàn tất toàn bộ, hoặc không thực hiện gì.
   - Ví dụ: Chuyển tiền, cả trừ và cộng tiền phải thành công.
2. **Consistency (Nhất quán):** Đảm bảo dữ liệu luôn hợp lệ trước và sau giao dịch.
   - Ví dụ: Khóa ngoại luôn được duy trì.
3. **Isolation (Cô lập):** Các giao dịch đồng thời không ảnh hưởng lẫn nhau.
   - Ví dụ: Hai người dùng cập nhật cùng bản ghi không gây xung đột.
4. **Durability (Bền vững):** Dữ liệu đã ghi sẽ tồn tại dù hệ thống lỗi.
   - Ví dụ: Dữ liệu vẫn an toàn sau khi server khởi động lại.

\---

## Câu 36: Quản lý di chuyển schema?

**Quản lý di chuyển schema** là đảm bảo thay đổi cấu trúc cơ sở dữ liệu an toàn và nhất quán.

**Nguyên tắc chính:**
- **Quản lý phiên bản:** Theo dõi thay đổi schema bằng hệ thống kiểm soát phiên bản.
- **Script Up/Down:** Mỗi di chuyển có script áp dụng và hoàn tác.
- **Công cụ tự động:** Sử dụng Flyway, Liquibase hoặc tính năng di chuyển của framework.
- **Kiểm tra:** Thử nghiệm di chuyển trên môi trường staging.

**Ví dụ:**
```sql
-- Thêm cột email
ALTER TABLE users ADD COLUMN email VARCHAR(255);

-- Hoàn tác
ALTER TABLE users DROP COLUMN email;
```

**Thực tiễn tốt:**
- Đảm bảo tương thích ngược.
- Thay đổi nhỏ, tập trung.
- Xem xét và giám sát thời gian thực hiện di chuyển.

\---

## Câu 37: Lazy Loading và nhược điểm?

**Lazy Loading là gì?** Chỉ tải dữ liệu khi cần, thay vì tải toàn bộ từ đầu.

**Ví dụ (ORM):**
```python
user = session.query(User).get(1)
for post in user.posts:  # Tải bài đăng khi truy cập
    print(post.title)
```

**Nhược điểm:**
1. **Vấn đề N+1:** Tải 1 danh sách + N truy vấn cho mỗi phần tử liên quan.
2. **Lỗi LazyInitialization:** Truy cập dữ liệu khi session đã đóng.
3. **Hiệu suất khó lường:** Truy vấn kích hoạt bất ngờ.

**Giải pháp:**
- **Eager loading:** Tải trước dữ liệu với `JOIN`.
- **Batch loading:** Tải nhiều quan hệ trong một truy vấn.
- **Tối ưu truy vấn:** Thêm chỉ mục, lập kế hoạch truy vấn.

\---

## Câu 38: Vấn đề N+1 và cách khắc phục?

**N+1 là gì?** Hiện tượng thực hiện 1 truy vấn cho danh sách chính và N truy vấn cho dữ liệu liên quan.

**Ví dụ:**
```sql
-- 1 truy vấn tải users
SELECT * FROM users;

-- N truy vấn tải posts
SELECT * FROM posts WHERE user_id = 1;
SELECT * FROM posts WHERE user_id = 2;
```

**Cách khắc phục:**
1. **Eager Loading với JOIN:**
   ```sql
   SELECT u.*, p.* FROM users u LEFT JOIN posts p ON u.id = p.user_id;
   ```
2. **Batch Loading:**
   ```sql
   SELECT * FROM posts WHERE user_id IN (1, 2, 3);
   ```
3. **ORM:**
   ```python
   # Django
   users = User.objects.select_related('posts')

   # SQLAlchemy
   users = session.query(User).options(joinedload(User.posts)).all()
   ```

**Phòng tránh:**
- Theo dõi truy vấn trong lúc phát triển.
- Dùng log truy vấn chậm.
- Kiểm tra code để phát hiện sớm.

\---

## Câu 39: Tìm truy vấn tốn kém (expensive queries)?

**Cách tìm:**
1. **Query Profiler:**
   ```sql
   -- PostgreSQL
   EXPLAIN ANALYZE SELECT * FROM orders WHERE date > '2023-01-01';
   ```
2. **Slow Query Log:**
   ```ini
   # MySQL
   slow_query_log = 1
   long_query_time = 2
   ```
3. **Execution Plans:**
   ```sql
   EXPLAIN SELECT * FROM orders JOIN customers ON orders.customer_id = customers.id;
   ```

**Công cụ ứng dụng:**
- **APM Tools:** New Relic, DataDog.
- **Thống kê cơ sở dữ liệu:**
  ```sql
  -- PostgreSQL
  SELECT * FROM pg_stat_user_tables WHERE relname = 'orders';
  ```

**Chỉ số cần theo dõi:**
- Thời gian thực thi.
- Sử dụng CPU, I/O.
- Thời gian chờ khóa.

**Tối ưu:**
- Thêm chỉ mục.
- Viết lại truy vấn.
- Phân vùng bảng lớn.

\---

## Câu 40: Khi nào cần chuẩn hóa cơ sở dữ liệu (Normalization)?

**Chuẩn hóa là gì?** Tổ chức dữ liệu để giảm dư thừa và đảm bảo tính toàn vẹn.

**Khi cần chuẩn hóa:**
- **Hệ thống OLTP:** Nhiều thao tác ghi (INSERT, UPDATE, DELETE).
- **Tính toàn vẹn quan trọng:** Ngân hàng, thương mại điện tử.
- **Tối ưu lưu trữ:** Giảm dữ liệu dư thừa.

**Ví dụ chuẩn hóa:**
```sql
CREATE TABLE customers (id INT PRIMARY KEY, name VARCHAR(100));
CREATE TABLE orders (id INT PRIMARY KEY, customer_id INT, FOREIGN KEY (customer_id) REFERENCES customers(id));
```

**Khi không cần (Denormalization):**
- **Hệ thống OLAP:** Nhiều truy vấn đọc (báo cáo, phân tích).
- **Hiệu suất ưu tiên:** Giảm JOIN để truy vấn nhanh.

**Ví dụ không chuẩn hóa:**
```sql
CREATE TABLE order_summary (order_id INT, customer_name VARCHAR(100), total_amount DECIMAL);
```

**Dạng chuẩn hóa:**
- **1NF:** Giá trị nguyên tử, không lặp nhóm.
- **2NF:** Không phụ thuộc một phần.
- **3NF:** Không phụ thuộc bắc cầu.

**Quyết định:**
- **OLTP:** Chuẩn hóa để đảm bảo toàn vẹn.
- **OLAP:** Không chuẩn hóa để tăng tốc độ đọc.


---

*Post ID: ftyc3cmoc2yhd5e*  
*Category: BackEnd Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*
