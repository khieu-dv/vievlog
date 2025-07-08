export interface IPCUserConfig {
    valid:                       boolean;

    ui_queue_enable:             boolean;

    update_notifications_enable: boolean;
}

export function createIPCUserConfig(): IPCUserConfig {
    return {
        valid:                       true,

        ui_queue_enable:             false,

        update_notifications_enable: true
    };
}