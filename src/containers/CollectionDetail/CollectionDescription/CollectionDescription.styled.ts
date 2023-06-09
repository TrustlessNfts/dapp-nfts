import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Wrapper = styled.div`
  .description {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    color: #fff;
  }

  .showMoreBtn {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    color: #fff;
  }

  .general-info {
    margin-top: ${px2rem(24)};
  }

  .info-label {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    margin-right: ${px2rem(6)};
    color: #898989;
  }

  .info-value {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    color: #fff;
  }

  .show-more-btn {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    color: #fff;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${px2rem(32)};
    border-bottom: 1px solid #353945;
  }

  .section-title {
    font-weight: 500;
    font-size: ${px2rem(16)};
    line-height: 1.4;
    color: #fff;
    text-transform: uppercase;
    padding: ${px2rem(20)} 0;
    border-bottom: 1px solid #fff;
  }

  .edit-btn {
    padding: ${px2rem(8)};
    background: #2E2E2E;
    border: 1px solid #5B5B5B;
    border-radius: 4px;
    line-height: 1;
  }

  .action-wrapper {
    display: flex;
    align-items: center;
    gap: ${px2rem(12)};
    margin-bottom: ${px2rem(20)};
  }

  .mint-btn {
    padding: ${px2rem(5)} ${px2rem(12)};
    background: linear-gradient(90deg, #9796f0 0%, #fbc7d4 100%);
    border-radius: 4px;
    color: #1c1c1c;
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    flex: 1;
  }

  .transfer-btn {
    padding: ${px2rem(5)} ${px2rem(12)};
    background: transparent;
    color: #95a4fc;
    border: 1px solid #95a4fc;
    border-radius: 4px;
    font-weight: 600;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    flex: 1;
  }

  .social-wrapper {
    margin-top: ${px2rem(20)};
  }

  .share-btn {
    display: inline-flex;
    align-items: center;
    gap: ${px2rem(8)};
    background: #3385FF;
    border-radius: 8px;
    padding: ${px2rem(8)} ${px2rem(16)};

    span {
      font-size: ${px2rem(14)};
      line-height: ${px2rem(24)};
      color: #fff;
    }

  }
`;