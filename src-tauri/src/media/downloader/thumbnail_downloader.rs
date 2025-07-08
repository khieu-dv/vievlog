use crate::{
    config::download_config::IPCDownloadConfig, logger::logger::IPCLogger,
    media::options::ProcessOptions, processor::processor::Processor,
};

use super::downloader::Downloader;

pub struct ThumbnailDownloader {
    cfg: IPCDownloadConfig,
    opts: ProcessOptions,
}

impl Downloader for ThumbnailDownloader {
    fn new(config: &IPCDownloadConfig, options: &ProcessOptions) -> Self {
        Self {
            cfg: config.clone(),
            opts: options.clone(),
        }
    }

    fn get_options(&self) -> ProcessOptions {
        self.opts.clone()
    }

    fn download(&self, logger: &IPCLogger) -> &Self {
        self.init_dir(&self.opts.path_work);

        let _ = Processor::new(logger, &self.opts.bin_ytdlp, &{
            let mut args: Vec<String> = Vec::new();

            args.push("-U".to_string());

            args.push("--ffmpeg-location".to_string());
            args.push(self.opts.bin_ffmpeg.to_string());

            // Nếu chọn "mp4-fast", cần chỉ định rõ định dạng tải
            if self.cfg.settings.format == "mp4-fast" {
                args.push("-f".to_string());
                args.push("bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]".to_string());

                args.push("--merge-output-format".to_string());
                args.push("mp4".to_string());
            }

            args.push("--skip-download".to_string());
            args.push("--write-thumbnail".to_string());

            if self.cfg.settings.custom_ytdlp_arguments_enable {
                for arg in &self.cfg.settings.custom_ytdlp_arguments {
                    args.push(arg.clone())
                }
            }

            args.push("-o".to_string());
            args.push(format!("{}/download/%(title)s", &self.opts.path_work));
            args.push(self.cfg.input.url.clone());

            args
        })
        .start();

        self
    }
}
