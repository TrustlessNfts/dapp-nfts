import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  .tabs {
    border-bottom: none;
    gap: ${px2rem(24)};

    .nav-link {
      font-weight: 500;
      font-size: ${px2rem(16)};
      line-height: 1.4;
      opacity: 0.4;
      color: #fff;
      text-transform: uppercase;
      padding: ${px2rem(20)} 0;
      /* min-width: ${px2rem(142)};     */
      border-radius: 0;
      border: none;

      &.active {
        background: none;
        opacity: 1;
        border-bottom: 1px solid #fff;
      }

      &:hover {
        opacity: 1;
      }
    }
  }

  .tab-content {
    margin-top: ${px2rem(20)};
  }
`;
