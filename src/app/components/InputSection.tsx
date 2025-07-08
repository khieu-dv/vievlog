// components/InputSection.tsx
'use client';

import { useState } from 'react';
import { isUrlPlaylist } from '../../lib/clone/utils';

export default function InputSection() {
    const [url, setUrl] = useState('');
    const [urlLabel, setUrlLabel] = useState('URL');

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        setUrlLabel(isUrlPlaylist(e.target.value) ? 'URL (Playlist Detected)' : 'URL');
    };

    const handleDoubleClick = () => {
        if (url) {
            // Invoke Tauri command to open URL
            // invoke('util_launch_url', { url });
        }
    };

    return (
        <div className="mb-4">
            <p className="text-2xl text-custom-text-dark mb-2">Input</p>
            <div className="bg-custom-panel border border-custom-border rounded-lg p-4">
                <p className="text-lg text-custom-text-muted mb-2">{urlLabel}</p>
                <input
                    type="text"
                    className="w-full h-12 text-lg bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 focus:border-custom-input-focus focus:outline-none"
                    id="input-url-textbox"
                    value={url}
                    onChange={handleUrlChange}
                    onDoubleClick={handleDoubleClick}
                />
            </div>
        </div>
    );
}