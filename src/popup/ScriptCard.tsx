interface ScriptProps {
    name: string;
    openModal: (name?: string) => Promise<void>;
}

const ScriptCard: React.FC<ScriptProps> = ({ name, openModal }) => {
    const handleClick = () => {
        openModal(name);
    };
    return (
        <li className="script-card" onClick={handleClick}>
            <div>
                <div>{name}</div>
            </div>
        </li>
    );
};

export default ScriptCard;
