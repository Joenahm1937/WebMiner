import type { UserScript } from '../interfaces';

const ScriptCard = ({ id }: UserScript) => {
    return (
        <li className="script-card">
            <div>
                <div>{id}</div>
            </div>
        </li>
    );
};

export default ScriptCard;
