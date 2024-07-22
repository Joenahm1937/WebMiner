import type { ContentScriptMessage, ScriptStep } from '../interfaces';
import { DOMSearcher } from './DomSearcher';

class ScriptEngineClass {
    private static instance: ScriptEngineClass;
    private step: ScriptStep | undefined;

    public static getInstance(): ScriptEngineClass {
        if (!ScriptEngineClass.instance) {
            ScriptEngineClass.instance = new ScriptEngineClass();
        }
        return ScriptEngineClass.instance;
    }

    public async executeStep(step: ScriptStep) {
        this.step = step;
        if (!this.step) {
            console.error('No step set for execution');
            return;
        }

        if (!this.step.command) {
            console.error('No command set for execution');
            return;
        }

        switch (this.step.command.commandType) {
            case 'Input Text':
                await this.inputText(this.step.command.text);
                break;
            case 'Click':
                await this.clickElement();
                break;
            case 'Open Link':
                await this.openLinks(this.step.command.scriptName);
                break;
            default:
                throw Error(`Unknown command: ${this.step.command}`);
        }
    }

    private async inputText(text: string) {
        const elements = await this.findElement();
        if (elements) {
            elements.forEach((element) => {
                const inputElement = element as HTMLInputElement;
                inputElement.value = text;
                inputElement.dispatchEvent(
                    new Event('input', { bubbles: true })
                );
                inputElement.dispatchEvent(
                    new Event('change', { bubbles: true })
                );
                console.log(`Input Text into element: ${element}`);
            });
        } else {
            throw Error('Element not found for Input Text command');
        }
    }

    private async clickElement() {
        const elements = await this.findElement();
        if (elements) {
            elements.forEach((element) => {
                (element as HTMLElement).click();
                console.log(`Clicked on element: ${element}`);
            });
        } else {
            throw Error('Element not found for Click command');
        }
    }

    private async openLinks(scriptName?: string) {
        const elements = await this.findElement();
        const links = elements?.filter(
            (element) => 'href' in element
        ) as HTMLLinkElement[];
        if (links && links.length > 0) {
            // TODO: maxTabs and closeOnDone should be chosen by the user in a settings UI (hardcoded with defaults for now)
            const message: ContentScriptMessage = {
                source: 'ContentScript',
                signal: 'OPEN_LINKS_IN_TAB',
                linkUrls: links.map((link) => link.href),
                maxTabs: 5,
                closeOnDone: false,
                scriptName,
            };
            chrome.runtime.sendMessage(message);
        } else {
            throw Error('No Valid Links to Open');
        }
    }

    private async findElement(): Promise<HTMLElement[] | null> {
        if (!this.step || !this.step.element) return null;
        const matches = await DOMSearcher.getMatches(this.step.element);
        if (!matches.length) throw new Error('Failed to find Element');
        return matches;
    }
}

export const ScriptEngine = ScriptEngineClass.getInstance();
