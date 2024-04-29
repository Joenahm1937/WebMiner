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
    const [selectedNode, setSelectedNode] = useState<string>();

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

    const handleNodeSelect = useCallback((event: Event) => {
        const element = event.target as HTMLElement;
        if (isModalElement(element)) return;

        element.removeAttribute('onclick');
        event.preventDefault();

        setSelectedNode(getDetailedAttributes(element));
        exitPickingState();
        element.style.outline = '';
    }, []);

    const enterPickingState = () => {
        document.querySelectorAll('*').forEach((element) => {
            document.body.style.cursor = `url('http://wiki-devel.sugarlabs.org/images/e/e2/Arrow.cur'), auto`;
            element.addEventListener('mouseover', handleMouseOver);
            element.addEventListener('mouseout', handleMouseOut);
            /**
             * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#usecapture
             * Events will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree
             */
            element.addEventListener('click', handleNodeSelect, true);
        });
        setIsPicking(true);
    };

    const exitPickingState = () => {
        document.body.style.cursor = 'auto';
        document.querySelectorAll('*').forEach((element) => {
            element.removeEventListener('mouseover', handleMouseOver);
            element.removeEventListener('mouseout', handleMouseOut);
            element.removeEventListener('click', handleNodeSelect);
        });
        setIsPicking(false);
        setHighlightedNode('');
    };

    useEffect(() => {
        return exitPickingState;
    }, []);

    const togglePickingState = () => {
        if (!isPicking) {
            enterPickingState();
        } else {
            exitPickingState();
        }
    };

    return (
        <Draggable>
            <div id={MODAL_ID}>
                <button onClick={togglePickingState}>
                    {isPicking ? 'Stop Picking Nodes' : 'Pick Nodes'}
                </button>
                <h1>Draggable Modal</h1>
                <p>This is a draggable modal. You can move it around!</p>
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
