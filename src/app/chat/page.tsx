
// Trang chat
// app/chat/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Room } from '../../lib/types';
import ChatRoom from '../components/ChatRoom';

export default function ChatPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [newRoomName, setNewRoomName] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);

    useEffect(() => {
        // Lấy danh sách phòng
        const fetchRooms = async () => {
            const response = await fetch('/api/rooms');
            if (response.ok) {
                const data = await response.json();
                setRooms(data);
                if (data.length > 0) {
                    setSelectedRoom(data[0]);
                }
            }
        };

        fetchRooms();
    }, []);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newRoomName.trim()) {
            const response = await fetch('/api/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newRoomName }),
            });

            if (response.ok) {
                const newRoom = await response.json();
                setRooms([...rooms, newRoom]);
                setNewRoomName('');
            }
        }
    };

    const handleSetUsername = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            setIsUsernameSet(true);
        }
    };

    if (!isUsernameSet) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Nhập tên hiển thị</h2>
                <form onSubmit={handleSetUsername}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Tên của bạn"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Tiếp tục
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[80vh]">
            <div className="bg-white p-4 rounded-lg shadow md:col-span-1 flex flex-col h-full">
                <h2 className="text-xl font-bold mb-4">Phòng chat</h2>
                <div className="mb-4">
                    <form onSubmit={handleCreateRoom} className="flex gap-2">
                        <input
                            type="text"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            className="flex-grow p-2 border rounded"
                            placeholder="Tên phòng mới"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Tạo
                        </button>
                    </form>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <ul className="space-y-2">
                        {rooms.map((room) => (
                            <li key={room.id}>
                                <button
                                    onClick={() => setSelectedRoom(room)}
                                    className={`w-full text-left p-2 rounded ${selectedRoom?.id === room.id ? 'bg-blue-100 font-bold' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    {room.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow md:col-span-3 h-full">
                {selectedRoom ? (
                    <ChatRoom room={selectedRoom} username={username} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Chọn một phòng để bắt đầu trò chuyện</p>
                    </div>
                )}
            </div>
        </div>
    );
}