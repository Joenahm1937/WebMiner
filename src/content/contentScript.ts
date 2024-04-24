import ReactDOM from 'react-dom';
import type { ContentScriptMessage, UserScript, Message } from '../interfaces';
import Modal from './components/Modal';
import React from 'react';

const handleMessage = async (message: Message) => {
    if (message.source === 'Worker' && message.signal === 'START_PAGE_SCRIPT') {
        const {} = message.settings;

        const appElement = document.createElement('div');
        document.body.appendChild(appElement);
        ReactDOM.render(React.createElement(Modal), appElement);

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
