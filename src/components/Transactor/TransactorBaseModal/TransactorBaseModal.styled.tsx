import { MainModal } from '@/components/Modal/MainModal.styled';
import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const StyledOfferModal = styled(MainModal)`
  .modal-body {
    padding: ${px2rem(28)};
  }

  .modal-title {
    font-weight: 700;
    font-size: ${px2rem(24)};
    line-height: ${px2rem(44)};
    text-align: center;
    margin-bottom: ${px2rem(20)};
  }

  .form-item {
    margin-bottom: ${px2rem(16)};
  }

  .form-control {
    background-color: #fff;
    font-weight: 400;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
    color: #1c1c1c;
    padding: ${px2rem(8)} ${px2rem(12)};
    border: 1px solid rgba(0,0,0,.102);
    border-radius: 4px;
    width: 100%;

    &.has-error {
      border-color: #ff4747;
    }
  }

  .form-control-error {
    font-weight: 400;
    font-size: ${px2rem(12)};
    line-height: 1.5;
    color: #ff4747;
    margin-top: ${px2rem(6)};
  }

  .label {
    font-weight: 400;
    font-size: ${px2rem(14)};
    line-height: 1.5;
    color: rgba(0,0,0,.6);
    margin-bottom: ${px2rem(6)};
    text-transform: uppercase;
  }

  .action-wrapper {
    margin-top: ${px2rem(24)};
  }
`;

export const SubmitButton = styled.button`
  padding: ${px2rem(12)};
  background: linear-gradient(90deg,#9796f0 0%,#fbc7d4 100%);
  border-radius: 100px;
  color: #1c1c1c;
  font-weight: 500;
  font-size: ${px2rem(16)};
  line-height: 1.5;
  width: 100%;
  text-align: center;
`;
