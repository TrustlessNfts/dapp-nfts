import Table from '@/components/Table';
import { TokenActivityType } from '@/enums/transaction';
import { getEndingOfAddress } from '@/utils';
import { formatEthPrice, mappingERC20ToIcon } from '@/utils/format';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import logger from '@/services/logger';
import { getCollectionActivityList } from '@/services/marketplace';
import { useRouter } from 'next/router';
import { ICollection, ICollectionActivity } from '@/interfaces/api/marketplace';
import { StyledActivityList, Wrapper } from './ActivityList.styled';
import InfiniteScroll from 'react-infinite-scroll-component';
import BigNumber from 'bignumber.js';
import { Spinner } from 'react-bootstrap';
import { ROUTE_PATH } from '@/constants/route-path';
import ImageWrapper from '@/components/ImageWrapper';

interface IProps {
  collection: ICollection | null;
}

const FETCH_LIMIT = 32;

const ActivityList: React.FC<IProps> = ({ collection }: IProps) => {
  const router = useRouter();
  const { contract } = router.query as {
    contract: string;
  };
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Array<ICollectionActivity>>([]);
  const [hasMore, setHasMore] = useState(true);
  console.log('len', activities.length)

  const fetchActivities = async (p?: number): Promise<void> => {
    if (!contract) return;

    try {
      setLoading(true);
      const page = p || (Math.floor(activities.length / FETCH_LIMIT) + 1);
      const res = await getCollectionActivityList({
        page,
        limit: FETCH_LIMIT,
        contract_address: contract,
      });


      if (res.length < FETCH_LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (page === 1) {
        setActivities(res);
      } else {
        setActivities(prev => [...prev, ...res]);
      }
    } catch (err: unknown) {
      logger.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivities();
  }, [contract]);

  const tableData = activities?.map((activity, index) => {
    const { amount, userAAddress, userBAddress, type, erc20Address } =
      activity;

    const isMintActivity = userAAddress?.startsWith('0x000000');
    const amountBN = new BigNumber(amount);

    return {
      id: index.toString(),
      render: {
        info: (
          <div className='info-wrapper'>
            <div className="thumbnail-wrapper">
              <Link href={`${ROUTE_PATH.COLLECTION}/${activity.collectionContract}/token/${activity.tokenId}`}>
                <ImageWrapper className='token-thumbnail' src={activity.thumbnail} alt={activity.tokenId} />
              </Link>
            </div>
            <div className="token-info">
              <Link href={`${ROUTE_PATH.COLLECTION}/${activity.collectionContract}/token/${activity.tokenId}`} className='token-id'>{`#${activity.tokenId}`}</Link>
            </div>
          </div>
        ),

        price: (
          <div className={'activity-amount'}>
            {amountBN.isGreaterThan(0) ? (
            <>
            <span>{formatEthPrice(amount)}</span>
            <img className='token-icon' src={mappingERC20ToIcon(erc20Address)} alt="token icon" />
            </>
            ) : (
              <span>-</span>
            )}
          </div>
        ),
        seller: (
          <>
            {userAAddress ?
              <Link
                href={`https://explorer.trustless.computer/address/${userAAddress}`}
                target="_blank"
              >
                {getEndingOfAddress(userAAddress)}
              </Link>
              : (
                <span>-</span>
              )}
          </>
        ),
        buyer: (
          <>
            {userBAddress ?
              <Link
                href={`https://explorer.trustless.computer/address/${userBAddress}`}
                target="_blank"
              >
                {getEndingOfAddress(userBAddress)}
              </Link>
              : (
                <span>-</span>
              )}
          </>
        ),

        event: (
          <div className={'activity-event'}>
            {isMintActivity
              ? TokenActivityType[TokenActivityType.Mint]
              : TokenActivityType[type]}
          </div>
        ),
      },
    };
  });

  return (
    <Wrapper>
      <div className="table-header">
        <p className="table-name">Activity</p>
      </div>
      <div className="data-list">
        <InfiniteScroll
          dataLength={activities.length}
          next={fetchActivities}
          hasMore={hasMore}
          height={600}
          style={{ overflow: 'hidden auto' }}
          loader={loading ?
            (
              <div className="loading-wrapper">
                <Spinner variant='light' />
              </div>
            ) : <></>
          }
        >
          <StyledActivityList>
            <Table
              tableHead={[`${(collection && collection.totalSales > 0) ? `${collection.totalSales} listed` : 'Items'}`, 'price', 'from', 'to', 'event']}
              data={tableData}
              className="activity-table"
            />
          </StyledActivityList>
        </InfiniteScroll>
      </div>
    </Wrapper>
  );
};

export default React.memo(ActivityList);
