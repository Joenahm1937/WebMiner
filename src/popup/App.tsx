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
import { EXTENSION_HEADER, RESET_BUTTON_TEXT, ModalState } from './constants';
import { LocalStorageWrapper } from '../LocalStorageWrapper';
import ScriptCardList from './ScriptList';
import ErrorComponent from './ErrorComponent';
import EditingAnimation from './EditingAnimation';
import SettingsModal from './SettingsModal';

const App = () => {
    const [isEditing, setIsEditing] = useState<ModalState>('LOCATING_MODAL');
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
        const storedEditingStatus = await LocalStorageWrapper.get(
            'isModalOpen',
            false
        );
        setScripts(storedScripts);
        setIsEditing(storedEditingStatus ? 'OPEN_MODAL' : 'NO_MODAL');
    };

    const refreshUI = () => {
        LocalStorageWrapper.get('userScripts', {}).then((userScripts) => {
            setScripts(userScripts);
        });
    };

    const toggleSettingsVisibility = () => {
        setSettingsVisible((prevState) => !prevState);
    };

    const setToEditingMode = (status: ModalState) => {
        if (status === 'OPEN_MODAL') {
            LocalStorageWrapper.set('isModalOpen', true);
            setIsEditing('OPEN_MODAL');
        } else {
            LocalStorageWrapper.set('isModalOpen', false);
            setIsEditing('NO_MODAL');
        }
    };

    const openModal = async (name?: string) => {
        const message: PopupMessage = {
            source: 'Popup',
            signal: 'LAUNCH_SESSION',
            scriptName: name,
        };
        setToEditingMode('OPEN_MODAL');
        chrome.runtime.sendMessage(message, (response: ResponseMessage) => {
            if (!response.success) {
                setToEditingMode('NO_MODAL');
                setErrorMessage(response.message);
            }
        });
    };

    const closeModal = async () => {
        const message: PopupMessage = {
            source: 'Popup',
            signal: 'CLEAN_SESSION',
        };
        setToEditingMode('NO_MODAL');
        chrome.runtime.sendMessage(message, (response: ResponseMessage) => {
            if (!response.success) {
                setToEditingMode('OPEN_MODAL');
                setErrorMessage(response.message);
            }
        });
    };

    const deleteScripts = async () => {
        LocalStorageWrapper.remove('userScripts');
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
            <div className="popup-buttons">
                {isEditing === 'NO_MODAL' ? (
                    <button
                        onClick={() => {
                            openModal();
                        }}
                    >
                        CREATE NEW
                    </button>
                ) : null}
                {isEditing === 'NO_MODAL' && Object.values(scripts).length ? (
                    <button onClick={deleteScripts}>{RESET_BUTTON_TEXT}</button>
                ) : null}
                {isEditing === 'NO_MODAL' && (
                    <ScriptCardList
                        scripts={scripts}
                        openModal={openModal}
                        setToEditingMode={setToEditingMode}
                    />
                )}
                {isEditing === 'OPEN_MODAL' ? (
                    <button onClick={closeModal}>CLOSE EDITOR</button>
                ) : null}
                {isEditing === 'OPEN_MODAL' ? <EditingAnimation /> : null}
            </div>
            <ErrorComponent message={errorMessage} />
        </>
    );
};

export default App;
