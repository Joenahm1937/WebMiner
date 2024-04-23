import type { ContentScriptMessage, UserScript, Message } from '../interfaces';
// import { Modal } from './Modal';

const handleMessage = async (message: Message) => {
    if (message.source === 'Worker' && message.signal === 'START_PAGE_SCRIPT') {
        const {} = message.settings;

        // Modal.create();

        const userScript: UserScript = {
            id: Math.random(),
        };

        const response: ContentScriptMessage = {
            source: 'ContentScript',
            signal: 'COMPLETED',
            userScript: userScript,
        };
        chrome.runtime.sendMessage(response);
    } else if (
        message.source === 'Worker' &&
        message.signal === 'STOP_PAGE_SCRIPT'
    ) {
        // Modal.destroy();
    }
};

chrome.runtime.onMessage.addListener(handleMessage);
