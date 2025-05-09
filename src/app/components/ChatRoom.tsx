// Component ChatRoom
// components/ChatRoom.tsx
'use client';

import { useEffect, useState } from 'react';
import { Message, Room } from '../../lib/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatRoomProps {
    room: Room;
    username: string;
}

export default function ChatRoom({ room, username }: ChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // Lấy tin nhắn cũ
        const fetchMessages = async () => {
            const response = await fetch(`/api/messages?roomId=${room.id}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data.reverse()); // Đảo ngược để hiển thị tin nhắn mới nhất ở dưới
            }
        };

        fetchMessages();

        // Kết nối bằng Server-Sent Events (SSE)
        const eventSource = new EventSource(`/api/socket?roomId=${room.id}`);

        eventSource.onmessage = (event) => {
            const message: Message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        eventSource.onerror = (err) => {
            console.error('SSE connection error:', err);
            eventSource.close();
        };

        // Dọn dẹp khi component unmount
        return () => {
            eventSource.close();
        };
    }, [room.id]);

    const sendMessage = async (text: string) => {
        const message: Message = {
            id: Math.random().toString(36).substring(2, 15),
            content: text,
            sender: username,
            roomId: room.id,
            timestamp: Date.now(),
        };

        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });

        // Optimistic update
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="border-b pb-2 mb-4">
                <h2 className="text-xl font-bold">{room.name}</h2>
            </div>
            <ChatMessages messages={messages} currentUser={username} />
            <ChatInput onSendMessage={sendMessage} />
        </div>
    );
}
