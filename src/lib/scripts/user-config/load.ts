import { IPCUserConfig } from "../../common/scripts/user-config";

export function loadIPCUserConfigIntoUI(config: IPCUserConfig) {
    const $ = (id: string) => document.getElementById(id);

    ($("output-queue-checkbox-enable") as HTMLInputElement).checked = config.ui_queue_enable;

    if (config.ui_queue_enable) ($("output-download-button") as HTMLButtonElement).textContent = "Download Queue";
}