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
    DOMCommand,
    ResponseMessage,
    Script,
    ScriptStep,
} from '../interfaces';
import { DOMSelectors } from './interfaces';
import { createDOMMetadata } from './ElementSelector/utils';
import { ScriptEngine } from './ScriptEngine';

interface ScriptContextType {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    steps: ScriptStep[];
    addStep: (newStep: ScriptStep) => void;
    stepStatuses: StepStatus[];
    playAllSteps: () => Promise<void>;
    playStep: (index: number) => Promise<void>;
    getStep: (index: number) => ScriptStep;
    updateStep: (index: number, newStep: ScriptStep) => void;
    updateStepElement: (index: number, newSelector: DOMSelectors) => void;
    updateStepCommand: (index: number, newCommand: DOMCommand) => void;
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

const STEP_STATUS = {
    IDLE: 'idle',
    RUNNING: 'running',
    SUCCESS: 'success',
    ERROR: 'error',
} as const;

type StepStatus = (typeof STEP_STATUS)[keyof typeof STEP_STATUS];

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
    const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
        initialSteps
            ? new Array(initialSteps.length).fill(STEP_STATUS.IDLE)
            : []
    );
    const [elementPickingStep, setElementPickingStep] = useState<
        number | undefined
    >();

    const addStep = (newStep: ScriptStep) => {
        setSteps((prevSteps) => [...prevSteps, newStep]);
        setStepStatuses((prevSteps) => [...prevSteps, 'idle']);
    };

    const updateStepStatus = (index: number, newStatus: StepStatus) => {
        setStepStatuses((prevStatus) =>
            prevStatus.map((status, i) => (i === index ? newStatus : status))
        );
    };

    const playAllSteps = async () => {
        for (let i = 0; i < steps.length; i++) {
            await playStep(i);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    };

    const playStep = async (index: number) => {
        updateStepStatus(index, 'running');
        try {
            await ScriptEngine.executeStep(steps[index]);
            updateStepStatus(index, 'success');
        } catch (error) {
            updateStepStatus(index, 'error');
        }
        setTimeout(() => updateStepStatus(index, 'idle'), 3000);
    };

    const getStep = (index: number) => {
        return steps[index];
    };

    const updateStep = (index: number, newStep: ScriptStep) => {
        setSteps((prevSteps) =>
            prevSteps.map((step, i) => (i === index ? newStep : step))
        );
    };

    const updateStepElement = (index: number, newSelector: DOMSelectors) => {
        setSteps((prevSteps) =>
            prevSteps.map((step, i) =>
                i === index
                    ? {
                          ...step,
                          element: createDOMMetadata(newSelector),
                          selectors: newSelector,
                      }
                    : step
            )
        );
    };

    const updateStepCommand = (index: number, newCommand: DOMCommand) => {
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
        stepStatuses,
        playAllSteps,
        playStep,
        getStep,
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
