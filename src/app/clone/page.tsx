'use client';

import { useEffect, useState } from 'react';
import { appWindow } from '../../lib/tauri/window';
import {
    generateAppId,
    checkDownloadPermission,
    startDownload as startDownloadApi,
    openPathLocation,
    bootstrapCheck,
    bootstrapInstall
} from '../../lib/tauri/window';
import {
    IPCDownloadConfig,
    createIPCDownloadConfig
} from '../../lib/tauri/window';
import {
    IPCUserConfig,
    createIPCUserConfig
} from '../../lib/tauri/window';
import { useGlobalStore } from '../../lib/tauri/window';
import { useTauriEvents } from '../../lib/tauri/window';
import { isUrlPlaylist } from '../../lib/tauri/window';
import { selectFolderDialogAsync } from '../../lib/tauri/window';

export default function ClonePage() {
    // Global store
    const {
        userConfig,
        downloadQueue,
        downloadHistory,
        setUserConfig,
        addToQueue,
        addToHistory
    } = useGlobalStore();

    // Setup Tauri events
    useTauriEvents();

    // Local state
    const [deviceId, setDeviceId] = useState<string>('Loading...');
    const [consoleOutput, setConsoleOutput] = useState<string>('');
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [progressWidth, setProgressWidth] = useState<number>(0);
    const [currentConfig, setCurrentConfig] = useState<IPCDownloadConfig>(createIPCDownloadConfig());

    // Bootstrap states
    const [isBootstrapped, setIsBootstrapped] = useState<boolean>(false);
    const [isBootstrapping, setIsBootstrapping] = useState<boolean>(false);
    const [bootstrapError, setBootstrapError] = useState<string>('');

    // Form states - derived from currentConfig
    const [inputUrl, setInputUrl] = useState<string>('');

    // Checkbox states
    const [changeSizeEnabled, setChangeSizeEnabled] = useState<boolean>(false);
    const [changeFpsEnabled, setChangeFpsEnabled] = useState<boolean>(false);
    const [trimEnabled, setTrimEnabled] = useState<boolean>(false);
    const [trimStartEnabled, setTrimStartEnabled] = useState<boolean>(false);
    const [trimEndEnabled, setTrimEndEnabled] = useState<boolean>(false);
    const [videoBitrateEnabled, setVideoBitrateEnabled] = useState<boolean>(true);
    const [audioBitrateEnabled, setAudioBitrateEnabled] = useState<boolean>(true);
    const [ytdlpArgsEnabled, setYtdlpArgsEnabled] = useState<boolean>(false);
    const [ffmpegArgsEnabled, setFfmpegArgsEnabled] = useState<boolean>(false);
    const [queueEnabled, setQueueEnabled] = useState<boolean>(false);

    // Input states
    const [width, setWidth] = useState<string>('1280');
    const [height, setHeight] = useState<string>('-1');
    const [framerate, setFramerate] = useState<string>('30');
    const [trimStart, setTrimStart] = useState<string>('0:00');
    const [trimEnd, setTrimEnd] = useState<string>('0:10');
    const [videoBitrate, setVideoBitrate] = useState<string>('10M');
    const [audioBitrate, setAudioBitrate] = useState<string>('320k');
    const [ytdlpArgs, setYtdlpArgs] = useState<string>('');
    const [ffmpegArgs, setFfmpegArgs] = useState<string>('');

    // Output states
    const [outputName, setOutputName] = useState<string>('');
    const [outputPath, setOutputPath] = useState<string>('');

    // Initialize device ID
    const initializeDeviceId = async (): Promise<void> => {
        try {
            const id = await generateAppId();
            setDeviceId(id || "N/A");
        } catch (error) {
            console.error("Failed to get device ID:", error);
            setDeviceId("Error");
        }
    };

    // Check and install bootstrap dependencies
    const checkBootstrap = async (): Promise<void> => {
        try {
            setConsoleOutput(prev => "Checking required dependencies...\n" + prev);
            const isInstalled = await bootstrapCheck();

            if (isInstalled) {
                setIsBootstrapped(true);
                setConsoleOutput(prev => "✓ All dependencies are installed and ready\n" + prev);
            } else {
                setConsoleOutput(prev => "⚠ Missing dependencies detected. Installing...\n" + prev);
                await installBootstrap();
            }
        } catch (error) {
            console.error("Bootstrap check failed:", error);
            setBootstrapError(`Bootstrap check failed: ${error}`);
            setConsoleOutput(prev => `❌ Bootstrap check failed: ${error}\n` + prev);
        }
    };

    // Install bootstrap dependencies
    const installBootstrap = async (): Promise<void> => {
        try {
            setIsBootstrapping(true);
            setConsoleOutput(prev => "Installing required dependencies (yt-dlp, ffmpeg)...\n" + prev);
            setConsoleOutput(prev => "This may take a few minutes on first launch.\n" + prev);

            await bootstrapInstall();

            setIsBootstrapped(true);
            setIsBootstrapping(false);
            setConsoleOutput(prev => "✓ All dependencies installed successfully!\n" + prev);
        } catch (error) {
            console.error("Bootstrap install failed:", error);
            setBootstrapError(`Bootstrap install failed: ${error}`);
            setIsBootstrapping(false);
            setConsoleOutput(prev => `❌ Bootstrap install failed: ${error}\n` + prev);
        }
    };

    // Update current config when form values change
    const updateCurrentConfig = (): void => {
        const config: IPCDownloadConfig = {
            valid: true,
            input: {
                url: inputUrl,
                is_playlist: isUrlPlaylist(inputUrl),
                download_type: "default"
            },
            settings: {
                format: "mp4-fast",
                format_type: "video",
                trim_enable: trimEnabled,
                trim_from_start_enable: trimStartEnabled,
                trim_start: trimStart,
                trim_to_end_enable: trimEndEnabled,
                trim_end: trimEnd,
                size_change_enable: changeSizeEnabled,
                size_change_width: width,
                size_change_height: height,
                fps_change_enable: changeFpsEnabled,
                fps_change_framerate: framerate,
                vbr_set_bitrate_enable: videoBitrateEnabled,
                vbr_set_bitrate: videoBitrate,
                abr_set_bitrate_enable: audioBitrateEnabled,
                abr_set_bitrate: audioBitrate,
                custom_ytdlp_arguments_enable: ytdlpArgsEnabled,
                custom_ytdlp_arguments: ytdlpArgs ? ytdlpArgs.split(' ') : [],
                custom_ffmpeg_arguments_enable: ffmpegArgsEnabled,
                custom_ffmpeg_arguments: ffmpegArgs ? ffmpegArgs.split(' ') : []
            },
            output: {
                name: outputName,
                path: outputPath
            }
        };

        setCurrentConfig(config);
    };

    // Start download process
    const handleStartDownload = async (): Promise<void> => {
        if (!inputUrl.trim()) {
            setConsoleOutput(prev => "Error: Please enter a URL\n" + prev);
            return;
        }

        if (!isBootstrapped) {
            setConsoleOutput(prev => "Error: Dependencies not installed. Please wait for installation to complete.\n" + prev);
            return;
        }

        try {
            setIsDownloading(true);
            setConsoleOutput(prev => "Checking download permission...\n" + prev);

            const permission = await checkDownloadPermission(deviceId);

            if (!permission.status) {
                setConsoleOutput(prev => `Error: ${permission.message}\n` + prev);
                return;
            }

            setConsoleOutput(prev => `Download permitted: ${permission.message || "Starting download"}\n` + prev);

            // Update config before starting download
            updateCurrentConfig();

            // Add to queue if enabled
            if (queueEnabled && userConfig.ui_queue_enable) {
                addToQueue(currentConfig);
                setConsoleOutput(prev => "Added to download queue\n" + prev);
            } else {
                // Start download immediately
                const result = await startDownloadApi(currentConfig);
                addToHistory(result);
                setConsoleOutput(prev => "Download started successfully\n" + prev);
            }

        } catch (error) {
            console.error("Download failed:", error);
            setConsoleOutput(prev => `Download failed: ${error}\n` + prev);
        } finally {
            setIsDownloading(false);
        }
    };

    // Handle manual bootstrap installation
    const handleManualBootstrap = async (): Promise<void> => {
        await installBootstrap();
    };

    // Handle titlebar actions
    const handleTitlebarAction = async (action: 'minimize' | 'close' | 'reset' | 'history'): Promise<void> => {
        try {
            switch (action) {
                case 'minimize':
                    await appWindow.minimize();
                    break;
                case 'close':
                    await appWindow.close();
                    break;
                case 'reset':
                    // Reset form to default values
                    setInputUrl('');
                    setOutputName('');
                    setOutputPath('');
                    setCurrentConfig(createIPCDownloadConfig());
                    setConsoleOutput('');
                    setConsoleOutput(prev => "Form reset to default values\n" + prev);
                    break;
                case 'history':
                    // Show download history in console
                    const historyText = downloadHistory.length > 0
                        ? downloadHistory.map((item, index) => `${index + 1}. ${item.input.url} -> ${item.output.name || 'Auto'}`).join('\n')
                        : 'No download history available';
                    setConsoleOutput(prev => `Download History:\n${historyText}\n` + prev);
                    break;
            }
        } catch (error) {
            console.error(`Failed to ${action} window:`, error);
        }
    };

    // Handle folder selection
    const handleFolderSelect = async (): Promise<void> => {
        try {
            const selectedPath = await selectFolderDialogAsync();
            if (selectedPath) {
                setOutputPath(selectedPath);
                setConsoleOutput(prev => `Output path set to: ${selectedPath}\n` + prev);
            }
        } catch (error) {
            console.error('Failed to select folder:', error);
            setConsoleOutput(prev => "Error: Failed to select folder\n" + prev);
        }
    };

    // Handle open folder
    const handleOpenFolder = async (): Promise<void> => {
        if (!outputPath.trim()) {
            setConsoleOutput(prev => "Error: No output path specified\n" + prev);
            return;
        }

        try {
            await openPathLocation(outputPath);
            setConsoleOutput(prev => `Opened folder: ${outputPath}\n` + prev);
        } catch (error) {
            console.error('Failed to open folder:', error);
            setConsoleOutput(prev => "Error: Failed to open folder\n" + prev);
        }
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

    // Get download button state
    const getDownloadButtonState = () => {
        if (isBootstrapping) {
            return {
                disabled: true,
                text: 'Installing Dependencies...',
                className: 'bg-yellow-600 text-yellow-200 cursor-not-allowed'
            };
        }

        if (!isBootstrapped) {
            return {
                disabled: true,
                text: 'Dependencies Required',
                className: 'bg-red-600 text-red-200 cursor-not-allowed'
            };
        }

        if (isDownloading) {
            return {
                disabled: true,
                text: 'Downloading...',
                className: 'bg-blue-600 text-blue-200 cursor-not-allowed'
            };
        }

        if (!inputUrl.trim()) {
            return {
                disabled: true,
                text: 'Enter URL to Download',
                className: 'bg-gray-600 text-gray-400 cursor-not-allowed'
            };
        }

        return {
            disabled: false,
            text: queueEnabled && userConfig.ui_queue_enable ? 'Add to Queue' : 'Download',
            className: 'bg-custom-green-dark text-custom-green border-green-600 hover:bg-custom-green-hover hover:text-green-400 hover:shadow-lg hover:shadow-green-400/20'
        };
    };

    // Initialize component
    useEffect(() => {
        const initialize = async () => {
            await initializeDeviceId();
            await checkBootstrap();

            // Initialize user config if needed
            if (!userConfig.valid) {
                setUserConfig(createIPCUserConfig());
            }
        };

        initialize();
    }, []);

    // Update config when form values change
    useEffect(() => {
        updateCurrentConfig();
    }, [
        inputUrl, outputName, outputPath, changeSizeEnabled, changeFpsEnabled,
        trimEnabled, trimStartEnabled, trimEndEnabled, videoBitrateEnabled,
        audioBitrateEnabled, ytdlpArgsEnabled, ffmpegArgsEnabled, width, height,
        framerate, trimStart, trimEnd, videoBitrate, audioBitrate, ytdlpArgs, ffmpegArgs
    ]);

    // Update queue enabled state from global config
    useEffect(() => {
        setQueueEnabled(userConfig.ui_queue_enable);
    }, [userConfig.ui_queue_enable]);

    const buttonState = getDownloadButtonState();

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
                {/* Bootstrap Status */}
                {!isBootstrapped && (
                    <div className="mb-4">
                        <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-200 font-semibold">Dependencies Required</p>
                                    <p className="text-yellow-300 text-sm">
                                        {isBootstrapping
                                            ? "Installing yt-dlp and ffmpeg... This may take a few minutes."
                                            : "Required dependencies (yt-dlp, ffmpeg) are not installed."}
                                    </p>
                                    {bootstrapError && (
                                        <p className="text-red-300 text-sm mt-2">Error: {bootstrapError}</p>
                                    )}
                                </div>
                                {!isBootstrapping && (
                                    <button
                                        className="px-4 py-2 bg-yellow-600 text-yellow-100 rounded-lg hover:bg-yellow-500 transition-colors duration-200"
                                        onClick={handleManualBootstrap}
                                    >
                                        Install Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Input Section */}
                <div className="mb-4">
                    <p className="text-sm text-custom-text-muted mb-2">
                        ID: {deviceId} | Status: {isBootstrapped ? '✓ Ready' : isBootstrapping ? '⏳ Installing' : '❌ Not Ready'}
                    </p>
                    <p className="text-2xl text-custom-text-dark mb-2">Input</p>
                    <div className="bg-custom-panel border border-custom-border rounded-lg p-4">
                        <p className="text-lg text-custom-text-muted mb-2">URL</p>
                        <input
                            type="text"
                            className="w-full h-12 text-lg bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 focus:border-custom-input-focus focus:outline-none"
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                            placeholder="Enter video URL here..."
                        />
                        {inputUrl && (
                            <p className="text-sm text-custom-text-muted mt-2">
                                {isUrlPlaylist(inputUrl) ? "🎵 Playlist detected" : "🎬 Single video"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Settings Section */}
                <div className="mb-4">
                    <p className="text-2xl text-custom-text-dark mb-2">Settings</p>
                    <div className="bg-custom-panel border border-custom-border rounded-lg">
                        {/* Format Panel */}
                        <div className="bg-custom-titlebar p-4 rounded-t-lg">
                            <p className="text-lg text-custom-text-muted mb-2">Format</p>
                            <select
                                className="w-full h-12 text-lg bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 cursor-pointer focus:border-custom-border-light focus:outline-none"
                                value={currentConfig.settings.format}
                                onChange={(e) => setCurrentConfig(prev => ({
                                    ...prev,
                                    settings: { ...prev.settings, format: e.target.value }
                                }))}
                            >
                                <optgroup label="Video">
                                    <option value="mp4-fast">mp4 (fast)</option>
                                    <option value="mp4-best">mp4 (best)</option>
                                    <option value="webm">webm</option>
                                </optgroup>
                                <optgroup label="Audio">
                                    <option value="mp3">mp3</option>
                                    <option value="flac">flac</option>
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
                                    placeholder="Width"
                                    disabled={!changeSizeEnabled}
                                />
                                <input
                                    type="text"
                                    className="w-20 h-12 text-base bg-custom-input text-custom-text border border-custom-border rounded-r-lg px-3 focus:border-custom-input-focus focus:outline-none"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    placeholder="Height"
                                    disabled={!changeSizeEnabled}
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
                                placeholder="FPS"
                                disabled={!changeFpsEnabled}
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
                                    placeholder="0:00"
                                    disabled={!trimEnabled || !trimStartEnabled}
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
                                    placeholder="0:10"
                                    disabled={!trimEnabled || !trimEndEnabled}
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
                                className="w-32 h-12 text-base bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 focus:border-custom-input-focus focus:outline-none mb-4"
                                value={videoBitrate}
                                onChange={(e) => setVideoBitrate(e.target.value)}
                                placeholder="10M"
                                disabled={!videoBitrateEnabled}
                            />

                            <CustomCheckbox
                                id="audio-bitrate-checkbox"
                                checked={audioBitrateEnabled}
                                onChange={setAudioBitrateEnabled}
                                label="Set ABR"
                            />
                            <input
                                type="text"
                                className="w-32 h-12 text-base bg-custom-input text-custom-text border border-custom-border rounded-lg px-3 focus:border-custom-input-focus focus:outline-none"
                                value={audioBitrate}
                                onChange={(e) => setAudioBitrate(e.target.value)}
                                placeholder="320k"
                                disabled={!audioBitrateEnabled}
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
                                placeholder="--audio-quality 0 --embed-chapters"
                                disabled={!ytdlpArgsEnabled}
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
                                placeholder="-c:v libx264 -preset fast"
                                disabled={!ffmpegArgsEnabled}
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
                                        placeholder="Leave empty for auto naming"
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
                                            placeholder="Select output folder"
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
                        {userConfig.ui_queue_enable && (
                            <div className="border-b border-custom-border-light p-4">
                                <p className="text-lg text-custom-text-muted mb-2">Queue</p>
                                <div className="bg-custom-titlebar border border-custom-border rounded-lg p-2 flex items-center gap-2">
                                    <button
                                        className="w-12 h-12 bg-custom-button text-custom-text border border-custom-border rounded-l-lg hover:bg-custom-button-hover transition-colors duration-200 cursor-pointer flex items-center justify-center"
                                        onClick={() => {
                                            updateCurrentConfig();
                                            addToQueue(currentConfig);
                                            setConsoleOutput(prev => "Added to queue\n" + prev);
                                        }}
                                    >
                                        <img className="max-w-6 max-h-6" src="/images/saveload-right.png" alt="Add" />
                                    </button>
                                    <button className="w-12 h-12 bg-custom-button text-custom-text border border-custom-border rounded-r-lg hover:bg-custom-button-hover transition-colors duration-200 cursor-pointer flex items-center justify-center">
                                        <img className="max-w-6 max-h-6" src="/images/gear.png" alt="Edit" />
                                    </button>
                                    <CustomCheckbox
                                        id="queue-enable-checkbox"
                                        checked={queueEnabled}
                                        onChange={setQueueEnabled}
                                        label="Enable Queue"
                                    />
                                    <span className="text-sm text-custom-text-muted ml-auto">
                                        {downloadQueue.length} item(s) in queue
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Download Button */}
                        <div className="p-4">
                            <button
                                className={`w-full h-20 text-2xl font-bold rounded-lg transition-all duration-500 ${buttonState.className}`}
                                onClick={handleStartDownload}
                                disabled={buttonState.disabled}
                            >
                                {buttonState.text}
                            </button>
                        </div>

                        {/* Console Panel */}
                        <div className="border-l border-custom-border-light p-4 bg-custom-panel rounded-br-lg">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-lg text-custom-text-muted">Console</p>
                                <button
                                    className="w-12 h-12 bg-transparent border-none rounded-lg hover:bg-custom-button transition-colors duration-200 cursor-pointer flex items-center justify-center"
                                    onClick={() => setConsoleOutput('')}
                                >
                                    <img className="max-w-8 max-h-8" src="/images/console.png" alt="Clear Console" />
                                </button>
                            </div>
                            <textarea
                                readOnly
                                className="w-full h-32 text-base bg-custom-console text-white border border-custom-border-light rounded-lg px-3 py-2 resize-none focus:border-custom-border-light focus:outline-none"
                                value={consoleOutput}
                                placeholder="Console output will appear here..."
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