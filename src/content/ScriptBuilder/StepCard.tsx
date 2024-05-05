import './StepCard.css';
import { useScriptContext } from '../ScriptContext';
import { ScriptStep } from '../interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowPointer } from '@fortawesome/free-solid-svg-icons';

interface StepProps extends ScriptStep {
    stepNumber: number;
}

const StepCard: React.FC<StepProps> = ({ stepNumber, element, command }) => {
    const { setElementPickingStep, updateStepCommand } = useScriptContext();
    const enterPickingMode = () => {
        setElementPickingStep(stepNumber);
    };

    const handleCommandChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newCommand = event.target.value;
        updateStepCommand(stepNumber, newCommand);
    };

    const selectorText = element?.selector || 'Select Element';
    const isElementMissing = !element;
    const isCommandMissing = command === undefined;

    return (
        <div className="step-card-container">
            <button className="step-pick-button" onClick={enterPickingMode}>
                <FontAwesomeIcon icon={faArrowPointer} className="fa-lg" />
            </button>
            <div className="step-details">
                <div
                    className={
                        isElementMissing
                            ? 'placeholder-text'
                            : 'step-selector-text'
                    }
                >
                    {selectorText}
                </div>
                <select
                    className="step-command-select"
                    value={command ?? ''}
                    onChange={handleCommandChange}
                >
                    {isCommandMissing && (
                        <option disabled value="">
                            Select Command
                        </option>
                    )}
                    <option value="Click">Click</option>
                    <option value="Input Text">Input Text</option>
                </select>
            </div>
        </div>
    );
};

export default StepCard;
