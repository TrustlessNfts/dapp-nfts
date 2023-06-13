import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledRadioGroups = styled.div`
  .groups {
    display: flex;
    flex-wrap: wrap;
    column-gap: ${px2rem(24)};
    row-gap: ${px2rem(6)};

    .inputGroups {
      display: flex;
      align-items: center;
      gap: ${px2rem(10)};

      label {
        cursor: pointer;
        color: white;
      }
    }

    input[type='radio'] {
      appearance: none;
      background-color: #fff;
      margin: 0;
      color: white;
      width: ${px2rem(16)};
      height: ${px2rem(16)};
      border: 2px solid white;
      border-radius: 50%;
      transition: 120ms border ease-in-out;
      cursor: pointer;
    }

    input[type='radio']:checked {
      border: 5px solid #9796f0;
    }
  }
`;
