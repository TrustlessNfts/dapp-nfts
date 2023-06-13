import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  .data-table {
    td {
      padding-top: ${px2rem(16)};
      padding-bottom: ${px2rem(16)};
      cursor: pointer;
      background-color: #1a1a1a;
    }

    th:first-child,
    td:first-child {
      width: calc(600 / 2000 * 100%);
    }

    th:not(:first-child),
    td:not(:first-child) {
      width: calc(350 / 2000 * 100%);
      text-align: right;
    }

    @media screen and (max-width: 768px) {
      min-width: ${px2rem(900)};
      th:first-child,
      td:first-child {
        position: sticky;
        left: 0;
        z-index: 99;
        width: calc(500 / 2000 * 100%);
      }

      th:not(:first-child),
      td:not(:first-child) {
        width: calc(375 / 2000 * 100%);
      }
    }
  }

  .collection-index {
    font-weight: 400;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(20)};
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: -0.01em;
  }

  .collection-info {
    display: flex;
    align-items: center;
    gap: ${px2rem(16)};

    .collection-img {
      width: ${px2rem(60)};
      height: ${px2rem(60)};
      object-fit: cover;
    }
  }

  .floor-price,
  .volume {
    span img {
      margin-left: ${px2rem(4)};
    }
  }
`;
