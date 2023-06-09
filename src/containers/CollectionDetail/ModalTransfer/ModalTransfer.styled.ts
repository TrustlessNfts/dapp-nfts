import px2rem from '@/utils/px2rem';
import { Modal } from 'react-bootstrap';
import styled, { DefaultTheme } from 'styled-components';

export const StyledModalUpload = styled(Modal)`
  &.modal {
    --bs-modal-color: ${({ theme }) => theme.bg1};
  }

  .modal-content {
    border-radius: 12px;
  }

  .modal-header {
    border-bottom: none;
    padding: 0;
    display: flex;
    justify-content: flex-end;
    padding-top: ${px2rem(18)};
    padding-right: ${px2rem(18)};
  }

  .modal-body {
    padding: ${px2rem(32)};
    padding-bottom: ${px2rem(16)};
    padding-top: ${px2rem(0)};
  }

  .modal-footer {
    border-top: none;
  }

  .confirm-btn {
    width: 100%;
    margin-top: ${px2rem(8)};

    .confirm-text {
      padding-top: ${px2rem(11)};
      padding-bottom: ${px2rem(11)};
      color: #1c1c1c;
    }
  }

  .collection-detail {
    display: flex;
    align-items: center;
    gap: ${px2rem(16)};
    padding: ${px2rem(12)};
    margin-bottom: ${px2rem(20)};
    background: #fafafa;
    border-radius: 8px;

    .collection-thumbnail {
      width: ${px2rem(48)};
      height: ${px2rem(48)};
      object-fit: contain;
    }

    .collection-name {
      font-weight: 600;
      font-size: ${px2rem(16)};
      line-height: 1.4;
      color: #333;
    }

    .collection-index {
      font-weight: 400;
      font-size: ${px2rem(12)};
      line-height: ${px2rem(18)};
      letter-spacing: -0.01em;
      color: #333;
    }
  }
`;

export const WrapInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${px2rem(16)};

  .title-input {
    font-weight: 500;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(20)};
    text-transform: uppercase;
    color: ${({ theme }: { theme: DefaultTheme }) => theme.primary['5b']};
    margin-bottom: ${px2rem(4)};
  }

  .input {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${px2rem(12)};
    gap: ${px2rem(16)};
    font-weight: 400;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};

    border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.border3};

    :hover {
      border: 1px solid
        ${({ theme }: { theme: DefaultTheme }) => theme.primary.brand};
    }
  }

  .error {
    font-weight: 400;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(28)};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.text6};
  }
`;

export const Title = styled.h5`
  margin-bottom: ${px2rem(20)};
  font-weight: 600;
`;
