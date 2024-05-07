import { WorkerSignal, ContentScriptSignal, PopupSignal } from './constants';

type WorkerSignals = keyof typeof WorkerSignal;
type PopupSignals = keyof typeof PopupSignal;
type ContentScriptSignals = keyof typeof ContentScriptSignal;

/**
 * Types for Messaging between the background script, the popup UI, and the content scripts.
 */

export type Message = WorkerMessage | PopupMessage | ContentScriptMessage;

// Worker-originated messages
interface BaseWorkerMessage {
    source: 'Worker';
    signal: (typeof WorkerSignal)[WorkerSignals];
}

interface RefreshPopupMessage extends BaseWorkerMessage {
    signal: 'REFRESH_POPUP';
}
interface CreateModalMessage extends BaseWorkerMessage {
    signal: 'CREATE_MODAL';
    script?: Script;
}
interface RemoveModalMessage extends BaseWorkerMessage {
    signal: 'REMOVE_MODAL';
}
interface CheckModalMessage extends BaseWorkerMessage {
    signal: 'CHECK_MODAL_STATUS';
}

export type WorkerMessage =
    | RefreshPopupMessage
    | CreateModalMessage
    | RemoveModalMessage
    | CheckModalMessage;

// Popup-originated messages
interface BasePopupMessage {
    source: 'Popup';
    signal: (typeof PopupSignal)[PopupSignals];
}
interface LaunchSessionMessage extends BasePopupMessage {
    signal: 'LAUNCH_SESSION';
    scriptName?: string;
}
interface CleanSessionMessage extends BasePopupMessage {
    signal: 'CLEAN_SESSION';
}

export type PopupMessage = LaunchSessionMessage | CleanSessionMessage;

// Content script-originated messages
interface BaseContentScriptMessage {
    source: 'ContentScript';
    signal: (typeof ContentScriptSignal)[ContentScriptSignals];
}
interface SaveScriptMessage extends BaseContentScriptMessage {
    signal: 'SAVE_SCRIPT';
    script: Script;
}

export type ContentScriptMessage = SaveScriptMessage;

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
    editing: boolean;
    userScripts: Record<string, Script>;
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
