import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import ERC20ABIJson from '@/abis/erc20.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { ethers } from "ethers";
import connector from '@/connectors/tc-connector';

export interface IApproveTokenAmountParams {
  tokenAddress: string;
  consumerAddress: string;
  amount: string;
}

const useApproveTokenAmount: ContractOperationHook<
IApproveTokenAmountParams,
  IRequestSignResp | null
> = () => {
  const call = useCallback(
    async (params: IApproveTokenAmountParams): Promise<IRequestSignResp | null> => {
      const {
        tokenAddress,
        consumerAddress,
        amount,
      } = params;

      const ContractInterface = new ethers.Interface(ERC20ABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("approve", [
        consumerAddress,
        amount
      ]);

      const response = await connector.requestSign({
        target: "_blank",
        calldata: encodeAbi,
        to: tokenAddress,
        value: "",
        redirectURL: window.location.href,
        isInscribe: false,
        gasPrice: undefined,
        gasLimit: undefined,
        functionType: 'Approve Token Amount',
        functionName: 'approve(address,uint256)',
      });

      logger.debug(response);
      return response;
    },
    [],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.NONE,
  };
};

export default useApproveTokenAmount;
