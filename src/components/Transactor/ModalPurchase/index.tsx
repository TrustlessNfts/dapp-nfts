import EstimatedFee from '@/components/EstimatedFee';
import { TC_MARKETPLACE_CONTRACT } from '@/configs';
import { MAX_HEX_VALUE } from '@/constants/common';
import { ROUTE_PATH } from '@/constants/route-path';
import useApproveTokenAmount, {
  IApproveTokenAmountParams,
} from '@/hooks/contract-operations/erc20/useApproveTokenAmount';
import useGetAllowanceAmount, {
  IGetAllowanceAmountParams,
} from '@/hooks/contract-operations/erc20/useGetAllowanceAmount';
import usePurchaseToken, {
  IPurchaseTokenParams,
} from '@/hooks/contract-operations/marketplace/usePurchaseToken';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { IInscription } from '@/interfaces/api/inscription';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import { formatEthPrice, mappingERC20ToSymbol } from '@/utils/format';
import {
  checkCacheApprovalTokenPermission,
  setCacheApprovalTokenPermission,
} from '@/utils/marketplace-storage';
import { showToastError, showToastSuccess } from '@/utils/toast';
import BigNumber from 'bignumber.js';
import { Transaction } from 'ethers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import TransactorBaseModal from '../TransactorBaseModal';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscription | null;
}

const ModalPurchase = ({ show, handleClose, inscription }: IProps) => {
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const { run: getAllowanceAmount } = useContractOperation<
    IGetAllowanceAmountParams,
    number
  >({
    operation: useGetAllowanceAmount,
    inscribeable: false,
  });
  const { run: approveTokenAmount } = useContractOperation<
    IApproveTokenAmountParams,
    Transaction | null
  >({
    operation: useApproveTokenAmount,
    inscribeable: false,
  });
  const { run: purchaseToken } = useContractOperation<
    IPurchaseTokenParams,
    Transaction | null
  >({
    operation: usePurchaseToken,
    inscribeable: true,
  });

  if (!inscription?.listingForSales) return <></>;

  const listingInfo = inscription?.listingForSales[0];

  const hanlePurchaseToken = async (): Promise<void> => {
    if (processing) return;

    if (!user?.walletAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    try {
      setProcessing(true);
      const allowanceAmount = await getAllowanceAmount({
        contractAddress: listingInfo.erc20Token,
        operatorAddress: TC_MARKETPLACE_CONTRACT,
      });
      const allowanceAmountBN = new BigNumber(allowanceAmount);
      const hasApprovalCache = checkCacheApprovalTokenPermission(
        `${TC_MARKETPLACE_CONTRACT}_${listingInfo.erc20Token}`,
      );

      logger.debug('allowanceAmountBN', allowanceAmountBN.toString());
      logger.debug('hasApprovalCache', hasApprovalCache);

      if (!allowanceAmountBN.isGreaterThan(listingInfo.price) && !hasApprovalCache) {
        logger.debug(TC_MARKETPLACE_CONTRACT);
        logger.debug(inscription.collectionAddress);

        await approveTokenAmount({
          tokenAddress: listingInfo.erc20Token,
          consumerAddress: TC_MARKETPLACE_CONTRACT,
          amount: MAX_HEX_VALUE,
        });

        setCacheApprovalTokenPermission(
          `${TC_MARKETPLACE_CONTRACT}_${listingInfo.erc20Token}`,
        );
      }

      await purchaseToken({
        offerId: listingInfo.offeringId,
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
        <EstimatedFee />
      </div>
      <div className="action-wrapper">
        <SubmitButton disabled={processing} onClick={hanlePurchaseToken}>
          {processing ? 'Processing...' : 'Confirm'}
        </SubmitButton>
      </div>
    </TransactorBaseModal>
  );
};

export default ModalPurchase;
