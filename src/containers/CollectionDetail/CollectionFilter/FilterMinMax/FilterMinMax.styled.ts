import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledFilterMinMax = styled.div`
  &.wrapper {
    position: relative;

    .dropdown_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: ${px2rem(12)} ${px2rem(20)};
      border: 1px solid #0000001a;
      transition: all 0.2s;
      cursor: pointer;
      background-color: #1e1e22;
      font-size: ${px2rem(12)};

      &:hover {
        border-color: #898989;
      }
    }

    .icon {
      svg,
      path {
        stroke: #b6b6b6;
      }
    }

    .dropdown {
      position: absolute;
      width: 100%;
      top: ${px2rem(60)};
      left: 0;
      padding: ${px2rem(14)};
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
      border-radius: 8px;
      background-color: black;
      border: 1px solid #5b5b5b;

      flex-direction: column;
      gap: ${px2rem(10)};
      display: none;
      z-index: 10;

      &.show {
        display: flex;
      }

      .input_wrapper {
        display: flex;
        align-items: center;
        gap: ${px2rem(16)};
        padding: ${px2rem(11)} ${px2rem(14)};
        border: 1px solid #353945;
        font-size: ${px2rem(12)};

        .label {
          min-width: ${px2rem(40)};
        }

        .divider {
          width: 1px;
          /* border-left: 1px solid #353945; */
          height: ${px2rem(18)};
          background-color: #353945;
        }

        .input {
          flex: 1;
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: ${px2rem(6)};

          input {
            flex: 1;
            color: white;
            width: 100%;
            /* max-width: ${px2rem(80)}; */

            &::placeholder {
              color: white;
              opacity: 0.5;
            }
          }
        }
      }
    }
  }
`;
