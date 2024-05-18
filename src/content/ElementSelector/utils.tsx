import { finder } from '@medv/finder';
import { TEXT_LIMIT } from '../constants';
import { DOMSelectors } from '../interfaces';
import { DOMMetadata, Selector } from '../../interfaces';

export const getElementSelectors = (element: HTMLElement): DOMSelectors => {
    const identifier: DOMSelectors = {
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
    identifier.textContent =
        element.textContent && element.textContent?.length > 0
            ? element.textContent?.trim()?.slice(0, 30)
            : undefined;
    identifier.uniqueSelector = finder(element);

    return identifier;
};

export const createDOMMetadata = (identifier: DOMSelectors): DOMMetadata => {
    if (identifier.id) {
        return {
            selectors: [
                {
                    searchAPI: 'getElementById',
                    queryString: identifier.id,
                },
            ],
        };
    }

    if (identifier.uniqueSelector) {
        return {
            selectors: [
                {
                    searchAPI: 'querySelector',
                    queryString: identifier.uniqueSelector,
                },
            ],
        };
    }

    /**
     * Non-Unique Selectors that can be combined
     */

    let selectorParts: string[] = [];

    // Add Tag name
    if (identifier.tagName) {
        selectorParts.push(identifier.tagName);
    }

    // Add class names
    if (identifier.classNames && identifier.classNames.length > 0) {
        selectorParts.push(`.${identifier.classNames.join('.')}`);
    }

    const attributeMapping = {
        href: identifier.href,
        src: identifier.src,
        role: identifier.role,
        alt: identifier.alt, // Handle alt attribute for images
        value: identifier.value, // Handle value attribute for input elements
        title: identifier.title,
        'aria-label': identifier.ariaLabel,
        'aria-roledescription': identifier.ariaRoleDescription,
        'aria-valuetext': identifier.ariaValueText,
    };

    for (const [attr, value] of Object.entries(attributeMapping)) {
        if (value) {
            selectorParts.push(`[${attr}="${value}"]`);
        }
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

    const selectors: Selector[] = [];

    if (identifier.textContent) {
        selectors.push({
            searchAPI: 'getElementsByText',
            queryString: identifier.textContent,
        });
    }

    if (selectorParts.length > 0) {
        selectors.push({
            searchAPI: 'querySelector',
            queryString: selectorParts.join(''),
        });
    }
    return {
        selectors,
    };
};

export const trimString = (input: string): string => {
    if (input.length > TEXT_LIMIT) {
        return input.substring(0, TEXT_LIMIT) + '...';
    }
    return input;
};
