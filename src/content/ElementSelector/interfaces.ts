import { DOMSelectors } from '../interfaces';

export interface SelectorTableProps {
    isPicking: boolean;
    selectors: DOMSelectors;
    selected: DOMSelectors;
    setSelected: React.Dispatch<React.SetStateAction<DOMSelectors>>;
}

export interface SelectorProps {
    selectorName: string;
    selectorValue: string;
    isPicking: boolean;
    selected: DOMSelectors;
    selectorType: string;
    updateSelected: (
        selector: string,
        value: string,
        selectorType: string
    ) => void;
}
