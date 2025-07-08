import { GLOBAL } from "../main";

export function updateIPCUserConfigFromUI() {
    const $ = (id: string) => document.getElementById(id);

    GLOBAL.userConfig.ui_queue_enable = ($("output-queue-checkbox-enable") as HTMLInputElement).checked;
}