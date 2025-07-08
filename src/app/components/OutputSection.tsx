// components/OutputSection.tsx
'use client';

import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { selectFolderDialogAsync } from '../../lib/clone/utils';
import Image from 'next/image';

export default function OutputSection() {
    const [name, setName] = useState('');
    const [path, setPath] = useState('');
    const [nameLabel, setNameLabel] = useState('Name (Auto)');

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setNameLabel(e.target.value ? 'Name' : 'Name (Auto)');
    };

    const handleSelectPath = async () => {
        const selectedPath = await selectFolderDialogAsync();
        setPath(selectedPath);
    };

    const handleOpenPath = () => {
        // invoke('util_open_path_location', { path });
    };

    const handleDownload = () => {
        // Implement download logic
    };

    return (
        <div className="mb-4">
            <p className="text-2xl text-custom-text-dark mb-2">Output</p>
            <div className="bg-custom-panel border border-custom-border rounded-lg">
                <div className="border-b border-custom-border-light p-4 rounded-t-lg">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-lg text-custom-text-muted mb-2" id="output-name-text">
                                {nameLabel}
                            </p>
                            <input
                                type="text"
                                className="w-full h-12 text-lg bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 focus:border-custom-input-focus focus:outline-none"
                                id="output-name-textbox"
                                value={name}
                                onChange={handleNameChange}
                            />
                        </div>
                        <div>
                            <p className="text-lg text-custom-text-muted mb-2">Path</p>
                            <div className="flex">
                                <button
                                    className="w-12 h-12 bg-custom-button text-custom-text border border-custom-border rounded-l-lg hover:bg-custom-button-hover transition-colors duration-200 cursor-pointer flex items-center justify-center"
                                    onClick={handleSelectPath}
                                    id="output-path-button"
                                >
                                    <Image
                                        className="max-w-6 max-h-6"
                                        src="/common/assets/images/folder.png"
                                        alt="Folder"
                                        width={24}
                                        height={24}
                                    />
                                </button>
                                <input
                                    type="text"
                                    className="flex-1 h-12 text-lg bg-custom-input text-custom-text border-t border-b border-custom-border px-3 focus:border-custom-input-focus focus:outline-none"
                                    id="output-path-textbox"
                                    value={path}
                                    readOnly
                                />
                                <button
                                    className="w-12 h-12 bg-custom-button text-custom-text border border-custom-border rounded-r-lg hover:bg-custom-button-hover transition-colors duration-200 cursor-pointer flex items-center justify-center"
                                    onClick={handleOpenPath}
                                    id="output-path-open-button"
                                >
                                    <Image
                                        className="max-w-6 max-h-6"
                                        src="/common/assets/images/open.png"
                                        alt="Open"
                                        width={24}
                                        height={24}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <button
                        className="w-full h-20 text-2xl font-bold bg-custom-green-dark text-custom-green border border-green-600 rounded-lg hover:bg-custom-green-hover hover:text-green-400 transition-all duration-500 hover:shadow-lg hover:shadow-green-400/20 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                        id="output-download-button"
                        onClick={handleDownload}
                    >
                        Download
                    </button>
                </div>
                {/* Add Console Panel */}
            </div>
        </div>
    );
}