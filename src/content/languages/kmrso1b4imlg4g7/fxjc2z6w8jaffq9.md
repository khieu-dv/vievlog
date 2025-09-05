---
title: "Bài 13: Goroutines và Concurrency cơ bản"
postId: "fxjc2z6w8jaffq9"
category: "Golang"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 13: Goroutines và Concurrency cơ bản



## **🎯 Mục tiêu bài học**

Sau khi học xong bài này, học viên sẽ:

1. Hiểu khái niệm **concurrency** trong Go và phân biệt giữa **goroutines** và **threads**.
2. Biết cách **tạo và quản lý goroutines**.
3. Nắm được cách sử dụng **channels** để giao tiếp giữa các goroutines.
4. Áp dụng được **select statement** để multiplexing và xử lý các operations không đồng bộ.
5. Nhận biết các vấn đề phổ biến như **goroutine leaks** và cách **phòng tránh**.

\---

## **📝 Nội dung chi tiết**

### 1. **Goroutines vs Threads**

* **Thread:** đơn vị cơ bản của OS để thực thi code. Quản lý tốn nhiều resource (stack memory lớn, context switching).
* **Goroutine:** lightweight thread do Go runtime quản lý. Có stack nhỏ (\~2KB) và có thể tự động grow. Cho phép tạo hàng nghìn goroutines mà không tốn quá nhiều resource.

**Ví dụ:**

```go
package main

import (
    "fmt"
    "time"
)

func sayHello() {
    fmt.Println("Hello from goroutine")
}

func main() {
    go sayHello() // Tạo một goroutine
    time.Sleep(time.Second) // Chờ goroutine thực thi
}
```

> Lưu ý: Nếu không `Sleep` hoặc đồng bộ, chương trình kết thúc trước khi goroutine chạy.

\---

### 2. **Tạo goroutines**

* Sử dụng keyword `go` trước một hàm để chạy nó dưới dạng goroutine.
* Goroutine chạy **concurrently**, không guarantee thứ tự thực thi.

**Ví dụ:**

```go
func printNumber(num int) {
    fmt.Println(num)
}

func main() {
    for i := 1; i <= 5; i++ {
        go printNumber(i)
    }
    time.Sleep(time.Second) // Chờ các goroutines hoàn tất
}
```

\---

### 3. **Goroutine scheduling**

* Go runtime scheduler tự động phân chia goroutines trên các OS threads.
* Số lượng thread tối đa được cấu hình bằng `runtime.GOMAXPROCS`.

```go
import "runtime"

func main() {
    fmt.Println("CPU cores:", runtime.NumCPU())
    fmt.Println("Max Procs:", runtime.GOMAXPROCS(0))
}
```

\---

### 4. **Channels**

* Channels là **công cụ giao tiếp** giữa các goroutines, giúp tránh dùng shared memory trực tiếp.
* Tạo channel: `ch := make(chan int)`

**Ví dụ unbuffered channel:**

```go
func main() {
    ch := make(chan int)

    go func() {
        ch <- 42 // gửi dữ liệu vào channel
    }()

    value := <-ch // nhận dữ liệu từ channel
    fmt.Println(value)
}
```

\---

### 5. **Buffered vs Unbuffered channels**

* **Unbuffered:** gửi dữ liệu sẽ block cho đến khi có goroutine nhận.
* **Buffered:** gửi dữ liệu vào channel không block nếu buffer còn chỗ.

```go
ch := make(chan int, 2) // buffered channel với capacity 2
ch <- 1
ch <- 2
// ch <- 3 // Block nếu buffer đầy
```

\---

### 6. **Channel direction và closing**

* Có thể giới hạn channel chỉ gửi hoặc nhận:

```go
func send(ch chan<- int) {
    ch <- 10
}

func receive(ch <-chan int) {
    fmt.Println(<-ch)
}
```

* **Đóng channel**: `close(ch)`
* **Range over channel** để nhận liên tục:

```go
for val := range ch {
    fmt.Println(val)
}
```

\---

### 7. **Select statement**

* Giúp **multiplexing**, chờ nhiều channel cùng lúc.
* Có thể có `default` để không block.

```go
select {
case msg1 := <-ch1:
    fmt.Println("Received", msg1)
case ch2 <- 42:
    fmt.Println("Sent 42 to ch2")
default:
    fmt.Println("No communication")
}
```

\---

### 8. **Non-blocking operations**

* Kết hợp `select` với `default` để tránh block goroutines.

```go
select {
case val := <-ch:
    fmt.Println(val)
default:
    fmt.Println("No value ready")
}
```

\---

### 9. **Goroutine leaks và prevention**

* Leak xảy ra khi goroutine chờ channel hoặc block vô thời hạn.
* Cách phòng tránh:

  * Luôn close channel khi không cần.
  * Dùng `select` với `default` hoặc timeout.
  * Sử dụng `context.Context` để hủy goroutine khi cần.

```go
ctx, cancel := context.WithTimeout(context.Background(), time.Second)
defer cancel()

select {
case <-ctx.Done():
    fmt.Println("Timeout, cancel goroutine")
}
```

\---

## **🏆 Bài tập thực hành**

### **Đề bài:**

Viết một chương trình Go thực hiện tính tổng các số từ 1 đến 100 bằng cách chia nhỏ thành 5 goroutines, mỗi goroutine tính tổng 20 số liên tiếp. Sau đó sử dụng channel để gom kết quả và tính tổng cuối cùng.

### **Lời giải chi tiết:**

```go
package main

import "fmt"

func sumRange(start, end int, ch chan int) {
    sum := 0
    for i := start; i <= end; i++ {
        sum += i
    }
    ch <- sum // gửi kết quả vào channel
}

func main() {
    ch := make(chan int)
    ranges := [][2]int{{1,20},{21,40},{41,60},{61,80},{81,100}}

    for _, r := range ranges {
        go sumRange(r[0], r[1], ch)
    }

    total := 0
    for i := 0; i < 5; i++ {
        total += <-ch
    }

    fmt.Println("Tổng từ 1 đến 100:", total)
}
```

**Giải thích logic:**

1. Hàm `sumRange` tính tổng 1 đoạn số và gửi kết quả vào channel.
2. Mỗi goroutine tính 20 số liên tiếp.
3. Main goroutine nhận kết quả từ channel 5 lần và cộng vào `total`.

Kết quả: `Tổng từ 1 đến 100: 5050`

\---

## **🔑 Những điểm quan trọng cần lưu ý**

* Goroutines là lightweight, nhưng cần quản lý để tránh leak.
* Channels giúp goroutines giao tiếp, tránh race condition.
* `select` rất mạnh để xử lý nhiều channel, nhưng cần có `default` để non-blocking.
* Luôn cân nhắc **close channel** khi không dùng nữa.
* Tránh assumptions về thứ tự thực thi của goroutines.

\---

## **📝 Bài tập về nhà**

1. Tạo một chương trình Go gồm 3 goroutines, mỗi goroutine in ra 5 ký tự chữ cái khác nhau từ `A-Z`. Sử dụng channel để main goroutine in kết quả theo thứ tự các goroutines kết thúc.
2. Viết chương trình Go tính bình phương các số từ 1 đến 10. Dùng goroutines để tính song song và channel để gom kết quả. In kết quả theo thứ tự tăng dần của số.



---

*Post ID: fxjc2z6w8jaffq9*  
*Category: Golang*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
