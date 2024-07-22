export interface IValidatedTab extends chrome.tabs.Tab {
    id: number;
    url: string;
}

export interface TabContext {
    maxTabs: number;
    closeOnDone: boolean;
    scriptName?: string;
}

export interface ScriptContext {
    closeOnDone: boolean;
    scriptName?: string;
}
