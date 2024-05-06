import React, { useEffect, useState } from 'react';
import { trimString } from './utils';
import './SelectorTable.css';
import {
    ElementIdentifierTypes,
    ElementIdentifier,
    PrimitiveIdentifierTypes,
} from '../interfaces';

const SPECIAL_SELECTORS = new Set<ElementIdentifierTypes>([
    'id',
    'textContent',
    'uniqueSelector',
]);

interface SelectorTableProps {
    isPicking: boolean;
    identifier: ElementIdentifier;
    selectedIdentifiers: ElementIdentifier;
    setSelectedIdentifiers: React.Dispatch<
        React.SetStateAction<ElementIdentifier>
    >;
}

const SelectorTable: React.FC<SelectorTableProps> = ({
    isPicking,
    identifier,
    selectedIdentifiers,
    setSelectedIdentifiers,
}) => {
    const [selectedClassNames, setSelectedClassNames] = useState<Set<string>>(
        new Set()
    );
    const [selectedAttributes, setSelectedAttributes] = useState<Set<string>>(
        new Set()
    );
    const [selectedSimpleRow, setSelectedSimpleRow] =
        useState<PrimitiveIdentifierTypes>();

    useEffect(() => {
        setSelectedIdentifiers({});
        setSelectedClassNames(new Set());
        setSelectedAttributes(new Set());
        setSelectedSimpleRow(undefined);
    }, [isPicking]);

    const handleClassNameSelection = (value: string) => {
        if (isPicking) return;
        setSelectedIdentifiers((prevIdentifier) => {
            if (selectedSimpleRow && SPECIAL_SELECTORS.has(selectedSimpleRow)) {
                setSelectedSimpleRow(undefined);
                setSelectedIdentifiers((prevIdentifiers) => {
                    const updatedIdentifiers = { ...prevIdentifiers };
                    delete updatedIdentifiers[selectedSimpleRow];
                    return updatedIdentifiers;
                });
            }

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

        setSelectedClassNames((prevSelected) => {
            const updated = new Set(prevSelected);
            if (updated.has(value)) {
                updated.delete(value);
            } else {
                updated.add(value);
            }
            return updated;
        });
    };

    const handleAttributeSelection = (
        attribute: string,
        attributeValue: string
    ) => {
        if (isPicking) return;
        if (selectedSimpleRow && SPECIAL_SELECTORS.has(selectedSimpleRow)) {
            setSelectedSimpleRow(undefined);
            setSelectedIdentifiers((prevIdentifiers) => {
                const updatedIdentifiers = { ...prevIdentifiers };
                delete updatedIdentifiers[selectedSimpleRow];
                return updatedIdentifiers;
            });
        }
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

    const handleSimpleRowSelection = (
        label: PrimitiveIdentifierTypes,
        value: string
    ) => {
        if (isPicking) return;
        if (SPECIAL_SELECTORS.has(label)) {
            if (label in selectedIdentifiers) {
                setSelectedSimpleRow(undefined);
                setSelectedIdentifiers({});
            } else {
                setSelectedSimpleRow(label);
                setSelectedIdentifiers({
                    [label]: value,
                });
            }
            setSelectedClassNames(new Set());
            setSelectedAttributes(new Set());
        } else {
            setSelectedIdentifiers((prevIdentifiers) => {
                const updatedIdentifiers = { ...prevIdentifiers };

                if (label in updatedIdentifiers) {
                    delete updatedIdentifiers[label];
                    setSelectedSimpleRow(undefined);
                } else {
                    SPECIAL_SELECTORS.forEach((specialSelector) => {
                        delete updatedIdentifiers[specialSelector];
                    });
                    updatedIdentifiers[label] = value;

                    setSelectedSimpleRow(label);
                }
                return updatedIdentifiers;
            });
        }
    };

    return (
        <div className="element-selector-container">
            <table className="element-selector-table">
                <tbody>
                    {Object.entries(identifier).map(([key, value]) => {
                        if (value !== undefined) {
                            if (Array.isArray(value) && key === 'classNames') {
                                return (
                                    <ClassNamesRow
                                        isPicking={isPicking}
                                        values={value}
                                        selectedClassNames={selectedClassNames}
                                        handleClassNameSelection={
                                            handleClassNameSelection
                                        }
                                    />
                                );
                            }
                            if (
                                typeof value === 'object' &&
                                key === 'attributes'
                            ) {
                                return (
                                    <AttributesRow
                                        isPicking={isPicking}
                                        value={value}
                                        selectedAttributes={selectedAttributes}
                                        handleAttributeSelection={
                                            handleAttributeSelection
                                        }
                                    />
                                );
                            }
                            return (
                                <SimpleIdentifierRow
                                    isPicking={isPicking}
                                    label={key as PrimitiveIdentifierTypes}
                                    value={value}
                                    selectedSimpleRow={selectedSimpleRow}
                                    handleSimpleRowSelection={
                                        handleSimpleRowSelection
                                    }
                                />
                            );
                        }
                        return null;
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SelectorTable;

interface ClassNameProps {
    isPicking: boolean;
    values: string[];
    selectedClassNames: Set<string>;
    handleClassNameSelection: (value: string) => void;
}
const ClassNamesRow: React.FC<ClassNameProps> = ({
    isPicking,
    values,
    handleClassNameSelection,
    selectedClassNames,
}) => {
    const isSelected = (value: string) => selectedClassNames.has(value);

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
                    className={`${!isPicking && 'selection'} value ${
                        isSelected(value) ? 'active' : ''
                    }`}
                    onClick={() => handleClassNameSelection(value)}
                >
                    <td colSpan={2} className="class-name">
                        {trimString(value)}
                    </td>
                </tr>
            ))}
        </>
    );
};

interface AttributesProps {
    isPicking: boolean;
    value: Record<string, string>;
    selectedAttributes: Set<string>;
    handleAttributeSelection: (
        attribute: string,
        attributeValue: string
    ) => void;
}

const AttributesRow: React.FC<AttributesProps> = ({
    isPicking,
    value,
    selectedAttributes,
    handleAttributeSelection,
}) => {
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
                    className={`${!isPicking && 'selection'} ${
                        isAttributeSelected(attribute) ? 'active' : ''
                    }`}
                    onClick={() =>
                        handleAttributeSelection(attribute, attributeValue)
                    }
                >
                    <td className="label attribute-name">{attribute}</td>
                    <td className="value">{trimString(attributeValue)}</td>
                </tr>
            ))}
        </>
    );
};

interface SimpleIdentifierProps {
    isPicking: boolean;
    label: PrimitiveIdentifierTypes;
    value: string;
    selectedSimpleRow?: keyof Omit<
        ElementIdentifier,
        'attributes' | 'classNames'
    >;
    handleSimpleRowSelection: (
        label: PrimitiveIdentifierTypes,
        value: string
    ) => void;
}

const SimpleIdentifierRow: React.FC<SimpleIdentifierProps> = ({
    isPicking,
    label,
    value,
    selectedSimpleRow,
    handleSimpleRowSelection,
}) => {
    return (
        <tr
            key={label}
            className={`${!isPicking && 'selection'} ${
                selectedSimpleRow === label ? 'active' : ''
            }`}
            onClick={() => handleSimpleRowSelection(label, value)}
        >
            <td className="label">{label}</td>
            <td className="value">{trimString(value)}</td>
        </tr>
    );
};
