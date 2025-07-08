interface IPCDownloadInputConfig {
    url:           string;
    is_playlist:   boolean;
    download_type: string;
}

interface IPCDownloadSettingsConfig {
    format:                         string;
    format_type:                    string;

    trim_enable:                    boolean;
    trim_from_start_enable:         boolean;
    trim_start:                     string;
    trim_to_end_enable:             boolean;
    trim_end:                       string;

    size_change_enable:             boolean;
    size_change_width:              string;
    size_change_height:             string;

    fps_change_enable:              boolean;
    fps_change_framerate:           string;

    vbr_set_bitrate_enable:         boolean,
    vbr_set_bitrate:                string,
    abr_set_bitrate_enable:         boolean,
    abr_set_bitrate:                string,

    custom_ffmpeg_arguments_enable: boolean;
    custom_ffmpeg_arguments:        string[];

    custom_ytdlp_arguments_enable:  boolean;
    custom_ytdlp_arguments:         string[];
}

interface IPCDownloadOutputConfig {
    name: string;
    path: string;
}

export interface IPCDownloadConfig {
    valid:    boolean;

    input:    IPCDownloadInputConfig;
    settings: IPCDownloadSettingsConfig;
    output:   IPCDownloadOutputConfig;
}

export function createIPCDownloadConfig(): IPCDownloadConfig {
    return {
        valid: true,

        input: {
            url:           "",
            is_playlist:   false,
            download_type: "default"
        },

        settings: {
            format:                         "mp4-fast",
            format_type:                    "video",

            trim_enable:                    false,
            trim_from_start_enable:         false,
            trim_start:                     "0:00",
            trim_to_end_enable:             false,
            trim_end:                       "0:10",

            size_change_enable:             false,
            size_change_width:              "1280",
            size_change_height:             "-1",

            fps_change_enable:              false,
            fps_change_framerate:           "30",

            vbr_set_bitrate_enable:         true,
            vbr_set_bitrate:                "10M",
            abr_set_bitrate_enable:         true,
            abr_set_bitrate:                "320k",

            custom_ytdlp_arguments_enable:  false,
            custom_ytdlp_arguments:         [],

            custom_ffmpeg_arguments_enable: false,
            custom_ffmpeg_arguments:        []
        },

        output: {
            name: "",
            path: ""
        }
    };
}