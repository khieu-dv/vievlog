use crate::{
    config::download_config::IPCDownloadConfig,
    logger::logger::IPCLogger,
    media::options::ProcessOptions,
    utils::directory::{create_directory, remove_directory},
};

pub trait Converter {
    fn new(config: &IPCDownloadConfig, options: &ProcessOptions) -> Self;

    fn init_dir(&self, working_dir: &str) {
        let _ = remove_directory(&format!("{}/convert", working_dir));
        let _ = create_directory(&format!("{}/convert", working_dir));
    }

    fn convert(&self, logger: &IPCLogger);
}
