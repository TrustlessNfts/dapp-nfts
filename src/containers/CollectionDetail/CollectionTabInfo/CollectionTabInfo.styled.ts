import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Wrapper = styled.div`
  border-right: 1px solid #353945;
  border-top: 1px solid #353945;

  .tabs {
    border-bottom: 1px solid #353945;

    .nav-link {
      font-weight: 500;
      font-size: ${px2rem(16)};
      line-height: 1.4;
      opacity: 0.4;
      color: #fff;
      text-transform: uppercase;
      padding: ${px2rem(20)} 0;
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
`