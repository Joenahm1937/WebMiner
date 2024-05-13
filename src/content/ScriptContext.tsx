import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from 'react';
import {
    ContentScriptMessage,
    ResponseMessage,
    Script,
    ScriptStep,
    DOMMetadata,
} from '../interfaces';

interface ScriptContextType {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    steps: ScriptStep[];
    addStep: (newStep: ScriptStep) => void;
    updateStep: (index: number, newStep: ScriptStep) => void;
    updateStepElement: (index: number, newElement: DOMMetadata) => void;
    updateStepCommand: (index: number, newCommand: string) => void;
    removeStep: (index: number) => void;
    elementPickingStep?: number;
    setElementPickingStep: Dispatch<SetStateAction<number | undefined>>;
    canExecuteScript: () => boolean;
    saveScript: () => Promise<string>;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

interface ScriptProviderProps {
    initialScript?: Script;
    children: ReactNode;
}

// TODO: Begin Updating Local Storage with Added, Updated, and Remove Steps
export const ScriptProvider: React.FC<ScriptProviderProps> = ({
    children,
    initialScript,
}) => {
    const initialName = initialScript?.name;
    if (initialName) window.myModalOriginalName = initialName;
    const initialSteps = initialScript?.steps;
    const [name, setName] = useState<string>(initialName || '');
    const [steps, setSteps] = useState<ScriptStep[]>(initialSteps || []);
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

    const updateStepElement = (index: number, newElement: DOMMetadata) => {
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

    const canExecuteScript = (): boolean => {
        // Check each step for undefined element or command
        return steps.every(
            (step) => step.element !== undefined && step.command !== undefined
        );
    };

    const saveScript = async (): Promise<string> => {
        const script: Script = {
            name,
            steps,
        };

        const message: ContentScriptMessage = {
            source: 'ContentScript',
            signal: 'SAVE_SCRIPT',
            script,
            originalName: window.myModalOriginalName,
        };
        return new Promise((resolve, reject) =>
            chrome.runtime.sendMessage(message, (response: ResponseMessage) => {
                if (response.success) {
                    resolve('Successfully Saved');
                    window.myModalOriginalName = script.name;
                } else {
                    reject(response.message || 'Internal Error');
                }
            })
        );
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
        canExecuteScript,
        saveScript,
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
