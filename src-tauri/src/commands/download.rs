use tauri::AppHandle;

use crate::media::downloader::default_downloader::DefaultDownloader;
use crate::media::downloader::downloader::Downloader;
use crate::media::downloader::thumbnail_downloader::ThumbnailDownloader;

use crate::media::converter::audio_converter::AudioConverter;
use crate::media::converter::converter::Converter;
use crate::media::converter::gif_converter::GifConverter;
use crate::media::converter::image_converter::ImageConverter;
use crate::media::converter::sequence_converter::SequenceConverter;
use crate::media::converter::video_converter::VideoConverter;

use crate::media::finalizer::finalizer::Finalizer;

use crate::media::options::ProcessOptions;

use crate::config::download_config::IPCDownloadConfig;

use crate::utils::directory::remove_directory;
use crate::utils::file::{normalize_path, read_file, write_file};
use crate::utils::serial::{deserialize_file_read, serialize_file_write, WriteType};

use crate::logger::logger::IPCLogger;

use crate::bin::{FFMPEG_PATH, YTDLP_PATH};

#[tauri::command(async)]
pub fn download(app: AppHandle, mut config: IPCDownloadConfig) -> IPCDownloadConfig {
    config.purify();

    let logger: IPCLogger = IPCLogger::new(app);

    let options: ProcessOptions = ProcessOptions {
        path_work: "VieClone/_temp".to_string(),
        bin_ytdlp: YTDLP_PATH.to_string(),
        bin_ffmpeg: FFMPEG_PATH.to_string(),
    };

    // determine if the download should be skipped or not
    let download_lock: IPCDownloadConfig =
        deserialize_file_read("VieClone/_temp/download_lock.json", false);

    let should_download: bool = config.input.url != download_lock.input.url
        || config.input.download_type != download_lock.input.download_type;

    if should_download {
        let _ = remove_directory("VieClone/_temp");
        let download_name: String = step_download(&config, &options, &logger);

        // write the lock file
        // this file is used to detect if a re-download is required the next time the user starts a download
        // such as if the user just changes the format, there would be no need to re-download the entire video
        serialize_file_write(
            "VieClone/_temp/download_lock.json",
            &config,
            WriteType::Squash,
        );

        let _ = write_file("VieClone/_temp/download_name.txt", &download_name);
    }

    step_convert(&config, &options, &logger);

    let finalize_name: String = if config.output.name.is_empty() {
        match read_file("VieClone/_temp/download_name.txt") {
            Ok(contents) => contents,
            Err(_) => "Unnamed".to_string(),
        }
    } else {
        config.output.name.clone()
    };

    let last_output_path: String = normalize_path(&step_finalize(&config, &finalize_name));
    let _ = write_file("VieClone/_temp/last_output_path.txt", &last_output_path);

    // update config with new name, so it can be returned to the frontend
    config.output.name = finalize_name;

    config
}

fn step_download(
    config: &IPCDownloadConfig,
    options: &ProcessOptions,
    logger: &IPCLogger,
) -> String {
    match config.input.download_type.as_str() {
        "thumbnail" => ThumbnailDownloader::new(config, options)
            .download(logger)
            .get_download_name(),
        "default" => DefaultDownloader::new(config, options)
            .download(logger)
            .get_download_name(),
        _ => String::new(),
    }
}

fn step_convert(config: &IPCDownloadConfig, options: &ProcessOptions, logger: &IPCLogger) {
    match config.settings.format_type.as_str() {
        "video" => VideoConverter::new(config, options).convert(logger),
        "audio" => AudioConverter::new(config, options).convert(logger),
        "gif" => GifConverter::new(config, options).convert(logger),
        "sequence" => SequenceConverter::new(config, options).convert(logger),
        "image" => ImageConverter::new(config, options).convert(logger),
        _ => {}
    }
}

fn step_finalize(config: &IPCDownloadConfig, finalize_name: &str) -> String {
    Finalizer::new(config)
        .finalize(finalize_name)
        .get_last_output_path()
}
