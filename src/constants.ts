export const WorkerSignals = {
    RefreshPopup: 'REFRESH_POPUP',
    StartPageScript: 'START_PAGE_SCRIPT',
} as const;

export const ContentScriptSignals = {
    Completed: 'COMPLETED',
} as const;

export const PopupSignals = {
    Start: 'START',
    Stop: 'STOP',
    Restart: 'RESTART',
    UpdateSettings: 'UPDATE_SETTINGS',
} as const;
