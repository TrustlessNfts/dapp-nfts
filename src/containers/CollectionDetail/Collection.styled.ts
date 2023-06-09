import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Container = styled.div`
  min-height: calc(100vh - 80px);
  padding-top: ${px2rem(40)};
  padding-bottom: ${px2rem(40)};

  .collection-trading-info-wrapper {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 6fr) minmax(0, 4fr);
    gap: ${px2rem(24)};

    /* .item-info-wrapper {
      border-left: 1px solid #353945;
      border-right: 1px solid #353945;
      border-top: 1px solid #353945;
      border-bottom: 1px solid #353945;
    }

    .item-list-wrapper {
      border-top: 1px solid #353945;
      border-bottom: 1px solid #353945;
    }

    .item-activities-wrapper {
      border-top: 1px solid #353945;
      border-right: 1px solid #353945;
      border-bottom: 1px solid #353945;
    } */
  }
`;