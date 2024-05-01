import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import { ScriptStep } from './interfaces';

interface ScriptContextType {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    steps: ScriptStep[];
    addStep: (newStep: ScriptStep) => void;
    updateStep: (index: number, newStep: ScriptStep) => void;
    removeStep: (index: number) => void;
    nodePickingStep?: number;
    setNodePickingStep: Dispatch<SetStateAction<number | undefined>>;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

interface ScriptProviderProps {
    children: ReactNode;
}

export const ScriptProvider: React.FC<ScriptProviderProps> = ({ children }) => {
    const [name, setName] = useState<string>('');
    const [steps, setSteps] = useState<ScriptStep[]>([]);
    const [nodePickingStep, setNodePickingStep] = useState<
        number | undefined
    >();

    const addStep = (newStep: ScriptStep) => {
        setSteps((prevSteps) => [...prevSteps, newStep]);
    };

    const updateStep = (index: number, newStep: ScriptStep) => {
        setSteps((prevSteps) =>
            prevSteps.map((step, i) => (i === index ? newStep : step))
        );
    };

    const removeStep = (index: number) => {
        setSteps((prevSteps) => prevSteps.filter((_, i) => i !== index));
    };

    const value = {
        name,
        setName,
        steps,
        addStep,
        updateStep,
        removeStep,
        nodePickingStep,
        setNodePickingStep,
    };

    return (
        <ScriptContext.Provider value={value}>
            {children}
        </ScriptContext.Provider>
    );
};

export function useScriptContext(): ScriptContextType {
    const context = useContext(ScriptContext);
    if (context === undefined) {
        throw new Error(
            'useScriptContext must be used within an ScriptProvider'
        );
    }
    return context;
}
