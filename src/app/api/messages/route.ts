// app/api/messages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getMessages, saveMessage } from '../../../lib/redis';
import { Message } from '../../../lib/types';

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

export async function POST(request: NextRequest) {
  try {
    const message: Message = await request.json();

    if (!message.roomId || !message.content || !message.sender) {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }

    await saveMessage(message); // Giả sử bạn đã có hàm này trong lib/redis.ts
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
