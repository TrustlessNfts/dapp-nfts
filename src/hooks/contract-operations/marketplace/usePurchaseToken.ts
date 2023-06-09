import MarketplaceABIJson from '@/abis/marketplace.json';
import { TC_MARKETPLACE_CONTRACT, TRANSFER_TX_SIZE } from '@/configs';
import { AssetsContext } from '@/contexts/assets-context';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import logger from '@/services/logger';
import { getContract } from '@/utils';
import { formatBTCPrice } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Transaction } from 'ethers';
import { useCallback, useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';

export interface IPurchaseTokenParams {
  offerId: string;
}

const usePurchaseToken: ContractOperationHook<
  IPurchaseTokenParams,
  Transaction | null
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IPurchaseTokenParams): Promise<Transaction | null> => {
      logger.debug('usePurchaseToken', params);
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
          feeRatePerByte: feeRate.hourFee,
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
          .purchaseToken(offerIdBytes32, {
            gasLimit: '500000',
          });

        return transaction;
      }

      return null;
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    operationName: 'Purchase Token',
  };
};

export default usePurchaseToken;
