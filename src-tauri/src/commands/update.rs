use crate::updater::{
    check::{check_for_updates, IPCUpdateStatus},
    updater::Updater,
};

#[tauri::command(async)]
pub fn update_start() {
    Updater::new().update();
}

#[tauri::command(async)]
pub async fn update_check() -> IPCUpdateStatus {
    check_for_updates().await
}
