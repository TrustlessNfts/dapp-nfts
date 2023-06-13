import React, { useEffect, useState } from 'react';
import { Container } from './Collection.styled';
import { ICollection } from '@/interfaces/api/marketplace';
import logger from '@/services/logger';
import { getCollectionDetail } from '@/services/marketplace';
import { useRouter } from 'next/router';
import ActivityList from './ActivityList';
import CollectionDescription from './CollectionDescription';
import CollectionHeader from './CollectionHeader';
import CollectionTabNFT from './CollectionTabNFT';
import CollectionFilter from './CollectionFilter';
import { Tabs, Tab } from 'react-bootstrap';
import { CDN_URL } from '@/configs';
import ModalEdit from './ModalEdit';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';

const CollectionDetail = () => {
  const router = useRouter();
  const { contract } = router.query as {
    contract: string;
  };
  const user = useSelector(getUserSelector);
  const [collection, setCollection] = useState<ICollection | null>(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);

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

  if (!collection) return <></>;

  return (
    <Container>
      <div className="collection-summary">
        <CollectionHeader collection={collection} />
      </div>
      <div className="collection-trading-info-wrapper">
        <div className="item-info-wrapper">
          <Tabs
            defaultActiveKey="description"
            id="collection-info"
            className="tabs"
            onSelect={(key) => {
              setShowEditButton(key === 'description');
            }}
          >
            <Tab mountOnEnter eventKey="filter" title={`Filter`}>
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
        <div className="item-activities-wrapper">
          <ActivityList collection={collection} />
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
