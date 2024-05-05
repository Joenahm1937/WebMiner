import { finder } from '@medv/finder';
import { TEXT_LIMIT } from '../constants';
import { ElementIdentifier, SelectorResult } from '../interfaces';

export const getElementIdentifiers = (
    element: HTMLElement
): ElementIdentifier => {
    const identifier: ElementIdentifier = {
        tagName: element.tagName.toLowerCase(),
    };

    // ID
    if (element.id) {
        identifier.id = element.id;
    }

    // Class
    if (element.classList.length > 0) {
        identifier.classNames = Array.from(element.classList);
    }

    // Attributes
    const attributes: Record<string, string> = {};
    const elementAttributes = element.attributes;
    for (let i = 0; i < elementAttributes.length; i++) {
        const attr = elementAttributes.item(i);
        if (attr) {
            attributes[attr.name] = attr.value;
        }
    }
    if (Object.keys(attributes).length > 0) {
        identifier.attributes = attributes;
        delete identifier.attributes['id'];
        delete identifier.attributes['class'];
    }

    // Other identifiers (if needed)
    identifier.href = (element as HTMLAnchorElement).href;
    identifier.src = (element as HTMLImageElement).src;
    identifier.value = (element as HTMLInputElement).value;
    identifier.ariaLabel = element.getAttribute('aria-label') || undefined;
    identifier.role = element.getAttribute('role') || undefined;
    identifier.title = element.getAttribute('title') || undefined;
    identifier.alt = (element as HTMLImageElement).alt;
    identifier.ariaRoleDescription =
        element.getAttribute('aria-roledescription') || undefined;
    identifier.ariaValueText =
        element.getAttribute('aria-valuetext') || undefined;
    identifier.textContent = element.textContent?.trim()?.slice(0, 30);
    identifier.uniqueSelector = finder(element);

    return identifier;
};

export const createCSSSelector = (
    identifier: ElementIdentifier
): SelectorResult => {
    if (identifier.id) {
        return {
            searchAPI: 'getElementById',
            selector: identifier.id,
        };
    }

    if (identifier.uniqueSelector) {
        return {
            searchAPI: 'querySelector',
            selector: identifier.uniqueSelector,
        };
    }

    if (identifier.textContent) {
        return {
            searchAPI: 'getElementsByText',
            selector: identifier.textContent,
        };
    }

    let selectorParts: string[] = [];

    // Add Tag name
    if (identifier.tagName) {
        selectorParts.push(identifier.tagName);
    }

    // Add class names
    if (identifier.classNames && identifier.classNames.length > 0) {
        selectorParts.push(`.${identifier.classNames.join('.')}`);
    }

    // Handle special attributes and add general attributes
    if (identifier.attributes) {
        for (const [key, value] of Object.entries(identifier.attributes)) {
            if (key !== 'id' && key !== 'class') {
                // Already handled ID and classes
                selectorParts.push(`[${key}="${value}"]`);
            }
        }
    }

    if (identifier.href) {
        selectorParts.push(`[href="${identifier.href}"]`);
    }

    if (identifier.src) {
        selectorParts.push(`[src="${identifier.src}"]`);
    }

    if (identifier.ariaLabel) {
        selectorParts.push(`[aria-label="${identifier.ariaLabel}"]`);
    }

    if (identifier.role) {
        selectorParts.push(`[role="${identifier.role}"]`);
    }

    // Construct and return the selector object
    return {
        searchAPI: 'querySelector',
        selector: selectorParts.join(' '),
    };
};

export const trimString = (input: string): string => {
    if (input.length > TEXT_LIMIT) {
        return input.substring(0, TEXT_LIMIT) + '...';
    }
    return input;
};
