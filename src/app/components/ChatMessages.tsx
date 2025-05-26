
import { useEffect, useRef } from 'react';
import { Message } from '../../lib/types';

interface ChatMessagesProps {
    messages: Message[];
    currentUser: string;
}

export default function ChatMessages({ messages, currentUser }: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
                const isCurrentUser = message.sender === currentUser;

                return (
                    <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs md:max-w-md p-3 rounded-lg ${isCurrentUser
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                }`}
                        >
                            {!isCurrentUser && (
                                <div className="font-bold text-sm mb-1">{message.sender}</div>
                            )}
                            <div>{message.content}</div>
                            <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}