import ERC721ABIJson from '@/abis/erc721.json';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import logger from '@/services/logger';
import { getContract } from '@/utils';
import { formatBTCPrice } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Transaction } from 'ethers';
import { useCallback, useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';

export interface IMintChunksParams {
  chunks: Buffer;
  contractAddress: string;
}

const useMintChunks: ContractOperationHook<
  IMintChunksParams,
  Transaction | null
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const estimateGas = useCallback(
    async (params: IMintChunksParams): Promise<string> => {
      if (account && provider) {
        const { chunks, contractAddress } = params;

        const contract = getContract(
          contractAddress,
          ERC721ABIJson.abi,
          provider,
          account,
        );
        const gasLimit = await contract.estimateGas.mintChunks(account, [chunks]);
        const gasLimitBN = new BigNumber(gasLimit.toString());
        const gasBuffer = gasLimitBN.times(1.1).decimalPlaces(0);
        logger.debug('useMintChunks estimate gas', gasBuffer.toString());
        return gasBuffer.toString();
      }
      return '1000000000';
    },
    [provider, account],
  );

  const call = useCallback(
    async (params: IMintChunksParams): Promise<Transaction | null> => {
      const { chunks, contractAddress } = params;
      if (account && provider && contractAddress) {
        const contract = getContract(
          contractAddress,
          ERC721ABIJson.abi,
          provider,
          account,
        );
        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: Buffer.byteLength(chunks),
          feeRatePerByte: feeRate.hourFee,
        });
        const balanceInBN = new BigNumber(btcBalance);
        if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
          throw Error(
            `Insufficient BTC balance. Please top up at least ${formatBTCPrice(
              estimatedFee.totalFee.toString(),
            )} BTC.`,
          );
        }
        const gasLimit = await estimateGas(params);
        const transaction = await contract.connect(provider.getSigner()).mintChunks(
          account,
          [chunks],
          {
            gasLimit,
          });

        return transaction;
      }

      return null;
    },
    [account, provider, btcBalance, estimateGas, feeRate.hourFee],
  );

  return {
    call: call,
    estimateGas: estimateGas,
    dAppType: DAppType.ERC721,
    operationName: TransactionEventType.MINT,
  };
};

export default useMintChunks;
