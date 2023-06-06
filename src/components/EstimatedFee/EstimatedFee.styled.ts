import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  .est-fee {
    margin-top: ${px2rem(20)};
    margin-bottom: ${px2rem(28)};
  }

  .est-fee-options {
    background: #FAFAFA;
    border-radius: 8px;
    padding: ${px2rem(12)};
    background: #FAFAFA;
  }

  .est-fee-item {
    padding-bottom: ${px2rem(8)};
    padding-top: ${px2rem(8)};

    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      padding-bottom: 0;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #E9E9E9;
    }
  }

  .est-fee-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .est-fee-title {
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: 150%;
    margin-bottom: ${px2rem(4)};
    color: #1c1c1c;
  }

  .ext-price {
    font-weight: 400;
    font-size: ${px2rem(12)};
    line-height: 150%;
    color: #5B5B5B;
  }
`;
