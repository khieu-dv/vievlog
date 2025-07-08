// app/console/page.tsx
'use client';

import { useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import Image from 'next/image';

const appWindow = getCurrentWindow();

export default function Console() {
    useEffect(() => {
        const titlebar = document.getElementById('titlebar');
        titlebar?.addEventListener('mousedown', (e: MouseEvent) => {
            if (
                e.buttons === 1 &&
                e.detail !== 2 &&
                !(e.target as HTMLElement).closest('button')
            ) {
                appWindow.startDragging();
            }
        });
    }, []);

    const handleClear = () => {
        // Clear console logic
    };

    return (
        <div className="bg-custom-dark text-custom-text font-sans overflow-x-hidden select-none m-0 p-0 w-screen h-screen">
            <div id="titlebar" className="fixed w-full h-8 bg-custom-titlebar z-50 flex items-center justify-between" data-tauri-drag-region>
                <Image
                    className="w-8 h-8"
                    src="/common/assets/images/banner.png"
                    alt="Banner"
                    width={32}
                    height={32}
                />
                <div className="flex items-center gap-1 h-full">
                    <button
                        className="w-8 h-full text-xs text-custom-text-muted hover:text-red-300 hover:bg-custom-button rounded-lg transition-colors duration-200 cursor-pointer"
                        onClick={() => appWindow.minimize()}
                        id="titlebar-minimize-button"
                    >
                        _
                    </button>
                    <button
                        className="w-8 h-full text-xs text-custom-text-muted hover:text-red-300 hover:bg-custom-button rounded-lg transition-colors duration-200 cursor-pointer"
                        onClick={() => appWindow.close()}
                        id="titlebar-close-button"
                    >
                        x
                    </button>
                </div>
            </div>
            <div className="pt-8 p-4">
                <p className="text text--console">Console</p>
                <textarea
                    readOnly
                    className="w-full h-32 text-base bg-custom-console text-white border border-custom-border-light rounded-lg px-3 py-2 resize-none focus:border-custom-border-light focus:outline-none"
                    id="console-textarea"
                ></textarea>
                <button
                    className="button button--console-clear"
                    id="console-clear-button"
                    onClick={handleClear}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}