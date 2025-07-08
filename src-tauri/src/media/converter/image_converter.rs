use crate::{
    config::download_config::IPCDownloadConfig,
    logger::logger::IPCLogger,
    media::options::ProcessOptions,
    processor::processor::Processor,
    utils::file::{get_files, get_mediasafe_filename},
};

use super::converter::Converter;

pub struct ImageConverter {
    cfg: IPCDownloadConfig,
    opts: ProcessOptions,
}

impl Converter for ImageConverter {
    fn new(config: &IPCDownloadConfig, options: &ProcessOptions) -> Self {
        Self {
            cfg: config.clone(),
            opts: options.clone(),
        }
    }

    fn convert(&self, logger: &IPCLogger) {
        self.init_dir(&self.opts.path_work);

        let extension = match self.cfg.settings.format.as_str() {
            "png-thumbnail" => "png",
            "jpg-thumbnail" => "jpg",
            _ => "",
        };

        for input_file in get_files(&format!("{}/download", self.opts.path_work)) {
            let _ = Processor::new(logger, &self.opts.bin_ffmpeg, &{
                let mut args: Vec<String> = Vec::new();

                args.push("-y".to_string());

                args.push("-i".to_string());
                args.push(input_file.clone());

                if self.cfg.settings.size_change_enable
                    && self.cfg.settings.size_change_width.parse::<i32>().is_ok()
                    && self.cfg.settings.size_change_height.parse::<i32>().is_ok()
                {
                    args.push("-vf".to_string());
                    args.push(format!(
                        "scale={}:{},setsar=1",
                        self.cfg.settings.size_change_width, self.cfg.settings.size_change_height
                    ));
                }

                if self.cfg.settings.custom_ffmpeg_arguments_enable {
                    for arg in &self.cfg.settings.custom_ffmpeg_arguments {
                        args.push(arg.clone())
                    }
                }

                args.push(format!(
                    "{}/convert/{}.{}",
                    self.opts.path_work,
                    get_mediasafe_filename(&input_file, false),
                    extension
                ));

                args
            })
            .start();
        }
    }
}
