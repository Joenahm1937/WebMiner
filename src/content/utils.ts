import ReactDOM from 'react-dom';
import { UserScript, ContentScriptMessage } from '../interfaces';
import { MODAL_ID } from './constants';

export const tearDownModal = () => {
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

export const updateElementOutline = (element: HTMLElement, style: string) => {
    element.style.outline = style;
};

export const isModalElement = (element: HTMLElement) => {
    const modal = document.getElementById(MODAL_ID) as HTMLElement;
    return modal.contains(element);
};
