use std::env;

use crate::arguments::handle_arguments;

mod arguments;
mod bin;
mod bootstrap;
mod commands;
mod config;
mod logger;
mod media;
mod processor;
mod updater;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    handle_arguments();

    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::download::download,
            commands::data::data_write_user_config,
            commands::data::data_write_download_config,
            commands::data::data_write_queue,
            commands::data::data_write_history,
            commands::data::data_read_user_config,
            commands::data::data_read_download_config,
            commands::data::data_read_queue,
            commands::data::data_read_history,
            commands::utils::util_open_path_location,
            commands::utils::util_launch_url,
            commands::bootstrap::bootstrap_check,
            commands::bootstrap::bootstrap_install,
            commands::update::update_start,
            commands::update::update_check,
            commands::utils::generate_app_id,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
