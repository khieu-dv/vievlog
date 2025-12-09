

# Bài 20: WebSocket và Real-time Features

## 🎯 Mục tiêu bài học

Sau bài học này, học viên sẽ:

* Hiểu rõ **WebSocket là gì**, ưu điểm so với HTTP truyền thống và cách hoạt động.
* Nắm được cách **tích hợp WebSocket vào ứng dụng Gin** để xử lý kết nối real-time hai chiều.
* Biết cách **quản lý vòng đời kết nối WebSocket** (mở, nhận, gửi, đóng).
* Xây dựng được một **ứng dụng chat real-time đơn giản** với khả năng gửi và broadcast tin nhắn đến nhiều client.
* Hiểu và xử lý các tình huống phổ biến trong WebSocket như: giữ kết nối, xử lý lỗi, bảo mật cơ bản.
* Thực hành triển khai WebSocket theo **kiến trúc chuẩn dự án Gin** (cmd, internal/handlers, models,...).

## 📝 Nội dung chi tiết

### 1. Giới thiệu về WebSocket

* **Khái niệm:**
  WebSocket là một giao thức mạng cho phép thiết lập kết nối hai chiều (full-duplex) giữa client và server qua một kết nối TCP duy nhất. Khác với HTTP truyền thống là mỗi yêu cầu là một kết nối riêng lẻ, WebSocket giữ kết nối mở liên tục để trao đổi dữ liệu thời gian thực.

* **Ưu điểm:**

  * Giảm thiểu độ trễ vì không cần tạo kết nối mới cho mỗi message.
  * Phù hợp với các ứng dụng real-time như chat, game, thông báo push, streaming.
  * Hỗ trợ gửi dữ liệu từ server về client bất cứ lúc nào (push).

* **Mô hình hoạt động:**

  * Client gửi HTTP request "Upgrade" để chuyển giao thức sang WebSocket.
  * Nếu server chấp nhận, kết nối được thiết lập mở lâu dài.
  * Dữ liệu được gửi qua lại dưới dạng message (text hoặc binary).

### 2. Tích hợp WebSocket trong Gin

* Gin không có sẵn WebSocket handler, ta dùng thư viện phổ biến là `github.com/gorilla/websocket`.

* **Cài đặt thư viện:**

  ```bash
  go get github.com/gorilla/websocket
  ```

* **Phân tích các bước chính:**

  * Tạo endpoint HTTP để upgrade kết nối HTTP sang WebSocket.
  * Quản lý vòng đời connection: mở, đọc, ghi, đóng.
  * Xử lý message nhận từ client và gửi trả lại hoặc broadcast.

### 3. Cấu trúc dự án (theo chuẩn)

```
myapp/
├── cmd/
│   └── main.go
├── internal/
│   ├── handlers/
│   │   └── websocket.go
│   ├── models/
│   │   └── client.go
├── go.mod
└── go.sum
```

### 4. Khái niệm chính cần biết trước khi code

* **Upgrader:** Thực thể của gorilla/websocket chịu trách nhiệm chuyển đổi kết nối HTTP thành WebSocket.

* **Client:** Đại diện một kết nối WebSocket của client, bao gồm connection object và channel message.

* **Hub (Optional, nâng cao):** Quản lý nhiều kết nối client cùng lúc, hỗ trợ broadcast tin nhắn.

### 5. Ví dụ minh họa: Chat real-time đơn giản

#### 5.1. Mô hình hoạt động:

* Client kết nối WebSocket đến server tại `/ws`.

* Server giữ kết nối, nhận tin nhắn client gửi.

* Server gửi tin nhắn đó lại cho tất cả client (broadcast).

#### 5.2. Code ví dụ (theo cấu trúc dự án)

**cmd/main.go**

```go
package main

import (
    "github.com/gin-gonic/gin"
    "myapp/internal/handlers"
)

func main() {
    r := gin.Default()

    r.GET("/ws", handlers.HandleWebSocket)

    r.Run(":8080")
}
```

**internal/models/client.go**

```go
package models

import (
    "github.com/gorilla/websocket"
    "sync"
)

type Client struct {
    Conn *websocket.Conn
    Send chan []byte
}

type Hub struct {
    Clients    map[*Client]bool
    Broadcast  chan []byte
    Register   chan *Client
    Unregister chan *Client
    mu         sync.Mutex
}

func NewHub() *Hub {
    return &Hub{
        Clients:    make(map[*Client]bool),
        Broadcast:  make(chan []byte),
        Register:   make(chan *Client),
        Unregister: make(chan *Client),
    }
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.Register:
            h.mu.Lock()
            h.Clients[client] = true
            h.mu.Unlock()
        case client := <-h.Unregister:
            h.mu.Lock()
            if _, ok := h.Clients[client]; ok {
                delete(h.Clients, client)
                close(client.Send)
            }
            h.mu.Unlock()
        case message := <-h.Broadcast:
            h.mu.Lock()
            for client := range h.Clients {
                select {
                case client.Send <- message:
                default:
                    close(client.Send)
                    delete(h.Clients, client)
                }
            }
            h.mu.Unlock()
        }
    }
}
```

**internal/handlers/websocket.go**

```go
package handlers

import (
    "log"
    "net/http"
    "myapp/internal/models"

    "github.com/gin-gonic/gin"
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        // Allow all origins - production nên kiểm tra kỹ hơn
        return true
    },
}

var hub = models.NewHub()

func init() {
    go hub.Run()
}

func HandleWebSocket(c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        log.Println("Upgrade error:", err)
        return
    }

    client := &models.Client{
        Conn: conn,
        Send: make(chan []byte, 256),
    }

    hub.Register <- client

    // Goroutine gửi tin nhắn cho client
    go writePump(client)

    // Đọc tin nhắn từ client
    readPump(client)
}

func readPump(client *models.Client) {
    defer func() {
        hub.Unregister <- client
        client.Conn.Close()
    }()

    client.Conn.SetReadLimit(512)
    for {
        _, message, err := client.Conn.ReadMessage()
        if err != nil {
            log.Println("Read error:", err)
            break
        }
        log.Printf("Received: %s", message)
        hub.Broadcast <- message
    }
}

func writePump(client *models.Client) {
    for msg := range client.Send {
        err := client.Conn.WriteMessage(websocket.TextMessage, msg)
        if err != nil {
            log.Println("Write error:", err)
            break
        }
    }
    client.Conn.Close()
}
```

### 6. Giải thích từng phần chính

* `upgrader.Upgrade()` chuyển HTTP request sang WebSocket.

* `Client` giữ connection và channel `Send` để gửi message async.

* `Hub` quản lý tất cả client kết nối:

  * `Register` thêm client mới.
  * `Unregister` xóa client khi ngắt kết nối.
  * `Broadcast` gửi tin nhắn cho tất cả client.

* `readPump()` liên tục đọc tin nhắn client gửi, đẩy vào `hub.Broadcast`.

* `writePump()` liên tục nhận message từ `client.Send` và gửi qua WebSocket.

### 7. Hướng dẫn test

* Chạy server: `go run cmd/main.go`

* Dùng tool như [websocat](https://github.com/vi/websocat) hoặc frontend demo:

```js
let ws = new WebSocket("ws://localhost:8080/ws");
ws.onmessage = (msg) => console.log("Received:", msg.data);
ws.onopen = () => ws.send("Hello from client");
```

* Mở nhiều tab, thử gửi tin nhắn, quan sát broadcast.

## 🏆 Bài tập thực hành có lời giải chi tiết

### Đề bài

Xây dựng một ứng dụng WebSocket server với Gin theo kiến trúc chuẩn, hỗ trợ các tính năng:

* Khi client kết nối gửi lên tên người dùng, server lưu lại tên này cho client.

* Khi client gửi tin nhắn, server broadcast kèm theo tên người gửi.

* Khi client ngắt kết nối, server thông báo cho tất cả client còn lại biết người đó đã rời chat.

### Lời giải và phân tích

**Phân tích:**

* Client cần gửi tên người dùng lần đầu.

* Server phải lưu tên người trong `Client` struct.

* Broadcast tin nhắn dưới dạng JSON có `{user: "...", message: "..."}`.

* Khi client ngắt kết nối, gửi message kiểu `{user: "System", message: "User X left the chat"}`.

**Code cập nhật:**

**internal/models/client.go**

```go
package models

import (
    "github.com/gorilla/websocket"
    "sync"
)

type Client struct {
    Conn *websocket.Conn
    Send chan []byte
    Name string
}

type Hub struct {
    Clients    map[*Client]bool
    Broadcast  chan []byte
    Register   chan *Client
    Unregister chan *Client
    mu         sync.Mutex
}

func NewHub() *Hub {
    return &Hub{
        Clients:    make(map[*Client]bool),
        Broadcast:  make(chan []byte),
        Register:   make(chan *Client),
        Unregister: make(chan *Client),
    }
}

func (h *Hub) Run() {
    for {
        select {
        case client := <-h.Register:
            h.mu.Lock()
            h.Clients[client] = true
            h.mu.Unlock()
        case client := <-h.Unregister:
            h.mu.Lock()
            if _, ok := h.Clients[client]; ok {
                delete(h.Clients, client)
                close(client.Send)
            }
            h.mu.Unlock()
        case message := <-h.Broadcast:
            h.mu.Lock()
            for client := range h.Clients {
                select {
                case client.Send <- message:
                default:
                    close(client.Send)
                    delete(h.Clients, client)
                }
            }
            h.mu.Unlock()
        }
    }
}
```

**internal/handlers/websocket.go**

```go
package handlers

import (
    "encoding/json"
    "log"
    "net/http"
    "myapp/internal/models"

    "github.com/gin-gonic/gin"
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

var hub = models.NewHub()

func init() {
    go hub.Run()
}

type Message struct {
    User    string `json:"user"`
    Message string `json:"message"`
}

func HandleWebSocket(c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        log.Println("Upgrade error:", err)
        return
    }

    client := &models.Client{
        Conn: conn,
        Send: make(chan []byte, 256),
    }

    // Bước 1: Đọc tên user từ client
    _, msg, err := conn.ReadMessage()
    if err != nil {
        log.Println("Read user name error:", err)
        conn.Close()
        return
    }
    client.Name = string(msg)

    hub.Register <- client

    // Thông báo user đã vào chat
    joinMsg := Message{
        User:    "System",
        Message: client.Name + " đã tham gia chat",
    }
    msgJoin, _ := json.Marshal(joinMsg)
    hub.Broadcast <- msgJoin

    go writePump(client)
    readPump(client)
}

func readPump(client *models.Client) {
    defer func() {
        hub.Unregister <- client
        client.Conn.Close()

        leaveMsg := Message{
            User:    "System",
            Message: client.Name + " đã rời chat",
        }
        msgLeave, _ := json.Marshal(leaveMsg)
        hub.Broadcast <- msgLeave
    }()

    client.Conn.SetReadLimit(512)
    for {
        _, message, err := client.Conn.ReadMessage()
        if err != nil {
            log.Println("Read error:", err)
            break
        }
        log.Printf("Received from %s: %s", client.Name, message)

        chatMsg := Message{
            User:    client.Name,
            Message: string(message),
        }
        msgJSON, _ := json.Marshal(chatMsg)
        hub.Broadcast <- msgJSON
    }
}

func writePump(client *models.Client) {
    for msg := range client.Send {
        err := client.Conn.WriteMessage(websocket.TextMessage, msg)
        if err != nil {
            log.Println("Write error:", err)
            break
        }
    }
    client.Conn.Close()
}
```

### Phân tích lời giải

* Khi mới kết nối, client gửi tên người dùng (chuỗi đơn giản).

* Server lưu tên này vào `client.Name`.

* Khi có tin nhắn mới, server gói thành JSON gồm tên user và message rồi broadcast.

* Khi client ngắt kết nối, server broadcast thông báo user rời chat.

* `Hub` vẫn giữ nhiệm vụ quản lý kết nối và broadcast.

## 🔑 Những điểm quan trọng cần lưu ý

* **WebSocket connection phải được upgrade từ HTTP.**

* **Gorilla WebSocket** là thư viện phổ biến và dễ tích hợp với Gin.

* **Đồng bộ truy cập map khi quản lý client** cần dùng mutex để tránh race condition.

* **Luôn xử lý lỗi khi đọc/ghi message** và đóng connection đúng cách để tránh leak.

* **CheckOrigin() nên tùy chỉnh kỹ ở môi trường production để tránh lỗ hổng bảo mật.**

* **Không để blocking trên kênh gửi tin nhắn (`Send chan []byte`)** để tránh treo server, nên dùng buffer hoặc xử lý trường hợp channel full.

* **Phân biệt giữa đọc message (readPump) và gửi message (writePump) phải chạy song song.**

## 📝 Bài tập về nhà

### Đề bài

Mở rộng bài tập chat real-time:

* Thêm tính năng **private message**: khi client gửi tin nhắn theo định dạng `@username message`, server chỉ gửi tin nhắn đó cho đúng client có username được chỉ định.

* Nếu không đúng định dạng, gửi broadcast bình thường.

* Thêm API HTTP để lấy danh sách tất cả client đang kết nối.

