import EstimatedFee from '@/components/EstimatedFee';
import { TC_MARKETPLACE_CONTRACT } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import useAcceptTokenOffer, {
  IAcceptTokenOfferParams,
} from '@/hooks/contract-operations/marketplace/useAcceptTokenOffer';
import useSetApprovalForAll, {
  ISetApprovalForAllParams,
} from '@/hooks/contract-operations/marketplace/useSetApprovalForAll';
import useIsApprovedForAll, {
  IIsApprovedForAllParams,
} from '@/hooks/contract-operations/nft/useIsApprovedForAll';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { IInscriptionOffer } from '@/interfaces/api/inscription';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import {
  checkCacheApprovalPermission,
  setCacheApprovalPermission,
} from '@/utils/marketplace-storage';
import { showToastError, showToastSuccess } from '@/utils/toast';
import { Transaction } from 'ethers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import TransactorBaseModal from '../TransactorBaseModal';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscriptionOffer | null;
}

const ModalAcceptOffer = ({ show, handleClose, inscription }: IProps) => {
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const { run: isTokenApproved } = useContractOperation<
    IIsApprovedForAllParams,
    boolean
  >({
    operation: useIsApprovedForAll,
    inscribeable: false,
  });
  const { run: setApprovalForAll } = useContractOperation<
    ISetApprovalForAllParams,
    Transaction | null
  >({
    operation: useSetApprovalForAll,
    inscribeable: false,
  });
  const { run: acceptTokenOffer } = useContractOperation<
    IAcceptTokenOfferParams,
    Transaction | null
  >({
    operation: useAcceptTokenOffer,
    inscribeable: true,
  });

  const handleAcceptOffer = async () => {
    if (processing || !inscription) return;

    if (!user?.walletAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    try {
      setProcessing(true);

      const isApproved = await isTokenApproved({
        contractAddress: inscription.collectionContract,
        operatorAddress: TC_MARKETPLACE_CONTRACT,
      });
      const hasApprovalCache = checkCacheApprovalPermission(
        `${user.walletAddress}_${TC_MARKETPLACE_CONTRACT}_${inscription.collectionContract}`
      );
      if (!isApproved && !hasApprovalCache) {
        logger.debug(TC_MARKETPLACE_CONTRACT);
        logger.debug(inscription.collectionContract);

        await setApprovalForAll({
          operatorAddress: TC_MARKETPLACE_CONTRACT,
          contractAddress: inscription.collectionContract,
        });

        setCacheApprovalPermission(
          `${user.walletAddress}_${TC_MARKETPLACE_CONTRACT}_${inscription.collectionContract}`
        );
      }

      await acceptTokenOffer({
        offerId: inscription.offeringId,
      });
      showToastSuccess({
        message:
          'Please go to your wallet to authorize the request for the Bitcoin transaction.',
      });
      handleClose();
    } catch (err: unknown) {
      logger.error(err);
      showToastError({
        message: (err as Error).message,
      });
    } finally {
      setProcessing(false);
    }
  };

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
        <EstimatedFee />
      </div>
      <div className="action-wrapper">
        <SubmitButton onClick={handleAcceptOffer} disabled={processing}>
          {processing ? 'Processing...' : 'Confirm'}
        </SubmitButton>
      </div>
    </TransactorBaseModal>
  );
};

export default ModalAcceptOffer;
