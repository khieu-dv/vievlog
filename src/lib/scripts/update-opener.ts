import { invoke } from "@tauri-apps/api/core";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

import { GLOBAL } from "./main";
import { IPCUpdateStatus } from "../common/scripts/update";
import { cleanupAndClose } from "./cleanup";

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