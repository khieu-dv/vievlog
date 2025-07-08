import { invoke } from "@tauri-apps/api/core";

import { isUrlPlaylist } from "../utils";

export function initInputUI() {
    const inputUrlTextbox = document.getElementById("input-url-textbox") as HTMLInputElement | null;

    inputUrlTextbox?.addEventListener("input", () => {
        const inputUrlText = document.getElementById("input-url-text") as HTMLInputElement | null;

        if (!inputUrlText) return;

        if (isUrlPlaylist(inputUrlTextbox.value)) {
            inputUrlText.textContent = "URL (Playlist Detected)";
        }
        else {
            inputUrlText.textContent = "URL";
        }
    });

    inputUrlTextbox?.addEventListener("dblclick", () => {
        if (!inputUrlTextbox) return;
        invoke("util_launch_url", { url: inputUrlTextbox.value })
    });
}