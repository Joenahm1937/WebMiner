import {
    WORKER_SIGNAL,
    CONTENT_SCRIPT_SIGNAL,
    POPUP_SIGNAL,
} from './constants';

/**
 * Types for Messaging between the background script, the popup UI, and the content scripts.
 */

export type Message = WorkerMessage | PopupMessage | ContentScriptMessage;

// Worker-originated messages
type BaseWorkerMessage = {
    source: 'Worker';
    signal: Exclude<
        (typeof WORKER_SIGNAL)[keyof typeof WORKER_SIGNAL],
        'send_context'
    >;
};
export type WorkerScriptContextMessage = {
    source: 'Worker';
    signal: 'send_context';
    scriptContext: IScriptContextData;
};
export type WorkerMessage = BaseWorkerMessage | WorkerScriptContextMessage;

// Popup-originated messages
type BasePopupMessage = {
    source: 'Popup';
    signal: Exclude<
        (typeof POPUP_SIGNAL)[keyof typeof POPUP_SIGNAL],
        'update_settings'
    >;
};
export type PopupSettingsUpdateMessage = {
    source: 'Popup';
    signal: 'update_settings';
    payload: ISettings;
};
export type PopupMessage = BasePopupMessage | PopupSettingsUpdateMessage;

// Content script-originated messages
export type ContentScriptMessage = {
    source: 'ContentScript';
    signal: (typeof CONTENT_SCRIPT_SIGNAL)[keyof typeof CONTENT_SCRIPT_SIGNAL];
    tabData: ITabData;
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

export interface ISettings extends SerializableObject {
    devMode: boolean;
    maxTabs: number;
}

export interface IScriptContextData extends SerializableObject {
    suggester?: string;
    enableStackTrace: boolean;
}

export interface IProfile extends SerializableObject {
    suggester?: string;
    url: string;
}

export interface ITabData extends SerializableObject {
    url: string;
    user: string;
    fatalErrors: ILog[];
    profileImageUrl?: string;
    bioLinkUrls?: string[];
    followerCount?: string;
    suggestedProfiles?: IProfile[];
    suggester?: string;
    logs?: ILog[];
}

export interface ILocalStorage {
    isRunning: boolean;
    tabs: ITabData[];
    devMode: boolean;
    maxTabs: number;
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
