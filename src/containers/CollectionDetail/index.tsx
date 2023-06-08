import React, { useEffect, useState } from 'react';
import { Container } from './Collection.styled';
import CollectionHeader from './CollectionHeader';
import CollectionTabInfo from './CollectionTabInfo';
import { ICollection } from '@/interfaces/api/marketplace';
import logger from '@/services/logger';
import { getCollectionDetail } from '@/services/marketplace';
import { useRouter } from 'next/router';
import ActivityList from './ActivityList';

const CollectionDetail = () => {
  const router = useRouter();
  const { contract } = router.query as {
    contract: string;
  };
  const [collection, setCollection] = useState<ICollection | null>(null);

  const fetchCollectionInfo = async (): Promise<void> => {
    if (!contract) return;

    try {
      const res = await getCollectionDetail(contract);
      setCollection(res);
    } catch (err: unknown) {
      logger.error(err);
    }
  };

  useEffect(() => {
    fetchCollectionInfo();
  }, [contract]);

  return (
    <Container>
      <div className="collection-summary">
        <CollectionHeader collection={collection} />
      </div>
      <div className="collection-trading-info-wrapper">
        <div className="item-list-wrapper">
          <CollectionTabInfo collection={collection} />
        </div>
        <div className="item-activities-wrapper">
          <ActivityList />
        </div>
      </div>
    </Container>
  )
};

export default React.memo(CollectionDetail);
