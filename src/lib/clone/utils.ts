// lib/utils.ts
import { open } from '@tauri-apps/plugin-dialog';
import { IPCDownloadConfig, IPCUserConfig } from './types';

export function isUrlPlaylist(url: string): boolean {
  const playlistKeywords = ['/playlist?', '&list=', '?list=', '/sets'];
  return playlistKeywords.some((keyword) => url.includes(keyword));
}

export async function selectFolderDialogAsync(): Promise<string> {
  const file = await open({
    directory: true,
  });
  return file ? file.toString() : '';
}

export function createIPCDownloadConfig(): IPCDownloadConfig {
  return {
    valid: true,
    input: {
      url: '',
      is_playlist: false,
      download_type: 'default',
    },
    settings: {
      format: 'mp4-fast',
      format_type: 'video',
      trim_enable: false,
      trim_from_start_enable: false,
      trim_start: '0:00',
      trim_to_end_enable: false,
      trim_end: '0:10',
      size_change_enable: false,
      size_change_width: '1280',
      size_change_height: '-1',
      fps_change_enable: false,
      fps_change_framerate: '30',
      vbr_set_bitrate_enable: true,
      vbr_set_bitrate: '10M',
      abr_set_bitrate_enable: true,
      abr_set_bitrate: '320k',
      custom_ytdlp_arguments_enable: false,
      custom_ytdlp_arguments: [],
      custom_ffmpeg_arguments_enable: false,
      custom_ffmpeg_arguments: [],
    },
    output: {
      name: '',
      path: '',
    },
  };
}

export function createIPCUserConfig(): IPCUserConfig {
  return {
    valid: true,
    ui_queue_enable: false,
    update_notifications_enable: true,
  };
}