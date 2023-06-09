import { ICollection } from '@/interfaces/api/marketplace';
import React, { useState } from 'react';
import { Wrapper } from './CollectionDescription.styled';
import ShowMoreText from '@/components/ShowMoreText';
import { formatDateTime } from '@/utils/time';
import ModalEdit from '../ModalEdit';
import ModalMint from '../ModalMint';
import ModalTransfer from '../ModalTransfer';
import { CDN_URL } from '@/configs';
import { TwitterShareButton, TwitterIcon } from 'react-share';
import { shortenAddress } from '@/utils';
import Link from 'next/link';
import { TC_EXPLORER } from '@/constants/url';

interface IProps {
  collection: ICollection | null;
}

const CollectionDescription: React.FC<IProps> = ({ collection }: IProps): React.ReactElement => {
  const description = collection?.description || "";
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalMint, setShowModalMint] = useState(false);
  const [showModalTransfer, setShowModalTransfer] = useState(false);

  const handleOpenEditModal = () => {
    setShowModalEdit(true);
  }

  const handleOpenMintModal = () => {
    setShowModalMint(true);
  }

  const handleOpenTransferModal = () => {
    setShowModalTransfer(true);
  }

  return (
    <>
      <Wrapper>
        <div className='section-header'>
          <h3 className='section-title'>
            Description
          </h3>
          <button className='edit-btn' onClick={handleOpenEditModal}>
            <img src={`${CDN_URL}/icons/edit-03.svg`} alt='edit-03' />
          </button>
        </div>
        <div className='action-wrapper'>
          <button className="mint-btn" onClick={handleOpenMintModal}>
            Mint
          </button>
          <button className="transfer-btn" onClick={handleOpenTransferModal}>
            Transfer
          </button>
        </div>
        {description && (
          <ShowMoreText showMoreClassname='show-more-btn' maxLines={5}>
            <p className={'description'}>{description}</p>
          </ShowMoreText>
        )}
        <div className="general-info">
          {collection?.creator && (
            <div className="info-item">
              <span className='info-label'>Creator: </span><Link target='_blank' href={`${TC_EXPLORER}/address/${collection.creator}`} className='info-value'>{shortenAddress(collection.creator)}</Link>
            </div>
          )}
          {collection?.contract && (
            <div className="info-item">
              <span className='info-label'>Contract: </span><Link target='_blank' href={`${TC_EXPLORER}/address/${collection.contract}`} className='info-value'>{shortenAddress(collection.contract)}</Link>
            </div>
          )}
          {collection?.deployedAtBlock && (
            <div className="info-item">
              <span className='info-label'>Deploy block: </span><span className='info-value'>{collection.deployedAtBlock}</span>
            </div>
          )}
          {collection?.createdAt && (
            <div className="info-item">
              <span className='info-label'>Created date:</span><span className='info-value'>{formatDateTime({
                dateTime: collection.createdAt,
                formatPattern: 'DD MMM YYYY HH:mm'
              })}</span>
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
      </Wrapper >
      {collection && showModalEdit && (
        <ModalEdit
          collection={collection}
          show={showModalEdit}
          handleClose={() => setShowModalEdit(false)}
          onUpdateSuccess={() => window.location.reload()}
        />
      )
      }
      {
        collection && showModalMint && (
          <ModalMint
            collection={collection}
            show={showModalMint}
            handleClose={() => setShowModalMint(false)}
            onUpdateSuccess={() => {
              //
            }}
          />
        )
      }
      {
        collection && showModalTransfer && (
          <ModalTransfer
            collection={collection}
            show={showModalTransfer}
            handleClose={() => setShowModalTransfer(false)}
            onUpdateSuccess={() => {
              //
            }}
          />
        )
      }
    </>
  )
}

export default CollectionDescription;