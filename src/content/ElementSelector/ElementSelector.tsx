import { createDOMMetadata, getElementSelectors } from './utils';
import { useScriptContext } from '../ScriptContext';
import { isModalElement, updateElementStyles } from '../utils';
import SelectorTable from './SelectorTable';
import { useCallback, useEffect, useState } from 'react';
import { DOMSelectors } from '../interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSyncAlt,
    faCheckCircle,
    faLeftLong,
} from '@fortawesome/free-solid-svg-icons';
import './ElementSelector.css';
import { DOMSearcher } from '../DomSearcher';
import ElementMetadata from './ElementMetadata';

const ElementPicker = () => {
    const { updateStepElement, elementPickingStep, setElementPickingStep } =
        useScriptContext();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isPicking, setIsPicking] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testMatches, setTestMatches] = useState<HTMLElement[]>([]);
    const [highlightedElement, setHighlightedElement] = useState<
        DOMSelectors | undefined
    >();
    const [selected, setSelected] = useState<DOMSelectors>({});
    const metadata = createDOMMetadata(selected);

    const goBack = () => {
        setElementPickingStep(undefined);
    };

    const handleMouseOver = useCallback((event: Event) => {
        const element = event.target as HTMLElement;
        if (isModalElement(element)) return;
        updateElementStyles(element, true);
        setHighlightedElement(getElementSelectors(element));
    }, []);

    const handleMouseOut = useCallback((event: Event) => {
        const element = event.target as HTMLElement;
        if (isModalElement(element)) return;
        updateElementStyles(element, false);
    }, []);

    const disableClicks = useCallback((event: Event) => {
        const element = event.target as HTMLElement;
        if (isModalElement(element)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
    }, []);

    const handlePointerUp = useCallback((event: Event) => {
        const element = event.target as HTMLElement;
        if (isModalElement(element)) return;
        element.style.outline = '';
        exitPickingState();
    }, []);

    const enterPickingState = () => {
        document.body.style.cursor = `url('http://wiki-devel.sugarlabs.org/images/e/e2/Arrow.cur'), auto`;
        /**
         * Disabling Clicks while Picking Element
         * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#usecapture
         * Events will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree
         */
        document.addEventListener('click', disableClicks, true);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        // Using PointerUp event because click events do not trigger on disabled elements (e.g. disabled input)
        document.addEventListener('pointerup', handlePointerUp);
        setIsPicking(true);
    };

    const exitPickingState = () => {
        document.body.style.cursor = 'auto';
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('pointerup', handlePointerUp);
        setIsPicking(false);
    };

    const confirmPickedElement = () => {
        document.removeEventListener('click', disableClicks, true);
        // Casting to Number because the only way we can see this view is if elementPickingStep is defined
        updateStepElement(elementPickingStep as number, metadata);
        setElementPickingStep(undefined);
    };

    const startTester = async () => {
        setIsTesting(true);
        const elements = await DOMSearcher.getMatches(metadata);
        setTestMatches(elements);
        if (elements.length) {
            setSuccessMessage(`${elements.length} matches`);
        } else {
            setErrorMessage(`No matches`);
        }
        cleanMessages(2000);
    };

    const stopTester = async () => {
        setIsTesting(false);
        setTestMatches([]);
    };

    const cleanMessages = (delayMs: number) => {
        setTimeout(() => setSuccessMessage(null), delayMs);
        setTimeout(() => setErrorMessage(null), delayMs);
    };

    const copySelectorToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(metadata));
            setSuccessMessage('Copied to Clipboard');
        } catch (error) {
            setErrorMessage('Failed to Copy');
        }
        cleanMessages(2000);
    };

    useEffect(() => {
        testMatches.forEach((element) => {
            updateElementStyles(element, true);
        });

        return () => {
            testMatches.forEach((element) => {
                updateElementStyles(element, false);
            });
        };
    }, [testMatches]);

    useEffect(() => {
        enterPickingState();
        return () => {
            document.removeEventListener('click', disableClicks, true);
            exitPickingState();
        };
    }, []);

    const hasValidSelector = metadata.selectors.length;

    return (
        <div className="element-selector">
            <div className="overlay-controls">
                <button className="back-button web-miner-icon" onClick={goBack}>
                    <FontAwesomeIcon icon={faLeftLong} className="fa-lg " />
                </button>
                {hasValidSelector ? (
                    <button onClick={copySelectorToClipboard}>
                        Copy Selector
                    </button>
                ) : null}
                {hasValidSelector && !isTesting ? (
                    <button onClick={startTester}>Test Selector</button>
                ) : null}
                {isTesting ? (
                    <button onClick={stopTester}>Stop Testing</button>
                ) : null}
                {!isPicking ? (
                    <button
                        className="retry-button web-miner-icon"
                        onClick={enterPickingState}
                    >
                        <FontAwesomeIcon icon={faSyncAlt} className="fa-lg " />
                    </button>
                ) : null}
                {hasValidSelector ? (
                    <button
                        className="confirm-button web-miner-icon"
                        onClick={confirmPickedElement}
                    >
                        <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="fa-lg "
                        />
                    </button>
                ) : null}
                {errorMessage && (
                    <div className="error-banner">{errorMessage}</div>
                )}
                {successMessage && (
                    <div className="success-banner">{successMessage}</div>
                )}
            </div>

            <div className="selector-content">
                {!isPicking && (
                    <div className="selector">
                        {hasValidSelector ? (
                            <ElementMetadata metadata={metadata} />
                        ) : (
                            <p>Please choose from the given selectors:</p>
                        )}
                    </div>
                )}
                {highlightedElement && (
                    <SelectorTable
                        isPicking={isPicking}
                        selectors={highlightedElement}
                        selected={selected}
                        setSelected={setSelected}
                    />
                )}
            </div>
        </div>
    );
};

export default ElementPicker;
