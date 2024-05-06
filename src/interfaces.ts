import { WorkerSignals, ContentScriptSignals, PopupSignals } from './constants';

/**
 * Types for Messaging between the background script, the popup UI, and the content scripts.
 */

export type Message = WorkerMessage | PopupMessage | ContentScriptMessage;

// Worker-originated messages
type BaseWorkerMessage = {
    source: 'Worker';
    signal: Exclude<
        (typeof WorkerSignals)[keyof typeof WorkerSignals],
        'START_PAGE_SCRIPT'
    >;
};
export type WorkerScriptContextMessage = {
    source: 'Worker';
    signal: 'START_PAGE_SCRIPT';
    settings: Settings;
};
export type WorkerMessage = BaseWorkerMessage | WorkerScriptContextMessage;

// Popup-originated messages
type BasePopupMessage = {
    source: 'Popup';
    signal: Exclude<
        (typeof PopupSignals)[keyof typeof PopupSignals],
        'UPDATE_SETTINGS'
    >;
};
export type PopupSettingsUpdateMessage = {
    source: 'Popup';
    signal: 'UPDATE_SETTINGS';
    payload: Settings;
};
export type PopupMessage = BasePopupMessage | PopupSettingsUpdateMessage;

// Content script-originated messages
export type ContentScriptMessage = {
    source: 'ContentScript';
    signal: (typeof ContentScriptSignals)[keyof typeof ContentScriptSignals];
    userScript: Script;
};

// Defines response structure for message handlers.
export type ResponseMessage = {
    success: boolean;
    message?: string;
};

/**
 * Interface for message handling across different components.
 * https://developer.chrome.com/docs/extensions/develop/concepts/messaging#simple
 * To use sendResponse() asynchronously, return true in the onMessage event handler.
 */
export interface MessageHandler<TMessage extends Message> {
    processMessage: (
        message: TMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: ResponseMessage) => void
    ) => boolean;
    [key: string]: Function;
}

/**
 * Types for Local Storage Interaction
 */

type SerializableValue =
    | undefined
    | string
    | number
    | boolean
    | SerializableObject
    | SerializableArray;
type SerializableObject = { [key: string]: SerializableValue };
type SerializableArray = SerializableValue[];

export interface Settings extends SerializableObject {
    devMode: boolean;
}

export interface SelectorResult {
    searchAPI: 'querySelector' | 'getElementById' | 'getElementsByText';
    selector: string;
}

export interface ScriptStep {
    element?: SelectorResult;
    command?: string;
}

export interface Script {
    name: string;
    steps: ScriptStep[];
}

export interface ILocalStorage {
    isCreating: boolean;
    userScripts: Script[];
    devMode: boolean;
}

export type LocalStorageKeys = keyof ILocalStorage;

/**
 * Types for Logging
 */

export type Severity = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface ILog extends SerializableObject {
    methodName: string;
    severity: Severity;
    message: string;
}
