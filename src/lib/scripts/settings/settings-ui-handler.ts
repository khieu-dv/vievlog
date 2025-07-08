interface UIEnableState {
    trimEnable: boolean;

    sizeEnable: boolean;
    framerateEnable: boolean;

    vbrEnable: boolean;
    abrEnable: boolean;
}

export function initSettingsUIHandler() {
    const formatSelect = document.getElementById("settings-format-select") as HTMLSelectElement | null;
    if (!formatSelect) return;

    formatSelect.addEventListener("change", async () => {
        updateSettingsUI();
    });
}

export function updateSettingsUI() {
    const formatSelect = document.getElementById("settings-format-select") as HTMLSelectElement | null;
    if (!formatSelect) return;

    const selectedFormat = formatSelect.value;

    let uiEnableState: UIEnableState;

    switch (selectedFormat) {
        case "mp4-fast":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: false,
                framerateEnable: false,
                vbrEnable: false,
                abrEnable: false
            };
            break;
        case "mp4":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: true,
                framerateEnable: true,
                vbrEnable: true,
                abrEnable: true
            };
            break;
        case "mp4-nvidia":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: true,
                framerateEnable: true,
                vbrEnable: true,
                abrEnable: true
            };
            break;
        case "mp4-amd":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: true,
                framerateEnable: true,
                vbrEnable: true,
                abrEnable: true
            };
            break;
        case "webm":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: true,
                framerateEnable: true,
                vbrEnable: true,
                abrEnable: true
            };
            break;
        case "avi":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: true,
                framerateEnable: true,
                vbrEnable: false,
                abrEnable: false
            };
            break;

        case "mp3":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: false,
                framerateEnable: false,
                vbrEnable: false,
                abrEnable: true
            };
            break;
        case "wav":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: false,
                framerateEnable: false,
                vbrEnable: false,
                abrEnable: false
            };
            break;
        case "flac":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: false,
                framerateEnable: false,
                vbrEnable: false,
                abrEnable: false
            };
            break;
        case "ogg":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: false,
                framerateEnable: false,
                vbrEnable: false,
                abrEnable: false
            };
            break;

        case "gif":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: true,
                framerateEnable: true,
                vbrEnable: true,
                abrEnable: false
            };
            break;
        case "png-sequence":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: true,
                framerateEnable: true,
                vbrEnable: true,
                abrEnable: false
            };
            break;
        case "jpg-sequence":
            uiEnableState = {
                trimEnable: true,
                sizeEnable: true,
                framerateEnable: true,
                vbrEnable: true,
                abrEnable: false
            };
            break;

        case "png-thumbnail":
            uiEnableState = {
                trimEnable: false,
                sizeEnable: true,
                framerateEnable: false,
                vbrEnable: false,
                abrEnable: false
            };
            break;
        case "jpg-thumbnail":
            uiEnableState = {
                trimEnable: false,
                sizeEnable: true,
                framerateEnable: false,
                vbrEnable: false,
                abrEnable: false
            };
            break;

        default:
            uiEnableState = {
                trimEnable: false,
                sizeEnable: false,
                framerateEnable: false,
                vbrEnable: false,
                abrEnable: false
            };
            break;
    }

    updateUIElements(uiEnableState);
}

function updateUIElements(uiEnableState: UIEnableState) {
    handleTrim(uiEnableState);
    handleSize(uiEnableState);
    handleFramerate(uiEnableState);
    handleVbr(uiEnableState);
    handleAbr(uiEnableState);
}

function handleTrim(uiEnableState: UIEnableState) {
    const trimCheckbox = document.getElementById("settings-trim-checkbox") as HTMLInputElement | null;
    const trimStartCheckbox = document.getElementById("settings-trim-start-checkbox") as HTMLInputElement | null;
    const trimStartTextbox = document.getElementById("settings-trim-start-textbox") as HTMLInputElement | null;
    const trimEndCheckbox = document.getElementById("settings-trim-end-checkbox") as HTMLInputElement | null;
    const trimEndTextbox = document.getElementById("settings-trim-end-textbox") as HTMLInputElement | null;

    if (!trimCheckbox || !trimStartCheckbox || !trimStartTextbox || !trimEndCheckbox || !trimEndTextbox) return;

    if (uiEnableState.trimEnable) {
        trimCheckbox.disabled = false;
        trimStartCheckbox.disabled = false;
        trimStartTextbox.disabled = false;
        trimEndCheckbox.disabled = false;
        trimEndTextbox.disabled = false;
    }
    else {
        trimCheckbox.checked = false;

        trimCheckbox.disabled = true;
        trimStartCheckbox.disabled = true;
        trimStartTextbox.disabled = true;
        trimEndCheckbox.disabled = true;
        trimEndTextbox.disabled = true;
    }
}

function handleSize(uiEnableState: UIEnableState) {
    const sizeCheckbox = document.getElementById("settings-size-fps-size-checkbox") as HTMLInputElement | null;
    const sizeWidthTextbox = document.getElementById("settings-size-fps-width-textbox") as HTMLInputElement | null;
    const sizeHeightTextbox = document.getElementById("settings-size-fps-height-textbox") as HTMLInputElement | null;

    if (!sizeCheckbox || !sizeWidthTextbox || !sizeHeightTextbox) return;

    if (uiEnableState.sizeEnable) {
        sizeCheckbox.disabled = false;
        sizeWidthTextbox.disabled = false;
        sizeHeightTextbox.disabled = false;
    }
    else {
        sizeCheckbox.checked = false;

        sizeCheckbox.disabled = true;
        sizeWidthTextbox.disabled = true;
        sizeHeightTextbox.disabled = true;
    }
}

function handleFramerate(uiEnableState: UIEnableState) {
    const framerateCheckbox = document.getElementById("settings-size-fps-framerate-checkbox") as HTMLInputElement | null;
    const framerateTextbox = document.getElementById("settings-size-fps-framerate-textbox") as HTMLInputElement | null;

    if (!framerateCheckbox || !framerateTextbox) return;

    if (uiEnableState.framerateEnable) {
        framerateCheckbox.disabled = false;
        framerateTextbox.disabled = false;
    }
    else {
        framerateCheckbox.checked = false;

        framerateCheckbox.disabled = true;
        framerateTextbox.disabled = true;
    }
}

function handleVbr(uiEnableState: UIEnableState) {
    const videoBitrateCheckbox = document.getElementById("settings-bitrate-video-checkbox") as HTMLInputElement | null;
    const videoBitrateTextbox = document.getElementById("settings-bitrate-video-textbox") as HTMLInputElement | null;

    if (!videoBitrateCheckbox || !videoBitrateTextbox) return;

    if (uiEnableState.vbrEnable) {
        videoBitrateCheckbox.checked = true;

        videoBitrateCheckbox.disabled = false;
        videoBitrateTextbox.disabled = false;
    }
    else {
        videoBitrateCheckbox.checked = false;

        videoBitrateCheckbox.disabled = true;
        videoBitrateTextbox.disabled = true;
    }
}

function handleAbr(uiEnableState: UIEnableState) {
    const audioBitrateCheckbox = document.getElementById("settings-bitrate-audio-checkbox") as HTMLInputElement | null;
    const audioBitrateTextbox = document.getElementById("settings-bitrate-audio-textbox") as HTMLInputElement | null;

    if (!audioBitrateCheckbox || !audioBitrateTextbox) return;

    if (uiEnableState.abrEnable) {
        audioBitrateCheckbox.checked = true;

        audioBitrateCheckbox.disabled = false;
        audioBitrateTextbox.disabled = false;
    }
    else {
        audioBitrateCheckbox.checked = false;

        audioBitrateCheckbox.disabled = true;
        audioBitrateTextbox.disabled = true;
    }
}