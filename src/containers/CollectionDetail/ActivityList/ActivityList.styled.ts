import { StyledTableList } from '@/containers/TokenDetail/TokenDetail.styled';
import { px2rem } from '@trustless-computer/dapp-core';
import styled from 'styled-components';

export const StyledActivityList = styled(StyledTableList)`
  .table {
    .tableHead {
      .tableHead_item {
        padding: ${px2rem(12)} ${px2rem(24)};
        font-weight: 500;
        font-size: ${px2rem(12)};
        line-height: ${px2rem(22)};
        text-transform: uppercase;
        color: #FFFFFF;
        vertical-align: middle;
      }
    }

    .tableData {
      .tableData_item {
        padding: ${px2rem(12)} ${px2rem(24)};
        font-weight: 500;
        font-size: ${px2rem(12)};
        line-height: ${px2rem(22)};
        text-transform: uppercase;
        color: #FFFFFF;
        vertical-align: middle;
      }
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

export const Wrapper = styled.div`
  border-top: 1px solid #353945;

  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .table-name {
    font-weight: 500;
    font-size: ${px2rem(16)};
    line-height: 1.4;
    color: #fff;
    text-transform: uppercase;
    padding: ${px2rem(20)} ${px2rem(24)};
  }
`;
