import Button from '@/components/Button';
import Text from '@/components/Text';
import { ICollection } from '@/interfaces/api/collection';
import { Formik } from 'formik';
import { Modal } from 'react-bootstrap';
import { StyledModalUpload, Title, WrapInput } from './ModalTransfer.styled';
import IconSVG from '@/components/IconSVG';
import { useState } from 'react';
import { CDN_URL } from '@/configs';
import { validateEVMAddress } from '@/utils';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useTransferERC721Collection, { ITransferERC721CollectionParams } from '@/hooks/contract-operations/nft/useTransferERC721Collection';
import { IRequestSignResp } from 'tc-connect';
import { showToastError, showToastSuccess } from '@/utils/toast';

type Props = {
  collection: ICollection;
  show: boolean;
  handleClose: () => void;
  onUpdateSuccess: () => void;
};

interface IFormValue {
  receiverAddress: string;
}

const ModalTransfer = (props: Props) => {
  const { show = false, handleClose, collection, onUpdateSuccess } = props;
  const { run } = useContractOperation<
    ITransferERC721CollectionParams,
    IRequestSignResp | null
  >({
    operation: useTransferERC721Collection,
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.receiverAddress) {
      errors.receiverAddress = `Receiver's address is required.`;
    } else if (!validateEVMAddress(values.receiverAddress)) {
      errors.receiverAddress = 'Invalid wallet address.';
    }

    return errors;
  };

  const handleSubmit = async (values: IFormValue): Promise<void> => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const { receiverAddress } = values;

      await run({
        contractAddress: collection.contract,
        to: receiverAddress,
      });

      showToastSuccess({
        message: 'Transfered successfully.'
      })
      onUpdateSuccess();
      handleClose();
    } catch (err: unknown) {
      showToastError({
        message: (err as Error).message,
      });
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
        <Title className="font-medium">Transfer collection</Title>
        <Formik
          key="create"
          initialValues={{
            receiverAddress: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <WrapInput>
                <p className="title-input">Receiver&apos;s address</p>
                <input
                  id="receiverAddress"
                  type="text"
                  name="receiverAddress"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.receiverAddress}
                  className="input"
                  placeholder={`Enter receiver's address`}
                  disabled={isProcessing}
                />
                {errors.receiverAddress && touched.receiverAddress && (
                  <p className="error">{errors.receiverAddress}</p>
                )}
              </WrapInput>
              <Button
                type="submit"
                bg="linear-gradient(90deg, #9796f0,#fbc7d4)"
                className="confirm-btn"
                disabled={isProcessing}
                background={'linear-gradient(90deg, #9796f0,#fbc7d4)'}
              >
                <Text size="medium" fontWeight="medium" className="confirm-text">
                  {isProcessing ? 'Processing...' : 'Confirm'}
                </Text>
              </Button>
            </form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
      </Modal.Footer>
    </StyledModalUpload>
  );
};

export default ModalTransfer;
