import Table from '@/components/Table';
import { IInscriptionOffer } from '@/interfaces/api/inscription';
import { shortenAddress } from '@/utils';
import { formatEthPrice } from '@/utils/format';
import React from 'react';
import { StyledOfferList } from './OfferList.styled';

type Props = {
  offers: IInscriptionOffer[];
};

const OfferList = ({ offers }: Props) => {
  if (!offers) return null;

  const tableData = offers?.map((offer) => {
    // const { amount, userAAddress, userBAddress, type, offeringId } = activity;
    const { buyer, offeringId, createdAt, price } = offer;

    return {
      id: offeringId,
      render: {
        price: (
          <div className={'offer-amount'}>
            {price > 0 ? `${formatEthPrice(price)}` : '-'}
            {price > 0 && <span> TC</span>}
          </div>
        ),
        offerAt: <div className={'offer-at'}>{createdAt ? createdAt : '-'}</div>,
        buyer: (
          <div className={'offer-buyer'}>{buyer ? shortenAddress(buyer) : '-'}</div>
        ),
        action: (
          // <div className={'offer-action'}>
          //   <button>Accept</button>
          // </div>
          <></>
        ),
      },
    };
  });

  return (
    <StyledOfferList>
      <Table
        tableHead={['price', 'Date', 'from', '']}
        data={tableData}
        className="activity-table"
      />
    </StyledOfferList>
  );
};

export default React.memo(OfferList);
