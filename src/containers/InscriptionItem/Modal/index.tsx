import React from 'react';
import { StyledOfferModal } from './OfferModal.styled';
import { TransactionEventType } from '@/enums/transaction';

type Props = {
  show: boolean;
  handleClose: () => void;
  type: TransactionEventType | null;
};

const InscriptionModal = (props: Props) => {
  const { show = false, handleClose, type } = props;

  const renderModalContent = () => {
    switch (type) {
      case TransactionEventType.BUY:
        return <div>Buy</div>;
      case TransactionEventType.OFFER:
        return <div>Make Offer</div>;
      case TransactionEventType.CANCEL_OFFER:
        return <div>Cancel</div>;
      case TransactionEventType.ACCEPT_OFFER:
        return <div>Accept</div>;
      default:
        return null;
    }
  };

  return (
    <StyledOfferModal show={show} onHide={handleClose} centered>
      {renderModalContent()}
    </StyledOfferModal>
  );
};

export default InscriptionModal;
