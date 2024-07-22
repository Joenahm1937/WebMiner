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
    playOnLaunch: boolean; // should play when launched if script is injected/opened in a tab by user command
    closeOnDone: boolean; // should signal to SW when done executing script to close itself
    scriptName?: string;
}
