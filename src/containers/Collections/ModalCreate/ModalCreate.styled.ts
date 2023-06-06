import px2rem from '@/utils/px2rem';
import { Modal } from 'react-bootstrap';
import styled, { DefaultTheme } from 'styled-components';

export const StyledModalUpload = styled(Modal)`
  &.modal {
    --bs-modal-color: ${({ theme }) => theme.bg1};
  }

  .modal-dialog {
    width: 700px !important;
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
    padding-top: ${px2rem(7)};
  }

  .modal-footer {
    border-top: none;
  }

  .dropZone {
    width: 100%;
    margin-bottom: ${px2rem(16)};
    cursor: pointer;
  }

  .dropZoneContainer {
    cursor: pointer;
    margin-bottom: rem(8px);
  }

  .upload-title {
    color: #9997f0;
    display: flex;
    align-items: center;
    gap: ${px2rem(8)};

    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .upload-wrapper {
    padding: ${px2rem(16)} ${px2rem(12)};
    border: 1px solid #cecece;
    border-radius: 8px;
  }

  .file-upload-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: ${px2rem(13)};
  }

  .extra-info {
    padding-left: ${px2rem(16)};
    font-size: ${px2rem(12)};
    line-height: 22px;

    li {
      list-style: disc;
    }
  }

  .divider {
    width: 100%;
    background-color: #cecece;
    height: 1px;
    margin-top: ${px2rem(20)};
    margin-bottom: ${px2rem(20)};
  }

  .confirm {
    width: 100%;
    text-align: center;

    .confirm-btn {
      /* width: 100%; */
      background: linear-gradient(90deg, #9796f0, #fbc7d4);

      .confirm-text {
        padding: ${px2rem(15)} ${px2rem(68)};
        color: #000;
        font-weight: 600;
      }
    }
  }
`;

export const WrapInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${px2rem(16)};

  label {
    font-size: ${px2rem(14)};
    line-height: ${px2rem(20)};
    font-weight: 500;
    margin-bottom: ${px2rem(8)};
  }

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
    border-radius: 8px;
    flex-direction: row;
    align-items: center;
    padding: ${px2rem(12)} ${px2rem(14)};
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
    line-height: ${px2rem(24)};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.text6};
  }
`;

export const Title = styled.h5`
  margin-bottom: ${px2rem(24)};
  font-weight: 600;
`;

export const Checkboxes = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${px2rem(20)};

  label {
    flex: 1;
  }

  .label {
    display: block;
    position: relative;
    padding-left: 36px;
    /* margin-bottom: 12px; */
    cursor: pointer;
    font-size: ${px2rem(14)};
    line-height: 24px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .label input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    /* background-color: #eee; */
    border: 1px solid #b6b6b6;
    border-radius: 2px;
  }

  /* On mouse-over, add a grey background color */
  .label:hover input ~ .checkmark {
    opacity: 0.8;
  }

  /* When the checkbox is checked, add a blue background */
  .label input:checked ~ .checkmark {
    background-color: #9997f0;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .label input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .label .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;
