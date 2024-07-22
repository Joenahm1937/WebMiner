import type { Script } from '../interfaces';
import './Scripts.css';
import ScriptCard from './ScriptCard';
import { ModalState } from './constants';

interface ScriptListProps {
    scripts: Record<string, Script>;
    setToEditingMode: (status: ModalState) => void;
    openModal: (name?: string) => Promise<void>;
}

const ScriptList: React.FC<ScriptListProps> = ({
    scripts,
    openModal,
    setToEditingMode,
}) => (
    <ul className="scripts">
        {Object.values(scripts).map((script) => (
            <ScriptCard
                key={script.name}
                name={script.name}
                url={script.url}
                openModal={openModal}
                setToEditingMode={setToEditingMode}
            />
        ))}
    </ul>
);

export default ScriptList;
