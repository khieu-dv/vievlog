import { listen } from "@tauri-apps/api/event";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

import { IPCLoggerEvent } from "../../common/scripts/logger";

export function initMiniConsole() {
    let consoleTextarea = document.getElementById("output-console-textarea") as HTMLTextAreaElement | null;
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