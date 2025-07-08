// components/Titlebar.tsx
'use client';

import { getCurrentWindow } from '@tauri-apps/api/window';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const appWindow = getCurrentWindow();

interface TitlebarProps {
    deviceId: string;
}

export default function Titlebar({ deviceId }: TitlebarProps) {
    const router = useRouter();

    const handleMinimize = () => {
        appWindow.minimize();
    };

    const handleClose = async () => {
        // Implement cleanupAndClose logic
        appWindow.close();
    };

    const handleReset = () => {
        // Reset logic
    };

    const handleHistory = () => {
        router.push('/history');
    };

    return (
        <div
            id="titlebar"
            className="fixed w-full h-8 bg-custom-titlebar z-50 flex items-center justify-between"
            data-tauri-drag-region
        >
            <div className="flex items-center pointer-events-none">
                <Image
                    className="w-8 h-8"
                    src="/common/assets/images/banner.png"
                    alt="Banner"
                    width={32}
                    height={32}
                />
                <p className="text-xs font-bold text-custom-text-dark absolute left-36 -top-px">
                    v5.1.0
                </p>
                <p id="titlebar-id-text" className="text-sm text-custom-text-muted ml-2">
                    ID: {deviceId}
                </p>
            </div>
            <div className="flex items-center gap-1 h-full pointer-events-auto">
                <button
                    className="w-6 h-6 flex items-center justify-center bg-custom-titlebar-button text-custom-text-muted hover:text-red-300 hover:bg-custom-button transition-colors duration-200 cursor-pointer rounded-lg"
                    onClick={handleReset}
                    id="titlebar-reset-button"
                >
                    <Image
                        className="max-w-4 max-h-4"
                        src="/common/assets/images/reset.png"
                        alt="Reset"
                        width={16}
                        height={16}
                    />
                </button>
                <button
                    className="w-6 h-6 flex items-center justify-center bg-custom-titlebar-button text-custom-text-muted hover:text-red-300 hover:bg-custom-button transition-colors duration-200 cursor-pointer"
                    onClick={handleHistory}
                    id="titlebar-history-edit-button"
                >
                    <Image
                        className="max-w-4 max-h-4"
                        src="/common/assets/images/history.png"
                        alt="History"
                        width={16}
                        height={16}
                    />
                </button>
                <div className="w-px"></div>
                <button
                    className="w-8 h-full text-xs text-custom-text-muted hover:text-red-300 hover:bg-custom-button rounded-lg transition-colors duration-200 cursor-pointer"
                    onClick={handleMinimize}
                    id="titlebar-minimize-button"
                >
                    _
                </button>
                <button
                    className="w-8 h-full text-xs text-custom-text-muted hover:text-red-300 hover:bg-custom-button rounded-lg transition-colors duration-200 cursor-pointer"
                    onClick={handleClose}
                    id="titlebar-close-button"
                >
                    x
                </button>
            </div>
        </div>
    );
}