import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import Link from 'next/link';
import { useState } from 'react';
import { Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';
import WalletHeader from './Wallet';
import { useWindowSize } from '@trustless-computer/dapp-core';
import IconSVG from '@/components/IconSVG';

const Header = ({ height }: { height: number }) => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { mobileScreen } = useWindowSize();

  return (
    <Wrapper style={{ height }}>
      <div className="indicator" />
      <div className="leftContainer">
        <Link className="logo" href={ROUTE_PATH.HOME}>
          {mobileScreen && (
            <img alt="logo" src={`${CDN_URL}/images/nfts-logo.svg`} />
          )}
          {!mobileScreen && (
            <img alt="logo" src={`${CDN_URL}/images/logo-nft-3.svg`} />
          )}
        </Link>
        <Link className="logo" href={ROUTE_PATH.GET_STARTED}>
          Get Started
        </Link>
      </div>
      <MenuMobile isOpen={isOpenMenu} onCloseMenu={() => setIsOpenMenu(false)} />
      <div className="rightContainer">
        <div className="external-link hideMobile">
          <Link href={'https://tcgasstation.com/'} target="_blank">
            Get TC
            <IconSVG
              maxWidth="28"
              src={`${CDN_URL}/pages/artifacts/icons/ic-link.svg`}
            ></IconSVG>
          </Link>
          <Link href={'https://newbitcoincity.com/'} target="_blank">
            NBC
            <IconSVG
              maxWidth="28"
              src={`${CDN_URL}/pages/artifacts/icons/ic-link.svg`}
            ></IconSVG>
          </Link>
          <Link href={'https://generative.xyz/discord'} target="_blank">
            Discord
            <IconSVG
              maxWidth="28"
              src={`${CDN_URL}/pages/artifacts/icons/ic-link.svg`}
            ></IconSVG>
          </Link>
        </div>

        <WalletHeader />
        <button className="btnMenuMobile" onClick={() => setIsOpenMenu(true)}>
          <img src={`${CDN_URL}/icons/ic_hambuger.svg`} alt="ic_hambuger" />
        </button>
      </div>
    </Wrapper>
  );
};

export default Header;
