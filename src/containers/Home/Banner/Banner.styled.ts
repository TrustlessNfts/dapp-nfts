import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  padding-top: ${px2rem(60)};
  padding-bottom: ${px2rem(60)};

  .title {
    text-align: center;
    font-weight: 500;
    font-size: ${px2rem(40)};
    line-height: ${px2rem(58)};
    color: #fff;
    margin-bottom: ${px2rem(24)};
  }

  .description {
    text-align: center;
    font-weight: 400;
    font-size: ${px2rem(20)};
    line-height: ${px2rem(30)};
    color: rgba(255, 255, 255, 0.7);
    max-width: ${px2rem(984)};
    margin-left: auto;
    margin-right: auto;

    span {
      color: #fff;
      font-weight: 500;
    }
  }
`;