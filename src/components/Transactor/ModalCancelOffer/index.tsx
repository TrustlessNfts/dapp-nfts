import React, { useState } from 'react';
import TransactorBaseModal from '../TransactorBaseModal';
import { IInscriptionOffer } from '@/interfaces/api/inscription';
import EstimatedFee from '@/components/EstimatedFee';
import { TRANSFER_TX_SIZE } from '@/configs';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';
import { ROUTE_PATH } from '@/constants/route-path';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import { showToastSuccess, showToastError } from '@/utils/toast';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import useCancelTokenOffer, { ICancelTokenOfferParams } from '@/hooks/contract-operations/marketplace/useCancelTokenOffer';
import { Transaction } from 'ethers'

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscriptionOffer | null;
}

const ModalCancelOffer = ({ show, handleClose, inscription }: IProps) => {
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const { run: cancelTokenOffer } = useContractOperation<
    ICancelTokenOfferParams,
    Transaction | null
  >({
    operation: useCancelTokenOffer,
    inscribeable: true,
  });

  const handleCancelOffer = async () => {
    if (processing || !inscription) return;

    if (!user?.walletAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    try {
      setProcessing(true);
      await cancelTokenOffer({
        offerId: inscription.offeringId,
      })
      showToastSuccess({
        message: 'Please go to your wallet to authorize the request for the Bitcoin transaction.'
      })
      handleClose();
    } catch (err: unknown) {
      logger.error(err);
      showToastError({
        message: (err as Error).message
      })
    } finally {
      setProcessing(false);
    }
  }

  if (!inscription) {
    return <></>;
  }

  return (
    <TransactorBaseModal
      title={'Cancel offer?'}
      show={show}
      handleClose={handleClose}
    >
      <p>
        This will cancel your offer. You will also be asked to confirm this
        cancelation from your wallet
      </p>
      <div className="form-item">
        <EstimatedFee txSize={TRANSFER_TX_SIZE} />
      </div>
      <div className="action-wrapper">
        <div className="multi-btn">
          <SubmitButton onClick={handleClose}>Close</SubmitButton>
          <SubmitButton
            onClick={handleCancelOffer}
            className="secondary"
            disabled={processing}>
            {processing ? 'Processing...' : 'Confirm'}
          </SubmitButton>
        </div>
      </div>
    </TransactorBaseModal>
  );
};

export default ModalCancelOffer;
