import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Wrapper = styled.div`
  .description {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    color: #fff;
  }

  .showMoreBtn {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    color: #fff;
  }

  .general-info {
    margin-top: ${px2rem(24)};
  }

  .info-label {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    margin-right: ${px2rem(6)};
    color: #898989;
  }

  .info-value {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    color: #fff;
  }
`;