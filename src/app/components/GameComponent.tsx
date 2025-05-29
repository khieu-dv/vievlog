'use client';

import { useEffect, useRef } from 'react';
import * as Phaser from 'phaser';
import { gameConfig } from '../../game/gameConfig';

export default function GameComponent() {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Create game instance
        if (containerRef.current && !gameRef.current) {
            const config = {
                ...gameConfig,
                parent: containerRef.current,
            };

            gameRef.current = new Phaser.Game(config);
        }

        // Cleanup function
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div
                ref={containerRef}
                className="border-2 border-gray-700 rounded-lg shadow-lg"
                style={{ width: '800px', height: '450px' }}
            />
        </div>
    );
}