import { useSelector } from 'react-redux';
import NFTDisplayBox from '../NFTDisplayBox';
import { IMAGE_TYPE } from '../NFTDisplayBox/constant';
import { Styled } from './NFTCard.styled';
import { getUserSelector } from '@/state/user/selector';
import React, { useMemo, useState } from 'react';
import TransferModal from './TransferModal';

export interface INFTCard {
  href: string;
  image?: string;
  thumbnail?: string;
  contract?: string;
  tokenId?: string;
  contentType?: IMAGE_TYPE;
  title1?: string;
  title2?: string;
  title3?: string;
  owner?: string;
}

const NFTCard = ({
  href,
  image,
  thumbnail,
  contract,
  tokenId,
  contentType,
  title1,
  title2,
  title3,
  owner,
}: INFTCard) => {
  const user = useSelector(getUserSelector);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const hanldeOpenTransferModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setShowTransferModal(true);
  };

  const hanldeCloseTransferModal = () => {
    setShowTransferModal(false);
  };

  const isOwner = useMemo(() => {
    return user?.walletAddress && user?.walletAddress?.toLowerCase() === owner?.toLowerCase();
  }, [owner, user]);

  return (
    <>
      <Styled href={href}>
        <div className="card-content">
          <div className="card-image">
            <NFTDisplayBox
              collectionID={contract}
              contentClass="image"
              thumbnail={thumbnail}
              src={image}
              tokenID={tokenId}
              type={contentType}
            />
            <a className="overlay" href={href} />
          </div>
          <div className="card-info">
            {title1 && <p className="card-title1">{title1}</p>}
            {title2 && <p className="card-title2">{title2}</p>}
            {title3 && <p className="card-title3">{title3}</p>}
          </div>
          {isOwner && (
            <div className="owner-actions">
              <button onClick={hanldeOpenTransferModal} className="transfer-button">
                Transfer
              </button>
            </div>
          )}
        </div>
      </Styled>
      <TransferModal
        show={showTransferModal}
        handleClose={hanldeCloseTransferModal}
        contractAddress={contract}
        tokenId={tokenId}
      />
    </>
  );
};

export default NFTCard;
