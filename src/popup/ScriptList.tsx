import type { UserScript } from '../interfaces';
import './Scripts.css';
import ScriptCard from './ScriptCard';

const ScriptList = ({ scripts }: { scripts: UserScript[] }) => (
    <ul className="scripts">
        {scripts.map((script) => (
            <ScriptCard key={script.id} {...script} />
        ))}
    </ul>
);

export default ScriptList;
