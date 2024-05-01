import Step from './Step';
import { useScriptContext } from '../ScriptContext';

const Script: React.FC = () => {
    const { steps } = useScriptContext();

    return (
        <div>
            {steps.map((step, stepNumber) => (
                <Step
                    key={stepNumber}
                    stepNumber={stepNumber}
                    element={step.element}
                    command={step.command}
                />
            ))}
        </div>
    );
};

export default Script;
