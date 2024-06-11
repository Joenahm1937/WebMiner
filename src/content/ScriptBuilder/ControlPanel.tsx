import { useState } from 'react';
import { useScriptContext } from '../ScriptContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFileEdit,
    faSave,
    faCheck,
    faPlay,
} from '@fortawesome/free-solid-svg-icons';
import './ControlPanel.css';

const ControlPanel: React.FC = () => {
    const { name, setName, saveScript, canExecuteScript, playAllSteps } =
        useScriptContext();
    const [editNameMode, setEditNameMode] = useState<boolean>(!name);
    const [tempName, setTempName] = useState<string>(name || '');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const saveName = () => {
        if (!tempName.trim()) {
            setErrorMessage('Script name cannot be empty.');
            return;
        }

        setErrorMessage(null);
        setName(tempName.trim());
        setEditNameMode(false);
    };

    const editName = () => {
        setEditNameMode(true);
        setTempName(name || '');
    };

    const handleSave = async () => {
        if (canExecuteScript()) {
            try {
                const successMessage = await saveScript();
                setSuccessMessage(successMessage);
                setTimeout(() => setSuccessMessage(null), 3000);
            } catch (err) {
                setErrorMessage(err as string);
                setTimeout(() => setErrorMessage(null), 3000);
            }
        } else {
            setErrorMessage('Please fill out all steps');
            setTimeout(() => setErrorMessage(null), 3000);
        }
    };

    return (
        <div
            className={`control-panel-name-container ${
                editNameMode ? 'centered' : 'row-view'
            }`}
        >
            {editNameMode ? (
                <div className="control-panel-name-card">
                    <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Enter Script Name"
                        className="control-panel-name-input"
                    />
                    <button
                        onClick={saveName}
                        className="control-panel-save-button web-miner-icon"
                    >
                        <FontAwesomeIcon icon={faCheck} className="fa-lg " />
                    </button>
                </div>
            ) : (
                <>
                    <div className="control-panel-row">
                        <button
                            onClick={editName}
                            className="edit-icon-button web-miner-icon"
                        >
                            <FontAwesomeIcon
                                icon={faFileEdit}
                                className="fa-lg "
                            />
                        </button>
                        <span className="script-name-display">{name}</span>
                    </div>
                    <div className="control-panel-row">
                        <button
                            className="step-play-button web-miner-icon"
                            onClick={playAllSteps}
                        >
                            <FontAwesomeIcon icon={faPlay} className="fa-lg " />
                        </button>
                        <button
                            onClick={handleSave}
                            className="save-icon-button web-miner-icon"
                        >
                            <FontAwesomeIcon icon={faSave} className="fa-lg " />
                        </button>
                    </div>
                </>
            )}
            {errorMessage && <div className="error-banner">{errorMessage}</div>}
            {successMessage && (
                <div className="success-banner">{successMessage}</div>
            )}
        </div>
    );
};

export default ControlPanel;
