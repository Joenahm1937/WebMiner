import ReactDOM from 'react-dom';
import { MODAL_ID } from './constants';

export const tearDownModal = () => {
    if (window.myModalElement) {
        ReactDOM.unmountComponentAtNode(window.myModalElement);
        window.myModalElement.remove();
        window.myModalElement = undefined;
        window.myModalOriginalName = undefined;
    }
};

export const updateElementStyles = (
    element: HTMLElement,
    addStyle: boolean
) => {
    if (addStyle) {
        element.style.outline = '3px solid red';
    } else {
        element.style.outline = '';
    }
};

export const isModalElement = (element: HTMLElement) => {
    const modal = document.getElementById(MODAL_ID) as HTMLElement;
    return modal.contains(element);
};
