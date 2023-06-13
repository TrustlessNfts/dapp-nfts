import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Wrapper = styled.div`
  height: calc(100vh - 276px);
  overflow: hidden auto;
  position: relative;

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
    td:nth-child(1),
    td:nth-child(2) {
      width: calc(400 / 2000 * 100%);
    }

    th:nth-child(3),
    th:nth-child(4),
    td:nth-child(3),
    td:nth-child(4) {
      width: calc(600 / 2000 * 100%);
    }

    th:nth-child(3),
    th:nth-child(4),
    td:nth-child(3),
    td:nth-child(4) {
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
    }

    .token-info-wrapper {
      display: flex;
      align-items: center;
      gap: ${px2rem(14)};

      .thumbnail-wrapper {
        width: ${px2rem(60)};
        height: ${px2rem(60)};
        display: inline-block;
      }

      .token-thumbnail {
        width: ${px2rem(60)};
        height: ${px2rem(60)};
        object-fit: contain;
        border-radius: 4px;
      }

      .token-id {
        font-weight: 500;
        font-size: ${px2rem(14)};
        line-height: ${px2rem(28)};
        letter-spacing: -0.01em;
        color: #ffffff;
      }
    }

    .token-owner-link {
      font-weight: 500;
      font-size: ${px2rem(14)};
      line-height: ${px2rem(28)};
      letter-spacing: -0.01em;
      color: rgba(255, 255, 255, 0.7);
      text-transform: lowercase;
    }

    .purchase-btn {
      padding: ${px2rem(8)} ${px2rem(24)};
      background-color: #ffffff;
      border-radius: 8px;
      font-weight: 500;
      font-size: ${px2rem(14)};
      line-height: ${px2rem(26)};
      color: #1c1c1c;
      display: inline-flex;
      align-items: center;
      gap: ${px2rem(8)};
      width: ${px2rem(171)};
      justify-content: center;

      .token-icon {
        width: ${px2rem(20)};
        height: ${px2rem(20)};
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
