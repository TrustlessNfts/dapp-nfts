import ERC721ABIJson from '@/abis/erc721.json';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { useContract } from '@/hooks/useContract';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import logger from '@/services/logger';
import { getContract } from '@/utils';
import { formatBTCPrice } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Transaction, ContractFactory } from 'ethers';
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
        const byteCode = ERC721ABIJson.bytecode;

        const factory = new ContractFactory(
          ERC721ABIJson.abi,
          byteCode,
          provider.getSigner(),
        );

        // const gasLimit = await factory.getDeployTransaction(account, chunks)
        //   .gasLimit;

        const estimatedGas = await factory.signer.estimateGas(
          contract.connect(provider.getSigner()).mintChunks(account, [chunks]),
        );
        console.log('🚀 ~ estimatedGas:', estimatedGas);

        // const gasLimit = await contract.estimateGas.mintChunks(account, [chunks]);
        const gasLimitBN = new BigNumber(estimatedGas.toString());
        const gasBuffer = gasLimitBN.decimalPlaces(0);
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
        // if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
        //   throw Error(
        //     `Insufficient BTC balance. Please top up at least ${formatBTCPrice(
        //       estimatedFee.totalFee.toString(),
        //     )} BTC.`,
        //   );
        // }
        const transaction = await contract.connect(provider.getSigner()).mintChunks(
          account,
          [chunks],
          //   {
          //   gasLimit: await estimateGas(params),
          // }
        );

        return transaction;
      }

      return null;
    },
    [account, provider, btcBalance],
  );

  return {
    call: call,
    estimateGas: estimateGas,
    dAppType: DAppType.ERC721,
    operationName: TransactionEventType.MINT,
  };
};

export default useMintChunks;
