import './Script.css';
import StepCard from './StepCard';
import AddCard from './AddCard';
import { useScriptContext } from '../ScriptContext';

const Script: React.FC = () => {
    const { steps } = useScriptContext();

    return (
        <div className="script-container">
            {steps.map((step, stepNumber) => (
                <StepCard
                    key={stepNumber}
                    stepNumber={stepNumber}
                    element={step.element}
                    command={step.command}
                />
            ))}
            <AddCard />
        </div>
    );
};

export default Script;
