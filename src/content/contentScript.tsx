import ReactDOM from 'react-dom';
import Modal from './components/Modal';
import type { Message } from '../interfaces';
import { tearDown } from './utils';
import { ScriptProvider } from './ScriptContext';

const handleMessage = async (message: Message) => {
    if (message.source === 'Worker') {
        switch (message.signal) {
            case 'START_PAGE_SCRIPT':
                if (!window.myModalElement) {
                    window.myModalElement = document.createElement('div');
                    document.body.appendChild(window.myModalElement);
                    ReactDOM.render(
                        <ScriptProvider>
                            <Modal />
                        </ScriptProvider>,
                        window.myModalElement
                    );
                }
                break;
            case 'STOP_PAGE_SCRIPT':
                tearDown();
                break;
        }
    }
};

chrome.runtime.onMessage.addListener(handleMessage);
