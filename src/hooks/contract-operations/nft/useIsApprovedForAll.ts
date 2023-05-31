import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import ERC721ABIJson from '@/abis/erc721.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { getContract } from '@/utils';
import web3Provider from '@/connection/web3-provider';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';

export interface IIsApprovedForAllParams {
  operatorAddress: string;
  contractAddress: string;
}

const useIsApprovedForAll: ContractOperationHook<IIsApprovedForAllParams, boolean> = () => {
  const user = useSelector(getUserSelector);

  const call = useCallback(
    async (params: IIsApprovedForAllParams): Promise<boolean> => {
      if (!user.tcAddress) return false;

      const { operatorAddress, contractAddress } = params;
      const contract = getContract(contractAddress, ERC721ABIJson.abi, web3Provider.web3);
      const res = await contract.isApprovedForAll(user.tcAddress, operatorAddress, {
        from: user.tcAddress
      });
      return res;
    },
    [user.tcAddress],
  );

  return {
    call,
    dAppType: DAppType.BNS,
    transactionType: TransactionEventType.NONE,
  };
};

export default useIsApprovedForAll;
