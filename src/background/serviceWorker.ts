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
        if (message.signal === 'UPDATE_SETTINGS') {
            PageScriptCoordinator.updateSettings({
                enableStackTrace: message.payload.devMode,
            });
        } else if (message.signal === 'CREATE') {
            PageScriptCoordinator.startProcessing(handleControllerError);
            return true;
        } else if (message.signal === 'COMPLETE') {
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
        const userScript = message.userScript;
        const userScripts =
            (await LocalStorageWrapper.get('userScripts')) || [];
        userScripts.push(userScript);
        await LocalStorageWrapper.set('userScripts', userScripts);
        const workerMessage: WorkerMessage = {
            source: 'Worker',
            signal: 'REFRESH_POPUP',
        };
        chrome.runtime.sendMessage(workerMessage);
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
