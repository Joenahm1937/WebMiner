import type { Script } from '../interfaces';
import './Scripts.css';
import ScriptCard from './ScriptCard';

const ScriptList = ({ scripts }: { scripts: Script[] }) => (
    <ul className="scripts">
        {scripts.map((script) => (
            <ScriptCard key={script.name} name={script.name} />
        ))}
    </ul>
);

export default ScriptList;
