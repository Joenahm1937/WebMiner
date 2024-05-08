import type { Message, SignalScriptMessage } from './interfaces';

const initialPageLoadMessage: SignalScriptMessage = {
    source: 'SignalScript',
    signal: 'MODAL_STATUS',
    isOpen: document.getElementById('web-miner-modal') instanceof HTMLElement,
};

// Send the message on page load
chrome.runtime.sendMessage(initialPageLoadMessage);

const handleMessage = (message: Message) => {
    if (
        message.source === 'Worker' &&
        message.signal === 'CHECK_MODAL_STATUS'
    ) {
        const pageLoadMessage: SignalScriptMessage = {
            source: 'SignalScript',
            signal: 'MODAL_STATUS',
            isOpen:
                document.getElementById('web-miner-modal') instanceof
                HTMLElement,
        };
        chrome.runtime.sendMessage(pageLoadMessage);
    }
};

// Send the message when asked by the service worker (upon a tab switch)
chrome.runtime.onMessage.addListener(handleMessage);
