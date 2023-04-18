import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';
// import IcDiscord from '@/assets/icons/ic_discord.svg';
// import IcTwitter from '@/assets/icons/ic_twitter.svg';
// import IcGithub from '@/assets/icons/ic_github.svg';
import { StyledLink } from '../Header/Header.styled';
import { ROUTE_PATH } from '@/constants/route-path';
import { CDN_URL } from '@/configs';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${px2rem(140)};
  flex-wrap: wrap;
  gap: ${px2rem(32)};
  @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) => theme.breakpoint.md}) {
    gap: ${px2rem(16)};
  }

  .text {
    font-style: normal;
    font-weight: 500;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
    margin-right: ${px2rem(16)};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.white};

    @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) => theme.breakpoint.md}) {
      order: 2;
      padding-bottom: ${px2rem(32)};
    }
  }

  .footer-right {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${px2rem(32)};

    @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) => theme.breakpoint.md}) {
      order: 1;
    }

    a {
      color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
      display: flex;
      align-items: center;
      gap: ${px2rem(8)};
      font-size: ${px2rem(16)};
      line-height: ${px2rem(28)};
      font-weight: 500;
      font-family: 'IBMPlexMono';

      &:hover {
        opacity: 0.8;
        text-decoration: none;
        cursor: pointer;
      }

      .arrow-icon {
        width: 9px;
        height: 9px;
      }
    }
  }

  .buttonContainer {
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: ${px2rem(8)};

    .icon {
      width: ${px2rem(34)};
      height: ${px2rem(34)};
      cursor: pointer;

      :hover {
        opacity: 0.8;
      }
    }
  }
`;

const Footer = ({ height }: { height: number }) => {
  return (
    <Wrapper style={{ height }}>
      <p className="text">Open-source software. Made with ❤️ on Bitcoin.</p>
      <div className="footer-right">
        <StyledLink active={false} href={ROUTE_PATH.FAUCET}>
          Faucet
          <img className="arrow-icon" src={`${CDN_URL}/icons/ic-arrow-outward.svg`} />
        </StyledLink>
        <a href={'https://explorer.trustless.computer'} target="_blank">
          Explorer
          <img className="arrow-icon" src={`${CDN_URL}/icons/ic-arrow-outward.svg`} />
        </a>
        <div className="buttonContainer">
          <a href="https://github.com/trustlesscomputer" target="_blank">
            <img alt="icon" className="icon" src={`${CDN_URL}/icons/ic_github.svg`} />
          </a>
          <a href="https://trustless.computer/discord" target="_blank">
            <img alt="icon" className="icon" src={`${CDN_URL}/icons/ic_discord.svg`} />
          </a>
          <a href="https://twitter.com/DappsOnBitcoin" target="_blank">
            <img alt="icon" className="icon" src={`${CDN_URL}/icons/ic_twitter.svg`} />
          </a>
        </div>
      </div>
    </Wrapper>
  );
};

export default Footer;
