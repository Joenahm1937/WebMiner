declare global {
    interface Window {
        myModalElement?: HTMLElement;
    }
}

export interface ScriptStep {
    element: string;
    command: string;
}
