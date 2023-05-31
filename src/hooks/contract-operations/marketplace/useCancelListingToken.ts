import { ContractOperationHook, DAppType } from '@/interfaces/contract-operation';
import MarketplaceABIJson from '@/abis/marketplace.json';
import { useCallback } from 'react';
import { TransactionEventType } from '@/enums/transaction';
import { IRequestSignResp } from 'tc-connect';
import logger from '@/services/logger';
import { ethers } from "ethers";
import connector from '@/connectors/tc-connector';
import { TC_MARKETPLACE_CONTRACT } from '@/configs';
import { getUserSelector } from '@/state/user/selector';
import { useSelector } from 'react-redux';

export interface ICancelListingTokenParams {
  offerId: string;
}

const useCancelListingToken: ContractOperationHook<
ICancelListingTokenParams,
  IRequestSignResp | null
> = () => {
  const user = useSelector(getUserSelector);

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
        from: user.tcAddress,
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
