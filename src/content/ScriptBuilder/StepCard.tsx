import './StepCard.css';
import { useScriptContext } from '../ScriptContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowPointer,
    faTrash,
    faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { Commands, DOMCommand, ScriptStep } from '../../interfaces';
import ElementMetadata from '../ElementSelector/ElementMetadata';
import { useState } from 'react';

interface StepProps extends ScriptStep {
    stepNumber: number;
}

const StepCard: React.FC<StepProps> = ({ stepNumber, element, command }) => {
    const { setElementPickingStep, updateStepCommand, playStep, removeStep } =
        useScriptContext();
    const enterPickingMode = () => {
        setElementPickingStep(stepNumber);
    };

    const [isPlaying, setIsPlaying] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handlePlayClick = async () => {
        setIsPlaying(true);
        try {
            await playStep(stepNumber);
            setSuccessMessage('Success');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            setErrorMessage('There was an error');
            setTimeout(() => setErrorMessage(null), 3000);
        }
        setIsPlaying(false);
    };

    const handleCommandChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newCommand = event.target.value as DOMCommand;
        updateStepCommand(stepNumber, newCommand);
    };

    const handleDeleteClick = () => {
        removeStep(stepNumber);
    };

    const isElementMissing = !element;
    const isCommandMissing = command === undefined;
    const hasValidSelector = element && element.selectors.length;

    return (
        <div
            className={`step-card-container ${
                isElementMissing && isCommandMissing && 'empty-card'
            }`}
        >
            <div className="step-card-header">
                <button
                    className="step-pick-button web-miner-icon"
                    onClick={enterPickingMode}
                >
                    <FontAwesomeIcon icon={faArrowPointer} className="fa-lg " />
                </button>
                {!successMessage && !errorMessage && isPlaying && (
                    <div className="web-miner-icon">Playing...</div>
                )}
                {!successMessage && !errorMessage && !isPlaying && (
                    <div>
                        <button
                            className="step-delete-button web-miner-icon"
                            onClick={handleDeleteClick}
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="fa-lg "
                            />
                        </button>
                        <button
                            className="step-play-button web-miner-icon"
                            onClick={handlePlayClick}
                        >
                            <FontAwesomeIcon icon={faPlay} className="fa-lg " />
                        </button>
                    </div>
                )}
                {errorMessage && (
                    <div className="error-banner">{errorMessage}</div>
                )}
                {successMessage && (
                    <div className="success-banner">{successMessage}</div>
                )}
            </div>
            <div className="step-details">
                <div
                    className={
                        isElementMissing
                            ? 'placeholder-text'
                            : 'step-selector-text'
                    }
                >
                    {hasValidSelector ? (
                        <ElementMetadata metadata={element} />
                    ) : (
                        <p>Select Element</p>
                    )}
                </div>
                <select
                    className="step-command-select"
                    value={command ?? ''}
                    onChange={handleCommandChange}
                >
                    {isCommandMissing && <option disabled value=""></option>}
                    <option value={Commands.CLICK}>{Commands.CLICK}</option>
                    <option value={Commands.INPUT_TEXT}>
                        {Commands.INPUT_TEXT}
                    </option>
                </select>
            </div>
        </div>
    );
};

export default StepCard;
