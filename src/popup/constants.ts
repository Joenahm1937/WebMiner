export const EXTENSION_HEADER = 'Web Miner';

export const RESET_BUTTON_TEXT = 'DELETE SCRIPTS';

export const MODAL_STATES = {
    LOCATING_MODAL: 'PENDING',
    OPEN_MODAL: 'ACTIVE',
    NO_MODAL: 'NONE',
};

export type ModalState = keyof typeof MODAL_STATES;
