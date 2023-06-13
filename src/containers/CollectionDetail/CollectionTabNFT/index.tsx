import React, { useContext } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Wrapper } from './CollectionTabNFT.styled';
import TokenList from '../TokenList';
import { ICollection } from '@/interfaces/api/marketplace';
import Text from '@/components/Text';
import IconSVG from '@/components/IconSVG';
import { CollectionContext } from '@/contexts/collection-context';
import { CDN_URL } from '@/configs';

interface IProps {
  collection: ICollection | null;
}

const CollectionTabNFT: React.FC<IProps> = ({
  collection,
}: IProps): React.ReactElement => {
  const { query, setQuery, totalNfts } = useContext(CollectionContext);

  const { attributes: filterTraits } = query;

  const handleRemoveFilter = (trait: string) => {
    if (!filterTraits) return;

    const newFilterTraits = filterTraits
      .split(',')
      .filter((item) => item !== trait)
      .join(',');

    setQuery({
      ...query,
      attributes: newFilterTraits,
    });
  };

  if (!collection) {
    return <></>;
  }

  return (
    <Wrapper>
      <Tabs defaultActiveKey="items" id="collection-data" className="tabs">
        <Tab mountOnEnter eventKey="items" title={`Item (${totalNfts})`}>
          {filterTraits && filterTraits.length > 0 && (
            <div className={'filterList'}>
              {filterTraits.split(',').map((trait, index) => (
                <div
                  key={`trait-${index}`}
                  className={'filterItem d-flex align-items-center'}
                >
                  <Text>{`${trait.split(':')[0]}: ${trait.split(':')[1]}`}</Text>
                  <IconSVG
                    maxWidth={'12'}
                    src={`${CDN_URL}/icons/ic-close-1.svg`}
                    color="white"
                    type="fill"
                    className={'removeIcon cursor-pointer'}
                    onClick={() => {
                      handleRemoveFilter(trait);
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setQuery({
                    ...query,
                    attributes: '',
                  })
                }
              >
                Clear all
              </button>
            </div>
          )}

          <TokenList collection={collection} />
        </Tab>
      </Tabs>
    </Wrapper>
  );
};

export default CollectionTabNFT;
