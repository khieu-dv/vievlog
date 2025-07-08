import { invoke } from "@tauri-apps/api/core";

import { GLOBAL, appWindow } from "./main";

import { initUI } from "../common/scripts/ui";
import { initTitlebar } from "../common/scripts/titlebar";
import { initInputUI } from "./input/input";
import { initSettingsUI } from "./settings/settings";
import { updateSettingsUI } from "./settings/settings-ui-handler";
import { initOutputUI } from "./output/output";
import { initHistoryOpener } from "./history-opener";

import { createIPCUserConfig, IPCUserConfig } from "../common/scripts/user-config";
import { loadIPCUserConfigIntoUI } from "./user-config/load";

import { IPCDownloadConfig, createIPCDownloadConfig } from "../common/scripts/download-config";
import { loadIPCDownloadConfigIntoUI } from "./download-config/load";

import { checkForUpdates } from "./update-opener";
import { cleanupAndClose } from "./cleanup";

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

    loadUserConfig();
    loadDownloadConfig();

    loadBulkDownloadConfigs();

    const downloadButton = document.getElementById("output-download-button") as HTMLButtonElement | null;

    console.log("Checking download permission...");

    if (!await invoke("bootstrap_check")) {
        if (downloadButton) downloadButton.disabled = true;
        await invoke("bootstrap_install")
        if (downloadButton) downloadButton.disabled = false;
    }

    checkForUpdates();
}

async function initTitlebarButtons() {
    document.getElementById("titlebar-reset-button")?.addEventListener("click", async () => {
        loadIPCDownloadConfigIntoUI(createIPCDownloadConfig());
        updateSettingsUI();
    });

    document.getElementById("titlebar-minimize-button")?.addEventListener("click", async () => {
        appWindow.minimize();
    });

    document.getElementById("titlebar-close-button")?.addEventListener("click", async () => {
        cleanupAndClose();
    });
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