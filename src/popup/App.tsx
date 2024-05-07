import type {
    Script,
    Message,
    PopupMessage,
    ResponseMessage,
} from '../interfaces';
import { useEffect, useState } from 'react';
import logo from './assets/logo.svg';
import settings from './assets/settings.svg';
import './App.css';
import {
    TOGGLE_EDIT_STATE,
    EXTENSION_HEADER,
    RESET_BUTTON_TEXT,
} from './constants';
import { LocalStorageWrapper } from '../LocalStorageWrapper';
import ScriptCardList from './ScriptList';
import ErrorComponent from './ErrorComponent';
import EditingAnimation from './EditingAnimation';
import SettingsModal from './SettingsModal';
import { PopupSignal } from '../constants';

const App = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [scripts, setScripts] = useState<Record<string, Script>>({});
    const [errorMessage, setErrorMessage] = useState<string>();
    const [settingsVisible, setSettingsVisible] = useState<boolean>(false);

    useEffect(() => {
        initializeUI();
        const handleMessage = (message: Message) => {
            if (
                message.source === 'Worker' &&
                message.signal === 'REFRESH_POPUP'
            ) {
                refreshUI();
            }
        };

        chrome.runtime.onMessage.addListener(handleMessage);
        return () => chrome.runtime.onMessage.removeListener(handleMessage);
    }, []);

    const initializeUI = async () => {
        const storedScripts = await LocalStorageWrapper.get('userScripts', {});
        const storedCreatingStatus = await LocalStorageWrapper.get(
            'editing',
            false
        );
        setScripts(storedScripts);
        setIsEditing(storedCreatingStatus);
    };

    const refreshUI = () => {
        LocalStorageWrapper.get('userScripts', {}).then((userScripts) => {
            setScripts(userScripts);
        });
    };

    const toggleSettingsVisibility = () => {
        setSettingsVisible((prevState) => !prevState);
    };

    const toggleScraping = async () => {
        let message: PopupMessage;
        if (isEditing) {
            message = {
                source: 'Popup',
                signal: PopupSignal.CleanSession,
            };
        } else {
            message = {
                source: 'Popup',
                signal: PopupSignal.LaunchSession,
            };
        }

        const newEditStatus = !isEditing;
        await LocalStorageWrapper.set('editing', !isEditing);
        setIsEditing((prevEditState) => !prevEditState);
        chrome.runtime.sendMessage(message, (response: ResponseMessage) => {
            if (!response.success) {
                LocalStorageWrapper.set('editing', !newEditStatus);
                setIsEditing((prevEditState) => !prevEditState);
                setErrorMessage(response.message);
            }
        });
    };

    const reset = async () => {
        LocalStorageWrapper.remove(['editing', 'userScripts']);
        refreshUI();
    };

    return (
        <>
            <div
                className="settings-container"
                onClick={toggleSettingsVisibility}
            >
                <img src={settings} className="settings-icon" alt="settings" />
            </div>
            {settingsVisible && (
                <>
                    <div
                        className="settings-modal-overlay"
                        onClick={toggleSettingsVisibility}
                    ></div>
                    <SettingsModal />
                </>
            )}
            <img src={logo} className="logo" alt="logo" />
            <h2>{EXTENSION_HEADER}</h2>
            <div className="buttons">
                <button onClick={toggleScraping}>
                    {isEditing
                        ? TOGGLE_EDIT_STATE.EDITING
                        : TOGGLE_EDIT_STATE.REST}
                </button>
                {isEditing ? <EditingAnimation /> : null}
                {!isEditing && scripts.length ? (
                    <button onClick={reset}>{RESET_BUTTON_TEXT}</button>
                ) : null}
            </div>

            <ErrorComponent message={errorMessage} />
            <ScriptCardList scripts={scripts} />
        </>
    );
};

export default App;
