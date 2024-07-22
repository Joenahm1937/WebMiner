import { Script, WorkerMessage } from '../interfaces';
import { IValidatedTab, TabContext } from './interfaces';

/**
 * Manages and controls the opening and processing of tabs.
 */
class TabManagerClass {
    private static instance: TabManagerClass;
    private openTabsCount: number = 0;
    private queue: string[] = [];
    private enabled: boolean = false;
    private tabContext: TabContext = {
        maxTabs: 5,
        closeOnDone: false,
    };

    public static getInstance(): TabManagerClass {
        if (!TabManagerClass.instance) {
            TabManagerClass.instance = new TabManagerClass();
        }
        return TabManagerClass.instance;
    }

    public updateTabContext(newContext: Partial<TabContext>): void {
        this.tabContext = {
            ...this.tabContext,
            ...newContext,
        };
    }

    public disableTabs = (): void => {
        this.enabled = false;
    };

    public closeTab = (tab: chrome.tabs.Tab) => {
        chrome.tabs.remove(tab.id as number, () => {
            if (this.openTabsCount > 0) this.openTabsCount--;

            if (
                this.enabled &&
                this.openTabsCount < this.tabContext.maxTabs &&
                this.queue.length > 0
            ) {
                this.openLinks();
            }
        });
    };

    public flushQueue = () => {
        this.queue = [];
    };

    /**
     * Enqueues a URL to the processing queue.
     * @param {string | string[]} url - The URL or URLs to add to the queue.
     */
    public enqueue(urls: string[]): void {
        this.queue.push(...urls);
    }

    /**
     * Processes the next URLs in the queue by opening new tabs if capacity allows.
     */
    public openLinks(script?: Script): void {
        const linksToProcess = this.dequeueAvailable();
        linksToProcess.forEach((link) => {
            if (this.tabContext.closeOnDone) this.openTabsCount++;
            chrome.tabs.create({ url: link, active: true }, (tab) => {
                if (this.isValidTab(tab)) {
                    // Check every 1 second if the tab is ready
                    const checkTabReady = setInterval(() => {
                        chrome.tabs.get(tab.id, (updatedTab) => {
                            if (updatedTab.status === 'complete') {
                                clearInterval(checkTabReady);
                                chrome.scripting.executeScript(
                                    {
                                        target: { tabId: tab.id },
                                        files: ['content/contentScript.js'],
                                    },
                                    () => {
                                        const message: WorkerMessage = {
                                            source: 'Worker',
                                            signal: 'CREATE_MODAL',
                                            playOnLaunch: true,
                                            script,
                                            // TODO: playAllSteps in content script should send message back if playOnLaunch is true to tell SW to close Tab
                                            // and if settings is set to closeOnDone
                                        };
                                        chrome.tabs.sendMessage(
                                            tab.id,
                                            message
                                        );
                                    }
                                );
                            }
                        });
                    }, 1000);
                }
            });
        });
    }

    /**
     * Dequeues URLs from the processing queue based on the available capacity.
     * @returns {string[]} An array of URLs to process next.
     */
    private dequeueAvailable(): string[] {
        const availableTabs = this.tabContext.maxTabs - this.openTabsCount;
        return this.queue.splice(0, availableTabs);
    }

    private isValidTab(tab: chrome.tabs.Tab): tab is IValidatedTab {
        return typeof tab.url === 'string' && typeof tab.id === 'number';
    }
}

export const TabManager = TabManagerClass.getInstance();
