import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';
import WalletHeader from './Wallet';
import { useWindowSize } from '@trustless-computer/dapp-core';

const Header = ({ height }: { height: number }) => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [_isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { mobileScreen } = useWindowSize();

  return (
    <Wrapper style={{ height }}>
      <div className="indicator" />
      <Link className="logo" href={ROUTE_PATH.HOME}>
        {mobileScreen && <img alt="logo" src={`${CDN_URL}/images/nfts-logo.svg`} />}
        {!mobileScreen && (
          <img alt="logo" src={`${CDN_URL}/images/logo-nft-3.svg`} />
        )}
      </Link>
      <MenuMobile ref={refMenu} onCloseMenu={() => setIsOpenMenu(false)} />
      <div className="rightContainer">
        <div className="external-link">
          <Link href={'https://trustless.computer/'} target="_blank">
            Trustless
          </Link>
          <Link href={'https://tcgasstation.com/'} target="_blank">
            Get TC
          </Link>
        </div>

        <WalletHeader />
        <button className="btnMenuMobile" onClick={() => setIsOpenMenu(true)}>
          <img src={`${CDN_URL}/icons/ic_hambuger.svg`} />
        </button>
      </div>
    </Wrapper>
  );
};

export default Header;
