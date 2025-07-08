#[cfg(target_os = "linux")]
pub fn linux_permit_file(file_path: &str, value: u32) {
    use std::{
        fs::{self, Permissions},
        io,
        os::unix::fs::PermissionsExt,
    };

    let metadata_result: Result<fs::Metadata, io::Error> = fs::metadata(file_path);

    let mut permissions: Permissions = match metadata_result {
        Ok(metadata) => metadata.permissions(),
        Err(e) => {
            eprintln!("Failed to get metadata: {}", e);
            return;
        }
    };

    let current_mode: u32 = permissions.mode();
    permissions.set_mode(current_mode | value);

    if let Err(e) = fs::set_permissions(file_path, permissions) {
        eprintln!("Failed to set permissions: {}", e);
    } else {
        println!("\"{}\" has been permitted with: {}", file_path, value);
    }
}
