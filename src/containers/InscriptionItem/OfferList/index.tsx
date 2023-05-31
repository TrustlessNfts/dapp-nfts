import Table from '@/components/Table';
import { IInscriptionOffer } from '@/interfaces/api/inscription';
import { shortenAddress } from '@/utils';
import { formatEthPrice } from '@/utils/format';
import React from 'react';
import { StyledOfferList } from './OfferList.styled';
import Button from '@/components/Button';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';
import { TransactionEventType } from '@/enums/transaction';

type Props = {
  offers: IInscriptionOffer[];
  isOwner: boolean;
  setTransactionType: (type: TransactionEventType | null) => void;
  setShowModal: (show: boolean) => void;
};

const OfferList = ({ offers, isOwner, setTransactionType, setShowModal }: Props) => {
  const { tcAddress: userTcWallet } = useSelector(getUserSelector);

  const handleShowModal = (type: TransactionEventType) => {
    setTransactionType(type);
    setShowModal(true);
  };

  const tableData = offers?.map((offer) => {
    // const { amount, userAAddress, userBAddress, type, offeringId } = activity;
    const { buyer, offeringId, createdAt, price } = offer;

    const isOfferer = userTcWallet === buyer;

    const dateFormatter = Intl.DateTimeFormat('sv-SE');

    return {
      id: offeringId,
      render: {
        price: (
          <div className={'offer-amount'}>
            {price > 0 ? `${formatEthPrice(price)}` : '-'}
            {price > 0 && <span> TC</span>}
          </div>
        ),
        offerAt: (
          <div className={'offer-at'}>
            {createdAt ? dateFormatter.format(new Date(createdAt)) : '-'}
          </div>
        ),
        buyer: (
          <div className={'offer-buyer'}>{buyer ? shortenAddress(buyer) : '-'}</div>
        ),
        action: (
          <div className={'offer-action'}>
            {isOwner && (
              <Button
                bg="transparent"
                background="transparent"
                className="accept-btn"
                onClick={() => handleShowModal(TransactionEventType.ACCEPT_OFFER)}
              >
                Accept
              </Button>
            )}
            {isOfferer && (
              <>
                <Button
                  bg="transparent"
                  background="transparent"
                  className="cancel-btn"
                  onClick={() => handleShowModal(TransactionEventType.CANCEL_OFFER)}
                >
                  Cancel
                </Button>
                <Button
                  bg="transparent"
                  background="transparent"
                  className="offer-btn"
                  onClick={() => handleShowModal(TransactionEventType.OFFER)}
                >
                  Make Again
                </Button>
              </>
            )}
          </div>
        ),
      },
    };
  });

  if (!offers) return null;

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
