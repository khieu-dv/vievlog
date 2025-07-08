import { useEffect, useState } from 'react';
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";
import { fetch } from '@tauri-apps/plugin-http';
import { open } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';

// Types
export interface IPCUserConfig {
    valid: boolean;
    ui_queue_enable: boolean;
    update_notifications_enable: boolean;
}

interface IPCDownloadInputConfig {
    url: string;
    is_playlist: boolean;
    download_type: string;
}

interface IPCDownloadSettingsConfig {
    format: string;
    format_type: string;
    trim_enable: boolean;
    trim_from_start_enable: boolean;
    trim_start: string;
    trim_to_end_enable: boolean;
    trim_end: string;
    size_change_enable: boolean;
    size_change_width: string;
    size_change_height: string;
    fps_change_enable: boolean;
    fps_change_framerate: string;
    vbr_set_bitrate_enable: boolean;
    vbr_set_bitrate: string;
    abr_set_bitrate_enable: boolean;
    abr_set_bitrate: string;
    custom_ffmpeg_arguments_enable: boolean;
    custom_ffmpeg_arguments: string[];
    custom_ytdlp_arguments_enable: boolean;
    custom_ytdlp_arguments: string[];
}

interface IPCDownloadOutputConfig {
    name: string;
    path: string;
}

export interface IPCDownloadConfig {
    valid: boolean;
    input: IPCDownloadInputConfig;
    settings: IPCDownloadSettingsConfig;
    output: IPCDownloadOutputConfig;
}

interface IPCLoggerEvent {
    text: string;
}

interface IPCUpdateMetadata {
    version_id: number;
    version: string;
    description: string;
}

interface IPCUpdateStatus {
    has_update: boolean;
    metadata: IPCUpdateMetadata;
}

interface Global {
    userConfig: IPCUserConfig;
    downloadQueue: IPCDownloadConfig[];
    downloadHistory: IPCDownloadConfig[];
}

interface UIEnableState {
    trimEnable: boolean;
    sizeEnable: boolean;
    framerateEnable: boolean;
    vbrEnable: boolean;
    abrEnable: boolean;
}

// Initialize appWindow
export const appWindow = getCurrentWindow();

// Global state
let GLOBAL: Global = {
    userConfig: createIPCUserConfig(),
    downloadQueue: [],
    downloadHistory: []
};

// Utility functions
export function isUrlPlaylist(url: string): boolean {
    const playlistKeywords = ["/playlist?", "&list=", "?list=", "/sets"];
    return playlistKeywords.some(keyword => url.includes(keyword));
}

export async function selectFolderDialogAsync(): Promise<string> {
    const file = await open({ directory: true });
    return file ? file : "";
}

// Config creation functions
export function createIPCUserConfig(): IPCUserConfig {
    return {
        valid: true,
        ui_queue_enable: false,
        update_notifications_enable: true
    };
}

export function createIPCDownloadConfig(): IPCDownloadConfig {
    return {
        valid: true,
        input: {
            url: "",
            is_playlist: false,
            download_type: "default"
        },
        settings: {
            format: "mp4-fast",
            format_type: "video",
            trim_enable: false,
            trim_from_start_enable: false,
            trim_start: "0:00",
            trim_to_end_enable: false,
            trim_end: "0:10",
            size_change_enable: false,
            size_change_width: "1280",
            size_change_height: "-1",
            fps_change_enable: false,
            fps_change_framerate: "30",
            vbr_set_bitrate_enable: true,
            vbr_set_bitrate: "10M",
            abr_set_bitrate_enable: true,
            abr_set_bitrate: "320k",
            custom_ytdlp_arguments_enable: false,
            custom_ytdlp_arguments: [],
            custom_ffmpeg_arguments_enable: false,
            custom_ffmpeg_arguments: []
        },
        output: {
            name: "",
            path: ""
        }
    };
}

// UI Initialization functions
export function initUI() {
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    document.querySelectorAll("input, form, textarea, select").forEach(element => {
        element.setAttribute("autocomplete", "off");
    });
}

export function initTitlebar() {
    document.getElementById("titlebar")?.addEventListener("mousedown", (e: MouseEvent) => {
        if (
            e.buttons === 1 &&
            e.detail !== 2 &&
            !(e.target as HTMLElement).closest("button") &&
            !(e.target as HTMLElement).closest("#titlebar-minimize-button") &&
            !(e.target as HTMLElement).closest("#titlebar-close-button")
        ) {
            appWindow.startDragging();
        }
    });
}

export function initInputUI() {
    const inputUrlTextbox = document.getElementById("input-url-textbox") as HTMLInputElement | null;
    inputUrlTextbox?.addEventListener("input", () => {
        const inputUrlText = document.getElementById("input-url-text") as HTMLInputElement | null;
        if (inputUrlText) {
            inputUrlText.textContent = isUrlPlaylist(inputUrlTextbox.value) ? "URL (Playlist Detected)" : "URL";
        }
    });
    inputUrlTextbox?.addEventListener("dblclick", () => {
        if (inputUrlTextbox) {
            invoke("util_launch_url", { url: inputUrlTextbox.value });
        }
    });
}

export function initMiniConsole() {
    const consoleTextarea = document.getElementById("output-console-textarea") as HTMLTextAreaElement | null;
    if (!consoleTextarea) return;
    listen<IPCLoggerEvent>("log", (event) => {
        consoleTextarea.value += '\n' + event.payload.text;
        consoleTextarea.scrollTop = consoleTextarea.scrollHeight;
    });
}

export function openConsoleWindow() {
    new WebviewWindow("consoleWindow", {
        url: "console.html",
        title: "VieClone Console",
        width: 750,
        height: 500,
        minWidth: 450,
        minHeight: 300,
        decorations: false
    });
}

export function initSettingsUIHandler() {
    const formatSelect = document.getElementById("settings-format-select") as HTMLSelectElement | null;
    formatSelect?.addEventListener("change", updateSettingsUI);
}

export function updateSettingsUI() {
    const formatSelect = document.getElementById("settings-format-select") as HTMLSelectElement | null;
    if (!formatSelect) return;
    const selectedFormat = formatSelect.value;
    let uiEnableState: UIEnableState;

    switch (selectedFormat) {
        case "mp4-fast":
            uiEnableState = { trimEnable: true, sizeEnable: false, framerateEnable: false, vbrEnable: false, abrEnable: false };
            break;
        case "mp4":
        case "mp4-nvidia":
        case "mp4-amd":
        case "webm":
            uiEnableState = { trimEnable: true, sizeEnable: true, framerateEnable: true, vbrEnable: true, abrEnable: true };
            break;
        case "avi":
            uiEnableState = { trimEnable: true, sizeEnable: true, framerateEnable: true, vbrEnable: false, abrEnable: false };
            break;
        case "mp3":
            uiEnableState = { trimEnable: true, sizeEnable: false, framerateEnable: false, vbrEnable: false, abrEnable: true };
            break;
        case "wav":
        case "flac":
        case "ogg":
            uiEnableState = { trimEnable: true, sizeEnable: false, framerateEnable: false, vbrEnable: false, abrEnable: false };
            break;
        case "gif":
        case "png-sequence":
        case "jpg-sequence":
            uiEnableState = { trimEnable: true, sizeEnable: true, framerateEnable: true, vbrEnable: true, abrEnable: false };
            break;
        case "png-thumbnail":
        case "jpg-thumbnail":
            uiEnableState = { trimEnable: false, sizeEnable: true, framerateEnable: false, vbrEnable: false, abrEnable: false };
            break;
        default:
            uiEnableState = { trimEnable: false, sizeEnable: false, framerateEnable: false, vbrEnable: false, abrEnable: false };
    }

    updateUIElements(uiEnableState);
}

function updateUIElements(uiEnableState: UIEnableState) {
    handleTrim(uiEnableState);
    handleSize(uiEnableState);
    handleFramerate(uiEnableState);
    handleVbr(uiEnableState);
    handleAbr(uiEnableState);
}

function handleTrim(uiEnableState: UIEnableState) {
    const elements = {
        trimCheckbox: document.getElementById("settings-trim-checkbox") as HTMLInputElement | null,
        trimStartCheckbox: document.getElementById("settings-trim-start-checkbox") as HTMLInputElement | null,
        trimStartTextbox: document.getElementById("settings-trim-start-textbox") as HTMLInputElement | null,
        trimEndCheckbox: document.getElementById("settings-trim-end-checkbox") as HTMLInputElement | null,
        trimEndTextbox: document.getElementById("settings-trim-end-textbox") as HTMLInputElement | null
    };
    if (Object.values(elements).some(el => !el)) return;

    if (uiEnableState.trimEnable) {
        Object.values(elements).forEach(el => el!.disabled = false);
    } else {
        elements.trimCheckbox!.checked = false;
        Object.values(elements).forEach(el => el!.disabled = true);
    }
}

function handleSize(uiEnableState: UIEnableState) {
    const elements = {
        sizeCheckbox: document.getElementById("settings-size-fps-size-checkbox") as HTMLInputElement | null,
        sizeWidthTextbox: document.getElementById("settings-size-fps-width-textbox") as HTMLInputElement | null,
        sizeHeightTextbox: document.getElementById("settings-size-fps-height-textbox") as HTMLInputElement | null
    };
    if (Object.values(elements).some(el => !el)) return;

    if (uiEnableState.sizeEnable) {
        Object.values(elements).forEach(el => el!.disabled = false);
    } else {
        elements.sizeCheckbox!.checked = false;
        Object.values(elements).forEach(el => el!.disabled = true);
    }
}

function handleFramerate(uiEnableState: UIEnableState) {
    const elements = {
        framerateCheckbox: document.getElementById("settings-size-fps-framerate-checkbox") as HTMLInputElement | null,
        framerateTextbox: document.getElementById("settings-size-fps-framerate-textbox") as HTMLInputElement | null
    };
    if (Object.values(elements).some(el => !el)) return;

    if (uiEnableState.framerateEnable) {
        Object.values(elements).forEach(el => el!.disabled = false);
    } else {
        elements.framerateCheckbox!.checked = false;
        Object.values(elements).forEach(el => el!.disabled = true);
    }
}

function handleVbr(uiEnableState: UIEnableState) {
    const elements = {
        videoBitrateCheckbox: document.getElementById("settings-bitrate-video-checkbox") as HTMLInputElement | null,
        videoBitrateTextbox: document.getElementById("settings-bitrate-video-textbox") as HTMLInputElement | null
    };
    if (Object.values(elements).some(el => !el)) return;

    if (uiEnableState.vbrEnable) {
        elements.videoBitrateCheckbox!.checked = true;
        Object.values(elements).forEach(el => el!.disabled = false);
    } else {
        elements.videoBitrateCheckbox!.checked = false;
        Object.values(elements).forEach(el => el!.disabled = true);
    }
}

function handleAbr(uiEnableState: UIEnableState) {
    const elements = {
        audioBitrateCheckbox: document.getElementById("settings-bitrate-audio-checkbox") as HTMLInputElement | null,
        audioBitrateTextbox: document.getElementById("settings-bitrate-audio-textbox") as HTMLInputElement | null
    };
    if (Object.values(elements).some(el => !el)) return;

    if (uiEnableState.abrEnable) {
        elements.audioBitrateCheckbox!.checked = true;
        Object.values(elements).forEach(el => el!.disabled = false);
    } else {
        elements.audioBitrateCheckbox!.checked = false;
        Object.values(elements).forEach(el => el!.disabled = true);
    }
}

export function initSettingsUI() {
    initSettingsUIHandler();
}

export function loadIPCUserConfigIntoUI(config: IPCUserConfig) {
    const queueCheckbox = document.getElementById("output-queue-checkbox-enable") as HTMLInputElement | null;
    const downloadButton = document.getElementById("output-download-button") as HTMLButtonElement | null;
    if (queueCheckbox) queueCheckbox.checked = config.ui_queue_enable;
    if (downloadButton && config.ui_queue_enable) downloadButton.textContent = "Download Queue";
}

export function updateIPCUserConfigFromUI() {
    const queueCheckbox = document.getElementById("output-queue-checkbox-enable") as HTMLInputElement | null;
    if (queueCheckbox) GLOBAL.userConfig.ui_queue_enable = queueCheckbox.checked;
}

export function generateIPCDownloadConfig(): IPCDownloadConfig {
    const $ = (id: string) => document.getElementById(id);
    const url = ($("input-url-textbox") as HTMLInputElement)?.value || "";
    const settingsFormatSelect = $("settings-format-select") as HTMLSelectElement;
    const format = settingsFormatSelect?.value || "mp4-fast";
    const formatType = settingsFormatSelect?.options[settingsFormatSelect?.selectedIndex]?.getAttribute("type-value") || "video";

    return {
        valid: true,
        input: {
            url,
            is_playlist: isUrlPlaylist(url),
            download_type: formatType === "image" ? "thumbnail" : "default"
        },
        settings: {
            format,
            format_type: formatType,
            trim_enable: ($("settings-trim-checkbox") as HTMLInputElement)?.checked || false,
            trim_from_start_enable: ($("settings-trim-start-checkbox") as HTMLInputElement)?.checked || false,
            trim_start: ($("settings-trim-start-textbox") as HTMLInputElement)?.value || "0:00",
            trim_to_end_enable: ($("settings-trim-end-checkbox") as HTMLInputElement)?.checked || false,
            trim_end: ($("settings-trim-end-textbox") as HTMLInputElement)?.value || "0:10",
            size_change_enable: ($("settings-size-fps-size-checkbox") as HTMLInputElement)?.checked || false,
            size_change_width: ($("settings-size-fps-width-textbox") as HTMLInputElement)?.value || "1280",
            size_change_height: ($("settings-size-fps-height-textbox") as HTMLInputElement)?.value || "-1",
            fps_change_enable: ($("settings-size-fps-framerate-checkbox") as HTMLInputElement)?.checked || false,
            fps_change_framerate: ($("settings-size-fps-framerate-textbox") as HTMLInputElement)?.value || "30",
            vbr_set_bitrate_enable: ($("settings-bitrate-video-checkbox") as HTMLInputElement)?.checked || false,
            vbr_set_bitrate: ($("settings-bitrate-video-textbox") as HTMLInputElement)?.value || "10M",
            abr_set_bitrate_enable: ($("settings-bitrate-audio-checkbox") as HTMLInputElement)?.checked || false,
            abr_set_bitrate: ($("settings-bitrate-audio-textbox") as HTMLInputElement)?.value || "320k",
            custom_ytdlp_arguments_enable: ($("settings-arguments-ytdlp-checkbox") as HTMLInputElement)?.checked || false,
            custom_ytdlp_arguments: ($("settings-arguments-ytdlp-textarea") as HTMLTextAreaElement)?.value.split('\n').filter(arg => arg.trim()) || [],
            custom_ffmpeg_arguments_enable: ($("settings-arguments-ffmpeg-checkbox") as HTMLInputElement)?.checked || false,
            custom_ffmpeg_arguments: ($("settings-arguments-ffmpeg-textarea") as HTMLTextAreaElement)?.value.split('\n').filter(arg => arg.trim()) || []
        },
        output: {
            name: ($("output-name-textbox") as HTMLInputElement)?.value || "",
            path: ($("output-path-textbox") as HTMLInputElement)?.value || ""
        }
    };
}

export function loadIPCDownloadConfigIntoUI(config: IPCDownloadConfig) {
    const $ = (id: string) => document.getElementById(id);
    ($("input-url-textbox") as HTMLInputElement).value = config.input.url;
    ($("settings-format-select") as HTMLSelectElement).value = config.settings.format;
    ($("settings-trim-checkbox") as HTMLInputElement).checked = config.settings.trim_enable;
    ($("settings-trim-start-checkbox") as HTMLInputElement).checked = config.settings.trim_from_start_enable;
    ($("settings-trim-start-textbox") as HTMLInputElement).value = config.settings.trim_start;
    ($("settings-trim-end-checkbox") as HTMLInputElement).checked = config.settings.trim_to_end_enable;
    ($("settings-trim-end-textbox") as HTMLInputElement).value = config.settings.trim_end;
    ($("settings-size-fps-size-checkbox") as HTMLInputElement).checked = config.settings.size_change_enable;
    ($("settings-size-fps-width-textbox") as HTMLInputElement).value = config.settings.size_change_width;
    ($("settings-size-fps-height-textbox") as HTMLInputElement).value = config.settings.size_change_height;
    ($("settings-size-fps-framerate-checkbox") as HTMLInputElement).checked = config.settings.fps_change_enable;
    ($("settings-size-fps-framerate-textbox") as HTMLInputElement).value = config.settings.fps_change_framerate;
    ($("settings-bitrate-video-checkbox") as HTMLInputElement).checked = config.settings.vbr_set_bitrate_enable;
    ($("settings-bitrate-video-textbox") as HTMLInputElement).value = config.settings.vbr_set_bitrate;
    ($("settings-bitrate-audio-checkbox") as HTMLInputElement).checked = config.settings.abr_set_bitrate_enable;
    ($("settings-bitrate-audio-textbox") as HTMLInputElement).value = config.settings.abr_set_bitrate;
    ($("settings-arguments-ytdlp-checkbox") as HTMLInputElement).checked = config.settings.custom_ytdlp_arguments_enable;
    ($("settings-arguments-ytdlp-textarea") as HTMLTextAreaElement).value = config.settings.custom_ytdlp_arguments.join('\n');
    ($("settings-arguments-ffmpeg-checkbox") as HTMLInputElement).checked = config.settings.custom_ffmpeg_arguments_enable;
    ($("settings-arguments-ffmpeg-textarea") as HTMLTextAreaElement).value = config.settings.custom_ffmpeg_arguments.join('\n');
    ($("output-name-textbox") as HTMLInputElement).value = config.output.name;
    ($("output-path-textbox") as HTMLInputElement).value = config.output.path;
    if (isUrlPlaylist(config.input.url)) ($("input-url-text") as HTMLParagraphElement).textContent = "URL (Playlist Detected)";
    if (config.output.name !== "") ($("output-name-text") as HTMLParagraphElement).textContent = "Name";
}

export function initDownloadButton() {
    document.getElementById("output-download-button")?.addEventListener("click", startDownloadAsync);
}

export async function startDownloadAsync() {
    const downloadButton = document.getElementById("output-download-button") as HTMLButtonElement | null;
    const progressBar = document.getElementById("progress-bar") as HTMLDivElement | null;
    const consoleTextarea = document.getElementById("output-console-textarea") as HTMLTextAreaElement | null;
    const queueCheckbox = document.getElementById("output-queue-checkbox-enable") as HTMLInputElement | null;

    if (downloadButton) downloadButton.disabled = true;
    if (progressBar) progressBar.style.width = `0vw`;
    if (consoleTextarea) consoleTextarea.value = "";

    if (queueCheckbox?.checked) {
        for (let i = 0; i < GLOBAL.downloadQueue.length; ++i) {
            await downloadAsync(GLOBAL.downloadQueue[i]);
            let percent = (i + 1) / GLOBAL.downloadQueue.length * 100;
            if (progressBar) progressBar.style.width = `${percent}vw`;
        }
    } else {
        await downloadAsync(generateIPCDownloadConfig());
        if (progressBar) progressBar.style.width = `100vw`;
    }

    if (downloadButton) downloadButton.disabled = false;
}

async function downloadAsync(downloadConfig: IPCDownloadConfig) {
    const consoleTextarea = document.getElementById("output-console-textarea") as HTMLTextAreaElement | null;
    if (!downloadConfig.input.url) {
        if (consoleTextarea) consoleTextarea.value = `Error: No URL provided\n` + consoleTextarea.value;
        return;
    }

    const ytdlpArgs = [
        downloadConfig.input.url,
        '-o', `${downloadConfig.output.path}/${downloadConfig.output.name || '%(title)s.%(ext)s'}`,
        ...downloadConfig.settings.custom_ytdlp_arguments_enable 
            ? downloadConfig.settings.custom_ytdlp_arguments 
            : ['--embed-thumbnail', '--embed-metadata']
    ];

    if (downloadConfig.settings.format_type === "video") {
        ytdlpArgs.push('-f', 'bestvideo+bestaudio/best');
    } else if (downloadConfig.settings.format_type === "audio") {
        ytdlpArgs.push('-x', `--audio-format=${downloadConfig.settings.format}`);
    }

    const purifiedDownloadConfig: IPCDownloadConfig = await invoke("download_video", { 
        config: downloadConfig,
        ytdlpArgs
    });
    GLOBAL.downloadHistory.push(purifiedDownloadConfig);
    if (consoleTextarea) {
        consoleTextarea.value = `Download completed: ${downloadConfig.output.name || downloadConfig.input.url}\n` + consoleTextarea.value;
    }
}

export function initOutputUI() {
    const outputNameTextbox = document.getElementById("output-name-textbox") as HTMLInputElement | null;
    const outputNameText = document.getElementById("output-name-text") as HTMLInputElement | null;
    if (outputNameTextbox && outputNameText) {
        outputNameTextbox.addEventListener("input", () => {
            outputNameText.textContent = outputNameTextbox.value === "" ? "Name (Auto)" : "Name";
        });
    }

    document.getElementById("output-path-button")?.addEventListener("click", async () => {
        const pathTextbox = document.getElementById("output-path-textbox") as HTMLInputElement | null;
        if (pathTextbox) {
            pathTextbox.value = await selectFolderDialogAsync();
        }
    });

    document.getElementById("output-path-open-button")?.addEventListener("click", async () => {
        invoke("util_open_path_location", { path: generateIPCDownloadConfig().output.path });
    });

    document.getElementById("output-console-open-button")?.addEventListener("click", openConsoleWindow);
    initQueueOpener();
    initDownloadButton();
    initMiniConsole();
}

export function initQueueOpener() {
    document.getElementById("output-queue-add-button")?.addEventListener("click", async () => {
        const nameTextbox = document.getElementById("output-name-textbox") as HTMLInputElement | null;
        if (!nameTextbox) return;
        if (nameTextbox.value === "") {
            nameTextbox.classList.add("textbox-error");
            nameTextbox.title = "Please provide a name for the queue entry.";
            setTimeout(() => {
                nameTextbox.classList.remove("textbox-error");
                nameTextbox.title = "";
            }, 2000);
        } else {
            nameTextbox.classList.remove("textbox-error");
            nameTextbox.title = "";
            GLOBAL.downloadQueue.push(generateIPCDownloadConfig());
        }
    });

    document.getElementById("output-queue-edit-button")?.addEventListener("click", openQueueWindow);

    document.getElementById("output-queue-checkbox-enable")?.addEventListener("change", (event) => {
        const checkbox = event.target as HTMLInputElement;
        const button = document.getElementById("output-download-button") as HTMLButtonElement | null;
        if (button) button.innerText = checkbox.checked ? "Download Queue" : "Download";
    });
}

export async function openQueueWindow() {
    const names = GLOBAL.downloadQueue.map(item => item.output.name);
    const webview = new WebviewWindow("queueWindow", {
        url: "queue.html",
        title: "VieClone Queue",
        width: 450,
        height: 300,
        minWidth: 450,
        minHeight: 300,
        decorations: false
    });

    const unlistenQueueRequest = await webview.listen("queue-request", () => {
        webview.emit("queue-request-return", names);
    });

    interface QueueLoadEvent {
        payload: number;
    }



    interface QueueRemoveEvent {
        payload: number[];
    }

  

    const unlistenClose = await webview.onCloseRequested(async () => {
        unlistenClose();
        unlistenQueueRequest();
    });
}

export function initHistoryOpener() {
    document.getElementById("titlebar-history-edit-button")?.addEventListener("click", openHistoryWindow);
}

export async function openHistoryWindow() {
    const names = GLOBAL.downloadHistory.map(item => item.output.name);
    const webview = new WebviewWindow("historyWindow", {
        url: "history.html",
        title: "VieClone History",
        width: 450,
        height: 300,
        minWidth: 450,
        minHeight: 300,
        decorations: false
    });

    const unlistenHistoryRequest = await webview.listen("history-request", () => {
        webview.emit("history-request-return", names);
    });

    interface HistoryLoadEvent {
        payload: number;
    }


    interface HistoryRemoveEvent {
        payload: number[];
    }



    const unlistenClose = await webview.onCloseRequested(async () => {
        unlistenClose();
        unlistenHistoryRequest();
    });
}

export async function checkForUpdates() {
    if (!GLOBAL.userConfig.update_notifications_enable) return;
    const update_status: IPCUpdateStatus = await invoke<IPCUpdateStatus>("update_check");
    if (!update_status.has_update) return;

    const webview = new WebviewWindow("updateWindow", {
        url: "update.html",
        title: "VieClone Update",
        width: 450,
        height: 300,
        minWidth: 450,
        minHeight: 300,
        decorations: false
    });

    const unlistenUpdateRequest = await webview.listen("update-request", () => {
        webview.emit("update-request-return", update_status.metadata);
    });

    const unlistenUpdateYes = await webview.listen("update-yes", () => {
        invoke("update_start");
        cleanupAndClose();
    });

    const unlistenUpdateDontShow = await webview.listen("update-dontshow", () => {
        GLOBAL.userConfig.update_notifications_enable = false;
    });

    const unlistenClose = await webview.onCloseRequested(async () => {
        unlistenClose();
        unlistenUpdateRequest();
        unlistenUpdateYes();
        unlistenUpdateDontShow();
    });
}

export async function cleanupAndClose() {
    emit("global-close");
    updateIPCUserConfigFromUI();
    await invoke("data_write_user_config", { config: GLOBAL.userConfig });
    await invoke("data_write_download_config", { config: generateIPCDownloadConfig() });
    await invoke("data_write_queue", { queue: GLOBAL.downloadQueue });
    await invoke("data_write_history", { history: GLOBAL.downloadHistory });
    await appWindow.close();
}

async function initTitlebarButtons() {
    document.getElementById("titlebar-reset-button")?.addEventListener("click", async () => {
        loadIPCDownloadConfigIntoUI(createIPCDownloadConfig());
        updateSettingsUI();
    });

    document.getElementById("titlebar-minimize-button")?.addEventListener("click", async () => {
        appWindow.minimize();
    });

    document.getElementById("titlebar-close-button")?.addEventListener("click", cleanupAndClose);
}

async function loadUserConfig() {
    let userConfig: IPCUserConfig = await invoke("data_read_user_config");
    if (!userConfig.valid) {
        userConfig = createIPCUserConfig();
    }
    GLOBAL.userConfig = userConfig;
    loadIPCUserConfigIntoUI(userConfig);
}

async function loadDownloadConfig() {
    let downloadConfig: IPCDownloadConfig = await invoke("data_read_download_config");
    if (!downloadConfig.valid) {
        downloadConfig = createIPCDownloadConfig();
    }
    loadIPCDownloadConfigIntoUI(downloadConfig);
    updateSettingsUI();
}

async function loadBulkDownloadConfigs() {
    GLOBAL.downloadQueue = await invoke("data_read_queue");
    GLOBAL.downloadHistory = await invoke("data_read_history");
}

let runOnce = true;

export async function init() {
    if (!runOnce) return;
    runOnce = false;

    initUI();
    initTitlebar();
    initTitlebarButtons();
    initInputUI();
    initSettingsUI();
    initOutputUI();
    initHistoryOpener();

    await loadUserConfig();
    await loadDownloadConfig();
    await loadBulkDownloadConfigs();

    const downloadButton = document.getElementById("output-download-button") as HTMLButtonElement | null;
    if (!await invoke("bootstrap_check")) {
        if (downloadButton) downloadButton.disabled = true;
        await invoke("bootstrap_install");
        if (downloadButton) downloadButton.disabled = false;
    }

    checkForUpdates();
}
