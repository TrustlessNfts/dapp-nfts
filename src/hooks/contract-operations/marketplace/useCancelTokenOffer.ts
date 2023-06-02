import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import MarketplaceABIJson from '@/abis/marketplace.json';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';
import { Transaction } from 'ethers';
import { AssetsContext } from '@/contexts/assets-context';
import BigNumber from 'bignumber.js';
import * as TC_SDK from 'trustless-computer-sdk';
import { formatBTCPrice } from '@/utils/format';
import { getContract } from '@/utils';
import logger from '@/services/logger';
import { TC_MARKETPLACE_CONTRACT, TRANSFER_TX_SIZE } from '@/configs';

export interface ICancelTokenOfferParams {
  offerId: string;
}

const useCancelTokenOffer: ContractOperationHook<
  ICancelTokenOfferParams,
  Transaction | null
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: ICancelTokenOfferParams): Promise<Transaction | null> => {
      logger.debug('useCancelTokenOffer', params);
      const { offerId } = params;

      if (account && provider) {
        const contract = getContract(
          TC_MARKETPLACE_CONTRACT,
          MarketplaceABIJson.abi,
          provider,
          account,
        );

        logger.debug({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
          contractAddress: TC_MARKETPLACE_CONTRACT,
        });

        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
        });

        const balanceInBN = new BigNumber(btcBalance);
        if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
          throw Error(
            `Your balance is insufficient. Please top up at least ${formatBTCPrice(
              estimatedFee.totalFee.toString(),
            )} BTC to pay network fee.`,
          );
        }

        const offerIdBytes32 = '0x' + offerId;

        const transaction = await contract
          .connect(provider.getSigner())
          .cancelMakeOffer(offerIdBytes32);

        return transaction;
      }

      return null;
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    operationName: 'Cancel Token Offer',
  };
};

export default useCancelTokenOffer;
