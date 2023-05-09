import { APP_ENV } from '@/configs';
import { ApplicationEnvironment } from '@/enums/configs';

export const isProduction = (): boolean => {
  return APP_ENV === ApplicationEnvironment.PRODUCTION;
};

export const isDevelop = (): boolean => {
  return APP_ENV === ApplicationEnvironment.DEVELOP;
};

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));