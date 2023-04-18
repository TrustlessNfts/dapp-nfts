import { PropsWithChildren } from 'react';
import { CSSProperties } from 'styled-components';
import { StyledButton } from './Button.styled';

export type ButtonProps = {
  bg?: CSSProperties['backgroundColor'];
  background?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  props?: HTMLButtonElement;
  type?: 'submit' | 'reset' | 'button' | undefined;
};

const Button = ({
  type,
  bg = 'bg1',
  background,
  className,
  onClick,
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <StyledButton type={type} bg={bg} background={background} className={className} onClick={onClick} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;
