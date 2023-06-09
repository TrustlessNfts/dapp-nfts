import React, { useState } from 'react';
import { Wrapper } from './Banner.styled';
import Button from '@/components/Button';
import Text from '@/components/Text';
import ModalCreate from '@/containers/Collections/ModalCreate';
import { ROUTE_PATH } from '@/constants/route-path';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { showToastError } from '@/utils/toast';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const Banner: React.FC = (): React.ReactElement => {
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
    <Wrapper>
      <div className="">
        <h1 className="title">The complete Bitcoin NFTs platform</h1>
        <p className="description">
          BRC-721 is kind of NFT on Bitcoin chain.
          <br />
          Be the 1st ever to own a Bitcoin NFT now.
        </p>
        <div className="upload-wrapper">
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
      </div>
      <div className="feature-list"></div>
      <ModalCreate show={showModal} handleClose={() => setShowModal(false)} />
    </Wrapper>
  );
};

export default Banner;
