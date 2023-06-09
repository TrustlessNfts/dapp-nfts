import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import ERC721ABIJson from '@/abis/erc721.json';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useContext } from 'react';
import { Transaction } from 'ethers';
import { AssetsContext } from '@/contexts/assets-context';
import BigNumber from 'bignumber.js';
import * as TC_SDK from 'trustless-computer-sdk';
import { formatBTCPrice } from '@/utils/format';
import { getContract } from '@/utils';
import { TransactionEventType } from '@/enums/transaction';
import logger from '@/services/logger';

export interface IMintBatchChunksParams {
  listOfChunks: Array<Buffer>;
  contractAddress: string;
}

const useMintBatchChunks: ContractOperationHook<
  IMintBatchChunksParams,
  Transaction | null
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const estimateGas = useCallback(
    async (params: IMintBatchChunksParams): Promise<string> => {
      if (account && provider) {
        const { listOfChunks, contractAddress } = params;
        const chunks = listOfChunks.map((item) => [item]);
        const contract = getContract(
          contractAddress,
          ERC721ABIJson.abi,
          provider,
          account,
        );
        const gasLimit = await contract.estimateGas.mintBatchChunks(account, chunks);
        const gasLimitBN = new BigNumber(gasLimit.toString());
        const gasBuffer = gasLimitBN.times(1.1).decimalPlaces(0);
        logger.debug('useMintBatchChunks estimate gas', gasBuffer.toString());
        return gasBuffer.toString();
      }
      return '1000000000';
    },
    [provider, account],
  );

  const call = useCallback(
    async (params: IMintBatchChunksParams): Promise<Transaction | null> => {
      const { listOfChunks, contractAddress } = params;
      if (account && provider && contractAddress) {
        const contract = getContract(
          contractAddress,
          ERC721ABIJson.abi,
          provider,
          account,
        );
        const tcTxSizeByte = listOfChunks.reduce(
          (prev, cur) => prev + Buffer.byteLength(cur),
          0,
        );
        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: tcTxSizeByte,
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

        const chunks = listOfChunks.map((item) => [item]);
        const gasLimit = await estimateGas(params);
        const transaction = await contract
          .connect(provider.getSigner())
          .mintBatchChunks(account, chunks, {
            gasLimit
          });
        return transaction;
      }

      return null;
    },
    [account, provider, btcBalance, feeRate.hourFee, estimateGas],
  );

  return {
    estimateGas,
    call: call,
    dAppType: DAppType.ERC721,
    operationName: TransactionEventType.MINT,
  };
};

export default useMintBatchChunks;
