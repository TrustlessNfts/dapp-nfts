import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledCTAButtons = styled.div`
  margin-top: ${px2rem(40)};
  padding: ${px2rem(24)};
  border: 1px solid #898989;
  border-radius: 12px;

  .current-price-wrapper {
    margin-bottom: ${px2rem(12)};

    .current-price-label {
      font-weight: 400;
      font-size: ${px2rem(16)};
      line-height: 1.5;
      color: #B6B6B6;
    }

    .current-price-value {
      font-weight: 600;
      font-size: ${px2rem(28)};
      line-height: ${px2rem(38)};
      display: flex;
      align-items: center;
      gap: ${px2rem(6)};

      .token-icon {
        width: ${px2rem(24)};
        height: ${px2rem(24)};
        object-fit: contain;
        border-radius: 50%;
      }
    }
  }

  .action-wrapper {
    display: flex;
    gap: ${px2rem(12)};
  }

  .cta-btn {
    padding: ${px2rem(15)} ${px2rem(24)};
    flex: 1;
    font-weight: 500;
    font-size: ${px2rem(18)};
    line-height: ${px2rem(26)};
    border-radius: 4px;
    max-width: 50%;

    &:hover {
      opacity: 1;
      color: #fff;
    }
  }

  .buy-btn {
    background: linear-gradient(90deg, #9796F0 0%, #FBC7D4 100%);
    color: #1C1C1C;
  }

  .make-offer-btn {
    background: #1c1c1c;
    color: #C6C7F8;
    position: relative;

    &::before {
      content: ' ';
      position: absolute;
      display: block;
      top: -1px; 
      right: -1px; 
      bottom: -1px; 
      left: -1px; 
      z-index: -1;
      border-radius: inherit; 
      background: linear-gradient(to right, #9796F0, #FBC7D4);
    }
  }
`;
