import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledGetStarted = styled.div`
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  color: #fff;
  padding-bottom: ${px2rem(40)};

  h2 {
    text-transform: capitalize;
    font-size: ${px2rem(42)};
    line-height: 52/48;
    text-align: center;
    margin: ${px2rem(60)} 0;
  }

  .wrapper {
    margin-top: ${px2rem(40)};
    display: flex;
    flex-direction: column;
    gap: ${px2rem(40)};
  }

  .inscribe-wrapper {
    position: relative;
  }

  .inscribe-options {
    display: flex;
    align-items: center;
    gap: ${px2rem(40)};
    margin-left: auto;
    margin-right: auto;
    color: #fff;
    z-index: 999;
    position: relative;

    .button-container {
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }

    .button-text {
      padding: ${px2rem(10)} ${px2rem(35)};
    }
  }
`;

export const StepBlock = styled.div`
  padding: ${px2rem(24)};
  width: 100%;
  transition: all 0.3s ease-in-out;
  opacity: 1;
  background: rgba(37, 0, 46, 0.6);
  border-radius: 20px;

  &.hide {
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    pointer-events: none;
    transition: all 0.3s ease-in-out;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    gap: ${px2rem(48)};
  }

  h3 {
    font-size: ${px2rem(24)};
    line-height: ${px2rem(36)};
    text-transform: uppercase;
    margin-bottom: ${px2rem(24)};
  }
  .image-wrapper {
    margin-top: ${px2rem(24)};
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: ${px2rem(700)};
    overflow: hidden;
    border-radius: 20px;
    margin-left: auto;
    margin-right: auto;

    img {
      transform: scale(1.01);

      @media screen and (max-width: 500px) {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
`;

export const Separator = styled.div`
  text-transform: uppercase;
  background: #313235;
  text-align: center;
  padding: ${px2rem(20)} 0;
  letter-spacing: 0.2em;
  font-size: ${px2rem(26)};
  line-height: ${px2rem(40)};
  clip-path: polygon(
    20% 0%,
    98% 0,
    100% 22%,
    100% 100%,
    80% 100%,
    2% 100%,
    0 80%,
    0 0
  );
`;
