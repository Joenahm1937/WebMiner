import './StepCard.css';
import { useScriptContext } from '../ScriptContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowPointer,
    faTrash,
    faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { CommandType, ScriptCommand, ScriptStep } from '../../interfaces';
import { Commands } from '../../constants';
import ElementMetadata from '../ElementSelector/ElementMetadata';
import { InputText, OpenLink } from './SupplementalStepCards';
import { ReactNode, useEffect, useState } from 'react';

/**
 * TODO: Suggest Possible Commands based on Element Attributes
 * e.g. Should only suggest Open Link for Links, Input Text for Value Elements, Clicks should be used sparingly on button submits
 */

interface StepProps extends ScriptStep {
    stepNumber: number;
}

const StepCard: React.FC<StepProps> = ({ stepNumber, element, command }) => {
    const {
        setElementPickingStep,
        updateStepCommand,
        stepStatuses,
        playStep,
        removeStep,
    } = useScriptContext();

    const [supplementalCard, setSupplementalCard] = useState<ReactNode>(null);

    useEffect(() => {
        switch (command?.commandType) {
            case 'Input Text':
                setSupplementalCard(
                    <InputText stepNumber={stepNumber} command={command} />
                );
                break;
            case 'Open Link':
                setSupplementalCard(
                    <OpenLink stepNumber={stepNumber} command={command} />
                );
                break;
        }
    }, []);

    const stepStatus = stepStatuses[stepNumber];

    const enterPickingMode = () => {
        setElementPickingStep(stepNumber);
    };

    const handlePlayClick = () => playStep(stepNumber);

    const handleCommandChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const commandType = event.target.value as CommandType;
        switch (commandType) {
            case 'Click':
                updateStepCommand(stepNumber, {
                    commandType: 'Click',
                });
                setSupplementalCard(null);
                break;
            case 'Input Text':
                const inputDefaultCommand: ScriptCommand = {
                    commandType: 'Input Text',
                    text: '',
                };
                updateStepCommand(stepNumber, inputDefaultCommand);
                setSupplementalCard(
                    <InputText
                        stepNumber={stepNumber}
                        command={inputDefaultCommand}
                    />
                );
                break;
            case 'Open Link':
                const openLinkDefaultCommand: ScriptCommand = {
                    commandType: 'Open Link',
                };
                updateStepCommand(stepNumber, openLinkDefaultCommand);
                setSupplementalCard(
                    <OpenLink
                        stepNumber={stepNumber}
                        command={openLinkDefaultCommand}
                    />
                );
        }
    };

    const handleDeleteClick = () => {
        removeStep(stepNumber);
    };

    const isElementMissing = !element;
    const isCommandMissing = command === undefined;
    const hasValidSelector = element && element.selectors.length;

    return (
        <div
            className={`step-card-container ${
                isElementMissing && isCommandMissing && 'empty-card'
            }`}
        >
            <div className="step-card-header">
                <button
                    className="step-pick-button web-miner-icon"
                    onClick={enterPickingMode}
                >
                    <FontAwesomeIcon icon={faArrowPointer} className="fa-lg " />
                </button>
                {stepStatus.state === 'running' && (
                    <div className="web-miner-icon">Playing...</div>
                )}
                {stepStatus.state === 'idle' && (
                    <div>
                        <button
                            className="step-delete-button web-miner-icon"
                            onClick={handleDeleteClick}
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="fa-lg "
                            />
                        </button>
                        <button
                            className="step-play-button web-miner-icon"
                            onClick={handlePlayClick}
                        >
                            <FontAwesomeIcon icon={faPlay} className="fa-lg " />
                        </button>
                    </div>
                )}
                {stepStatus.state === 'error' && (
                    <div className="error-banner">{stepStatus.message}</div>
                )}
                {stepStatus.state === 'success' && (
                    <div className="success-banner">Success</div>
                )}
            </div>
            <div className="step-details">
                <div
                    className={
                        isElementMissing
                            ? 'placeholder-text'
                            : 'step-selector-text'
                    }
                >
                    {hasValidSelector ? (
                        <ElementMetadata metadata={element} />
                    ) : (
                        <p>Select Element</p>
                    )}
                </div>
                <select
                    className="step-command-select"
                    value={command?.commandType ?? ''}
                    onChange={handleCommandChange}
                >
                    {isCommandMissing && <option disabled value=""></option>}
                    <option value={Commands.CLICK}>{Commands.CLICK}</option>
                    <option value={Commands.INPUT_TEXT}>
                        {Commands.INPUT_TEXT}
                    </option>
                    <option value={Commands.OPEN_LINK}>
                        {Commands.OPEN_LINK}
                    </option>
                </select>
            </div>
            {supplementalCard}
        </div>
    );
};

export default StepCard;
