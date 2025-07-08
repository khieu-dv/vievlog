use serde::{de::DeserializeOwned, Serialize};

use crate::utils::{
    compress::{read_file_compressed, write_file_compressed},
    file::{read_file, write_file},
};

#[derive(PartialEq)]
pub enum WriteType {
    Pretty,
    Squash,
    Compress,
}

pub fn serialize<T>(data: &T, pretty: bool) -> String
where
    T: Serialize,
{
    let serde_result: Result<String, serde_json::Error> = if pretty {
        serde_json::to_string_pretty(data)
    } else {
        serde_json::to_string(data)
    };

    match serde_result {
        Ok(ipc_config_string) => ipc_config_string,
        Err(e) => {
            eprintln!("Failed to serialize: {}", e);
            String::new()
        }
    }
}

pub fn deserialize<T>(input: &str) -> T
where
    T: DeserializeOwned + Default,
{
    match serde_json::from_str(input) {
        Ok(data) => data,
        Err(e) => {
            eprintln!("Failed to deserialize: {}", e);
            T::default()
        }
    }
}

pub fn deserialize_file_read<T>(file_path: &str, is_file_compressed: bool) -> T
where
    T: DeserializeOwned + Default,
{
    match if is_file_compressed {
        read_file_compressed(file_path)
    } else {
        read_file(file_path)
    } {
        Ok(serialized_data) => deserialize(&serialized_data),
        Err(_) => T::default(),
    }
}

pub fn serialize_file_write<T>(file_path: &str, data: &T, write_type: WriteType)
where
    T: Serialize,
{
    let pretty: bool = match write_type {
        WriteType::Pretty => true,
        _ => false,
    };

    let serialized_data: String = serialize(&data, pretty);
    if write_type == WriteType::Compress {
        let _ = write_file_compressed(file_path, &serialized_data);
    } else {
        let _ = write_file(file_path, &serialized_data);
    }
}
