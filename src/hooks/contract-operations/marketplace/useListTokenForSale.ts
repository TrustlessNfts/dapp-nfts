import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import MarketplaceABIJson from '@/abis/marketplace.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { ethers } from "ethers";
import connector from '@/connectors/tc-connector';
import Web3 from 'web3';
import { ROOT_ADDRESS } from '@/constants/common';
import { TC_MARKETPLACE_CONTRACT } from '@/configs';

export interface IListTokenForSaleParams {
  collectionAddress: string;
  tokenID: string;
  erc20Token?: string;
  durationTime: number; // Unix timestamp
  price: string;
  seller: string;
}

const useListTokenForSale: ContractOperationHook<
  IListTokenForSaleParams,
  IRequestSignResp | null
> = () => {
  const call = useCallback(
    async (params: IListTokenForSaleParams): Promise<IRequestSignResp | null> => {
      const {
        collectionAddress,
        tokenID,
        price,
        erc20Token,
        durationTime,
        seller
      } = params;

      const payload = JSON.parse(
        JSON.stringify({
          _collectionContract: collectionAddress,
          _tokenId: Web3.utils.toHex(tokenID),
          _price: Web3.utils.toWei(price),
          _erc20Token: erc20Token ?? ROOT_ADDRESS,
          _closed: false,
          _seller: seller,
          _durationTime: durationTime,
        })
      )

      const ContractInterface = new ethers.Interface(MarketplaceABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("listToken", [
        payload
      ]);

      const response = await connector.requestSign({
        target: "_blank",
        calldata: encodeAbi,
        to: TC_MARKETPLACE_CONTRACT,
        value: "",
        redirectURL: window.location.href,
        isInscribe: true,
        gasPrice: undefined,
        gasLimit: undefined,
        functionType: 'List Token For Sale',
        functionName: 'listToken(tuple)',
      });

      logger.debug(response);
      return response;
    },
    [],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.NONE,
  };
};

export default useListTokenForSale;
