import { ICollection, IToken } from '@/interfaces/api/marketplace';
import { getUserSelector } from '@/state/user/selector';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { StyledTokenGridView } from './TokenGridView.styled';
import ImageWrapper from '@/components/ImageWrapper';
import Link from 'next/link';
import { ROUTE_PATH } from '@/constants/route-path';
import { TC_EXPLORER } from '@/constants/url';
import { shortenAddress } from '@/utils';
import { formatEthPrice, mappingERC20ToIcon } from '@/utils/format';
import Skeleton from '@/components/Skeleton';

type Props = {
  nftList: IToken[];
  collection: ICollection | null;
  handleOpenPurchase: (data: IToken) => void;
};

const TokenGridView = (props: Props) => {
  const user = useSelector(getUserSelector);
  const { nftList, collection, handleOpenPurchase } = props;
  const router = useRouter();

  return (
    <StyledTokenGridView>
      {nftList.map((token: IToken) => (
        <div
          className="token-item"
          key={token.tokenId}
          onClick={() =>
            router.push(
              `${ROUTE_PATH.COLLECTION}/${token.collectionAddress}/token/${token.tokenId}`,
            )
          }
        >
          <div className="thumbnail-wrapper">
            <Skeleton fill className="thumbnail-loading" isLoaded={false} />
            <ImageWrapper
              className="token-thumbnail"
              src={token?.imageCapture ? token.imageCapture : token.image}
              alt={collection?.name}
            />
          </div>
          <div className="token-info">
            <Link
              href={`${ROUTE_PATH.COLLECTION}/${token.collectionAddress}/token/${token.tokenId}`}
              className="token-id"
            >{`#${token.tokenId}`}</Link>
            <Link
              href={`${TC_EXPLORER}/address/${token.owner}`}
              target="_blank"
              className="token-owner-link"
              onClick={(e) => e.stopPropagation()}
            >
              {shortenAddress(token.owner)}
            </Link>
            <div className="buy-now">
              {token.buyable &&
                token.priceErc20.price &&
                token.priceErc20.erc20Token &&
                token.priceErc20.offeringId &&
                user?.walletAddress?.toLowerCase() !== token.owner.toLowerCase() && (
                  <button
                    className="purchase-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPurchase(token);
                    }}
                  >
                    <span>Buy now</span>
                    <p>
                      <span>{`${formatEthPrice(token.priceErc20.price)}`}</span>
                      <img
                        className="token-icon"
                        src={mappingERC20ToIcon(token.priceErc20.erc20Token)}
                        alt="coin-ic"
                      />
                    </p>
                  </button>
                )}
            </div>
          </div>
        </div>
      ))}
    </StyledTokenGridView>
  );
};

export default TokenGridView;
