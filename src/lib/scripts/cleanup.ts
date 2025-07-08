import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";

import { GLOBAL, appWindow } from "./main";
import { generateIPCDownloadConfig } from "./download-config/generate";
import { updateIPCUserConfigFromUI } from "./user-config/update";

export async function cleanupAndClose() {
    emit("global-close");
    updateIPCUserConfigFromUI();
    await invoke("data_write_user_config", { config: GLOBAL.userConfig });
    await invoke("data_write_download_config", { config: generateIPCDownloadConfig() });
    await invoke("data_write_queue", { queue: GLOBAL.downloadQueue });
    await invoke("data_write_history", { history: GLOBAL.downloadHistory });
    appWindow.close();
}