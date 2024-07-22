import ReactDOM from 'react-dom';
import Modal from './Modal/Modal';
import type { Message } from '../interfaces';
import { tearDownModal } from './utils';
import { ScriptProvider } from './ScriptContext';

const handleMessage = async (message: Message) => {
    if (message.source === 'Worker') {
        switch (message.signal) {
            case 'CREATE_MODAL':
                if (!window.myModalElement) {
                    window.myModalElement = document.createElement('div');
                    document.body.appendChild(window.myModalElement);
                    ReactDOM.render(
                        <ScriptProvider
                            playOnLaunch={message.scriptContext.playOnLaunch}
                            initialScript={message.script}
                        >
                            <Modal />
                        </ScriptProvider>,
                        window.myModalElement
                    );
                }
                break;
            case 'REMOVE_MODAL':
                tearDownModal();
                break;
        }
    }
};

chrome.runtime.onMessage.addListener(handleMessage);
