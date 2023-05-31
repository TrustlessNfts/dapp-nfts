import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';
import Link from 'next/link';
import { css } from 'styled-components';

export const Styled = styled(Link)<{ isBNS?: boolean }>`
  width: 100%;
  height: 100%;
  text-decoration: none !important;
  --bs-card-bg: none;

  /* background: ${({ theme }: { theme: DefaultTheme }) => theme.primary['2e']}; */
  border: 1px solid #5b5b5b;
  border-radius: 12px;

  :hover {
    border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.primary['d9']};
  }

  .card-content {
  }

  .card-image {
    min-height: ${px2rem(180)};
    padding: ${px2rem(32)};
    position: relative;

    .image {
      width: 100%;
      min-height: 100px;
      aspect-ratio: 1 / 1;
      height: auto;
      object-fit: cover;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    }
  }

  .card-info {
    padding: ${px2rem(16)} ${px2rem(24)};

    ${({ isBNS }: { isBNS?: boolean }) =>
      !isBNS &&
      css`
        padding-top: 0;
      `}

    .card-title1 {
      font-style: normal;
      font-weight: 500;
      font-size: ${px2rem(20)};
      line-height: ${px2rem(30)};
      color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 20ch;
    }

    .card-title2 {
      font-style: normal;
      font-weight: 400;
      font-size: ${px2rem(16)};
      line-height: ${px2rem(26)};
      color: ${({ theme }: { theme: DefaultTheme }) => theme.text2};
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      ${({ isBNS }: { isBNS?: boolean }) =>
        !isBNS &&
        css`
          margin-bottom: ${px2rem(12)};
        `}
    }

    .card-title3 {
      font-style: normal;
      font-weight: 400;
      font-size: ${px2rem(14)};
      line-height: ${px2rem(26)};
      color: ${({ theme }: { theme: DefaultTheme }) => theme.text2};
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .owner-actions {
    padding: ${px2rem(16)} ${px2rem(24)};

    .transfer-button {
      background-color: ${({ theme }: { theme: DefaultTheme }) => theme.bg5};
      padding: ${px2rem(5)} ${px2rem(14)};
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      font-size: ${px2rem(14)};
      line-height: ${px2rem(24)};
      color: ${({ theme }: { theme: DefaultTheme }) => theme.primary.brand};
      width: 100%;
      font-style: normal;
      border-radius: 2px;
    }
  }
`;
