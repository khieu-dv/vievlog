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
    const [socket, setSocket] = useState<WebSocket | null>(null);

    // Kết nối WebSocket khi component được mount hoặc room thay đổi
    useEffect(() => {
        // Đóng socket cũ nếu có
        if (socket) {
            socket.close();
        }

        // Lấy tin nhắn cũ
        const fetchMessages = async () => {
            const response = await fetch(`/api/messages?roomId=${room.id}`);
            if (response.ok) {
                const data = await response.json();
                setMessages(data.reverse()); // Đảo ngược để hiển thị tin nhắn mới nhất ở dưới
            }
        };

        fetchMessages();

        // Kết nối WebSocket mới
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const newSocket = new WebSocket(`${protocol}://${window.location.host}/api/socket?roomId=${room.id}`);

        newSocket.onopen = () => {
            console.log('WebSocket connected');
        };

        newSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        newSocket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setSocket(newSocket);

        // Dọn dẹp khi component unmount
        return () => {
            if (newSocket) {
                newSocket.close();
            }
        };
    }, [room.id]);

    const sendMessage = (text: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const message: Message = {
                id: Math.random().toString(36).substring(2, 15),
                content: text,
                sender: username,
                roomId: room.id,
                timestamp: Date.now(),
            };

            socket.send(JSON.stringify(message));

            // Optimistic update
            setMessages((prevMessages) => [...prevMessages, message]);
        }
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