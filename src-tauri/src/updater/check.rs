use serde::{Deserialize, Serialize};

use crate::{
    updater::meta::VERSION_ID,
    utils::{net::download_text_async, serial::deserialize},
};

#[derive(Serialize, Deserialize, Default)]
pub struct IPCUpdateMetadata {
    pub version_id: i32,
    pub version: String,
    pub description: String,
}

#[derive(Serialize, Default)]
pub struct IPCUpdateStatus {
    pub has_update: bool,
    pub metadata: IPCUpdateMetadata,
}

pub async fn check_for_updates() -> IPCUpdateStatus {
    let result: Result<String, reqwest::Error> =
        download_text_async("https://github.com/khieu-dv/VieClone/releases/latest/download/meta.json")
            .await;

    match result {
        Ok(text) => {
            let metadata: IPCUpdateMetadata = deserialize(&text);

            IPCUpdateStatus {
                has_update: metadata.version_id > VERSION_ID,
                metadata: metadata,
            }
        }
        Err(_) => IPCUpdateStatus::default(),
    }
}
