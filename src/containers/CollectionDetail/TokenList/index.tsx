import Empty from '@/components/Empty';
import IconSVG from '@/components/IconSVG';
import InfiniteLoading from '@/components/InfiniteLoading';
import ModalPurchase from '@/components/Transactor/ModalPurchase';
import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { CollectionContext } from '@/contexts/collection-context';
import { IInscription } from '@/interfaces/api/inscription';
import { ICollection, IToken } from '@/interfaces/api/marketplace';
import { getUserSelector } from '@/state/user/selector';
import { showToastError } from '@/utils/toast';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import TokenGridView from './Grid';
import TokenListView from './Table';
import { ViewOptions, Wrapper } from './TokenList.styled';
import { debounce } from 'lodash';

interface IProps {
  collection: ICollection | null;
  query?: string;
}

const TokenList: React.FC<IProps> = ({ collection }: IProps): React.ReactElement => {
  const router = useRouter();

  const { mode } = router.query as { mode: string };

  const user = useSelector(getUserSelector);
  const {
    nfts: nftList,
    loadingNfts: loading,
    fetchNFTList,
    totalNfts,
    filterLoading,
    query,
    setQuery,
  } = useContext(CollectionContext);

  const [showPurchase, setShowPurchase] = useState(false);
  const [selectedToken, setSelectedToken] = useState<IToken | null>(null);
  const [isGridView, setIsGridView] = useState(true);

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

  useEffect(() => {
    setIsGridView(mode !== 'list');
  }, [mode]);

  if (!nftList) return <> </>;

  const hasMore = !!collection && nftList.length < totalNfts;

  const renderView = () => {
    if (!isGridView) {
      return (
        <TokenListView
          nftList={nftList}
          handleOpenPurchase={handleOpenPurchase}
          collection={collection}
        />
      );
    }
    return (
      <TokenGridView
        nftList={nftList}
        handleOpenPurchase={handleOpenPurchase}
        collection={collection}
      />
    );
  };

  return (
    <>
      <ViewOptions>
        <div className={'searchInput_wrapper'}>
          <input
            className={'input'}
            onChange={debounce((e) => {
              setQuery({
                ...query,
                token_id: e.target.value,
              });
            }, 300)}
            placeholder="Token ID"
            type="text"
          />
          <div className={'search-icon'}>
            <IconSVG
              maxWidth={'16'}
              src={`${CDN_URL}/pages/nfts/icons/ic-search.svg`}
            />
          </div>
        </div>
        <div className="view-options-wrapper">
          <IconSVG
            src={`${CDN_URL}/pages/nfts/icons/ic-list.svg`}
            maxWidth="16"
            color="white"
            type="stroke"
            className={`${isGridView ? '' : 'opacity-100'}`}
            onClick={() => setIsGridView(false)}
          />
          <IconSVG
            src={`${CDN_URL}/pages/nfts/icons/ic-layout-grid.svg`}
            maxWidth="16"
            color="white"
            type="stroke"
            className={`${isGridView ? 'opacity-100' : ''}`}
            onClick={() => setIsGridView(true)}
          />
        </div>
      </ViewOptions>
      <Wrapper className="disable-scrollbar">
        {!loading && nftList.length === 0 && <Empty />}
        {filterLoading && (
          <div className="filter-loading">
            <Spinner variant="light" />
          </div>
        )}
        {nftList.length > 0 && renderView()}
        {hasMore && (
          <InfiniteLoading
            fetchMoreData={fetchNFTList}
            isLoading={loading}
            hasMoreData={hasMore}
          />
        )}
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
