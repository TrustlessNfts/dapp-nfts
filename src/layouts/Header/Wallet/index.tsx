import IconSVG from '@/components/IconSVG';
import { CDN_URL, TC_WEB_WALLET_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { AssetsContext } from '@/contexts/assets-context';
import { getIsAuthenticatedSelector, getUserSelector } from '@/state/user/selector';
import { formatEthPrice } from '@/utils/format';
import { formatBTCPrice, formatLongAddress } from '@trustless-computer/dapp-core';
import copy from 'copy-to-clipboard';
import { useRouter } from 'next/router';
import { useContext, useRef, useState } from 'react';
import { OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useSelector } from 'react-redux';
import { ConnectWalletButton, WalletBalance } from '../Header.styled';
import { WalletPopover } from './Wallet.styled';
import Text from '@/components/Text';
import { WalletContext } from '@/contexts/wallet-context';
import { DappsTabs } from '@/enums/tabs';

const WalletHeader = () => {
  const router = useRouter();
  const user = useSelector(getUserSelector);
  const { disconnect } = useContext(WalletContext);

  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const { btcBalance, tcBalance } = useContext(AssetsContext);

  const [show, setShow] = useState(false);
  const handleOnMouseEnter = () => {
    setShow(true);
  };
  const handleOnMouseLeave = () => {
    setShow(false);
  };
  const ref = useRef(null);

  const goToConnectWalletPage = async () => {
    router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
  };

  const onClickCopy = (address: string) => {
    copy(address);
    toast.success('Copied');
  };

  const walletPopover = (
    <WalletPopover
      id="wallet-header"
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      show={show}
    >
      <div className="wallet-tc">
        <div className="wallet-item">
          <IconSVG
            src={`${CDN_URL}/icons/ic-penguin.svg`}
            maxWidth="24"
            maxHeight="24"
          />
          <Text size={'regular'} className="address" fontWeight="regular">
            {formatLongAddress(user?.tcAddress || '')}
          </Text>
        </div>
        <div
          className="icCopy"
          onClick={() => onClickCopy(user?.tcAddress || '')}
        >
          <IconSVG
            src={`${CDN_URL}/icons/ic-copy.svg`}
            color="white"
            maxWidth="16"
          // type="stroke"
          ></IconSVG>
        </div>
      </div>
      <div className="divider"></div>
      <div className="wallet-btc">
        <div className="wallet-item">
          <IconSVG
            src={`${CDN_URL}/icons/ic-btc.svg`}
            maxWidth="24"
            maxHeight="24"
          />
          <Text size={'regular'} className="address" fontWeight="regular">
            {formatLongAddress(user?.btcAddress || '')}
          </Text>
        </div>
        <div
          className="icCopy"
          onClick={() => onClickCopy(user?.btcAddress || '')}
        >
          <IconSVG
            src={`${CDN_URL}/icons/ic-copy.svg`}
            color="white"
            maxWidth="16"
          ></IconSVG>
        </div>
      </div>
      <div className="divider"></div>
      <div className="cta">
        <div
          className="wallet-link"
          onClick={() => window.open(`${TC_WEB_WALLET_URL}?tab=${DappsTabs.NFT}`)}
        >
          <IconSVG src={`${CDN_URL}/icons/ic-wallet.svg`} maxWidth="20" />
          <Text size="medium">Wallet</Text>
        </div>
        <div className="wallet-disconnect" onClick={disconnect}>
          <IconSVG src={`${CDN_URL}/icons/ic-logout.svg`} maxWidth="20" />
          <Text size="medium">Disconnect</Text>
        </div>
      </div>
    </WalletPopover>
  );

  return (
    <>
      {user.tcAddress && isAuthenticated ? (
        <>
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="bottom"
            overlay={walletPopover}
            container={ref}
            show={show}
          >
            <div
              className="wallet"
              onClick={() => window.open(`${TC_WEB_WALLET_URL}?tab=${DappsTabs.NFT}`)}
              ref={ref}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            >
              <WalletBalance>
                <div className="balance">
                  <p>{formatBTCPrice(btcBalance)} BTC</p>
                  <span className="divider"></span>
                  <p>{formatEthPrice(tcBalance)} TC</p>
                </div>
                <div className="avatar">
                  <Jazzicon diameter={32} seed={jsNumberForAddress(user.tcAddress)} />
                </div>
              </WalletBalance>
            </div>
          </OverlayTrigger>
        </>
      ) : (
        <ConnectWalletButton className="hideMobile" onClick={goToConnectWalletPage}>
          Connect wallet
        </ConnectWalletButton>
      )}
    </>
  );
};

export default WalletHeader;
