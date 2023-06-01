import { MempoolContext } from '@/contexts/mempool-context';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import * as TC_SDK from 'trustless-computer-sdk';
import Text from '@/components/Text';
import { formatBTCPrice } from '@/utils/format';
import { Wrapper } from './EstimatedFee.styled';

interface IProps {
  txSize: number;
}

enum optionFees {
  economy = 'Economy',
  faster = 'Faster',
  fastest = 'Fastest',
}

const EstimatedFee: React.FC<IProps> = ({ txSize }: IProps): React.ReactElement => {
  const { feeRate } = useContext(MempoolContext);
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
        <div>
          <Text fontWeight="medium" color="black" size="regular">
            {title}
          </Text>
          <Text color="border2" className="mb-10">
            {feeRate} sats/vByte
          </Text>
          <p className="ext-price">
            {formatBTCPrice(estFee)} <span>BTC</span>
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    calculateEstFee();
  }, [txSize])

  return (
    <Wrapper>
      <div className="est-fee">
        <Text size="regular" fontWeight="medium" color="bg1" className="mb-8">
          Estimated network fee
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
