import { invoke } from "@tauri-apps/api/core";

import { IPCDownloadConfig } from "../../common/scripts/download-config";
import { generateIPCDownloadConfig } from "../download-config/generate";
import { GLOBAL } from "../main";

export function initDownloadButton() {
    document.getElementById("output-download-button")?.addEventListener("click", () => {
        console.log("Download button clicked");
        startDownloadAsync();
    });
}

export async function startDownloadAsync() {
    const downloadButton = document.getElementById("output-download-button") as HTMLButtonElement | null;
    if (downloadButton) downloadButton.disabled = true;

    const progressBar = document.getElementById("progress-bar") as HTMLDivElement | null;
    if (progressBar) progressBar.style.width = `0vw`;

    const consoleTextarea = document.getElementById("output-console-textarea") as HTMLTextAreaElement | null;
    if (consoleTextarea) consoleTextarea.value = "";

    const queueCheckbox = document.getElementById("output-queue-checkbox-enable") as HTMLInputElement | null;
    if (queueCheckbox?.checked) {
        for (let i = 0; i < GLOBAL.downloadQueue.length; ++i) {
            await downloadAsync(GLOBAL.downloadQueue[i]);

            let percent = (i + 1) / GLOBAL.downloadQueue.length * 100;
            if (progressBar) progressBar.style.width = `${percent}vw`;
        };
    }
    else {
        await downloadAsync(generateIPCDownloadConfig());
        if (progressBar) progressBar.style.width = `100vw`;
    }

    if (downloadButton) downloadButton.disabled = false;
}

async function downloadAsync(downloadConfig: IPCDownloadConfig) {
    let purifiedDownloadConfig: IPCDownloadConfig = await invoke("download", { config: downloadConfig });
    GLOBAL.downloadHistory.push(purifiedDownloadConfig);
}