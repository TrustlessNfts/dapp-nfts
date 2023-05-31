import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import ERC20ABIJson from '@/abis/erc20.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { getContract } from '@/utils';
import web3Provider from '@/connection/web3-provider';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';

export interface IGetAllowanceAmountParams {
  operatorAddress: string;
  contractAddress: string;
}

const useGetAllowanceAmount: ContractOperationHook<IGetAllowanceAmountParams, number> = () => {
  const user = useSelector(getUserSelector);

  const call = useCallback(
    async (params: IGetAllowanceAmountParams): Promise<number> => {
      if (!user.tcAddress) return 0;

      const { operatorAddress, contractAddress } = params;
      const contract = getContract(contractAddress, ERC20ABIJson.abi, web3Provider.web3);
      const res = await contract.allowance(user.tcAddress, operatorAddress, {
        from: user.tcAddress
      });
      return res;
    },
    [user.tcAddress],
  );

  return {
    call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.NONE,
  };
};

export default useGetAllowanceAmount;
