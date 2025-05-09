import { NextRequest } from 'next/server';
import { createRoom, getRooms } from '../../../lib/redis';

// Get all rooms
export async function GET() {
  try {
    const rooms = await getRooms();
    
    return new Response(JSON.stringify(rooms), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch rooms' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Create a new room
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return new Response(JSON.stringify({ error: 'Room name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const roomId = await createRoom(name);
    
    return new Response(JSON.stringify({ id: roomId, name }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return new Response(JSON.stringify({ error: 'Failed to create room' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}