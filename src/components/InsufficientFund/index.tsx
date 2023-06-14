import { CDN_URL, TC_WEB_URL } from '@/configs';
import { AssetsContext } from '@/contexts/assets-context';
import useTokenBalance, {
  IGetTokenBalanceParams,
} from '@/hooks/contract-operations/erc20/useTokenBalance';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import logger from '@/services/logger';
import { mappingERC20ToSymbol } from '@/utils/format';
import Link from 'next/link';
import { useCallback, useContext, useEffect, useState } from 'react';
import IconSVG from '../IconSVG';
import Text from '../Text';
import { StyledInsufficientFund } from './InsufficientFund.styled';
import { getGasFeeSelector } from '@/state/gasFee/selector';
import { useSelector } from 'react-redux';

type Props = {
  estTCFee?: string | null;
  estBTCFee?: string | null;
  erc20Token?: string;
  price?: string;
};

const InsufficientFund = ({ estTCFee, estBTCFee, erc20Token, price }: Props) => {
  const { btcBalance, tcBalance } = useContext(AssetsContext);

  const { defaultTCGasFee, defaultBTCGasFee } = useSelector(getGasFeeSelector);

  const { run: getTokenBalance } = useContractOperation<
    IGetTokenBalanceParams,
    string
  >({
    operation: useTokenBalance,
    inscribeable: false,
  });

  const [insufficientTC, setInsufficientTC] = useState(false);
  const [insufficientBTC, setInsufficientBTC] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  const fetchTokenBalance = useCallback(async () => {
    if (!erc20Token) return;
    try {
      const res = await getTokenBalance({
        contractAddress: erc20Token,
      });
      setInsufficientBalance(Number(res) < Number(price));
    } catch (err: unknown) {
      logger.debug('failed to load user token balance');
    }
  }, [erc20Token, price, getTokenBalance]);

  useEffect(() => {
    if (estTCFee) {
      setInsufficientTC(Number(tcBalance) < Number(estTCFee));
    } else {
      setInsufficientTC(Number(tcBalance) < Number(defaultTCGasFee));
    }
  }, [estTCFee, tcBalance, defaultTCGasFee]);

  useEffect(() => {
    if (estBTCFee) {
      setInsufficientBTC(Number(btcBalance) < Number(estBTCFee));
    } else {
      setInsufficientBTC(Number(btcBalance) < Number(defaultBTCGasFee));
    }
  }, [estBTCFee, btcBalance, defaultBTCGasFee]);

  useEffect(() => {
    if (erc20Token) {
      fetchTokenBalance();
    }
  }, [erc20Token, fetchTokenBalance]);

  if (!insufficientBTC && !insufficientTC && !insufficientBalance) {
    return <></>;
  }

  return (
    <StyledInsufficientFund className="noti-wrapper">
      {insufficientTC && (
        <div className="noti-item">
          <IconSVG
            className="icon"
            src={`${CDN_URL}/pages/artifacts/icons/ic-bell.svg`}
            maxWidth={'18'}
          />
          <Text size="small" fontWeight="medium">
            Your TC balance is insufficient. Buy more TC{' '}
            <Link
              href={'https://tcgasstation.com/'}
              target="_blank"
              className="text-underline"
            >
              here
            </Link>
            .
          </Text>
        </div>
      )}
      {insufficientBTC && (
        <div className="noti-item">
          <IconSVG
            className="icon"
            src={`${CDN_URL}/pages/artifacts/icons/ic-bell.svg`}
            maxWidth={'18'}
          />
          <Text size="small" fontWeight="medium">
            Your BTC balance is insufficient. Consider transfer your BTC to Trustless
            Computer wallet{' '}
            <Link href={TC_WEB_URL} target="_blank" className="text-underline">
              here
            </Link>
            .
          </Text>
        </div>
      )}
      {insufficientBalance && erc20Token && price && (
        <div className="noti-item">
          <IconSVG
            className="icon"
            src={`${CDN_URL}/pages/artifacts/icons/ic-bell.svg`}
            maxWidth={'18'}
          />
          <Text size="small" fontWeight="medium">
            Your {mappingERC20ToSymbol(erc20Token)} balance is insufficient. Consider
            swapping your BTC to trustless network{' '}
            <Link
              href={'https://trustlessbridge.io/'}
              target="_blank"
              className="text-underline"
            >
              here
            </Link>
            .
          </Text>
        </div>
      )}
    </StyledInsufficientFund>
  );
};

export default InsufficientFund;
