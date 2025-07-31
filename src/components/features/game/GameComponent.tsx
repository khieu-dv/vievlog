'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Phaser from 'phaser';
import { gameConfig } from '../../../game/gameConfig';

interface JoystickState {
    x: number;
    y: number;
    distance: number;
    angle: number;
    pressed: boolean;
}

export default function GameComponent() {
    const gameRef = useRef<Phaser.Game | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const joystickRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [joystick, setJoystick] = useState<JoystickState>({
        x: 0, y: 0, distance: 0, angle: 0, pressed: false
    });

    // Current pressed keys for continuous movement
    const pressedKeys = useRef<Set<string>>(new Set());
    const touchStartPos = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        // Detect mobile device
        const checkMobile = () => {
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
            setIsMobile(isMobileDevice);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Simulate key press/release for Phaser
    const simulateKey = useCallback((key: string, type: 'down' | 'up') => {
        if (!gameRef.current) return;

        // Get the current scene - try both Scene1 and Scene2 (playGame)
        const scene = gameRef.current.scene.getScene('playGame') || gameRef.current.scene.getScene('bootGame');
        if (!scene || !scene.input || !scene.input.keyboard) return;

        // Map our directions to Phaser key codes
        const keyMappings: { [key: string]: number } = {
            'Up': Phaser.Input.Keyboard.KeyCodes.UP,
            'Down': Phaser.Input.Keyboard.KeyCodes.DOWN,
            'Left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'Right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            ' ': Phaser.Input.Keyboard.KeyCodes.SPACE,
            'd': Phaser.Input.Keyboard.KeyCodes.D
        };

        const keyCode = keyMappings[key];
        if (!keyCode) return;

        // Create keyboard event for Phaser
        const keyboardEvent = {
            keyCode: keyCode,
            key: key === ' ' ? ' ' : key.toLowerCase(),
            code: key === ' ' ? 'Space' : key === 'd' ? 'KeyD' : `Arrow${key}`,
            preventDefault: () => { },
            stopPropagation: () => { }
        };

        try {
            // Dispatch to Phaser's keyboard manager
            if (type === 'down') {
                scene.input.keyboard.emit('keydown', keyboardEvent as any);
            } else {
                scene.input.keyboard.emit('keyup', keyboardEvent as any);
            }
        } catch (error) {
            console.log('Phaser keyboard event error:', error);
        }

        // Also dispatch browser event as fallback
        try {
            const browserEvent = new KeyboardEvent(`key${type}`, {
                key: key === ' ' ? ' ' : key === 'd' ? 'd' : `Arrow${key}`,
                code: key === ' ' ? 'Space' : key === 'd' ? 'KeyD' : `Arrow${key}`,
                keyCode: keyCode,
                bubbles: true,
                cancelable: true
            });

            window.dispatchEvent(browserEvent);
            if (containerRef.current) {
                containerRef.current.dispatchEvent(browserEvent);
            }
        } catch (error) {
            console.log('Browser keyboard event error:', error);
        }
    }, []);

    // Handle joystick movement
    const handleJoystickMove = useCallback((x: number, y: number, distance: number) => {
        const deadZone = 0.15;
        const maxDistance = 50;
        const normalizedDistance = Math.min(distance / maxDistance, 1);

        if (normalizedDistance < deadZone) {
            // Release all movement keys
            ['Up', 'Down', 'Left', 'Right'].forEach(direction => {
                if (pressedKeys.current.has(direction)) {
                    simulateKey(direction, 'up');
                    pressedKeys.current.delete(direction);
                }
            });
            return;
        }

        const angle = Math.atan2(y, x);
        const degrees = (angle * 180 / Math.PI + 360) % 360;

        // Determine primary direction with better angle ranges
        let newDirection = '';
        if ((degrees >= 315 && degrees < 360) || (degrees >= 0 && degrees < 45)) {
            newDirection = 'Right';
        } else if (degrees >= 45 && degrees < 135) {
            newDirection = 'Down';
        } else if (degrees >= 135 && degrees < 225) {
            newDirection = 'Left';
        } else if (degrees >= 225 && degrees < 315) {
            newDirection = 'Up';
        }

        // Release keys that are no longer active
        ['Up', 'Down', 'Left', 'Right'].forEach(direction => {
            if (direction !== newDirection && pressedKeys.current.has(direction)) {
                simulateKey(direction, 'up');
                pressedKeys.current.delete(direction);
            }
        });

        // Press new direction key
        if (newDirection && !pressedKeys.current.has(newDirection)) {
            simulateKey(newDirection, 'down');
            pressedKeys.current.add(newDirection);
        }
    }, [simulateKey]);

    // Touch event handlers for joystick
    const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        if (!joystickRef.current) return;

        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - centerX;
        const y = clientY - centerY;
        const distance = Math.sqrt(x * x + y * y);

        touchStartPos.current = { x: clientX, y: clientY };

        setJoystick(prev => ({
            ...prev,
            pressed: true,
            x: x,
            y: y,
            distance: distance
        }));

        handleJoystickMove(x, y, distance);
    }, [handleJoystickMove]);

    const handleTouchMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
        if (!joystick.pressed || !joystickRef.current || !touchStartPos.current) return;

        const rect = joystickRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - centerX;
        const y = clientY - centerY;
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = 50;

        // Clamp to circle
        const clampedX = distance > maxDistance ? (x / distance) * maxDistance : x;
        const clampedY = distance > maxDistance ? (y / distance) * maxDistance : y;

        setJoystick(prev => ({
            ...prev,
            x: clampedX,
            y: clampedY,
            distance: Math.min(distance, maxDistance)
        }));

        handleJoystickMove(clampedX, clampedY, Math.min(distance, maxDistance));
    }, [joystick.pressed, handleJoystickMove]);

    const handleTouchEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();

        // Release all movement keys
        ['Up', 'Down', 'Left', 'Right'].forEach(direction => {
            if (pressedKeys.current.has(direction)) {
                simulateKey(direction, 'up');
                pressedKeys.current.delete(direction);
            }
        });

        touchStartPos.current = null;
        setJoystick({ x: 0, y: 0, distance: 0, angle: 0, pressed: false });
    }, [simulateKey]);

    // Action button handlers
    const handleActionPress = useCallback((action: string) => {
        simulateKey(action, 'down');
        setTimeout(() => simulateKey(action, 'up'), 150);
    }, [simulateKey]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Create game instance
        if (containerRef.current && !gameRef.current) {
            // Calculate responsive dimensions
            const containerWidth = containerRef.current.offsetWidth;
            const maxWidth = isMobile ? Math.min(containerWidth - 16, 380) : 800;
            const maxHeight = isMobile ? Math.min(maxWidth * 0.6, 280) : 450;

            const config = {
                ...gameConfig,
                parent: containerRef.current,
                width: maxWidth,
                height: maxHeight,
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: maxWidth,
                    height: maxHeight,
                },
                render: {
                    antialias: !isMobile,
                    pixelArt: isMobile,
                },
                input: {
                    keyboard: true,
                    touch: true
                }
            };

            gameRef.current = new Phaser.Game(config);

            if (isMobile && containerRef.current) {
                containerRef.current.addEventListener('contextmenu', (e) => e.preventDefault());

                // Make sure the game canvas can receive focus for keyboard events
                const canvas = containerRef.current.querySelector('canvas');
                if (canvas) {
                    canvas.setAttribute('tabindex', '0');
                    canvas.style.outline = 'none';
                }
            }
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [isMobile]);

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
            <div
                ref={containerRef}
                className={`border-2 border-gray-700 rounded-lg shadow-lg ${isMobile
                    ? 'w-full max-w-sm h-auto min-h-[280px]'
                    : 'w-[800px] h-[450px]'
                    }`}
                style={{
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitTapHighlightColor: 'transparent',
                }}
            />

            {/* Mobile Touch Controls */}
            {isMobile && (
                <>
                    {/* Virtual Joystick - Left Side */}
                    <div className="fixed bottom-20 left-6 z-50">
                        <div
                            ref={joystickRef}
                            className="relative w-24 h-24 bg-gray-800 bg-opacity-70 rounded-full border-4 border-gray-600 shadow-lg cursor-pointer select-none"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onMouseDown={handleTouchStart}
                            onMouseMove={handleTouchMove}
                            onMouseUp={handleTouchEnd}
                            onMouseLeave={handleTouchEnd}
                            style={{
                                touchAction: 'none',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                WebkitTouchCallout: 'none'
                            }}
                        >
                            {/* Joystick Knob */}
                            <div
                                ref={knobRef}
                                className="absolute w-8 h-8 bg-blue-500 rounded-full shadow-lg transition-all duration-75 pointer-events-none"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(-50%, -50%) translate(${joystick.x}px, ${joystick.y}px)`,
                                    backgroundColor: joystick.pressed ? '#3b82f6' : '#60a5fa'
                                }}
                            />
                            {/* Center Dot */}
                            <div className="absolute w-2 h-2 bg-gray-400 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <div className="text-white text-xs text-center mt-2 opacity-70 animate-pulse">🎓 Champion Move</div>
                    </div>

                    {/* Action Buttons - Right Side */}
                    <div className="fixed bottom-20 right-6 z-50 flex flex-col space-y-3">
                        {/* Shoot Button */}
                        <button
                            className="w-16 h-16 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-full font-bold text-xs shadow-lg flex flex-col items-center justify-center select-none transform hover:scale-110 active:scale-95 transition-all duration-150 animate-pulse border-2 border-orange-400"
                            onTouchStart={(e) => {
                                e.preventDefault();
                                handleActionPress(' ');
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleActionPress(' ');
                            }}
                            style={{
                                touchAction: 'manipulation',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                WebkitTouchCallout: 'none'
                            }}
                        >
                            <span className="text-lg">🔫</span>
                            <span className="text-xs">SHOOT!</span>
                        </button>

                        {/* Special Button */}
                        <button
                            className="w-12 h-12 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-full font-bold text-xs shadow-lg flex flex-col items-center justify-center select-none transform hover:scale-110 active:scale-95 transition-all duration-150 border border-purple-400"
                            onTouchStart={(e) => {
                                e.preventDefault();
                                handleActionPress('d');
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleActionPress('d');
                            }}
                            style={{
                                touchAction: 'manipulation',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                WebkitTouchCallout: 'none'
                            }}
                        >
                            <span className="text-sm">🔥</span>
                            <span className="text-xs">POWER</span>
                        </button>

                        <div className="text-white text-xs text-center opacity-70 animate-bounce">🔫 Gun Combat</div>
                    </div>
                </>
            )}
        </div>
    );
}