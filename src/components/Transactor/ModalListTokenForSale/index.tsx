import EstimatedFee from '@/components/EstimatedFee';
import { TC_MARKETPLACE_CONTRACT } from '@/configs';
import { TOKEN_OPTIONS, WETH_ADDRESS } from '@/constants/marketplace';
import useListTokenForSale, {
  IListTokenForSaleParams,
} from '@/hooks/contract-operations/marketplace/useListTokenForSale';
import useSetApprovalForAll, {
  ISetApprovalForAllParams,
} from '@/hooks/contract-operations/marketplace/useSetApprovalForAll';
import useIsApprovedForAll, {
  IIsApprovedForAllParams,
} from '@/hooks/contract-operations/nft/useIsApprovedForAll';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { IInscription } from '@/interfaces/api/inscription';
import logger from '@/services/logger';
import { exponentialToDecimal } from '@/utils/format';
import {
  checkCacheApprovalPermission,
  setCacheApprovalPermission,
} from '@/utils/marketplace-storage';
import { showToastError, showToastSuccess } from '@/utils/toast';
import cs from 'classnames';
import { Transaction } from 'ethers';
import { Formik } from 'formik';
import isNaN from 'lodash/isNaN';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import TransactorBaseModal from '../TransactorBaseModal';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscription;
}

interface IFormValues {
  price: string;
  erc20Token: string;
}

const ModalListTokenForSale: React.FC<IProps> = ({
  show,
  handleClose,
  inscription,
}: IProps) => {
  const user = useSelector(getUserSelector);
  const [processing, setProcessing] = useState(false);
  const { run: isTokenApproved } = useContractOperation<
    IIsApprovedForAllParams,
    boolean
  >({
    operation: useIsApprovedForAll,
    inscribeable: false,
  });
  const { run: setApprovalForAll } = useContractOperation<
    ISetApprovalForAllParams,
    Transaction | null
  >({
    operation: useSetApprovalForAll,
    inscribeable: false,
  });
  const { run: listToken } = useContractOperation<
    IListTokenForSaleParams,
    Transaction | null
  >({
    operation: useListTokenForSale,
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
  };

  const handleSubmit = async (values: IFormValues) => {
    if (processing || !inscription) return;
    logger.debug(values);

    try {
      setProcessing(true);
      const { price, erc20Token } = values;
      const isApproved = await isTokenApproved({
        contractAddress: inscription.collectionAddress,
        operatorAddress: TC_MARKETPLACE_CONTRACT,
      });
      const hasApprovalCache = checkCacheApprovalPermission(
        `${user.walletAddress}_${TC_MARKETPLACE_CONTRACT}_${inscription.collectionAddress}`,
      );
      if (!isApproved && !hasApprovalCache) {
        logger.debug(TC_MARKETPLACE_CONTRACT);
        logger.debug(inscription.collectionAddress);

        await setApprovalForAll({
          operatorAddress: TC_MARKETPLACE_CONTRACT,
          contractAddress: inscription.collectionAddress,
        });

        setCacheApprovalPermission(
          `${user.walletAddress}_${TC_MARKETPLACE_CONTRACT}_${inscription.collectionAddress}`,
        );
      }

      logger.debug({
        collectionAddress: inscription.collectionAddress,
        erc20Token: erc20Token,
        price: price,
        durationTime: 0,
        tokenID: inscription.tokenId,
      });

      await listToken({
        collectionAddress: inscription.collectionAddress,
        erc20Token: erc20Token,
        price: exponentialToDecimal(Number(price)),
        durationTime: 0,
        tokenID: inscription.tokenId,
      });

      showToastSuccess({
        message:
          'Please go to your wallet to authorize the request for the Bitcoin transaction.',
      });
      handleClose();
    } catch (err: unknown) {
      logger.error(err);
      showToastError({
        message: (err as Error).message,
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <TransactorBaseModal
      title={'List token for sale'}
      show={show}
      handleClose={handleClose}
    >
      <Formik
        key="listTokenForSale"
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
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="form-item">
              <label className="label" htmlFor="price">
                Price
              </label>
              <Form.Control
                className={cs('form-control', {
                  'has-error': touched.price && errors.price,
                })}
                value={values.price}
                onChange={handleChange}
                type="number"
                name="price"
                id="price"
                placeholder="Set a price"
              />
              {touched.price && errors.price && (
                <p className="form-control-error">{errors.price}</p>
              )}
            </div>
            <div className="form-item">
              <EstimatedFee />
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

export default ModalListTokenForSale;
