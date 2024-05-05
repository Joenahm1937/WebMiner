import './StepCard.css';
import { useScriptContext } from '../ScriptContext';
import { ScriptStep } from '../interfaces';

interface StepProps extends ScriptStep {
    stepNumber: number;
}

const StepCard: React.FC<StepProps> = ({ stepNumber, element, command }) => {
    const { setElementPickingStep } = useScriptContext();
    const enterPickingMode = () => {
        setElementPickingStep(stepNumber);
    };

    return (
        <div className="step-card-container">
            <button className="step-pick-button" onClick={enterPickingMode}>
                <span role="img" aria-label="pick">
                    🔍
                </span>
            </button>
            <div className="step-details">
                <div className="step-selector-text">{element.selector}</div>
                <select
                    className="step-command-select"
                    value={command}
                    onChange={(e) => console.log(e.target.value)}
                >
                    <option value="Click">Click</option>
                    <option value="Input Text">Input Text</option>
                </select>
            </div>
        </div>
    );
};

export default StepCard;
