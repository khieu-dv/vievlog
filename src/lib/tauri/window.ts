// src/lib/tauri/window.ts
import { getCurrentWindow } from "@tauri-apps/api/window";

export const appWindow = getCurrentWindow();

// src/lib/tauri/api.ts
import { invoke } from "@tauri-apps/api/core";
import { fetch } from '@tauri-apps/plugin-http';

export interface DeviceIdResponse {
  id: string;
}

export interface DownloadPermissionResponse {
  status: boolean;
  message?: string;
}

export async function generateAppId(): Promise<string> {
  try {
    const id = await invoke<string>("generate_app_id");
    return id;
  } catch (error) {
    console.error("Failed to get device ID:", error);
    throw error;
  }
}

export async function checkDownloadPermission(userId: string): Promise<DownloadPermissionResponse> {
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
}

export async function bootstrapCheck(): Promise<boolean> {
  return await invoke<boolean>("bootstrap_check");
}

export async function bootstrapInstall(): Promise<void> {
  await invoke("bootstrap_install");
}

export async function startDownload(config: IPCDownloadConfig): Promise<IPCDownloadConfig> {
  return await invoke<IPCDownloadConfig>("download", { config });
}

export async function launchUrl(url: string): Promise<void> {
  await invoke("util_launch_url", { url });
}

export async function openPathLocation(path: string): Promise<void> {
  await invoke("util_open_path_location", { path });
}

export async function writeUserConfig(config: IPCUserConfig): Promise<void> {
  await invoke("data_write_user_config", { config });
}

export async function writeDownloadConfig(config: IPCDownloadConfig): Promise<void> {
  await invoke("data_write_download_config", { config });
}

export async function writeQueue(queue: IPCDownloadConfig[]): Promise<void> {
  await invoke("data_write_queue", { queue });
}

export async function writeHistory(history: IPCDownloadConfig[]): Promise<void> {
  await invoke("data_write_history", { history });
}

export async function readUserConfig(): Promise<IPCUserConfig> {
  return await invoke<IPCUserConfig>("data_read_user_config");
}

export async function readDownloadConfig(): Promise<IPCDownloadConfig> {
  return await invoke<IPCDownloadConfig>("data_read_download_config");
}

export async function readQueue(): Promise<IPCDownloadConfig[]> {
  return await invoke<IPCDownloadConfig[]>("data_read_queue");
}

export async function readHistory(): Promise<IPCDownloadConfig[]> {
  return await invoke<IPCDownloadConfig[]>("data_read_history");
}

export async function updateCheck(): Promise<IPCUpdateStatus> {
  return await invoke<IPCUpdateStatus>("update_check");
}

export async function updateStart(): Promise<void> {
  await invoke("update_start");
}

// src/types/download.ts
export interface IPCDownloadInputConfig {
  url: string;
  is_playlist: boolean;
  download_type: string;
}

export interface IPCDownloadSettingsConfig {
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

export interface IPCDownloadOutputConfig {
  name: string;
  path: string;
}

export interface IPCDownloadConfig {
  valid: boolean;
  input: IPCDownloadInputConfig;
  settings: IPCDownloadSettingsConfig;
  output: IPCDownloadOutputConfig;
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

// src/types/user.ts
export interface IPCUserConfig {
  valid: boolean;
  ui_queue_enable: boolean;
  update_notifications_enable: boolean;
}

export function createIPCUserConfig(): IPCUserConfig {
  return {
    valid: true,
    ui_queue_enable: false,
    update_notifications_enable: true
  };
}

// src/types/logger.ts
export interface IPCLoggerEvent {
  text: string;
}

// src/types/update.ts
export interface IPCUpdateMetadata {
  version_id: number;
  version: string;
  description: string;
}

export interface IPCUpdateStatus {
  has_update: boolean;
  metadata: IPCUpdateMetadata;
}

// src/lib/utils/url.ts
export function isUrlPlaylist(url: string): boolean {
  const playlistKeywords = ["/playlist?", "&list=", "?list=", "/sets"];
  return playlistKeywords.some(keyword => url.includes(keyword));
}

// src/lib/utils/dialog.ts
import { open } from "@tauri-apps/plugin-dialog";

export async function selectFolderDialogAsync(): Promise<string> {
  const file = await open({
    directory: true,
  });
  return file ? file : "";
}

// src/lib/store/global-store.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface GlobalState {
  userConfig: IPCUserConfig;
  downloadQueue: IPCDownloadConfig[];
  downloadHistory: IPCDownloadConfig[];
  setUserConfig: (config: IPCUserConfig) => void;
  setDownloadQueue: (queue: IPCDownloadConfig[]) => void;
  setDownloadHistory: (history: IPCDownloadConfig[]) => void;
  addToQueue: (config: IPCDownloadConfig) => void;
  addToHistory: (config: IPCDownloadConfig) => void;
  removeFromQueue: (indices: number[]) => void;
  removeFromHistory: (indices: number[]) => void;
}

export const useGlobalStore = create<GlobalState>()(
  subscribeWithSelector((set, get) => ({
    userConfig: createIPCUserConfig(),
    downloadQueue: [],
    downloadHistory: [],
    setUserConfig: (config) => set({ userConfig: config }),
    setDownloadQueue: (queue) => set({ downloadQueue: queue }),
    setDownloadHistory: (history) => set({ downloadHistory: history }),
    addToQueue: (config) => set((state) => ({ 
      downloadQueue: [...state.downloadQueue, config] 
    })),
    addToHistory: (config) => set((state) => ({ 
      downloadHistory: [...state.downloadHistory, config] 
    })),
    removeFromQueue: (indices) => set((state) => ({
      downloadQueue: state.downloadQueue.filter((_, index) => !indices.includes(index))
    })),
    removeFromHistory: (indices) => set((state) => ({
      downloadHistory: state.downloadHistory.filter((_, index) => !indices.includes(index))
    })),
  }))
);

// src/hooks/use-tauri-events.ts
import { useEffect } from 'react';
import { listen } from "@tauri-apps/api/event";

export function useTauriEvents() {
  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      unlisten = await listen<IPCLoggerEvent>("log", (event) => {
        console.log("Tauri log:", event.payload.text);
        // You can dispatch this to a logger store or component
      });
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);
}
