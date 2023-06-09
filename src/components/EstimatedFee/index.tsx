import React, { useCallback, useContext, useEffect, useState } from 'react';
import Text from '@/components/Text';
import { formatBTCPrice, formatEthPrice } from '@/utils/format';
import { Wrapper } from './EstimatedFee.styled';
import EllipsisLoading from '../EllipsisLoading';
import { AssetsContext } from '@/contexts/assets-context';
import web3Provider from '@/connection/custom-web3-provider';
import BigNumber from 'bignumber.js';
import logger from '@/services/logger';
import { TRANSFER_TX_SIZE } from '@/configs';
import * as TC_SDK from 'trustless-computer-sdk';

interface IProps {
  estimateBTCGas?: string | null;
  estimateTCGas?: string | null;
  classNames?: string;
  uploadModal?: boolean;
  // isBigFile?: boolean;
  // uploadView?: boolean;
}

const EstimatedFee: React.FC<IProps> = ({
  estimateBTCGas,
  estimateTCGas,
  uploadModal = false,
  classNames, // isBigFile = false,
}: // uploadView = false,
  IProps): React.ReactElement => {
  const [estBTCFee, setEstBTCFee] = useState<string | null>(null);
  const [estTCFee, setEstTCFee] = useState<string | null>(null);
  const { feeRate } = useContext(AssetsContext);

  const calculateEstBtcFee = useCallback(async () => {
    try {
      setEstBTCFee(null);

      const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: TRANSFER_TX_SIZE,
        feeRatePerByte: feeRate.hourFee,
      });

      setEstBTCFee(estimatedEconomyFee.totalFee.toString());
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [setEstBTCFee, feeRate.hourFee]);

  const calculateEstTcFee = useCallback(async () => {
    setEstTCFee(null);
    try {
      const gasLimit = '5000000';
      const gasPrice = await web3Provider.getGasPrice();
      const gasLimitBN = new BigNumber(gasLimit);
      const gasPriceBN = new BigNumber(gasPrice);
      const tcGas = gasLimitBN.times(gasPriceBN);
      logger.debug('TC Gas', tcGas.toString());
      setEstTCFee(tcGas.toString());
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [setEstTCFee]);

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
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(EstimatedFee);
