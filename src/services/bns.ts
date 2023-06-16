import { IGetWalletBNSInfoResponse } from '@/interfaces/api/bns';
import { apiClient } from '.';
import { camelCaseKeys } from '@/utils';
import logger from './logger';

const API_PATH = '/bns-service';

export const getWalletBNSInfo = async ({
  walletAddress,
}: {
  walletAddress: string;
}): Promise<IGetWalletBNSInfoResponse | null> => {
  try {
    const res = await apiClient.get<
      {
        walletAddress: string;
      },
      IGetWalletBNSInfoResponse[]
    >(`${API_PATH}/names?resolver=${walletAddress}`);
    return Object(camelCaseKeys(res[0]));
  } catch (err: unknown) {
    logger.error('Failed to get wallet bns info');
    return null;
  }
};
