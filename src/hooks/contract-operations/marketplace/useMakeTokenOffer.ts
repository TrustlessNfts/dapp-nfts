import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import MarketplaceABIJson from '@/abis/marketplace.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { ethers } from "ethers";
import connector from '@/connectors/tc-connector';
import Web3 from 'web3';
import { TC_MARKETPLACE_CONTRACT } from '@/configs';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';

export interface IMakeTokenOfferParams {
  collectionAddress: string;
  tokenID: string;
  price: string;
  erc20Token?: string;
  durationTime: number; // Unix timestamp
}

const useMakeTokenOffer: ContractOperationHook<
  IMakeTokenOfferParams,
  IRequestSignResp | null
> = () => {
  const user = useSelector(getUserSelector);

  const call = useCallback(
    async (params: IMakeTokenOfferParams): Promise<IRequestSignResp | null> => {
      const {
        collectionAddress,
        tokenID,
        price,
        erc20Token,
        durationTime,
      } = params;

      const payload = JSON.parse(
        JSON.stringify({
          _collectionContract: collectionAddress,
          _tokenId: Web3.utils.toHex(tokenID),
          _buyer: user.tcAddress ?? '',
          _price: Web3.utils.toWei(price),
          _erc20Token: erc20Token,
          _closed: false,
          _durationTime: durationTime,
        })
      );

      const ContractInterface = new ethers.Interface(MarketplaceABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("makeOffer", [
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
        gasLimit: '500000',
        isExecuteTransaction: false,
        functionType: 'Make Token Offer',
        functionName: 'makeOffer((address,uint256,address,address,uint256,bool,uint256) makeOfferData)',
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

export default useMakeTokenOffer;
