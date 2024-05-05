import { SelectorResult } from './ElementSelector/utils';

declare global {
    interface Window {
        myModalElement?: HTMLElement;
    }
}

export interface ScriptStep {
    element: SelectorResult;
    command: string;
}
