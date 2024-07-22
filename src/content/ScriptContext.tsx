import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    ContentScriptMessage,
    ScriptCommand,
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
    updateStepCommand: (index: number, newCommand: ScriptCommand) => void;
    removeStep: (index: number) => void;
    elementPickingStep?: number;
    setElementPickingStep: Dispatch<SetStateAction<number | undefined>>;
    canExecuteScript: () => boolean;
    saveScript: () => Promise<string>;
    getSavedScripts: () => Promise<string[]>;
}

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

interface ScriptProviderProps {
    playOnLaunch: boolean;
    initialScript?: Script;
    children: ReactNode;
}

const STEP_STATUS = {
    IDLE: 'idle',
    RUNNING: 'running',
    SUCCESS: 'success',
    ERROR: 'error',
} as const;

type StepStatusState = (typeof STEP_STATUS)[keyof typeof STEP_STATUS];

interface StepStatus {
    state: StepStatusState;
    message?: string;
}

// TODO: Begin Updating Local Storage with Added, Updated, and Remove Steps
export const ScriptProvider: React.FC<ScriptProviderProps> = ({
    children,
    playOnLaunch,
    initialScript,
}) => {
    const initialName = initialScript?.name;
    if (initialName) window.myModalOriginalName = initialName;
    const initialSteps = initialScript?.steps;
    const [name, setName] = useState<string>(initialName || '');
    const [steps, setSteps] = useState<ScriptStep[]>(initialSteps || []);
    const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
        initialSteps
            ? Array(initialSteps.length).fill({ state: STEP_STATUS.IDLE })
            : []
    );
    const [elementPickingStep, setElementPickingStep] = useState<
        number | undefined
    >();

    useEffect(() => {
        if (playOnLaunch) playAllSteps();
    }, []);

    const addStep = (newStep: ScriptStep) => {
        setSteps((prevSteps) => [...prevSteps, newStep]);
        setStepStatuses((prevSteps) => [...prevSteps, { state: 'idle' }]);
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
        updateStepStatus(index, { state: 'running' });
        try {
            await ScriptEngine.executeStep(steps[index]);
            updateStepStatus(index, { state: 'success' });
        } catch (error) {
            updateStepStatus(index, {
                state: 'error',
                message: (error as Error).message,
            });
        }
        setTimeout(() => updateStepStatus(index, { state: 'idle' }), 3000);
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

    const updateStepCommand = (index: number, newCommand: ScriptCommand) => {
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
        return steps.every((step) => {
            if (!step.element || !step.command) return false;
            if (step.command.commandType === 'Input Text') {
                return step.command.text.length > 0;
            }
            return true;
        });
    };

    const saveScript = async (): Promise<string> => {
        const script: Script = {
            url: window.location.href,
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

    const getSavedScripts = (): Promise<string[]> => {
        const message: ContentScriptMessage = {
            source: 'ContentScript',
            signal: 'GET_SCRIPT_NAMES',
        };
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response: ResponseMessage) => {
                if (response.success && response.message) {
                    resolve(JSON.parse(response.message));
                } else {
                    reject(response.message || 'Internal Error');
                }
            });
        });
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
        getSavedScripts,
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
