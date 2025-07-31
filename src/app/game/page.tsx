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
            
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 relative z-10">
                <div className="text-center mb-4 sm:mb-8">
                    <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4 transition-all duration-500 transform hover:scale-105 hover:text-yellow-300">
                        {gameTitles[currentTitle]}
                    </h1>
                    <p className="text-sm sm:text-xl text-gray-300 px-4 hover:text-blue-300 transition-colors duration-300">
                        📚 Defeat enemies to unlock English challenges and become the ultimate language champion! 🏆
                    </p>
                    <div className="mt-2 text-xs sm:text-sm text-blue-300 animate-pulse">
                        ✨ Learn English through epic battles - Knowledge is your greatest weapon! ✨
                    </div>
                </div>

                <div className="flex justify-center mb-4">
                    <div className="bg-gray-800 p-2 sm:p-6 rounded-lg shadow-2xl w-full max-w-4xl">
                        <GameComponent />
                    </div>
                </div>

                {/* Controls Info - Now with more fun! */}
                <div className="mt-4 sm:mt-8 text-center">
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 sm:p-6 max-w-2xl mx-auto mx-4 hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105">
                        <h2 className="text-lg sm:text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
                            🎓 Master The Art of Learning Combat 📚
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 text-sm sm:text-base">
                            <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 hover:bg-opacity-70 transition-all duration-300 border border-blue-800">
                                <h3 className="font-semibold text-yellow-300 mb-2 flex items-center gap-2">
                                    🏃‍♂️ Champion Movement Skills
                                </h3>
                                <ul className="space-y-2">
                                    <li className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
                                        <span className="text-lg">⬆️</span> Arrow Key - Move to victory!
                                    </li>
                                    <li className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
                                        <span className="text-lg">⬇️</span> Arrow Key - Advance forward!
                                    </li>
                                    <li className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
                                        <span className="text-lg">⬅️</span> Arrow Key - Strategic left move!
                                    </li>
                                    <li className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
                                        <span className="text-lg">➡️</span> Arrow Key - Power right dash!
                                    </li>
                                    <li className="sm:hidden flex items-center gap-2">
                                        <span className="text-lg">🕹️</span> Use champion joystick to explore!
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 hover:bg-opacity-70 transition-all duration-300 border border-blue-800">
                                <h3 className="font-semibold text-green-300 mb-2 flex items-center gap-2">
                                    ⚡ Learning Combat Actions
                                </h3>
                                <ul className="space-y-2">
                                    <li className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
                                        <span className="text-lg">🔫</span> Space - Shoot study bots!
                                    </li>
                                    <li className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
                                        <span className="text-lg">🔥</span> D - Special gun power!
                                    </li>
                                    <li className="sm:hidden flex items-center gap-2">
                                        <span className="text-lg">👆</span> Tap shoot button to blast bots!
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-blue-300 italic animate-pulse">
                            🔫 Marksman tip: Shoot bots to unlock English questions and earn points! 🎯
                        </div>
                    </div>
                </div>

                {/* Learning wisdom section */}
                <div className="mt-4 text-center">
                    <div className="bg-gradient-to-r from-blue-900 to-purple-900 bg-opacity-50 rounded-lg p-3 max-w-xl mx-auto mx-4 hover:from-blue-800 hover:to-purple-800 transition-all duration-300 border border-blue-700">
                        <p className="text-sm text-white flex items-center justify-center gap-2">
                            <span className="animate-pulse">🎓</span>
                            <span>Study Wisdom: "Knowledge gained through battle becomes wisdom that lasts forever"</span>
                            <span className="animate-bounce">📚</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}