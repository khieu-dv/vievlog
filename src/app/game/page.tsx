'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// English learning loading messages
const loadingMessages = [
    "📚 Loading vocabulary...",
    "✏️ Preparing grammar lessons...",
    "🎓 Setting up study arena...",
    "📖 Organizing question database...",
    "🧠 Activating learning mode...",
    "💡 Charging knowledge power...",
    "📝 Preparing English challenges...",
    "🌟 Initializing education magic...",
    "🎯 Loading language targets...",
    "🏆 Preparing champion trials..."
];


// Dynamic import GameComponent với ssr disabled
const GameComponent = dynamic(() => import('../../components/features/game/GameComponent'), {
    ssr: false,
    loading: () => {
        const [currentMessage, setCurrentMessage] = useState(0);
        
        useEffect(() => {
            const interval = setInterval(() => {
                setCurrentMessage(prev => (prev + 1) % loadingMessages.length);
            }, 1500);
            return () => clearInterval(interval);
        }, []);

        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 border-2 border-gray-700 rounded-lg shadow-lg min-h-[300px] sm:min-h-[450px] animate-pulse">
                <div className="text-white text-lg mb-4 animate-bounce">
                    {loadingMessages[currentMessage]}
                </div>
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                </div>
            </div>
        );
    }
});

export default function GamePage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
            
            {/* Back to Home Button */}
            <div className="absolute top-2 left-2 z-20">
                <Link 
                    href="/"
                    className="flex items-center gap-1 bg-gray-800/90 hover:bg-gray-700/90 text-white px-3 py-1.5 rounded-md shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 border border-gray-600/50 text-sm"
                >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Home</span>
                </Link>
            </div>
            
            <div className="container mx-auto px-1 py-1 relative z-10 h-screen flex flex-col">
                {/* Minimal title for mobile, hidden on desktop after initial load */}
                <div className="text-center mb-1 sm:hidden">
                    <h1 className="text-sm font-bold text-white/80">
                        English Champion Arena 🎓
                    </h1>
                </div>

                {/* Game container - takes most of the space */}
                <div className="flex justify-center flex-1">
                    <div className="bg-gray-800/50 p-1 rounded-lg shadow-2xl w-full max-w-7xl h-full">
                        <GameComponent />
                    </div>
                </div>

                {/* Minimal controls info - only for desktop */}
                <div className="hidden sm:block mt-1 text-center">
                    <div className="bg-gray-800/40 rounded p-1 max-w-md mx-auto">
                        <div className="text-gray-400 text-xs">
                            Arrow Keys: Move | Space: Shoot | D: Special
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}