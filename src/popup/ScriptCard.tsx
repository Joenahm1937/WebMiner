import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { PopupMessage, ResponseMessage } from '../interfaces';
import { ModalState } from './constants';

interface ScriptProps {
    name: string;
    url: string;
    openModal: (name?: string) => Promise<void>;
    setToEditingMode: (status: ModalState) => void;
}

const ScriptCard: React.FC<ScriptProps> = ({
    name,
    url,
    openModal,
    setToEditingMode,
}) => {
    const handleClick = () => {
        openModal(name);
    };

    const openLinkInTab = () => {
        const message: PopupMessage = {
            source: 'Popup',
            signal: 'OPEN_SESSION_IN_TAB',
            scriptName: name,
            linkUrl: url,
        };
        setToEditingMode('OPEN_MODAL');
        chrome.runtime.sendMessage(message, (response: ResponseMessage) => {
            if (!response.success) {
                setToEditingMode('NO_MODAL');
            }
        });
    };

    return (
        <li className="script-card" onClick={handleClick}>
            <div className="script-card-content">
                <div className="script-hostname">{getHostName(url)}</div>
                <div className="script-name">{name}</div>
                <div className="script-link" onClick={openLinkInTab}>
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                </div>
            </div>
        </li>
    );
};

const getHostName = (href: string) => {
    try {
        const url = new URL(href);
        return url.hostname;
    } catch (err) {
        return 'Invalid URL';
    }
};

export default ScriptCard;
