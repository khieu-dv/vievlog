use std::{thread, time::Duration};

use sysinfo::{Pid, ProcessesToUpdate, System};

pub fn wait_for_process(pid: u32) {
    let mut sys: System = System::new();

    let pid: Pid = Pid::from_u32(pid);

    loop {
        sys.refresh_processes(ProcessesToUpdate::Some(&[pid]), true);
        let still_running: bool = sys.process(pid).is_some();

        if !still_running {
            println!("Process \"{}\" has exited.", pid.as_u32());
            break;
        }

        println!("Waiting for \"{}\" to exit...", pid.as_u32());
        thread::sleep(Duration::from_secs(1));
    }
}
