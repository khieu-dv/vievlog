
// API route để lấy và tạo phòng chat
// app/api/rooms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRoom, getRooms } from '../../../lib/redis';
import { Room } from '../../../lib/types';

export async function GET() {
  try {
    const rooms = await getRooms();
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 });
    }
    
    const room: Room = {
      id: Math.random().toString(36).substring(2, 15),
      name: name.trim(),
    };
    
    await createRoom(room);
    
    return NextResponse.json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
