---
title: "Bài 14: Concurrency Patterns nâng cao"
postId: "ia0ucyntj44plni"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 14: Concurrency Patterns nâng cao



## **🎯 Mục tiêu bài học**

Sau khi hoàn thành bài học này, học viên sẽ:

1. Hiểu và áp dụng các pattern concurrency phổ biến trong Go.
2. Biết cách quản lý và đồng bộ goroutines an toàn với `sync` package.
3. Sử dụng `context` để quản lý cancellation, timeout, và truyền dữ liệu trong các goroutine.
4. Phát hiện và phòng tránh race conditions, deadlocks và các lỗi concurrency phổ biến.
5. Thiết kế các pipeline và worker pool hiệu quả cho các ứng dụng thực tế.

\---

## **📝 Nội dung chi tiết**

### 1. **Worker Pool Pattern**

**Khái niệm:**
Worker pool là pattern giúp giới hạn số lượng goroutines đồng thời, tối ưu tài nguyên CPU và tránh tạo quá nhiều goroutines cùng lúc.

**Ví dụ code:**

```go
package main

import (
    "fmt"
    "sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for j := range jobs {
        fmt.Printf("Worker %d processing job %d\n", id, j)
        results <- j * 2
    }
}

func main() {
    const numJobs = 5
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)
    var wg sync.WaitGroup

    for w := 1; w <= 3; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }

    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)

    wg.Wait()
    close(results)

    for res := range results {
        fmt.Println("Result:", res)
    }
}
```

**Giải thích:**

* `worker` nhận job từ `jobs` channel và gửi kết quả vào `results`.
* `sync.WaitGroup` đảm bảo main goroutine chờ tất cả worker hoàn thành.
* Chúng ta hạn chế số lượng worker (3) để tối ưu hóa CPU.

\---

### 2. **Fan-in và Fan-out Patterns**

**Khái niệm:**

* **Fan-out:** nhiều goroutines nhận dữ liệu từ cùng 1 nguồn để xử lý đồng thời.
* **Fan-in:** gom dữ liệu từ nhiều goroutines vào 1 channel để tập hợp kết quả.

**Ví dụ code:**

```go
func fanIn(inputs ...<-chan int) <-chan int {
    var wg sync.WaitGroup
    out := make(chan int)

    output := func(c <-chan int) {
        for n := range c {
            out <- n
        }
        wg.Done()
    }

    wg.Add(len(inputs))
    for _, c := range inputs {
        go output(c)
    }

    go func() {
        wg.Wait()
        close(out)
    }()

    return out
}
```

**Giải thích:**

* `fanIn` giúp gom dữ liệu từ nhiều channel đầu vào vào 1 channel duy nhất.
* `sync.WaitGroup` đảm bảo tất cả goroutines hoàn thành trước khi đóng channel.

\---

### 3. **Pipeline Pattern**

**Khái niệm:**
Pipeline pattern chia một task lớn thành nhiều stages, mỗi stage chạy đồng thời trong goroutine và truyền dữ liệu qua channels.

**Ví dụ code:**

```go
func generator(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    nums := generator(1, 2, 3, 4)
    squared := square(nums)

    for val := range squared {
        fmt.Println(val)
    }
}
```

**Giải thích:**

* `generator` tạo dữ liệu.
* `square` nhận dữ liệu, xử lý và gửi kết quả sang channel khác.
* Mỗi stage chạy đồng thời, cải thiện hiệu suất.

\---

### 4. **sync.Mutex và sync.RWMutex**

* **Mutex:** khóa dữ liệu khi có nhiều goroutine truy cập cùng lúc.
* **RWMutex:** tối ưu cho read-heavy workloads, cho phép nhiều goroutines đọc đồng thời nhưng chỉ có 1 goroutine viết.

**Ví dụ:**

```go
var (
    count int
    mu    sync.Mutex
)

func increment() {
    mu.Lock()
    defer mu.Unlock()
    count++
}
```

\---

### 5. **sync.WaitGroup**

* Dùng để đồng bộ nhiều goroutine, đảm bảo main goroutine chờ các goroutine khác hoàn thành.
* `Add(n)`, `Done()`, `Wait()` là ba phương thức cơ bản.

\---

### 6. **sync.Once**

* Đảm bảo một đoạn code chỉ chạy 1 lần duy nhất, ví dụ cho việc khởi tạo singleton hoặc setup config.

```go
var once sync.Once

func initialize() {
    fmt.Println("Init once")
}

func main() {
    for i := 0; i < 3; i++ {
        go once.Do(initialize)
    }
}
```

\---

### 7. **Context package**

**Khái niệm:** Quản lý lifecycle của goroutines: cancellation, timeout, deadline, values.

**Ví dụ:**

```go
ctx, cancel := context.WithTimeout(context.Background(), time.Second*2)
defer cancel()

go func(ctx context.Context) {
    select {
    case <-time.After(3 * time.Second):
        fmt.Println("Completed")
    case <-ctx.Done():
        fmt.Println("Cancelled:", ctx.Err())
    }
}(ctx)
```

\---

### 8. **Race detection**

* Sử dụng flag `-race` khi chạy:

```bash
go run -race main.go
```

* Phát hiện các race condition khi nhiều goroutines truy cập cùng dữ liệu.

\---

### 9. **Những lỗi concurrency phổ biến**

* Deadlocks: hai hoặc nhiều goroutines chờ nhau vô thời hạn.
* Goroutine leaks: goroutine bị treo do channel không được đóng.
* Race condition: nhiều goroutines truy cập cùng dữ liệu mà không đồng bộ.

\---

## **🏆 Bài tập thực hành**

**Đề bài:**
Xây dựng chương trình mô phỏng xử lý đơn hàng online:

1. Sử dụng worker pool để xử lý 10 đơn hàng.
2. Mỗi đơn hàng có `id` và `amount`.
3. Mỗi worker tính `amount * 1.1` (tính thuế) và gửi kết quả sang channel kết quả.
4. In kết quả sau khi tất cả đơn hàng được xử lý.

**Lời giải chi tiết:**

```go
package main

import (
    "fmt"
    "sync"
)

type Order struct {
    ID     int
    Amount float64
}

func worker(id int, jobs <-chan Order, results chan<- Order, wg *sync.WaitGroup) {
    defer wg.Done()
    for order := range jobs {
        order.Amount = order.Amount * 1.1 // tính thuế 10%
        fmt.Printf("Worker %d processed order %d\n", id, order.ID)
        results <- order
    }
}

func main() {
    orders := []Order{
        {1, 100}, {2, 200}, {3, 300}, {4, 400}, {5, 500},
        {6, 600}, {7, 700}, {8, 800}, {9, 900}, {10, 1000},
    }

    jobs := make(chan Order, len(orders))
    results := make(chan Order, len(orders))
    var wg sync.WaitGroup

    // Khởi tạo 3 worker
    for w := 1; w <= 3; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }

    // Gửi đơn hàng vào channel jobs
    for _, order := range orders {
        jobs <- order
    }
    close(jobs)

    // Chờ worker xong
    wg.Wait()
    close(results)

    // In kết quả
    for res := range results {
        fmt.Printf("Order %d final amount: %.2f\n", res.ID, res.Amount)
    }
}
```

**Phân tích logic:**

* Tạo struct `Order` chứa thông tin đơn hàng.
* Tạo worker pool với 3 worker để xử lý đồng thời.
* Channel `jobs` truyền đơn hàng, channel `results` nhận kết quả.
* `sync.WaitGroup` đảm bảo main goroutine chờ tất cả worker hoàn thành.

\---

## **🔑 Những điểm quan trọng cần lưu ý**

1. Channel là công cụ chính để truyền dữ liệu giữa goroutines.
2. Worker pool giúp giới hạn goroutine, tránh sử dụng quá nhiều tài nguyên.
3. Mutex/RWMutex là cách đơn giản để bảo vệ dữ liệu khi nhiều goroutine truy cập.
4. Context giúp hủy hoặc timeout goroutines an toàn.
5. Luôn đóng channel khi không còn gửi dữ liệu, tránh deadlocks.
6. Dùng `-race` để phát hiện race condition.
7. Tránh nested locks, tránh goroutine leaks.

\---

## **📝 Bài tập về nhà**

**Bài 1:**
Viết chương trình mô phỏng tính toán lương nhân viên:

* Mỗi nhân viên có `name` và `salary`.
* Sử dụng worker pool để tính `salary * 1.05` (tăng lương 5%).
* In kết quả theo thứ tự nhân viên.

**Bài 2:**
Xây dựng pipeline xử lý dữ liệu:

* Stage 1: Tạo một list số nguyên từ 1 đến 20.
* Stage 2: Lọc các số chẵn.
* Stage 3: Bình phương các số còn lại.
* In kết quả cuối cùng.




---

*Post ID: ia0ucyntj44plni*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
