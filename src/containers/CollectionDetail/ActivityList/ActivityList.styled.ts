import { StyledTableList } from '@/containers/TokenDetail/TokenDetail.styled';
import { px2rem } from '@trustless-computer/dapp-core';
import styled from 'styled-components';

export const StyledActivityList = styled(StyledTableList)`
  th:nth-child(2),
  th:nth-child(3),
  td:nth-child(3),
  th:nth-child(4),
  td:nth-child(4),
  th:nth-child(5),
  td:nth-child(5) {
    text-align: right;
  }

  .table {
    .tableHead {
      border: none;
      position: sticky;
      top: 0;
      z-index: 2;

      .tableHead_item {
        padding: ${px2rem(12)};
        text-transform: capitalize;
        font-weight: 500;
        font-size: ${px2rem(10)};
        line-height: 1.2;
        color: #ffffff;
        opacity: 0.7;
        vertical-align: middle;
      }
    }

    .tableData {
      .tableData_item {
        padding: ${px2rem(12)};
        font-weight: 500;
        font-size: ${px2rem(10)};
        line-height: 1.2;
        /* text-transform: uppercase; */
        color: #ffffff;
        vertical-align: middle;
      }
    }
  }

  .activity-event {
    text-transform: capitalize;
  }

  .activity-amount {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${px2rem(4)};

    span {
      opacity: 0.7;
    }

    .token-icon {
      width: ${px2rem(14)};
      height: ${px2rem(14)};
      border-radius: 50%;
    }
  }
`;

export const Wrapper = styled.div`
  .data-list {
    max-height: calc(100vh - 566px);
    overflow: hidden auto;
  }

  .loading-wrapper {
    padding: ${px2rem(48)};
    display: flex;
    justify-content: center;
  }

  .table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .table-name {
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: 1.4;
    color: #fff;
    padding: ${px2rem(20)} 0;
    border-bottom: 1px solid #fff;
    display: inline-block;
  }

  .info-wrapper {
    display: flex;
    align-items: center;
    gap: ${px2rem(12)};
  }

  .token-thumbnail {
    border-radius: 4px;
    object-fit: contain;
    flex: 1;
  }

  .thumbnail-wrapper {
    width: ${px2rem(28)};
    height: ${px2rem(28)};
  }

  .tableData_item {
    background: transparent;
  }
`;
