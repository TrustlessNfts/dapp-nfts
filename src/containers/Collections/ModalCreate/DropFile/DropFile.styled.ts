import { px2rem } from '@trustless-computer/dapp-core';
import styled, { DefaultTheme } from 'styled-components';

export const StyledDropFile = styled.div`
  &.dropFile {
    border: none;
    width: 100%;
    text-align: center;
    background-color: #f2f5fa;
    position: relative;
    margin-bottom: ${px2rem(8)};

    .dropZone {
      padding: ${px2rem(24)};
      width: 100%;
      height: 100%;
      text-align: center;
      cursor: pointer;
    }

    .dropZoneThumbnail {
      display: inline-block;
      margin-bottom: 6px;
      width: ${px2rem(100)};
      height: ${px2rem(100)};
    }

    .dropZoneDescriptionWrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: ${px2rem(8)};
    }

    .dropZoneDescription {
      font-weight: 400;
      font-size: ${px2rem(16)};
      line-height: 26px;
      color: #898989;
    }

    &__drag {
      background-color: ${({ theme }: { theme: DefaultTheme }) => theme.text5};
    }

    &__error {
      border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.red};
    }

    .errorText {
      color: ${({ theme }: { theme: DefaultTheme }) => theme.red};
    }

    .loadingWrapper {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgb(255 255 255 / 20%);
      backdrop-filter: blur(16px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: ${px2rem(16)};

      .loadingIndicatorWrapper {
        position: relative;
        height: ${px2rem(56)};
        width: ${px2rem(56)};
      }

      .loadingText {
        font-weight: 500;
        font-size: ${px2rem(16)};
        line-height: ${px2rem(26)};
        color: theme;
      }
    }
  }
`;
