use std::{fs::File, io::BufReader};

use crate::bin::FFMPEG_PATH;
use crate::logger::logger::IPCLogger;
use crate::utils::{directory::create_directory, file::file_exists, net::download_file_async};

#[cfg(target_os = "windows")]
pub async fn bootstrap_ffmpeg(logger: &IPCLogger) {
    if file_exists(FFMPEG_PATH) {
        return;
    }

    let _ = create_directory("VieClone/bin");
    let _ = create_directory("VieClone/_temp");

    logger.log("Downloading FFmpeg...");
    let _ = download_file_async(
        "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip",
        "VieClone/_temp/ffmpeg.zip",
    ).await;
    logger.log("Downloaded FFmpeg to: \"VieClone/_temp/ffmpeg.zip\"");

    logger.log("Extracting FFmpeg...");
    let _ = extract_ffmpeg();
    logger.log(&format!("Extracted FFmpeg to \"{}\"", FFMPEG_PATH));
}

#[cfg(target_os = "windows")]
fn extract_ffmpeg() -> zip::result::ZipResult<()> {
    use std::io::{copy, BufWriter};
    use zip::ZipArchive;

    let filepath: File = File::open("VieClone/_temp/ffmpeg.zip")?;
    let mut zip: ZipArchive<BufReader<File>> = ZipArchive::new(BufReader::new(filepath))?;

    for i in 0..zip.len() {
        let mut file: zip::read::ZipFile<'_, BufReader<File>> = zip.by_index(i)?;

        let filename = match file.name().rsplit('/').next() {
            Some(value) => value,
            _ => "",
        };

        if filename == "ffmpeg.exe" {
            let mut outfile: BufWriter<File> = BufWriter::new(File::create(FFMPEG_PATH)?);
            copy(&mut file, &mut outfile)?;
        }
    }

    Ok(())
}

#[cfg(target_os = "linux")]
pub async fn bootstrap_ffmpeg(logger: &IPCLogger) {
    if file_exists(FFMPEG_PATH) {
        return;
    }

    let _ = create_directory("VieClone/bin");
    let _ = create_directory("VieClone/_temp");

    logger.log("Downloading FFmpeg...");
    let _ = download_file_async(
        "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz",
        "VieClone/_temp/ffmpeg.tar.xz",
    ).await;
    logger.log("Downloaded FFmpeg to: \"VieClone/_temp/ffmpeg.tar.xz\"");

    logger.log("Extracting FFmpeg...");
    let _ = extract_ffmpeg();
    logger.log(&format!("Extracted FFmpeg to: \"{}\"", FFMPEG_PATH));
}

#[cfg(target_os = "linux")]
fn extract_ffmpeg() -> std::io::Result<()> {
    use tar::Archive;
    use xz2::read::XzDecoder;

    use crate::utils::{file::copy_file, linux::linux_permit_file};

    let file = File::open("VieClone/_temp/ffmpeg.tar.xz")?;
    let decompressor: XzDecoder<BufReader<File>> = XzDecoder::new(BufReader::new(file));
    let mut archive: Archive<XzDecoder<BufReader<File>>> = Archive::new(decompressor);
    archive.unpack("VieClone/_temp/ffmpeg")?;

    let _ = copy_file(
        "VieClone/_temp/ffmpeg/ffmpeg-master-latest-linux64-gpl/bin/ffmpeg",
        FFMPEG_PATH,
    );

    linux_permit_file(FFMPEG_PATH, 0o111);

    Ok(())
}
