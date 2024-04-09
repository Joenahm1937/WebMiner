export interface IValidatedTab extends chrome.tabs.Tab {
    id: number;
    url: string;
}
