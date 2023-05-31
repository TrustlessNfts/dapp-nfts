import React from 'react';
import TransactorBaseModal from '../TransactorBaseModal';
import { IInscription } from '@/interfaces/api/inscription';
import Text from '@/components/Text';

interface IProps {
  show: boolean;
  handleClose: () => void;
  inscription: IInscription;
}

const ModalCancelOffer = ({ show, handleClose, inscription }: IProps) => {
  const [processing, setProcessing] = useState(false);

  return (
    <TransactorBaseModal
      title={'Cancel offer?'}
      show={show}
      handleClose={handleClose}
    >
      <Text>
        This will cancel your offer. You will also be asked to confirm this
        cancelation from your wallet
      </Text>
    </TransactorBaseModal>
  );
};

export default ModalCancelOffer;
