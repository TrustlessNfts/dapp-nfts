import queryString from 'query-string';
import { apiClient } from '.';
import { camelCaseKeys } from '@/utils';
import { ICollection, IGetCollectionListParams } from '@/interfaces/api/marketplace';

const API_PATH = '/marketplace';

export const getCollectionList = async (params: IGetCollectionListParams): Promise<Array<ICollection>> => {
  const qs = queryString.stringify(params);
  const res = await apiClient.get(`${API_PATH}/collections?${qs}`);
  return Object(camelCaseKeys(res));
}
