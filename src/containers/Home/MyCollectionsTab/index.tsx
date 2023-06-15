import React, { useCallback, useEffect, useState } from 'react';
import { Wrapper } from './MyCollectionsTab.styled';
import SearchInput from '../SearchInput';
import { getCollectionList } from '@/services/marketplace';
import logger from '@/services/logger';
import { ICollection } from '@/interfaces/api/marketplace';
import DataTable from '../DataTable';
import uniqBy from 'lodash/uniqBy';
import debounce from 'lodash/debounce';
import InfiniteLoading from '@/components/InfiniteLoading';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';

const FETCH_LIMIT = 32;

const MyCollectionsTab: React.FC = (): React.ReactElement => {
  const user = useSelector(getUserSelector);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [collections, setCollections] = useState<Array<ICollection>>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(debounce(inputVal => fetchUserCollections(1, inputVal), 500), []);

  const fetchUserCollections = async (p?: number, query?: string) => {
    if (!user.walletAddress || loading) return;

    try {
      setLoading(true);
      const page = p || Math.floor(collections.length / FETCH_LIMIT) + 1;
      const res = await getCollectionList({
        owner: user.walletAddress,
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
    fetchUserCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!collections) return <></>;

  return (
    <Wrapper>
      <SearchInput onChange={handleSearch} />
      <DataTable collections={collections} />
      <InfiniteLoading fetchMoreData={fetchUserCollections} isLoading={loading} hasMoreData={hasMore} />
    </Wrapper>
  );
};

export default MyCollectionsTab;
