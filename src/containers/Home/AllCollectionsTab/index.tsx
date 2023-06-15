import React, { useCallback, useEffect, useState } from 'react';
import { Wrapper } from './CollectionTabs.styled';
import SearchInput from '../SearchInput';
import { getCollectionList } from '@/services/marketplace';
import logger from '@/services/logger';
import { ICollection } from '@/interfaces/api/marketplace';
import DataTable from '../DataTable';
import uniqBy from 'lodash/uniqBy';
import debounce from 'lodash/debounce';
import InfiniteLoading from '@/components/InfiniteLoading';

const FETCH_LIMIT = 32;

const AllCollectionsTab: React.FC = (): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [collections, setCollections] = useState<Array<ICollection>>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(inputVal => fetchCollections(1, inputVal), 500), []);

  const fetchCollections = async (p?: number, query?: string) => {
    try {
      setLoading(true);
      const page = p || Math.floor(collections.length / FETCH_LIMIT) + 1;
      const res = await getCollectionList({
        page: page,
        name: query || searchTerm,
        limit: FETCH_LIMIT,
        sort: -1,
        sort_by: 'volume',
      });
      if (res.length < FETCH_LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setSearchTerm(query || '');
      if (page === 1) {
        setCollections(res);
      } else {
        setCollections((prev) => uniqBy([...prev, ...res], 'id'));
      }
    } catch (err: unknown) {
      logger.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!collections) return <></>;

  return (
    <Wrapper>
      <SearchInput onChange={handleSearch} />
      <DataTable collections={collections} />
      <InfiniteLoading fetchMoreData={fetchCollections} isLoading={loading} hasMoreData={hasMore} />
    </Wrapper>
  );
};

export default AllCollectionsTab;
