import { IPCDownloadConfig } from "../../common/scripts/download-config";
import { isUrlPlaylist } from "../utils";

export function loadIPCDownloadConfigIntoUI(config: IPCDownloadConfig) {
    const $ = (id: string) => document.getElementById(id);
    
    ($("input-url-textbox")                    as HTMLInputElement).value    = config.input.url;

    ($("settings-format-select")               as HTMLSelectElement).value   = config.settings.format;

    ($("settings-trim-checkbox")               as HTMLInputElement).checked  = config.settings.trim_enable;
    ($("settings-trim-start-checkbox")         as HTMLInputElement).checked  = config.settings.trim_from_start_enable;
    ($("settings-trim-start-textbox")          as HTMLInputElement).value    = config.settings.trim_start;
    ($("settings-trim-end-checkbox")           as HTMLInputElement).checked  = config.settings.trim_to_end_enable;
    ($("settings-trim-end-textbox")            as HTMLInputElement).value    = config.settings.trim_end;

    ($("settings-size-fps-size-checkbox")      as HTMLInputElement).checked  = config.settings.size_change_enable;
    ($("settings-size-fps-width-textbox")      as HTMLInputElement).value    = config.settings.size_change_width;
    ($("settings-size-fps-height-textbox")     as HTMLInputElement).value    = config.settings.size_change_height;

    ($("settings-size-fps-framerate-checkbox") as HTMLInputElement).checked  = config.settings.fps_change_enable;
    ($("settings-size-fps-framerate-textbox")  as HTMLInputElement).value    = config.settings.fps_change_framerate;

    ($("settings-bitrate-video-checkbox")      as HTMLInputElement).checked  = config.settings.vbr_set_bitrate_enable;
    ($("settings-bitrate-video-textbox")       as HTMLInputElement).value    = config.settings.vbr_set_bitrate;
    ($("settings-bitrate-audio-checkbox")      as HTMLInputElement).checked  = config.settings.abr_set_bitrate_enable;
    ($("settings-bitrate-audio-textbox")       as HTMLInputElement).value    = config.settings.abr_set_bitrate;

    ($("settings-arguments-ytdlp-checkbox")    as HTMLInputElement).checked  = config.settings.custom_ytdlp_arguments_enable;
    ($("settings-arguments-ytdlp-textarea")    as HTMLTextAreaElement).value = config.settings.custom_ytdlp_arguments.join('\n');

    ($("settings-arguments-ffmpeg-checkbox")   as HTMLInputElement).checked  = config.settings.custom_ffmpeg_arguments_enable;
    ($("settings-arguments-ffmpeg-textarea")   as HTMLTextAreaElement).value = config.settings.custom_ffmpeg_arguments.join('\n');

    ($("output-name-textbox")                  as HTMLInputElement).value    = config.output.name;
    ($("output-path-textbox")                  as HTMLInputElement).value    = config.output.path;

    if (isUrlPlaylist(config.input.url)) ($("input-url-text")   as HTMLParagraphElement).textContent = "URL (Playlist Detected)";
    if (config.output.name !== "")       ($("output-name-text") as HTMLParagraphElement).textContent = "Name";
}