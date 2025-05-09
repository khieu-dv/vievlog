
// API route để xử lý WebSocket
// app/api/socket/route.ts
import { NextRequest } from 'next/server';
import { Message } from '../../../lib/types';
import { saveMessage, publisher, subscriber } from '../../../lib/redis';


// Chuyển sang Route Handlers API của Next.js 13+
export async function GET(request: NextRequest) {
  // Không thể sử dụng socket.io trực tiếp trong Next.js App Router
  // Cần cài đặt custom server hoặc sử dụng Edge Runtime
  
  // Thay thế bằng giải pháp sử dụng Server-Sent Events (SSE)
  // hoặc SWR/polling cho các trường hợp đơn giản
  
  const url = new URL(request.url);
  const roomId = url.searchParams.get('roomId');
  
  if (!roomId) {
    return new Response('Room ID is required', { status: 400 });
  }
  
  // Thiết lập SSE
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const channelName = `chat:${roomId}`;
      
      // Đăng ký với Redis để nhận tin nhắn
      subscriber.subscribe(channelName);
      
      // Xử lý tin nhắn từ Redis
      const messageHandler = (channel: string, message: string) => {
        if (channel === channelName) {
          controller.enqueue(encoder.encode(`data: ${message}\n\n`));
        }
      };
      
      subscriber.on('message', messageHandler);
      
      // Cung cấp cách để dọn dẹp khi kết nối đóng
      const cleanup = () => {
        subscriber.off('message', messageHandler);
        subscriber.unsubscribe(channelName);
      };
      
      // Lưu cleanup function để dùng sau
      // @ts-ignore - Thêm thuộc tính tùy chỉnh
      controller.cleanup = cleanup;
    },
    cancel() {
      // @ts-ignore - Truy cập thuộc tính tùy chỉnh
      if (this.cleanup) this.cleanup();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

// API endpoint để gửi tin nhắn
export async function POST(request: NextRequest) {
  try {
    const message: Message = await request.json();
    const { roomId } = message;
    
    if (!roomId) {
      return new Response('Room ID is required', { status: 400 });
    }
    
    // Lưu tin nhắn vào Redis
    await saveMessage(message);
    
    // Phát tin nhắn đến tất cả người dùng trong phòng
    publisher.publish(`chat:${roomId}`, JSON.stringify(message));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return new Response(JSON.stringify({ error: 'Failed to send message' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}