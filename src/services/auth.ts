/* eslint-disable */
import { API_URL } from '@/configs';
import { swrFetcher } from '@/utils/swr';
import {
  IGenerativeNonceMessagePayload,
  IVerifyNonceMessagePayload,
} from '@/interfaces/api/auth';

const API_PATH = API_URL + '/auth';

export const generateNonceMessage = (payload: IGenerativeNonceMessagePayload): Promise<string> =>
  swrFetcher(`${API_PATH}/nonce`, {
    method: 'POST',
    data: payload,
    error: 'Failed to generate nonce message',
  });

export const verifyNonceMessage = (payload: IVerifyNonceMessagePayload): Promise<any> => {
  return swrFetcher(`${API_PATH}/nonce/verify`, {
    method: 'POST',
    data: payload,
    error: 'Failed to verify nonce message',
  });
};
