import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import ERC721ABIJson from '@/abis/erc721.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { ethers } from "ethers";
import connector from '@/connectors/tc-connector';
import { getUserSelector } from '@/state/user/selector';
import { useSelector } from 'react-redux';

export interface ISetApprovalForAllParams {
  operatorAddress: string;
  contractAddress: string;
}

const useSetApprovalForAll: ContractOperationHook<
  ISetApprovalForAllParams,
  IRequestSignResp | null
> = () => {
  const user = useSelector(getUserSelector);

  const call = useCallback(
    async (params: ISetApprovalForAllParams): Promise<IRequestSignResp | null> => {
      const {
        contractAddress,
        operatorAddress
      } = params;

      const ContractInterface = new ethers.Interface(ERC721ABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("setApprovalForAll", [
        operatorAddress,
        true
      ]);

      const response = await connector.requestSign({
        from: user.tcAddress,
        target: "_blank",
        calldata: encodeAbi,
        to: contractAddress,
        value: "",
        redirectURL: window.location.href,
        isInscribe: false,
        gasPrice: undefined,
        gasLimit: undefined,
        functionType: 'Set Approval',
        functionName: 'setApprovalForAll(address,bool)',
      });

      logger.debug(response);
      return response;
    },
    [user.tcAddress],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.NONE,
  };
};

export default useSetApprovalForAll;
