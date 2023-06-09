import ERC721ABIJson from '@/abis/erc721.json';
import { ERROR_CODE } from '@/constants/error';
import { AssetsContext } from '@/contexts/assets-context';
import { TransactionEventType } from '@/enums/transaction';
import {
  ContractOperationHook,
  DAppType,
  DeployContractResponse,
} from '@/interfaces/contract-operation';
import logger from '@/services/logger';
import { formatBTCPrice } from '@/utils/format';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';
import { ContractFactory } from 'ethers';
import { useCallback, useContext } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';

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

  const estimateGas = useCallback(
    async (params: ICreateNFTCollectionParams): Promise<string> => {
      if (account && provider) {
        const { name, listOfChunks } = params;
        const byteCode = ERC721ABIJson.bytecode;

        const factory = new ContractFactory(
          ERC721ABIJson.abi,
          byteCode,
          provider.getSigner(),
        );
        const gasLimit = factory.getDeployTransaction(name, listOfChunks).gasLimit;

        console.log('🚀 ~ gasLimit:', gasLimit);

        if (!gasLimit) {
          return '1000000000';
        }

        const gasLimitBN = new BigNumber(gasLimit.toString());
        const gasBuffer = gasLimitBN.times(1.1).decimalPlaces(0);
        logger.debug('useCreateNFTCollection estimate gas', gasBuffer.toString());
        return gasBuffer.toString();
      }
      return '1000000000';
    },
    [provider, account],
  );

  const call = async (
    params: ICreateNFTCollectionParams,
  ): Promise<DeployContractResponse | null> => {
    if (account && provider) {
      const { name, listOfChunks } = params;
      const byteCode = ERC721ABIJson.bytecode;

      const tcTxSizeBytes = listOfChunks
        .map((chunk) =>
          chunk.reduce((prev, cur) => prev + Buffer.byteLength(cur), 0),
        )
        .reduce((prev, cur) => prev + cur, 0);

      const estimatedFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: tcTxSizeBytes || 0,
        feeRatePerByte: feeRate.fastestFee,
      });

      const balanceInBN = new BigNumber(btcBalance);
      if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
        // throw Error(ERROR_CODE.INSUFFICIENT_BALANCE);
        throw Error(
          `Insufficient BTC balance. Please top up at least ${formatBTCPrice(
            estimatedFee.totalFee.toString(),
          )} BTC.`,
        );
      }

      const factory = new ContractFactory(
        ERC721ABIJson.abi,
        byteCode,
        provider.getSigner(),
      );

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
    estimateGas: estimateGas,
    dAppType: DAppType.ERC721,
    operationName: TransactionEventType.CREATE,
  };
};

export default useCreateNFTCollection;
