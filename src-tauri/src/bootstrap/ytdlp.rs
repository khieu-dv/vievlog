use crate::bin::YTDLP_PATH;
use crate::logger::logger::IPCLogger;
use crate::utils::{directory::create_directory, file::file_exists, net::download_file_async};

#[cfg(target_os = "windows")]
pub async fn bootstrap_ytdlp(logger: &IPCLogger) {
    if file_exists(YTDLP_PATH) {
        return;
    }

    let _ = create_directory("VieClone/bin");

    logger.log("Downloading yt-dlp...");
    let _ = download_file_async(
        "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe",
        YTDLP_PATH,
    )
    .await;

    logger.log(&format!("Downloaded yt-dlp to \"{}\"", YTDLP_PATH));
}

#[cfg(target_os = "linux")]
pub async fn bootstrap_ytdlp(logger: &IPCLogger) {
    use crate::utils::linux::linux_permit_file;

    if file_exists(YTDLP_PATH) {
        return;
    }

    let _ = create_directory("VieClone/bin");

    logger.log("Downloading yt-dlp...");
    let _ = download_file_async(
        "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux",
        YTDLP_PATH,
    )
    .await;

    linux_permit_file(YTDLP_PATH, 0o111);

    logger.log(&format!("Downloaded yt-dlp to \"{}\"", YTDLP_PATH));
}
