'use client';

import dynamic from 'next/dynamic';

// Dynamic import GameComponent với ssr disabled
const GameComponent = dynamic(() => import('../components/GameComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 border-2 border-gray-700 rounded-lg shadow-lg min-h-[300px] sm:min-h-[450px]">
            <div className="text-white text-lg">Loading game...</div>
        </div>
    )
});

export default function GamePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
                <div className="text-center mb-4 sm:mb-8">
                    <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
                        Pokemon MMO Game
                    </h1>
                    <p className="text-sm sm:text-xl text-gray-300 px-4">
                        Use joystick or arrow keys to move around the world
                    </p>
                </div>

                <div className="flex justify-center mb-4">
                    <div className="bg-gray-800 p-2 sm:p-6 rounded-lg shadow-2xl w-full max-w-4xl">
                        <GameComponent />
                    </div>
                </div>

                {/* Controls Info */}
                <div className="mt-4 sm:mt-8 text-center">
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 sm:p-6 max-w-2xl mx-auto mx-4">
                        <h2 className="text-lg sm:text-2xl font-semibold text-white mb-4">Controls</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300 text-sm sm:text-base">
                            <div>
                                <h3 className="font-semibold text-white mb-2">Movement</h3>
                                <ul className="space-y-1">
                                    <li className="hidden sm:block">↑ Arrow Key - Move Up</li>
                                    <li className="hidden sm:block">↓ Arrow Key - Move Down</li>
                                    <li className="hidden sm:block">← Arrow Key - Move Left</li>
                                    <li className="hidden sm:block">→ Arrow Key - Move Right</li>
                                    <li className="sm:hidden">Use left joystick to move</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">Actions</h3>
                                <ul className="space-y-1">
                                    <li className="hidden sm:block">Space - Interact with doors</li>
                                    <li className="hidden sm:block">D - Toggle debug mode</li>
                                    <li className="sm:hidden">Tap action buttons on right</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}