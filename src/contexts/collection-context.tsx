import {
  TraitStats,
  IGetCollectionNFTListParams,
  IToken,
} from '@/interfaces/api/marketplace';
import logger from '@/services/logger';
import {
  getCollectionAttributes,
  getCollectionNFTList,
} from '@/services/marketplace';
import uniqBy from 'lodash/uniqBy';
import { useRouter } from 'next/router';
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface ICollectionContext {
  nfts: Array<IToken>;
  attributes: Array<TraitStats> | null;
  query: Omit<IGetCollectionNFTListParams, 'contract_address'>;
  setQuery: Dispatch<
    SetStateAction<Omit<IGetCollectionNFTListParams, 'contract_address'>>
  >;
  loadingNfts: boolean;
  fetchNFTList: (p?: number) => void;
  totalNfts: number;
  filterLoading: boolean;
}

const initialValue: ICollectionContext = {
  nfts: [],
  attributes: [],
  query: {
    rarity: '',
    attributes: '',
    token_id: '',
    sort_by: '',
    sort: '',
    buyable: false,
    from_price: '',
    to_price: '',
  },
  setQuery: (_) => {
    return;
  },
  loadingNfts: false,
  fetchNFTList: () => {
    return;
  },
  totalNfts: 0,
  filterLoading: false,
};

const FETCH_LIMIT = 32;

export const CollectionContext =
  React.createContext<ICollectionContext>(initialValue);

export const CollectionProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const router = useRouter();
  const { contract } = router.query as { contract: string };
  const [nfts, setNfts] = React.useState<Array<IToken>>([]);
  const [totalNfts, setTotalNfts] = useState(0);
  const [collectionAttrs, setCollectionAttrs] = useState<TraitStats[]>([]);
  const [query, setQuery] = React.useState<
    Omit<IGetCollectionNFTListParams, 'contract_address'>
  >({});
  const [loadingNfts, setLoadingNfts] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  const fetchNFTList = useCallback(
    async (p?: number): Promise<void> => {
      if (!contract) return;

      try {
        setLoadingNfts(true);
        if (p === 1) setFilterLoading(true);
        const page = p || Math.floor(nfts.length / FETCH_LIMIT) + 1;
        const res = await getCollectionNFTList({
          contract_address: contract,
          page: page,
          limit: FETCH_LIMIT,
          ...query,
        });
        if (res && res.items) {
          if (page === 1) {
            setNfts(res.items);
          } else {
            setNfts((prev) => uniqBy([...prev, ...res.items], 'tokenId'));
          }
          setTotalNfts(res.totalItem);
        }
      } catch (err: unknown) {
        logger.error(err);
      } finally {
        setLoadingNfts(false);
        setFilterLoading(false);
      }
    },
    [contract, query, setNfts, nfts.length],
  );

  const fetchCollectionAttrs = useCallback(async (): Promise<void> => {
    if (!contract) return;

    try {
      const res = await getCollectionAttributes({
        contract_address: contract,
      });
      setCollectionAttrs(res);
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [contract]);

  useEffect(() => {
    fetchNFTList();
    fetchCollectionAttrs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchNFTList(1);
  }, [query]);

  const contextValues = useMemo((): ICollectionContext => {
    return {
      nfts,
      attributes: collectionAttrs,
      query,
      setQuery,
      loadingNfts,
      fetchNFTList,
      totalNfts,
      filterLoading,
    };
  }, [
    nfts,
    query,
    setQuery,
    loadingNfts,
    fetchNFTList,
    collectionAttrs,
    totalNfts,
    filterLoading,
  ]);

  return (
    <CollectionContext.Provider value={contextValues}>
      {children}
    </CollectionContext.Provider>
  );
};
