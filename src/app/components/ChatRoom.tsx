'use client';

import { useEffect, useState, useRef } from 'react';
import { Message, Room } from '../../lib/types';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

interface ChatRoomProps {
    room: Room;
    username: string;
}

export default function ChatRoom({ room, username }: ChatRoomProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const eventSourceRef = useRef<EventSource | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageTracker = useRef(new Set<string>()); // Track message IDs

    // Scroll to bottom whenever messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Clear messages when changing rooms
        setMessages([]);
        setIsLoading(true);
        messageTracker.current.clear();

        // Close any existing SSE connection
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }

        // Fetch past messages
        const fetchMessages = async () => {
            try {
                const response = await fetch(`/api/messages?roomId=${room.id}`);
                if (response.ok) {
                    const data = await response.json();
                    const orderedMessages = data.reverse(); // Reverse to show newest at bottom

                    // Add message IDs to tracker
                    orderedMessages.forEach((msg: Message) => {
                        messageTracker.current.add(msg.id);
                    });

                    setMessages(orderedMessages);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();

        // Set up Server-Sent Events connection with proper error handling and reconnection
        const connectSSE = () => {
            console.log(`Connecting to SSE for room: ${room.id}`);

            // Force close any existing connection first
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }

            // Create new EventSource with cache busting to prevent caching issues
            const timestamp = Date.now();
            const eventSource = new EventSource(`/api/socket?roomId=${room.id}&_=${timestamp}`);
            eventSourceRef.current = eventSource;

            // Handle incoming messages
            eventSource.onopen = () => {
                console.log(`SSE connection opened for room: ${room.id}`);
            };

            eventSource.onmessage = (event) => {
                try {
                    const newMessage: Message = JSON.parse(event.data);
                    console.log('Received message via SSE:', newMessage);

                    // Only add message if we haven't seen it before
                    if (!messageTracker.current.has(newMessage.id)) {
                        messageTracker.current.add(newMessage.id);
                        setMessages(prevMessages => [...prevMessages, newMessage]);
                    }
                } catch (error) {
                    console.error('Error parsing SSE message:', error);
                }
            };

            eventSource.onerror = (err) => {
                console.error('SSE connection error:', err);

                // Close the broken connection
                eventSource.close();
                eventSourceRef.current = null;

                // Try to reconnect after a delay
                console.log('Attempting to reconnect SSE in 2 seconds...');
                setTimeout(connectSSE, 2000);
            };
        };

        // Start SSE connection
        connectSSE();

        // Cleanup function
        return () => {
            console.log('Cleaning up SSE connection');
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        };
    }, [room.id]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        // Create a unique message ID
        const messageId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const message: Message = {
            id: messageId,
            content: text,
            sender: username,
            roomId: room.id,
            timestamp: Date.now(),
        };

        // Add to tracker to prevent duplicates
        messageTracker.current.add(messageId);

        // Optimistic update - add to UI immediately
        setMessages(prevMessages => [...prevMessages, message]);

        try {
            // Send message to API
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message),
            });

            if (!response.ok) {
                console.error('Server rejected message:', await response.text());
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Could handle failed messages here (retry, show error, etc.)
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="border-b pb-2 mb-4">
                <h2 className="text-xl font-bold">{room.name}</h2>
            </div>
            {isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                </div>
            ) : (
                <div className="flex-grow overflow-y-auto">
                    <ChatMessages messages={messages} currentUser={username} />
                    <div ref={messagesEndRef} />
                </div>
            )}
            <ChatInput onSendMessage={sendMessage} />
        </div>
    );
}