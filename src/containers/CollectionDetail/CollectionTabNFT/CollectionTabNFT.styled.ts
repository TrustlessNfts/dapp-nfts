import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Wrapper = styled.div`
  padding-left: ${px2rem(24)};
  padding-right: ${px2rem(24)};

  .tabs {
    border-bottom: none;

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
        border-bottom: 2px solid #fff;
      }

      &:hover {
        opacity: 1;
      }
    }
  }

  .filterList {
    display: flex;
    align-items: center;
    gap: ${px2rem(10)};
    margin-bottom: ${px2rem(12)};
    margin-top: ${px2rem(12)};
    flex-wrap: wrap;

    > button {
      max-height: ${px2rem(48)};
      font-weight: 500;
      color: white;
    }
  }

  .filterItem {
    gap: ${px2rem(10)};
    border: 1px solid #5b5b5b;
    padding: ${px2rem(11)} ${px2rem(12)};
    border-radius: 8px;
    width: fit-content;
  }
`;
