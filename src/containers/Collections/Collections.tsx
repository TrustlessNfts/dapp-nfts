/* eslint-disable jsx-a11y/anchor-is-valid */
import Button from '@/components/Button';
import Text from '@/components/Text';
import React, { useState } from 'react';
import { Container, UploadFileContainer } from './Collections.styled';
import List from './List';
import ModalCreate from './ModalCreate';
import { useSelector } from 'react-redux';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';
import { showToastError } from '@/utils/toast';

const Collections = () => {
  const [showModal, setShowModal] = useState(false);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const router = useRouter();

  const handleOpenModal = async () => {
    if (!isAuthenticated) {
      showToastError({
        message: 'Please connect wallet to continue.',
      });
      router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
      return;
    }
    setShowModal(true);
  };

  return (
    <Container>
      <UploadFileContainer>
        <div className="upload_left">
          <div className="upload_content">
            <h3 className="upload_title">BRC-721 on Bitcoin</h3>
            <Text className="upload_description" size="medium" maxWidth="100%">
              BRC-721 is the standard for Non-Fungible Tokens (NFT) on Bitcoin. You
              can use it for collectible items, memberships, in-game items, and more.
            </Text>
          </div>
        </div>
        <div className="upload_right">
          <Button
            className="create-btn"
            background={'linear-gradient(90deg, #9796f0,#fbc7d4)'}
            onClick={handleOpenModal}
          >
            <Text
              size="medium"
              color="bg1"
              className="button-text"
              fontWeight="medium"
            >
              Create BRC-721
            </Text>
          </Button>
        </div>
      </UploadFileContainer>
      <List />
      <ModalCreate show={showModal} handleClose={() => setShowModal(false)} />
    </Container>
  );
};

export default React.memo(Collections);
