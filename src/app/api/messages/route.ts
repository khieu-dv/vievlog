
// API route để lấy tin nhắn
// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getMessages } from '../../../lib/redis';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const roomId = url.searchParams.get('roomId');
    
    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 });
    }
    
    const messages = await getMessages(roomId);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}