export const WorkerSignal = {
    RefreshPopup: 'REFRESH_POPUP',
    CreateModal: 'CREATE_MODAL',
    RemoveModal: 'REMOVE_MODAL',
    CheckModalStatus: 'CHECK_MODAL_STATUS',
} as const;

export const PopupSignal = {
    LaunchSession: 'LAUNCH_SESSION',
    CleanSession: 'CLEAN_SESSION',
} as const;

export const ContentScriptSignal = {
    SaveScript: 'SAVE_SCRIPT',
} as const;

export const SignalScriptSignal = {
    ModalStatus: 'MODAL_STATUS',
} as const;
