import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Wrapper = styled.div`
  max-height: 800px;
  overflow: auto;

  .loading-wrapper {
    padding: ${px2rem(48)};
    display: flex;
    justify-content: center;
  }

  .data-table {
    width: 100%;

    th:first-child,
    td:first-child {
      width: calc(600 / 2000  * 100%);
    }

    th:not(:first-child),
    td:not(:first-child) {
      width: calc(350 / 2000  * 100%);
    }


    th:nth-child(3),
    th:nth-child(4),
    td:nth-child(3),
    td:nth-child(4) {
      text-align: right;
    }

    thead {
      background: #1E1E22;
      border-bottom: 1px solid #353945;

      th {
        padding: ${px2rem(12)} ${px2rem(24)};
        font-weight: 500;
        font-size: ${px2rem(12)};
        line-height: ${px2rem(22)};
        text-transform: uppercase;
        color: #FFFFFF;
        vertical-align: middle;
      }
    }

    tbody {
      td {
        padding: ${px2rem(12)} ${px2rem(24)};
        font-weight: 500;
        font-size: ${px2rem(12)};
        line-height: ${px2rem(22)};
        color: #FFFFFF;
        vertical-align: middle;
      }
    }

    .token-info-wrapper {
      display: flex;
      align-items: center;
      gap: ${px2rem(16)};

      .token-thumbnail {
        width: ${px2rem(60)};
        height: ${px2rem(60)};
        object-fit: contain;
      }

      .token-id {
        font-weight: 500;
        font-size: ${px2rem(16)};
        line-height: ${px2rem(28)};
        letter-spacing: -0.01em;
        color: #FFFFFF;
      }
    }

    .token-owner-link {
      font-weight: 500;
      font-size: ${px2rem(16)};
      line-height: ${px2rem(28)};
      letter-spacing: -0.01em;
      color: rgba(255, 255, 255, 0.7);
      text-transform: lowercase;
    }

    .purchase-btn {
      padding: ${px2rem(8)} ${px2rem(24)};
      background-color: #FFFFFF;
      border-radius: 8px;
      font-weight: 500;
      font-size: ${px2rem(14)};
      line-height: ${px2rem(26)};
      color: #1C1C1C;
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