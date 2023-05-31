import React, { useState } from 'react';
import TransactorBaseModal from '../TransactorBaseModal';
import { IInscription } from '@/interfaces/api/inscription';
import Text from '@/components/Text';
import EstimatedFee from '@/components/EstimatedFee';
import { TRANSFER_TX_SIZE } from '@/configs';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscription;
}

const ModalAcceptOffer = ({ show, handleClose, inscription }: IProps) => {
  const [processing, setProcessing] = useState(false);

  return (
    <TransactorBaseModal
      title={'Accept this offer'}
      show={show}
      handleClose={handleClose}
    >
      <p>
        You will accept this token offer. You will also be asked to confirm this
        acceptance from your wallet.
      </p>
      <div className="form-item">
        <EstimatedFee txSize={TRANSFER_TX_SIZE} />
      </div>
      <div className="action-wrapper">
        <SubmitButton disabled={processing} type="submit">
          {processing ? 'Processing...' : 'Confirm'}
        </SubmitButton>
      </div>
    </TransactorBaseModal>
  );
};

export default ModalAcceptOffer;
