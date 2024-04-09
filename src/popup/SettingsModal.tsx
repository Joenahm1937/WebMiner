import './SettingsModal.css';
import { useAppContext } from './AppContext';

const SettingsModal = () => {
    const { developerMode, setDeveloperMode } = useAppContext();

    return (
        <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Settings</h2>
            <div className="settings-content">
                <div className="setting">
                    <label htmlFor="developer-mode" className="switch">
                        <input
                            type="checkbox"
                            id="developer-mode"
                            checked={developerMode}
                            onChange={(e) => setDeveloperMode(e.target.checked)}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span>Developer Mode</span>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
