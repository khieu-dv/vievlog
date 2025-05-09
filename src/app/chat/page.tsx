'use client';

import { useEffect, useState } from 'react';
import { Room } from '../../lib/types';
import ChatRoom from '../components/ChatRoom';
import { Header } from "~/ui/components/header";

export default function ChatPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [newRoomName, setNewRoomName] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedUsername = localStorage.getItem('chatUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setIsUsernameSet(true);
        }

        const fetchRooms = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/rooms');
                if (response.ok) {
                    const data = await response.json();
                    setRooms(data);
                    if (data.length > 0 && !selectedRoom) {
                        setSelectedRoom(data[0]);
                    }
                } else {
                    setError('Failed to load rooms');
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
                setError('Error connecting to server');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
        const intervalId = setInterval(fetchRooms, 30000);
        return () => clearInterval(intervalId);
    }, []);

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newRoomName.trim()) {
            try {
                const response = await fetch('/api/rooms', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newRoomName }),
                });

                if (response.ok) {
                    const newRoom = await response.json();
                    setRooms(prevRooms => [...prevRooms, newRoom]);
                    setSelectedRoom(newRoom);
                    setNewRoomName('');
                } else {
                    setError('Failed to create room');
                }
            } catch (error) {
                console.error('Error creating room:', error);
                setError('Error connecting to server');
            }
        }
    };

    const handleSetUsername = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            localStorage.setItem('chatUsername', username);
            setIsUsernameSet(true);
        }
    };

    if (!isUsernameSet) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
                <Header />
                <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Nhập tên hiển thị</h2>
                    <form onSubmit={handleSetUsername}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border dark:border-gray-600 rounded mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[80vh]">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow md:col-span-1 flex flex-col h-full">
                    <h2 className="text-xl font-bold mb-4">Phòng chat</h2>
                    <div className="mb-4">
                        <form onSubmit={handleCreateRoom} className="flex gap-2">
                            <input
                                type="text"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                                className="flex-grow p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

                    {error && (
                        <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 p-2 mb-4 rounded">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                        </div>
                    ) : (
                        <div className="overflow-y-auto flex-grow">
                            {rooms.length === 0 ? (
                                <p className="text-center text-gray-500 dark:text-gray-400 p-4">
                                    Không có phòng nào. Hãy tạo phòng mới.
                                </p>
                            ) : (
                                <ul className="space-y-2">
                                    {rooms.map((room) => (
                                        <li key={room.id}>
                                            <button
                                                onClick={() => setSelectedRoom(room)}
                                                className={`w-full text-left p-2 rounded transition ${selectedRoom?.id === room.id
                                                    ? 'bg-blue-100 dark:bg-blue-900 font-bold'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {room.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow md:col-span-3 h-full">
                    {selectedRoom ? (
                        <ChatRoom room={selectedRoom} username={username} />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 dark:text-gray-400">
                                {rooms.length === 0
                                    ? 'Tạo một phòng mới để bắt đầu trò chuyện'
                                    : 'Chọn một phòng để bắt đầu trò chuyện'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
