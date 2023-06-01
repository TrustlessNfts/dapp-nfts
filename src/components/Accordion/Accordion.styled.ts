import px2rem from '@/utils/px2rem';
import { Accordion } from 'react-bootstrap';
import styled from 'styled-components';

export const StyledAccordion = styled(Accordion)`
  --padding: ${px2rem(24)};

  .accordion-item {
    background-color: transparent;
    border-radius: 12px;
    border: 1px solid #898989;
  }
  .accordion-header {
    button {
      padding: var(--padding);
      box-shadow: none;
      background-color: transparent;
      color: white;

      &:after {
        filter: brightness(0) invert(1);
      }
    }
  }
  .accordion-body {
    background-color: transparent;
    padding: var(--padding);
    padding-top: 0;
  }
  .accordion-divider {
    background-color: #898989;
    width: 100%;
    height: 1px;
    margin-bottom: var(--padding);
  }
`;
