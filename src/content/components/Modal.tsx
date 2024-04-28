import { useCallback, useEffect, useState } from 'react';
import './Modal.css';
import Draggable from 'react-draggable';
import { tearDown } from '../utils';

const Modal = () => {
    const [isHighlighting, setIsHighlighting] = useState(false);
    const [highlightedNodeInfo, setHighlightedNodeInfo] = useState('');
    const [selectedNode, setSelectedNode] = useState<string>();

    const highlightStyle = '3px solid red'; // The CSS for highlighting elements

    const handleMouseOver = useCallback((event: Event) => {
        const node = event.target as HTMLElement;
        node.style.outline = highlightStyle;
        setHighlightedNodeInfo(
            `Tag: ${node.tagName}, Class: ${node.className}`
        );
    }, []);

    const handleMouseOut = useCallback((event: Event) => {
        const node = event.target as HTMLElement;
        node.style.outline = '';
        setHighlightedNodeInfo('');
    }, []);

    const handleNodeSelect = useCallback((event: Event) => {
        const node = event.target as HTMLElement;
        const modal = document.getElementById('unique-modal-id');
        // We do not want to overwrite the click handler of the stop picking nodes button obv
        if (modal?.contains(node)) return;
        event.stopPropagation(); // Prevent the event from bubbling to avoid unintended interactions
        setSelectedNode(node.outerHTML);
        toggleHighlight();
    }, []);

    useEffect(() => {
        return () => {
            document.querySelectorAll('*').forEach((element) => {
                element.removeEventListener('mouseover', handleMouseOver);
                element.removeEventListener('mouseout', handleMouseOut);
                element.removeEventListener('click', handleNodeSelect);
            });
        };
    }, []);
    // Toggle the highlighting functionality
    const toggleHighlight = () => {
        if (!isHighlighting) {
            document.querySelectorAll('*').forEach((element) => {
                element.addEventListener('mouseover', handleMouseOver);
                element.addEventListener('mouseout', handleMouseOut);
                element.addEventListener('click', handleNodeSelect);
            });
        } else {
            document.querySelectorAll('*').forEach((element) => {
                element.removeEventListener('mouseover', handleMouseOver);
                element.removeEventListener('mouseout', handleMouseOut);
                element.removeEventListener('click', handleNodeSelect);
            });
        }
        setIsHighlighting(!isHighlighting);
    };

    return (
        <Draggable>
            <div id="unique-modal-id">
                <button onClick={tearDown}>Close</button>
                <button onClick={toggleHighlight}>
                    {isHighlighting ? 'Stop Picking Nodes' : 'Pick Nodes'}
                </button>
                <h1>Draggable Modal</h1>
                <p>This is a draggable modal. You can move it around!</p>
                {highlightedNodeInfo && (
                    <p>Highlighted Node: {highlightedNodeInfo}</p>
                )}
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
