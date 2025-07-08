use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Default)]
pub struct IPCUserConfig {
    pub valid: bool,

    pub ui_queue_enable: bool,

    pub update_notifications_enable: bool,
}
