import type {
    Script,
    Message,
    PopupMessage,
    PopupSettingsUpdateMessage,
    ResponseMessage,
} from '../interfaces';
import { useEffect, useState, useRef } from 'react';
import logo from './assets/logo.svg';
import settings from './assets/settings.svg';
import './App.css';
import {
    TOGGLE_CREATION_STATE,
    EXTENSION_HEADER,
    RESET_BUTTON_TEXT,
} from './constants';
import { LocalStorageWrapper } from '../LocalStorageWrapper';
import ScriptCardList from './ScriptList';
import ErrorComponent from './ErrorComponent';
import CreatingAnimation from './CreatingAnimation';
import SettingsModal from './SettingsModal';
import { useAppContext } from './AppContext';
import { PopupSignals } from '../constants';

const App = () => {
    const [creating, setCreating] = useState(false);
    const [scripts, setScripts] = useState<Script[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
    const isFirstMount = useRef(true);

    const { developerMode, setDeveloperMode } = useAppContext();

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

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        const message: PopupSettingsUpdateMessage = {
            source: 'Popup',
            signal: 'UPDATE_SETTINGS',
            payload: {
                devMode: developerMode,
            },
        };

        const updateSettings = async () => {
            await LocalStorageWrapper.set('devMode', developerMode);
            chrome.runtime.sendMessage(message);
        };

        updateSettings();
    }, [developerMode]);

    const initializeUI = async () => {
        const storedScripts = await LocalStorageWrapper.get('userScripts');
        const storedCreatingStatus = await LocalStorageWrapper.get(
            'isCreating'
        );
        const storedDevMode = await LocalStorageWrapper.get('devMode');
        if (storedScripts) setScripts(storedScripts);
        if (storedCreatingStatus) setCreating(storedCreatingStatus);
        if (storedDevMode) setDeveloperMode(storedDevMode);
    };

    const refreshUI = () => {
        LocalStorageWrapper.get('userScripts').then((userScripts) => {
            setScripts(userScripts || []);
        });
    };

    const toggleSettingsVisibility = () => {
        setSettingsVisible((prevState) => !prevState);
    };

    const toggleScraping = async () => {
        const creatingStatus = creating
            ? PopupSignals.Completing
            : PopupSignals.Creating;
        const message: PopupMessage = {
            source: 'Popup',
            signal: creatingStatus,
        };
        const newCreatingStatus = !creating;
        await LocalStorageWrapper.set('isCreating', !creating);
        setCreating((prevCreatingState) => !prevCreatingState);
        chrome.runtime.sendMessage(message, (response: ResponseMessage) => {
            if (!response.success) {
                LocalStorageWrapper.set('isCreating', !newCreatingStatus);
                setCreating((prevCreatingState) => !prevCreatingState);
                setErrorMessage(response.message);
            }
        });
    };

    const reset = async () => {
        LocalStorageWrapper.remove(['isCreating', 'userScripts']);
        const message: PopupMessage = {
            source: 'Popup',
            signal: 'RESTART',
        };
        chrome.runtime.sendMessage(message);
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
                    {creating
                        ? TOGGLE_CREATION_STATE.CREATING
                        : TOGGLE_CREATION_STATE.REST}
                </button>
                {creating ? <CreatingAnimation /> : null}
                {!creating && scripts.length ? (
                    <button onClick={reset}>{RESET_BUTTON_TEXT}</button>
                ) : null}
            </div>

            <ErrorComponent message={errorMessage} />
            <ScriptCardList scripts={scripts} />
        </>
    );
};

export default App;
