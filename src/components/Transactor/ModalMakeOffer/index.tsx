import EstimatedFee from '@/components/EstimatedFee';
import { TC_MARKETPLACE_CONTRACT, TRANSFER_TX_SIZE } from '@/configs';
import { TOKEN_OPTIONS, WETH_ADDRESS } from '@/constants/marketplace';
import { IInscription } from '@/interfaces/api/inscription';
import { Formik } from 'formik';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import TransactorBaseModal from '../TransactorBaseModal';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';
import isNaN from 'lodash/isNaN';
import logger from '@/services/logger';
import { showToastError, showToastSuccess } from '@/utils/toast';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useGetAllowanceAmount, { IGetAllowanceAmountParams } from '@/hooks/contract-operations/erc20/useGetAllowanceAmount';
import useApproveTokenAmount, { IApproveTokenAmountParams } from '@/hooks/contract-operations/erc20/useApproveTokenAmount';
import { checkCacheApprovalTokenPermission, setCacheApprovalTokenPermission } from '@/utils/marketplace-storage';
import useMakeTokenOffer, { IMakeTokenOfferParams } from '@/hooks/contract-operations/marketplace/useMakeTokenOffer';
import { MAX_HEX_VALUE } from '@/constants/common';
import { Transaction } from 'ethers'

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscription;
}

interface IFormValues {
  price: string;
  erc20Token: string;
}

const ModalMakeOffer: React.FC<IProps> = ({
  show,
  handleClose,
  inscription,
}: IProps) => {
  const [processing, setProcessing] = useState(false);
  const { run: getAllowanceAmount } = useContractOperation<
    IGetAllowanceAmountParams,
    number
  >({
    operation: useGetAllowanceAmount,
    inscribeable: false,
  });
  const { run: approveTokenAmount } = useContractOperation<
    IApproveTokenAmountParams,
    Transaction | null
  >({
    operation: useApproveTokenAmount,
    inscribeable: true,
  });
  const { run: makeOffer } = useContractOperation<
    IMakeTokenOfferParams,
    Transaction | null
  >({
    operation: useMakeTokenOffer,
    inscribeable: true,
  });

  const validateForm = (values: IFormValues) => {
    const errors: Record<string, string> = {};

    if (!values.price) {
      errors.price = 'Price is required.';
    } else if (isNaN(values.price) || Number(values.price) <= 0) {
      errors.price = 'Invalid number. Must be a numeric and greater than 0.';
    }

    return errors;
  }

  const handleSubmit = async (values: IFormValues) => {
    if (processing || !inscription) return;
    logger.debug(values);

    try {
      setProcessing(true);
      const allowanceAmount = await getAllowanceAmount({
        contractAddress: values.erc20Token,
        operatorAddress: TC_MARKETPLACE_CONTRACT
      });
      const hasApprovalCache = checkCacheApprovalTokenPermission(`${TC_MARKETPLACE_CONTRACT}_${values.erc20Token}`);
      if (!allowanceAmount && !hasApprovalCache) {
        logger.debug(TC_MARKETPLACE_CONTRACT);
        logger.debug(inscription.collectionAddress);

        await approveTokenAmount({
          tokenAddress: values.erc20Token,
          consumerAddress: TC_MARKETPLACE_CONTRACT,
          amount: MAX_HEX_VALUE
        });

        setCacheApprovalTokenPermission(`${TC_MARKETPLACE_CONTRACT}_${values.erc20Token}`);
      }

      logger.debug({
        collectionAddress: inscription.collectionAddress,
        erc20Token: values.erc20Token,
        price: values.price,
        durationTime: 0,
        tokenID: inscription.tokenId,
      });

      await makeOffer({
        collectionAddress: inscription.collectionAddress,
        erc20Token: values.erc20Token,
        price: values.price.toString(),
        durationTime: 0,
        tokenID: inscription.tokenId,
      })

      showToastSuccess({
        message: 'Please go to your wallet to authorize the request for the Bitcoin transaction.'
      })
      handleClose();
    } catch (err: unknown) {
      logger.error(err);
      showToastError({
        message: (err as Error).message
      })
    } finally {
      setProcessing(false);
    }
  };

  return (
    <TransactorBaseModal
      title={'Make offer'}
      show={show}
      handleClose={handleClose}
    >
      <Formik
        key="makeOffer"
        initialValues={{
          erc20Token: WETH_ADDRESS,
          price: '0',
        }}
        validate={validateForm}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-item">
              <label className="label" htmlFor="erc20Token">
                Choose token
              </label>
              <Form.Select
                className={'form-control'}
                value={values.erc20Token}
                onChange={handleChange}
                name="erc20Token"
                id="erc20Token"
              >
                {TOKEN_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </Form.Select>
            </div>
            <div className="form-item">
              <label className="label" htmlFor="price">
                Price
              </label>
              <Form.Control
                className={'form-control'}
                value={values.price}
                onChange={handleChange}
                type="number"
                name="price"
                id="price"
                placeholder="Set a price"
              />
              {(touched.price && errors.price) && (
                <p className='form-control-error'>{errors.price}</p>
              )}
            </div>
            <div className="form-item">
              <EstimatedFee txSize={TRANSFER_TX_SIZE} />
            </div>
            <div className="action-wrapper">
              <SubmitButton disabled={processing} type="submit">
                {processing ? 'Processing...' : 'Confirm'}
              </SubmitButton>
            </div>
          </form>
        )}
      </Formik>
    </TransactorBaseModal>
  );
};

export default ModalMakeOffer;
