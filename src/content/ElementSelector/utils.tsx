import { finder } from '@medv/finder';
import { TEXT_LIMIT } from '../constants';

/**
 * TODO:
 * 1. Support text content identifier
 * 1. Support choosing all elements in a list
 */

export interface ElementIdentifier {
    // ID: The id attribute is intended to be unique within a page and is often used to point directly to a specific element.
    id?: string;

    // Class Names: Although classes are less specific than IDs, a unique combination of class names can effectively identify an element, especially in the absence of an ID.
    classNames?: string[];

    // Attributes: Other attributes like data-* attributes are often used to store custom data and can be unique to elements, especially in modern web applications.
    attributes?: Record<string, string>;

    // Role, Aria-label, Aria-roledescription, Aria-valuemax, Aria-valuemin, Aria-valuenow: ARIA attributes provide context about the function of an element, particularly for accessibility tools, and can be quite specific.
    role?: string;
    ariaLabel?: string;
    ariaRoleDescription?: string;
    ariaValueText?: string;

    // Href, Src: These attributes point to resources linked to or included in an element (like links or images). They can be specific but can also change based on the environment or session.
    href?: string;
    src?: string;

    // Text Content: Using text content can be specific, but it's prone to change and can be unreliable if the site content updates frequently.
    textContent?: string;

    // Tag Name: This is the least specific identifier since many elements can share the same tag name.
    tagName?: string;

    // Additional identifiers
    value?: string;
    label?: string;
    title?: string;
    alt?: string;

    // Unique Selector (CSS-like) https://github.com/antonmedv/finder (.block:nth-child(3) li:nth-child(2) > .icon-eye-open)
    // This method combines different attributes (like class, tag, nth-child) to form a selector, providing a useful fallback when no single attribute is sufficiently unique.
    // This may not be the most robust option if the page is susceptile to frequent change
    uniqueSelector?: string;
}

export type ElementIdentifierTypes = keyof ElementIdentifier;
export type PrimitiveIdentifierTypes = Exclude<
    ElementIdentifierTypes,
    'attributes' | 'classNames'
>;

export interface SelectorResult {
    searchAPI: 'querySelector' | 'getElementById' | 'getElementsByText';
    selector: string;
}

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
