import Table from '@/components/Table';
import { TokenActivityType } from '@/enums/transaction';
import { IInscriptionActivity } from '@/interfaces/api/inscription';
import { shortenAddress } from '@/utils';
import { formatEthPrice, mappingERC20ToSymbol } from '@/utils/format';
import React from 'react';
import { StyledActivityList } from './ActivityList.styled';
import Link from 'next/link';

type Props = {
  activities: IInscriptionActivity[];
};

const ActivityList = ({ activities }: Props) => {
  if (!activities) return null;

  const tableData = activities?.map((activity) => {
    const { amount, userAAddress, userBAddress, type, offeringId, erc20Address } =
      activity;

    const isMintActivity = userAAddress?.startsWith('0x000000');

    return {
      id: offeringId,
      render: {
        event: (
          <div className={'activity-event'}>
            {isMintActivity
              ? TokenActivityType[TokenActivityType.Mint]
              : TokenActivityType[type]}
          </div>
        ),

        price: (
          <div className={'activity-amount'}>
            {amount > 0 ? `${formatEthPrice(amount)}` : '-'}
            {amount > 0 && <span> {mappingERC20ToSymbol(erc20Address)}</span>}
          </div>
        ),
        seller: (
          <div className={'activity-address'}>
            <Link
              href={`https://explorer.trustless.computer/address/${userAAddress}`}
              target="_blank"
            >
              {userAAddress ? shortenAddress(userAAddress) : '-'}
            </Link>
          </div>
        ),
        buyer: (
          <div className={'activity-address'}>
            <Link
              href={`https://explorer.trustless.computer/address/${userBAddress}`}
              target="_blank"
            >
              {userBAddress ? shortenAddress(userBAddress) : '-'}
            </Link>
          </div>
        ),
      },
    };
  });

  return (
    <StyledActivityList>
      <Table
        tableHead={['event', 'price', 'from', 'to']}
        data={tableData}
        className="activity-table"
      />
    </StyledActivityList>
  );
};

export default React.memo(ActivityList);
