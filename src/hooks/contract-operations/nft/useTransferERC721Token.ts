import ERC721ABIJson from '@/abis/erc721.json';
import { TRANSFER_TX_SIZE } from '@/configs';
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

export interface ITransferERC721TokenParams {
  to: string;
  tokenId: string;
  contractAddress: string;
}

const useTransferERC721Token: ContractOperationHook<
  ITransferERC721TokenParams,
  Transaction | null
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = useCallback(
    async (params: ITransferERC721TokenParams): Promise<Transaction | null> => {
      const { to, tokenId, contractAddress } = params;
      if (account && provider && contractAddress) {
        const contract = getContract(
          contractAddress,
          ERC721ABIJson.abi,
          provider,
          account,
        );
        console.log({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
          contractAddress,
        });
        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: TRANSFER_TX_SIZE,
          feeRatePerByte: feeRate.fastestFee,
        });
        const balanceInBN = new BigNumber(btcBalance);
        if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
          throw Error(ERROR_CODE.INSUFFICIENT_BALANCE);
        }

        const transaction = await contract
          .connect(provider.getSigner())
          .transferFrom(account, to, tokenId);

        return transaction;
      }

      return null;
    },
    [account, provider, btcBalance, feeRate],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    operationName: TransactionEventType.TRANSFER,
  };
};

export default useTransferERC721Token;
