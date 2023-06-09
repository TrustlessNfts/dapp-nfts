import { StyledTableList } from '@/containers/TokenDetail/TokenDetail.styled';
import { px2rem } from '@trustless-computer/dapp-core';
import styled from 'styled-components';

export const StyledActivityList = styled(StyledTableList)`
  .table {
    .tableHead {
      border: none;
      
      .tableHead_item {
        padding: ${px2rem(12)};
        font-weight: 500;
        font-size: ${px2rem(10)};
        line-height: 1.2;
        text-transform: uppercase;
        color: #FFFFFF;
        vertical-align: middle;
      }
    }

    .tableData {
      .tableData_item {
        padding: ${px2rem(12)};
        font-weight: 500;
        font-size: ${px2rem(10)};
        line-height: 1.2;
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

  .info-wrapper {
    display: flex;
    align-items: center;
    gap: ${px2rem(12)};
  }

  .token-thumbnail {
    width: ${px2rem(40)};
    height: ${px2rem(40)};
    border-radius: 4px;
    object-fit: contain;
  }
`;
