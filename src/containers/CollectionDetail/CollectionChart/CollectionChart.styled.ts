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
    font-size: ${px2rem(14)};
    line-height: 1.4;
    color: #ffffff;
  }

  .chart-filter-wrapper {
    display: flex;
    align-items: center;
  }

  .chart-filter-item {
    font-weight: 500;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(28)};
    color: #ffffff;
    padding: ${px2rem(4)} ${px2rem(12)};
    border: 1px solid #333333;

    &:not(:last-child) {
      border-right: none;
    }

    &:first-child {
      border-radius: 4px 0 0 4px;
    }

    &:last-child {
      border-radius: 0 4px 4px 0;
    }

    &:hover,
    &.active {
      background-color: #ffffff;
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
`;
