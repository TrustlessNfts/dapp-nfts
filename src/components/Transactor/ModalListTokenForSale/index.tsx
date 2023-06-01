import React, { useState } from 'react';
import TransactorBaseModal from '../TransactorBaseModal';
import { IInscription } from '@/interfaces/api/inscription';
import logger from '@/services/logger';
import { Formik } from 'formik';
import Form from 'react-bootstrap/Form';
import { TOKEN_OPTIONS, WETH_ADDRESS } from '@/constants/marketplace';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';
import EstimatedFee from '@/components/EstimatedFee';
import { TC_MARKETPLACE_CONTRACT, TRANSFER_TX_SIZE } from '@/configs';
import { isNaN } from 'lodash';
import cs from 'classnames';
import { showToastError, showToastSuccess } from '@/utils/toast';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { IRequestSignResp } from 'tc-connect';
import useIsApprovedForAll, { IIsApprovedForAllParams } from '@/hooks/contract-operations/nft/useIsApprovedForAll';
import useSetApprovalForAll, { ISetApprovalForAllParams } from '@/hooks/contract-operations/marketplace/useSetApprovalForAll';
import useListTokenForSale, { IListTokenForSaleParams } from '@/hooks/contract-operations/marketplace/useListTokenForSale';
import { checkCacheApprovalPermission, setCacheApprovalPermission } from '@/utils/marketplace-storage';

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
  const [processing, setProcessing] = useState(false);
  const { run: isTokenApproved } = useContractOperation<
    IIsApprovedForAllParams,
    boolean
  >({
    operation: useIsApprovedForAll,
  });
  const { run: setApprovalForAll } = useContractOperation<
    ISetApprovalForAllParams,
    IRequestSignResp | null
  >({
    operation: useSetApprovalForAll,
  });
  const { run: listToken } = useContractOperation<
    IListTokenForSaleParams,
    IRequestSignResp | null
  >({
    operation: useListTokenForSale,
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
      const isApproved = await isTokenApproved({
        contractAddress: inscription.collectionAddress,
        operatorAddress: TC_MARKETPLACE_CONTRACT
      });
      const hasApprovalCache = checkCacheApprovalPermission(`${TC_MARKETPLACE_CONTRACT}_${inscription.collectionAddress}`);
      if (!isApproved && !hasApprovalCache) {
        logger.debug(TC_MARKETPLACE_CONTRACT);
        logger.debug(inscription.collectionAddress);

        await setApprovalForAll({
          operatorAddress: TC_MARKETPLACE_CONTRACT,
          contractAddress: inscription.collectionAddress,
        })

        setCacheApprovalPermission(`${TC_MARKETPLACE_CONTRACT}_${inscription.collectionAddress}`);
      }

      logger.debug({
        collectionAddress: inscription.collectionAddress,
        erc20Token: values.erc20Token,
        price: values.price,
        durationTime: 0,
        tokenID: inscription.tokenId,
      });
      await listToken({
        collectionAddress: inscription.collectionAddress,
        erc20Token: values.erc20Token,
        price: values.price.toString(),
        durationTime: 0,
        tokenID: inscription.tokenId,
      })

      showToastSuccess({
        message: 'Listed for sale successfully.'
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
  }

  return (
    <TransactorBaseModal title={'List token for sale'} show={show} handleClose={handleClose}>
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
              <label className='label' htmlFor="erc20Token">Choose token</label>
              <Form.Select
                className={'form-control'}
                value={values.erc20Token}
                onChange={handleChange}
                name='erc20Token'
                id='erc20Token'>
                {TOKEN_OPTIONS.map(item => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </Form.Select>
            </div>
            <div className="form-item">
              <label className='label' htmlFor="price">Price</label>
              <Form.Control
                className={cs('form-control', {
                  'has-error': touched.price && errors.price
                })}
                value={values.price}
                onChange={handleChange}
                type="number"
                name='price'
                id='price'
                placeholder="Set a price"
              />
              {(touched.price && errors.price) && (
                <p className='form-control-error'>{errors.price}</p>
              )}
            </div>
            <div className="form-item">
              <EstimatedFee
                txSize={TRANSFER_TX_SIZE}
              />
            </div>
            <div className="action-wrapper">
              <SubmitButton
                disabled={processing}
                type='submit'>
                {processing ? 'Processing...' : 'Confirm'}
              </SubmitButton>
            </div>
          </form>
        )}
      </Formik>
    </TransactorBaseModal>
  )
}

export default ModalListTokenForSale;
