import React, { useContext, useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Wrapper } from './CollectionTabNFT.styled';
import TokenList from '../TokenList';
import { ICollection, IOwnerAnalytic } from '@/interfaces/api/marketplace';
import Text from '@/components/Text';
import IconSVG from '@/components/IconSVG';
import { CollectionContext } from '@/contexts/collection-context';
import { CDN_URL } from '@/configs';
import OwnersList from '../OwnersList';
import { useRouter } from 'next/router';
import logger from '@/services/logger';
import { getOwnersAnalytics } from '@/services/marketplace';
import InfiniteLoading from '@/components/InfiniteLoading';
import uniqBy from 'lodash/uniqBy';

interface IProps {
  collection: ICollection | null;
}

const LIMIT_PAGE = 32;

const CollectionTabNFT: React.FC<IProps> = ({
  collection,
}: IProps): React.ReactElement => {
  const { query, setQuery, totalNfts, setActiveTokenTab } =
    useContext(CollectionContext);
  const router = useRouter();
  const { contract } = router.query as { contract: string };

  const [ownersList, setOwnersList] = useState<IOwnerAnalytic[]>([]);
  const [totalOwners, setTotalOwners] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const fetchOwnersAnalytics = async (): Promise<void> => {
    try {
      setLoading(true);
      const page = Math.floor(ownersList.length / LIMIT_PAGE) + 1;
      const res = await getOwnersAnalytics({
        contract_address: contract,
        limit: LIMIT_PAGE,
        page: page,
      });
      if (page === 1) {
        setOwnersList(res.items || []);
      } else {
        setOwnersList((prev) => uniqBy([...prev, ...res.items], 'address'));
      }

      setTotalOwners(res.totalItems);
    } catch (err: unknown) {
      logger.debug('Failed to get owners list');
    } finally {
      setLoading(false);
    }
  };

  const hasMore = !!ownersList && ownersList.length < totalOwners;

  useEffect(() => {
    fetchOwnersAnalytics();
  }, []);

  if (!collection) {
    return <></>;
  }

  return (
    <Wrapper>
      <Tabs
        defaultActiveKey="items"
        id="collection-data"
        className="tabs"
        onSelect={(key) => {
          if (!key) return;
          setActiveTokenTab(key);
        }}
      >
        <Tab mountOnEnter eventKey="items" title={`Items (${totalNfts})`}>
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
        {totalOwners && totalOwners > 0 && (
          <Tab mountOnEnter eventKey="owners" title={`Owners (${totalOwners})`}>
            <>
              <OwnersList list={ownersList}></OwnersList>
              {hasMore && (
                <InfiniteLoading
                  fetchMoreData={fetchOwnersAnalytics}
                  isLoading={loading}
                  hasMoreData={hasMore}
                />
              )}
            </>
          </Tab>
        )}
      </Tabs>
    </Wrapper>
  );
};

export default CollectionTabNFT;
