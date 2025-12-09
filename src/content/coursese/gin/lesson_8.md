

# Bài 8: File Upload và Download với Gin Framework

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ cơ chế upload và download file trong Gin Framework.
* Biết cách xử lý single file upload và multiple files upload.
* Hiểu và áp dụng các kỹ thuật validate file (kiểu file, kích thước).
* Biết cách tạo API cho phép người dùng tải file về và stream file lớn hiệu quả.
* Nắm được cách tổ chức mã nguồn theo cấu trúc chuẩn trong dự án Gin.
* Có khả năng xây dựng API quản lý file đơn giản, thực tế.

## 📝 Nội dung chi tiết

### 1. Khái niệm về File Upload trong Web API

**File Upload** là quá trình gửi tập tin từ client (trình duyệt hoặc ứng dụng) lên server để lưu trữ hoặc xử lý. Trong HTTP, file upload thường sử dụng method POST hoặc PUT cùng với `multipart/form-data` encoding để gửi file.

* **multipart/form-data**: Là kiểu dữ liệu chuyên dùng để gửi file và các form field khác lên server.

* Trong Gin, ta sẽ dùng `Context.FormFile()` để lấy file từ request.

### 2. Khái niệm về File Download và Streaming

**File Download** là việc server gửi file cho client để client lưu trữ hoặc xử lý.

* Đối với file nhỏ, ta có thể đọc toàn bộ file và trả về.

* Đối với file lớn hoặc đa phương tiện, nên dùng kỹ thuật **streaming** để tránh tốn bộ nhớ.

* Gin hỗ trợ gửi file qua `Context.File()` hoặc `Context.FileAttachment()`.

### 3. Cấu trúc dự án theo chuẩn đề bài

```
├── cmd/
│   └── main.go         # Entry point ứng dụng
├── internal/
│   ├── handlers/
│   │   └── file.go     # Xử lý upload/download file
│   ├── models/         # (chưa dùng cho bài này)
├── go.mod
└── go.sum
```

### 4. Ví dụ thực tế với giải thích chi tiết

#### 4.1 Single File Upload

* Lấy file từ form field tên `"file"` qua `c.FormFile("file")`.
* Kiểm tra file có hợp lệ (vd: kích thước, định dạng).
* Lưu file vào thư mục tạm hoặc thư mục lưu trữ.
* Trả về response thông báo upload thành công.

#### 4.2 Multiple Files Upload

* Lấy danh sách file qua `c.MultipartForm()`.
* Lặp qua từng file, validate, lưu file.
* Trả về response danh sách các file đã upload.

#### 4.3 File Download

* Lấy tên file từ URL hoặc query param.
* Kiểm tra file tồn tại trên server.
* Dùng `c.File()` hoặc `c.FileAttachment()` để gửi file cho client.

### 5. Code mẫu đầy đủ theo cấu trúc chuẩn

#### 5.1 File `cmd/main.go`

```go
package main

import (
    "github.com/gin-gonic/gin"
    "myapp/internal/handlers"
)

func main() {
    r := gin.Default()

    fileGroup := r.Group("/file")
    {
        fileGroup.POST("/upload", handlers.UploadSingleFile)
        fileGroup.POST("/upload-multiple", handlers.UploadMultipleFiles)
        fileGroup.GET("/download/:filename", handlers.DownloadFile)
    }

    r.Run(":8080")
}
```

#### 5.2 File `internal/handlers/file.go`

```go
package handlers

import (
    "fmt"
    "net/http"
    "os"
    "path/filepath"
    "strings"

    "github.com/gin-gonic/gin"
)

const uploadDir = "./uploads"

// validateFileType kiểm tra loại file hợp lệ (ví dụ chỉ cho phép ảnh jpg, png, gif)
func validateFileType(filename string) bool {
    allowedExt := []string{".jpg", ".jpeg", ".png", ".gif", ".pdf", ".txt"}
    ext := strings.ToLower(filepath.Ext(filename))
    for _, allow := range allowedExt {
        if ext == allow {
            return true
        }
    }
    return false
}

// UploadSingleFile xử lý upload 1 file
func UploadSingleFile(c *gin.Context) {
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "File không được gửi lên hoặc bị lỗi"})
        return
    }

    // Validate kích thước (vd: không vượt quá 5MB)
    const maxFileSize = 5 << 20 // 5 MB
    if file.Size > maxFileSize {
        c.JSON(http.StatusBadRequest, gin.H{"error": "File quá lớn, tối đa 5MB"})
        return
    }

    // Validate loại file
    if !validateFileType(file.Filename) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Loại file không được phép"})
        return
    }

    // Tạo thư mục nếu chưa có
    if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
        os.MkdirAll(uploadDir, os.ModePerm)
    }

    // Lưu file
    dst := filepath.Join(uploadDir, filepath.Base(file.Filename))
    if err := c.SaveUploadedFile(file, dst); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Lưu file thất bại"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "Upload thành công",
        "filename": file.Filename,
        "size":     file.Size,
    })
}

// UploadMultipleFiles xử lý upload nhiều file
func UploadMultipleFiles(c *gin.Context) {
    form, err := c.MultipartForm()
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Không lấy được dữ liệu multipart"})
        return
    }

    files := form.File["files"] // form field "files"

    if len(files) == 0 {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Chưa chọn file để upload"})
        return
    }

    // Tạo thư mục nếu chưa có
    if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
        os.MkdirAll(uploadDir, os.ModePerm)
    }

    var uploaded []string
    for _, file := range files {
        if file.Size > (5 << 20) {
            c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("File %s quá lớn", file.Filename)})
            return
        }

        if !validateFileType(file.Filename) {
            c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("File %s loại không hợp lệ", file.Filename)})
            return
        }

        dst := filepath.Join(uploadDir, filepath.Base(file.Filename))
        if err := c.SaveUploadedFile(file, dst); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Lưu file %s thất bại", file.Filename)})
            return
        }
        uploaded = append(uploaded, file.Filename)
    }

    c.JSON(http.StatusOK, gin.H{
        "message":      "Upload nhiều file thành công",
        "filenames":    uploaded,
        "total_uploaded": len(uploaded),
    })
}

// DownloadFile xử lý download file theo filename
func DownloadFile(c *gin.Context) {
    filename := c.Param("filename")
    if filename == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Filename không được để trống"})
        return
    }

    filePath := filepath.Join(uploadDir, filename)
    if _, err := os.Stat(filePath); os.IsNotExist(err) {
        c.JSON(http.StatusNotFound, gin.H{"error": "File không tồn tại"})
        return
    }

    // Gửi file trực tiếp, client sẽ tự động tải
    c.FileAttachment(filePath, filename)
}
```

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài:

Xây dựng API quản lý file upload/download theo yêu cầu sau:

* Endpoint upload 1 file (single file).
* Endpoint upload nhiều file cùng lúc (multiple files).
* Endpoint liệt kê danh sách file đã upload.
* Endpoint download file theo tên file.
* Kiểm tra file upload phải là ảnh (jpg, png, gif) và kích thước tối đa 3MB.
* Lưu file trong thư mục `uploads`.
* Trả về JSON kết quả rõ ràng.

### Lời giải & phân tích từng bước:

#### 1. Tạo handler mới `ListFiles` để liệt kê file:

```go
func ListFiles(c *gin.Context) {
    files := []string{}

    if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
        c.JSON(http.StatusOK, gin.H{"files": files})
        return
    }

    err := filepath.Walk(uploadDir, func(path string, info os.FileInfo, err error) error {
        if !info.IsDir() {
            files = append(files, info.Name())
        }
        return nil
    })
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Không thể đọc thư mục files"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"files": files})
}
```

#### 2. Cập nhật `validateFileType` để chỉ cho phép ảnh jpg, png, gif

```go
func validateFileType(filename string) bool {
    allowedExt := []string{".jpg", ".jpeg", ".png", ".gif"}
    ext := strings.ToLower(filepath.Ext(filename))
    for _, allow := range allowedExt {
        if ext == allow {
            return true
        }
    }
    return false
}
```

#### 3. Giảm kích thước tối đa xuống 3MB

```go
const maxFileSize = 3 << 20 // 3MB
```

#### 4. Cập nhật `main.go` thêm route mới

```go
fileGroup.GET("/list", handlers.ListFiles)
```

#### 5. Toàn bộ đoạn code cho phần upload single file (rút gọn):

```go
func UploadSingleFile(c *gin.Context) {
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "File không được gửi lên hoặc bị lỗi"})
        return
    }

    if file.Size > maxFileSize {
        c.JSON(http.StatusBadRequest, gin.H{"error": "File quá lớn, tối đa 3MB"})
        return
    }

    if !validateFileType(file.Filename) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Chỉ cho phép file ảnh (jpg, png, gif)"})
        return
    }

    if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
        os.MkdirAll(uploadDir, os.ModePerm)
    }

    dst := filepath.Join(uploadDir, filepath.Base(file.Filename))
    if err := c.SaveUploadedFile(file, dst); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Lưu file thất bại"})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "message":  "Upload thành công",
        "filename": file.Filename,
        "size":     file.Size,
    })
}
```

### Phân tích:

* **Chia nhỏ logic:** Hàm nhỏ, dễ đọc, dễ bảo trì.
* **Validation kỹ:** Loại file và kích thước.
* **Tạo thư mục tự động:** Tránh lỗi khi chưa có thư mục.
* **Phản hồi JSON rõ ràng:** Giúp client xử lý dễ dàng.

## 🔑 Những điểm quan trọng cần lưu ý

* **Multipart/form-data:** Phải đảm bảo form gửi lên đúng kiểu `enctype="multipart/form-data"`.

* **Form field name phải trùng với tên gọi trong `c.FormFile("fieldname")` hoặc `form.File["fieldname"]`.**

* **Luôn validate file (kích thước, định dạng) để tránh lỗi và bảo mật.**

* **Thư mục lưu trữ phải có quyền ghi, nên tạo trước nếu chưa tồn tại.**

* **Khi download file, kiểm tra file tồn tại để tránh lỗi 500 hoặc rò rỉ dữ liệu.**

* **Tránh lưu file với tên gốc nếu chưa xử lý để tránh ghi đè hoặc tấn công (có thể thêm UUID hoặc timestamp để đặt tên file).**

* **Đối với file lớn, nên dùng streaming, tránh đọc toàn bộ file vào bộ nhớ.**

* **Kích thước tối đa upload phải đồng bộ với cấu hình server/nginx nếu có giới hạn.**

## 📝 Bài tập về nhà

### Đề bài:

* Xây dựng API upload ảnh profile user (chỉ 1 file) với các yêu cầu:

  * Chỉ cho phép file jpg, png.
  * Kích thước tối đa 2MB.
  * Lưu file vào thư mục `profile_pics`.
  * Đặt tên file lưu trên server theo format: `userID-timestamp.extension` (giả sử userID lấy từ query param).
  * Tạo endpoint lấy ảnh profile theo userID.
  * Trả về ảnh dưới dạng file download.
* Mô phỏng API client gửi request test (có thể dùng Postman).

