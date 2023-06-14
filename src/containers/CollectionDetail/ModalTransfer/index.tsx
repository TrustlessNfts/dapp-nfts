import Button from '@/components/Button';
import Text from '@/components/Text';
import { ICollection } from '@/interfaces/api/marketplace';
import { Formik } from 'formik';
import { Modal } from 'react-bootstrap';
import { StyledModalUpload, Title, WrapInput } from './ModalTransfer.styled';
import IconSVG from '@/components/IconSVG';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CDN_URL } from '@/configs';
import { validateEVMAddress } from '@/utils';
import { walletLinkSignTemplate } from '@/utils/configs';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useTransferERC721Collection, {
  ITransferERC721CollectionParams,
} from '@/hooks/contract-operations/nft/useTransferERC721Collection';
import { Transaction } from 'ethers';
import ToastConfirm from '@/components/ToastConfirm';
import { showToastError } from '@/utils/toast';
import logger from '@/services/logger';
import EstimatedFee from '@/components/EstimatedFee';
import InsufficientFund from '@/components/InsufficientFund';
import ImageWrapper from '@/components/ImageWrapper';

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
    Transaction | null
  >({
    operation: useTransferERC721Collection,
  });
  const { dAppType, operationName } = useTransferERC721Collection();
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

      const tx = await run({
        contractAddress: collection.contract,
        to: receiverAddress,
      });

      onUpdateSuccess();
      toast.success(
        () => (
          <ToastConfirm
            id="create-success"
            url={walletLinkSignTemplate({
              operationName,
              dAppType,
              hash: Object(tx).hash,
              isRedirect: true,
            })}
            message="Please go to your wallet to authorize the request for the Bitcoin transaction."
            linkText="Go to wallet"
          />
        ),
        {
          duration: 50000,
          position: 'top-right',
          style: {
            maxWidth: '900px',
            borderLeft: '4px solid #00AA6C',
          },
        },
      );
    } catch (err: unknown) {
      logger.error(err);
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

        <div className="collection-detail">
          <div className="thumbnail-wrapper">
            <ImageWrapper
              className="collection-thumbnail"
              src={collection.thumbnail}
              alt={collection.name}
            />
          </div>
          <div className="collection-info">
            <h1 className="collection-name">{collection.name}</h1>
            <p className="collection-index">{`Collection #${collection.index}`}</p>
          </div>
        </div>
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
                <p className="title-input">TRANSFER COLLECTION TO</p>
                <input
                  id="receiverAddress"
                  type="text"
                  name="receiverAddress"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.receiverAddress}
                  className="input"
                  placeholder={`Paste TC wallet address here`}
                  disabled={isProcessing}
                />
                {errors.receiverAddress && touched.receiverAddress && (
                  <p className="error">{errors.receiverAddress}</p>
                )}
              </WrapInput>
              <EstimatedFee />
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
        <InsufficientFund />
      </Modal.Body>
    </StyledModalUpload>
  );
};

export default ModalTransfer;
