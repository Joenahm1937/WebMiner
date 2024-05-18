import { UNIQUE_SELECTORS } from '../constants';
import { DOMSelectors, DOMSelector } from '../interfaces';

const removeUniqueSelectors = (prevSelected: DOMSelectors) => {
    UNIQUE_SELECTORS.forEach((uniqueSelector) => {
        delete prevSelected[uniqueSelector as DOMSelector];
    });
};

export const updateClassNameSelector = (
    _: string,
    value: string,
    prevSelected: DOMSelectors
): DOMSelectors => {
    const copy = { ...prevSelected };
    removeUniqueSelectors(copy);
    const prevClassNames = prevSelected.classNames || [];
    let classNames: string[];
    if (prevClassNames.includes(value)) {
        classNames = prevClassNames.filter((className) => className !== value);
    } else {
        classNames = [...prevClassNames, value];
    }
    return {
        ...copy,
        classNames,
    };
};

export const updateAttributeSelector = (
    selector: string,
    value: string,
    prevSelected: DOMSelectors
): DOMSelectors => {
    const copy = { ...prevSelected };
    removeUniqueSelectors(copy);
    const prevAttributes = prevSelected.attributes || {};
    if (selector in prevAttributes) {
        delete prevAttributes[selector];
    } else {
        prevAttributes[selector] = value;
    }
    return {
        ...copy,
        attributes: prevAttributes,
    };
};

export const updateUniqueSelector = (
    selector: string,
    value: string,
    prevSelected: DOMSelectors
): DOMSelectors => {
    const copy = { ...prevSelected };
    if (selector in prevSelected) {
        removeUniqueSelectors(copy);
        return copy;
    } else {
        return { [selector]: value };
    }
};

export const updateGenericSelector = (
    selector: string,
    value: string,
    prevSelected: DOMSelectors
): DOMSelectors => {
    const copy = { ...prevSelected };
    removeUniqueSelectors(copy);

    if (selector in copy) {
        delete copy[selector as DOMSelector];
        return copy;
    } else {
        return {
            ...copy,
            [selector]: value,
        };
    }
};
