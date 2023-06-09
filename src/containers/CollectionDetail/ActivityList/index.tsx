import Table from '@/components/Table';
import { TokenActivityType } from '@/enums/transaction';
import { getEndingOfAddress, shortenAddress } from '@/utils';
import { formatEthPrice, mappingERC20ToSymbol } from '@/utils/format';
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

const ActivityList: React.FC<IProps> = ({collection}: IProps) => {
  const router = useRouter();
  const { contract } = router.query as {
    contract: string;
  };
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Array<ICollectionActivity>>([]);
  const [hasMore, setHasMore] = useState(false);

  const fetchActivities = async (): Promise<void> => {
    if (!contract) return;

    try {
      const res = await getCollectionActivityList({
        page: 1,
        limit: FETCH_LIMIT,
        contract_address: contract,
      })
      setActivities(res);
    } catch (err: unknown) {
      logger.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchActivities();
  }, [contract]);

  const tableData = activities?.map((activity) => {
    const { amount, userAAddress, userBAddress, type, offeringId, erc20Address } =
      activity;

    const isMintActivity = userAAddress?.startsWith('0x000000');
    const amountBN = new BigNumber(amount);
    console.log(activity)

    return {
      id: offeringId,
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
            {amountBN.isGreaterThan(0) ? `${formatEthPrice(amount)} ${mappingERC20ToSymbol(erc20Address)}` : '-'}
          </div>
        ),
        seller: (
          <div className={'activity-address'}>
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
          </div>
        ),
        buyer: (
          <div className={'activity-address'}>
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
          </div>
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
      <InfiniteScroll
        dataLength={activities.length}
        next={fetchActivities}
        hasMore={hasMore}
        height={500}
        style={{overflow: 'hidden auto'}}
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
            tableHead={[`${(collection && collection.totalSales > 0) ? `${collection.totalSales} listed` : 'Items' }`,'price', 'from', 'to', 'event']}
            data={tableData}
            className="activity-table"
          />
        </StyledActivityList>
      </InfiniteScroll>
    </Wrapper>
  );
};

export default React.memo(ActivityList);
