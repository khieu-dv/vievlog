// lib/types.ts
export interface IPCDownloadInputConfig {
  url: string;
  is_playlist: boolean;
  download_type: string;
}

export interface IPCDownloadSettingsConfig {
  format: string;
  format_type: string;
  trim_enable: boolean;
  trim_from_start_enable: boolean;
  trim_start: string;
  trim_to_end_enable: boolean;
  trim_end: string;
  size_change_enable: boolean;
  size_change_width: string;
  size_change_height: string;
  fps_change_enable: boolean;
  fps_change_framerate: string;
  vbr_set_bitrate_enable: boolean;
  vbr_set_bitrate: string;
  abr_set_bitrate_enable: boolean;
  abr_set_bitrate: string;
  custom_ffmpeg_arguments_enable: boolean;
  custom_ffmpeg_arguments: string[];
  custom_ytdlp_arguments_enable: boolean;
  custom_ytdlp_arguments: string[];
}

export interface IPCDownloadOutputConfig {
  name: string;
  path: string;
}

export interface IPCDownloadConfig {
  valid: boolean;
  input: IPCDownloadInputConfig;
  settings: IPCDownloadSettingsConfig;
  output: IPCDownloadOutputConfig;
}

export interface IPCLoggerEvent {
  text: string;
}

export interface IPCUpdateMetadata {
  version_id: number;
  version: string;
  description: string;
}

export interface IPCUpdateStatus {
  has_update: boolean;
  metadata: IPCUpdateMetadata;
}

export interface IPCUserConfig {
  valid: boolean;
  ui_queue_enable: boolean;
  update_notifications_enable: boolean;
}