import ReactDOM from 'react-dom';
import { UserScript, ContentScriptMessage } from '../interfaces';
import { MODAL_ID } from './constants';

declare global {
    interface Window {
        myModalElement?: HTMLElement;
    }
}

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

export const getDetailedAttributes = (element: HTMLElement): string => {
    let attributes: Record<string, string> = {};
    Array.from(element.attributes).forEach((attr) => {
        attributes[attr.name] = attr.value;
    });
    return JSON.stringify(attributes);
};

export const isModalElement = (element: HTMLElement) => {
    const modal = document.getElementById(MODAL_ID) as HTMLElement;
    return modal.contains(element);
};
