"use client";

import { useEffect, useState } from "react";
import {
    generateAppId,
    checkDownloadPermission,
    startDownload as startDownloadApi,
    openPathLocation,
    bootstrapCheck,
    bootstrapInstall,
    selectFolderDialogAsync,
    createIPCDownloadConfig,
    createIPCUserConfig,
    isUrlPlaylist,
    useGlobalStore,
    useTauriEvents,
} from "../../lib/tauri/window";

import {
    FolderIcon,
    ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

import { Header } from "~/ui/components/header";

export default function ClonePage() {
    const {
        userConfig,
        downloadQueue,
        downloadHistory,
        setUserConfig,
        addToQueue,
        addToHistory,
    } = useGlobalStore();

    useTauriEvents();

    const [deviceId, setDeviceId] = useState("Loading...");
    const [consoleOutput, setConsoleOutput] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);
    const [currentConfig, setCurrentConfig] = useState(createIPCDownloadConfig());
    const [isBootstrapped, setIsBootstrapped] = useState(false);
    const [isBootstrapping, setIsBootstrapping] = useState(false);
    const [bootstrapError, setBootstrapError] = useState("");
    const [inputUrl, setInputUrl] = useState("");
    const [outputName, setOutputName] = useState("");
    const [outputPath, setOutputPath] = useState("");
    const [queueEnabled, setQueueEnabled] = useState(false);

    const initializeDeviceId = async () => {
        try {
            const id = await generateAppId();
            setDeviceId(id || "N/A");
        } catch {
            setDeviceId("Error");
        }
    };

    const checkBootstrap = async () => {
        setConsoleOutput((prev) => "Checking dependencies...\n" + prev);
        try {
            const isInstalled = await bootstrapCheck();
            if (isInstalled) {
                setIsBootstrapped(true);
                setConsoleOutput((prev) => "✓ Dependencies ready\n" + prev);
            } else {
                setConsoleOutput((prev) => "⚠ Installing dependencies...\n" + prev);
                await installBootstrap();
            }
        } catch (error) {
            setBootstrapError(`${error}`);
            setConsoleOutput((prev) => `❌ Bootstrap error: ${error}\n` + prev);
        }
    };

    const installBootstrap = async () => {
        try {
            setIsBootstrapping(true);
            setConsoleOutput((prev) => "Installing yt-dlp and ffmpeg...\n" + prev);
            await bootstrapInstall();
            setIsBootstrapped(true);
            setConsoleOutput((prev) => "✓ Installation complete\n" + prev);
        } catch (error) {
            setBootstrapError(`${error}`);
            setConsoleOutput((prev) => `❌ Install failed: ${error}\n` + prev);
        } finally {
            setIsBootstrapping(false);
        }
    };

    const updateCurrentConfig = () => {
        setCurrentConfig({
            ...createIPCDownloadConfig(),
            input: {
                url: inputUrl,
                is_playlist: isUrlPlaylist(inputUrl),
                download_type: "default",
            },
            output: {
                name: outputName,
                path: outputPath,
            },
        });
    };

    const handleStartDownload = async () => {
        if (!inputUrl.trim() || !isBootstrapped) return;

        setIsDownloading(true);
        setConsoleOutput((prev) => "Checking permission...\n" + prev);

        try {
            const permission = await checkDownloadPermission(deviceId);
            if (!permission.status) {
                setConsoleOutput((prev) => `Error: ${permission.message}\n` + prev);
                return;
            }

            updateCurrentConfig();

            if (queueEnabled && userConfig.ui_queue_enable) {
                addToQueue(currentConfig);
                setConsoleOutput((prev) => "Added to queue\n" + prev);
            } else {
                const result = await startDownloadApi(currentConfig);
                addToHistory(result);
                setConsoleOutput((prev) => "Download started\n" + prev);
            }
        } catch (error) {
            setConsoleOutput((prev) => `Download error: ${error}\n` + prev);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleFolderSelect = async () => {
        try {
            const selectedPath = await selectFolderDialogAsync();
            if (selectedPath) setOutputPath(selectedPath);
        } catch {
            setConsoleOutput((prev) => "Folder select failed\n" + prev);
        }
    };

    const handleOpenFolder = async () => {
        try {
            if (!outputPath.trim()) return;
            await openPathLocation(outputPath);
        } catch {
            setConsoleOutput((prev) => "Open folder failed\n" + prev);
        }
    };

    useEffect(() => {
        initializeDeviceId();
        checkBootstrap();
        if (!userConfig.valid) setUserConfig(createIPCUserConfig());
    }, []);

    useEffect(() => {
        updateCurrentConfig();
    }, [inputUrl, outputName, outputPath]);

    useEffect(() => {
        setQueueEnabled(userConfig.ui_queue_enable);
    }, [userConfig.ui_queue_enable]);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            <Header />
            <section className="py-10">
                <div className="container max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6 text-left">
                        Download Your Favorite Videos
                    </h2>

                    <div className="space-y-5">
                        <input
                            className="ml-2 w-full p-3 border rounded bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                            placeholder="Enter video or playlist URL..."
                            value={inputUrl}
                            onChange={(e) => setInputUrl(e.target.value)}
                        />

                        <input
                            className="ml-2 w-full p-3 border rounded bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                            placeholder="Output file name (optional)"
                            value={outputName}
                            onChange={(e) => setOutputName(e.target.value)}
                        />

                        <div className="flex gap-2 ml-2">
                            <button onClick={handleFolderSelect}>
                                <FolderIcon className="w-6 h-6 text-zinc-600 dark:text-zinc-200" />
                            </button>
                            <input
                                className="flex-1 p-3 border rounded bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                                placeholder="Choose output folder..."
                                value={outputPath}
                                onChange={(e) => setOutputPath(e.target.value)}
                            />
                            <button onClick={handleOpenFolder}>
                                <ArrowTopRightOnSquareIcon className="w-6 h-6 text-zinc-600 dark:text-zinc-200" />
                            </button>
                        </div>

                        <button
                            onClick={handleStartDownload}
                            disabled={isDownloading || !inputUrl.trim() || !isBootstrapped}
                            className="ml-2 w-full p-4 text-lg font-semibold bg-green-600 hover:bg-green-500 text-white rounded transition"
                        >
                            {isBootstrapping
                                ? "Installing dependencies..."
                                : isDownloading
                                    ? "Downloading..."
                                    : "Start Download"}
                        </button>

                        <textarea
                            readOnly
                            value={consoleOutput}
                            className="ml-2 w-full h-40 p-3 bg-zinc-900 text-green-200 dark:bg-black dark:text-green-200 rounded border border-zinc-300 dark:border-zinc-700 resize-none font-mono"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}
