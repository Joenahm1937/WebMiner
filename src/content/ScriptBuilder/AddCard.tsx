import { useState } from 'react';
import { useScriptContext } from '../ScriptContext';
import './AddCard.css';

const AddCard: React.FC = () => {
    const { addStep, canExecuteScript } = useScriptContext();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const addStepCard = () => {
        if (!canExecuteScript()) {
            setErrorMessage(
                'Please ensure all steps have a valid selector and command'
            );
            return;
        }

        // Reset error message if previous issues were resolved
        setErrorMessage(null);

        // Add a new step
        addStep({
            element: undefined,
            command: undefined,
        });
    };

    return (
        <div>
            <div className="add-card-container" onClick={addStepCard}>
                <button className="add-card-button">
                    <span role="img" aria-label="add">
                        +
                    </span>
                </button>
                <div className="add-card-details">Add Card</div>
                {errorMessage && (
                    <div className="error-banner">{errorMessage}</div>
                )}
            </div>
        </div>
    );
};

export default AddCard;
