import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

import { GLOBAL } from "../main";
import { generateIPCDownloadConfig } from "../download-config/generate";
import { loadIPCDownloadConfigIntoUI } from "../download-config/load";

export function initQueueOpener() {
    document.getElementById("output-queue-add-button")?.addEventListener("click", async () => {
        const nameTextbox = document.getElementById("output-name-textbox") as HTMLButtonElement | null;

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

    document.getElementById("output-queue-edit-button")?.addEventListener("click", async () => {
        openQueueWindow();
    });

    document.getElementById("output-queue-checkbox-enable")?.addEventListener("change", async (event) => {
        const checkbox = event.target as HTMLInputElement;

        const button = document.getElementById("output-download-button") as HTMLButtonElement | null;
        console.log("Queue checkbox changed:", checkbox.checked);
        if (checkbox.checked) {
            if (button) {
                button.innerText = "Download Queue";
            }
        } else {
            if (button) {
                button.innerText = "Download";
            }
        }
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

    const unlistenQueueLoad = await webview.listen<number>("queue-load", (event) => {
        loadIPCDownloadConfigIntoUI(GLOBAL.downloadQueue[event.payload]);
    });

    const unlistenQueueRemove = await webview.listen<number[]>("queue-remove", (event) => {
        const sortedIndices = [...event.payload].sort((a, b) => b - a);

        sortedIndices.forEach(index => {
            if (index >= 0 && index < GLOBAL.downloadQueue.length) {
                GLOBAL.downloadQueue.splice(index, 1);
            }
        });
    });

    const unlistenClose = await webview.onCloseRequested(async () => {
        unlistenClose();

        unlistenQueueRequest();
        unlistenQueueLoad();
        unlistenQueueRemove();
    });
}