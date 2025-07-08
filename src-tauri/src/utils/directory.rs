use std::fs;
use std::io;
use std::path::Path;

use crate::utils::file::normalize_path;

pub fn create_directory(path: &str) -> io::Result<()> {
    println!("Creating directory: {}", path);
    fs::create_dir_all(path)
}

pub fn remove_directory(path: &str) -> io::Result<()> {
    println!("Removing directory: {}", path);
    fs::remove_dir_all(path)
}

pub fn directory_exists(path_str: &str) -> bool {
    let path = Path::new(path_str);
    path.exists() && path.is_dir()
}

pub fn get_directories(path: &str) -> Vec<String> {
    let mut folders: Vec<String> = Vec::new();

    match fs::read_dir(path) {
        Ok(entries) => {
            for entry in entries {
                match entry {
                    Ok(entry) => {
                        if entry.path().is_dir() {
                            folders.push(entry.path().to_string_lossy().to_string())
                        }
                    }
                    Err(err) => eprintln!("Error: {}", err),
                }
            }
        }
        Err(err) => eprintln!("Error: {}", err),
    }

    folders
}

pub fn get_directory_name(path: &str) -> String {
    let pathn: String = normalize_path(path);

    let directory_name = match pathn.rsplit('/').next() {
        Some(value) => value,
        _ => "",
    };

    directory_name.to_string()
}

pub fn get_parent_directory(path_str: &str) -> String {
    let path: &Path = Path::new(path_str);

    if let Some(directory) = path.parent() {
        normalize_path(&directory.display().to_string())
    } else {
        "".to_string()
    }
}
