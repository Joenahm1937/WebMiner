import { DOMMetadata } from '../../interfaces';

interface ElementMetadataProps {
    metadata: DOMMetadata;
}

const ElementMetadata: React.FC<ElementMetadataProps> = ({ metadata }) => {
    return metadata.selectors.map(({ queryString }) => (
        <div
            style={{
                whiteSpace: 'normal',
                fontSize: 'small',
                overflow: 'hidden',
            }}
        >
            {queryString}
        </div>
    ));
};

export default ElementMetadata;
