import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledFeatureList = styled.div`
  flex: 1;
  position: relative;

  .carousel-root {
    max-width: ${px2rem(315)};
    margin-left: auto;
    margin-right: auto;
  }

  .feature-item {
    padding: ${px2rem(6)};
  }

  .thumbnail-wrapper {
    margin-bottom: ${px2rem(24)};
  }

  .collection-info {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .collection-detail {
      text-align: left;

      span {
        color: #cecece;
      }
    }

    .view-btn {
      padding: ${px2rem(5)} ${px2rem(14)};
      color: #95a4fc;
      border: 1px solid #95a4fc;
      position: relative;
      font-weight: 300;

      &:hover {
        color: black;
        background: linear-gradient(
          90deg,
          rgba(151, 150, 240, 0.8),
          rgba(251, 199, 212, 0.8)
        );
      }
    }
  }

  .carousel.carousel-slider {
    overflow: visible;
  }

  .control-dots {
    bottom: -50px;

    .dot {
      width: ${px2rem(24)};
      height: ${px2rem(4)};
      border-radius: ${px2rem(20)};
      position: relative;
      &::after {
        width: 100%;
        height: 100%;
        content: '';
        padding: ${px2rem(6)};
        background-color: transparent;
        position: absolute;
        top: -100%;
        left: 0;
      }
    }
  }
`;
