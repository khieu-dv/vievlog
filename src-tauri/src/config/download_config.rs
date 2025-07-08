use serde::{Deserialize, Serialize};

use crate::utils::string::clean_string_vector;

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct IPCDownloadInputConfig {
    pub url: String,
    pub is_playlist: bool,
    pub download_type: String,
}

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct IPCDownloadSettingsConfig {
    pub format: String,
    pub format_type: String,

    pub trim_enable: bool,
    pub trim_from_start_enable: bool,
    pub trim_start: String,
    pub trim_to_end_enable: bool,
    pub trim_end: String,

    pub size_change_enable: bool,
    pub size_change_width: String,
    pub size_change_height: String,

    pub fps_change_enable: bool,
    pub fps_change_framerate: String,

    pub vbr_set_bitrate_enable: bool,
    pub vbr_set_bitrate: String,
    pub abr_set_bitrate_enable: bool,
    pub abr_set_bitrate: String,

    pub custom_ytdlp_arguments_enable: bool,
    pub custom_ytdlp_arguments: Vec<String>,

    pub custom_ffmpeg_arguments_enable: bool,
    pub custom_ffmpeg_arguments: Vec<String>,
}

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct IPCDownloadOutputConfig {
    pub name: String,
    pub path: String,
}

#[derive(Serialize, Deserialize, Clone, Default)]
pub struct IPCDownloadConfig {
    pub valid: bool,

    pub input: IPCDownloadInputConfig,
    pub settings: IPCDownloadSettingsConfig,
    pub output: IPCDownloadOutputConfig,
}

impl IPCDownloadConfig {
    pub fn purify(&mut self) {
        clean_string_vector(&mut self.settings.custom_ytdlp_arguments);
        clean_string_vector(&mut self.settings.custom_ffmpeg_arguments);
    }
}
