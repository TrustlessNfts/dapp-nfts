/* eslint-disable jsx-a11y/anchor-is-valid */
import IconSVG from '@/components/IconSVG';
import NFTCard from '@/components/NFTCard';
import { ARTIFACT_CONTRACT, CDN_URL } from '@/configs';
import { ICollection } from '@/interfaces/api/collection';
import { getCollections } from '@/services/nft-explorer';
import { shortenAddress } from '@/utils';
import { debounce } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, Grid } from './List.styled';

const LIMIT_PAGE = 32;

const Collections = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [isShowAll, setIsShowAll] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, [isShowAll]);

  const fetchCollections = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const data = await getCollections(page, LIMIT_PAGE, isShowAll);
      if (isFetchMore) {
        setCollections((prev) => [...prev, ...data]);
      } else {
        setCollections(data);
      }
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  const onLoadMoreCollections = () => {
    if (isFetching || collections.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(collections.length / LIMIT_PAGE) + 1;
    fetchCollections(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreCollections, 300);

  const showCollections = useMemo(
    () =>
      collections.filter(
        (item) => item.contract !== ARTIFACT_CONTRACT.toLocaleLowerCase(),
      ),
    [collections],
  );

  return (
    <Container>
      <div className="showAll" onClick={() => setIsShowAll(!isShowAll)}>
        {isShowAll ? (
          <IconSVG
            src={`${CDN_URL}/icons/ic-checkedbox.svg`}
            color="white"
            maxWidth="24px"
          ></IconSVG>
        ) : (
          <IconSVG
            src={`${CDN_URL}/icons/ic-checkbox.svg`}
            color="white"
            type="stroke"
            maxWidth="24px"
          ></IconSVG>
        )}
        <p>Show all</p>
      </div>
      <InfiniteScroll
        className="list"
        dataLength={showCollections.length}
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
        <Grid className="nft-list">
          {showCollections.length > 0 &&
            showCollections.map((item) => {
              return (
                <NFTCard
                  key={item.id}
                  href={`/collection?contract=${item.contract}`}
                  thumbnail={item.thumbnail}
                  title1={item.name || shortenAddress(item.contract, 6)}
                  title2={shortenAddress(item.creator, 4)}
                  title3={`Collection #${item.index}`}
                />
              );
            })}
        </Grid>
      </InfiniteScroll>
    </Container>
  );
};

export default React.memo(Collections);
