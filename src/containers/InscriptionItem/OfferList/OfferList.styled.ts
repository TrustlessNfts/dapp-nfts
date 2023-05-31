import styled from 'styled-components';
import { StyledTableList } from '../Inscription.styled';
import px2rem from '@/utils/px2rem';

export const StyledOfferList = styled(StyledTableList)`
  .offer-amount {
    span {
      opacity: 0.7;
    }
  }

  .offer-action {
    display: flex;
    gap: ${px2rem(4)};

    button {
      color: #fff;
      padding: ${px2rem(2)} ${px2rem(8)};
      border: 1px solid #fff;
      width: 100%;

      &:hover {
        background-color: #fff;
        color: #000;
      }
    }

    .cancel-btn {
      border: none;
      :hover {
        background-color: transparent;
        color: #fff;
        text-decoration: underline;
      }
    }
  }
`;
