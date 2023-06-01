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

export interface ISweetTokensParams {
  offerIds: Array<string>;
  totalPrice: string;
}

const usePurchaseToken: ContractOperationHook<
  ISweetTokensParams,
  IRequestSignResp | null
> = () => {
  const user = useSelector(getUserSelector);

  const call = useCallback(
    async (params: ISweetTokensParams): Promise<IRequestSignResp | null> => {
      const { offerIds, totalPrice } = params;
      const offerIdInByte32List = offerIds.map(offerId => '0x' + offerId);
      const ContractInterface = new ethers.Interface(MarketplaceABIJson.abi);
      const encodeAbi = ContractInterface.encodeFunctionData("sweep", [
        offerIdInByte32List
      ]);

      const response = await connector.requestSign({
        from: user.tcAddress,
        target: "_blank",
        calldata: encodeAbi,
        to: TC_MARKETPLACE_CONTRACT,
        value: totalPrice,
        redirectURL: window.location.href,
        isInscribe: true,
        gasPrice: undefined,
        gasLimit: undefined,
        functionType: 'Sweep',
        functionName: 'sweep(bytes32[])',
      });

      logger.debug(response);
      return response;
    },
    [user.tcAddress],
  );

  return {
    call: call,
    dAppType: DAppType.ERC721,
    transactionType: TransactionEventType.NONE,
  };
};

export default usePurchaseToken;
