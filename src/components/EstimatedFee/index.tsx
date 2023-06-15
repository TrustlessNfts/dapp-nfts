import Text from '@/components/Text';
import { TRANSFER_TX_SIZE } from '@/configs';
import web3Provider from '@/connection/custom-web3-provider';
import { AssetsContext } from '@/contexts/assets-context';
import logger from '@/services/logger';
import {
  updateDefaultBTCGasFee,
  updateDefaultTCGasFee,
} from '@/state/gasFee/reducer';
import { useAppDispatch } from '@/state/hooks';
import { formatBTCPrice, formatEthPrice } from '@/utils/format';
import BigNumber from 'bignumber.js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';
import EllipsisLoading from '../EllipsisLoading';
import { Wrapper } from './EstimatedFee.styled';

interface IProps {
  estimateBTCGas?: string | null;
  estimateTCGas?: string | null;
  classNames?: string;
  uploadModal?: boolean;
}

const EstimatedFee: React.FC<IProps> = ({
  estimateBTCGas,
  estimateTCGas,
  uploadModal = false,
  classNames,
}:
IProps): React.ReactElement => {
  const [estBTCFee, setEstBTCFee] = useState<string | null>(null);
  const [estTCFee, setEstTCFee] = useState<string | null>(null);
  const { feeRate } = useContext(AssetsContext);
  const dispatch = useAppDispatch();

  const calculateEstBtcFee = useCallback(async () => {
    try {
      setEstBTCFee(null);

      const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: TRANSFER_TX_SIZE,
        feeRatePerByte: feeRate.hourFee,
      });
      dispatch(updateDefaultBTCGasFee(estimatedEconomyFee.totalFee.toString()));
      setEstBTCFee(estimatedEconomyFee.totalFee.toString());
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [setEstBTCFee, feeRate.hourFee, dispatch]);

  const calculateEstTcFee = useCallback(async () => {
    setEstTCFee(null);
    try {
      const gasLimit = '400000';
      const gasPrice = await web3Provider.getGasPrice();
      const gasLimitBN = new BigNumber(gasLimit);
      const gasPriceBN = new BigNumber(gasPrice);
      const tcGas = gasLimitBN.times(gasPriceBN);
      logger.debug('TC Gas', tcGas.toString());
      setEstTCFee(tcGas.toString());
      dispatch(updateDefaultTCGasFee(tcGas.toString()));
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [setEstTCFee, dispatch]);

  useEffect(() => {
    if (!estimateBTCGas) {
      calculateEstBtcFee();
    }
  }, [estimateBTCGas, calculateEstBtcFee]);

  useEffect(() => {
    if (!estimateTCGas) {
      calculateEstTcFee();
    }
  }, [estimateTCGas, calculateEstTcFee]);

  return (
    <Wrapper className={classNames}>
      <div className="est-fee">
        <Text
          className="est-fee-title"
          size="regular"
          fontWeight="medium"
          color="bg1"
        >
          Network fee estimation
        </Text>
        <div className="est-fee-options">
          <div className={`est-fee-item`}>
            <p className="est-fee-item-title">BTC network fee</p>
            <p className="est-fee-item-value">
              {estimateBTCGas ? (
                `~ ${formatBTCPrice(estimateBTCGas)} BTC`
              ) : estBTCFee && !uploadModal ? (
                `~ ${formatBTCPrice(estBTCFee)} BTC`
              ) : (
                <EllipsisLoading />
              )}
            </p>
          </div>
          <div className={`est-fee-item`}>
            <p className="est-fee-item-title">TC network fee</p>
            <p className="est-fee-item-value">
              {estimateTCGas ? (
                `~ ${formatEthPrice(estimateTCGas)} TC`
              ) : estTCFee && !uploadModal ? (
                `~ ${formatEthPrice(estTCFee)} TC`
              ) : (
                <EllipsisLoading />
              )}
            </p>
          </div>
          <div className="divider"></div>
          <Text
            className="est-fee-title"
            size="regular"
            fontWeight="medium"
            color="bg1"
          >
            Other fee
          </Text>
          <div className={`est-fee-item`}>
            <p className="est-fee-item-title">Platform fee</p>
            <p className="est-fee-item-value">2.5%</p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(EstimatedFee);
