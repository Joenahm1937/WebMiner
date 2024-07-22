/**
 * Extension Message Signals
 */

export const WorkerSignal = {
    RefreshPopup: 'REFRESH_POPUP',
    CreateModal: 'CREATE_MODAL',
    RemoveModal: 'REMOVE_MODAL',
    CheckModalStatus: 'CHECK_MODAL_STATUS',
} as const;

export const PopupSignal = {
    LaunchSession: 'LAUNCH_SESSION',
    CleanSession: 'CLEAN_SESSION',
    OpenSessionInTab: 'OPEN_SESSION_IN_TAB',
} as const;

export const ContentScriptSignal = {
    SaveScript: 'SAVE_SCRIPT',
    GetScriptNames: 'GET_SCRIPT_NAMES',
    OpenLinksInTab: 'OPEN_LINKS_IN_TAB',
} as const;

export const SignalScriptSignal = {
    ModalStatus: 'MODAL_STATUS',
} as const;

/**
 * Script Command Types
 */

export const Commands = {
    INPUT_TEXT: 'Input Text',
    CLICK: 'Click',
    OPEN_LINK: 'Open Link',
} as const;
