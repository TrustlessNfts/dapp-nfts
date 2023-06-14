import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Container = styled.div`
  min-height: calc(100vh - 80px);

  .collection-trading-info-wrapper {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 6fr) minmax(0, 4fr);
    gap: ${px2rem(24)};
    border-bottom: 1px solid #353945;

    .item-info-wrapper {
      position: relative;
      .tabs {
        display: flex;
        align-items: center;
        gap: ${px2rem(24)};
        border-color: #353945;

        .nav-link {
          background-color: transparent;
          color: #fff;
          border: none;
          opacity: 0.5;
          padding: ${px2rem(20)} 0;
          text-transform: uppercase;
        }

        .nav-link.active {
          opacity: 1;
          border-bottom: 2px solid #fff;
        }
      }

      .edit-btn {
        padding: ${px2rem(8)};
        background: #2e2e2e;
        border: 1px solid #5b5b5b;
        border-radius: 4px;
        line-height: 1;
        position: absolute;
        top: ${px2rem(20)};
        right: 0;
      }
    }

    .item-list-wrapper {
      border-left: 1px solid #353945;
      border-right: 1px solid #353945;
      position: relative;
    }

    .activity-list-wrapper {
      border-bottom: 1px solid #353945;
      margin-bottom: 20px;
    }
  }

  .tabs {
    .nav-link {
      font-weight: 500;
      font-size: ${px2rem(14)};
      line-height: 1.4;
    }
  }
`;
