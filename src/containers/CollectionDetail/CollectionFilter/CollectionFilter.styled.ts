import { colors } from '@/theme/colors';
import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledCollectionFilter = styled.div`
  .radio_buynow {
    margin-top: ${px2rem(24)};
    margin-bottom: ${px2rem(20)};

    * {
      line-height: (24/14);
      font-size: ${px2rem(14)};
    }
  }

  .rarity {
    margin-bottom: ${px2rem(24)};
  }

  .filter_traits {
    margin-top: ${px2rem(20)};

    &_dropdown {
      margin-top: ${px2rem(20)};
      display: flex;
      flex-direction: column;
      gap: ${px2rem(12)};
    }
  }

  .attribute-select {
    .select__control {
      background: #1e1e22;
      padding: ${px2rem(12)} ${px2rem(16)};
    }
    .select__value-container {
      padding: 0;
    }
    .select__input-container {
      padding: 0;
      margin: 0;
    }
    .select__dropdown-indicator {
      padding: 0;
    }
    .select__menu {
      width: 100%;
    }

    .select__menu-list {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* Internet Explorer and Edge */

      /* Optional: Custom scroll behavior */
      &::-webkit-scrollbar {
        width: 0.5em; /* Adjust the width according to your preference */
      }

      &::-webkit-scrollbar-track {
        background-color: transparent; /* Set to your desired color or remove to use the default */
      }

      &::-webkit-scrollbar-thumb {
        background-color: ${colors
          .black[80]}; /* Set to your desired color or remove to use the default */
      }
    }

    .select__option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:hover {
        background: #c6c7f8;
        color: black;
      }
    }
    .select__option--is-focused,
    .select__option--is-selected {
      background: transparent;
      color: white;
    }
  }
`;
