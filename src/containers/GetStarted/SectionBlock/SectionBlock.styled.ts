import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledSectionBlock = styled.div`
  &.block-wrapper {
    padding: ${px2rem(16)};
    background-color: #fff;
    background: rgba(75, 75, 75, 0.6);
    border-radius: 8px;
    margin-bottom: ${px2rem(28)};

    .content {
      display: flex;
      align-items: center;
      text-transform: uppercase;
      gap: ${px2rem(8)};
      font-size: ${px2rem(20)};
      line-height: ${px2rem(28)};
      font-weight: 500;
      margin-bottom: ${px2rem(12)};
    }
    p {
      font-size: ${px2rem(12)};
      line-height: ${px2rem(18)};

      span {
        font-weight: 700;
      }
    }
  }
`;
