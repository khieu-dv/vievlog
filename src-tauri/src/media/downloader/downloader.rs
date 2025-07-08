use crate::{
    config::download_config::IPCDownloadConfig,
    logger::logger::IPCLogger,
    media::options::ProcessOptions,
    utils::{
        directory::{create_directory, remove_directory},
        file::{get_files, get_mediasafe_filename},
    },
};

pub trait Downloader {
    fn new(config: &IPCDownloadConfig, options: &ProcessOptions) -> Self;

    fn init_dir(&self, working_dir: &str) {
        let _ = remove_directory(&format!("{}/download", working_dir));
        let _ = create_directory(&format!("{}/download", working_dir));
    }

    fn get_options(&self) -> ProcessOptions;

    fn download(&self, logger: &IPCLogger) -> &Self;

    // returns the name of the downloaded file
    fn get_download_name(&self) -> String {
        let options: ProcessOptions = self.get_options();

        let downloaded_files: Vec<String> = get_files(&format!("{}/download", options.path_work));

        if downloaded_files.len() > 0 {
            get_mediasafe_filename(&downloaded_files[0].clone(), false)
        } else {
            "Unnamed".to_string()
        }
    }
}
