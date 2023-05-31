import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import MarketplaceABIJson from '@/abis/marketplace.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { ethers } from "ethers";
import connector from '@/connectors/tc-connector';
import { TC_MARKETPLACE_CONTRACT } from '@/configs';

export interface IAcceptTokenOfferParams {
  offerId: string;
}

const useAcceptTokenOffer: ContractOperationHook<
IAcceptTokenOfferParams,
  IRequestSignResp | null
> = () => {
  const call = useCallback(
    async (params: IAcceptTokenOfferParams): Promise<IRequestSignResp | null> => {
      const {
        offerId
      } = params;
      const offerIdBytes32 = '0x' + offerId;

      const ContractInterface = new ethers.Interface(MarketplaceABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("acceptMakeOffer", [
        offerIdBytes32
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
        functionType: 'Accept Offer',
        functionName: 'acceptMakeOffer(bytes32)',
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

export default useAcceptTokenOffer;
