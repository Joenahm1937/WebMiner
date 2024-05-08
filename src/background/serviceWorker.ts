import { LocalStorageWrapper } from '../LocalStorageWrapper';
import {
    ContentScriptMessage,
    Message,
    MessageHandler,
    PopupMessage,
    ResponseMessage,
    WorkerMessage,
} from '../interfaces';
import { PageScriptCoordinator } from './PageScriptCoordinator';

const PopupMessageHandler: MessageHandler<PopupMessage> = {
    processMessage(message, _, sendResponse) {
        const handleControllerError = (error: Error) => {
            if (error) sendResponse({ success: false, message: error.message });
        };
        if (message.signal === 'LAUNCH_SESSION') {
            PageScriptCoordinator.startProcessing(
                message.scriptName,
                handleControllerError
            );
            return true;
        } else if (message.signal === 'CLEAN_SESSION') {
            PageScriptCoordinator.stopProcessing(handleControllerError);
            sendResponse({ success: true });
        }
        return false;
    },
};

const ContentScriptMessageHandler: MessageHandler<ContentScriptMessage> = {
    processMessage(message) {
        this.saveContentScriptData(message);
        return false;
    },
    async saveContentScriptData(message: ContentScriptMessage) {
        if (message.signal === 'SAVE_SCRIPT') {
            const scripts = await LocalStorageWrapper.get('userScripts', {});
            await LocalStorageWrapper.set('userScripts', {
                ...scripts,
                [message.script.name]: message.script,
            });
        }
    },
};

const messageRouter = (
    message: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: ResponseMessage) => void
) => {
    if (message.source === 'Popup') {
        const asyncResponse = PopupMessageHandler.processMessage(
            message,
            sender,
            sendResponse
        );
        if (asyncResponse) return true;
    } else if (message.source === 'ContentScript') {
        const asyncResponse = ContentScriptMessageHandler.processMessage(
            message,
            sender,
            sendResponse
        );
        if (asyncResponse) return true;
    } else if (message.source === 'SignalScript') {
        LocalStorageWrapper.set('editing', message.isOpen);
    } else {
        sendResponse({
            success: false,
            message: 'Unrecognized Source',
        });
    }
};

chrome.runtime.onMessage.addListener(messageRouter);

const handleTabChange = (activeInfo: chrome.tabs.TabActiveInfo) => {
    const tabId = activeInfo.tabId;

    chrome.tabs.get(tabId, (tab) => {
        // Disabling extension when not on a valid URL ("http://*/*" or "https://*/*")
        // Our signalStatus content script is not injected on invalid URLs
        if (!tab || !tab.url) {
            chrome.action.setBadgeBackgroundColor({
                color: [255, 255, 255, 255],
            });
            chrome.action.disable(tabId);
            return;
        }
    });

    // Check Modal Status on Tab when opened
    const message: WorkerMessage = {
        source: 'Worker',
        signal: 'CHECK_MODAL_STATUS',
    };
    chrome.tabs.sendMessage(tabId, message, () => {
        var lastError = chrome.runtime.lastError;
        if (lastError) {
            // Stifling Error if tab is not responsive (indicating modal cannot be open)
            return;
        }
    });
};

chrome.tabs.onActivated.addListener(handleTabChange);
