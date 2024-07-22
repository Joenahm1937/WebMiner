import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

interface ScriptProps {
    name: string;
    url: string;
    openModal: (name?: string) => Promise<void>;
}

const ScriptCard: React.FC<ScriptProps> = ({ name, url, openModal }) => {
    const handleClick = () => {
        openModal(name);
    };

    return (
        <li className="script-card" onClick={handleClick}>
            <div className="script-card-content">
                <div className="script-hostname">{getHostName(url)}</div>
                <div className="script-name">{name}</div>
                <a
                    href={url}
                    className="script-link"
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
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
