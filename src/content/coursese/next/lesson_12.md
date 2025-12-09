

# 🎓 **BÀI 12: Chat Feature (Realtime)**

## 🎯 **MỤC TIÊU BÀI HỌC**

Sau khi hoàn thành bài học này, học viên sẽ:

* Hiểu được các khái niệm **Realtime Communication**, WebSocket, Client-Server interaction.
* Biết cách **tích hợp Socket.IO** vào Next.js (App Router) và backend (Golang hoặc Express).
* Xây dựng được một **giao diện chat chuyên nghiệp với ShadcnUI**.
* Hiển thị tin nhắn **ngay lập tức (Optimistic UI)** khi gửi.
* Cập nhật được **trạng thái đang gõ (Typing Indicator)** và **đã đọc (Read Receipt)**.

## 📝 **NỘI DUNG CHI TIẾT**

### 1. Giới thiệu Realtime Chat là gì?

> **Realtime Communication** là cách truyền dữ liệu giữa client và server gần như tức thì. Khác với HTTP request (pull), realtime sử dụng WebSocket (push) để **giữ kết nối liên tục** và cập nhật dữ liệu liên tục mà không cần reload.

👉 **Tình huống thực tế:** Chat Facebook, Zalo, Telegram – khi một người nhắn tin, người khác nhận được **ngay lập tức**.

### 2. Khái niệm về WebSocket

> **WebSocket** là một giao thức mạng cho phép mở kết nối hai chiều giữa client và server, lý tưởng cho các ứng dụng như chat, game, thông báo...

📌 Đặc điểm:

* Kết nối duy trì liên tục (không cần gửi lại request).
* Gửi nhận dữ liệu **real-time**.
* Tích hợp tốt với Node.js, Express, hoặc Golang backend.

### 3. Chọn thư viện: Socket.IO

> **Socket.IO** là một thư viện phổ biến hỗ trợ WebSocket, fallback tốt cho trình duyệt cũ, đơn giản hóa code realtime.

📦 Cài đặt client-side:

```bash
npm install socket.io-client
```

📦 Server (nếu bạn dùng Express):

```bash
npm install socket.io
```

### 4. Thiết kế UI Chat với ShadcnUI

👉 Tận dụng các component từ ShadcnUI:

* `Input`, `Textarea`: nhập tin nhắn.
* `ScrollArea`: cuộn tin nhắn.
* `Avatar`, `Card`, `Badge`: hiển thị người gửi, trạng thái.

Ví dụ giao diện cơ bản:

```tsx
<Card className="h-[500px] w-full flex flex-col">
  <ScrollArea className="flex-1 p-4">...</ScrollArea>
  <div className="p-2 border-t flex gap-2">
    <Input className="flex-1" placeholder="Nhập tin nhắn..." />
    <Button>Gửi</Button>
  </div>
</Card>
```

### 5. Kết nối với WebSocket

> Dùng `socket.io-client` trong **Client Component**.

```tsx
'use client'
import { io } from "socket.io-client"
import { useEffect, useState } from "react"

const socket = io("http://localhost:3001") // server backend

export function useChatSocket() {
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    socket.on("message", (msg: string) => {
      setMessages((prev) => [...prev, msg])
    })
  }, [])

  function sendMessage(msg: string) {
    socket.emit("message", msg)
    setMessages((prev) => [...prev, msg]) // Optimistic update
  }

  return { messages, sendMessage }
}
```

### 6. Optimistic UI là gì?

> Hiển thị dữ liệu ngay lập tức **trước khi server phản hồi**, để tạo cảm giác "nhanh" và mượt.

📌 Trong chat: hiển thị tin nhắn ngay khi gửi, không đợi server xác nhận.

### 7. Typing Indicator (Đang gõ...)

> Khi user gõ, gửi sự kiện `"typing"` qua socket, client khác nhận và hiển thị.

```tsx
// Khi user gõ:
socket.emit("typing", true)

// Nhận từ người khác:
socket.on("typing", (isTyping) => {
  setTypingStatus(isTyping ? "Đang gõ..." : "")
})
```

### 8. Read Receipt (Đã đọc)

> Gửi thông báo khi user **mở hoặc xem** đoạn chat.

* Gửi `"seen"` event khi cuộn đến cuối hoặc mở tab.
* Cập nhật trạng thái "Đã xem lúc 14:32".

## 🏆 **BÀI TẬP THỰC HÀNH**

### 💼 Đề bài:

> Xây dựng một ứng dụng chat đơn giản gồm:
>
> * Giao diện người dùng với hộp chat (danh sách tin nhắn + form nhập).
> * Gửi và nhận tin nhắn realtime.
> * Hiển thị "Đang gõ..." khi người khác gõ.
> * Hiển thị thời gian gửi và người gửi.

### 📌 Gợi ý cấu trúc:

* `/components/chat-ui.tsx`: Giao diện hộp chat.
* `/lib/socket.ts`: Khởi tạo socket.
* `useChatSocket.ts`: Hook xử lý logic gửi/nhận.

### ✅ Lời giải chi tiết:

```tsx
'use client'
import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const socket = io("http://localhost:3001")

export default function ChatRoom() {
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    socket.on("message", (msg: string) => {
      setMessages(prev => [...prev, msg])
    })

    socket.on("typing", () => {
      setTyping(true)
      setTimeout(() => setTyping(false), 1000)
    })
  }, [])

  const sendMessage = () => {
    if (!input.trim()) return
    socket.emit("message", input)
    setMessages(prev => [...prev, input])
    setInput("")
  }

  return (
    <div className="p-4 space-y-4">
      <div className="h-[300px] overflow-y-auto border p-2">
        {messages.map((msg, idx) => <div key={idx}>{msg}</div>)}
        {typing && <div className="text-sm text-gray-400">Người khác đang gõ...</div>}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            socket.emit("typing")
          }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage}>Gửi</Button>
      </div>
    </div>
  )
}
```

## 🔑 **NHỮNG ĐIỂM QUAN TRỌNG CẦN LƯU Ý**

| ⚠️ Điểm dễ nhầm lẫn                              | ✅ Cách xử lý                                      |
| ------------------------------------------------ | ------------------------------------------------- |
| Không gọi `socket.emit` trong Server Component   | Dùng `"use client"` để bật môi trường trình duyệt |
| Quên cleanup `socket.on()` khi component unmount | Sử dụng `socket.off()` nếu cần tái sử dụng hook   |
| Gửi `typing` quá nhiều lần                       | Dùng debounce/throttle nếu cần tối ưu             |
| Không nhận tin nhắn mới                          | Kiểm tra server socket đã emit đúng chưa          |

## 📝 **BÀI TẬP VỀ NHÀ**

### 📋 Đề bài:

> Mở rộng bài chat:
>
> * Thêm `Username` khi gửi tin nhắn.
> * Hiển thị thời gian gửi (`HH:mm:ss`).
> * Lưu 10 tin nhắn gần nhất bằng localStorage và load lại khi mở trang.

📌 Gợi ý:

* Dùng `useEffect` để load từ localStorage.
* Khi gửi tin nhắn mới, cập nhật lại `localStorage`.


