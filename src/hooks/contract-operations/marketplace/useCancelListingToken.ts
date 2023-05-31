import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import MarketplaceABIJson from '@/abis/marketplace.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { ethers } from "ethers";
import connector from '@/connectors/tc-connector';
import { TC_MARKETPLACE_CONTRACT } from '@/configs';

export interface ICancelListingTokenParams {
  offerId: string;
}

const useCancelListingToken: ContractOperationHook<
ICancelListingTokenParams,
  IRequestSignResp | null
> = () => {
  const call = useCallback(
    async (params: ICancelListingTokenParams): Promise<IRequestSignResp | null> => {
      const {
        offerId
      } = params;
      const offerIdBytes32 = '0x' + offerId;

      const ContractInterface = new ethers.Interface(MarketplaceABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("cancelListing", [
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
        functionType: 'Cancel Listing Token',
        functionName: 'cancelListing(bytes32)',
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

export default useCancelListingToken;
