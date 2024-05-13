import { DOMMetadata } from '../../interfaces';

interface ElementMetadataProps {
    metadata: DOMMetadata;
}

const ElementMetadata: React.FC<ElementMetadataProps> = ({ metadata }) => (
    <div>{JSON.stringify(metadata)}</div>
);

export default ElementMetadata;
