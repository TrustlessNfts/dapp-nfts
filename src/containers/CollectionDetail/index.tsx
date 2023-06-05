import NFTCard from '@/components/NFTCard';
import { ICollection } from '@/interfaces/api/collection';
import { IInscription } from '@/interfaces/api/inscription';
import { getCollectionDetail, getCollectionNfts } from '@/services/nft-explorer';
import { shortenAddress } from '@/utils';
import Spinner from 'react-bootstrap/Spinner';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Grid } from './Collection.styled';
import CollectionHeader from './CollectionHeader';
import ModalEdit from './ModalEdit';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';
import ModalMint from './ModalMint';
import ModalTransfer from './ModalTransfer';
import logger from '@/services/logger';
import { BNS_CONTRACT } from '@/configs';

const LIMIT = 32;

const Collection = () => {
  const router = useRouter();
  const { contract, owner } = router.query as {
    contract: string;
    owner?: string;
  };
  const [collection, setCollection] = useState<ICollection | undefined>();
  const [isFetching, setIsFetching] = useState(false);
  const [inscriptions, setInscriptions] = useState<IInscription[]>([]);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalMint, setShowModalMint] = useState(false);
  const [showModalTransfer, setShowModalTransfer] = useState(false);

  const fetchCollectionDetail = useCallback(async () => {
    try {
      const data = await getCollectionDetail({ contractAddress: contract });
      setCollection(data);
    } catch (error) {
      logger.error(error)
    }
  }, [setCollection, contract]);

  const fetchInscriptions = useCallback(async (page = 1) => {
    try {
      setIsFetching(true);
      const data = await getCollectionNfts({
        contractAddress: contract,
        page,
        limit: LIMIT,
        owner: owner || '',
      });
      if (page > 1) {
        setInscriptions((prev) => [...prev, ...data]);
      } else {
        setInscriptions(data);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      setIsFetching(false);
    }
  }, [contract, setInscriptions, owner]);

  const onLoadMoreCollections = () => {
    if (isFetching || inscriptions.length % LIMIT !== 0) return;
    const page = Math.floor(inscriptions.length / LIMIT) + 1;
    fetchInscriptions(page);
  };

  const debounceLoadMore = debounce(onLoadMoreCollections, 300);

  useEffect(() => {
    if (!contract) return;
    fetchCollectionDetail();
    fetchInscriptions();
  }, [contract, fetchCollectionDetail, fetchInscriptions])

  return (
    <Container>
      <div className="content">
        <CollectionHeader
          collection={collection}
          onClickEdit={() => setShowModalEdit(true)}
          onClickMint={() => setShowModalMint(true)}
          onClickTransfer={() => setShowModalTransfer(true)}
        />
        <div>
          <InfiniteScroll
            className="list"
            dataLength={inscriptions?.length || 0}
            hasMore={true}
            loader={
              isFetching && (
                <div className="loading">
                  <Spinner animation="border" variant="primary" />
                </div>
              )
            }
            next={debounceLoadMore}
          >
            <Grid>
              {inscriptions &&
                inscriptions.length > 0 &&
                inscriptions.map((item, index) => {
                  return (
                    <NFTCard
                      isBNS={
                        collection?.contract.toLocaleLowerCase() ===
                        BNS_CONTRACT.toLocaleLowerCase()
                      }
                      key={index.toString()}
                      href={`${ROUTE_PATH.COLLECTION}/${collection?.contract}/token/${item.tokenId}`}
                      image={item?.image}
                      contract={collection?.contract}
                      tokenId={item.tokenId}
                      contentType={item.contentType}
                      title1={
                        item.name ||
                        (collection && collection.contract
                          ? shortenAddress(collection.contract, 4)
                          : '')
                      }
                      title2={shortenAddress(item.owner, 4)}
                      owner={item.owner}
                    />
                  );
                })}
            </Grid>
          </InfiniteScroll>
        </div>
      </div>
      {collection && showModalEdit && (
        <ModalEdit
          collection={collection}
          show={showModalEdit}
          handleClose={() => setShowModalEdit(false)}
          onUpdateSuccess={() => fetchCollectionDetail()}
        />
      )}
      {collection && showModalMint && (
        <ModalMint
          collection={collection}
          show={showModalMint}
          handleClose={() => setShowModalMint(false)}
          onUpdateSuccess={() => fetchCollectionDetail()}
        />
      )}
      {collection && showModalTransfer && (
        <ModalTransfer
          collection={collection}
          show={showModalTransfer}
          handleClose={() => setShowModalTransfer(false)}
          onUpdateSuccess={() => fetchCollectionDetail()}
        />
      )}
    </Container>
  );
};

export default React.memo(Collection);
