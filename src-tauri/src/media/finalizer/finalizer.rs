use crate::{
    config::download_config::IPCDownloadConfig,
    utils::{
        directory::{create_directory, directory_exists, get_directories, get_directory_name},
        file::{copy_file, file_exists, get_extension, get_filename, get_files},
    },
};

pub struct Finalizer {
    pub cfg: IPCDownloadConfig,
    pub last_output_path: String,
}

impl Finalizer {
    pub fn new(config: &IPCDownloadConfig) -> Self {
        Self {
            cfg: config.clone(),
            last_output_path: String::new(),
        }
    }

    pub fn finalize(&mut self, finalize_name: &str) -> &Self {
        let mut output_path: String = self.cfg.output.path.to_string();

        if output_path.trim().is_empty() {
            #[cfg(target_os = "windows")]
            {
                if let Some(download_dir) = dirs::download_dir() {
                    output_path = download_dir.to_string_lossy().to_string();
                } else {
                    output_path = "Downloads".to_string(); // fallback
                }
            }

            #[cfg(not(target_os = "windows"))]
            {
                output_path = "Downloads".to_string(); // fallback cho hệ khác
            }

            let _ = create_directory(&output_path);
        }

        if self.cfg.input.is_playlist {
            output_path.push_str(&format!("/{}", finalize_name));
            let _ = create_directory(&output_path);
        }

        let latest_file_copy: String = self.handle_root_files(&output_path, finalize_name);
        let latest_folder_copy: String = self.handle_root_directories(&output_path);

        self.last_output_path = if !latest_file_copy.is_empty() {
            latest_file_copy.clone()
        } else if !latest_folder_copy.is_empty() {
            latest_folder_copy.clone()
        } else {
            output_path
        };

        self
    }

    fn handle_root_files(&self, output_path: &str, finalize_name: &str) -> String {
        let mut latest_file_copy: String = String::new();

        for file in get_files("VieClone/_temp/convert") {
            let file_name: String = if self.cfg.input.is_playlist {
                get_filename(&file, false)
            } else {
                finalize_name.to_string()
            };

            let extension: String = match get_extension(&file) {
                Some(extension) => extension,
                None => "".to_string(),
            };

            let mut file_dest_path: String = format!("{}/{}.{}", output_path, file_name, extension);

            let mut counter: i32 = 0;
            while file_exists(&file_dest_path) {
                counter += 1;
                file_dest_path = format!("{}/{}_{}.{}", output_path, file_name, counter, extension);
            }

            let _ = copy_file(&file, &file_dest_path);
            latest_file_copy = file_dest_path;
        }

        latest_file_copy
    }

    fn handle_root_directories(&self, output_path: &str) -> String {
        let mut latest_folder_copy: String = String::new();

        for folder in get_directories("VieClone/_temp/convert") {
            let folder_name = get_directory_name(&folder);

            let mut folder_dest_path: String = format!("{}/{}", output_path, folder_name);

            let mut counter: i32 = 0;
            while directory_exists(&folder_dest_path) {
                counter += 1;
                folder_dest_path = format!("{}/{}_{}", output_path, folder_name, counter);
            }

            latest_folder_copy = folder_dest_path.clone();

            let _ = create_directory(&folder_dest_path);
            for file in get_files(&folder) {
                let file_dest_path: String =
                    format!("{}/{}", folder_dest_path, get_filename(&file, true));
                let _ = copy_file(&file, &file_dest_path);
            }
        }

        latest_folder_copy
    }

    pub fn get_last_output_path(&self) -> String {
        self.last_output_path.clone()
    }
}
