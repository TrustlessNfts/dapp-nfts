import { APP_ENV } from '@/configs';
import { AppEnv } from '@/enums/configs';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';

export const isProduction = (): boolean => {
  return APP_ENV === AppEnv.PRODUCTION;
};

export const isDevelop = (): boolean => {
  return APP_ENV === AppEnv.DEVELOP;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const onClickCopy = (address: string) => {
  copy(address);
  toast.success('Copied');
};
