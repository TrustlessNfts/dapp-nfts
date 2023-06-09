import React, { useState } from 'react';
import { Wrapper } from './Banner.styled';
import Button from '@/components/Button';
import Text from '@/components/Text';
import ModalCreate from '@/containers/Home/ModalCreate';
import { ROUTE_PATH } from '@/constants/route-path';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { showToastError } from '@/utils/toast';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import FeatureList from '../FeatureList';
import UploadFooter from '@/components/UploadFooter';
import { useIsInViewport } from '@/hooks/useIsInViewport';

const Banner: React.FC = (): React.ReactElement => {
  const [showModal, setShowModal] = useState(false);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const router = useRouter();

  const uploadRef = React.useRef<HTMLInputElement>(null);

  const isUploadVisible = useIsInViewport(uploadRef, { threshold: 0.2 });

  const handleOpenModal = async () => {
    if (!isAuthenticated) {
      showToastError({
        message: 'Please connect wallet to continue.',
      });
      router.push(`${ROUTE_PATH.CONNECT_WALLET}`);
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <Wrapper>
        <div className="title-wrapper">
          <h1 className="title">
            The complete
            <br /> Smart Bitcoin NFTs platform
          </h1>
          <p className="description">
            Smart BRC-721 is <span>the first Smart NFT</span> with{' '}
            <span>smart contract</span> on Bitcoin.
            <br />
            Be the 1st ever to own Smart Bitcoin NFTs with a bunch of additional
            utilities now.
          </p>
          <div className="upload-wrapper" ref={uploadRef}>
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
        <FeatureList />
        <ModalCreate show={showModal} handleClose={() => setShowModal(false)} />
      </Wrapper>
      <UploadFooter
        handleOpenModal={handleOpenModal}
        isUploadVisible={isUploadVisible}
      />
    </>
  );
};

export default Banner;
