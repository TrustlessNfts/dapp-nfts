import { API_URL } from '@/configs';
import { IPagingParams } from '@/interfaces/api/query';
import queryString from 'query-string';
import { apiClient } from '..';
import { camelCaseKeys } from '@/utils';

const API_PATH = '/token-explorer';

export const getTokens = async (params: IPagingParams): Promise<unknown> => {
  const qs = '?' + queryString.stringify(params);
  const res = await apiClient.get(`${API_URL}${API_PATH}/tokens${qs}`);
  return Object(camelCaseKeys(res));
};

export const getTokensByWallet = async (
  params: {
    key: string;
  } & IPagingParams,
): Promise<unknown> => {
  const qs = '?' + queryString.stringify(params);
  const res = await apiClient.get(`${API_URL}${API_PATH}/tokens${qs}`);
  return Object(camelCaseKeys(res));
};
