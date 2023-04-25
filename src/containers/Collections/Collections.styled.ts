import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-self: center;
  margin-top: ${px2rem(80)};

  @media screen and (max-width: 768px) {
    margin-top: ${px2rem(40)};
  }
`;

export const UploadFileContainer = styled.div`
  padding: ${px2rem(24)} ${px2rem(32)};
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${px2rem(40)};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
  gap: ${px2rem(28)};

  .upload_left {
    display: flex;
    gap: ${px2rem(20)};
    align-items: center;
    flex: 1;
  }

  .upload_right {
    position: relative;
    overflow: hidden;
  }

  .upload_title {
    margin-bottom: ${px2rem(16)};
  }

  .upload_description {
    max-width: 80ch;
    opacity: 0.7;
  }

  .button-text {
    font-family: 'IBMPlexMono' !important;
    padding: ${px2rem(11)} ${px2rem(36)};
  }

  .file-uploader {
    opacity: 0;
    position: absolute;
    width: ${px2rem(150)};
    top: 0;
  }

  @media screen and (max-width: 768px) {
    display: block;
    padding: ${px2rem(24)};

    .upload_description {
      margin-bottom: ${px2rem(16)};
    }
  }
`;
