import React, { useCallback, useEffect, useState } from 'react';
import { Wrapper } from './CollectionTabs.styled';
import SearchInput from '../SearchInput';
import { getCollectionList } from '@/services/marketplace';
import logger from '@/services/logger';
import { ICollection } from '@/interfaces/api/marketplace';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '@/components/Spinner';
import DataTable from '../DataTable';
import uniqBy from 'lodash/uniqBy';
import debounce from 'lodash/debounce';

const FETCH_LIMIT = 32;

const CollectionsTab: React.FC = (): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [collections, setCollections] = useState<Array<ICollection>>([]);

  const handleSearch = useCallback(debounce(inputVal => fetchCollections(1, inputVal), 500), []);

  const fetchCollections = async (p?: number, query?: string) => {
    try {
      console.log(query)
      setLoading(true);
      const page = p || Math.floor(collections.length / FETCH_LIMIT) + 1;
      const res = await getCollectionList({
        page: page,
        name: query,
        limit: 32,
        sort: -1,
        sort_by: 'volume'
      });
      if (!res.length) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      if (page === 1) {
        setCollections(res);
      } else {
        setCollections(prev => uniqBy([...prev, ...res], 'id'));
      }
    } catch (err: unknown) {
      logger.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  if (!collections) return <></>;

  return (
    <Wrapper>
      <SearchInput
        onChange={handleSearch}
      />
      <InfiniteScroll
        className="collection-list"
        dataLength={collections.length}
        loader={
          loading ? (
            <div className="loading-wrapper">
              <Spinner />
            </div>
          ) : <></>
        }
        next={fetchCollections}
        hasMore={hasMore}
      >
        <DataTable
          collections={collections}
        />
      </InfiniteScroll>
    </Wrapper>
  )
}

export default CollectionsTab;