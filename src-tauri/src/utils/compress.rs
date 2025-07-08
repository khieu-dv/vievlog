use std::fs::File;
use std::io::{Read, Write};

use flate2::read::GzDecoder;
use flate2::write::GzEncoder;
use flate2::Compression;

pub fn write_file_compressed(file_path: &str, data: &str) -> std::io::Result<()> {
    let file: File = File::create(file_path)?;
    let mut encoder: GzEncoder<File> = GzEncoder::new(file, Compression::default());
    encoder.write_all(data.as_bytes())?;
    encoder.finish()?;
    Ok(())
}

pub fn read_file_compressed(file_path: &str) -> std::io::Result<String> {
    let file: File = File::open(file_path)?;
    let mut decoder: GzDecoder<File> = GzDecoder::new(file);
    let mut output: String = String::new();
    decoder.read_to_string(&mut output)?;
    Ok(output)
}
