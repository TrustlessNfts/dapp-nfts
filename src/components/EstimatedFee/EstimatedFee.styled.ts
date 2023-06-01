import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  .est-fee {
    margin-top: ${px2rem(20)};
    margin-bottom: ${px2rem(28)};
  }

  .est-fee-options {
    display: flex;
    align-items: center;
    gap: ${px2rem(10)};
  }

  .est-fee-item {
    flex: 1;
    padding: ${px2rem(8)} ${px2rem(16)};
    border: 1px solid #cecece;
    border-radius: 8px;
    display: grid;
    place-items: center;
    text-align: center;
  }

  .ext-price {
    color: #9796f0;
    font-size: ${px2rem(14)};
    span {
      font-size: ${px2rem(12)};
    }
  }
`;
