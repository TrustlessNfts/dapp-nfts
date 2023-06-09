/* eslint-disable @typescript-eslint/no-non-null-assertion */

// App configs
export const APP_ENV: string = process.env.NEXT_PUBLIC_APP_ENV!;
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;
export const TC_NETWORK_RPC: string = process.env.NEXT_PUBLIC_TC_NETWORK_RPC!;
export const CDN_URL: string = process.env.NEXT_PUBLIC_CDN_URL!;
export const API_FAUCET: string = process.env.NEXT_PUBLIC_API_FAUCET!;

// Contract configs
export const ARTIFACT_CONTRACT: string = process.env.NEXT_PUBLIC_ARTIFACT_CONTRACT!;
export const BNS_CONTRACT: string = process.env.NEXT_PUBLIC_BNS_CONTRACT!;
export const BFS_ADDRESS: string = process.env.NEXT_PUBLIC_BFS_CONTRACT!;

export const TC_WEB_URL: string = process.env.NEXT_PUBLIC_TC_WEB_URL!;
export const TRANSFER_TX_SIZE = 1000!;
export const TC_MARKETPLACE_CONTRACT =
  process.env.NEXT_PUBLIC_TC_MARKETPLACE_CONTRACT!;
export const BTC_NETWORK =
  process.env.NEXT_PUBLIC_BTC_NETWORK!;
export const TC_BRIDGE_URL = 'https://trustlessbridge.io';
export const TC_DAPP_STORE = 'https://trustless.computer';
export const TC_GAS_STATION = 'https://tcgasstation.com';

/* eslint-enable @typescript-eslint/no-non-null-assertion */
