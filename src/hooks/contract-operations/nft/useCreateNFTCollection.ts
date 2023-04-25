import {
  ContractOperationHook,
  DAppType,
  DeployContractResponse,
} from '@/interfaces/contract-operation';
import ERC721ABIJson from '@/abis/erc721.json';
import { useWeb3React } from '@web3-react/core';
import { useContext } from 'react';
import { ContractFactory } from 'ethers';
import { AssetsContext } from '@/contexts/assets-context';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';
import { formatBTCPrice } from '@/utils/format';
import { TransactionEventType } from '@/enums/transaction';

export interface ICreateNFTCollectionParams {
  name: string;
  listOfChunks: Array<Array<Buffer>>;
}

const useCreateNFTCollection: ContractOperationHook<
  ICreateNFTCollectionParams,
  DeployContractResponse | null
> = () => {
  const { account, provider } = useWeb3React();
  const { btcBalance, feeRate } = useContext(AssetsContext);

  const call = async (
    params: ICreateNFTCollectionParams,
  ): Promise<DeployContractResponse | null> => {
    if (account && provider) {
      const { name, listOfChunks } = params;
      console.log(params);
      const byteCode = ERC721ABIJson.bytecode;

      const tcTxSizeBytes = listOfChunks
        .map((chunk) =>
          chunk.reduce((prev, cur) => prev + Buffer.byteLength(cur), 0),
        )
        .reduce((prev, cur) => prev + cur, 0);
      console.log('🚀 ~ tcTxSizeBytes:', tcTxSizeBytes);

      console.log({
        tcTxSizeByte: Buffer.byteLength(byteCode),
        feeRatePerByte: feeRate.fastestFee,
      });
      const estimatedFee = TC_SDK.estimateInscribeFee({
        // TODO remove hardcode
        tcTxSizeByte: tcTxSizeBytes || 28000,
        feeRatePerByte: feeRate.fastestFee,
      });
      const balanceInBN = new BigNumber(btcBalance);
      if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
        throw Error(
          `Your balance is insufficient. Please top up at least ${formatBTCPrice(
            estimatedFee.totalFee.toString(),
          )} BTC to pay network fee.`,
        );
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
    transactionType: TransactionEventType.CREATE,
  };
};

export default useCreateNFTCollection;
