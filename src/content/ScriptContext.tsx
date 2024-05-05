import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import { ScriptStep, SelectorResult } from './interfaces';

interface ScriptContextType {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    steps: ScriptStep[];
    addStep: (newStep: ScriptStep) => void;
    updateStep: (index: number, newStep: ScriptStep) => void;
    updateStepElement: (index: number, newElement: SelectorResult) => void;
    updateStepCommand: (index: number, newCommand: string) => void;
    removeStep: (index: number) => void;
    elementPickingStep?: number;
    setElementPickingStep: Dispatch<SetStateAction<number | undefined>>;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

interface ScriptProviderProps {
    children: ReactNode;
}

// TODO: Begin Updating Local Storage with Added, Updated, and Remove Steps
export const ScriptProvider: React.FC<ScriptProviderProps> = ({ children }) => {
    const [name, setName] = useState<string>('');
    // Placeholder Values (Loaded from Local Storage)
    const [steps, setSteps] = useState<ScriptStep[]>([
        {
            element: {
                selector: 'someText',
                searchAPI: 'getElementsByText',
            },
            command: 'Click',
        },
        {
            element: {
                selector: 'p:nth-child(1)',
                searchAPI: 'querySelector',
            },
            command: 'Input Text',
        },
    ]);
    const [elementPickingStep, setElementPickingStep] = useState<
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

    const updateStepElement = (index: number, newElement: SelectorResult) => {
        setSteps((prevSteps) =>
            prevSteps.map((step, i) =>
                i === index ? { ...step, element: newElement } : step
            )
        );
    };

    const updateStepCommand = (index: number, newCommand: string) => {
        setSteps((prevSteps) =>
            prevSteps.map((step, i) =>
                i === index ? { ...step, command: newCommand } : step
            )
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
        updateStepElement,
        updateStepCommand,
        removeStep,
        elementPickingStep,
        setElementPickingStep,
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
