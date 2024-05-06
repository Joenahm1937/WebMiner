declare global {
    interface Window {
        myModalElement?: HTMLElement;
    }
}

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
