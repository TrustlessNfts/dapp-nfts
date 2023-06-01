import React, { PropsWithChildren } from 'react';
import { StyledOfferModal } from './TransactorBaseModal.styled';
import { Modal } from 'react-bootstrap';
import IconSVG from '@/components/IconSVG';
import { CDN_URL } from '@/configs';

interface IProps extends PropsWithChildren {
  show: boolean;
  title: string;
  handleClose: () => void;
};

const TransactorBaseModal: React.FC<IProps> = (props: IProps) => {
  const { show = false, handleClose, children, title } = props;

  return (
    <StyledOfferModal show={show} onHide={handleClose} centered size={'lg'}>
      <Modal.Header closeButton={false}>
        <IconSVG
          className="cursor-pointer"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close-1.svg`}
          maxWidth={'16'}
        />
      </Modal.Header>
      <Modal.Body className='modal-body'>
        <h3 className="font-medium modal-title">{title}</h3>
        {children}
      </Modal.Body>
    </StyledOfferModal>
  );
};

export default TransactorBaseModal;
