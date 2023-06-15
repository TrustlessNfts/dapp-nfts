import { Connector } from '@web3-react/types';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { Connection, useGetConnection } from '@/connection';
import { updateSelectedWallet } from '@/state/user/reducer';
import logger from '@/services/logger';

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly();
    } else {
      await connector.activate();
    }
  } catch (error) {
    logger.debug(`web3-react eager connection error: ${error}`);
  }
}

export default function useEagerlyConnect() {
  const dispatch = useAppDispatch();

  const selectedWallet = useAppSelector(state => state.user.selectedWallet);
  const getConnection = useGetConnection();

  let selectedConnection: Connection | undefined;
  if (selectedWallet) {
    try {
      selectedConnection = getConnection(selectedWallet);
    } catch {
      dispatch(updateSelectedWallet({ wallet: undefined }));
    }
  }

  useEffect(() => {
    if (selectedConnection) {
      connect(selectedConnection.connector);
    }
  }, [
    selectedConnection
  ]);
}
