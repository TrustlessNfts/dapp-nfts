/* eslint-disable */
import React, { useState } from 'react';
import TransactorBaseModal from '../TransactorBaseModal';
import { IInscription } from '@/interfaces/api/inscription';
import EstimatedFee from '@/components/EstimatedFee';
import { TRANSFER_TX_SIZE } from '@/configs';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';
import { ROUTE_PATH } from '@/constants/route-path';
import { getUserSelector } from '@/state/user/selector';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
// import useCancelListingToken, { ICancelListingTokenParams } from '@/hooks/contract-operations/marketplace/useCancelListingToken';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { showToastError, showToastSuccess } from '@/utils/toast';
import logger from '@/services/logger';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscription;
}

const ModalCancelListing = ({ show, handleClose, inscription }: IProps) => {
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  // const { run: cancelListing } = useContractOperation<
  //   ICancelListingTokenParams,
  //   IRequestSignResp | null
  // >({
  //   operation: useCancelListingToken,
  // });

  if (!inscription.listingForSales) return <></>;
  const listingInfo = inscription?.listingForSales[0];

  const handleCancelListing = async () => {
    if (processing) return;

    if (!user?.walletAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    try {
      setProcessing(true);
      // await cancelListing({
      //   offerId: listingInfo.offeringId,
      // })
      showToastSuccess({
        message: 'Canceled listing successlly.'
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

  if (!listingInfo) {
    return <></>;
  }

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
          <SubmitButton
            onClick={handleCancelListing}
            className="secondary"
            disabled={processing}>
            {processing ? 'Processing...' : 'Confirm'}
          </SubmitButton>
        </div>
      </div>
    </TransactorBaseModal>
  );
};

export default ModalCancelListing;
