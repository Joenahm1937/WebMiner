import { createCSSSelector, getElementIdentifiers } from './utils';
import { useScriptContext } from '../ScriptContext';
import { HIGHLIGHT_STYLE } from '../constants';
import { isModalElement, updateElementOutline } from '../utils';
import SelectorTable from './SelectorTable';
import { useCallback, useEffect, useState } from 'react';
import { ElementIdentifier } from '../interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './ElementSelector.css';

const ElementPicker = () => {
    const { updateStepElement, elementPickingStep, setElementPickingStep } =
        useScriptContext();

    const [isPicking, setIsPicking] = useState(false);
    const [highlightedElement, setHighlightedElement] = useState<
        ElementIdentifier | undefined
    >();
    const [selectedIdentifiers, setSelectedIdentifiers] =
        useState<ElementIdentifier>({});

    const selector = createCSSSelector(selectedIdentifiers);

    const handleMouseOver = useCallback((event: Event) => {
        const element = event.target as HTMLElement;
        if (isModalElement(element)) return;
        updateElementOutline(element, HIGHLIGHT_STYLE);
        setHighlightedElement(getElementIdentifiers(element));
    }, []);

    const handleMouseOut = useCallback((event: Event) => {
        const element = event.target as HTMLElement;
        if (isModalElement(element)) return;
        updateElementOutline(element, '');
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
        updateStepElement(elementPickingStep as number, selector);
        setElementPickingStep(undefined);
    };

    useEffect(() => {
        enterPickingState();
        return () => {
            document.removeEventListener('click', disableClicks, true);
            exitPickingState();
        };
    }, []);

    return (
        <div className="element-selector">
            <div className="overlay-controls">
                {!isPicking && (
                    <button
                        className="retry-button"
                        onClick={enterPickingState}
                    >
                        <FontAwesomeIcon icon={faSyncAlt} className="fa-lg" />
                    </button>
                )}
                {!isPicking && selector.selector.length ? (
                    <button
                        className="confirm-button"
                        onClick={confirmPickedElement}
                    >
                        <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="fa-lg"
                        />
                    </button>
                ) : null}
            </div>

            <div className="selector-content">
                {!isPicking && (
                    <div className="selector">
                        {selector.selector.length
                            ? `Your Selector: ${selector.selector}`
                            : 'Please choose from the given identifiers:'}
                    </div>
                )}
                {highlightedElement && (
                    <SelectorTable
                        isPicking={isPicking}
                        identifier={highlightedElement}
                        selectedIdentifiers={selectedIdentifiers}
                        setSelectedIdentifiers={setSelectedIdentifiers}
                    />
                )}
            </div>
        </div>
    );
};

export default ElementPicker;
