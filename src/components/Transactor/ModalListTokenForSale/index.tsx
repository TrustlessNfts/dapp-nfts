import React from 'react';
import TransactorBaseModal from '../TransactorBaseModal';
import { IInscription } from '@/interfaces/api/inscription';
import logger from '@/services/logger';

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
  logger.debug(inscription);

  return (
    <TransactorBaseModal title={'List token for sale'} show={show} handleClose={handleClose}>
      List token for sale
    </TransactorBaseModal>
  )
}

export default ModalListTokenForSale;
