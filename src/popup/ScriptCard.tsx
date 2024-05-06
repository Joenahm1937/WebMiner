const ScriptCard = ({ name }: { name: string }) => {
    return (
        <li className="script-card">
            <div>
                <div>{name}</div>
            </div>
        </li>
    );
};

export default ScriptCard;
