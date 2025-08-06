'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Phaser from 'phaser';
import { gameConfig } from '../../../game/gameConfig';

type JoystickState = {
    x: number;
    y: number;
    distance: number;
    angle: number;
    pressed: boolean;
}

interface GameComponentProps {
    selectedCategory?: string;
}

export default function GameComponent({ selectedCategory }: GameComponentProps) {
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
            
            // Set viewport meta for mobile
            if (isMobileDevice) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
                }
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        window.addEventListener('orientationchange', checkMobile);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('orientationchange', checkMobile);
        };
    }, []);

    // Simulate key press/release for Phaser
    const simulateKey = useCallback((key: string, type: 'down' | 'up') => {
        if (!gameRef.current) return;

        // Get the current scene - try both Scene1 and Scene2 (playGame)
        const scene = gameRef.current.scene.getScene('playGame') || gameRef.current.scene.getScene('bootGame');
        if (!scene?.input?.keyboard) return;

        // Map our directions to Phaser key codes
        const keyMappings: Record<string, number> = {
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
        e.stopPropagation();
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
        e.stopPropagation();
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
        e.stopPropagation();

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
        // Add haptic feedback for mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        setTimeout(() => simulateKey(action, 'up'), 100);
    }, [simulateKey]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Create game instance
        if (containerRef.current && !gameRef.current) {
            // Calculate responsive dimensions based on viewport
            const containerWidth = containerRef.current.offsetWidth;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            let maxWidth, maxHeight;
            
            if (isMobile) {
                // Mobile: use most of screen space for better gameplay
                maxWidth = Math.min(containerWidth - 4, viewportWidth - 8);
                maxHeight = Math.min(viewportHeight * 0.75, maxWidth * 0.7);
            } else {
                // Desktop: maximize game area
                maxWidth = Math.min(containerWidth - 16, viewportWidth * 0.95, 1200);
                maxHeight = Math.min(viewportHeight * 0.8, maxWidth * 0.65, 800);
            }

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
                },
            };

            gameRef.current = new Phaser.Game(config);

            if (isMobile && containerRef.current) {
                containerRef.current.addEventListener('contextmenu', (e) => e.preventDefault());
                
                // Prevent scrolling when touching the game area
                const preventScroll = (e: Event) => {
                    e.preventDefault();
                };
                
                containerRef.current.addEventListener('touchstart', preventScroll, { passive: false });
                containerRef.current.addEventListener('touchmove', preventScroll, { passive: false });
                containerRef.current.addEventListener('touchend', preventScroll, { passive: false });

                // Make sure the game canvas can receive focus for keyboard events
                const canvas = containerRef.current.querySelector('canvas');
                if (canvas) {
                    canvas.setAttribute('tabindex', '0');
                    canvas.style.outline = 'none';
                    canvas.style.touchAction = 'none';
                }
            }
        }

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [isMobile, selectedCategory]);

    // Store selected category globally for game access
    useEffect(() => {
        if (selectedCategory && typeof window !== 'undefined') {
            (window as any).gameCategory = selectedCategory;
        }
    }, [selectedCategory]);

    return (
        <div className={`relative w-full h-full flex items-center justify-center bg-gray-900 ${isMobile ? 'overflow-hidden' : ''}`}>
            <div
                ref={containerRef}
                className="border-2 border-gray-700 rounded-lg shadow-lg w-full h-auto"
                style={{
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    aspectRatio: isMobile ? '16/10' : '5/3',
                    maxWidth: '100%',
                    maxHeight: isMobile ? '75vh' : '80vh'
                }}
            />

            {/* Mobile Touch Controls */}
            {isMobile && (
                <>
                    {/* Virtual Joystick - Left Side */}
                    <div className="fixed bottom-4 left-2 z-50">
                        <div
                            ref={joystickRef}
                            className="relative w-28 h-28 bg-gray-800 bg-opacity-80 rounded-full border-4 border-gray-600 shadow-lg cursor-pointer select-none"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onTouchCancel={handleTouchEnd}
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
                                className="absolute w-10 h-10 bg-blue-500 rounded-full shadow-lg transition-all duration-75 pointer-events-none"
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
                    <div className="fixed bottom-4 right-2 z-50 flex flex-col space-y-3">
                        {/* Shoot Button */}
                        <button
                            className="w-20 h-20 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-full font-bold text-sm shadow-lg flex flex-col items-center justify-center select-none transform hover:scale-110 active:scale-95 transition-all duration-150 animate-pulse border-2 border-orange-400"
                            onTouchStart={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleActionPress(' ');
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleActionPress(' ');
                            }}
                            style={{
                                touchAction: 'manipulation',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                WebkitTouchCallout: 'none'
                            }}
                        >
                            <span className="text-xl">🔫</span>
                            <span className="text-sm font-bold">SHOOT</span>
                        </button>

                        {/* Special Button */}
                        <button
                            className="w-16 h-16 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-full font-bold text-sm shadow-lg flex flex-col items-center justify-center select-none transform hover:scale-110 active:scale-95 transition-all duration-150 border-2 border-purple-400"
                            onTouchStart={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleActionPress('d');
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleActionPress('d');
                            }}
                            style={{
                                touchAction: 'manipulation',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                WebkitTouchCallout: 'none'
                            }}
                        >
                            <span className="text-lg">🔥</span>
                            <span className="text-sm font-bold">POWER</span>
                        </button>

                        <div className="text-white text-xs text-center opacity-70 animate-bounce">🔫 Gun Combat</div>
                    </div>
                </>
            )}
        </div>
    );
}