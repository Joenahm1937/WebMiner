import ReactDOM from 'react-dom';
import { MODAL_ID } from './constants';

export const tearDownModal = () => {
    if (window.myModalElement) {
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
