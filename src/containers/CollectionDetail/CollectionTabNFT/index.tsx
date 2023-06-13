import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Wrapper } from './CollectionTabNFT.styled';
import TokenList from '../TokenList';
import { ICollection } from '@/interfaces/api/marketplace';

interface IProps {
  collection: ICollection | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: any;
}

const CollectionTabNFT: React.FC<IProps> = ({
  collection,
  query,
}: IProps): React.ReactElement => {
  if (!collection) {
    return <></>;
  }

  return (
    <Wrapper>
      <Tabs defaultActiveKey="items" id="collection-data" className="tabs">
        <Tab
          mountOnEnter
          eventKey="items"
          title={`Item (${collection?.totalItems})`}
        >
          <TokenList collection={collection} query={query} />
        </Tab>
      </Tabs>
    </Wrapper>
  );
};

export default CollectionTabNFT;
