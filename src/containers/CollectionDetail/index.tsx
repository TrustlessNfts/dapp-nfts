import { CDN_URL } from '@/configs';
import { CollectionContext } from '@/contexts/collection-context';
import { ICollection } from '@/interfaces/api/marketplace';
import logger from '@/services/logger';
import { getCollectionDetail } from '@/services/marketplace';
import { getUserSelector } from '@/state/user/selector';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import ActivityList from './ActivityList';
import { Container } from './Collection.styled';
import CollectionChart from './CollectionChart';
import CollectionDescription from './CollectionDescription';
import CollectionFilter from './CollectionFilter';
import CollectionHeader from './CollectionHeader';
import CollectionTabNFT from './CollectionTabNFT';
import ModalEdit from './ModalEdit';

const CollectionDetail = () => {
  const router = useRouter();
  const { contract } = router.query as {
    contract: string;
  };
  const user = useSelector(getUserSelector);
  const { activeTokenTab } = useContext(CollectionContext);
  const [collection, setCollection] = useState<ICollection | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('description');

  const isOwner =
    user?.walletAddress?.toLowerCase() === collection?.creator.toLowerCase();

  const fetchCollectionInfo = async (): Promise<void> => {
    if (!contract) return;

    try {
      const res = await getCollectionDetail(contract);
      setCollection(res);
    } catch (err: unknown) {
      logger.error(err);
    }
  };

  const handleOpenEditModal = () => {
    setShowModalEdit(true);
  };

  useEffect(() => {
    fetchCollectionInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  useEffect(() => {
    if (activeTokenTab === 'owners') {
      setActiveTab('description');
    }
  }, [activeTokenTab]);

  if (!collection) return <></>;

  return (
    <Container>
      <div className="collection-summary">
        <CollectionHeader collection={collection} />
      </div>
      <div className="collection-trading-info-wrapper">
        <div className="item-info-wrapper">
          <Tabs
            activeKey={activeTab}
            defaultActiveKey={activeTab}
            id="collection-info"
            className="tabs"
            onSelect={(key) => {
              if (!key) return;
              setShowEditButton(key === 'description');
              setActiveTab(key);
            }}
          >
            <Tab
              mountOnEnter
              eventKey="filter"
              title={`Filter`}
              disabled={activeTokenTab === 'owners'}
            >
              <CollectionFilter floorPrice={collection?.floorPrice} />
            </Tab>
            <Tab mountOnEnter eventKey="description" title={`Description`}>
              <CollectionDescription collection={collection} />
            </Tab>
          </Tabs>
          {isOwner && showEditButton && (
            <button className="edit-btn" onClick={handleOpenEditModal}>
              <img src={`${CDN_URL}/icons/edit-03.svg`} alt="edit-03" />
            </button>
          )}
        </div>
        <div className="item-list-wrapper">
          <CollectionTabNFT collection={collection} />
        </div>
        <div className="item-stats-wrapper">
          <div className="activity-list-wrapper">
            <ActivityList collection={collection} />
          </div>
          <div className="collection-chart-wrapper">
            <CollectionChart collection={collection} />
          </div>
        </div>
      </div>
      {collection && showModalEdit && (
        <ModalEdit
          collection={collection}
          show={showModalEdit}
          handleClose={() => setShowModalEdit(false)}
          onUpdateSuccess={() => window.location.reload()}
        />
      )}
    </Container>
  );
};

export default React.memo(CollectionDetail);
