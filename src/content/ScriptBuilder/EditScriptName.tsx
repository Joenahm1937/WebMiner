import { useState } from 'react';
import { useScriptContext } from '../ScriptContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileEdit, faSave, faCheck } from '@fortawesome/free-solid-svg-icons';
import './EditScriptName.css';

const EditScriptName: React.FC = () => {
    const { name, setName } = useScriptContext();
    const [editMode, setEditMode] = useState<boolean>(!name);
    const [tempName, setTempName] = useState<string>(name || '');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const saveName = () => {
        if (!tempName.trim()) {
            setErrorMessage('Script name cannot be empty.');
            return;
        }

        setErrorMessage(null);
        setName(tempName.trim());
        setEditMode(false);
    };

    const editName = () => {
        setEditMode(true);
        setTempName(name || '');
    };

    return (
        <div
            className={`edit-script-name-container ${
                editMode ? 'centered' : 'row-view'
            }`}
        >
            {editMode ? (
                <div className="edit-script-name-card">
                    <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Enter Script Name"
                        className="edit-script-name-input"
                    />
                    <button
                        onClick={saveName}
                        className="edit-script-save-button"
                    >
                        <FontAwesomeIcon icon={faCheck} className="fa-lg" />
                    </button>
                </div>
            ) : (
                <>
                    <div className="edit-script-row">
                        <button onClick={editName} className="edit-icon-button">
                            <FontAwesomeIcon
                                icon={faFileEdit}
                                className="fa-lg"
                            />
                        </button>
                        <span className="script-name-display">{name}</span>
                    </div>
                    <div className="edit-script-row">
                        <button onClick={saveName} className="save-icon-button">
                            <FontAwesomeIcon icon={faSave} className="fa-lg" />
                        </button>
                    </div>
                </>
            )}
            {errorMessage && <div className="error-banner">{errorMessage}</div>}
        </div>
    );
};

export default EditScriptName;
