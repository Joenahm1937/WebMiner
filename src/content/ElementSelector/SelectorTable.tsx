import React from 'react';
import { trimString } from './utils';
import './SelectorTable.css';
import { DOMSelectors, DOMSelector } from '../interfaces';
import { SelectorProps, SelectorTableProps } from './interfaces';
import { UNIQUE_SELECTORS } from '../constants';
import {
    updateClassNameSelector,
    updateAttributeSelector,
    updateUniqueSelector,
    updateGenericSelector,
} from './selectionHandlers';

const Selector: React.FC<SelectorProps> = ({
    selectorName,
    selectorValue,
    isPicking,
    selected,
    selectorType,
    updateSelected,
}) => {
    let isSelected: boolean;
    if (selectorType === 'className') {
        isSelected = !!selected.classNames?.includes(selectorValue);
    } else if (selectorType === 'attributes') {
        isSelected = !!selected.attributes?.[selectorName];
    } else {
        isSelected = selectorName in selected;
    }
    return (
        <tr
            key={selectorName}
            className={`${!isPicking && 'selector'} ${isSelected && 'active'} `}
            onClick={() =>
                updateSelected(selectorName, selectorValue, selectorType)
            }
        >
            <td className={`selector-label ${selectorType}`}>{selectorName}</td>
            <td className="selector-value">{trimString(selectorValue)}</td>
        </tr>
    );
};

const SelectorTable: React.FC<SelectorTableProps> = ({
    isPicking,
    selectors,
    selected,
    setSelected,
}) => {
    const updateSelected = (
        selector: string,
        value: string,
        selectorType: string
    ) => {
        let updatedSelection: DOMSelectors;
        if (selectorType === 'className') {
            updatedSelection = updateClassNameSelector(
                selector,
                value,
                selected
            );
        } else if (selectorType === 'attributes') {
            updatedSelection = updateAttributeSelector(
                selector,
                value,
                selected
            );
        } else if (UNIQUE_SELECTORS.has(selector)) {
            updatedSelection = updateUniqueSelector(selector, value, selected);
        } else {
            updatedSelection = updateGenericSelector(selector, value, selected);
        }
        setSelected(updatedSelection);
    };

    const currentSelector: [string, DOMSelectors[DOMSelector]][] =
        Object.entries(selectors);

    return (
        <div className="element-selector-container">
            <table className="element-selector-table">
                <tbody>
                    {currentSelector.map(([selector, selectorValue]) => {
                        if (selectorValue !== undefined) {
                            if (
                                Array.isArray(selectorValue) &&
                                selector === 'classNames'
                            ) {
                                return (
                                    <>
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="selector-label"
                                            >
                                                Classes:
                                            </td>
                                        </tr>
                                        {selectorValue.map((className) => (
                                            <Selector
                                                selectorName="class"
                                                selectorValue={className}
                                                isPicking={isPicking}
                                                selected={selected}
                                                selectorType="className"
                                                updateSelected={updateSelected}
                                            />
                                        ))}
                                    </>
                                );
                            } else if (
                                typeof selectorValue === 'object' &&
                                selector === 'attributes'
                            ) {
                                return (
                                    <>
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="selector-label"
                                            >
                                                Attributes:
                                            </td>
                                        </tr>
                                        {Object.entries(selectorValue).map(
                                            ([attribute, attributeValue]) => (
                                                <Selector
                                                    selectorName={attribute}
                                                    selectorValue={
                                                        attributeValue
                                                    }
                                                    isPicking={isPicking}
                                                    selected={selected}
                                                    selectorType="attributes"
                                                    updateSelected={
                                                        updateSelected
                                                    }
                                                />
                                            )
                                        )}
                                    </>
                                );
                            } else if (typeof selectorValue === 'string') {
                                return (
                                    <Selector
                                        selectorName={selector}
                                        selectorValue={selectorValue}
                                        isPicking={isPicking}
                                        selected={selected}
                                        selectorType=""
                                        updateSelected={updateSelected}
                                    />
                                );
                            }
                            return null;
                        }
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default SelectorTable;
