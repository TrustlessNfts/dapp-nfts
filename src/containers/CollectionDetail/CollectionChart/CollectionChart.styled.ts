import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${px2rem(12)};
  }

  .section-title {
    font-weight: 500;
    font-size: ${px2rem(16)};
    line-height: 1.4;
    color: #FFFFFF;
    text-transform: uppercase;
  }

  .chart-filter-wrapper {
    display: flex;
    align-items: center;
  }

  .chart-filter-item {
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(28)};
    color: #FFFFFF;
    padding: ${px2rem(4)} ${px2rem(12)};
    border: 1px solid #333333;

    &:not(:last-child) {
      border-right: none;
    }

    &:hover,
    &.active {
      background-color: #FFFFFF;
      color: #1c1c1c;
    }
  }

  .loading-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 270px;
  }

  .chart-wrapper {
    min-height: 270px;
  }
`