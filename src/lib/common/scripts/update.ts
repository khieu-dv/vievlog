export interface IPCUpdateMetadata {
    version_id:  number,
    version:     string,
    description: string,
}

export interface IPCUpdateStatus {
    has_update:    boolean,
    metadata:      IPCUpdateMetadata,
}