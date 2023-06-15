import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledOwnersList = styled.table`
  color: white;

  &.data-table {
    width: 100%;

    thead {
      background: #1e1e22;
      z-index: 2;
      position: sticky;
      top: 0;

      th {
        padding: ${px2rem(12)};
        font-weight: 500;
        font-size: ${px2rem(12)};
        line-height: ${px2rem(22)};
        color: #ffffff;
        vertical-align: middle;
        opacity: 0.7;
      }
    }

    tbody {
      td {
        padding: ${px2rem(12)};
        font-weight: 500;
        font-size: ${px2rem(12)};
        line-height: ${px2rem(22)};
        color: #ffffff;
        vertical-align: middle;
      }
      tr {
        &:hover {
          background: #1e1e22;
          cursor: pointer;
        }
      }

      .owner-info-wrapper {
        display: flex;
        align-items: center;
        gap: ${px2rem(8)};

        .owner-avatar {
          width: ${px2rem(32)};
          height: ${px2rem(32)};
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
`;
