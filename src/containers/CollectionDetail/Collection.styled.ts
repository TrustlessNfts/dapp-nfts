import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-bottom: ${px2rem(40)};
  padding-top: ${px2rem(40)};

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-top: ${px2rem(24)};
    width: 100%;

    .list {
      margin-top: ${px2rem(92)};
      min-height: 60vh;

      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none;

      ::-webkit-scrollbar {
        display: none; /* for Chrome, Safari, and Opera */
      }
    }

    .loading {
      display: flex;
      justify-content: center;
      margin-top: ${px2rem(32)};
    }
  }
`;

const Grid = styled.div`
  display: grid;
  justify-items: center;
  margin-top: ${px2rem(24)};
  grid-gap: ${px2rem(24)};
  grid-template-columns: repeat(4, 1fr);

  @media screen and (max-width: 1280px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export { Container, Grid };
