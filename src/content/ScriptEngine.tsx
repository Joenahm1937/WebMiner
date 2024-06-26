import type { ScriptStep } from '../interfaces';
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

        switch (this.step.command) {
            case 'Input Text':
                await this.inputText();
                break;
            case 'Click':
                await this.clickElement();
                break;
            default:
                console.error(`Unknown command: ${this.step.command}`);
        }
    }

    private async inputText() {
        const elements = await this.findElement();
        if (elements) {
            elements.forEach((element) => {
                (element as HTMLInputElement).value = 'Sample Text';
                console.log(`Input Text into element: ${element}`);
            });
        } else {
            console.error('Element not found for Input Text command');
        }
    }

    /**
     * If type submit or contains href, open in new tab instead so we can control using content script
     */
    private async clickElement() {
        const elements = await this.findElement();
        if (elements) {
            elements.forEach((element) => {
                (element as HTMLElement).click();
                console.log(`Clicked on element: ${element}`);
            });
        } else {
            console.error('Element not found for Click command');
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

// Example usage:
// const step1 = '{"command":"Input Text","element":{"selectors":[{"searchAPI":"querySelector","queryString":"textarea[title=\\"Search\\"]"}]},"selectors":{"tagName":"textarea","classNames":[],"attributes":{"title":"Search"}}}';
// const step2 = '{"element":{"selectors":[{"searchAPI":"querySelector","queryString":"input[value=\\"Google Search\\"][role=\\"button\\"][type=\\"submit\\"]"}]},"command":"Click","selectors":{"tagName":"input","attributes":{"value":"Google Search","role":"button","type":"submit"}}}';

// ScriptEngine.setStep(step1);
// ScriptEngine.executeStep();

// ScriptEngine.setStep(step2);
// ScriptEngine.executeStep();
