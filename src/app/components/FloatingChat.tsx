'use client';

import { useEffect, useState } from 'react';
import { Room } from '../../lib/types';
import ChatRoom from './ChatRoom';
import { X } from 'lucide-react';

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [username, setUsername] = useState('');
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedUsername = localStorage.getItem('chatUsername');
        if (savedUsername) {
            setUsername(savedUsername);
            setIsUsernameSet(true);
        }

        const fetchRooms = async () => {
            try {
                const res = await fetch('/api/rooms');
                if (res.ok) {
                    const data = await res.json();
                    setRooms(data);
                    if (data.length > 0 && !selectedRoom) {
                        setSelectedRoom(data[0]);
                    }
                } else {
                    setError('Lỗi tải phòng');
                }
            } catch {
                setError('Lỗi kết nối server');
            }
        };

        fetchRooms();
        const interval = setInterval(fetchRooms, 30000);
        return () => clearInterval(interval);
    }, []);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSetUsername = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            localStorage.setItem('chatUsername', username);
            setIsUsernameSet(true);
        }
    };

    return (
        <>
            {/* Chat toggle button */}
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
            >
                💬
            </button>

            {/* Chat popup */}
            {isOpen && (
                <div className="fixed bottom-20 right-6 w-[350px] max-h-[80vh] bg-white shadow-2xl rounded-xl overflow-hidden z-50 flex flex-col">
                    <div className="flex items-center justify-between p-3 border-b">
                        <h3 className="font-bold text-lg">Trò chuyện</h3>
                        <button onClick={toggleChat}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {!isUsernameSet ? (
                        <form onSubmit={handleSetUsername} className="p-4">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tên của bạn"
                                className="w-full p-2 border rounded mb-3"
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                                Tiếp tục
                            </button>
                        </form>
                    ) : selectedRoom ? (
                        <div className="flex-1 overflow-y-auto">
                            <ChatRoom room={selectedRoom} username={username} />
                        </div>
                    ) : (
                        <div className="p-4 text-gray-500">
                            {error || 'Không có phòng nào'}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
