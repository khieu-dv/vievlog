import { IPCDownloadConfig } from "../../common/scripts/download-config";
import { isUrlPlaylist } from "../utils";

export function generateIPCDownloadConfig(): IPCDownloadConfig {
    const $ = (id: string) => document.getElementById(id);

    const url = (document.getElementById("input-url-textbox") as HTMLInputElement).value;

    const settingsFormatSelect = document.getElementById("settings-format-select") as HTMLSelectElement;
    let formatType = "null";
    if (settingsFormatSelect) {
        const selectedOption = settingsFormatSelect.options[settingsFormatSelect.selectedIndex];
        if (selectedOption) {
            const attribute = selectedOption.getAttribute("type-value");
            formatType = attribute ?? "null";
        }
    }

    let downloadType;
    switch (formatType) {
        case "image": downloadType = "thumbnail"; break;
        default: downloadType = "default"; break;
    }

    const config: IPCDownloadConfig = {
        valid: true,

        input: {
            url:           url,
            is_playlist:   isUrlPlaylist(url),
            download_type: downloadType
        },

        settings: {
            format:                         ($("settings-format-select")               as HTMLSelectElement).value,
            format_type:                    formatType,

            trim_enable:                    ($("settings-trim-checkbox")               as HTMLInputElement)   .checked,
            trim_from_start_enable:         ($("settings-trim-start-checkbox")         as HTMLInputElement)   .checked,
            trim_start:                     ($("settings-trim-start-textbox")          as HTMLInputElement)   .value,
            trim_to_end_enable:             ($("settings-trim-end-checkbox")           as HTMLInputElement)   .checked,
            trim_end:                       ($("settings-trim-end-textbox")            as HTMLInputElement)   .value,

            size_change_enable:             ($("settings-size-fps-size-checkbox")      as HTMLInputElement)   .checked,
            size_change_width:              ($("settings-size-fps-width-textbox")      as HTMLInputElement)   .value,
            size_change_height:             ($("settings-size-fps-height-textbox")     as HTMLInputElement)   .value,

            fps_change_enable:              ($("settings-size-fps-framerate-checkbox") as HTMLInputElement)   .checked,
            fps_change_framerate:           ($("settings-size-fps-framerate-textbox")  as HTMLInputElement)   .value,

            vbr_set_bitrate_enable:         ($("settings-bitrate-video-checkbox")      as HTMLInputElement)   .checked,
            vbr_set_bitrate:                ($("settings-bitrate-video-textbox")       as HTMLInputElement)   .value,
            abr_set_bitrate_enable:         ($("settings-bitrate-audio-checkbox")      as HTMLInputElement)   .checked,
            abr_set_bitrate:                ($("settings-bitrate-audio-textbox")       as HTMLInputElement)   .value,

            custom_ytdlp_arguments_enable:  ($("settings-arguments-ytdlp-checkbox")    as HTMLInputElement)   .checked,
            custom_ytdlp_arguments:         ($("settings-arguments-ytdlp-textarea")    as HTMLTextAreaElement).value.split('\n'),
            
            custom_ffmpeg_arguments_enable: ($("settings-arguments-ffmpeg-checkbox")   as HTMLInputElement)   .checked,
            custom_ffmpeg_arguments:        ($("settings-arguments-ffmpeg-textarea")   as HTMLTextAreaElement).value.split('\n')
        },

        output: {
            name: ($("output-name-textbox") as HTMLInputElement).value,
            path: ($("output-path-textbox") as HTMLInputElement).value
        }
    };

    return config;
}