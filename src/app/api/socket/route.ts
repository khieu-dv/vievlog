import { NextRequest } from 'next/server';
import { Message } from '../../../lib/types';
import { saveMessage, publisher, subscriber } from '../../../lib/redis';

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
      
      // Subscribe to Redis channel
      subscriber.subscribe(channelName);
      
      // Handle messages from Redis
      const messageHandler = (channel: string, message: string) => {
        if (channel === channelName) {
          controller.enqueue(encoder.encode(`data: ${message}\n\n`));
        }
      };
      
      subscriber.on('message', messageHandler);
      
      // Cleanup function for when connection is closed
      const cleanup = () => {
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
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

// Endpoint for sending messages
export async function POST(request: NextRequest) {
  try {
    const message: Message = await request.json();
    const { roomId } = message;
    
    if (!roomId) {
      return new Response('Room ID is required', { status: 400 });
    }
    
    // Save message to Redis
    await saveMessage(message);
    
    // Publish to Redis channel
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