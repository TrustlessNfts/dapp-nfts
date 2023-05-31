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

export interface IMintChunksParams {
  chunks: Buffer;
  contractAddress: string;
}

const useMintChunks: ContractOperationHook<
  IMintChunksParams,
  IRequestSignResp | null
> = () => {
  const user = useSelector(getUserSelector);

  const call = useCallback(
    async (params: IMintChunksParams): Promise<IRequestSignResp | null> => {
      const { chunks, contractAddress } = params;
      const ContractInterface = new ethers.Interface(ERC721ABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("mintChunks", [
        user.tcAddress,
        [chunks]
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
        functionType: 'Mint Chunks',
        functionName: 'mintChunks(address,bytes[])',
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

export default useMintChunks;
