import { useScriptContext } from '../ScriptContext';
import { ScriptStep } from '../interfaces';

interface StepProps extends ScriptStep {
    stepNumber: number;
}

const Step: React.FC<StepProps> = ({ stepNumber, element, command }) => {
    const { setElementPickingStep } = useScriptContext();
    const enterPickingMode = () => {
        setElementPickingStep(stepNumber);
    };
    return (
        <div>
            <p>Step {stepNumber}</p>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                }}
            >
                <div>{element.selector}</div>
                <button
                    style={{ marginRight: '10px' }}
                    onClick={enterPickingMode}
                >
                    <span role="img" aria-label="pick">
                        🔍
                    </span>{' '}
                </button>
                <select
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

export default Step;
