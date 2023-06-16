import React, { useMemo } from 'react';
import { Wrapper } from './Sweep.styled';
import { IToken } from '@/interfaces/api/marketplace';
import BigNumber from 'bignumber.js';
import { formatEthPrice, mappingERC20ToIcon } from '@/utils/format';

interface IProps {
  selectedTokens: Array<IToken>;
  onChangeSelectedToken: (_v: Array<IToken>) => void;
}

const SweepTokens: React.FC<IProps> = ({
  selectedTokens,
  onChangeSelectedToken,
}: IProps): React.ReactElement => {

  const buttonLabel = useMemo((): React.ReactNode => {
    if (!selectedTokens.length) return <></>;
    const quantity = `${selectedTokens.length > 1 ? 'items' : 'item'}`;
    const zeroBN = new BigNumber(0);
    const total = selectedTokens.reduce((acc: BigNumber, cur: IToken) => {
      const priceBN = new BigNumber(cur.priceErc20.price);
      acc = acc.plus(priceBN);
      return acc
    }, zeroBN);
    const priceSymbol = mappingERC20ToIcon(selectedTokens[0].priceErc20.erc20Token)
    return (
      <>
        <span>{`${quantity} ${formatEthPrice(total.toString())}`}</span>
        <img src={priceSymbol} alt="token icon" />
      </>
    )
  }, [selectedTokens]);

  return (
    <Wrapper>
      {selectedTokens.length > 0 && (
        <button>
          {buttonLabel}
        </button>
      )}
    </Wrapper>
  )
}

export default SweepTokens;
