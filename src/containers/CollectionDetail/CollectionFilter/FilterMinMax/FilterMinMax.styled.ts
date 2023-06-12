import { colors } from '@/theme/colors';
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

      &:hover {
        border-color: ${colors.black[40]};
      }
    }

    .icon {
      svg,
      path {
        stroke: ${colors.black[20]};
      }
    }

    .dropdown {
      position: absolute;
      width: 100%;
      top: ${px2rem(60)};
      left: 0;
      padding: ${px2rem(14)};
      box-shadow: 35px 15px 120px 0 #00000026;
      background-color: #1e1e22;
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

        .label {
          min-width: ${px2rem(40)};
        }

        .divider {
          /* width: 1px; */
          border-left: 1px solid #353945;
          height: ${px2rem(18)};
          /* background-color: #353945; */
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
