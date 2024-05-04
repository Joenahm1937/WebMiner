import React, { useState } from 'react';
import { ElementIdentifier } from './utils';
import './SelectorTable.css';

interface SelectorTableProps {
    identifier: ElementIdentifier;
    setSelectedIdentifiers: React.Dispatch<
        React.SetStateAction<ElementIdentifier>
    >;
}

const SelectorTable: React.FC<SelectorTableProps> = ({
    identifier,
    setSelectedIdentifiers,
}) => (
    <div className="element-selector-container">
        <table className="element-selector-table">
            <tbody>
                {Object.entries(identifier).map(([key, value]) => {
                    if (value !== undefined) {
                        if (Array.isArray(value) && key === 'classNames') {
                            return (
                                <ClassNamesRow
                                    key={key}
                                    values={value}
                                    setSelectedIdentifiers={
                                        setSelectedIdentifiers
                                    }
                                />
                            );
                        }
                        if (typeof value === 'object' && key === 'attributes') {
                            return (
                                <AttributesRow
                                    value={value}
                                    setSelectedIdentifiers={
                                        setSelectedIdentifiers
                                    }
                                />
                            );
                        }
                        return (
                            <SimpleIdentifierRow
                                label={
                                    key as keyof Omit<
                                        ElementIdentifier,
                                        'attributes' | 'classNames'
                                    >
                                }
                                value={value}
                                setSelectedIdentifiers={setSelectedIdentifiers}
                            />
                        );
                    }
                    return null;
                })}
            </tbody>
        </table>
    </div>
);

export default SelectorTable;

interface ClassNameProps {
    values: string[];
    setSelectedIdentifiers: React.Dispatch<
        React.SetStateAction<ElementIdentifier>
    >;
}
const ClassNamesRow: React.FC<ClassNameProps> = ({
    values,
    setSelectedIdentifiers,
}) => {
    const [selectedValues, setSelectedValues] = useState<Set<string>>(
        new Set()
    );

    const handleRowClick = (value: string) => {
        setSelectedIdentifiers((prevIdentifier) => {
            const updatedClassNames = new Set(prevIdentifier.classNames || []);

            if (updatedClassNames.has(value)) {
                updatedClassNames.delete(value);
            } else {
                updatedClassNames.add(value);
            }

            return {
                ...prevIdentifier,
                classNames: Array.from(updatedClassNames),
            };
        });

        setSelectedValues((prevSelected) => {
            const updated = new Set(prevSelected);
            if (updated.has(value)) {
                updated.delete(value);
            } else {
                updated.add(value);
            }
            return updated;
        });
    };

    const isSelected = (value: string) => selectedValues.has(value);

    return (
        <>
            <tr>
                <td colSpan={2} className="label">
                    Classes:
                </td>
            </tr>
            {values.map((value, index) => (
                <tr
                    key={`class_${index}`}
                    className={`selection value ${
                        isSelected(value) ? 'active' : ''
                    }`}
                    onClick={() => handleRowClick(value)}
                >
                    <td colSpan={2} style={{ paddingLeft: '40%' }}>
                        {value}
                    </td>
                </tr>
            ))}
        </>
    );
};

interface AttributesProps {
    value: Record<string, string>;
    setSelectedIdentifiers: React.Dispatch<
        React.SetStateAction<ElementIdentifier>
    >;
}

const AttributesRow: React.FC<AttributesProps> = ({
    value,
    setSelectedIdentifiers,
}) => {
    // Track selected attributes locally for visual highlighting
    const [selectedAttributes, setSelectedAttributes] = useState<Set<string>>(
        new Set()
    );

    const handleAttributeClick = (
        attribute: string,
        attributeValue: string
    ) => {
        setSelectedIdentifiers((prevIdentifiers) => {
            const updatedAttributes = { ...(prevIdentifiers.attributes || {}) };

            if (attribute in updatedAttributes) {
                delete updatedAttributes[attribute];
            } else {
                updatedAttributes[attribute] = attributeValue;
            }

            return { ...prevIdentifiers, attributes: updatedAttributes };
        });

        setSelectedAttributes((prevSelected) => {
            const updated = new Set(prevSelected);
            if (updated.has(attribute)) {
                updated.delete(attribute);
            } else {
                updated.add(attribute);
            }
            return updated;
        });
    };

    const isAttributeSelected = (attribute: string) =>
        selectedAttributes.has(attribute);

    return (
        <>
            <tr>
                <td colSpan={2} className="label">
                    Attributes:
                </td>
            </tr>
            {Object.entries(value).map(([attribute, attributeValue]) => (
                <tr
                    key={`attributes_${attribute}`}
                    className={`selection ${
                        isAttributeSelected(attribute) ? 'active' : ''
                    }`}
                    onClick={() =>
                        handleAttributeClick(attribute, attributeValue)
                    }
                >
                    <td className="label" style={{ paddingLeft: '10%' }}>
                        {attribute}
                    </td>
                    <td className="value">{attributeValue}</td>
                </tr>
            ))}
        </>
    );
};

interface SimpleIdentifierProps {
    label: keyof Omit<ElementIdentifier, 'attributes' | 'classNames'>;
    value: string;
    setSelectedIdentifiers: React.Dispatch<
        React.SetStateAction<ElementIdentifier>
    >;
}

const SimpleIdentifierRow: React.FC<SimpleIdentifierProps> = ({
    label,
    value,
    setSelectedIdentifiers,
}) => {
    const [selected, setSelected] = useState(false);

    const handleRowClick = () => {
        setSelectedIdentifiers((prevIdentifiers) => {
            const updatedIdentifiers = { ...prevIdentifiers };

            if (label in updatedIdentifiers) {
                delete updatedIdentifiers[label];
            } else {
                updatedIdentifiers[label] = value;
            }

            return updatedIdentifiers;
        });

        setSelected((prevSelected) => !prevSelected);
    };

    return (
        <tr
            key={label}
            className={`selection ${selected ? 'active' : ''}`}
            onClick={handleRowClick}
        >
            <td className="label">{label}</td>
            <td className="value">{value}</td>
        </tr>
    );
};
