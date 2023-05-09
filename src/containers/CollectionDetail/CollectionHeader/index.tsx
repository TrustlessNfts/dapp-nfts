import IconSVG from '@/components/IconSVG';
import NFTDisplayBox from '@/components/NFTDisplayBox';
import { CDN_URL } from '@/configs';
import { TC_EXPLORER } from '@/constants/url';
import { ICollection } from '@/interfaces/api/collection';
import { getUserSelector } from '@/state/user/selector';
import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from './CollectionHeader.styled';

interface ICollectionHeader {
  collection?: ICollection;
  onClickEdit: () => void;
  onClickMint: () => void;
}

const CollectionHeader = (props: ICollectionHeader) => {
  const { collection, onClickEdit, onClickMint } = props;
  const user = useSelector(getUserSelector);

  const isOwner =
    user?.walletAddress?.toLowerCase() === collection?.creator.toLowerCase();

  return (
    <Container>
      {collection && (
        <div className="infor">
          <div className="infor-left">
            <NFTDisplayBox contentClass="image" thumbnail={collection?.thumbnail} />
            <div className="infor-content">
              <p className="title">{collection?.name}</p>
              <p className="subTitle">{collection?.description}</p>
            </div>
          </div>
          <div className="infor-right">
            <div className="info-header">
              <div className="social">
                <a
                  href={`${TC_EXPLORER}/address/${collection?.contract}`}
                  target="_blank"
                >
                  <img src={`${CDN_URL}/icons/ic-tc-explorer-24x24.svg`} />
                </a>
                {collection.social.website && (
                  <a
                    href={collection.social.website}
                    target="_blank"
                    className="link"
                  >
                    <IconSVG
                      src={`${CDN_URL}/icons/ic_website_black.svg`}
                      maxWidth="24px"
                    />
                  </a>
                )}
                {collection.social.discord && (
                  <a
                    href={collection.social.discord}
                    target="_blank"
                    className="link"
                  >
                    <IconSVG
                      src={`${CDN_URL}/icons/ic_discord_black.svg`}
                      maxWidth="24px"
                    />
                  </a>
                )}
                {collection.social.twitter && (
                  <a
                    href={collection.social.twitter}
                    target="_blank"
                    className="link"
                  >
                    <IconSVG
                      src={`${CDN_URL}/icons/ic_twitter_black.svg`}
                      maxWidth="24px"
                    />
                  </a>
                )}
              </div>
              {isOwner && (
                <div className="actionWrapper">
                  <button className="editButton" onClick={onClickEdit}>
                    Edit
                  </button>
                  <div className="mintWrapper">
                    <button className="mintButton" onClick={onClickMint}>
                      Mint
                    </button>
                    {/* <FileUploader
                      onSelect={onChangeFile}
                      name={'fileUploader'}
                      classes={'file-uploader'}
                      fileOrFiles={file}
                      types={ERC721_SUPPORTED_EXTENSIONS}
                    /> */}
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="owner">OWNER</p>
              <a
                href={`https://explorer.trustless.computer/address/${collection?.creator}`}
                target="_blank"
                className="link"
              >
                {collection?.creator}
              </a>
            </div>
            <div>
              <p className="owner">CONTRACT</p>
              <a
                href={`https://explorer.trustless.computer/address/${collection?.contract}`}
                target="_blank"
                className="link"
              >
                {collection?.contract}
              </a>
            </div>
            <div className="row-bottom">
              <div>
                <p className="owner">COLLECTION NUMBER</p>
                <p className="address">#{collection?.index}</p>
              </div>
              <div>
                <p className="owner">ITEMS</p>
                <p className="address">{collection?.totalItems}</p>
              </div>
              <div>
                <p className="owner">BLOCK</p>
                <p className="address">{collection?.deployedAtBlock}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default React.memo(CollectionHeader);
