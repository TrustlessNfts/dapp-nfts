import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  .loading-wrapper {
    min-height: ${px2rem(400)};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .data-table {
    td {
      padding-top: ${px2rem(16)};
      padding-bottom: ${px2rem(16)};
      cursor: pointer;
      background-color: #1a1a1a;
    }

    th:first-child,
    td:first-child {
      width: calc(600 / 2000  * 100%);
    }

    th:not(:first-child),
    td:not(:first-child) {
      width: calc(350 / 2000  * 100%);
      text-align: right;
    }

    @media screen and (max-width: 768px) {
      min-width: ${px2rem(900)};
      th:first-child,
      td:first-child {
        position:sticky;
        left: 0;
        z-index: 99;
        width: calc(500 / 2000  * 100%);
      }

      th:not(:first-child),
      td:not(:first-child) {
        width: calc(375 / 2000  * 100%);
      }
    }
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
`;