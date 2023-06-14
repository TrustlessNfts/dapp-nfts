import styled from 'styled-components';
import { StyledTableList } from '../TokenDetail.styled';

export const StyledActivityList = styled(StyledTableList)`
  .tableHead {
    .tableHead_item {
      text-transform: capitalize;
    }
  }
  .tableData {
    .tableData_item {
      background: transparent;
    }
  }

  .activity-event {
    text-transform: capitalize;
  }
  .activity-amount {
    span {
      opacity: 0.7;
    }
  }
`;
