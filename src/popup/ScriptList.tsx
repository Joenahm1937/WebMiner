import type { Script } from '../interfaces';
import './Scripts.css';
import ScriptCard from './ScriptCard';

interface ScriptListProps {
    scripts: Record<string, Script>;
    openModal: (name?: string) => Promise<void>;
}

const ScriptList: React.FC<ScriptListProps> = ({ scripts, openModal }) => (
    <ul className="scripts">
        {Object.values(scripts).map((script) => (
            <ScriptCard
                key={script.name}
                name={script.name}
                openModal={openModal}
            />
        ))}
    </ul>
);

export default ScriptList;
