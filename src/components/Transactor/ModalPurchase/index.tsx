import React, { useState } from 'react';
import TransactorBaseModal from '../TransactorBaseModal';
import { IInscription } from '@/interfaces/api/inscription';
import EstimatedFee from '@/components/EstimatedFee';
import { TRANSFER_TX_SIZE } from '@/configs';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';
import { formatEthPrice, mappingERC20ToSymbol } from '@/utils/format';
import usePurchaseToken, { IPurchaseTokenParams } from '@/hooks/contract-operations/marketplace/usePurchaseToken';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { showToastError, showToastSuccess } from '@/utils/toast';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscription;
}

const ModalPurchase = ({ show, handleClose, inscription }: IProps) => {
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const { run: purchaseToken } = useContractOperation<
    IPurchaseTokenParams,
    IRequestSignResp | null
  >({
    operation: usePurchaseToken,
  });

  if (!inscription.listingForSales) return <></>;

  const listingInfo = inscription?.listingForSales[0];

  const hanlePurchaseToken = async (): Promise<void> => {
    if (processing) return;
    
    if (!user.tcAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    try {
      setProcessing(true);
      await purchaseToken({
        offerId: listingInfo.offeringId,
      })
      showToastSuccess({
        message: 'Purchased successlly.'
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
  };

  if (!listingInfo) {
    return <></>;
  }

  return (
    <TransactorBaseModal
      title={'Purchase token'}
      show={show}
      handleClose={handleClose}
    >
      <p className={'tokenPrice'}>
        Price:{' '}
        <b>{`${formatEthPrice(listingInfo.price)} ${mappingERC20ToSymbol(
          listingInfo.erc20Token,
        )}`}</b>
      </p>
      <div className="form-item">
        <EstimatedFee txSize={TRANSFER_TX_SIZE} />
      </div>
      <div className="action-wrapper">
        <SubmitButton
          disabled={processing}
          onClick={hanlePurchaseToken}
        >
          {processing ? 'Processing...' : 'Confirm'}
        </SubmitButton>
      </div>
    </TransactorBaseModal>
  );
};

export default ModalPurchase;
