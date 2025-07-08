import { invoke } from "@tauri-apps/api/core";

import { selectFolderDialogAsync } from "../utils";
import { initMiniConsole, openConsoleWindow } from "./console-opener";
import { initQueueOpener } from "./queue-opener";
import { initDownloadButton } from "./download";
import { generateIPCDownloadConfig } from "../download-config/generate";

export function initOutputUI() {
    const outputNameTextbox = document.getElementById("output-name-textbox") as HTMLInputElement | null;
    const outputNameText = document.getElementById("output-name-text") as HTMLInputElement | null;
    if (!outputNameTextbox || !outputNameText) return;

    outputNameTextbox?.addEventListener("input", () => {
        if (outputNameTextbox.value === "") {
            outputNameText.textContent = "Name (Auto)";
        }
        else {
            outputNameText.textContent = "Name";
        }
    });

    document.getElementById("output-path-button")?.addEventListener("click", async () => {
        let file = await selectFolderDialogAsync();

        const pathTextbox = document.getElementById("output-path-textbox") as HTMLInputElement | null;
        if (!pathTextbox) return;

        pathTextbox.value = file.toString();
    });

    document.getElementById("output-path-open-button")?.addEventListener("click", async () => {
        invoke("util_open_path_location", { path: generateIPCDownloadConfig().output.path });
    });

    document.getElementById("output-console-open-button")?.addEventListener("click", async () => {
        openConsoleWindow();
    });

    initQueueOpener();
    initDownloadButton();
    initMiniConsole();
}