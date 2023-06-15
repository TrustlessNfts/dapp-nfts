import ImageWrapper from '@/components/ImageWrapper';
import Table from '@/components/Table';
import { ROUTE_PATH } from '@/constants/route-path';
import { TokenActivityType } from '@/enums/transaction';
import { ICollection, ICollectionActivity } from '@/interfaces/api/marketplace';
import { SelectOption } from '@/interfaces/select-input';
import logger from '@/services/logger';
import { getCollectionActivityList } from '@/services/marketplace';
import { getEndingOfAddress } from '@/utils';
import { formatEthPrice, mappingERC20ToIcon } from '@/utils/format';
import BigNumber from 'bignumber.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import Select, { SingleValue } from 'react-select';
import { StyledActivityList, Wrapper } from './ActivityList.styled';
import { StyledSelect } from '@/components/Dropdown/Select.styled';
import InfiniteLoading from '@/components/InfiniteLoading';

interface IProps {
  collection: ICollection | null;
}

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  {
    value: '1,2,5,6,7,8',
    label: 'All',
  },
  {
    value: '8',
    label: 'Purchases',
  },
  {
    value: '1',
    label: 'Listing',
  },
  {
    value: '5,6,7',
    label: 'Offers',
  },
];

const FETCH_LIMIT = 32;

const ActivityList: React.FC<IProps> = () => {
  const router = useRouter();
  const { contract } = router.query as {
    contract: string;
  };
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Array<ICollectionActivity>>([]);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState<string | null>('');

  const selectedOption = useMemo(() => {
    return SORT_OPTIONS.find((op) => sort === op.value) ?? SORT_OPTIONS[0];
  }, [sort]);

  const fetchActivities = async (p?: number): Promise<void> => {
    if (!contract) return;

    try {
      setLoading(true);
      const page = p || Math.floor(activities.length / FETCH_LIMIT) + 1;
      const res = await getCollectionActivityList({
        page,
        limit: FETCH_LIMIT,
        contract_address: contract,
        types: sort || SORT_OPTIONS[0].value,
      });

      if (res.length < FETCH_LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (page === 1) {
        setActivities(res);
      } else {
        setActivities((prev) => [...prev, ...res]);
      }
    } catch (err: unknown) {
      logger.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, sort]);

  const tableData = activities?.map((activity, index) => {
    const { amount, userAAddress, userBAddress, type, erc20Address } = activity;

    const isMintActivity = userAAddress?.startsWith('0x000000');
    const amountBN = new BigNumber(amount);

    return {
      id: index.toString(),
      config: {
        onClick: () =>
          router.push(
            `${ROUTE_PATH.COLLECTION}/${contract}/token/${activity.tokenId}`,
          ),
      },
      render: {
        info: (
          <div className="info-wrapper">
            <div className="thumbnail-wrapper">
              <Link
                href={`${ROUTE_PATH.COLLECTION}/${activity.collectionContract}/token/${activity.tokenId}`}
              >
                <ImageWrapper
                  className="token-thumbnail"
                  src={activity.thumbnail}
                  alt={activity.tokenId}
                />
              </Link>
            </div>
            <div className="token-info">
              <Link
                href={`${ROUTE_PATH.COLLECTION}/${activity.collectionContract}/token/${activity.tokenId}`}
                className="token-id"
              >{`#${activity.tokenId}`}</Link>
            </div>
          </div>
        ),

        price: (
          <div className={'activity-amount'}>
            {amountBN.isGreaterThan(0) ? (
              <>
                <span>{formatEthPrice(amount)}</span>
                <img
                  className="token-icon"
                  src={mappingERC20ToIcon(erc20Address)}
                  alt="token icon"
                />
              </>
            ) : (
              <span>-</span>
            )}
          </div>
        ),
        seller: (
          <>
            {userAAddress ? (
              <Link
                href={`https://explorer.trustless.computer/address/${userAAddress}`}
                target="_blank"
              >
                {getEndingOfAddress(userAAddress)}
              </Link>
            ) : (
              <span>-</span>
            )}
          </>
        ),
        buyer: (
          <>
            {userBAddress ? (
              <Link
                href={`https://explorer.trustless.computer/address/${userBAddress}`}
                target="_blank"
              >
                {getEndingOfAddress(userBAddress)}
              </Link>
            ) : (
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
        <StyledSelect className="filter-wrapper">
          <Select
            isSearchable={false}
            isClearable={false}
            defaultValue={selectedOption}
            options={SORT_OPTIONS}
            className={'select-input'}
            classNamePrefix="select"
            onChange={(op: SingleValue<SelectOption>) => {
              if (op) {
                setSort(op.value);
              }
            }}
          />
        </StyledSelect>
      </div>
      <div className="data-list disable-scrollbar">
        <StyledActivityList>
          <Table
            tableHead={[`Items`, 'price', 'from', 'to', 'event']}
            data={tableData}
            className="activity-table"
          />
          <InfiniteLoading
            fetchMoreData={fetchActivities}
            isLoading={loading}
            hasMoreData={hasMore}
          />
        </StyledActivityList>
      </div>
    </Wrapper>
  );
};

export default React.memo(ActivityList);
