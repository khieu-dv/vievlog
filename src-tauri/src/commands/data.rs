use crate::{
    config::{download_config::IPCDownloadConfig, user_config::IPCUserConfig},
    utils::{
        directory::{create_directory, directory_exists},
        serial::{deserialize_file_read, serialize_file_write, WriteType},
    },
};

#[tauri::command]
pub fn data_write_user_config(config: IPCUserConfig) {
    if !directory_exists("VieClone/config") {
        let _ = create_directory("VieClone/config");
    }
    serialize_file_write(
        "VieClone/config/user_config.json",
        &config,
        WriteType::Pretty,
    );
}

#[tauri::command]
pub fn data_write_download_config(config: IPCDownloadConfig) {
    if !directory_exists("VieClone/config") {
        let _ = create_directory("VieClone/config");
    }
    serialize_file_write(
        "VieClone/config/download_config.json",
        &config,
        WriteType::Pretty,
    );
}

#[tauri::command]
pub fn data_write_queue(queue: Vec<IPCDownloadConfig>) {
    if !directory_exists("VieClone/config") {
        let _ = create_directory("VieClone/config");
    }
    serialize_file_write("VieClone/config/queue.dat", &queue, WriteType::Compress);
}

#[tauri::command]
pub fn data_write_history(history: Vec<IPCDownloadConfig>) {
    if !directory_exists("VieClone/config") {
        let _ = create_directory("VieClone/config");
    }
    serialize_file_write("VieClone/config/history.dat", &history, WriteType::Compress);
}

#[tauri::command]
pub fn data_read_user_config() -> IPCUserConfig {
    deserialize_file_read("VieClone/config/user_config.json", false)
}

#[tauri::command]
pub fn data_read_download_config() -> IPCDownloadConfig {
    deserialize_file_read("VieClone/config/download_config.json", false)
}

#[tauri::command]
pub fn data_read_queue() -> Vec<IPCDownloadConfig> {
    deserialize_file_read("VieClone/config/queue.dat", true)
}

#[tauri::command]
pub fn data_read_history() -> Vec<IPCDownloadConfig> {
    deserialize_file_read("VieClone/config/history.dat", true)
}
