use futures_util::join;
use tauri::AppHandle;

use crate::{
    bin::{FFMPEG_PATH, YTDLP_PATH},
    bootstrap::{ffmpeg::bootstrap_ffmpeg, ytdlp::bootstrap_ytdlp},
    logger::logger::IPCLogger,
    utils::file::file_exists,
};

#[tauri::command(async)]
pub async fn bootstrap_install(app: AppHandle) {
    let ytdlp_logger: IPCLogger = IPCLogger::new(app.clone());
    let ffmpeg_logger: IPCLogger = IPCLogger::new(app.clone());

    join!(
        bootstrap_ytdlp(&ytdlp_logger),
        bootstrap_ffmpeg(&ffmpeg_logger)
    );
}

#[tauri::command]
pub fn bootstrap_check() -> bool {
    file_exists(YTDLP_PATH) && file_exists(FFMPEG_PATH)
}
