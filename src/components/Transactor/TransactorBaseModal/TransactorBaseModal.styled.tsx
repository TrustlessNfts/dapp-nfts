import { MainModal } from '@/components/Modal/MainModal.styled';
import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const StyledOfferModal = styled(MainModal)`
  .modalTitle {
    font-weight: 700;
    font-size: ${px2rem(24)};
    line-height: ${px2rem(44)};
    text-align: center;
    margin-bottom: ${px2rem(20)};
  }
`;
