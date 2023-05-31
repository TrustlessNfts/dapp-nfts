import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { StyledModalUpload, WrapInput, Title } from './TransferModal.styled';
import Button from '@/components/Button';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import toast from 'react-hot-toast';
import { Formik } from 'formik';
import useTransferERC721Token from '@/hooks/contract-operations/nft/useTransferERC721Token';
import { CDN_URL } from '@/configs';
import { showToastError } from '@/utils/toast';
import logger from '@/services/logger';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';

type Props = {
  show: boolean;
  handleClose: () => void;
  contractAddress?: string;
  tokenId?: string;
};

interface IFormValue {
  toAddress: string;
}

const TransferModal = (props: Props) => {
  const user = useSelector(getUserSelector);
  const router = useRouter();
  const { show = false, handleClose, contractAddress, tokenId } = props;
  const { run } = useContractOperation({
    operation: useTransferERC721Token,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.toAddress) {
      errors.toAddress = 'Receiver wallet address is required.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    if (!user.tcAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    if (!tokenId || !contractAddress) {
      showToastError({
        message: 'Token information not found',
      });
      setIsProcessing(false);
      return;
    }

    const { toAddress } = values;
    try {
      setIsProcessing(true);
      await run({
        tokenId: tokenId,
        to: toAddress,
        from: user.tcAddress,
        contractAddress: contractAddress,
      });
      toast.success('Transaction has been created. Please wait for few minutes.');
      handleClose();
    } catch (err) {
      showToastError({
        message: (err as Error).message,
      })
      logger.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StyledModalUpload show={show} onHide={handleClose} centered>
      <Modal.Header>
        <IconSVG
          className="cursor-pointer"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close.svg`}
          maxWidth={'22px'}
        />
      </Modal.Header>
      <Modal.Body>
        <Title>Transfer NFT</Title>

        <Formik
          key="create"
          initialValues={{
            toAddress: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <WrapInput>
                <label htmlFor="toAddress" className="title-input">
                  TRANSFER NFT TO
                </label>
                <input
                  id="toAddress"
                  type="text"
                  name="toAddress"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.toAddress}
                  className="input"
                  placeholder={`Paste TC wallet address here`}
                />
                {errors.toAddress && touched.toAddress && (
                  <p className="error">{errors.toAddress}</p>
                )}
              </WrapInput>

              <Button background='#1c1c1c' disabled={isProcessing} type="submit" className="confirm-btn">
                <Text size="medium" fontWeight="medium" className="confirm-text">
                  {isProcessing ? 'Processing...' : 'Transfer'}
                </Text>
              </Button>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </StyledModalUpload>
  );
};

export default TransferModal;
