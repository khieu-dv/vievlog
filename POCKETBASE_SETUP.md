# Cài đặt PocketBase Collection cho Comment System

## 1. Tạo Collection `doc_comments_tbl`

Truy cập PocketBase Admin Panel tại: `https://pocketbase.vietopik.com/_/`

### Schema Fields:

```sql
CREATE TABLE doc_comments_tbl (
  id TEXT PRIMARY KEY,
  doc_path TEXT NOT NULL,      -- Đường dẫn docs (vd: "soft-skills/rust/bai-1")
  content TEXT NOT NULL,       -- Nội dung comment
  author_id TEXT NOT NULL,     -- ID người dùng từ users_tbl
  author_name TEXT NOT NULL,   -- Tên hiển thị
  created DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Collection Settings:

1. **Name**: `doc_comments_tbl`
2. **Type**: Base collection
3. **Fields**:
   - `doc_path` (Plain text, Required)
   - `content` (Plain text, Required, Min: 1, Max: 2000)
   - `author_id` (Plain text, Required)
   - `author_name` (Plain text, Required)

### API Rules:

#### List/Search Rule:
```javascript
// Cho phép mọi người xem comments
@request.auth.id != ""
```

#### View Rule:
```javascript
// Cho phép mọi người xem comment detail
@request.auth.id != ""
```

#### Create Rule:
```javascript
// Chỉ user đăng nhập mới tạo được comment
@request.auth.id != "" && @request.auth.id = @request.data.author_id
```

#### Update Rule:
```javascript
// Chỉ author mới sửa được comment của mình
@request.auth.id != "" && @request.auth.id = author_id
```

#### Delete Rule:
```javascript
// Chỉ author mới xóa được comment của mình
@request.auth.id != "" && @request.auth.id = author_id
```

## 2. Index để tối ưu performance

Tạo index cho field `doc_path` để tăng tốc query:

```sql
CREATE INDEX idx_doc_comments_doc_path ON doc_comments_tbl(doc_path);
CREATE INDEX idx_doc_comments_created ON doc_comments_tbl(created);
```

## 3. Test Collection

Sau khi setup xong, test bằng cách:

1. Truy cập một docs page có comment section
2. Đăng nhập và thử post comment
3. Kiểm tra database có lưu đúng không
4. Test xóa comment (chỉ author mới xóa được)

## 4. Troubleshooting

### Lỗi thường gặp:

1. **401 Unauthorized**: Kiểm tra API rules và authentication
2. **400 Bad Request**: Kiểm tra required fields và validation
3. **403 Forbidden**: Kiểm tra quyền user trong API rules

### Debug:

- Check PocketBase logs trong Admin Panel
- Verify collection schema và API rules
- Test API endpoints với Postman/curl trước