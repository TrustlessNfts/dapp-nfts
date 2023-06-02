import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { ICollectedUTXOResp } from '@/interfaces/api/bitcoin';
import { useAppSelector } from '@/state/hooks';
import { getUserSelector } from '@/state/user/selector';
import { getCollectedUTXO, getFeeRate, getPendingUTXOs } from '@/services/bitcoin';
import { comingAmountBuilder, currentAssetsBuilder } from '@/utils/utxo';
import { useWeb3React } from '@web3-react/core';
import * as TC_SDK from 'trustless-computer-sdk';
import { IMempoolFeeRate } from '@/interfaces/mempool';
import logger from '@/services/logger';

export interface IAssetsContext {
  btcBalance: string;
  tcBalance: string;
  currentAssets: ICollectedUTXOResp | undefined;
  assets: ICollectedUTXOResp | undefined;
  feeRate: IMempoolFeeRate;
  comingAmount: number;
  getAvailableAssetsCreateTx: () => Promise<ICollectedUTXOResp | undefined>;
}

const initialValue: IAssetsContext = {
  btcBalance: '0',
  tcBalance: '0',
  currentAssets: undefined,
  assets: undefined,
  feeRate: {
    fastestFee: 25,
    halfHourFee: 20,
    hourFee: 15,
    economyFee: 10,
    minimumFee: 5,
  },
  comingAmount: 0,
  getAvailableAssetsCreateTx: () => new Promise<ICollectedUTXOResp | undefined>(() => null),
};

export const AssetsContext = React.createContext<IAssetsContext>(initialValue);

export const AssetsProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const user = useAppSelector(getUserSelector);
  const currentAddress = React.useMemo(() => {
    return user?.walletAddressBtcTaproot || '';
  }, [user?.walletAddressBtcTaproot]);
  const { provider, account: tcAddress } = useWeb3React();
  const [assets, setAssets] = useState<ICollectedUTXOResp | undefined>();
  const [currentAssets, setCurrentAssets] = useState<ICollectedUTXOResp | undefined>();
  const [tcBalance, setTCBalance] = useState('0');
  const [feeRate, setFeeRate] = useState<IMempoolFeeRate>({ ...initialValue.feeRate });
  const [comingAmount, setComingAmount] = useState<number>(0);

  const fetchAssets = useCallback(async (): Promise<ICollectedUTXOResp | undefined> => {
    if (!currentAddress || !tcAddress) return undefined;
    try {
      const res = await getCollectedUTXO(currentAddress, tcAddress);
      setAssets(res);
      return res;
    } catch (err: unknown) {
      logger.error(err);
    }
    return undefined;
  }, [setAssets, currentAddress, tcAddress]);

  const fetchData = useCallback(async () => {
    const [assets, pendingUTXOs] = await Promise.all([await fetchAssets(), await getPendingUTXOs(currentAddress)]);
    if (assets) {
      const assetData = currentAssetsBuilder({
        current: assets,
        pending: pendingUTXOs,
      });
      setCurrentAssets(assetData);
    }

    const comingAmountData = comingAmountBuilder(currentAddress, pendingUTXOs);
    setComingAmount(comingAmountData);
  }, [currentAddress, fetchAssets, setCurrentAssets, setComingAmount]);

  const fetchFeeRate = useCallback(async () => {
    try {
      const res = await getFeeRate();
      setFeeRate(res);
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [setFeeRate]);

  const btcBalance = useMemo(() => {
    if (currentAddress) {
      const balance = TC_SDK.getBTCBalance({
        utxos: currentAssets?.txrefs || [],
        inscriptions: currentAssets?.inscriptions_by_outputs || {},
      });
      return balance.toString();
    }
    return '0';
  }, [currentAddress, currentAssets]);

  const fetchTCBalance = useCallback(async () => {
    if (user?.walletAddress && provider) {
      const balance = await provider.getBalance(user.walletAddress);
      setTCBalance(balance.toString());
    }
  }, [provider, user, setTCBalance]);

  const getAvailableAssetsCreateTx = useCallback(async () => {
    const [assets, pendingUTXOs] = await Promise.all([await fetchAssets(), await getPendingUTXOs(currentAddress)]);
    if (assets) {
      const res = currentAssetsBuilder({
        current: assets,
        pending: pendingUTXOs,
      });
      setCurrentAssets(res);
    }

    return undefined;
  }, [currentAddress, setCurrentAssets, fetchAssets]);

  const fetchAssetsData = useCallback(() => {
    try {
      fetchFeeRate();
    } catch (err: unknown) {
      logger.error(err);
    }

    try {
      fetchTCBalance();
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [fetchFeeRate, fetchTCBalance]);

  useEffect(() => {
    if (currentAddress) {
      fetchData();
    }
  }, [user, provider, currentAddress, tcAddress, fetchData]);

  useEffect(() => {
    fetchAssetsData();

    const intervalID = setInterval(() => {
      fetchAssetsData();
    }, 60000); // 1min

    return () => {
      clearInterval(intervalID);
    };
  }, [user, provider, currentAddress, fetchAssetsData]);

  const contextValues = useMemo((): IAssetsContext => {
    return {
      btcBalance,
      currentAssets,
      assets,
      feeRate,
      comingAmount,
      tcBalance,
      getAvailableAssetsCreateTx,
    };
  }, [
    tcBalance,
    btcBalance,
    currentAssets,
    assets,
    feeRate,
    comingAmount,
    getAvailableAssetsCreateTx,
  ]);

  return <AssetsContext.Provider value={contextValues}>{children}</AssetsContext.Provider>;
};
