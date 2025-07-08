import { getCurrentWindow } from '@tauri-apps/api/window';
export const appWindow = getCurrentWindow();

export function initTitlebar() {
    document.getElementById("titlebar")?.addEventListener("mousedown", (e: MouseEvent) => {
        if (
            e.buttons === 1 &&
            e.detail !== 2 &&
            !(
                (e.target as HTMLElement).closest("button") ||
                (e.target as HTMLElement).closest("#titlebar-minimize-button") ||
                (e.target as HTMLElement).closest("#titlebar-close-button")
            )
        ) {
            appWindow.startDragging();
        }
    });
}