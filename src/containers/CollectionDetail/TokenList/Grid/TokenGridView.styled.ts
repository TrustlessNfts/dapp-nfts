import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledTokenGridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${px2rem(220)}, 1fr));
  gap: ${px2rem(24)};
  padding-top: ${px2rem(24)};
  color: white;

  .token-item {
    border-radius: ${px2rem(4)};
    overflow: hidden;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .thumbnail-loading {
    /* position: absolute;
    top: 0;
    left: 0; */
    position: relative;
    aspect-ratio: 1/1;
  }

  .thumbnail-wrapper {
    position: relative;
  }

  .token-thumbnail {
    border-radius: ${px2rem(4)};
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .token-info {
    display: flex;
    flex-direction: column;
    padding: ${px2rem(16)};

    .token-id {
      font-size: ${px2rem(14)};
    }
    .token-owner-link {
      font-size: ${px2rem(12)};
      opacity: 0.7;
      margin-bottom: ${px2rem(12)};
    }
  }

  .purchase-btn {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: ${px2rem(12)};
    padding: ${px2rem(5)} ${px2rem(20)};
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: ${px2rem(4)};

    .inscription-price {
      display: inline-flex;
      align-items: center;
      gap: ${px2rem(4)};
    }
  }
`;
