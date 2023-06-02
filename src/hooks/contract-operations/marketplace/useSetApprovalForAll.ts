import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import ERC20ABIJson from '@/abis/erc20.json';
import { useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { getContract } from '@/utils';
import logger from '@/services/logger';
import { Transaction } from 'ethers';

export interface ISetApprovalForAllParams {
  operatorAddress: string;
  contractAddress: string;
}

const useSetApprovalForAll: ContractOperationHook<
  ISetApprovalForAllParams,
  Transaction | null
> = () => {
  const { account, provider } = useWeb3React();

  const call = useCallback(
    async (params: ISetApprovalForAllParams): Promise<Transaction | null> => {
      logger.debug('useSetApprovalForAll', params);
      
      if (account && provider) {
        const { operatorAddress, contractAddress } = params;
        const contract = getContract(contractAddress, ERC20ABIJson.abi, provider, account);
        const transaction = await contract.setApprovalForAll(operatorAddress, true, {
          from: account
        });
        return transaction;
      }

      return null;
    },
    [account, provider],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    operationName: 'Set Approval For All',
  };
};

export default useSetApprovalForAll;
