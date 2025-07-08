// components/SettingsSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { IPCDownloadConfig } from '../../lib/clone/types';

export default function SettingsSection() {
    const [config, setConfig] = useState<IPCDownloadConfig>(createIPCDownloadConfig());
    const [uiEnableState, setUiEnableState] = useState({
        trimEnable: true,
        sizeEnable: false,
        framerateEnable: false,
        vbrEnable: false,
        abrEnable: false,
    });

    useEffect(() => {
        updateSettingsUI();
    }, [config.settings.format]);

    const updateSettingsUI = () => {
        const selectedFormat = config.settings.format;
        let newUiEnableState = {
            trimEnable: false,
            sizeEnable: false,
            framerateEnable: false,
            vbrEnable: false,
            abrEnable: false,
        };

        switch (selectedFormat) {
            case 'mp4-fast':
                newUiEnableState = { trimEnable: true, sizeEnable: false, framerateEnable: false, vbrEnable: false, abrEnable: false };
                break;
            case 'mp4':
            case 'mp4-nvidia':
            case 'mp4-amd':
            case 'webm':
                newUiEnableState = { trimEnable: true, sizeEnable: true, framerateEnable: true, vbrEnable: true, abrEnable: true };
                break;
            // Add other cases as in the original settings-ui-handler.ts
        }

        setUiEnableState(newUiEnableState);
    };

    const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConfig((prev) => ({
            ...prev,
            settings: { ...prev.settings, format: e.target.value },
        }));
    };

    return (
        <div className="mb-4">
            <p className="text-2xl text-custom-text-dark mb-2">Settings</p>
            <div className="bg-custom-panel border border-custom-border rounded-lg">
                <div className="bg-custom-titlebar p-4 rounded-t-lg">
                    <p className="text-lg text-custom-text-muted mb-2">Format</p>
                    <select
                        className="w-full h-12 text-lg bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 cursor-pointer focus:border-custom-border-light focus:outline-none"
                        id="settings-format-select"
                        value={config.settings.format}
                        onChange={handleFormatChange}
                    >
                        <optgroup label="Video">
                            <option value="mp4-fast" type-value="video">
                                mp4 (fast)
                            </option>
                            {/* Add other options */}
                        </optgroup>
                    </select>
                </div>
                {/* Add other settings panels (Size/FPS, Trim, Bitrate, Arguments) similarly */}
            </div>
        </div>
    );
}

function createIPCDownloadConfig(): IPCDownloadConfig | (() => IPCDownloadConfig) {
    throw new Error('Function not implemented.');
}
