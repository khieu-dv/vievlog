'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

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

// English learning game titles  
const gameTitles = [
    "English Champion Arena 🎓",
    "Learn & Fight Academy ⚔️",
    "Grammar Warrior Quest 📚",
    "Vocabulary Battle Zone 💪",
    "Study Combat Academy 🏆",
    "English Mastery Arena 🌟",
    "Language Learning Quest ✨"
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
    const [currentTitle, setCurrentTitle] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTitle(prev => (prev + 1) % gameTitles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
            {/* Floating education background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-20">📚</div>
                <div className="absolute top-20 right-20 text-4xl animate-pulse opacity-20">🎓</div>
                <div className="absolute bottom-20 left-20 text-5xl animate-spin opacity-20">⭐</div>
                <div className="absolute bottom-10 right-10 text-3xl animate-bounce opacity-20" style={{animationDelay: '1s'}}>✏️</div>
                <div className="absolute top-1/2 left-1/4 text-2xl animate-pulse opacity-10" style={{animationDelay: '2s'}}>💡</div>
                <div className="absolute top-1/3 right-1/3 text-3xl animate-bounce opacity-10" style={{animationDelay: '1.5s'}}>🏆</div>
                <div className="absolute top-3/4 left-1/3 text-4xl animate-pulse opacity-15" style={{animationDelay: '3s'}}>📖</div>
                <div className="absolute top-1/4 right-1/4 text-2xl animate-bounce opacity-10" style={{animationDelay: '2.5s'}}>🧠</div>
            </div>
            
            <div className="container mx-auto px-1 sm:px-4 py-1 sm:py-2 relative z-10">
                <div className="text-center mb-1 sm:mb-3">
                    <h1 className="text-lg sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                        {gameTitles[currentTitle]}
                    </h1>
                </div>

                <div className="flex justify-center mb-1 sm:mb-2">
                    <div className="bg-gray-800 p-1 sm:p-2 rounded-lg shadow-2xl w-full max-w-6xl">
                        <GameComponent />
                    </div>
                </div>

                {/* Controls Info */}
                <div className="mt-1 sm:mt-2 text-center px-2">
                    <div className="bg-gray-800 bg-opacity-60 rounded-lg p-2 sm:p-3 max-w-xl mx-auto">
                        <div className="grid grid-cols-2 gap-2 text-gray-300 text-xs sm:text-sm">
                            <div className="text-center">
                                <span className="hidden sm:inline">⬆️⬇️⬅️➡️ Move</span>
                                <span className="sm:hidden text-yellow-300">🕹️ Use Joystick to Move</span>
                            </div>
                            <div className="text-center">
                                <span className="hidden sm:inline">Space/D - Shoot</span>
                                <span className="sm:hidden text-orange-300">🔫 Tap Buttons to Attack</span>
                            </div>
                        </div>
                        <div className="sm:hidden mt-2 text-center text-xs text-blue-300">
                            💡 Tap and hold for better control
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}