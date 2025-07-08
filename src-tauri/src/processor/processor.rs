use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use std::thread;

use crate::logger::logger::IPCLogger;

#[cfg(windows)]
use std::os::windows::process::CommandExt;

pub struct Processor {
    pub logger: IPCLogger,
    pub path: String,
    pub args: Vec<String>,
}

impl Processor {
    pub fn new(ipc_logger: &IPCLogger, process_path: &str, arguments: &Vec<String>) -> Self {
        Self {
            logger: ipc_logger.clone(),
            path: process_path.to_string(),
            args: arguments.clone(),
        }
    }

    pub fn start(&self) -> std::io::Result<()> {
        self.begin(&self.logger, &self.path, &self.args)
    }

    fn begin(&self, logger: &IPCLogger, path: &str, args: &Vec<String>) -> std::io::Result<()> {
        logger.log(&format!("Starting process: \"{}\" with arguments:", path));
        for arg in args {
            logger.log(&arg);
        }

        let mut command: Command = Command::new(path);

        command
            .args(args)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        // prevent console window on windows
        #[cfg(target_os = "windows")]
        {
            command.creation_flags(0x08000000);
        }

        let mut child: std::process::Child = command.spawn()?;

        // clone stdout and stderr handles
        let stdout: std::process::ChildStdout =
            child.stdout.take().expect("Failed to capture stdout");
        let stderr: std::process::ChildStderr =
            child.stderr.take().expect("Failed to capture stderr");

        let stdout_logger: IPCLogger = logger.clone();
        let stderr_logger: IPCLogger = logger.clone();

        // thread: handle stdout
        let stdout_thread: thread::JoinHandle<()> = thread::spawn(move || {
            let reader: BufReader<std::process::ChildStdout> = BufReader::new(stdout);
            for line in reader.lines() {
                match line {
                    Ok(line) => stdout_logger.log(&line), //println!("{}", line),
                    Err(e) => eprintln!("Error reading stdout: {}", e),
                }
            }
        });

        // thread: handle stderr
        let stderr_thread: thread::JoinHandle<()> = thread::spawn(move || {
            let reader: BufReader<std::process::ChildStderr> = BufReader::new(stderr);
            for line in reader.lines() {
                match line {
                    Ok(line) => stderr_logger.log(&line), //eprintln!("{}", line),
                    Err(e) => eprintln!("Error reading stderr: {}", e),
                }
            }
        });

        // wait for child and output threads
        let status: std::process::ExitStatus = child.wait()?;
        stdout_thread.join().expect("Failed to join stdout thread");
        stderr_thread.join().expect("Failed to join stderr thread");

        println!("Process exited with: {}", status);

        Ok(())
    }
}
