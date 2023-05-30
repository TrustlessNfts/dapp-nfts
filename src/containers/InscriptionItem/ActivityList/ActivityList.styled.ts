import styled from 'styled-components';
import { StyledTableList } from '../Inscription.styled';

export const StyledActivityList = styled(StyledTableList)`
  .activity-event {
    text-transform: uppercase;
  }
  .activity-amount {
    span {
      opacity: 0.7;
    }
  }
`;
