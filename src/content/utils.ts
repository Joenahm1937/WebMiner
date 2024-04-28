import ReactDOM from 'react-dom';
import { UserScript, ContentScriptMessage } from '../interfaces';

declare global {
    interface Window {
        myModalElement?: HTMLElement;
    }
}

export const tearDown = () => {
    if (window.myModalElement) {
        const scriptNodes: UserScript = {
            id: Math.random(),
        };
        const response: ContentScriptMessage = {
            source: 'ContentScript',
            signal: 'COMPLETED',
            userScript: scriptNodes,
        };
        chrome.runtime.sendMessage(response);
        ReactDOM.unmountComponentAtNode(window.myModalElement);
        window.myModalElement.remove();
        window.myModalElement = undefined;
    }
};
