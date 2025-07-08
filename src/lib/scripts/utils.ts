import { open } from "@tauri-apps/plugin-dialog";

export function isUrlPlaylist(url: String) {
    const playlistKeywords = ["/playlist?", "&list=", "?list=", "/sets"];
    for (const keyword of playlistKeywords) {
        if (url.includes(keyword)) {
            return true;
        }
    }
    return false;
}

export async function selectFolderDialogAsync(): Promise<String> {
    const file = await open({
        directory: true,
    });

    return file ? file : "";
}