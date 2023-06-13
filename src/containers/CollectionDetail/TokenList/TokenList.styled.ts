import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Wrapper = styled.div`
  height: calc(100vh - 276px);
  overflow: hidden auto;

  .token-price {
    display: flex;
    align-items: center;
    gap: ${px2rem(4)};
    justify-content: flex-end;
    span {
      opacity: 0.7;
      font-weight: 400;
    }
  }

  .token-icon {
    width: ${px2rem(14)};
    height: ${px2rem(14)};
    border-radius: 50%;
  }

  .filter-loading {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    background: #1a1a1a;
    opacity: 0.6;
  }

  .loading-wrapper {
    padding: ${px2rem(48)};
    display: flex;
    justify-content: center;
  }

  .data-table {
    width: 100%;

    th:nth-child(1),
    th:nth-child(2),
    th:nth-child(3),
    td:nth-child(1),
    td:nth-child(2),
    td:nth-child(3) {
      width: calc(600 / 3000 * 100%);
    }

    th:nth-child(4),
    th:nth-child(5),
    td:nth-child(4),
    td:nth-child(5) {
      width: calc(400 / 2000 * 100%);
    }

    th:nth-child(3),
    th:nth-child(4),
    th:nth-child(5),
    td:nth-child(3),
    td:nth-child(4),
    td:nth-child(5) {
      text-align: right;
    }

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
        text-transform: uppercase;
        color: #ffffff;
        vertical-align: middle;
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
    }

    .token-info-wrapper {
      display: flex;
      align-items: center;
      gap: ${px2rem(14)};

      .thumbnail-wrapper {
        width: ${px2rem(40)};
        height: ${px2rem(40)};
        display: inline-block;
      }

      .token-thumbnail {
        width: ${px2rem(40)};
        height: ${px2rem(40)};
        object-fit: contain;
        border-radius: 4px;
      }

      .token-id {
        font-weight: 500;
        font-size: ${px2rem(12)};
        line-height: ${px2rem(18)};
        letter-spacing: -0.01em;
        color: #ffffff;
      }
    }

    .token-owner-link {
      font-weight: 500;
      font-size: ${px2rem(12)};
      line-height: ${px2rem(18)};
      letter-spacing: -0.01em;
      color: rgba(255, 255, 255, 0.7);
      text-transform: lowercase;
    }

    .purchase-btn {
      padding: ${px2rem(5)} ${px2rem(16)};
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-radius: 8px;
      font-weight: 500;
      font-size: ${px2rem(12)};
      line-height: ${px2rem(18)};
      display: inline-flex;
      align-items: center;
      gap: ${px2rem(8)};
      min-width: ${px2rem(80)};
      justify-content: center;

      .token-icon {
        width: ${px2rem(16)};
        height: ${px2rem(16)};
        border-radius: 50%;
      }
    }

    .make-offer-btn {
      padding: ${px2rem(8)} ${px2rem(24)};
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      font-weight: 500;
      font-size: ${px2rem(14)};
      line-height: ${px2rem(26)};
      color: #fff;
    }
  }
`;
