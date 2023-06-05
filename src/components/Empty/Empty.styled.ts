import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledEmpty = styled.div<{ isTable: boolean }>`
  &.notFound {
    display: grid;
    place-items: center;
    position: relative;
    padding-top: ${px2rem(24)};
    padding-bottom: ${px2rem(24)};

    .image {
      margin-bottom: ${px2rem(24)}
    }

    .nodata-text {
      color: #fff;
      font-weight: 500;
      font-size: ${px2rem(16)};
      line-height: 1.4;
      text-align: center;
    }
  }
`;
