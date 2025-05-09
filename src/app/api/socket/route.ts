// app/api/socket/route.ts
import { NextRequest } from 'next/server';
import { Message } from '../../../lib/types';
import { subscriber } from '../../../lib/redis';

// Server-Sent Events (SSE) endpoint
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const roomId = url.searchParams.get('roomId');
  
  if (!roomId) {
    return new Response('Room ID is required', { status: 400 });
  }

  const encoder = new TextEncoder();
  let controllerRef: ReadableStreamDefaultController | null = null;

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
          cleanup();
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

      subscriber.subscribe(channelName);
      subscriber.on('message', messageHandler);

      const cleanup = () => {
        clearInterval(pingInterval);
        subscriber.off('message', messageHandler);
        subscriber.unsubscribe(channelName);
        try {
          controller.close(); // đóng stream để ngăn enqueue tiếp tục
        } catch (_) {}
      };

      // Cleanup khi client ngắt kết nối
      request.signal.addEventListener('abort', () => {
        console.log('Client disconnected, cleaning up');
        cleanup();
      });

    },
    cancel() {
      if (controllerRef) {
        cleanup();
      }
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
function cleanup() {
  throw new Error('Function not implemented.');
}

