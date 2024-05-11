import {
    ContentScriptMessage,
    Message,
    PopupMessage,
    ResponseMessage,
    SignalScriptMessage,
    WorkerMessage,
} from '../interfaces';
import { ModalManager } from './ModalManager';

const handlePopupMessage = (
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
            return false;
        case 'ContentScript':
            handleContentScriptMessage(message, sendResponse);
            // Response is sent asynchronously
            return true;
        case 'SignalScript':
            handleSignalScriptMessage(message);
            return false;
    }
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

    const message: WorkerMessage = {
        source: 'Worker',
        signal: 'CHECK_MODAL_STATUS',
    };
    chrome.tabs.sendMessage(activeInfo.tabId, message, () => {
        if (chrome.runtime.lastError) {
            // Stifle error
            return;
        }
    });
};

chrome.runtime.onMessage.addListener(messageRouter);
chrome.tabs.onActivated.addListener(handleTabChange);
