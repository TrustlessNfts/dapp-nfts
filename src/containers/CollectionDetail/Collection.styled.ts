import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Container = styled.div`
  min-height: calc(100vh - 80px);
  padding-top: ${px2rem(40)};
  padding-bottom: ${px2rem(40)};

  .collection-trading-info-wrapper {
    display: grid;
    grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);

    .item-list-wrapper {
    }

    .item-activities-wrapper {
    }
  }
`;