import './Modal.css';
import Draggable from 'react-draggable';
import ElementSelector from '../ElementSelector/ElementSelector';
import { useScriptContext } from '../ScriptContext';
import Script from '../ScriptBuilder/Script';
import { MODAL_ID } from '../constants';

const Modal = () => {
    const { elementPickingStep } = useScriptContext();
    return (
        <Draggable>
            <div id={MODAL_ID}>
                {elementPickingStep === undefined ? (
                    <Script />
                ) : (
                    <ElementSelector />
                )}
            </div>
        </Draggable>
    );
};

export default Modal;
