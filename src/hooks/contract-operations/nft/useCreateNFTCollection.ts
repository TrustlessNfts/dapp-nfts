import ERC721ABIJson from '@/abis/erc721.json';
import { TransactionEventType } from '@/enums/transaction';
import {
  ContractOperationHook,
  DAppType,
} from '@/interfaces/contract-operation';
import { useCallback } from 'react';
import logger from '@/services/logger';
import connector from '@/connectors/tc-connector';
import { IRequestSignResp } from 'tc-connect';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import { getUserSelector } from '@/state/user/selector';
import { useSelector } from 'react-redux';

export interface ICreateNFTCollectionParams {
  name: string;
  listOfChunks: Array<Array<Buffer>>;
}

const useCreateNFTCollection: ContractOperationHook<
  ICreateNFTCollectionParams,
  IRequestSignResp | null
> = () => {
  const user = useSelector(getUserSelector);

  const call = useCallback(async (
    params: ICreateNFTCollectionParams,
  ): Promise<IRequestSignResp | null> => {
    const { name, listOfChunks } = params;
    const web3 = new Web3();
    const ContractInterface = new web3.eth.Contract(ERC721ABIJson.abi as AbiItem[]);
    const encodeABI = ContractInterface.deploy({
      data: ERC721ABIJson.bytecode,
      arguments: [
        name,
        listOfChunks
      ]
    }).encodeABI();
    const response = await connector.requestSign({
      from: user.tcAddress,
      target: "_blank",
      calldata: encodeABI,
      to: "",
      value: "",
      isInscribe: true,
      functionType: 'Contract Deployment',
      functionName: 'constructor(string,bytes[][])',
    });

    logger.debug(response);
    return response;
  }, [user.tcAddress]);

  return {
    call: call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.CREATE,
  };
};

export default useCreateNFTCollection;
