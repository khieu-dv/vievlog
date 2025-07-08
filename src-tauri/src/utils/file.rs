use std::fs;
use std::io;
use std::path::Path;

pub fn write_file(path: &str, content: &str) -> io::Result<()> {
    println!("Writing file: \"{}\"", path);
    fs::write(path, content)
}

pub fn copy_file(path_from: &str, path_to: &str) -> io::Result<u64> {
    println!("Copying file from: \"{}\", to: \"{}\"", path_from, path_to);
    fs::copy(path_from, path_to)
}

pub fn read_file(path: &str) -> io::Result<String> {
    fs::read_to_string(path)
}

pub fn delete_file(path: &str) -> io::Result<()> {
    fs::remove_file(path)
}

pub fn file_exists(path_str: &str) -> bool {
    let path = Path::new(path_str);
    path.exists() && path.is_file()
}

pub fn get_files(path: &str) -> Vec<String> {
    let mut files: Vec<String> = Vec::new();

    match fs::read_dir(path) {
        Ok(entries) => {
            for entry in entries {
                match entry {
                    Ok(entry) => {
                        if entry.path().is_file() {
                            files.push(entry.path().to_string_lossy().to_string())
                        }
                    }
                    Err(err) => eprintln!("Error: {}", err),
                }
            }
        }
        Err(err) => eprintln!("Error: {}", err),
    }

    files
}

pub fn get_filename(path: &str, extension: bool) -> String {
    let path: &Path = Path::new(path);

    let filename: Option<&std::ffi::OsStr> = if extension {
        path.file_name()
    } else {
        path.file_stem()
    };

    if let Some(filename) = filename {
        filename.to_string_lossy().to_string()
    } else {
        String::new()
    }
}

pub fn get_extension(path: &str) -> Option<String> {
    Path::new(path)
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|s| s.to_string())
}

pub fn get_mediasafe_filename(path: &str, extension: bool) -> String {
    if extension {
        get_filename(path, true)
    } else {
        let known_extensions: [&'static str; 24] = [
            "avi", "flv", "mkv", "mov", "mp4", "webm", "wmv", "aac", "flac", "m4a", "mp3", "ogg",
            "opus", "raw", "wav", "wma", "avif", "bmp", "heif", "jpeg", "jpg", "png", "tiff",
            "webp",
        ];

        let mut filename_str: String = get_filename(path, true);

        for ext in known_extensions {
            let extd: String = format!(".{}", ext);
            if filename_str.ends_with(&extd) {
                if let Some(stripped) = filename_str.strip_suffix(&extd) {
                    filename_str = stripped.to_string();
                }
                break;
            }
        }

        filename_str
    }
}

pub fn normalize_path(s: &str) -> String {
    s.replace("\\", "/")
}

#[cfg(target_os = "windows")]
pub fn normalize_path_windows(s: &str) -> String {
    s.replace("/", "\\")
}
