import { DOMMetadata } from '../../interfaces';

interface ElementMetadataProps {
    metadata: DOMMetadata;
}

const ElementMetadata: React.FC<ElementMetadataProps> = ({ metadata }) => {
    return metadata.selectors.map(({ searchAPI, queryString }) => (
        <div
            style={{
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                fontSize: 'small',
                overflow: 'hidden',
            }}
        >
            {`${searchAPI}(${queryString})`}
        </div>
    ));
};

export default ElementMetadata;
