#[cfg(target_os = "windows")]
pub const YTDLP_PATH: &str = "VieClone/bin/yt-dlp.exe";
#[cfg(target_os = "windows")]
pub const FFMPEG_PATH: &str = "VieClone/bin/ffmpeg.exe";

#[cfg(target_os = "linux")]
pub const YTDLP_PATH: &str = "./VieClone/bin/yt-dlp";
#[cfg(target_os = "linux")]
pub const FFMPEG_PATH: &str = "./VieClone/bin/ffmpeg";
