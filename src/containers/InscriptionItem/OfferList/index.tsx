import Table from '@/components/Table';
import { IInscriptionOffer } from '@/interfaces/api/inscription';
import { shortenAddress } from '@/utils';
import { formatEthPrice, mappingERC20ToSymbol } from '@/utils/format';
import React from 'react';
import { StyledOfferList } from './OfferList.styled';
import Link from 'next/link';

type Props = {
  offers: IInscriptionOffer[];
};

const OfferList = ({ offers }: Props) => {
  if (!offers) return null;

  const tableData = offers?.map((offer) => {
    // const { amount, userAAddress, userBAddress, type, offeringId } = activity;
    const { buyer, offeringId, createdAt, price, erc20Token } = offer;
    const dateFormatter = Intl.DateTimeFormat('sv-SE');
    return {
      id: offeringId,
      render: {
        price: (
          <div className={'offer-amount'}>
            {price > 0 ? `${formatEthPrice(price)}` : '-'}
            {price > 0 && <span> {mappingERC20ToSymbol(erc20Token)}</span>}
          </div>
        ),
        offerAt: (
          <div className={'offer-at'}>
            {' '}
            {createdAt ? dateFormatter.format(new Date(createdAt)) : '-'}
          </div>
        ),
        buyer: (
          <div className={'offer-buyer'}>
            {buyer ? (
              <Link
                href={`https://explorer.trustless.computer/address/${buyer}`}
                target="_blank"
              >
                {shortenAddress(buyer)}
              </Link>
            ) : (
              '-'
            )}
          </div>
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
