import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${px2rem(40)};
  padding-bottom: ${px2rem(40)};
  border-bottom: 1px solid #353945;

  .left-content {
    display: flex;
    align-items: center;
    gap: ${px2rem(16)};

    .collection-thumbnail {
      width: ${px2rem(48)};
      height: ${px2rem(48)};
      object-fit: contain;
    }

    .collection-name {
      font-weight: 600;
      font-size: ${px2rem(24)};
      line-height: 1.4;
      color: #fff;
    }

    .collection-index {
      font-weight: 400;
      font-size: ${px2rem(16)};
      line-height: ${px2rem(28)};
      color: rgba(255, 255, 255, 0.7);
      letter-spacing: -0.01em;
    }
  }

  .right-content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: ${px2rem(68)};

    .trading-info-item {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: ${px2rem(4)};
    }

    .info-label {
      font-size: ${px2rem(14)};
      line-height: ${px2rem(22)};
      text-transform: uppercase;
      color: #a1a8b8;
    }

    .info-value {
      font-weight: 500;
      font-size: ${px2rem(16)};
      line-height: ${px2rem(28)};
      letter-spacing: -0.01em;
      color: #ffffff;
      span img {
        margin-left: ${px2rem(4)};
      }
    }
  }
`;
