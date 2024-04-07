export const WORKER_SIGNAL = {
    REFRESH_POPUP: 'refresh',
    SEND_CONTEXT: 'send_context',
} as const;

export const CONTENT_SCRIPT_SIGNAL = {
    COMPLETE: 'complete',
} as const;

export const POPUP_SIGNAL = {
    START: 'start',
    STOP: 'stop',
    RESTART: 'restart',
    SETTINGS_UPDATE: 'update_settings',
} as const;
