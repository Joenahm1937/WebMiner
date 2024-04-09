import type { ContentScriptMessage, UserScript, Message } from '../interfaces';

const handleMessage = async (message: Message) => {
    if (message.source === 'Worker' && message.signal === 'START_PAGE_SCRIPT') {
        const {} = message.settings;

        const userScript: UserScript = {
            id: Math.random(),
        };

        const response: ContentScriptMessage = {
            source: 'ContentScript',
            signal: 'COMPLETED',
            userScript: userScript,
        };
        chrome.runtime.sendMessage(response);
    }
};

chrome.runtime.onMessage.addListener(handleMessage);
