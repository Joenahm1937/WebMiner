import React, { useState } from 'react';
import { InputTextCommand } from '../../../interfaces';
import { useScriptContext } from '../../ScriptContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEdit } from '@fortawesome/free-solid-svg-icons';

interface InputTextProps {
    stepNumber: number;
    command: InputTextCommand;
}

const InputText: React.FC<InputTextProps> = ({ stepNumber, command }) => {
    const { updateStepCommand } = useScriptContext();
    const [text, setText] = useState(command.text);
    const [isEditing, setIsEditing] = useState(command.text.length === 0);

    const onSaveText = () => {
        if (text.length === 0) return;
        updateStepCommand(stepNumber, {
            commandType: 'Input Text',
            text: text,
        });
        setIsEditing(false);
    };

    return (
        <div className="supplemental-card-container">
            {isEditing ? (
                <div className="input-container">
                    <textarea
                        className="input-text-area"
                        placeholder="Enter text here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <button className="icon-button" onClick={onSaveText}>
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                </div>
            ) : (
                <div className="saved-text-container">
                    <div className="saved-text">{text}</div>
                    <button
                        className="icon-button"
                        onClick={() => setIsEditing(true)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default InputText;
