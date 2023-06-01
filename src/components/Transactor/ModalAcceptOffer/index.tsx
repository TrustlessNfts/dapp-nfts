/* eslint-disable */
import React, { useState } from 'react';
import TransactorBaseModal from '../TransactorBaseModal';
import { IInscriptionOffer } from '@/interfaces/api/inscription';
import EstimatedFee from '@/components/EstimatedFee';
import { TC_MARKETPLACE_CONTRACT, TRANSFER_TX_SIZE } from '@/configs';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';
import { ROUTE_PATH } from '@/constants/route-path';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import { showToastSuccess, showToastError } from '@/utils/toast';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
// import useAcceptTokenOffer, { IAcceptTokenOfferParams } from '@/hooks/contract-operations/marketplace/useAcceptTokenOffer';
// import useSetApprovalForAll, { ISetApprovalForAllParams } from '@/hooks/contract-operations/marketplace/useSetApprovalForAll';
// import useIsApprovedForAll, { IIsApprovedForAllParams } from '@/hooks/contract-operations/nft/useIsApprovedForAll';
import { checkCacheApprovalPermission, setCacheApprovalPermission } from '@/utils/marketplace-storage';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscriptionOffer | null;
}

const ModalAcceptOffer = ({ show, handleClose, inscription }: IProps) => {
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  // const { run: isTokenApproved } = useContractOperation<
  //   IIsApprovedForAllParams,
  //   boolean
  // >({
  //   operation: useIsApprovedForAll,
  // });
  // const { run: setApprovalForAll } = useContractOperation<
  //   ISetApprovalForAllParams,
  //   IRequestSignResp | null
  // >({
  //   operation: useSetApprovalForAll,
  // });
  // const { run: acceptTokenOffer } = useContractOperation<
  //   IAcceptTokenOfferParams,
  //   IRequestSignResp | null
  // >({
  //   operation: useAcceptTokenOffer,
  // });

  const handleAcceptOffer = async () => {
    if (processing || !inscription) return;

    if (!user?.walletAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    try {
      setProcessing(true);

      // const isApproved = await isTokenApproved({
      //   contractAddress: inscription.collectionContract,
      //   operatorAddress: TC_MARKETPLACE_CONTRACT
      // });
      // const hasApprovalCache = checkCacheApprovalPermission(`${TC_MARKETPLACE_CONTRACT}_${inscription.collectionContract}`);
      // if (!isApproved && !hasApprovalCache) {
      //   logger.debug(TC_MARKETPLACE_CONTRACT);
      //   logger.debug(inscription.collectionContract);

      //   await setApprovalForAll({
      //     operatorAddress: TC_MARKETPLACE_CONTRACT,
      //     contractAddress: inscription.collectionContract,
      //   })

      //   setCacheApprovalPermission(`${TC_MARKETPLACE_CONTRACT}_${inscription.collectionContract}`);
      // }
      
      // await acceptTokenOffer({
      //   offerId: inscription.offeringId,
      // })
      showToastSuccess({
        message: 'Accepted offer successlly.'
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
        <SubmitButton
          onClick={handleAcceptOffer}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Confirm'}
        </SubmitButton>
      </div>
    </TransactorBaseModal>
  );
};

export default ModalAcceptOffer;
