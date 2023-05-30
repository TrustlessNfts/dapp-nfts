import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import ERC721ABIJson from '@/abis/erc721.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { ethers } from "ethers";
import connector from '@/connectors/tc-connector';

export interface IMintBatchChunksParams {
  listOfChunks: Array<Buffer>;
  contractAddress: string;
  owner: string;
}

const useMintBatchChunks: ContractOperationHook<
  IMintBatchChunksParams,
  IRequestSignResp | null
> = () => {
  const call = useCallback(
    async (params: IMintBatchChunksParams): Promise<IRequestSignResp | null> => {
      const { listOfChunks, contractAddress, owner } = params;
      const chunks = listOfChunks.map((item) => [item]);
      const ContractInterface = new ethers.Interface(ERC721ABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("mintBatchChunks", [
        owner,
        chunks
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
        functionType: 'Mint Batch Chunks',
        functionName: 'mintBatchChunks(address,bytes[][])',
      });

      logger.debug(response);
      return response;
    },
    [],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.MINT,
  };
};

export default useMintBatchChunks;
