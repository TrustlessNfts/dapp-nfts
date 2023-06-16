import { PropsWithChildren } from 'react';
import { StyledSectionBlock } from './SectionBlock.styled';

type Props = {
  title?: string;
  text?: string;
};

const SectionBlock = ({ title = '', children }: PropsWithChildren<Props>) => {
  return (
    <StyledSectionBlock className="block-wrapper">
      {!!title && <div className="content">{title}</div>}
      {children}
    </StyledSectionBlock>
  );
};

export default SectionBlock;
