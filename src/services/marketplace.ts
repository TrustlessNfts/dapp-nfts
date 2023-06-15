import {
  ICollection,
  ICollectionActivity,
  ICollectionChartItem,
  IGetCollectionActivityListParams,
  IGetCollectionAttributesParams,
  IGetCollectionChartParams,
  IGetCollectionListParams,
  IGetCollectionNFTListParams,
  IGetCollectionNFTListResponse,
  IGetOwnersAnalyticsResponse,
  IGetOwnersAnalyticsParams,
  TraitStats,
} from '@/interfaces/api/marketplace';
import { camelCaseKeys } from '@/utils';
import queryString from 'query-string';

import { apiClient } from '.';

const API_PATH = '/marketplace';

export const getCollectionList = async (
  params: IGetCollectionListParams,
): Promise<Array<ICollection>> => {
  const qs = queryString.stringify(params);
  const res = await apiClient.get(`${API_PATH}/collections?${qs}`);
  return Object(camelCaseKeys(res));
};

export const getCollectionDetail = async (
  contractAddress: string,
): Promise<ICollection> => {
  const res = await apiClient.get(`${API_PATH}/collections/${contractAddress}`);
  return Object(camelCaseKeys(res));
};

export const getCollectionNFTList = async (
  params: IGetCollectionNFTListParams,
): Promise<IGetCollectionNFTListResponse> => {
  const { contract_address, ...rest } = params;
  const qs = queryString.stringify(rest);
  const res = await apiClient.get(
    `${API_PATH}/collections/${contract_address}/nfts?${qs}`,
  );
  return Object(camelCaseKeys(res));
};

export const getCollectionActivityList = async (
  params: IGetCollectionActivityListParams,
): Promise<Array<ICollectionActivity>> => {
  const { contract_address, ...rest } = params;
  const qs = queryString.stringify(rest);
  const res = await apiClient.get(
    `${API_PATH}/collections/${contract_address}/activities?${qs}`,
  );
  return Object(camelCaseKeys(res));
};

export const getCollectionAttributes = async (
  params: IGetCollectionAttributesParams,
): Promise<Array<TraitStats>> => {
  const { contract_address, ...rest } = params;
  const qs = queryString.stringify(rest);
  const res = await apiClient.get(
    `${API_PATH}/collections/${contract_address}/attributes?${qs}`,
  );
  return Object(camelCaseKeys(res));
};

export const getCollectionChart = async (
  params: IGetCollectionChartParams,
): Promise<Array<ICollectionChartItem>> => {
  const { contract_address, ...rest } = params;
  const qs = queryString.stringify(rest);
  const res = await apiClient.get(
    `${API_PATH}/collections/${contract_address}/chart?${qs}`,
  );
  return Object(camelCaseKeys(res));
};

export const getOwnersAnalytics = async (
  // contractAddress: string,
  params: IGetOwnersAnalyticsParams,
): Promise<IGetOwnersAnalyticsResponse> => {
  const { contract_address, ...rest } = params;
  const qs = queryString.stringify(rest);
  const res = await apiClient.get(
    `${API_PATH}/collections/${contract_address}/nft-owners?${qs}`,
  );
  return Object(camelCaseKeys(res));
};
