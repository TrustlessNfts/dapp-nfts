import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-bottom: ${px2rem(20)};

  .input-container {
    position: relative;
    width: 100%;
    border: 1px solid #353945;
    border-radius: 8px;

    .search-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: ${px2rem(18)};
    }

    input {
      height: ${px2rem(50)};
      width: 100%;
      padding-left: ${px2rem(52)};
      color: #fff;
      font-weight: 400;
      font-size: ${px2rem(16)};
      line-height: ${px2rem(28)};
    }
  }
`;
