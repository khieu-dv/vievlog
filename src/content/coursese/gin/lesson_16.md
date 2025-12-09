

# Bài 16: Background Jobs và Message Queues

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ khái niệm **background jobs** (tác vụ nền) và **message queues** (hàng đợi tin nhắn).
* Biết cách tích hợp xử lý tác vụ nền vào ứng dụng Gin.
* Nắm được cách sử dụng Redis làm message queue đơn giản.
* Tạo và chạy worker xử lý các job bất đồng bộ.
* Áp dụng scheduling (lập lịch) cho các tác vụ định kỳ.
* Hiểu cách xử lý lỗi và retry trong background job.

## 📝 Nội dung chi tiết

### 1. Giới thiệu Background Jobs và Message Queues

* **Background Jobs (Tác vụ nền)** là các công việc không cần thực hiện ngay lập tức trong luồng chính (main thread) của ứng dụng web, ví dụ: gửi email, xử lý file lớn, tạo báo cáo... giúp tăng hiệu năng và trải nghiệm người dùng.
* **Message Queue (Hàng đợi tin nhắn)** là một hệ thống trung gian để lưu trữ và truyền tải các tin nhắn hoặc tác vụ cần xử lý, giúp tách biệt giữa phần tạo job và phần xử lý job.
* Ví dụ phổ biến: RabbitMQ, Redis, Kafka, AWS SQS... Ở bài này ta dùng Redis vì đơn giản, phổ biến và dễ cài đặt.

### 2. Cách hoạt động của Background Job với Message Queue

* Ứng dụng Gin nhận yêu cầu => tạo job => đẩy job vào queue (Redis list).
* Worker (chạy độc lập) lấy job từ queue => xử lý (gửi email, xử lý ảnh...) => trả kết quả hoặc retry nếu lỗi.
* Khi job hoàn thành, worker xóa job khỏi queue.

### 3. Công cụ sử dụng trong bài

* **Gin**: Framework web.
* **Redis**: Message queue backend.
* **go-redis/redis/v8**: Thư viện client Redis cho Golang.
* **cron/v3**: Để lập lịch các tác vụ định kỳ.

### 4. Thiết kế cấu trúc dự án mẫu

```
project/
├── cmd/
│   └── main.go               # Khởi tạo server Gin và worker
├── internal/
│   ├── handlers/
│   │   └── job_handler.go    # API tạo job
│   ├── jobs/
│   │   └── worker.go         # Worker xử lý job
│   ├── models/
│   │   └── job.go            # Định nghĩa cấu trúc job
│   └── redis_client.go       # Kết nối Redis
├── go.mod
└── go.sum
```

### 5. Cài đặt Redis Client

**File:** `internal/redis_client.go`

```go
package internal

import (
    "context"
    "github.com/go-redis/redis/v8"
    "log"
)

var (
    RedisClient *redis.Client
    Ctx = context.Background()
)

func InitRedis() {
    RedisClient = redis.NewClient(&redis.Options{
        Addr: "localhost:6379",
        Password: "", // nếu có mật khẩu Redis thì điền ở đây
        DB: 0,
    })

    if err := RedisClient.Ping(Ctx).Err(); err != nil {
        log.Fatalf("Không thể kết nối Redis: %v", err)
    }
}
```

### 6. Định nghĩa Job Model

**File:** `internal/models/job.go`

```go
package models

import "time"

type EmailJob struct {
    To      string    `json:"to"`
    Subject string    `json:"subject"`
    Body    string    `json:"body"`
    Created time.Time `json:"created"`
}
```

### 7. API tạo Background Job

**File:** `internal/handlers/job_handler.go`

```go
package handlers

import (
    "encoding/json"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "project/internal/models"
    "project/internal"
)

const JobQueueKey = "email_jobs"

func EnqueueEmailJob(c *gin.Context) {
    var job models.EmailJob
    if err := c.ShouldBindJSON(&job); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    job.Created = time.Now()

    // Serialize job thành JSON
    data, err := json.Marshal(job)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi xử lý job"})
        return
    }

    // Đẩy job vào Redis list (queue)
    err = internal.RedisClient.LPush(internal.Ctx, JobQueueKey, data).Err()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Lỗi khi đưa job vào queue"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Job đã được đưa vào hàng đợi"})
}
```

### 8. Worker lấy và xử lý Job

**File:** `internal/jobs/worker.go`

```go
package jobs

import (
    "encoding/json"
    "log"
    "time"

    "project/internal"
    "project/internal/models"
)

const JobQueueKey = "email_jobs"

// Giả lập hàm gửi email
func sendEmail(job models.EmailJob) error {
    log.Printf("Gửi email tới %s với chủ đề %s\n", job.To, job.Subject)
    time.Sleep(2 * time.Second) // giả lập delay gửi mail
    log.Println("Email gửi thành công")
    return nil
}

func StartWorker() {
    log.Println("Worker bắt đầu chạy...")

    for {
        // BLPop: block pop (chờ lấy job từ queue)
        result, err := internal.RedisClient.BRPop(internal.Ctx, 0, JobQueueKey).Result()
        if err != nil {
            log.Printf("Lỗi khi lấy job từ queue: %v", err)
            continue
        }

        if len(result) < 2 {
            continue
        }

        data := result[1]

        var job models.EmailJob
        if err := json.Unmarshal([]byte(data), &job); err != nil {
            log.Printf("Lỗi khi parse job JSON: %v", err)
            continue
        }

        // Xử lý job (gửi email)
        err = sendEmail(job)
        if err != nil {
            log.Printf("Gửi email thất bại: %v", err)
            // TODO: retry hoặc lưu log lỗi để xử lý sau
        }
    }
}
```

### 9. Tạo job scheduler (ví dụ job định kỳ)

**File:** `internal/jobs/scheduler.go`

```go
package jobs

import (
    "log"
    "time"

    "github.com/robfig/cron/v3"
    "project/internal"
    "project/internal/models"
    "encoding/json"
)

func StartScheduler() {
    c := cron.New()
    // Định nghĩa job chạy mỗi phút
    c.AddFunc("@every 1m", func() {
        log.Println("Job định kỳ chạy: Tạo email nhắc nhở")
        job := models.EmailJob{
            To:      "user@example.com",
            Subject: "Nhắc nhở định kỳ",
            Body:    "Đây là email nhắc nhở gửi định kỳ mỗi phút.",
            Created: time.Now(),
        }
        data, _ := json.Marshal(job)
        internal.RedisClient.LPush(internal.Ctx, "email_jobs", data)
    })
    c.Start()
}
```

### 10. Khởi động server và worker trong `cmd/main.go`

```go
package main

import (
    "log"
    "project/internal"
    "project/internal/handlers"
    "project/internal/jobs"

    "github.com/gin-gonic/gin"
)

func main() {
    // Khởi tạo Redis
    internal.InitRedis()

    // Start worker xử lý job nền
    go jobs.StartWorker()

    // Start scheduler chạy job định kỳ
    go jobs.StartScheduler()

    // Khởi tạo Gin server
    r := gin.Default()

    r.POST("/enqueue-email", handlers.EnqueueEmailJob)

    log.Println("Server chạy tại http://localhost:8080")
    r.Run(":8080")
}
```

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài

Xây dựng một API gửi thông báo SMS giả lập với các yêu cầu:

* Tạo endpoint `/enqueue-sms` nhận payload JSON với các trường: `phone` (số điện thoại), `message` (nội dung SMS).
* Đưa job SMS vào Redis queue.
* Viết worker xử lý queue, giả lập gửi SMS (in log).
* Worker có cơ chế retry tối đa 3 lần nếu thất bại.
* Scheduler chạy mỗi 5 phút tự động tạo một SMS gửi đến số điện thoại cố định (ví dụ: `+84912345678`) với nội dung "Thông báo định kỳ".

### Lời giải tóm tắt

* Tạo model `SMSJob` tương tự `EmailJob`.
* API `EnqueueSMSJob` dùng `LPush` đẩy job.
* Worker `StartSMSWorker` dùng `BRPop` lấy job, gửi, nếu lỗi tăng count retry (có thể lưu retry count trong job hoặc Redis) và retry tối đa 3 lần.
* Scheduler `StartSMSScheduler` dùng `cron` tạo SMS định kỳ.

### Phân tích từng bước

* Bước 1: Tạo struct SMSJob với `Phone`, `Message`, `Retries` (int).
* Bước 2: Viết API nhận JSON, validate, marshal, push vào Redis.
* Bước 3: Worker pop job, parse, nếu gửi thất bại thì tăng retry count và push lại hoặc bỏ nếu quá 3 lần.
* Bước 4: Scheduler tự động push SMS định kỳ.
* Bước 5: Test toàn bộ hệ thống.

*(Bạn có thể yêu cầu tôi cung cấp code chi tiết nếu cần)*

## 🔑 Những điểm quan trọng cần lưu ý

* **Đừng xử lý tác vụ nặng trong handler Gin**, tránh làm chậm phản hồi người dùng.
* **Message queue giúp tách biệt việc tạo job và xử lý job**, tăng độ tin cậy và mở rộng hệ thống.
* **Redis list là một cách đơn giản để làm queue**, dùng `LPush` + `BRPop` là phổ biến.
* **Worker cần chạy độc lập, không được block Gin server chính.**
* **Xử lý lỗi và retry job rất quan trọng để tránh mất dữ liệu hoặc job treo.**
* **Scheduler giúp thực thi các tác vụ định kỳ mà không cần trigger từ client.**
* **Nên log đầy đủ trạng thái job để dễ dàng debug.**

## 📝 Bài tập về nhà

**Đề bài:**
Xây dựng hệ thống background job xử lý upload file lớn:

* API nhận upload file và tạo job xử lý chuyển đổi file sang định dạng khác (giả lập).
* Đưa job chuyển đổi vào Redis queue.
* Worker đọc job và xử lý chuyển đổi (giả lập delay 5s).
* API cung cấp endpoint kiểm tra trạng thái job (đã xử lý hay chưa).
* Tối ưu hóa để không block server khi upload.

**Mục tiêu:**
Học viên sẽ áp dụng kỹ thuật background job cho xử lý file, đồng thời tìm hiểu cách lưu trữ và truy vấn trạng thái job.


