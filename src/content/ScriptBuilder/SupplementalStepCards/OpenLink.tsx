import { useEffect, useState } from 'react';
import { OpenLinkCommand } from '../../../interfaces';
import { useScriptContext } from '../../ScriptContext';

interface OpenLinkProps {
    stepNumber: number;
    command: OpenLinkCommand;
}

const OpenLink: React.FC<OpenLinkProps> = ({ stepNumber, command }) => {
    const { updateStepCommand, getSavedScripts } = useScriptContext();
    const [scriptNames, setScriptNames] = useState<string[]>([]);
    const [selectedScript, setSelectedScript] = useState(command.scriptName);

    useEffect(() => {
        const fetchLinks = async () => {
            const links = await getSavedScripts();
            setScriptNames(links);
        };

        fetchLinks();
    }, []);

    const onDropDownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.value;
        setSelectedScript(selectedOption);
        updateStepCommand(stepNumber, {
            commandType: 'Open Link',
            scriptName: selectedOption,
        });
    };

    return (
        <div className="supplemental-card-container">
            <div className="supplemental-main-container">
                <label htmlFor="script-dropdown" className="dropdown-label">
                    Select Script:
                </label>
                <select
                    id="script-dropdown"
                    className="script-dropdown"
                    value={selectedScript}
                    onChange={onDropDownChange}
                >
                    <option value="">No Script</option>
                    {scriptNames.map((name, index) => (
                        <option key={index} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default OpenLink;
