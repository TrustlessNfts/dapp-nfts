import ImageWrapper from '@/components/ImageWrapper';
import { ROUTE_PATH } from '@/constants/route-path';
import { TC_EXPLORER } from '@/constants/url';
import { ICollection, IToken } from '@/interfaces/api/marketplace';
import { getUserSelector } from '@/state/user/selector';
import { shortenAddress } from '@/utils';
import { formatEthPrice, mappingERC20ToIcon } from '@/utils/format';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';

interface IProps {
  nftList: IToken[];
  collection: ICollection | null;
  handleOpenPurchase: (data: IToken) => void;
  selectedTokens: Array<IToken>;
  onChangeSelectedToken: (_v: Array<IToken>) => void;
};

const TokenListView: React.FC<IProps> = (props: IProps): React.ReactElement => {
  const user = useSelector(getUserSelector);
  const { nftList, collection, handleOpenPurchase } = props;
  const router = useRouter();

  const showCheckboxCol = nftList.some((item: IToken) => item.buyable);

  return (
    <table className="data-table">
      <thead>
        <tr>
          {showCheckboxCol && (
            <th></th>
          )}
          <th>{`Items`}</th>
          <th>Owner</th>
          <th>Best offer</th>
          <th>Buy now</th>
        </tr>
      </thead>
      <tbody>
        {nftList.map((token: IToken) => {
          const bestOffer = () => {
            if (!token.makeOffers || token.makeOffers.length === 0) return null;

            const largestPrice = token.makeOffers.reduce((prev, current) =>
              prev.price > current.price ? prev : current,
            );

            return (
              <div className="token-price">
                <span>{formatEthPrice(largestPrice.price)}</span>
                <img
                  className="token-icon"
                  src={mappingERC20ToIcon(largestPrice.erc20Token)}
                  alt="token icon"
                />
              </div>
            );
          };

          return (
            <tr
              key={token.tokenId}
              onClick={() =>
                router.push(
                  `${ROUTE_PATH.COLLECTION}/${token.collectionAddress}/token/${token.tokenId}`,
                )
              }
            >
              {showCheckboxCol && (
                <td className='token-select'></td>
              )}
              <td className="token-info">
                <div className="token-info-wrapper">
                  <div className="thumbnail-wrapper">
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
                  </div>
                </div>
              </td>
              <td className="token-owner">
                <Link
                  href={`${TC_EXPLORER}/address/${token.owner}`}
                  target="_blank"
                  className="token-owner-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  {token?.bnsData?.[0]?.name
                    ? token?.bnsData?.[0]?.name
                    : shortenAddress(token.owner)}
                </Link>
              </td>
              <td className="token-offer">{bestOffer() || '-'}</td>
              <td className="buy-now">
                {token.buyable &&
                  token.priceErc20.price &&
                  token.priceErc20.erc20Token &&
                  token.priceErc20.offeringId &&
                  user?.walletAddress?.toLowerCase() !==
                  token.owner.toLowerCase() && (
                    <button
                      className="purchase-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPurchase(token);
                      }}
                    >
                      <span>{`${formatEthPrice(token.priceErc20.price)}`}</span>
                      <img
                        className="token-icon"
                        src={mappingERC20ToIcon(token.priceErc20.erc20Token)}
                        alt="coin-ic"
                      />
                    </button>
                  )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default React.memo(TokenListView);
