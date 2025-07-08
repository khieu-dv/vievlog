use std::error::Error as StdError;
use std::fs::File as StdFile;
use std::io::{copy, BufWriter};

use futures_util::StreamExt;
use reqwest::blocking::get;
use reqwest::Error as ReqwestError;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;

pub fn download_file_sync(url: &str, path: &str) -> Result<(), Box<dyn StdError>> {
    println!("Downloading: \"{}\"", url);

    let mut response: reqwest::blocking::Response = get(url)?;

    let file = StdFile::create(path)?;
    let mut writer: BufWriter<StdFile> = BufWriter::new(file);

    copy(&mut response, &mut writer)?;

    Ok(())
}

pub async fn download_file_async(url: &str, path: &str) -> Result<(), Box<dyn StdError>> {
    let mut file: File = File::create(path).await?;
    println!("Downloading: \"{}\"", url);

    let response: reqwest::Response = reqwest::get(url).await?;
    let mut stream = response.bytes_stream();

    while let Some(chunk_result) = stream.next().await {
        let chunk = chunk_result?;
        file.write_all(&chunk).await?;
    }

    file.flush().await?;

    Ok(())
}

pub async fn download_text_async(url: &str) -> Result<String, ReqwestError> {
    let response: reqwest::Response = reqwest::get(url).await?;
    let body: String = response.text().await?;
    Ok(body)
}
