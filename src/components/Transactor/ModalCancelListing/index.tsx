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

const ModalCancelListing = ({ show, handleClose, inscription }: IProps) => {
  const [processing, setProcessing] = useState(false);

  return (
    <TransactorBaseModal
      title={'Cancel listing?'}
      show={show}
      handleClose={handleClose}
    >
      <p>
        This will cancel your listing. You will also be asked to confirm this
        cancelation from your wallet
      </p>
      <div className="form-item">
        <EstimatedFee txSize={TRANSFER_TX_SIZE} />
      </div>
      <div className="action-wrapper">
        <div className="multi-btn">
          <SubmitButton onClick={handleClose}>Close</SubmitButton>
          <SubmitButton className="secondary" disabled={processing} type="submit">
            {processing ? 'Processing...' : 'Yes'}
          </SubmitButton>
        </div>
      </div>
    </TransactorBaseModal>
  );
};

export default ModalCancelListing;
