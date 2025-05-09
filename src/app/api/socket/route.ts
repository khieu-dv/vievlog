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

  // Set up SSE stream
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const channelName = `chat:${roomId}`;
      
      // Send initial connection event
      controller.enqueue(encoder.encode('event: connected\ndata: {"status":"connected"}\n\n'));
      
      // Keep connection alive with periodic pings
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode('event: ping\ndata: {}\n\n'));
        } catch (err) {
          console.error('Error sending ping, cleaning up:', err);
          clearInterval(pingInterval);
        }
      }, 30000); // 30 second ping
      
      // Subscribe to Redis channel
      subscriber.subscribe(channelName);
      
      // Handle messages from Redis
      const messageHandler = (channel: string, message: string) => {
        if (channel === channelName) {
          try {
            // Ensure the message can be parsed as JSON before sending
            const parsed = JSON.parse(message);
            controller.enqueue(encoder.encode(`data: ${message}\n\n`));
          } catch (error) {
            console.error('Invalid message received:', error);
          }
        }
      };
      
      subscriber.on('message', messageHandler);
      
      // Cleanup function for when connection is closed
      const cleanup = () => {
        clearInterval(pingInterval);
        subscriber.off('message', messageHandler);
        subscriber.unsubscribe(channelName);
      };
      
      // Store cleanup function
      // @ts-ignore - Custom property for cleanup
      controller.cleanup = cleanup;
    },
    cancel() {
      // @ts-ignore - Access custom property
      if (this.cleanup) this.cleanup();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Prevents nginx from buffering the response
    }
  });
}