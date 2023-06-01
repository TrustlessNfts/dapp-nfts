import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledCTAButtons = styled.div`
  margin-top: ${px2rem(40)};
  display: inline-flex;
  gap: ${px2rem(12)};

  .cta-btn {
    padding: ${px2rem(10)} ${px2rem(24)};
  }
`;
