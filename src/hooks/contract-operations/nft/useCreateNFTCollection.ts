import ERC721ABIJson from '@/abis/erc721.json';
import { ERROR_CODE } from '@/constants/error';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import {
  ContractOperationHook,
  DAppType,
  DeployContractResponse,
} from '@/interfaces/contract-operation';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { ContractFactory } from 'ethers';
import { useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';

export interface ICreateNFTCollectionParams {
  name: string;
  listOfChunks: Array<Array<Buffer>>;
  selectFee: number;
}

const useCreateNFTCollection: ContractOperationHook<
  ICreateNFTCollectionParams,
  DeployContractResponse | null
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance } = useContext(AssetsContext);

  const call = async (
    params: ICreateNFTCollectionParams,
  ): Promise<DeployContractResponse | null> => {
    if (account && provider) {
      const { name, listOfChunks, selectFee } = params;
      console.log(params);
      const byteCode = ERC721ABIJson.bytecode;

      const tcTxSizeBytes = listOfChunks
        .map((chunk) =>
          chunk.reduce((prev, cur) => prev + Buffer.byteLength(cur), 0),
        )
        .reduce((prev, cur) => prev + cur, 0);

      console.log({
        tcTxSizeByte: Buffer.byteLength(byteCode),
        feeRatePerByte: selectFee,
      });
      const estimatedFee = TC_SDK.estimateInscribeFee({
        // TODO remove hardcode
        tcTxSizeByte: tcTxSizeBytes || 0,
        feeRatePerByte: selectFee,
      });
      console.log(
        '🚀 ~  estimatedFee.totalFee.toString():',
        estimatedFee.totalFee.toString(),
      );
      console.log('🚀 ~ btcBalance:', btcBalance);
      const balanceInBN = new BigNumber(btcBalance);
      if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
        throw Error(ERROR_CODE.INSUFFICIENT_BALANCE);
      }

      const factory = new ContractFactory(
        ERC721ABIJson.abi,
        byteCode,
        provider.getSigner(),
      );
      console.log('factory', factory);
      const contract = await factory.deploy(name, listOfChunks);

      return {
        hash: contract.deployTransaction.hash,
        contractAddress: contract.address,
        deployTransaction: contract.deployTransaction,
        estFee: estimatedFee,
      };
    }

    return null;
  };

  return {
    call: call,
    dAppType: DAppType.ERC721,
    operationName: TransactionEventType.CREATE,
  };
};

export default useCreateNFTCollection;
