import './StepCard.css';
import { useScriptContext } from '../ScriptContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowPointer, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ScriptStep } from '../../interfaces';
import ElementMetadata from '../ElementSelector/ElementMetadata';

interface StepProps extends ScriptStep {
    stepNumber: number;
}

const StepCard: React.FC<StepProps> = ({ stepNumber, element, command }) => {
    const { setElementPickingStep, updateStepCommand, removeStep } =
        useScriptContext();
    const enterPickingMode = () => {
        setElementPickingStep(stepNumber);
    };

    const handleCommandChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newCommand = event.target.value;
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
                <button
                    className="step-delete-button web-miner-icon"
                    onClick={handleDeleteClick}
                >
                    <FontAwesomeIcon icon={faTrash} className="fa-lg " />
                </button>
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
                    <option value="Click">Click</option>
                    <option value="Input Text">Input Text</option>
                </select>
            </div>
        </div>
    );
};

export default StepCard;
