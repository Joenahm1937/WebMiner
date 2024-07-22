import type { ILog, DOMMetadata } from '../interfaces';

const SEARCH_TIMEOUT = 5000;

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

    public async getMatches(metadata: DOMMetadata): Promise<HTMLElement[]> {
        const allResults = await Promise.all(
            metadata.selectors.map((selector) => {
                switch (selector.searchAPI) {
                    case 'querySelector':
                        return this.findNodesByQuerySelector(
                            selector.queryString
                        );
                    case 'getElementsByText':
                        return this.findNodesByTextContent(
                            selector.queryString
                        );
                    // case 'getElementById':
                    //     return this.findNodeById(selector.queryString);
                    default:
                        return Promise.resolve([]);
                }
            })
        );

        if (allResults.length === 0) return [];

        // Find common elements across all selector results
        const commonResults = allResults.reduce((common, current) => {
            return common.filter((commonElement) =>
                current.includes(commonElement)
            );
        });

        return commonResults;
    }

    private findNodesByQuerySelector(
        queryString: string,
        node: Document | HTMLElement = document
    ): Promise<HTMLElement[]> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elements = node.querySelectorAll(queryString);
                const htmlElements = Array.from(elements).filter(
                    (element) => element instanceof HTMLElement
                ) as HTMLElement[];
                if (htmlElements.length !== 0) {
                    clearInterval(interval);
                    this.log({
                        methodName: this.findNodesByQuerySelector.name,
                        severity: 'DEBUG',
                        message: `Found nodes with queryString ${queryString}`,
                        htmlElements,
                    });
                    resolve(htmlElements);
                } else if (Date.now() - startTime > SEARCH_TIMEOUT) {
                    clearInterval(interval);
                    this.log({
                        methodName: this.findNodesByQuerySelector.name,
                        severity: 'WARN',
                        message: `Failed to nodes with queryString ${queryString}`,
                    });
                    resolve([]);
                }
            }, 100);
        });
    }

    findNodesByTextContent(
        textContent: string,
        node: Document | HTMLElement = document,
        preFilteredList: HTMLElement[] = []
    ): Promise<HTMLElement[]> {
        return new Promise((resolve) => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const elements =
                    preFilteredList.length > 0
                        ? preFilteredList
                        : node.getElementsByTagName('*');
                const htmlElements = Array.from(elements).filter(
                    (element) => element instanceof HTMLElement
                ) as HTMLElement[];
                const filteredElements = htmlElements.filter(
                    (element) => element.textContent === textContent
                );
                if (filteredElements.length > 0) {
                    clearInterval(interval);
                    this.log({
                        methodName: this.findNodesByTextContent.name,
                        severity: 'DEBUG',
                        message: `Found node with text ${textContent}`,
                        filteredElements,
                    });
                    resolve(filteredElements);
                    return;
                } else if (Date.now() - startTime > SEARCH_TIMEOUT) {
                    clearInterval(interval);
                    this.log({
                        methodName: this.findNodesByTextContent.name,
                        severity: 'WARN',
                        message: `Failed to find node with text ${textContent}`,
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
