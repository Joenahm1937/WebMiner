import type { ILog, SelectorResult } from '../interfaces';

const DEFAULT_FINDING_TIMEOUT = 3000;

/**
 * Provides utility functions for DOM manipulations and interactions, with built-in error handling.
 */
export class DOMSearcherClass {
    private static instance: DOMSearcherClass;

    public static getInstance(): DOMSearcherClass {
        if (!DOMSearcherClass.instance) {
            DOMSearcherClass.instance = new DOMSearcherClass();
        }
        return DOMSearcherClass.instance;
    }

    public async getMatches(selection: SelectorResult): Promise<HTMLElement[]> {
        switch (selection.searchAPI) {
            case 'querySelector':
                const elements = this.findAllNodesByQuerySelector(
                    selection.selector
                );
                return elements;
            default:
                return [];
        }
    }

    private findAllNodesByQuerySelector<T extends HTMLElement>(
        queryString: string,
        node: Document | HTMLElement = document,
        timeoutMs: number = DEFAULT_FINDING_TIMEOUT
    ): Promise<T[]> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elements = node.querySelectorAll(queryString);
                if (elements.length !== 0) {
                    clearInterval(interval);
                    this.log({
                        methodName: this.findAllNodesByQuerySelector.name,
                        severity: 'DEBUG',
                        message: `Found nodes with queryString ${queryString}`,
                        elements,
                    });
                    resolve(Array.from(elements) as T[]);
                } else if (Date.now() - startTime > timeoutMs) {
                    clearInterval(interval);
                    this.log({
                        methodName: this.findAllNodesByQuerySelector.name,
                        severity: 'WARN',
                        message: `Failed to nodes with queryString ${queryString}`,
                    });
                    resolve([]);
                }
            }, 100);
        });
    }

    private log(logEntry: ILog): void {
        console.log(logEntry);
    }
}

export const DOMSearcher = DOMSearcherClass.getInstance();
