import './Modal.css';
import Draggable from 'react-draggable';
import ElementPicker from './ElementPicker';
import { useScriptContext } from '../ScriptContext';
import Script from './Script';
import { MODAL_ID } from '../constants';

const Modal = () => {
    const { elementPickingStep } = useScriptContext();
    return (
        <Draggable>
            <div id={MODAL_ID}>
                {elementPickingStep === undefined ? (
                    <Script />
                ) : (
                    <ElementPicker />
                )}
            </div>
        </Draggable>
    );
};

export default Modal;
