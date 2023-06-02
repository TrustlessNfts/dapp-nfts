import { TransactionResponse } from '@ethersproject/abstract-provider';
import BigNumber from 'bignumber.js';

export enum DAppType {
  ERC721 = 'NFT', // NFTs
  ERC20 = 'Token', // Tokens
  BFS = 'Artifact', // Artifactx
  BNS = 'Name', // Name
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContractOperationHook<P, R> = (arg?: any) => {
  call: (args: P) => Promise<R>;
  dAppType: DAppType;
  operationName: string;
};

export type DeployContractResponse = {
  hash: string;
  contractAddress: string;
  deployTransaction: TransactionResponse;
  estFee: {
    totalFee: BigNumber;
  };
};
