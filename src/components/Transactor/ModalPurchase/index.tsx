import React, { useState } from 'react';
import TransactorBaseModal from '../TransactorBaseModal';
import { IInscription } from '@/interfaces/api/inscription';
import Text from '@/components/Text';
import EstimatedFee from '@/components/EstimatedFee';
import { TRANSFER_TX_SIZE } from '@/configs';
import { SubmitButton } from '../TransactorBaseModal/TransactorBaseModal.styled';
import { formatEthPrice, mappingERC20ToSymbol } from '@/utils/format';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscription;
}

const ModalPurchase = ({ show, handleClose, inscription }: IProps) => {
  const [processing, setProcessing] = useState(false);

  if (!inscription.listingForSales) return null;

  const listingInfo = inscription?.listingForSales[0];

  return (
    <TransactorBaseModal
      title={'Purchase token'}
      show={show}
      handleClose={handleClose}
    >
      <p className={'tokenPrice'}>
        Price:{' '}
        <b>{`${formatEthPrice(listingInfo.price)} ${mappingERC20ToSymbol(
          listingInfo.erc20Token,
        )}`}</b>
      </p>
      <div className="form-item">
        <EstimatedFee txSize={TRANSFER_TX_SIZE} />
      </div>
      <div className="action-wrapper">
        <SubmitButton disabled={processing} type="submit">
          {processing ? 'Processing...' : 'Confirm'}
        </SubmitButton>
      </div>
    </TransactorBaseModal>
  );
};

export default ModalPurchase;
