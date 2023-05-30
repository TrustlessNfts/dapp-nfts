import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import ERC721ABIJson from '@/abis/erc721.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { ethers } from "ethers";
import connector from '@/connectors/tc-connector';

export interface ITransferERC721TokenParams {
  from: string;
  to: string;
  tokenId: string;
  contractAddress: string;
}

const useTransferERC721Token: ContractOperationHook<
  ITransferERC721TokenParams,
  IRequestSignResp | null
> = () => {

  const call = useCallback(
    async (params: ITransferERC721TokenParams): Promise<IRequestSignResp | null> => {
      const { from, to, tokenId, contractAddress } = params;
      const ContractInterface = new ethers.Interface(ERC721ABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("transferFrom", [
        from,
        to,
        tokenId
      ]);

      const response = await connector.requestSign({
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
    [],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.TRANSFER,
  };
};

export default useTransferERC721Token;
