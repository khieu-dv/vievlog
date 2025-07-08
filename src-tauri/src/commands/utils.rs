use crate::utils::{
    directory::{create_directory, directory_exists, get_parent_directory},
    file::{file_exists, normalize_path, read_file},
};

use rand::Rng;
use std::process::Command;
use tauri::AppHandle;

#[derive(Debug)]
struct NavigateOptions {
    path: String,
    navigate_into: bool,
}

use mac_address::get_mac_address;

#[tauri::command]
pub fn util_open_path_location(mut path: &str) {
    let download_location = match read_file("VieClone/_temp/last_output_path.txt") {
        Ok(contents) => contents,
        Err(_) => "".to_string(),
    };

    if !directory_exists("Downloads") {
        let _ = create_directory("Downloads");
    }

    if path.is_empty() {
        #[cfg(target_os = "windows")]
        {
            path = "Downloads";
        }
        #[cfg(target_os = "linux")]
        {
            path = "./Downloads";
        }
    }

    let navigate_options: NavigateOptions =
        if get_parent_directory(&download_location) == normalize_path(path) {
            if file_exists(&download_location) {
                NavigateOptions {
                    path: download_location.clone(),
                    navigate_into: false,
                }
            } else if directory_exists(&download_location) {
                NavigateOptions {
                    path: download_location.clone(),
                    navigate_into: true,
                }
            } else {
                NavigateOptions {
                    path: normalize_path(path),
                    navigate_into: true,
                }
            }
        } else {
            NavigateOptions {
                path: normalize_path(path),
                navigate_into: true,
            }
        };

    navigate_to(&navigate_options);
}

#[cfg(target_os = "windows")]
fn navigate_to(navigate_options: &NavigateOptions) {
    use crate::utils::file::normalize_path_windows;

    let path: String = normalize_path_windows(&navigate_options.path.clone());

    let _ = if navigate_options.navigate_into {
        Command::new("explorer").arg(path).status()
    } else {
        Command::new("explorer").arg("/select,").arg(path).status()
    };
}

#[cfg(target_os = "linux")]
fn navigate_to(navigate_options: &NavigateOptions) {
    use crate::utils::file::normalize_path;

    let path: String = normalize_path(&navigate_options.path.clone());

    let _ = if navigate_options.navigate_into {
        Command::new("xdg-open").arg(path).spawn()
    } else {
        Command::new("xdg-open")
            .arg(get_parent_directory(&path))
            .spawn()
    };
}

#[tauri::command]
pub fn util_launch_url(url: &str) {
    if url.is_empty() {
        return;
    }

    if webbrowser::open(url).is_ok() {}
}

#[tauri::command]
pub fn generate_app_id(app: AppHandle) -> String {
    let mut id = 0u32;
    if let Ok(Some(ma)) = get_mac_address() {
        for x in &ma.bytes()[2..] {
            id = (id << 8) | (*x as u32);
        }
        id &= 0x1FFFFFFF;
        id.to_string()
    } else {
        // fallback to a random id if MAC address is not available
        let id = rand::thread_rng().gen_range(1_000_000..9_999_999);
        format!("APP-{}", id)
    }
}
