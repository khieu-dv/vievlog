use serde::Serialize;
use tauri::{AppHandle, Emitter};

#[derive(Clone)]
pub struct IPCLogger {
    pub app_handle: AppHandle,
}

#[derive(Serialize, Clone)]
struct IPCLoggerEvent {
    pub text: String,
}

impl IPCLogger {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            app_handle: app_handle,
        }
    }

    pub fn log(&self, text: &str) {
        let _ = self.app_handle.emit(
            "log",
            IPCLoggerEvent {
                text: text.to_string(),
            },
        );
    }
}
