import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { CDN_URL, TC_BRIDGE_URL, TC_WEB_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { AssetsContext } from '@/contexts/assets-context';
import { WalletContext } from '@/contexts/wallet-context';
import { DappsTabs } from '@/enums/tabs';
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

const WalletHeader = () => {
  const router = useRouter();
  const user = useSelector(getUserSelector);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const { onDisconnect } = useContext(WalletContext);
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
    router.push(`${ROUTE_PATH.CONNECT_WALLET}`);
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
            {formatLongAddress(user?.walletAddress || '')}
          </Text>
        </div>
        <div
          className="icCopy"
          onClick={() => onClickCopy(user?.walletAddress || '')}
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
            {formatLongAddress(user?.walletAddressBtcTaproot || '')}
          </Text>
        </div>
        <div
          className="icCopy"
          onClick={() => onClickCopy(user?.walletAddressBtcTaproot || '')}
        >
          <IconSVG
            src={`${CDN_URL}/icons/ic-copy.svg`}
            color="white"
            maxWidth="16"
          ></IconSVG>
        </div>
      </div>
      <div className="divider"></div>
      <div
        className="wallet-link"
        onClick={() => window.open(`${TC_WEB_URL}?tab=${DappsTabs.NFT}`)}
      >
        <IconSVG src={`${CDN_URL}/icons/ic-wallet.svg`} maxWidth="20" />
        <Text size="medium">Wallet</Text>
      </div>
      <div
        className="wallet-link"
        onClick={() => window.open(`${TC_BRIDGE_URL}/btc`)}
      >
        <IconSVG src={`${CDN_URL}/icons/coin-convert-white.svg`} maxWidth="20" />
        <Text size="medium">Wrap BTC</Text>
      </div>
      <div
        className="wallet-link"
        onClick={() => window.open(`${TC_BRIDGE_URL}/eth`)}
      >
        <IconSVG src={`${CDN_URL}/icons/coin-convert-white.svg`} maxWidth="20" />
        <Text size="medium">Wrap ETH</Text>
      </div>
      <div className="divider"></div>
      <div className="cta">
        <div className="wallet-disconnect" onClick={onDisconnect}>
          <IconSVG src={`${CDN_URL}/icons/ic-logout.svg`} maxWidth="20" />
          <Text size="medium">Disconnect</Text>
        </div>
      </div>
    </WalletPopover>
  );

  return (
    <>
      {user.walletAddress && isAuthenticated ? (
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
              onClick={() => window.open(`${TC_WEB_URL}?tab=${DappsTabs.NFT}`)}
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
                  {!!user.avatar ? (
                    <img src={user.avatar} alt="user avatar" />
                  ) : (
                    <Jazzicon
                      diameter={32}
                      seed={jsNumberForAddress(user.walletAddress)}
                    />
                  )}
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
