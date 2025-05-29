'use client';

import dynamic from 'next/dynamic';

// Dynamic import GameComponent với ssr disabled
const GameComponent = dynamic(() => import('../components/GameComponent'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 border-2 border-gray-700 rounded-lg shadow-lg" style={{ width: '800px', height: '450px' }}>
            <div className="text-white text-lg">Loading game...</div>
        </div>
    )
});

export default function GamePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Pokemon MMO Game
                    </h1>
                    <p className="text-xl text-gray-300">
                        Use arrow keys to move around the world
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
                        <GameComponent />
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-semibold text-white mb-4">Controls</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                            <div>
                                <h3 className="font-semibold text-white mb-2">Movement</h3>
                                <ul className="space-y-1">
                                    <li>↑ Arrow Key - Move Up</li>
                                    <li>↓ Arrow Key - Move Down</li>
                                    <li>← Arrow Key - Move Left</li>
                                    <li>→ Arrow Key - Move Right</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-2">Actions</h3>
                                <ul className="space-y-1">
                                    <li>Space - Interact with doors</li>
                                    <li>D - Toggle debug mode</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}