import './Modal.css';
import { useCallback, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

const MODAL_ID = 'web-miner-modal';
/**
 * The CSS for highlighting elements on hover
 */
const HIGHLIGHT_STYLE = '3px solid red';

const updateElementOutline = (element: HTMLElement, style: string) => {
    element.style.outline = style;
};

const getDetailedAttributes = (element: HTMLElement): string => {
    let attributes: Record<string, string> = {};
    Array.from(element.attributes).forEach((attr) => {
        attributes[attr.name] = attr.value;
    });
    return JSON.stringify(attributes);
};

const isModalElement = (element: HTMLElement) => {
    const modal = document.getElementById(MODAL_ID) as HTMLElement;
    return modal.contains(element);
};

const Modal = () => {
    const [isPicking, setIsPicking] = useState(false);
    const [highlightedNode, setHighlightedNode] = useState('');
    const [selectedNode, setSelectedNode] = useState('');
    const [clicksDisabled, setClicksDisabled] = useState(false);

    const handleMouseOver = useCallback((event: Event) => {
        const element = event.target as HTMLElement;
        if (isModalElement(element)) return;
        updateElementOutline(element, HIGHLIGHT_STYLE);
        setHighlightedNode(getDetailedAttributes(element));
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
        setSelectedNode(getDetailedAttributes(element));
        exitPickingState();
    }, []);

    const enterPickingState = () => {
        setSelectedNode('');
        document.body.style.cursor = `url('http://wiki-devel.sugarlabs.org/images/e/e2/Arrow.cur'), auto`;
        /**
         * Disabling Clicks while Picking Node
         * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#usecapture
         * Events will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree
         */
        document.addEventListener('click', disableClicks, true);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        // Using PointerUp event because click events do not trigger on disabled elements (e.g. disabled input)
        document.addEventListener('pointerup', handlePointerUp);
        setClicksDisabled(true);
        setIsPicking(true);
    };

    const exitPickingState = () => {
        document.body.style.cursor = 'auto';
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('pointerup', handlePointerUp);
        setIsPicking(false);
        setHighlightedNode('');
    };

    const enableClicks = () => {
        document.removeEventListener('click', disableClicks, true);
        setClicksDisabled(false);
    };

    useEffect(() => {
        return () => {
            enableClicks();
            exitPickingState();
        };
    }, []);

    const togglePickingState = () => {
        if (!isPicking) {
            enterPickingState();
        } else {
            enableClicks();
            exitPickingState();
        }
    };

    return (
        <Draggable>
            <div id={MODAL_ID}>
                <button onClick={togglePickingState}>
                    {isPicking ? 'Stop Picking Nodes' : 'Pick Nodes'}
                </button>
                {clicksDisabled && !isPicking && (
                    <button onClick={enableClicks}>Confirm</button>
                )}
                {highlightedNode && <p>Highlighted Node: {highlightedNode}</p>}
                {selectedNode && (
                    <div>
                        <h2>Selected Node:</h2>
                        <p>{selectedNode}</p>
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default Modal;
