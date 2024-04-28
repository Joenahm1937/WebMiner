export const WorkerSignals = {
    RefreshPopup: 'REFRESH_POPUP',
    StartPageScript: 'START_PAGE_SCRIPT',
    StopPageScript: 'STOP_PAGE_SCRIPT',
} as const;

export const ContentScriptSignals = {
    Completed: 'COMPLETED',
} as const;

export const PopupSignals = {
    Creating: 'CREATE',
    Completing: 'COMPLETE',
    Restart: 'RESTART',
    UpdateSettings: 'UPDATE_SETTINGS',
} as const;
