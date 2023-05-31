import Table from '@/components/Table';
import { TokenActivityType } from '@/enums/transaction';
import { IInscriptionActivity } from '@/interfaces/api/inscription';
import { shortenAddress } from '@/utils';
import { formatEthPrice } from '@/utils/format';
import React from 'react';
import { StyledActivityList } from './ActivityList.styled';

type Props = {
  activities: IInscriptionActivity[];
};

const ActivityList = ({ activities }: Props) => {
  if (!activities) return null;

  const tableData = activities?.map((activity) => {
    const { amount, userAAddress, userBAddress, type, offeringId } = activity;

    return {
      id: offeringId,
      render: {
        event: <div className={'activity-event'}>{TokenActivityType[type]}</div>,

        price: (
          <div className={'activity-amount'}>
            {amount > 0 ? `${formatEthPrice(amount)}` : '-'}
            {amount > 0 && <span> TC</span>}
          </div>
        ),
        seller: (
          <div className={'activity-address'}>
            {userAAddress ? shortenAddress(userAAddress) : '-'}
          </div>
        ),
        buyer: (
          <div className={'activity-address'}>
            {userBAddress ? shortenAddress(userBAddress) : '-'}
          </div>
        ),
      },
    };
  });

  return (
    <StyledActivityList>
      <Table
        tableHead={['event', 'price', 'seller', 'buyer']}
        data={tableData}
        className="activity-table"
      />
    </StyledActivityList>
  );
};

export default React.memo(ActivityList);
