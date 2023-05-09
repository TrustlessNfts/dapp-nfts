import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  .infor {
    display: flex;
    justify-content: space-between;
    gap: 6vw;
  }

  .infor-left {
    display: flex;
    flex-direction: row;
    gap: ${px2rem(24)};

    .image {
      width: ${px2rem(178)};
      height: ${px2rem(178)};
      margin-right: ${px2rem(24)};
      object-fit: cover;
    }
  }

  .infor-content {
    flex: 1;
  }

  .infor-right {
    /* width: 35%; */
    display: flex;
    flex-direction: column;
    gap: ${px2rem(14)};

    .info-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .mintButton {
        padding: ${px2rem(3)} ${px2rem(12)};
        background: linear-gradient(90deg, #9796f0 0%, #fbc7d4 100%);
        border-radius: 100px;
        color: #1c1c1c;
        font-weight: 500;
        font-size: ${px2rem(14)};
        line-height: ${px2rem(24)};

        :disabled {
          opacity: 0.8;
        }
      }

      .editButton {
        padding: ${px2rem(3)} ${px2rem(12)};
        background: transparent;
        color: #95a4fc;

        border: 1px solid #95a4fc;
        border-radius: 100px;

        font-weight: 600;
        font-size: ${px2rem(14)};
        line-height: ${px2rem(24)};

        :disabled {
          opacity: 0.8;
        }
      }
    }

    .social {
      display: flex;
      align-items: center;
      gap: ${px2rem(24)};
      margin-bottom: ${px2rem(8)};
    }

    .owner {
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 20px;
      color: #898989;
    }

    .address {
      font-style: normal;
      font-weight: 500;
      font-size: ${px2rem(18)};
      line-height: ${px2rem(28)};
      letter-spacing: -0.01em;
      color: #ffffff;
    }

    .link {
      font-style: normal;
      font-weight: 500;
      font-size: ${px2rem(18)};
      line-height: ${px2rem(28)};
      letter-spacing: -0.01em;
      text-decoration: none;
      color: ${({ theme }: { theme: DefaultTheme }) => theme.white};

      :hover {
        color: ${({ theme }: { theme: DefaultTheme }) => theme.purple.b};
      }
    }

    .actionWrapper {
      display: flex;
      flex-direction: row;
      gap: ${px2rem(16)};
    }

    .mintWrapper {
      position: relative;
      overflow: hidden;
    }

    .file-uploader {
      opacity: 0;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }

    .row-bottom {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 22%;
    }
  }

  .title {
    font-style: normal;
    font-weight: 600;
    font-size: ${px2rem(34)};
    line-height: ${px2rem(44)};
    color: #ffffff;
    margin-bottom: ${px2rem(4)};
  }

  .subTitle {
    font-weight: 400;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
    color: #ffffff;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 5; /* number of lines to show */
    line-clamp: 5;
    -webkit-box-orient: vertical;
  }

  @media screen and (max-width: 768px) {
    .image {
      width: 120px;
      height: 120px;
    }

    .infor {
      flex-direction: column;
      gap: 12px;
    }

    .infor-left {
      width: 100%;
    }

    .infor-right {
      width: 100%;
      margin-top: ${px2rem(24)};
      .row {
        display: flex;
        flex-direction: row;
        gap: 30%;
      }
    }

    .title {
      font-size: 28px;
      line-height: 32px;
    }

    .subTitle {
      margin-top: 6px;
      -webkit-line-clamp: 4; /* number of lines to show */
      line-clamp: 4;
    }
  }

  @media screen and (max-width: 768px) {
    display: block;

    .infor-left {
      flex-direction: column;
      gap: ${px2rem(24)};
    }

    .link {
      max-width: 100%;
      text-overflow: ellipsis;
      display: inline-block;
      overflow: hidden;
    }
  }
`;

export { Container };
