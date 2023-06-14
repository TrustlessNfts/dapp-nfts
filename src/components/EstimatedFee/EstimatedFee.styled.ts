import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: ${px2rem(12)};
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: ${px2rem(28)};
  margin-top: ${px2rem(20)};

  .est-fee-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: ${px2rem(8)};
    }
  }

  .est-fee-title {
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: 1.4;
    color: #1c1c1c;
    margin-bottom: ${px2rem(8)};
  }

  .est-fee-item-title {
    font-weight: 400;
    font-size: ${px2rem(14)};
    line-height: 1.2;
    color: #1c1c1c;
  }

  .est-fee-item-value {
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: 1.2;
    color: #1c1c1c;
  }
`;
