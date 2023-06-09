import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  padding-top: ${px2rem(60)};
  padding-bottom: ${px2rem(60)};
  display: flex;
  align-items: center;

  .title {
    font-weight: 400;
    font-size: ${px2rem(40)};
    line-height: ${px2rem(58)};
    color: #fff;
    margin-bottom: ${px2rem(24)};
    letter-spacing: ${px2rem(-0.5)};
  }

  .description {
    font-weight: 300;
    font-size: ${px2rem(18)};
    line-height: ${px2rem(24)};
    color: rgba(255, 255, 255, 0.7);
    max-width: ${px2rem(772)};
    margin-left: auto;
    margin-right: auto;
    margin-bottom: ${px2rem(32)};

    span {
      color: #fff;
      font-weight: 500;
    }
  }

  .upload-wrapper {
    display: flex;
  }

  .create-btn {
    padding: ${px2rem(14)} ${px2rem(36)};
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
  }
`;
