// app/api/messages/route.ts
import { NextRequest } from 'next/server';
import { Message } from '../../../lib/types';
import { saveMessage, getMessages, publisher } from '../../../lib/redis';

// GET endpoint for fetching messages
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const roomId = url.searchParams.get('roomId');
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 50;

    if (!roomId) {
      return new Response('Room ID is required', { status: 400 });
    }

    const messages = await getMessages(roomId, limit);
    
    return new Response(JSON.stringify(messages), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0' // Prevent caching
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch messages' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// POST endpoint for sending messages
export async function POST(request: NextRequest) {
  try {
    const message: Message = await request.json();
    const { roomId, content, sender, id } = message;

    if (!roomId || !content || !sender || !id) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Ensure timestamp exists or add one
    if (!message.timestamp) {
      message.timestamp = Date.now();
    }

    // Save message to Redis
    await saveMessage(message);

    // Publish to Redis channel immediately
    await publisher.publish(`chat:${roomId}`, JSON.stringify(message));

    return new Response(JSON.stringify({ success: true, message }), {
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