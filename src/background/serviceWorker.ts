import { LocalStorageWrapper } from '../LocalStorageWrapper';
import {
    ContentScriptMessage,
    Message,
    MessageHandler,
    PopupMessage,
    ResponseMessage,
    WorkerMessage,
} from '../interfaces';
import { TabsFacade } from './TabsFacade';

const PopupMessageHandler: MessageHandler<PopupMessage> = {
    processMessage(message, _, sendResponse) {
        if (message.signal === 'update_settings') {
            TabsFacade.updateMaxTabs(message.payload.maxTabs);
            TabsFacade.updateScriptContext({
                enableStackTrace: message.payload.devMode,
            });
        } else if (message.signal === 'start') {
            TabsFacade.startProcessing((error?: Error) => {
                if (error) {
                    sendResponse({ success: false, message: error.message });
                } else {
                    sendResponse({
                        success: true,
                    });
                }
            });
            return true;
        } else if (message.signal === 'stop') {
            TabsFacade.stopProcessing();
            sendResponse({ success: true });
        } else if (message.signal === 'restart') {
            TabsFacade.flushQueue();
            sendResponse({ success: true });
        }
        return false;
    },
};

const ContentScriptMessageHandler: MessageHandler<ContentScriptMessage> = {
    processMessage(message, sender) {
        this.saveContentScriptData(message, sender);
        return false;
    },
    async saveContentScriptData(
        message: ContentScriptMessage,
        sender: chrome.runtime.MessageSender
    ) {
        if (sender.tab) {
            TabsFacade.closeTab(sender.tab);
            if (message.tabData.suggestedProfiles)
                TabsFacade.enqueue(message.tabData.suggestedProfiles);
        }
        const tabData = message.tabData;
        const tabs = (await LocalStorageWrapper.get('tabs')) || [];
        tabs.push(tabData);
        await LocalStorageWrapper.set('tabs', tabs);
        const workerMessage: WorkerMessage = {
            source: 'Worker',
            signal: 'refresh',
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
