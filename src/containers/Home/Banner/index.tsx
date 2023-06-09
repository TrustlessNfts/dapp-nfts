import UploadFooter from '@/components/UploadFooter';
import { ROUTE_PATH } from '@/constants/route-path';
import ModalCreate from '@/containers/Home/ModalCreate';
import { useIsInViewport } from '@/hooks/useIsInViewport';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { showToastError } from '@/utils/toast';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FeatureList from '../FeatureList';
import { TopBar, Wrapper } from './Banner.styled';

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
        <TopBar>
          <div className="text">
            <span>Are you a creator? </span>
            <span className="create-link" onClick={handleOpenModal}>
              Create BRC-721
            </span>
          </div>
        </TopBar>
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
