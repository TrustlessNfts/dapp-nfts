import ERC721ABIJson from '@/abis/erc721.json';
import { ERROR_CODE } from '@/constants/error';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import { getContract } from '@/utils';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { Transaction } from 'ethers';
import { useCallback, useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';

export interface IMintChunksParams {
  chunks: Buffer;
  contractAddress: string;
  selectFee: number;
}

const useMintChunks: ContractOperationHook<
  IMintChunksParams,
  Transaction | null
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: IMintChunksParams): Promise<Transaction | null> => {
      const { chunks, contractAddress, selectFee } = params;
      if (account && provider && contractAddress) {
        const contract = getContract(
          contractAddress,
          ERC721ABIJson.abi,
          provider,
          account,
        );
        console.log({
          tcTxSizeByte: Buffer.byteLength(chunks),
          feeRatePerByte: selectFee,
          contractAddress,
        });
        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: Buffer.byteLength(chunks),
          feeRatePerByte: selectFee,
        });
        const balanceInBN = new BigNumber(btcBalance);
        if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
          throw Error(ERROR_CODE.INSUFFICIENT_BALANCE);
        }
        const transaction = await contract
          .connect(provider.getSigner())
          .mintChunks(account, [chunks]);

        return transaction;
      }

      return null;
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.MINT,
  };
};

export default useMintChunks;
