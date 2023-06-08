import Table from '@/components/Table';
import { TokenActivityType } from '@/enums/transaction';
import { shortenAddress } from '@/utils';
import { formatEthPrice, mappingERC20ToSymbol } from '@/utils/format';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import logger from '@/services/logger';
import { getCollectionActivityList } from '@/services/marketplace';
import { useRouter } from 'next/router';
import { ICollectionActivity } from '@/interfaces/api/marketplace';
import { StyledActivityList, Wrapper } from './ActivityList.styled';
import InfiniteScroll from 'react-infinite-scroll-component';

const FETCH_LIMIT = 32;

const ActivityList = () => {
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

    return {
      id: offeringId,
      render: {
        price: (
          <div className={'activity-amount'}>
            {amount > 0 ? `${formatEthPrice(amount)}` : '-'}
            {amount > 0 && <span> {mappingERC20ToSymbol(erc20Address)}</span>}
          </div>
        ),
        seller: (
          <div className={'activity-address'}>
            {userAAddress ?
              <Link
                href={`https://explorer.trustless.computer/address/${userAAddress}`}
                target="_blank"
              >
                {shortenAddress(userAAddress)}
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
                {shortenAddress(userBAddress)}
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
        loader={<></>}
      >
        <StyledActivityList>
          <Table
            tableHead={['price', 'from', 'to', 'event']}
            data={tableData}
            className="activity-table"
          />
        </StyledActivityList>
      </InfiniteScroll>
    </Wrapper>
  );
};

export default React.memo(ActivityList);
