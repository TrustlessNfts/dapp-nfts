import ShowMoreText from '@/components/ShowMoreText';
import { TC_EXPLORER } from '@/constants/url';
import { ICollection } from '@/interfaces/api/marketplace';
import { getUserSelector } from '@/state/user/selector';
import { shortenAddress } from '@/utils';
import { formatDateTime } from '@/utils/time';
import Link from 'next/link';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TwitterIcon, TwitterShareButton } from 'react-share';
import ModalMint from '../ModalMint';
import ModalTransfer from '../ModalTransfer';
import { Wrapper } from './CollectionDescription.styled';

interface IProps {
  collection: ICollection | null;
}

const CollectionDescription: React.FC<IProps> = ({
  collection,
}: IProps): React.ReactElement => {
  const description = collection?.description || '';
  const user = useSelector(getUserSelector);
  const [showModalMint, setShowModalMint] = useState(false);
  const [showModalTransfer, setShowModalTransfer] = useState(false);

  const isOwner =
    user?.walletAddress?.toLowerCase() === collection?.creator.toLowerCase();

  const handleOpenMintModal = () => {
    setShowModalMint(true);
  };

  const handleOpenTransferModal = () => {
    setShowModalTransfer(true);
  };

  return (
    <>
      <Wrapper>
        <div className="section-header"></div>
        {isOwner && (
          <div className="action-wrapper">
            <button className="mint-btn" onClick={handleOpenMintModal}>
              Mint
            </button>
            <button className="transfer-btn" onClick={handleOpenTransferModal}>
              Transfer
            </button>
          </div>
        )}
        {description && (
          <ShowMoreText showMoreClassname="show-more-btn" maxLines={5}>
            <p className={'description'}>{description}</p>
          </ShowMoreText>
        )}
        <div className="general-info">
          {collection?.creator && (
            <div className="info-item">
              <span className="info-label">Creator: </span>
              <Link
                target="_blank"
                href={`${TC_EXPLORER}/address/${collection.creator}`}
                className="info-value"
              >
                {shortenAddress(collection.creator)}
              </Link>
            </div>
          )}
          {collection?.contract && (
            <div className="info-item">
              <span className="info-label">Contract: </span>
              <Link
                target="_blank"
                href={`${TC_EXPLORER}/address/${collection.contract}`}
                className="info-value"
              >
                {shortenAddress(collection.contract)}
              </Link>
            </div>
          )}
          {collection?.deployedAtBlock && (
            <div className="info-item">
              <span className="info-label">Deploy block: </span>
              <span className="info-value">{collection.deployedAtBlock}</span>
            </div>
          )}
          {collection?.createdAt && (
            <div className="info-item">
              <span className="info-label">Created date:</span>
              <span className="info-value">
                {formatDateTime({
                  dateTime: collection.createdAt,
                  formatPattern: 'DD MMM YYYY HH:mm',
                })}
              </span>
            </div>
          )}
        </div>

        <div className="social-wrapper">
          <TwitterShareButton
            url={window.location.href}
            title={collection?.name || ''}
            hashtags={[]}
            className={'share-btn'}
          >
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
        </div>
      </Wrapper>
      {collection && showModalMint && (
        <ModalMint
          collection={collection}
          show={showModalMint}
          handleClose={() => setShowModalMint(false)}
          onUpdateSuccess={() => {
            //
          }}
        />
      )}
      {collection && showModalTransfer && (
        <ModalTransfer
          collection={collection}
          show={showModalTransfer}
          handleClose={() => setShowModalTransfer(false)}
          onUpdateSuccess={() => {
            //
          }}
        />
      )}
    </>
  );
};

export default CollectionDescription;
