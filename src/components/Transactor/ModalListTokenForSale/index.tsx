import React, { useState } from 'react';
import TransactorBaseModal from '../TransactorBaseModal';
import { IInscription } from '@/interfaces/api/inscription';
import logger from '@/services/logger';
import { Formik } from 'formik';
import Form from 'react-bootstrap/Form';
import { TOKEN_OPTIONS, WETH_ADDRESS } from '@/constants/marketplace';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';
import EstimatedFee from '@/components/EstimatedFee';
import { TRANSFER_TX_SIZE } from '@/configs';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscription;
}

const ModalListTokenForSale: React.FC<IProps> = ({
  show,
  handleClose,
  inscription,
}: IProps) => {
  console.log(inscription);
  const [processing, setProcessing] = useState(false);

  const validateForm = () => {

  }

  const handleSubmit = () => {

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
                  <option value={item.value}>{item.label}</option>
                ))}
              </Form.Select>
            </div>
            <div className="form-item">
              <label className='label' htmlFor="price">Price</label>
              <Form.Control
                className={'form-control'}
                value={values.price}
                onChange={handleChange}
                type="number"
                name='price'
                id='price'
                placeholder="Set a price" />
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
