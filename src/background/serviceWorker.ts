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
            const workerMessage: WorkerMessage = {
                source: 'Worker',
                signal: 'REFRESH_POPUP',
            };
            chrome.runtime.sendMessage(workerMessage);
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
    } else {
        sendResponse({
            success: false,
            message: 'Unrecognized Source',
        });
    }
};

chrome.runtime.onMessage.addListener(messageRouter);
