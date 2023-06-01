import React, { PropsWithChildren, ReactNode } from 'react';
import { Accordion as BSAccordion } from 'react-bootstrap';
import { StyledAccordion } from './Accordion.styled';

type Props = {
  header: ReactNode;
};

const Accordion = ({ header, children }: PropsWithChildren<Props>) => {
  return (
    <StyledAccordion defaultActiveKey="0">
      <BSAccordion.Item eventKey="0">
        <BSAccordion.Header>{header}</BSAccordion.Header>
        <BSAccordion.Body>
          <div className="accordion-divider"></div>

          {children}
        </BSAccordion.Body>
      </BSAccordion.Item>
    </StyledAccordion>
  );
};

export default Accordion;
