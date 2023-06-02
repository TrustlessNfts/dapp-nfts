import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import ERC20ABIJson from '@/abis/erc20.json';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';
import { Transaction } from 'ethers';
import { AssetsContext } from '@/contexts/assets-context';
import BigNumber from 'bignumber.js';
import * as TC_SDK from 'trustless-computer-sdk';
import { formatBTCPrice } from '@/utils/format';
import { getContract } from '@/utils';
import logger from '@/services/logger';
import { TRANSFER_TX_SIZE } from '@/configs';

export interface IApproveTokenAmountParams {
  tokenAddress: string;
  consumerAddress: string;
  amount: string;
}

const useApproveTokenAmount: ContractOperationHook<
  IApproveTokenAmountParams,
  Transaction | null
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IApproveTokenAmountParams): Promise<Transaction | null> => {
      const { tokenAddress, consumerAddress, amount } = params;
      logger.debug('useApproveTokenAmount', params);

      if (account && provider) {
        const contract = getContract(
          tokenAddress,
          ERC20ABIJson.abi,
          provider,
          account,
        );
        
        logger.debug({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
          tokenAddress,
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

        const transaction = await contract
          .connect(provider.getSigner())
          .approve(consumerAddress, amount);
        return transaction;
      }

      return null;
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC20,
    operationName: 'Approve Token Amount',
  };
};

export default useApproveTokenAmount;
