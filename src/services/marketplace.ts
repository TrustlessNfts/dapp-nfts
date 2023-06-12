import queryString from 'query-string';
import { apiClient } from '.';
import { camelCaseKeys } from '@/utils';
import {
  TraitStats,
  ICollection,
  IGetCollectionAttributesParams,
  ICollectionActivity,
  IGetCollectionActivityListParams,
  IGetCollectionListParams,
  IGetCollectionNFTListParams,
  IToken,
} from '@/interfaces/api/marketplace';

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
): Promise<Array<IToken>> => {
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
