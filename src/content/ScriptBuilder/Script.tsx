import './Script.css';
import StepCard from './StepCard';
import AddCard from './AddCard';
import { useScriptContext } from '../ScriptContext';
import ControlPanel from './ControlPanel';

const Script: React.FC = () => {
    const { steps, name } = useScriptContext();

    return (
        <div className="script-container">
            <ControlPanel />
            {steps.map((step, stepNumber) => (
                <StepCard
                    key={stepNumber}
                    stepNumber={stepNumber}
                    element={step.element}
                    command={step.command}
                />
            ))}
            {name.length ? <AddCard /> : null}
        </div>
    );
};

export default Script;
