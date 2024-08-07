import { LocalStorageWrapper } from '../LocalStorageWrapper';
import {
    ContentScriptMessage,
    Message,
    PopupMessage,
    ResponseMessage,
    SignalScriptMessage,
    WorkerMessage,
} from '../interfaces';
import { ModalManager } from './ModalManager';
import { TabManager } from './TabManager';

const handlePopupMessage = async (
    message: PopupMessage,
    sendResponse: (response: ResponseMessage) => void
) => {
    switch (message.signal) {
        case 'LAUNCH_SESSION':
            ModalManager.createModal(message.scriptName);
            sendResponse({ success: true });
            break;
        case 'CLEAN_SESSION':
            ModalManager.removeModal();
            sendResponse({ success: true });
            break;
        case 'OPEN_SESSION_IN_TAB':
            const scripts = await LocalStorageWrapper.get('userScripts', {});
            TabManager.flushQueue();
            TabManager.enqueue([message.linkUrl]);
            TabManager.openLinks(
                { closeOnDone: false, playOnLaunch: false },
                scripts[message.scriptName]
            );
            sendResponse({ success: true });
            break;
    }
};

const handleContentScriptMessage = async (
    message: ContentScriptMessage,
    sendResponse: (response: ResponseMessage) => void
) => {
    switch (message.signal) {
        case 'SAVE_SCRIPT':
            const saved = await ModalManager.saveModalData(
                message.script,
                message.originalName
            );
            if (saved) {
                sendResponse({
                    success: true,
                    message: 'Script saved successfully',
                });
            } else {
                sendResponse({
                    success: false,
                    message: 'Script already exists',
                });
            }
            break;
        case 'GET_SCRIPT_NAMES':
            const userScripts = await LocalStorageWrapper.get(
                'userScripts',
                {}
            );
            sendResponse({
                success: true,
                message: JSON.stringify(Object.keys(userScripts)),
            });
            break;
        case 'OPEN_LINKS_IN_TAB':
            const scripts = await LocalStorageWrapper.get('userScripts', {});
            TabManager.enqueue(message.linkUrls);
            TabManager.openLinks(
                { closeOnDone: false, playOnLaunch: false },
                message.scriptName ? scripts[message.scriptName] : undefined
            );
            break;
    }
};

const handleSignalScriptMessage = (message: SignalScriptMessage) => {
    switch (message.signal) {
        case 'MODAL_STATUS':
            ModalManager.updateModalStatus(message.isOpen);
    }
};

const messageRouter = (
    message: Message,
    _: chrome.runtime.MessageSender,
    sendResponse: (response: ResponseMessage) => void
) => {
    switch (message.source) {
        case 'Popup':
            handlePopupMessage(message, sendResponse);
            return true;
        case 'ContentScript':
            handleContentScriptMessage(message, sendResponse);
            // Response is sent asynchronously
            return true;
        case 'SignalScript':
            handleSignalScriptMessage(message);
            return false;
    }
};

export const sendStatusPing = (tabId: number) => {
    const message: WorkerMessage = {
        source: 'Worker',
        signal: 'CHECK_MODAL_STATUS',
    };

    chrome.tabs.sendMessage(tabId, message, () => {
        if (chrome.runtime.lastError) {
            // Stifle error
            return;
        }
    });
};

const handleTabChange = (activeInfo: chrome.tabs.TabActiveInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        // Disable the extension if the URL is not valid
        if (!tab || !tab.url || !tab.url.startsWith('http')) {
            chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 128] }); // Red badge color
            chrome.action.disable(activeInfo.tabId);
            return;
        }
    });

    sendStatusPing(activeInfo.tabId);
};

chrome.runtime.onMessage.addListener(messageRouter);
chrome.tabs.onActivated.addListener(handleTabChange);
