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

export interface ITransferERC721TokenParams {
  to: string;
  tokenId: string;
  contractAddress: string;
}

const useTransferERC721Token: ContractOperationHook<
  ITransferERC721TokenParams,
  IRequestSignResp | null
> = () => {
  const user = useSelector(getUserSelector);

  const call = useCallback(
    async (params: ITransferERC721TokenParams): Promise<IRequestSignResp | null> => {
      const {  to, tokenId, contractAddress } = params;
      const ContractInterface = new ethers.Interface(ERC721ABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("transferFrom", [
        user.tcAddress,
        to,
        tokenId
      ]);

      const response = await connector.requestSign({
        from: user.tcAddress,
        target: "_blank",
        calldata: encodeAbi,
        to: contractAddress,
        value: "",
        redirectURL: window.location.href,
        isInscribe: true,
        gasPrice: undefined,
        gasLimit: undefined,
        functionType: 'Transfer From',
        functionName: 'transferFrom(address,address,uint256)',
      });

      logger.debug(response);
      return response;
    },
    [user.tcAddress],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.TRANSFER,
  };
};

export default useTransferERC721Token;
