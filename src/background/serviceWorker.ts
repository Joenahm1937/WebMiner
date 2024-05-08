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
    processMessage(message, _, sendResponse) {
        this.saveContentScriptData(message, sendResponse);
        return true;
    },
    async saveContentScriptData(
        message: ContentScriptMessage,
        sendResponse: (response: ResponseMessage) => void
    ) {
        if (message.signal !== 'SAVE_SCRIPT') return;
        const scripts = await LocalStorageWrapper.get('userScripts', {});

        if (
            (message.originalName === undefined ||
                message.originalName !== message.script.name) &&
            message.script.name in scripts
        ) {
            sendResponse({
                success: false,
                message:
                    'Script name already exists. Please choose a different name.',
            });
            return;
        }

        scripts[message.script.name] = message.script;

        // If the name changed, remove the old entry
        if (
            message.originalName &&
            message.originalName !== message.script.name
        ) {
            delete scripts[message.originalName];
        }

        await LocalStorageWrapper.set('userScripts', scripts);
        sendResponse({ success: true, message: 'Script saved successfully.' });
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
        if (!tab || !tab.url || !tab.url.startsWith('http')) {
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
