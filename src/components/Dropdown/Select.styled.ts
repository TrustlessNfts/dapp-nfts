import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const StyledSelect = styled.div`
  .select__control {
    background-color: transparent;
    border: none;
    color: white;
    outline: none;
    box-shadow: none;
    font-size: ${px2rem(14)};
    line-height: 26px;

    .select__single-value {
      color: white;
    }

    .select__indicator-separator {
      display: none;
    }

    .select__dropdown-indicator {
      color: white;
    }

    .select__multi-value__label {
      color: white;
      font-weight: 500;
      font-size: ${px2rem(12)};
      line-height: 26px;
    }

    .select__input-container {
      color: white;
      font-weight: 500;
      font-size: ${px2rem(12)};
      line-height: 26px;
    }
  }

  .select__menu {
    width: ${px2rem(120)};
    right: 0;
    z-index: 100;
    background-color: #1a1a1a;
    border: 1px solid #5b5b5b;

    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    overflow: hidden;
  }

  .select__menu-list {
    padding: 0;
  }

  .select__input-container {
    color: white;
  }

  .select__option {
    padding: ${px2rem(10)} ${px2rem(16)};
    font-weight: 400;
    line-height: (26/14);
    font-size: ${px2rem(14)};

    color: white;

    &:hover {
      background-color: rgba(198, 199, 248, 0.75);
      color: black;
    }
  }

  .select__option--is-focused {
    background-color: transparent;
    color: white;
  }

  .select__option--is-selected {
    background-color: #c6c7f8;
    color: black;

    &:hover {
      background-color: rgba(198, 199, 248, 0.75);
      color: black;
    }
  }
`;
