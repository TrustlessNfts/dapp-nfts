import Empty from '@/components/Empty';
import ImageWrapper from '@/components/ImageWrapper';
import ModalPurchase from '@/components/Transactor/ModalPurchase';
import { ROUTE_PATH } from '@/constants/route-path';
import { TC_EXPLORER } from '@/constants/url';
import { IInscription } from '@/interfaces/api/inscription';
import { ICollection, IToken } from '@/interfaces/api/marketplace';
import { getUserSelector } from '@/state/user/selector';
import { formatEthPrice, mappingERC20ToIcon } from '@/utils/format';
import { showToastError } from '@/utils/toast';
import { shortenAddress } from '@trustless-computer/dapp-core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { Wrapper } from './TokenList.styled';
import { CollectionContext } from '@/contexts/collection-context';

interface IProps {
  collection: ICollection | null;
  query?: string;
}

const TokenList: React.FC<IProps> = ({
  collection,
}: // query,
IProps): React.ReactElement => {
  const router = useRouter();
  const user = useSelector(getUserSelector);
  const {
    nfts: nftList,
    loadingNfts: loading,
    fetchNFTList,
  } = useContext(CollectionContext);
  const [showPurchase, setShowPurchase] = useState(false);
  const [selectedToken, setSelectedToken] = useState<IToken | null>(null);

  const handleOpenPurchase = (data: IToken) => {
    if (!user.walletAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      showToastError({
        message: 'Please connect wallet to continue.',
      });
      return;
    }
    setShowPurchase(true);
    setSelectedToken(data);
  };

  const handleClosePurchase = () => {
    setShowPurchase(false);
    setSelectedToken(null);
  };

  // const fetchNFTList = async (p?: number): Promise<void> => {
  //   if (!collection) return;

  //   try {
  //     setLoading(true);
  //     const page = p || Math.floor(nftList.length / FETCH_LIMIT) + 1;
  //     const res = await getCollectionNFTList({
  //       contract_address: collection.contract,
  //       page: page,
  //       limit: FETCH_LIMIT,
  //     });

  //     if (page === 1) {
  //       setNftList(res);
  //     } else {
  //       setNftList((prev) => uniqBy([...prev, ...res], 'tokenId'));
  //     }
  //   } catch (err: unknown) {
  //     logger.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!nftList) return <> </>;

  const hasMore = !!collection && nftList.length < collection.totalItems;

  return (
    <>
      <Wrapper className="disable-scrollbar">
        <InfiniteScroll
          className="disable-scrollbar"
          hasMore={hasMore}
          dataLength={nftList.length}
          next={fetchNFTList}
          style={{ overflow: 'hidden auto' }}
          loader={
            loading ? (
              <div className="loading-wrapper">
                <Spinner variant="light" />
              </div>
            ) : (
              <></>
            )
          }
        >
          {!loading && nftList.length === 0 && <Empty />}

          {nftList.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>{`Items`}</th>
                  <th>Owner</th>
                  <th>Buy now</th>
                </tr>
              </thead>
              <tbody>
                {nftList.map((token: IToken) => {
                  return (
                    <tr key={token.tokenId}>
                      <td className="token-info">
                        <div className="token-info-wrapper">
                          <div className="thumbnail-wrapper">
                            <Link
                              href={`${ROUTE_PATH.COLLECTION}/${token.collectionAddress}/token/${token.tokenId}`}
                            >
                              <ImageWrapper
                                className="token-thumbnail"
                                src={token.image}
                                alt={collection?.name}
                              />
                            </Link>
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
                        >
                          {shortenAddress(token.owner)}
                        </Link>
                      </td>
                      <td className="buy-now">
                        {token.buyable &&
                          token.priceErc20.price &&
                          token.priceErc20.erc20Token &&
                          token.priceErc20.offeringId &&
                          user?.walletAddress?.toLowerCase() !==
                            token.owner.toLowerCase() && (
                            <button
                              className="purchase-btn"
                              onClick={() => handleOpenPurchase(token)}
                            >
                              <span>{`Buy ${formatEthPrice(
                                token.priceErc20.price,
                              )}`}</span>
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
          )}
        </InfiniteScroll>
      </Wrapper>

      <ModalPurchase
        show={showPurchase}
        inscription={selectedToken as unknown as IInscription}
        handleClose={handleClosePurchase}
      />
    </>
  );
};

export default React.memo(TokenList);
