import { LocalStorageWrapper } from '../LocalStorageWrapper';
import type { Script, WorkerMessage } from '../interfaces';
import { IValidatedTab } from './interfaces';

class ModalManagerClass {
    private static instance: ModalManagerClass;

    public static getInstance(): ModalManagerClass {
        if (!ModalManagerClass.instance) {
            ModalManagerClass.instance = new ModalManagerClass();
        }
        return ModalManagerClass.instance;
    }

    public createModal = (scriptName?: string) => {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            async (tabs) => {
                const currentTab = tabs[0];
                if (this.isValidTab(currentTab)) {
                    const scripts = await LocalStorageWrapper.get(
                        'userScripts',
                        {}
                    );
                    chrome.scripting.executeScript(
                        {
                            target: { tabId: currentTab.id },
                            files: ['content/contentScript.js'],
                        },
                        () => {
                            const message: WorkerMessage = {
                                source: 'Worker',
                                signal: 'CREATE_MODAL',
                                playOnLaunch: false,
                                script: scriptName
                                    ? scripts[scriptName]
                                    : undefined,
                            };
                            chrome.tabs.sendMessage(currentTab.id, message);
                        }
                    );
                }
            }
        );
    };

    public removeModal = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const currentTab = tabs[0];
            if (this.isValidTab(currentTab)) {
                const message: WorkerMessage = {
                    source: 'Worker',
                    signal: 'REMOVE_MODAL',
                };
                chrome.tabs.sendMessage(currentTab.id, message);
            }
        });
    };

    public saveModalData = async (script: Script, prevName?: string) => {
        const scripts = await LocalStorageWrapper.get('userScripts', {});

        if (
            (prevName === undefined || prevName !== script.name) &&
            script.name in scripts
        ) {
            return false;
        }

        scripts[script.name] = script;

        // If the name changed, remove the old entry
        if (prevName && prevName !== script.name) {
            delete scripts[prevName];
        }

        await LocalStorageWrapper.set('userScripts', scripts);
        return true;
    };

    public updateModalStatus = (isModalOpen: boolean) => {
        LocalStorageWrapper.set('isModalOpen', isModalOpen);
    };

    private isValidTab(tab: chrome.tabs.Tab): tab is IValidatedTab {
        return typeof tab.url === 'string' && typeof tab.id === 'number';
    }
}

export const ModalManager = ModalManagerClass.getInstance();
