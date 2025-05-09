// lib/redis.ts
import { Redis } from 'ioredis';
import { Message, Room } from './types';

// Sử dụng biến môi trường
const redisUrl = process.env.REDIS_URL || 'redis://:yourpass@localhost:6379';
const redis = new Redis(redisUrl);

export default redis;

// Tạo global Redis PubSub
export const publisher = new Redis(redisUrl);
export const subscriber = new Redis(redisUrl);

// Helper functions để tương tác với Redis
export async function saveMessage(message: { id: string; roomId: string; content: string; sender: string; timestamp: number }): Promise<void> {
  try {
    // Lưu message vào Redis
    await redis.lpush(`messages:${message.roomId}`, JSON.stringify(message));
    await redis.ltrim(`messages:${message.roomId}`, 0, 99); // Giữ 100 tin nhắn gần nhất
    
    // Đảm bảo message được publish sau khi lưu thành công
    await publisher.publish(`chat:${message.roomId}`, JSON.stringify(message));
    console.log(`Message published to chat:${message.roomId}`, message.id);
  } catch (error) {
    console.error('Error in saveMessage:', error);
    throw error; // Re-throw để xử lý bên ngoài
  }
}

export async function getMessages(roomId: string, limit = 50): Promise<Message[]> {
  try {
    const messages = await redis.lrange(`messages:${roomId}`, 0, limit - 1);
    return messages.map(msg => JSON.parse(msg));
  } catch (error) {
    console.error(`Error getting messages for room ${roomId}:`, error);
    return []; // Trả về mảng rỗng thay vì lỗi
  }
}

export async function getRooms(): Promise<Room[]> {
  try {
    const roomIds = await redis.smembers('rooms');
    const rooms: Room[] = [];
    
    for (const id of roomIds) {
      const name = await redis.get(`room:${id}:name`);
      if (name) {
        rooms.push({ id, name });
      }
    }
    
    return rooms;
  } catch (error) {
    console.error('Error getting rooms:', error);
    return []; // Trả về mảng rỗng thay vì lỗi
  }
}

export async function createRoom(room: Room): Promise<void> {
  try {
    await redis.sadd('rooms', room.id);
    await redis.set(`room:${room.id}:name`, room.name);
    
    // Thông báo tạo phòng mới (tùy chọn)
    await publisher.publish('rooms:update', JSON.stringify({ type: 'create', room }));
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}