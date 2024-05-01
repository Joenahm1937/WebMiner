import { useScriptContext } from '../ScriptContext';
import { HIGHLIGHT_STYLE } from '../constants';
import {
    isModalElement,
    updateElementOutline,
    getDetailedAttributes,
} from '../utils';
import './Modal.css';
import { useCallback, useEffect, useState } from 'react';

const ElementPicker = () => {
    const { updateStepElement, elementPickingStep, setElementPickingStep } =
        useScriptContext();

    const [isPicking, setIsPicking] = useState(false);
    const [highlightedElement, setHighlightedElement] = useState('');
    const [selectedElement, setSelectedElement] = useState('');

    const handleMouseOver = useCallback((event: Event) => {
        const element = event.target as HTMLElement;
        if (isModalElement(element)) return;
        updateElementOutline(element, HIGHLIGHT_STYLE);
        setHighlightedElement(getDetailedAttributes(element));
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
        setSelectedElement(getDetailedAttributes(element));
        exitPickingState();
    }, []);

    const enterPickingState = () => {
        setSelectedElement('');
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
        setHighlightedElement('');
    };

    const confirmPickedElement = () => {
        document.removeEventListener('click', disableClicks, true);
        // Casting to Number because the only way we can see this view is if elementPickingStep is defined
        updateStepElement(elementPickingStep as number, selectedElement);
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
        <div>
            {!isPicking && <button onClick={enterPickingState}>Retry</button>}
            {!isPicking && (
                <button onClick={confirmPickedElement}>Confirm</button>
            )}
            {highlightedElement && (
                <p>Highlighted Element: {highlightedElement}</p>
            )}
            {selectedElement && (
                <div>
                    <h2>Selected Element:</h2>
                    <p>{selectedElement}</p>
                </div>
            )}
        </div>
    );
};

export default ElementPicker;
