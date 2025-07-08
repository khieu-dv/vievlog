use std::process;

use crate::{
    updater::check::IPCUpdateMetadata,
    utils::serial::{serialize_file_write, WriteType},
};

pub const VERSION_ID: i32 = 510;
pub const VERSION: &str = "v5.1.0";
pub const RELEASE_NOTES: &str = r#"- Added an auto-updater
- Added a navigate path button
- Added automatic binary downloading for Linux
- Added QOL link opener feature (upon double-clicking the url textbox)
- Fixed selection windows incorrectly loading selected items
- Fixed selection header texts being displayed incorrectly
- Fixed lists sorting in the wrong order
- Fixed FFmpeg libx264 issues for Linux (now using FFmpeg GPL instead of LPGL)
- Fixed an issue where subwindows would softlock when the main window exits"#;

#[allow(dead_code)]
pub fn generate_update_metadata() {
    let metadata: IPCUpdateMetadata = IPCUpdateMetadata {
        version_id: VERSION_ID,
        version: VERSION.to_string(),
        description: RELEASE_NOTES.to_string(),
    };

    serialize_file_write("meta.json", &metadata, WriteType::Pretty);

    process::exit(0);
}
