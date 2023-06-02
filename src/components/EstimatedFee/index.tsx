import React, { useCallback, useContext, useEffect, useState } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';
import Text from '@/components/Text';
import { formatBTCPrice } from '@/utils/format';
import { Wrapper } from './EstimatedFee.styled';
import { AssetsContext } from '@/contexts/assets-context';

interface IProps {
  txSize: number;
}

enum optionFees {
  economy = 'Economy',
  faster = 'Faster',
  fastest = 'Fastest',
}

const EstimatedFee: React.FC<IProps> = ({ txSize }: IProps): React.ReactElement => {
  const { feeRate } = useContext(AssetsContext);
  const [estBTCFee, setEstBTCFee] = useState({
    economy: '0',
    faster: '0',
    fastest: '0',
  });

  const calculateEstFee = useCallback(() => {
    const estimatedFastestFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: txSize,
      feeRatePerByte: feeRate.fastestFee,
    });
    const estimatedFasterFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: txSize,
      feeRatePerByte: feeRate.halfHourFee,
    });
    const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: txSize,
      feeRatePerByte: feeRate.hourFee,
    });

    setEstBTCFee({
      fastest: estimatedFastestFee.totalFee.toString(),
      faster: estimatedFasterFee.totalFee.toString(),
      economy: estimatedEconomyFee.totalFee.toString(),
    });
  }, [txSize, setEstBTCFee, feeRate.fastestFee, feeRate.halfHourFee, feeRate.hourFee]);

  const renderEstFee = ({
    title,
    estFee,
    feeRate,
  }: {
    title: optionFees;
    estFee: string;
    feeRate: number;
  }) => {
    return (

      <div
        className={`est-fee-item`}
      >
        <div className='est-fee-item-header'>
          <p className='est-fee-title'>
            {title}
          </p>
          <p className='est-fee-title'>
            {formatBTCPrice(estFee)} BTC
          </p>
        </div>
        <p className="ext-price">
          {feeRate} sats/vByte
        </p>
      </div >
    );
  };

  useEffect(() => {
    calculateEstFee();
  }, [txSize, calculateEstFee]);

  return (
    <Wrapper>
      <div className="est-fee">
        <Text size="regular" fontWeight="medium" color="bg1" className="mb-8">
          Network fee estimate
        </Text>
        <div className="est-fee-options">
          {renderEstFee({
            title: optionFees.economy,
            estFee: estBTCFee.economy,
            feeRate: feeRate.hourFee,
          })}
          {renderEstFee({
            title: optionFees.faster,
            estFee: estBTCFee.faster,
            feeRate: feeRate.halfHourFee,
          })}
          {renderEstFee({
            title: optionFees.fastest,
            estFee: estBTCFee.fastest,
            feeRate: feeRate.fastestFee,
          })}
        </div>
      </div>
    </Wrapper>
  )
}

export default EstimatedFee;
