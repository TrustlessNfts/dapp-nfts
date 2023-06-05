import styled from 'styled-components';
import { StyledTableList } from '../TokenDetail.styled';

export const StyledActivityList = styled(StyledTableList)`
  .activity-event {
    text-transform: capitalize;
  }
  .activity-amount {
    span {
      opacity: 0.7;
    }
  }
`;