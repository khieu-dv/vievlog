import { getCurrentWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/core";
import { fetch } from '@tauri-apps/plugin-http';
import { init } from "./init";
import { createIPCUserConfig, IPCUserConfig } from "../common/scripts/user-config";
import { IPCDownloadConfig } from "../common/scripts/download-config";

export const appWindow = getCurrentWindow();

interface Global {
    userConfig: IPCUserConfig;
    downloadQueue: IPCDownloadConfig[];
    downloadHistory: IPCDownloadConfig[];
}

export let GLOBAL: Global = {
    userConfig: createIPCUserConfig(),
    downloadQueue: [],
    downloadHistory: []
};

async function displayDeviceId() {
    try {
        const id = await invoke("generate_app_id");
        const idElement = document.getElementById("titlebar-id-text");
        if (idElement) {
            idElement.textContent = `ID: ${id || "N/A"}`;
        }
        return id;
    } catch (error) {
        console.error("Failed to get device ID:", error);
        const idElement = document.getElementById("titlebar-id-text");
        if (idElement) {
            idElement.textContent = "ID: Error";
        }
        return null;
    }
}

async function checkDownloadPermission(userId: string): Promise<{ status: boolean; message?: string }> {
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

async function startDownload() {
    const consoleTextarea = document.getElementById("output-console-textarea") as HTMLTextAreaElement;
    const userId = await displayDeviceId();

    if (!userId || typeof userId !== "string") {
        if (consoleTextarea) {
            consoleTextarea.value = "Error: Could not retrieve user ID\n" + consoleTextarea.value;
        }
        return;
    }

    const permission = await checkDownloadPermission(userId);
    if (permission.status) {
        // Proceed with download logic (replace with your actual download implementation)
        if (consoleTextarea) {
            consoleTextarea.value = `Download permitted: ${permission.message || "Starting download"}\n` + consoleTextarea.value;
        }
        // Example: Trigger download logic here
        // await invoke("start_download", { config: GLOBAL.downloadQueue });
    } else {
        if (consoleTextarea) {
            consoleTextarea.value = `Error: ${permission.message}\n` + consoleTextarea.value;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Main script loaded");
    init();
    displayDeviceId();

    const downloadButton = document.getElementById("output-download-button");
    if (downloadButton) {
        downloadButton.addEventListener("click", startDownload);
    }
});