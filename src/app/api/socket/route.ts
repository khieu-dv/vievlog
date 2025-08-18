// app/api/socket/route.ts
import { NextRequest } from 'next/server';
import { subscriber } from '../../../lib/redis';

// Server-Sent Events (SSE) endpoint
export function GET(request: NextRequest) {
  const url = new URL(request.url);
  const roomId = url.searchParams.get('roomId');
  
  if (!roomId) {
    return new Response('Room ID is required', { status: 400 });
  }

  const encoder = new TextEncoder();
  let controllerRef: ReadableStreamDefaultController | null = null;
  let cleanupFunc: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;
      const channelName = `chat:${roomId}`;

      controller.enqueue(encoder.encode('event: connected\ndata: {"status":"connected"}\n\n'));

      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode('event: ping\ndata: {}\n\n'));
        } catch (err) {
          console.error('Error sending ping, cleaning up:', err);
          cleanupFunc?.();
        }
      }, 30000);

      const messageHandler = (channel: string, message: string) => {
        if (channel === channelName) {
          try {
            JSON.parse(message); // kiểm tra JSON
            controller.enqueue(encoder.encode(`data: ${message}\n\n`));
          } catch (error) {
            console.error('Invalid message received:', error);
          }
        }
      };

      void subscriber.subscribe(channelName);
      subscriber.on('message', messageHandler);

      cleanupFunc = () => {
        clearInterval(pingInterval);
        subscriber.off('message', messageHandler);
        void subscriber.unsubscribe(channelName);
        try {
          controller.close(); // đóng stream để ngăn enqueue tiếp tục
        } catch {
          // Ignore cleanup errors
        }
      };

      // Cleanup khi client ngắt kết nối
      request.signal.addEventListener('abort', () => {
        console.log('Client disconnected, cleaning up');
        cleanupFunc?.();
      });

    },
    cancel() {
      cleanupFunc?.();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  });
}

