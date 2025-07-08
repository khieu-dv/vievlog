use std::process::{self, Command};

use crate::utils::process::wait_for_process;
use crate::utils::{
    file::{copy_file, delete_file},
    net::download_file_sync,
};

pub struct Updater {}

impl Updater {
    pub fn new() -> Self {
        Self {}
    }

    #[cfg(target_os = "windows")]
    pub fn update(&self) {
        // create updater
        if !copy_file("VieClone.exe", "VieClone_temp.exe").is_ok() {
            return;
        }

        let _ = Command::new("VieClone_temp.exe")
            .arg("--update-stage-download")
            .arg(&std::process::id().to_string())
            .spawn();

        process::exit(0);
    }

    #[cfg(target_os = "linux")]
    pub fn update(&self) {
        // create updater
        if !copy_file("VieClone_linux", "VieClone_linux_temp").is_ok() {
            return;
        }

        use crate::utils::linux::linux_permit_file;
        linux_permit_file("VieClone_linux_temp", 0o111);

        let _ = Command::new("./VieClone_linux_temp")
            .arg("--update-stage-download")
            .arg(&std::process::id().to_string())
            .spawn();

        process::exit(0);
    }

    #[cfg(target_os = "windows")]
    pub fn stage_download(&self, process_pid: u32) {
        wait_for_process(process_pid);

        match delete_file("VieClone.exe") {
            Err(_) => return,
            _ => {}
        }

        let _ = download_file_sync(
            "https://github.com/khieu-dv/VieClone/releases/latest/download/VieClone.exe",
            "VieClone.exe",
        );
        let _ = Command::new("VieClone.exe")
            .arg("--update-stage-finalize")
            .arg(&std::process::id().to_string())
            .spawn();

        process::exit(0);
    }

    #[cfg(target_os = "linux")]
    pub fn stage_download(&self, process_pid: u32) {
        wait_for_process(process_pid);

        match delete_file("VieClone_linux") {
            Err(_) => return,
            _ => {}
        }

        let _ = download_file_sync(
            "https://github.com/khieu-dv/VieClone/releases/latest/download/VieClone_linux",
            "VieClone_linux",
        );

        use crate::utils::linux::linux_permit_file;
        linux_permit_file("VieClone_linux", 0o111);

        let _ = Command::new("./VieClone_linux")
            .arg("--update-stage-finalize")
            .arg(&std::process::id().to_string())
            .spawn();

        process::exit(0);
    }

    #[cfg(target_os = "windows")]
    pub fn stage_finalize(&self, updater_pid: u32) {
        wait_for_process(updater_pid);
        let _ = delete_file("VieClone_temp.exe");
    }

    #[cfg(target_os = "linux")]
    pub fn stage_finalize(&self, updater_pid: u32) {
        wait_for_process(updater_pid);
        let _ = delete_file("VieClone_linux_temp");
    }
}
