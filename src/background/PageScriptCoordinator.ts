import type { Settings, WorkerScriptContextMessage } from '../interfaces';
import { NO_TAB_PERMISSION_ERROR } from './constants';
import { IValidatedTab } from './interfaces';

class PageScriptCoordinatorClass {
    private static instance: PageScriptCoordinatorClass;
    private settings: Settings = {
        devMode: false,
    };

    public static getInstance(): PageScriptCoordinatorClass {
        if (!PageScriptCoordinatorClass.instance) {
            PageScriptCoordinatorClass.instance =
                new PageScriptCoordinatorClass();
        }
        return PageScriptCoordinatorClass.instance;
    }

    public updateSettings(newSettings: Partial<Settings>): void {
        this.settings = {
            ...this.settings,
            ...newSettings,
        };
    }

    public startProcessing = (callback: Function) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            try {
                if (this.isValidTab(currentTab)) {
                    chrome.scripting.executeScript(
                        {
                            target: { tabId: currentTab.id },
                            files: ['contentScript.js'],
                        },
                        () => {
                            const message: WorkerScriptContextMessage = {
                                source: 'Worker',
                                signal: 'START_PAGE_SCRIPT',
                                settings: {
                                    ...this.settings,
                                },
                            };
                            chrome.tabs.sendMessage(currentTab.id, message);
                        }
                    );
                }
            } catch (error) {
                callback(error as Error);
            }
        });
    };

    private isValidTab(tab: chrome.tabs.Tab): tab is IValidatedTab {
        if (!tab.url) {
            throw new Error(NO_TAB_PERMISSION_ERROR);
        }
        if (!(typeof tab.id === 'number')) {
            throw new Error(NO_TAB_PERMISSION_ERROR);
        }
        return true;
    }
}

export const PageScriptCoordinator = PageScriptCoordinatorClass.getInstance();
