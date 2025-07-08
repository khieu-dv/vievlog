'use client';

import { useEffect, useState } from 'react';
import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";
import { fetch } from '@tauri-apps/plugin-http';

// Types
interface IPCUserConfig {
    // Add your user config properties here
    [key: string]: any;
}

interface IPCDownloadConfig {
    // Add your download config properties here
    [key: string]: any;
}

interface Global {
    userConfig: IPCUserConfig;
    downloadQueue: IPCDownloadConfig[];
    downloadHistory: IPCDownloadConfig[];
}

// Initialize appWindow
const appWindow = getCurrentWindow();

// Global state (you might want to move this to a context or state management solution)
let GLOBAL: Global = {
    userConfig: {}, // Replace with createIPCUserConfig() when available
    downloadQueue: [],
    downloadHistory: []
};

export default function ClonePage() {
    const [deviceId, setDeviceId] = useState<string>('Loading...');
    const [consoleOutput, setConsoleOutput] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [progressWidth, setProgressWidth] = useState<number>(0);

    // Form states
    const [inputUrl, setInputUrl] = useState<string>('');
    const [outputName, setOutputName] = useState<string>('');
    const [outputPath, setOutputPath] = useState<string>('');

    // Checkbox states
    const [changeSizeEnabled, setChangeSizeEnabled] = useState<boolean>(false);
    const [changeFpsEnabled, setChangeFpsEnabled] = useState<boolean>(false);
    const [trimEnabled, setTrimEnabled] = useState<boolean>(false);
    const [trimStartEnabled, setTrimStartEnabled] = useState<boolean>(false);
    const [trimEndEnabled, setTrimEndEnabled] = useState<boolean>(false);
    const [videoBitrateEnabled, setVideoBitrateEnabled] = useState<boolean>(false);
    const [audioBitrateEnabled, setAudioBitrateEnabled] = useState<boolean>(false);
    const [ytdlpArgsEnabled, setYtdlpArgsEnabled] = useState<boolean>(false);
    const [ffmpegArgsEnabled, setFfmpegArgsEnabled] = useState<boolean>(false);
    const [queueEnabled, setQueueEnabled] = useState<boolean>(false);

    // Input states
    const [width, setWidth] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [framerate, setFramerate] = useState<string>('');
    const [trimStart, setTrimStart] = useState<string>('');
    const [trimEnd, setTrimEnd] = useState<string>('');
    const [videoBitrate, setVideoBitrate] = useState<string>('');
    const [audioBitrate, setAudioBitrate] = useState<string>('');
    const [ytdlpArgs, setYtdlpArgs] = useState<string>('');
    const [ffmpegArgs, setFfmpegArgs] = useState<string>('');

    // Functions
    const displayDeviceId = async (): Promise<string | null> => {
        try {
            const id = await invoke("generate_app_id");
            const idString = id as string;
            setDeviceId(idString || "N/A");
            return idString;
        } catch (error) {
            console.error("Failed to get device ID:", error);
            setDeviceId("Error");
            return null;
        }
    };

    const checkDownloadPermission = async (userId: string): Promise<{ status: boolean; message?: string }> => {
        try {
            const response = await fetch("https://api.vietopik.com/api/v1/user/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId,
                }),
            });

            const data = await response.json() as { status: boolean; message?: string; error?: string };
            return {
                status: data.status,
                message: data.message || data.error || "Unknown error",
            };
        } catch (error) {
            console.error("API call failed:", error);
            return {
                status: false,
                message: "Failed to connect to the server",
            };
        }
    };

    const startDownload = async (): Promise<void> => {
        const userId = await displayDeviceId();

        if (!userId || typeof userId !== "string") {
            setConsoleOutput(prev => "Error: Could not retrieve user ID\n" + prev);
            return;
        }

        setIsDownloading(true);
        const permission = await checkDownloadPermission(userId);

        if (permission.status) {
            setConsoleOutput(prev => `Download permitted: ${permission.message || "Starting download"}\n` + prev);
            // Add your download logic here
            // await invoke("start_download", { config: GLOBAL.downloadQueue });
        } else {
            setConsoleOutput(prev => `Error: ${permission.message}\n` + prev);
        }

        setIsDownloading(false);
    };

    const handleTitlebarAction = async (action: 'minimize' | 'close' | 'reset' | 'history') => {
        try {
            switch (action) {
                case 'minimize':
                    await appWindow.minimize();
                    break;
                case 'close':
                    await appWindow.close();
                    break;
                case 'reset':
                    // Add reset logic
                    break;
                case 'history':
                    // Add history logic
                    break;
            }
        } catch (error) {
            console.error(`Failed to ${action} window:`, error);
        }
    };

    const handleFolderSelect = async (): Promise<void> => {
        // Add folder selection logic using Tauri's dialog API
        console.log('Folder select clicked');
    };

    const handleOpenFolder = async (): Promise<void> => {
        // Add open folder logic
        console.log('Open folder clicked');
    };

    // Custom checkbox component
    const CustomCheckbox = ({
        id,
        checked,
        onChange,
        label
    }: {
        id: string;
        checked: boolean;
        onChange: (checked: boolean) => void;
        label: string;
    }) => (
        <div className="flex items-center mb-4">
            <div className="relative">
                <input
                    type="checkbox"
                    className="hidden"
                    id={id}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <label
                    htmlFor={id}
                    className={`w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-custom-button-hover ${checked ? 'bg-custom-checkbox' : 'bg-custom-button'
                        }`}
                >
                    <span className={`w-2 h-4 border-r-2 border-b-2 border-white transform rotate-45 translate-x-px -translate-y-px ${checked ? '' : 'hidden'}`}></span>
                </label>
            </div>
            <span className="text-base text-custom-text-muted ml-3">{label}</span>
        </div>
    );

    useEffect(() => {
        displayDeviceId();
    }, []);

    return (
        <div className="w-screen h-screen bg-custom-dark text-custom-text font-sans overflow-x-hidden select-none m-0 p-0">
            {/* Titlebar */}
            <div className="fixed w-full h-8 bg-custom-titlebar z-50 flex items-center justify-between" data-tauri-drag-region>
                <div className="flex items-center pointer-events-none">
                    <img className="w-8 h-8 pointer-events-none" src="/images/banner.png" alt="Banner" />
                    <p className="text-xs font-bold text-custom-text-dark absolute left-36 -top-px">v5.1.0</p>
                </div>
                <div className="flex items-center gap-1 h-full pointer-events-auto">
                    <button
                        className="w-6 h-6 flex items-center justify-center bg-custom-titlebar-button text-custom-text-muted hover:text-red-300 hover:bg-custom-button rounded-lg transition-colors duration-200 cursor-pointer"
                        onClick={() => handleTitlebarAction('reset')}
                    >
                        <img className="max-w-4 max-h-4" src="/images/reset.png" alt="Reset" />
                    </button>
                    <button
                        className="w-6 h-6 flex items-center justify-center bg-custom-titlebar-button text-custom-text-muted hover:text-red-300 hover:bg-custom-button rounded-lg transition-colors duration-200 cursor-pointer"
                        onClick={() => handleTitlebarAction('history')}
                    >
                        <img className="max-w-4 max-h-4" src="/images/history.png" alt="History" />
                    </button>
                    <div className="w-px"></div>
                    <button
                        className="w-8 h-full text-xs text-custom-text-muted hover:text-red-300 hover:bg-custom-button rounded-lg transition-colors duration-200 cursor-pointer"
                        onClick={() => handleTitlebarAction('minimize')}
                    >
                        _
                    </button>
                    <button
                        className="w-8 h-full text-xs text-custom-text-muted hover:text-red-300 hover:bg-custom-button rounded-lg transition-colors duration-200 cursor-pointer"
                        onClick={() => handleTitlebarAction('close')}
                    >
                        x
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-8 p-4">
                {/* Input Section */}
                <div className="mb-4">
                    <p className="text-sm text-custom-text-muted mb-2">ID: {deviceId}</p>
                    <p className="text-2xl text-custom-text-dark mb-2">Input</p>
                    <div className="bg-custom-panel border border-custom-border rounded-lg p-4">
                        <p className="text-lg text-custom-text-muted mb-2">URL</p>
                        <input
                            type="text"
                            className="w-full h-12 text-lg bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 focus:border-custom-input-focus focus:outline-none"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                        />
                    </div>
                </div>

                {/* Settings Section */}
                <div className="mb-4 hidden">
                    <p className="text-2xl text-custom-text-dark mb-2">Settings</p>
                    <div className="bg-custom-panel border border-custom-border rounded-lg">
                        {/* Format Panel */}
                        <div className="bg-custom-titlebar p-4 rounded-t-lg">
                            <p className="text-lg text-custom-text-muted mb-2">Format</p>
                            <select className="w-full h-12 text-lg bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 cursor-pointer focus:border-custom-border-light focus:outline-none">
                                <optgroup label="Video">
                                    <option value="mp4-fast">mp4 (fast)</option>
                                </optgroup>
                            </select>
                        </div>

                        {/* Size/FPS Panel */}
                        <div className="border-l border-t border-custom-border-light p-4 bg-custom-panel">
                            <CustomCheckbox
                                id="size-checkbox"
                                checked={changeSizeEnabled}
                                onChange={setChangeSizeEnabled}
                                label="Change Size"
                            />
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    className="w-20 h-12 text-base bg-custom-input text-custom-text border border-custom-border rounded-l-lg px-3 focus:border-custom-input-focus focus:outline-none"
                                    value={width}
                                    onChange={(e) => setWidth(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="w-20 h-12 text-base bg-custom-input text-custom-text border border-custom-border rounded-r-lg px-3 focus:border-custom-input-focus focus:outline-none"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                />
                            </div>
                            <CustomCheckbox
                                id="fps-checkbox"
                                checked={changeFpsEnabled}
                                onChange={setChangeFpsEnabled}
                                label="Change FPS"
                            />
                            <input
                                type="text"
                                className="w-20 h-12 text-base bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 focus:border-custom-input-focus focus:outline-none"
                                value={framerate}
                                onChange={(e) => setFramerate(e.target.value)}
                            />
                        </div>

                        {/* Trim Panel */}
                        <div className="border-t border-custom-border-light p-4 bg-custom-panel">
                            <CustomCheckbox
                                id="trim-checkbox"
                                checked={trimEnabled}
                                onChange={setTrimEnabled}
                                label="Trim Time Between"
                            />
                            <div className="flex items-center gap-2">
                                <CustomCheckbox
                                    id="trim-start-checkbox"
                                    checked={trimStartEnabled}
                                    onChange={setTrimStartEnabled}
                                    label=""
                                />
                                <input
                                    type="text"
                                    className="w-16 h-12 text-base bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 focus:border-custom-input-focus focus:outline-none"
                                    value={trimStart}
                                    onChange={(e) => setTrimStart(e.target.value)}
                                />
                                <span className="text-base text-custom-text-muted">and</span>
                                <CustomCheckbox
                                    id="trim-end-checkbox"
                                    checked={trimEndEnabled}
                                    onChange={setTrimEndEnabled}
                                    label=""
                                />
                                <input
                                    type="text"
                                    className="w-16 h-12 text-base bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 focus:border-custom-input-focus focus:outline-none"
                                    value={trimEnd}
                                    onChange={(e) => setTrimEnd(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Bitrate Panel */}
                        <div className="border-l border-t border-custom-border-light p-4 bg-custom-panel">
                            <CustomCheckbox
                                id="video-bitrate-checkbox"
                                checked={videoBitrateEnabled}
                                onChange={setVideoBitrateEnabled}
                                label="Set VBR"
                            />
                            <input
                                type="text"
                                className="w-32 h-12 text-base bg-custom-input text-custom-text border border-custom-border rounded-l-lg px-3 focus:border-custom-input-focus focus:outline-none mb-4"
                                value={videoBitrate}
                                onChange={(e) => setVideoBitrate(e.target.value)}
                            />

                            <CustomCheckbox
                                id="audio-bitrate-checkbox"
                                checked={audioBitrateEnabled}
                                onChange={setAudioBitrateEnabled}
                                label="Set ABR"
                            />
                            <input
                                type="text"
                                className="w-32 h-12 text-base bg-custom-input text-custom-text border border-custom-border rounded-r-lg px-3 focus:border-custom-input-focus focus:outline-none"
                                value={audioBitrate}
                                onChange={(e) => setAudioBitrate(e.target.value)}
                            />
                        </div>

                        {/* Arguments Panel */}
                        <div className="border-l border-custom-border-light p-4 bg-custom-panel rounded-br-lg rounded-tr-lg">
                            <CustomCheckbox
                                id="ytdlp-args-checkbox"
                                checked={ytdlpArgsEnabled}
                                onChange={setYtdlpArgsEnabled}
                                label="Add yt-dlp Arguments"
                            />
                            <textarea
                                className="w-full h-24 text-base bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 py-2 resize-none focus:border-custom-input-focus focus:outline-none mb-4"
                                value={ytdlpArgs}
                                onChange={(e) => setYtdlpArgs(e.target.value)}
                            />

                            <CustomCheckbox
                                id="ffmpeg-args-checkbox"
                                checked={ffmpegArgsEnabled}
                                onChange={setFfmpegArgsEnabled}
                                label="Add FFmpeg Arguments"
                            />
                            <textarea
                                className="w-full h-24 text-base bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 py-2 resize-none focus:border-custom-input-focus focus:outline-none"
                                value={ffmpegArgs}
                                onChange={(e) => setFfmpegArgs(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Output Section */}
                <div className="mb-4">
                    <p className="text-2xl text-custom-text-dark mb-2">Output</p>
                    <div className="bg-custom-panel border border-custom-border rounded-lg">
                        {/* Name/Path Panel */}
                        <div className="border-b border-custom-border-light p-4 rounded-t-lg">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-lg text-custom-text-muted mb-2">Name (Auto)</p>
                                    <input
                                        type="text"
                                        className="w-full h-12 text-lg bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 focus:border-custom-input-focus focus:outline-none"
                                        value={outputName}
                                        onChange={(e) => setOutputName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <p className="text-lg text-custom-text-muted mb-2">Path</p>
                                    <div className="flex">
                                        <button
                                            className="w-12 h-12 bg-custom-button text-custom-text border border-custom-border rounded-l-lg hover:bg-custom-button-hover transition-colors duration-200 cursor-pointer flex items-center justify-center"
                                            onClick={handleFolderSelect}
                                        >
                                            <img className="max-w-6 max-h-6" src="/images/folder.png" alt="Folder" />
                                        </button>
                                        <input
                                            type="text"
                                            className="flex-1 h-12 text-lg bg-custom-input text-custom-text border-t border-b border-custom-border px-3 focus:border-custom-input-focus focus:outline-none"
                                            value={outputPath}
                                            onChange={(e) => setOutputPath(e.target.value)}
                                        />
                                        <button
                                            className="w-12 h-12 bg-custom-button text-custom-text border border-custom-border rounded-r-lg hover:bg-custom-button-hover transition-colors duration-200 cursor-pointer flex items-center justify-center"
                                            onClick={handleOpenFolder}
                                        >
                                            <img className="max-w-6 max-h-6" src="/images/open.png" alt="Open" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Queue Panel */}
                        <div className="border-b border-custom-border-light p-4 hidden">
                            <p className="text-lg text-custom-text-muted mb-2">Queue</p>
                            <div className="bg-custom-titlebar border border-custom-border rounded-lg p-2 flex items-center gap-2">
                                <button className="w-12 h-12 bg-custom-button text-custom-text border border-custom-border rounded-l-lg hover:bg-custom-button-hover transition-colors duration-200 cursor-pointer flex items-center justify-center">
                                    <img className="max-w-6 max-h-6" src="/images/saveload-right.png" alt="Add" />
                                </button>
                                <button className="w-12 h-12 bg-custom-button text-custom-text border border-custom-border rounded-r-lg hover:bg-custom-button-hover transition-colors duration-200 cursor-pointer flex items-center justify-center">
                                    <img className="max-w-6 max-h-6" src="/images/gear.png" alt="Edit" />
                                </button>
                                <CustomCheckbox
                                    id="queue-enable-checkbox"
                                    checked={queueEnabled}
                                    onChange={setQueueEnabled}
                                    label="Enable"
                                />
                            </div>
                        </div>

                        {/* Download Button */}
                        <div className="p-4">
                            <button
                                className="w-full h-20 text-2xl font-bold bg-custom-green-dark text-custom-green border border-green-600 rounded-lg hover:bg-custom-green-hover hover:text-green-400 transition-all duration-500 hover:shadow-lg hover:shadow-green-400/20 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                                onClick={startDownload}
                                disabled={isDownloading}
                            >
                                {isDownloading ? 'Downloading...' : 'Download'}
                            </button>
                        </div>

                        {/* Console Panel */}
                        <div className="border-l border-custom-border-light p-4 bg-custom-panel rounded-br-lg">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-lg text-custom-text-muted">Console</p>
                                <button className="w-12 h-12 bg-transparent border-none rounded-lg hover:bg-custom-button transition-colors duration-200 cursor-pointer flex items-center justify-center">
                                    <img className="max-w-8 max-h-8" src="/images/console.png" alt="Console" />
                                </button>
                            </div>
                            <textarea
                                readOnly
                                className="w-full h-32 text-base bg-custom-console text-white border border-custom-border-light rounded-lg px-3 py-2 resize-none focus:border-custom-border-light focus:outline-none"
                                value={consoleOutput}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div
                className="fixed bottom-0 left-0 h-1 bg-green-600 transition-all duration-700 ease-in-out"
                style={{ width: `${progressWidth}%` }}
            />

            {/* Custom Styles */}
            <style jsx global>{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: #202020;
        }
        ::-webkit-scrollbar-thumb {
          background: #6e6e6e;
          border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #505050;
        }
      `}</style>
        </div>
    );
}